"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Clock, Lock, UserPlus, UserRound, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type RequestStatus = "pending" | "accepted" | "declined" | "cancelled";
type NotificationKind = "friend_request" | "diary_access";

type ProfileRow = {
	id: string;
	display_name: string | null;
	avatar_url: string | null;
};

type FriendRequestRow = {
	id: number;
	requester_id: string;
	receiver_id: string;
	status: RequestStatus;
	created_at: string;
	updated_at: string;
};

type DiaryAccessRequestRow = {
	id: number;
	owner_id: string;
	requester_id: string;
	status: RequestStatus;
	created_at: string;
	updated_at: string;
};

type NotificationRow = {
	id: number;
	kind: NotificationKind;
	requesterId: string;
	status: RequestStatus;
	createdAt: string;
	updatedAt: string;
	requesterProfile: ProfileRow | null;
};

function getInitials(name: string) {
	return name.trim().slice(0, 1).toUpperCase() || "U";
}

function formatDate(date: string) {
	return new Intl.DateTimeFormat("en", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(new Date(date));
}

export default function NotificationsPage() {
	const supabase = useMemo(() => createClient(), []);

	const [notifications, setNotifications] = useState<NotificationRow[]>([]);
	const [loading, setLoading] = useState(true);
	const [updatingKey, setUpdatingKey] = useState<string | null>(null);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);

	const loadNotifications = useCallback(async () => {
		setLoading(true);

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			setCurrentUserId(null);
			setNotifications([]);
			setLoading(false);
			return;
		}

		setCurrentUserId(user.id);

		const { data: friendData } = await supabase
			.from("friend_requests")
			.select(
				"id, requester_id, receiver_id, status, created_at, updated_at",
			)
			.eq("receiver_id", user.id)
			.in("status", ["pending", "accepted", "declined"])
			.order("created_at", { ascending: false });

		const { data: diaryData } = await supabase
			.from("diary_access_requests")
			.select(
				"id, owner_id, requester_id, status, created_at, updated_at",
			)
			.eq("owner_id", user.id)
			.in("status", ["pending", "accepted", "declined"])
			.order("created_at", { ascending: false });

		const friendRequests = (friendData ?? []) as FriendRequestRow[];
		const diaryRequests = (diaryData ?? []) as DiaryAccessRequestRow[];

		const requesterIds = Array.from(
			new Set([
				...friendRequests.map((request) => request.requester_id),
				...diaryRequests.map((request) => request.requester_id),
			]),
		);

		let profileMap = new Map<string, ProfileRow>();

		if (requesterIds.length > 0) {
			const { data: profileData } = await supabase
				.from("profiles")
				.select("id, display_name, avatar_url")
				.in("id", requesterIds);

			const profiles = (profileData ?? []) as ProfileRow[];

			profileMap = new Map<string, ProfileRow>(
				profiles.map((profile) => [profile.id, profile]),
			);
		}

		const merged: NotificationRow[] = [
			...friendRequests.map((request) => ({
				id: request.id,
				kind: "friend_request" as const,
				requesterId: request.requester_id,
				status: request.status,
				createdAt: request.created_at,
				updatedAt: request.updated_at,
				requesterProfile: profileMap.get(request.requester_id) ?? null,
			})),
			...diaryRequests.map((request) => ({
				id: request.id,
				kind: "diary_access" as const,
				requesterId: request.requester_id,
				status: request.status,
				createdAt: request.created_at,
				updatedAt: request.updated_at,
				requesterProfile: profileMap.get(request.requester_id) ?? null,
			})),
		].sort(
			(a, b) =>
				new Date(b.createdAt).getTime() -
				new Date(a.createdAt).getTime(),
		);

		setNotifications(merged);
		setLoading(false);
	}, [supabase]);

	useEffect(() => {
		loadNotifications();
	}, [loadNotifications]);

	async function updateDiaryRequestStatus(
		requestId: number,
		status: "accepted" | "declined",
	) {
		const key = `diary_access-${requestId}`;

		try {
			setUpdatingKey(key);

			const { error } = await supabase
				.from("diary_access_requests")
				.update({
					status,
					updated_at: new Date().toISOString(),
				})
				.eq("id", requestId);

			if (error) {
				alert(error.message);
				return;
			}

			await loadNotifications();
		} finally {
			setUpdatingKey(null);
		}
	}

	async function updateFriendRequestStatus(
		requestId: number,
		requesterId: string,
		status: "accepted" | "declined",
	) {
		if (!currentUserId) return;

		const key = `friend_request-${requestId}`;

		try {
			setUpdatingKey(key);

			const { error: updateError } = await supabase
				.from("friend_requests")
				.update({
					status,
					updated_at: new Date().toISOString(),
				})
				.eq("id", requestId)
				.eq("receiver_id", currentUserId);

			if (updateError) {
				alert(updateError.message);
				return;
			}

			if (status === "accepted") {
				const { error: friendshipError } = await supabase
					.from("friendships")
					.upsert(
						[
							{
								user_id: currentUserId,
								friend_id: requesterId,
							},
							{
								user_id: requesterId,
								friend_id: currentUserId,
							},
						],
						{
							onConflict: "user_id,friend_id",
						},
					);

				if (friendshipError) {
					alert(friendshipError.message);
					return;
				}
			}

			await loadNotifications();
		} finally {
			setUpdatingKey(null);
		}
	}

	const pendingNotifications = notifications.filter(
		(notification) => notification.status === "pending",
	);

	const handledNotifications = notifications.filter(
		(notification) => notification.status !== "pending",
	);

	if (loading) {
		return (
			<main className="min-h-screen bg-black px-6 py-12 text-white md:px-24">
				<p className="text-muted">Loading notifications...</p>
			</main>
		);
	}

	if (!currentUserId) {
		return (
			<main className="min-h-screen bg-black px-6 py-12 text-white md:px-24">
				<h1 className="text-4xl font-black">Notifications</h1>

				<p className="mt-4 text-muted">
					You need to sign in to view your notifications.
				</p>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-black px-6 py-12 text-white md:px-24">
			<div className="mb-10">
				<h1 className="text-4xl font-black">Notifications</h1>

				<p className="mt-2 text-muted">
					Friend requests and diary access requests.
				</p>
			</div>

			<section>
				<div className="mb-5 flex items-center justify-between">
					<h2 className="text-xl font-bold">Pending requests</h2>

					<span className="rounded-full bg-white/[0.05] px-3 py-1 text-sm text-muted">
						{pendingNotifications.length} pending
					</span>
				</div>

				{pendingNotifications.length === 0 ? (
					<div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-muted">
						No pending requests.
					</div>
				) : (
					<div className="space-y-4">
						{pendingNotifications.map((notification) => {
							const profile = notification.requesterProfile;
							const displayName =
								profile?.display_name ?? "Unknown user";

							const updating =
								updatingKey ===
								`${notification.kind}-${notification.id}`;

							return (
								<div
									key={`${notification.kind}-${notification.id}`}
									className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-[#111114] p-5 md:flex-row md:items-center md:justify-between"
								>
									<div className="flex items-center gap-4">
										<div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-600">
											{profile?.avatar_url ? (
												<img
													src={profile.avatar_url}
													alt={displayName}
													className="h-full w-full object-cover"
												/>
											) : (
												<span className="text-xl font-bold text-white">
													{getInitials(displayName)}
												</span>
											)}
										</div>

										<div>
											<p className="font-bold text-white">
												{displayName}
											</p>

											<p className="mt-1 flex items-center gap-2 text-sm text-muted">
												{notification.kind ===
												"friend_request" ? (
													<UserPlus className="h-4 w-4" />
												) : (
													<Lock className="h-4 w-4" />
												)}

												{notification.kind ===
												"friend_request"
													? "Sent you a friend request"
													: "Wants access to your private diary"}
											</p>

											<p className="mt-1 flex items-center gap-2 text-xs text-muted">
												<Clock className="h-3.5 w-3.5" />
												Requested{" "}
												{formatDate(
													notification.createdAt,
												)}
											</p>
										</div>
									</div>

									<div className="flex gap-3">
										<Link
											href={`/users/${notification.requesterId}`}
											className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
										>
											<UserRound className="h-4 w-4" />
											View profile
										</Link>

										<button
											type="button"
											disabled={updating}
											onClick={() => {
												if (
													notification.kind ===
													"friend_request"
												) {
													updateFriendRequestStatus(
														notification.id,
														notification.requesterId,
														"declined",
													);
												} else {
													updateDiaryRequestStatus(
														notification.id,
														"declined",
													);
												}
											}}
											className="flex items-center justify-center gap-2 rounded-full border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
										>
											<X className="h-4 w-4" />
											Decline
										</button>

										<button
											type="button"
											disabled={updating}
											onClick={() => {
												if (
													notification.kind ===
													"friend_request"
												) {
													updateFriendRequestStatus(
														notification.id,
														notification.requesterId,
														"accepted",
													);
												} else {
													updateDiaryRequestStatus(
														notification.id,
														"accepted",
													);
												}
											}}
											className="flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50"
										>
											<Check className="h-4 w-4" />
											Accept
										</button>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</section>

			{handledNotifications.length > 0 && (
				<section className="mt-12">
					<h2 className="mb-5 text-xl font-bold">Handled requests</h2>

					<div className="space-y-3">
						{handledNotifications.map((notification) => {
							const profile = notification.requesterProfile;
							const displayName =
								profile?.display_name ?? "Unknown user";

							return (
								<div
									key={`${notification.kind}-${notification.id}`}
									className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4"
								>
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-600">
											{profile?.avatar_url ? (
												<img
													src={profile.avatar_url}
													alt={displayName}
													className="h-full w-full object-cover"
												/>
											) : (
												<span className="font-bold text-white">
													{getInitials(displayName)}
												</span>
											)}
										</div>

										<div>
											<p className="text-sm font-semibold">
												{displayName}
											</p>

											<p className="text-xs text-muted">
												{notification.kind ===
												"friend_request"
													? "Friend request"
													: "Diary access request"}{" "}
												·{" "}
												{formatDate(
													notification.updatedAt,
												)}
											</p>
										</div>
									</div>

									<span
										className={`rounded-full px-3 py-1 text-xs font-bold ${
											notification.status === "accepted"
												? "bg-green-500/15 text-green-300"
												: "bg-red-500/15 text-red-300"
										}`}
									>
										{notification.status}
									</span>
								</div>
							);
						})}
					</div>
				</section>
			)}
		</main>
	);
}
