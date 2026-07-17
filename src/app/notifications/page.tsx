"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
	fetchPendingNotifications,
	formatNotificationTime,
	respondToNotification,
	type PendingNotification,
} from "@/utils/notifications";

export default function NotificationsPage() {
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
		} catch (error) {
			console.error("Failed to load notifications page:", error);
			setNotifications([]);
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
		<main className="min-h-screen bg-black px-6 py-10 text-white md:px-24">
			<div className="mb-12">
				<h1 className="text-4xl font-black md:text-5xl">
					Notifications
				</h1>

				<p className="mt-3 text-muted">
					Friend requests and diary access requests.
				</p>
			</div>

			<section>
				<div className="mb-6 flex items-center justify-between gap-4">
					<h2 className="text-2xl font-bold">Pending requests</h2>

					<span className="rounded-full bg-white/[0.05] px-4 py-1.5 text-sm text-muted">
						{notifications.length} pending
					</span>
				</div>

				{loading ? (
					<div className="rounded-2xl border border-white/10 bg-white/[0.025] p-8 text-muted">
						Loading notifications...
					</div>
				) : notifications.length === 0 ? (
					<div className="rounded-2xl border border-white/10 bg-white/[0.025] p-8 text-muted">
						No pending requests.
					</div>
				) : (
					<div className="space-y-4">
						{notifications.map((notification) => {
							const busy = actingId === notification.id;

							return (
								<div
									key={notification.id}
									className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:flex-row md:items-center md:justify-between"
								>
									<div className="flex gap-4">
										<Link
											href={`/users/${notification.actorId}`}
											className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-elevated"
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
												<Bell className="h-5 w-5 text-accent" />
											)}
										</Link>

										<div>
											<p className="font-bold text-white">
												{notification.title}
											</p>

											<p className="mt-1 text-sm text-muted">
												{notification.description}
											</p>

											<p className="mt-2 text-xs text-muted">
												{formatNotificationTime(
													notification.createdAt,
												)}
											</p>
										</div>
									</div>

									<div className="flex gap-3 md:shrink-0">
										<button
											type="button"
											disabled={busy}
											onClick={() =>
												handleRespond(
													notification,
													"accepted",
												)
											}
											className="flex h-10 items-center justify-center rounded-full bg-accent px-5 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-60"
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
											className="flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] px-5 text-sm font-bold text-white transition hover:bg-white/[0.1] disabled:opacity-60"
										>
											Decline
										</button>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</section>
		</main>
	);
}
