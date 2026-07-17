import type { SupabaseClient } from "@supabase/supabase-js";

export type NotificationKind = "friend_request" | "diary_access_request";
export type NotificationAction = "accepted" | "declined";

export type PendingNotification = {
	id: string;
	kind: NotificationKind;
	requestId: number | string;
	actorId: string;
	actorName: string;
	actorAvatar: string | null;
	title: string;
	description: string;
	createdAt: string;
};

type FriendRequestRow = {
	id: number | string;
	sender_id: string;
	receiver_id: string;
	status: "pending" | "accepted" | "declined";
	created_at: string | null;
	updated_at: string | null;
};

type DiaryAccessRequestRow = {
	id: number | string;
	owner_id: string;
	requester_id: string;
	status: "pending" | "accepted" | "declined";
	created_at: string | null;
	updated_at: string | null;
};

type ProfileRow = {
	id: string;
	display_name: string | null;
	avatar_url: string | null;
};

function uniqueStrings(values: string[]) {
	return Array.from(new Set(values.filter(Boolean)));
}

async function getProfileMap(
	supabase: SupabaseClient,
	userIds: string[],
): Promise<Map<string, ProfileRow>> {
	const uniqueIds = uniqueStrings(userIds);

	if (uniqueIds.length === 0) {
		return new Map();
	}

	const { data, error } = await supabase
		.from("profiles")
		.select("id, display_name, avatar_url")
		.in("id", uniqueIds);

	if (error) {
		console.error("Failed to load notification profiles:", error.message);
		return new Map();
	}

	const rows = (data ?? []) as ProfileRow[];

	return new Map(rows.map((profile) => [profile.id, profile]));
}

function getActorName(profile: ProfileRow | undefined) {
	return profile?.display_name || "Someone";
}

function getDate(row: {
	updated_at: string | null;
	created_at: string | null;
}) {
	return row.updated_at ?? row.created_at ?? new Date().toISOString();
}

export function formatNotificationTime(dateString: string) {
	const date = new Date(dateString);
	const diffMs = Date.now() - date.getTime();

	const minutes = Math.floor(diffMs / 60000);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (minutes < 1) return "Just now";
	if (minutes < 60) return `${minutes}m ago`;
	if (hours < 24) return `${hours}h ago`;
	return `${days}d ago`;
}

export async function countPendingNotifications(supabase: SupabaseClient) {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return 0;

	const [friendRequests, diaryRequests] = await Promise.all([
		supabase
			.from("friend_requests")
			.select("id", { count: "exact", head: true })
			.eq("receiver_id", user.id)
			.eq("status", "pending"),

		supabase
			.from("diary_access_requests")
			.select("id", { count: "exact", head: true })
			.eq("owner_id", user.id)
			.eq("status", "pending"),
	]);

	if (friendRequests.error) {
		console.error(
			"Failed to count friend requests:",
			friendRequests.error.message,
		);
	}

	if (diaryRequests.error) {
		console.error(
			"Failed to count diary access requests:",
			diaryRequests.error.message,
		);
	}

	return (friendRequests.count ?? 0) + (diaryRequests.count ?? 0);
}

export async function fetchPendingNotifications(
	supabase: SupabaseClient,
): Promise<PendingNotification[]> {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return [];

	const [friendResult, diaryResult] = await Promise.all([
		supabase
			.from("friend_requests")
			.select(
				"id, sender_id, receiver_id, status, created_at, updated_at",
			)
			.eq("receiver_id", user.id)
			.eq("status", "pending")
			.order("created_at", { ascending: false }),

		supabase
			.from("diary_access_requests")
			.select(
				"id, owner_id, requester_id, status, created_at, updated_at",
			)
			.eq("owner_id", user.id)
			.eq("status", "pending")
			.order("created_at", { ascending: false }),
	]);

	if (friendResult.error) {
		console.error(
			"Failed to load friend notifications:",
			friendResult.error.message,
		);
	}

	if (diaryResult.error) {
		console.error(
			"Failed to load diary access notifications:",
			diaryResult.error.message,
		);
	}

	const friendRows = (friendResult.data ?? []) as FriendRequestRow[];
	const diaryRows = (diaryResult.data ?? []) as DiaryAccessRequestRow[];

	const actorIds = [
		...friendRows.map((row) => row.sender_id),
		...diaryRows.map((row) => row.requester_id),
	];

	const profileMap = await getProfileMap(supabase, actorIds);

	const friendNotifications: PendingNotification[] = friendRows.map((row) => {
		const actor = profileMap.get(row.sender_id);
		const actorName = getActorName(actor);

		return {
			id: `friend-${row.id}`,
			kind: "friend_request",
			requestId: row.id,
			actorId: row.sender_id,
			actorName,
			actorAvatar: actor?.avatar_url ?? null,
			title: `${actorName} sent you a friend request`,
			description: "Accept or decline this friend request.",
			createdAt: getDate(row),
		};
	});

	const diaryNotifications: PendingNotification[] = diaryRows.map((row) => {
		const actor = profileMap.get(row.requester_id);
		const actorName = getActorName(actor);

		return {
			id: `diary-${row.id}`,
			kind: "diary_access_request",
			requestId: row.id,
			actorId: row.requester_id,
			actorName,
			actorAvatar: actor?.avatar_url ?? null,
			title: `${actorName} requested access to your diary`,
			description: "Accept or decline diary access.",
			createdAt: getDate(row),
		};
	});

	return [...friendNotifications, ...diaryNotifications].sort(
		(a, b) =>
			new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);
}

export async function respondToNotification(
	supabase: SupabaseClient,
	notification: PendingNotification,
	action: NotificationAction,
) {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("You need to log in first.");
	}

	if (notification.kind === "friend_request") {
		const { error: updateError } = await supabase
			.from("friend_requests")
			.update({
				status: action,
				updated_at: new Date().toISOString(),
			})
			.eq("id", notification.requestId)
			.eq("receiver_id", user.id)
			.eq("status", "pending");

		if (updateError) {
			throw new Error(updateError.message);
		}

		if (action === "accepted") {
			const { error: friendshipError } = await supabase
				.from("friendships")
				.upsert(
					[
						{
							user_id: user.id,
							friend_id: notification.actorId,
						},
						{
							user_id: notification.actorId,
							friend_id: user.id,
						},
					],
					{
						onConflict: "user_id,friend_id",
					},
				);

			if (friendshipError) {
				throw new Error(friendshipError.message);
			}
		}

		return;
	}

	const { error } = await supabase
		.from("diary_access_requests")
		.update({
			status: action,
			updated_at: new Date().toISOString(),
		})
		.eq("id", notification.requestId)
		.eq("owner_id", user.id)
		.eq("status", "pending");

	if (error) {
		throw new Error(error.message);
	}
}
