// "use client";

// import { Bell } from "lucide-react";

//  type NotificationType =
// 	| "friend_request"
// 	| "friend_accept"
// 	| "like"
// 	| "comment"
// 	| "diary_request";

//  interface Notification {
// 	id: number;
// 	type: NotificationType;
// 	user: string;
// 	message: string;
// 	time: string;
// 	unread: boolean;
// }

//  const mockNotifications: Notification[] = [
// 	{
// 		id: 1,
// 		type: "friend_request",
// 		user: "Emma Torres",
// 		message: "sent you a friend request",
// 		time: "2h ago",
// 		unread: true,
// 	},
// 	{
// 		id: 2,
// 		type: "like",
// 		user: "James Okoro",
// 		message: "liked your review of Dune: Part Two",
// 		time: "5h ago",
// 		unread: true,
// 	},
// 	{
// 		id: 3,
// 		type: "comment",
// 		user: "Mia Chen",
// 		message: "commented on your review",
// 		time: "1d ago",
// 		unread: false,
// 	},
// ];

// interface Props {
// 	onClose: () => void;
// }

// export default function NotificationDropdown({ onClose }: Props) {
// 	return (
// 		<div className="absolute right-0 mt-3 w-[380px] max-h-[500px] bg-surface-elevated border border-border rounded-2xl shadow-2xl overflow-hidden z-50">
// 			{/* Header */}
// 			<div className="flex items-center justify-between px-4 py-3 border-b border-border">
// 				<h3 className="font-semibold">Notifications</h3>
// 				<button
// 					onClick={onClose}
// 					className="text-xs text-muted hover:text-foreground"
// 				>
// 					Close
// 				</button>
// 			</div>

// 			{/* List */}
// 			<div className="max-h-[420px] overflow-y-auto custom-scrollbar">
// 				{mockNotifications.map((n) => (
// 					<div
// 						key={n.id}
// 						className={`px-4 py-3 border-b border-border hover:bg-surface-neutral transition ${
// 							n.unread ? "bg-accent/5" : ""
// 						}`}
// 					>
// 						<div className="flex items-start gap-3">
// 							<div className="w-9 h-9 rounded-full bg-surface-neutral flex items-center justify-center">
// 								<Bell size={16} className="text-accent" />
// 							</div>

// 							<div className="flex-1 text-sm">
// 								<p>
// 									<span className="font-medium">
// 										{n.user}
// 									</span>{" "}
// 									<span className="text-muted">
// 										{n.message}
// 									</span>
// 								</p>
// 								<p className="text-xs text-muted mt-1">
// 									{n.time}
// 								</p>
// 							</div>
// 						</div>
// 					</div>
// 				))}
// 			</div>

// 			{/* Footer */}
// 			<div className="px-4 py-3 border-t border-border text-center">
// 				<button className="text-sm text-accent hover:underline">
// 					View all notifications
// 				</button>
// 			</div>
// 		</div>
// 	);
// }

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bell, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type RequestStatus = "pending" | "accepted" | "declined";

type DiaryAccessRequest = {
	id: number;
	owner_id: string;
	requester_id: string;
	status: RequestStatus;
	created_at: string;
	updated_at: string;
};

type ProfileRow = {
	id: string;
	display_name: string | null;
	avatar_url: string | null;
};

type RequestWithProfile = DiaryAccessRequest & {
	requesterProfile: ProfileRow | null;
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

	const [requests, setRequests] = useState<RequestWithProfile[]>([]);
	const [loading, setLoading] = useState(true);

	const loadNotifications = useCallback(async () => {
		setLoading(true);

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			setRequests([]);
			onCountChange?.(0);
			setLoading(false);
			return;
		}

		const { data: requestData, error: requestError } = await supabase
			.from("diary_access_requests")
			.select(
				"id, owner_id, requester_id, status, created_at, updated_at",
			)
			.eq("owner_id", user.id)
			.eq("status", "pending")
			.order("created_at", { ascending: false })
			.limit(5);

		if (requestError) {
			console.error(
				"Failed to load notifications:",
				requestError.message,
			);
			setRequests([]);
			onCountChange?.(0);
			setLoading(false);
			return;
		}

		const typedRequests = (requestData ?? []) as DiaryAccessRequest[];
		onCountChange?.(typedRequests.length);

		const requesterIds = typedRequests.map(
			(request) => request.requester_id,
		);

		if (requesterIds.length === 0) {
			setRequests([]);
			setLoading(false);
			return;
		}

		const { data: profileData, error: profileError } = await supabase
			.from("profiles")
			.select("id, display_name, avatar_url")
			.in("id", requesterIds);

		if (profileError) {
			console.error(
				"Failed to load requester profiles:",
				profileError.message,
			);
		}

		const typedProfiles = (profileData ?? []) as ProfileRow[];

		const profileMap = new Map<string, ProfileRow>(
			typedProfiles.map((profile) => [profile.id, profile]),
		);

		const merged: RequestWithProfile[] = typedRequests.map((request) => ({
			...request,
			requesterProfile: profileMap.get(request.requester_id) ?? null,
		}));

		setRequests(merged);
		setLoading(false);
	}, [supabase, onCountChange]);

	useEffect(() => {
		loadNotifications();
	}, [loadNotifications]);

	return (
		<div className="absolute right-0 mt-3 w-[380px] max-h-[500px] bg-surface-elevated border border-border rounded-2xl shadow-2xl overflow-hidden z-50">
			{/* Header */}
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

			{/* List */}
			<div className="max-h-[420px] overflow-y-auto custom-scrollbar">
				{loading ? (
					<div className="px-4 py-6 text-sm text-muted">
						Loading notifications...
					</div>
				) : requests.length === 0 ? (
					<div className="px-4 py-6 text-sm text-muted">
						No new notifications.
					</div>
				) : (
					requests.map((request) => {
						const profile = request.requesterProfile;
						const displayName =
							profile?.display_name ?? "Unknown user";

						return (
							<Link
								key={request.id}
								href="/notifications"
								onClick={onClose}
								className="block px-4 py-3 border-b border-border bg-accent/5 hover:bg-surface-neutral transition"
							>
								<div className="flex items-start gap-3">
									<div className="w-9 h-9 rounded-full bg-surface-neutral flex items-center justify-center overflow-hidden">
										{profile?.avatar_url ? (
											<img
												src={profile.avatar_url}
												alt={displayName}
												className="h-full w-full object-cover"
											/>
										) : (
											<span className="text-xs font-bold text-white">
												{getInitials(displayName)}
											</span>
										)}
									</div>

									<div className="flex-1 text-sm">
										<p>
											<span className="font-medium">
												{displayName}
											</span>{" "}
											<span className="text-muted">
												requested access to your private
												diary
											</span>
										</p>

										<p className="mt-1 flex items-center gap-1 text-xs text-muted">
											<Lock className="h-3 w-3" />
											Diary request ·{" "}
											{formatRelativeTime(
												request.created_at,
											)}
										</p>
									</div>
								</div>
							</Link>
						);
					})
				)}
			</div>

			{/* Footer */}
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