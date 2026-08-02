import type { SupabaseClient } from "@supabase/supabase-js";

export type DiaryVisibility =
	| "public"
	| "private_request"
	| "friends"
	| "selected_friends";

export type FriendOption = {
	id: string;
	display_name: string;
	avatar_url: string | null;
};

export type DiaryAccessRequest = {
	id: string;
	owner_id: string;
	requester_id: string;
	status: "pending" | "approved" | "rejected";
	created_at: string;
	updated_at: string | null;
	requester?: FriendOption | null;
};

export async function getFriendOptions(
	supabase: SupabaseClient,
	userId: string,
): Promise<FriendOption[]> {
	const { data: friendships, error } = await supabase
		.from("friendships")
		.select("friend_id")
		.eq("user_id", userId);

	if (error) {
		console.error("Failed to load friends:", error.message);
		return [];
	}

	const friendIds =
		friendships
			?.map((friendship) => friendship.friend_id as string)
			.filter(Boolean) ?? [];

	if (friendIds.length === 0) return [];

	const { data: profiles, error: profilesError } = await supabase
		.from("profiles")
		.select("id, display_name, avatar_url")
		.in("id", friendIds);

	if (profilesError) {
		console.error("Failed to load friend profiles:", profilesError.message);
		return [];
	}

	return (profiles ?? []).map((profile) => ({
		id: profile.id as string,
		display_name: (profile.display_name as string | null) ?? "User",
		avatar_url: (profile.avatar_url as string | null) ?? null,
	}));
}

export async function getAllowedFriendIds(
	supabase: SupabaseClient,
	userId: string,
): Promise<string[]> {
	const { data, error } = await supabase
		.from("diary_allowed_friends")
		.select("friend_id")
		.eq("owner_id", userId);

	if (error) {
		console.error("Failed to load allowed diary friends:", error.message);
		return [];
	}

	return data?.map((row) => row.friend_id as string).filter(Boolean) ?? [];
}

export async function saveAllowedFriends(
	supabase: SupabaseClient,
	userId: string,
	friendIds: string[],
): Promise<void> {
	const { error: deleteError } = await supabase
		.from("diary_allowed_friends")
		.delete()
		.eq("owner_id", userId);

	if (deleteError) throw deleteError;

	if (friendIds.length === 0) return;

	const rows = friendIds.map((friendId) => ({
		owner_id: userId,
		friend_id: friendId,
	}));

	const { error: insertError } = await supabase
		.from("diary_allowed_friends")
		.insert(rows);

	if (insertError) throw insertError;
}

export async function getPendingDiaryRequests(
	supabase: SupabaseClient,
	userId: string,
): Promise<DiaryAccessRequest[]> {
	const { data: requests, error } = await supabase
		.from("diary_access_requests")
		.select("id, owner_id, requester_id, status, created_at, updated_at")
		.eq("owner_id", userId)
		.eq("status", "pending")
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Failed to load diary requests:", error.message);
		return [];
	}

	const requesterIds =
		requests?.map((request) => request.requester_id as string) ?? [];

	if (requesterIds.length === 0) {
		return (requests ?? []) as DiaryAccessRequest[];
	}

	const { data: profiles } = await supabase
		.from("profiles")
		.select("id, display_name, avatar_url")
		.in("id", requesterIds);

	const profileMap = new Map(
		(profiles ?? []).map((profile) => [
			profile.id as string,
			{
				id: profile.id as string,
				display_name: (profile.display_name as string | null) ?? "User",
				avatar_url: (profile.avatar_url as string | null) ?? null,
			},
		]),
	);

	return ((requests ?? []) as DiaryAccessRequest[]).map((request) => ({
		...request,
		requester: profileMap.get(request.requester_id) ?? null,
	}));
}

export async function respondToDiaryRequest(
	supabase: SupabaseClient,
	requestId: string,
	status: "approved" | "rejected",
): Promise<void> {
	const { error } = await supabase
		.from("diary_access_requests")
		.update({
			status,
			updated_at: new Date().toISOString(),
		})
		.eq("id", requestId);

	if (error) throw error;
}

export async function requestDiaryAccess(
	supabase: SupabaseClient,
	ownerId: string,
): Promise<void> {
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("You need to be logged in to request access.");
	}

	const { error } = await supabase.from("diary_access_requests").upsert(
		{
			owner_id: ownerId,
			requester_id: user.id,
			status: "pending",
			updated_at: new Date().toISOString(),
		},
		{
			onConflict: "owner_id,requester_id",
		},
	);

	if (error) throw error;
}
