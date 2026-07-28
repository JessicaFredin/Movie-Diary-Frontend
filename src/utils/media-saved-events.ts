"use client";

export type MediaType = "movie" | "tv";

export const MEDIA_SAVED_STATE_UPDATED_EVENT =
	"movie-diary-media-saved-state-updated";

export type MediaSavedStateUpdatedEventDetail = {
	mediaId: number;
	mediaType: MediaType;
	source?: "diary" | "watchlist" | "rating";
};

export function notifyMediaSavedStateUpdated(
	detail: MediaSavedStateUpdatedEventDetail,
): void {
	if (typeof window === "undefined") return;

	window.dispatchEvent(
		new CustomEvent<MediaSavedStateUpdatedEventDetail>(
			MEDIA_SAVED_STATE_UPDATED_EVENT,
			{
				detail,
			},
		),
	);
}
