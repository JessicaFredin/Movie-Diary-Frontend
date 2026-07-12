"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Lock, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type RequestStatus = "pending" | "accepted" | "declined" | "cancelled";

type DiaryAccessRequest = {
	id: number;
	requester_id: string;
	status: RequestStatus;
	created_at: string;
};

type FriendRequest = {
	id: number;
	requester_id: string;
	status: RequestStatus;
	created_at: string;
};

type ProfileRow = {
	id: string;
	display_name: string | null;
	avatar_url: string | null;
};

type NotificationItem = {
	id: number;
	kind: "diary_access" | "friend_request";
	requesterId: string;
	displayName: string;
	avatarUrl: string | null;
	createdAt: string;
};

type Props = {
	onClose: () => void;
	onCountChange?: (count: number) => void;
};

function getInitials(name: string) {
	return name.trim().slice(0, 1).toUpperCase() || "U";
}

function formatRelativeTime(date: string) {
	const now = Date.now();
	const then = new Date(date).getTime();
	const diffMs = Math.max(0, now - then);

	const minutes = Math.floor(diffMs / 60000);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (minutes < 1) return "Just now";
	if (minutes < 60) return `${minutes}m ago`;
	if (hours < 24) return `${hours}h ago`;
	return `${days}d ago`;
}

export default function NotificationDropdown({
	onClose,
	onCountChange,
}: Props) {
	const supabase = useMemo(() => createClient(), []);

	const [items, setItems] = useState<NotificationItem[]>([]);
	const [loading, setLoading] = useState(true);

	const loadNotifications = useCallback(async () => {
		setLoading(true);

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			setItems([]);
			onCountChange?.(0);
			setLoading(false);
			return;
		}

		const { data: diaryData } = await supabase
			.from("diary_access_requests")
			.select("id, requester_id, status, created_at")
			.eq("owner_id", user.id)
			.eq("status", "pending")
			.order("created_at", { ascending: false })
			.limit(5);

		const { data: friendData } = await supabase
			.from("friend_requests")
			.select("id, requester_id, status, created_at")
			.eq("receiver_id", user.id)
			.eq("status", "pending")
			.order("created_at", { ascending: false })
			.limit(5);

		const diaryRequests = (diaryData ?? []) as DiaryAccessRequest[];
		const friendRequests = (friendData ?? []) as FriendRequest[];

		const totalPending = diaryRequests.length + friendRequests.length;
		onCountChange?.(totalPending);

		const requesterIds = Array.from(
			new Set([
				...diaryRequests.map((request) => request.requester_id),
				...friendRequests.map((request) => request.requester_id),
			]),
		);

		if (requesterIds.length === 0) {
			setItems([]);
			setLoading(false);
			return;
		}

		const { data: profilesData } = await supabase
			.from("profiles")
			.select("id, display_name, avatar_url")
			.in("id", requesterIds);

		const profiles = (profilesData ?? []) as ProfileRow[];

		const profileMap = new Map<string, ProfileRow>(
			profiles.map((profile) => [profile.id, profile]),
		);

		const notificationItems: NotificationItem[] = [
			...diaryRequests.map((request) => {
				const profile = profileMap.get(request.requester_id);

				return {
					id: request.id,
					kind: "diary_access" as const,
					requesterId: request.requester_id,
					displayName: profile?.display_name ?? "Unknown user",
					avatarUrl: profile?.avatar_url ?? null,
					createdAt: request.created_at,
				};
			}),
			...friendRequests.map((request) => {
				const profile = profileMap.get(request.requester_id);

				return {
					id: request.id,
					kind: "friend_request" as const,
					requesterId: request.requester_id,
					displayName: profile?.display_name ?? "Unknown user",
					avatarUrl: profile?.avatar_url ?? null,
					createdAt: request.created_at,
				};
			}),
		]
			.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() -
					new Date(a.createdAt).getTime(),
			)
			.slice(0, 5);

		setItems(notificationItems);
		setLoading(false);
	}, [supabase, onCountChange]);

	useEffect(() => {
		loadNotifications();
	}, [loadNotifications]);

	return (
		<div className="absolute right-0 mt-3 w-[380px] max-h-[500px] bg-surface-elevated border border-border rounded-2xl shadow-2xl overflow-hidden z-50">
			<div className="flex items-center justify-between px-4 py-3 border-b border-border">
				<h3 className="font-semibold">Notifications</h3>

				<button
					type="button"
					onClick={onClose}
					className="text-xs text-muted hover:text-foreground"
				>
					Close
				</button>
			</div>

			<div className="max-h-[420px] overflow-y-auto custom-scrollbar">
				{loading ? (
					<div className="px-4 py-6 text-sm text-muted">
						Loading notifications...
					</div>
				) : items.length === 0 ? (
					<div className="px-4 py-6 text-sm text-muted">
						No new notifications.
					</div>
				) : (
					items.map((item) => (
						<Link
							key={`${item.kind}-${item.id}`}
							href="/notifications"
							onClick={onClose}
							className="block px-4 py-3 border-b border-border bg-accent/5 hover:bg-surface-neutral transition"
						>
							<div className="flex items-start gap-3">
								<div className="w-9 h-9 rounded-full bg-surface-neutral flex items-center justify-center overflow-hidden">
									{item.avatarUrl ? (
										<img
											src={item.avatarUrl}
											alt={item.displayName}
											className="h-full w-full object-cover"
										/>
									) : (
										<span className="text-xs font-bold text-white">
											{getInitials(item.displayName)}
										</span>
									)}
								</div>

								<div className="flex-1 text-sm">
									<p>
										<span className="font-medium">
											{item.displayName}
										</span>{" "}
										<span className="text-muted">
											{item.kind === "friend_request"
												? "sent you a friend request"
												: "requested access to your private diary"}
										</span>
									</p>

									<p className="mt-1 flex items-center gap-1 text-xs text-muted">
										{item.kind === "friend_request" ? (
											<UserPlus className="h-3 w-3" />
										) : (
											<Lock className="h-3 w-3" />
										)}
										{formatRelativeTime(item.createdAt)}
									</p>
								</div>
							</div>
						</Link>
					))
				)}
			</div>

			<div className="px-4 py-3 border-t border-border text-center">
				<Link
					href="/notifications"
					onClick={onClose}
					className="text-sm text-accent hover:underline"
				>
					View all notifications
				</Link>
			</div>
		</div>
	);
}
