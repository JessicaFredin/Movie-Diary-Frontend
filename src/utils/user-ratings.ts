"use client";

import type { SupabaseClient } from "@supabase/supabase-js";

export type MediaType = "movie" | "tv";

export const USER_RATING_UPDATED_EVENT = "movie-diary-user-rating-updated";

export type UserRatingUpdatedEventDetail = {
	mediaId: number;
	mediaType: MediaType;
	rating: number | null;
};

type RatingArgs = {
	mediaId: number;
	mediaType: MediaType;
};

type SaveRatingArgs = RatingArgs & {
	rating: number;
};

function normalizeRating(rating: number): number {
	return Math.min(10, Math.max(0.5, Math.round(rating * 2) / 2));
}

export function notifyUserRatingUpdated(
	detail: UserRatingUpdatedEventDetail,
): void {
	if (typeof window === "undefined") return;

	window.dispatchEvent(
		new CustomEvent<UserRatingUpdatedEventDetail>(
			USER_RATING_UPDATED_EVENT,
			{
				detail,
			},
		),
	);
}

export async function saveUserRating(
	supabase: SupabaseClient,
	{ mediaId, mediaType, rating }: SaveRatingArgs,
): Promise<void> {
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError) {
		throw new Error(userError.message);
	}

	if (!user) {
		throw new Error("You need to log in first to rate this title.");
	}

	const finalRating = normalizeRating(rating);

	const { error } = await supabase.from("user_ratings").upsert(
		{
			user_id: user.id,
			media_id: String(mediaId),
			media_type: mediaType,
			rating: finalRating,
			updated_at: new Date().toISOString(),
		},
		{
			onConflict: "user_id,media_id,media_type",
		},
	);

	if (error) {
		throw new Error(error.message);
	}

	notifyUserRatingUpdated({
		mediaId,
		mediaType,
		rating: finalRating,
	});
}

export async function deleteUserRating(
	supabase: SupabaseClient,
	{ mediaId, mediaType }: RatingArgs,
): Promise<void> {
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError) {
		throw new Error(userError.message);
	}

	if (!user) return;

	const { error } = await supabase
		.from("user_ratings")
		.delete()
		.eq("user_id", user.id)
		.eq("media_id", String(mediaId))
		.eq("media_type", mediaType);

	if (error) {
		throw new Error(error.message);
	}

	notifyUserRatingUpdated({
		mediaId,
		mediaType,
		rating: null,
	});
}
