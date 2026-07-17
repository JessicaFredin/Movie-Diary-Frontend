"use client";

import Link from "next/link";
import { Bell, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
	fetchPendingNotifications,
	formatNotificationTime,
	respondToNotification,
	type PendingNotification,
} from "@/utils/notifications";

type Props = {
	onClose: () => void;
	onCountChange?: (count: number) => void;
};

export default function MobileNotifications({ onClose, onCountChange }: Props) {
	const supabase = useMemo(() => createClient(), []);

	const [notifications, setNotifications] = useState<PendingNotification[]>(
		[],
	);
	const [loading, setLoading] = useState(true);
	const [actingId, setActingId] = useState<string | null>(null);

	async function loadNotifications() {
		setLoading(true);

		try {
			const items = await fetchPendingNotifications(supabase);
			setNotifications(items);
			onCountChange?.(items.length);
		} catch (error) {
			console.error("Failed to load mobile notifications:", error);
			setNotifications([]);
			onCountChange?.(0);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadNotifications();
	}, []);

	async function handleRespond(
		notification: PendingNotification,
		action: "accepted" | "declined",
	) {
		try {
			setActingId(notification.id);
			await respondToNotification(supabase, notification, action);
			await loadNotifications();
		} catch (error) {
			console.error(error);
			alert(
				error instanceof Error
					? error.message
					: "Something went wrong.",
			);
		} finally {
			setActingId(null);
		}
	}

	return (
		<div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm md:hidden">
			<div className="absolute left-0 right-0 top-0 max-h-[85vh] overflow-hidden rounded-b-3xl border-b border-border bg-surface-elevated shadow-2xl">
				<div className="flex items-center justify-between border-b border-border px-5 py-4">
					<h3 className="text-lg font-bold text-white">
						Notifications
					</h3>

					<button
						type="button"
						onClick={onClose}
						className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-white"
					>
						<X className="h-4 w-4" />
					</button>
				</div>

				<div className="max-h-[65vh] overflow-y-auto">
					{loading ? (
						<p className="px-5 py-8 text-sm text-muted">
							Loading notifications...
						</p>
					) : notifications.length === 0 ? (
						<p className="px-5 py-8 text-sm text-muted">
							No new notifications.
						</p>
					) : (
						notifications.map((notification) => {
							const busy = actingId === notification.id;

							return (
								<div
									key={notification.id}
									className="border-b border-border px-5 py-4"
								>
									<div className="flex gap-3">
										<Link
											href={`/users/${notification.actorId}`}
											onClick={onClose}
											className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-neutral"
										>
											{notification.actorAvatar ? (
												<img
													src={
														notification.actorAvatar
													}
													alt={notification.actorName}
													className="h-full w-full object-cover"
												/>
											) : (
												<Bell className="h-4 w-4 text-accent" />
											)}
										</Link>

										<div className="min-w-0 flex-1">
											<p className="text-sm leading-5 text-white">
												{notification.title}
											</p>

											<p className="mt-1 text-xs text-muted">
												{formatNotificationTime(
													notification.createdAt,
												)}
											</p>

											<div className="mt-3 flex gap-2">
												<button
													type="button"
													disabled={busy}
													onClick={() =>
														handleRespond(
															notification,
															"accepted",
														)
													}
													className="rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-white disabled:opacity-60"
												>
													Accept
												</button>

												<button
													type="button"
													disabled={busy}
													onClick={() =>
														handleRespond(
															notification,
															"declined",
														)
													}
													className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-xs font-bold text-white disabled:opacity-60"
												>
													Decline
												</button>
											</div>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>

				<div className="border-t border-border px-5 py-4 text-center">
					<Link
						href="/notifications"
						onClick={onClose}
						className="text-sm font-bold text-accent hover:underline"
					>
						View all notifications
					</Link>
				</div>
			</div>
		</div>
	);
}
