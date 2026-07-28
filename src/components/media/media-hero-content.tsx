// // "use client";

// // import { useState } from "react";
// // import Image from "next/image";
// // import { Clock, Calendar } from "lucide-react";

// // import ExpandableText from "@/components/details/expandable-text";
// // import MovieDiaryActions from "@/components/details/movie-diary-actions";
// // import TvDiaryActions from "@/components/details/tv-diary-actions";
// // import MediaRatings from "@/components/media/media-ratings";
// // import RateMediaButton from "@/components/media/rate-media-button";
// // import MediaFriendActivity from "@/components/media/media-friend-activity";

// // import { getPosterUrl } from "@/utils/tmdb-image";
// // import { Movie } from "@/types/movie";
// // import { TvShow } from "@/types/tv-show";

// // type Media = Movie | TvShow;

// // interface FriendActivity {
// // 	id: number;
// // 	name: string;
// // 	avatar: string;
// // }

// // interface MediaHeroContentProps {
// // 	media: Media;
// // 	friends: FriendActivity[];
// // }

// // /* ===== TYPE GUARD ===== */
// // function isMovie(media: Media): media is Movie {
// // 	return "title" in media;
// // }

// // export default function MediaHeroContent({ media }: MediaHeroContentProps) {
// // 	const [ratingsRefreshKey, setRatingsRefreshKey] = useState(0);

// // 	const movie = isMovie(media);
// // 	const mediaType: "movie" | "tv" = movie ? "movie" : "tv";

// // 	const title = movie ? media.title : media.name;

// // 	const year = movie
// // 		? media.release_date
// // 			? new Date(media.release_date).getFullYear()
// // 			: "—"
// // 		: media.first_air_date
// // 			? new Date(media.first_air_date).getFullYear()
// // 			: "—";

// // 	const runtimeLabel = movie
// // 		? media.runtime
// // 			? `${Math.floor(media.runtime / 60)}h ${media.runtime % 60}m`
// // 			: "—"
// // 		: media.number_of_seasons
// // 			? `${media.number_of_seasons} season${
// // 					media.number_of_seasons > 1 ? "s" : ""
// // 				} · ${media.number_of_episodes ?? 0} episodes`
// // 			: "—";

// // 	const genres = media.genres ?? [];

// // 	return (
// // 		<div className="relative px-6 md:px-24 md:pt-40 md:pb-16">
// // 			<div className="md:grid md:grid-cols-[300px_1fr] md:gap-14 items-start">
// // 				{/* Poster */}
// // 				<div className="hidden md:block">
// // 					<Image
// // 						src={getPosterUrl(media.poster_path)}
// // 						alt={title}
// // 						width={300}
// // 						height={450}
// // 						className="rounded-2xl shadow-2xl"
// // 						priority
// // 					/>
// // 				</div>

// // 				{/* Content */}
// // 				<div className="-mt-24 md:mt-0 flex flex-col gap-4 md:gap-6">
// // 					{/* Title + Real friend activity */}
// // 					<div className="flex items-center gap-6 flex-wrap">
// // 						<h1 className="text-3xl md:text-5xl font-bold tracking-tight">
// // 							{title}
// // 						</h1>

// // 						<MediaFriendActivity
// // 							mediaId={media.id}
// // 							mediaType={mediaType}
// // 						/>
// // 					</div>

// // 					{/* Meta */}
// // 					<div className="flex flex-wrap items-center gap-6 text-sm text-muted">
// // 						<div className="flex items-center gap-2">
// // 							<Calendar className="w-4 h-4" />
// // 							<span>{year}</span>
// // 						</div>

// // 						<div className="flex items-center gap-2">
// // 							<Clock className="w-4 h-4" />
// // 							<span>{runtimeLabel}</span>
// // 						</div>
// // 					</div>

// // 					{/* Ratings */}
// // 					<MediaRatings
// // 						mediaId={media.id}
// // 						mediaType={mediaType}
// // 						tmdbRating={media.vote_average}
// // 						tmdbVoteCount={media.vote_count}
// // 						refreshKey={ratingsRefreshKey}
// // 					/>

// // 					{/* Genres */}
// // 					{genres.length > 0 && (
// // 						<div className="flex flex-wrap gap-2 text-xs md:text-sm">
// // 							{genres.map((genre) => (
// // 								<span
// // 									key={genre.id}
// // 									className="bg-surface-elevated px-2 md:px-3 py-0.5 md:py-1 rounded-full text-gray-300"
// // 								>
// // 									{genre.name}
// // 								</span>
// // 							))}
// // 						</div>
// // 					)}

// // 					{/* Overview */}
// // 					<div className="max-w-2xl">
// // 						<ExpandableText text={media.overview} />
// // 					</div>

// // 					{/* Actions */}
// // 					<div className="max-w-sm space-y-4">
// // 						{movie ? (
// // 							<MovieDiaryActions
// // 								id={media.id}
// // 								title={title}
// // 								poster={getPosterUrl(media.poster_path)}
// // 								backdrop={getPosterUrl(media.backdrop_path)}
// // 							/>
// // 						) : (
// // 							<TvDiaryActions
// // 								id={media.id}
// // 								title={title}
// // 								poster={getPosterUrl(media.poster_path)}
// // 								backdrop={getPosterUrl(media.backdrop_path)}
// // 							/>
// // 						)}

// // 						<div className="grid grid-cols-2 gap-3">
// // 							<button className="flex items-center justify-center gap-2 rounded-full bg-surface-elevated hover:bg-surface-neutral px-4 py-2 text-sm transition">
// // 								<Clock className="w-4 h-4" />
// // 								<span>Watch later</span>
// // 							</button>

// // 							<RateMediaButton
// // 								mediaId={media.id}
// // 								mediaType={mediaType}
// // 								title={title}
// // 								onRated={() =>
// // 									setRatingsRefreshKey((value) => value + 1)
// // 								}
// // 							/>
// // 						</div>
// // 					</div>
// // 				</div>
// // 			</div>
// // 		</div>
// // 	);
// // }

// "use client";

// import { useCallback, useEffect, useState } from "react";
// import Image from "next/image";
// import { CheckCircle2, Clock, Calendar, X, Trash2 } from "lucide-react";

// import ExpandableText from "@/components/details/expandable-text";
// import MovieDiaryActions from "@/components/details/movie-diary-actions";
// import TvDiaryActions from "@/components/details/tv-diary-actions";
// import MediaRatings from "@/components/media/media-ratings";
// import RateMediaButton from "@/components/media/rate-media-button";
// import MediaFriendActivity from "@/components/media/media-friend-activity";

// import { getPosterUrl } from "@/utils/tmdb-image";
// import {
// 	addToWatchlist,
// 	getWatchlist,
// 	removeFromWatchlist,
// } from "@/utils/watchlist-storage";
// import { getDiary } from "@/utils/diary-storage";
// import type { DiaryEntry } from "@/types/diary";
// import { Movie } from "@/types/movie";
// import { TvShow } from "@/types/tv-show";

// type Media = Movie | TvShow;

// interface FriendActivity {
// 	id: number;
// 	name: string;
// 	avatar: string;
// }

// interface MediaHeroContentProps {
// 	media: Media;
// 	friends: FriendActivity[];
// }

// type InfoModalState = {
// 	open: boolean;
// 	title: string;
// 	message: string;
// 	type: "info" | "confirm";
// };

// const WATCHLIST_UPDATED_EVENT = "movie-diary-watchlist-updated";

// /* ===== TYPE GUARD ===== */
// function isMovie(media: Media): media is Movie {
// 	return "title" in media;
// }

// export default function MediaHeroContent({ media }: MediaHeroContentProps) {
// 	const [ratingsRefreshKey, setRatingsRefreshKey] = useState(0);
// 	const [inWatchlist, setInWatchlist] = useState(false);
// 	const [inDiary, setInDiary] = useState(false);
// 	const [watchlistSaving, setWatchlistSaving] = useState(false);
// 	const [infoModal, setInfoModal] = useState<InfoModalState>({
// 		open: false,
// 		title: "",
// 		message: "",
// 		type: "info",
// 	});

// 	const movie = isMovie(media);
// 	const mediaType: "movie" | "tv" = movie ? "movie" : "tv";

// 	const title = movie ? media.title : media.name;

// 	const posterUrl = getPosterUrl(media.poster_path);
// 	const backdropUrl = getPosterUrl(media.backdrop_path ?? media.poster_path);

// 	const year = movie
// 		? media.release_date
// 			? new Date(media.release_date).getFullYear()
// 			: "—"
// 		: media.first_air_date
// 			? new Date(media.first_air_date).getFullYear()
// 			: "—";

// 	const runtimeLabel = movie
// 		? media.runtime
// 			? `${Math.floor(media.runtime / 60)}h ${media.runtime % 60}m`
// 			: "—"
// 		: media.number_of_seasons
// 			? `${media.number_of_seasons} season${
// 					media.number_of_seasons > 1 ? "s" : ""
// 				} · ${media.number_of_episodes ?? 0} episodes`
// 			: "—";

// 	const genres = media.genres ?? [];

// 	const loadSavedState = useCallback(async (): Promise<void> => {
// 		const [watchlist, diary] = await Promise.all([
// 			getWatchlist().catch(() => []),
// 			getDiary().catch(() => []),
// 		]);

// 		const diaryHasItem = diary.some(
// 			(item) => item.id === media.id && item.type === mediaType,
// 		);

// 		const watchlistHasItem = watchlist.some(
// 			(item) => item.id === media.id && item.type === mediaType,
// 		);

// 		// If it somehow exists in both, diary wins.
// 		if (diaryHasItem && watchlistHasItem) {
// 			await removeFromWatchlist(media.id, mediaType).catch(() => {});
// 			setInDiary(true);
// 			setInWatchlist(false);

// 			window.dispatchEvent(new Event(WATCHLIST_UPDATED_EVENT));
// 			return;
// 		}

// 		setInDiary(diaryHasItem);
// 		setInWatchlist(watchlistHasItem);
// 	}, [media.id, mediaType]);

// 	useEffect(() => {
// 		let mounted = true;

// 		async function run(): Promise<void> {
// 			if (!mounted) return;
// 			await loadSavedState();
// 		}

// 		void run();

// 		return () => {
// 			mounted = false;
// 		};
// 	}, [loadSavedState]);

// 	useEffect(() => {
// 		function handleSavedStateChanged(): void {
// 			void loadSavedState();
// 		}

// 		window.addEventListener(
// 			WATCHLIST_UPDATED_EVENT,
// 			handleSavedStateChanged,
// 		);
// 		window.addEventListener(
// 			"movie-diary-user-rating-updated",
// 			handleSavedStateChanged,
// 		);

// 		return () => {
// 			window.removeEventListener(
// 				WATCHLIST_UPDATED_EVENT,
// 				handleSavedStateChanged,
// 			);
// 			window.removeEventListener(
// 				"movie-diary-user-rating-updated",
// 				handleSavedStateChanged,
// 			);
// 		};
// 	}, [loadSavedState]);

// 	function closeInfoModal(): void {
// 		setInfoModal({
// 			open: false,
// 			title: "",
// 			message: "",
// 			type: "info",
// 		});
// 	}

// 	async function handleWatchLater(): Promise<void> {
// 		try {
// 			setWatchlistSaving(true);

// 			const diary = await getDiary().catch(() => []);
// 			const alreadyInDiary = diary.some(
// 				(item) => item.id === media.id && item.type === mediaType,
// 			);

// 			if (alreadyInDiary || inDiary) {
// 				setInDiary(true);
// 				setInWatchlist(false);

// 				setInfoModal({
// 					open: true,
// 					type: "info",
// 					title: "Already in your diary",
// 					message:
// 						"This title is already saved in your diary. Remove it from your diary first if you want to move it to your watchlist.",
// 				});

// 				return;
// 			}

// 			if (inWatchlist) {
// 				setInfoModal({
// 					open: true,
// 					type: "confirm",
// 					title: "Remove from watchlist?",
// 					message: `"${title}" is already in your watchlist. Do you want to remove it?`,
// 				});

// 				return;
// 			}

// 			const entry: DiaryEntry = {
// 				id: media.id,
// 				type: mediaType,
// 				title,
// 				poster: posterUrl,
// 				backdrop: backdropUrl,
// 				status: "planned",
// 				progress: undefined,
// 				rating: null,
// 				updatedAt: new Date().toISOString(),
// 			};

// 			await addToWatchlist(entry);

// 			setInWatchlist(true);

// 			window.dispatchEvent(new Event(WATCHLIST_UPDATED_EVENT));

// 			setInfoModal({
// 				open: true,
// 				type: "info",
// 				title: "Added to watchlist",
// 				message: `"${title}" has been added to your watchlist.`,
// 			});
// 		} catch (error) {
// 			console.error(error);

// 			setInfoModal({
// 				open: true,
// 				type: "info",
// 				title: "Could not save",
// 				message:
// 					error instanceof Error
// 						? error.message
// 						: "You need to log in first to save this.",
// 			});
// 		} finally {
// 			setWatchlistSaving(false);
// 		}
// 	}

// 	async function handleRemoveFromWatchlist(): Promise<void> {
// 		try {
// 			setWatchlistSaving(true);

// 			await removeFromWatchlist(media.id, mediaType);

// 			setInWatchlist(false);
// 			closeInfoModal();

// 			window.dispatchEvent(new Event(WATCHLIST_UPDATED_EVENT));
// 		} catch (error) {
// 			console.error(error);

// 			setInfoModal({
// 				open: true,
// 				type: "info",
// 				title: "Could not remove",
// 				message:
// 					error instanceof Error
// 						? error.message
// 						: "Something went wrong while removing this from your watchlist.",
// 			});
// 		} finally {
// 			setWatchlistSaving(false);
// 		}
// 	}

// 	return (
// 		<>
// 			<div className="relative px-6 md:px-24 md:pt-40 md:pb-16">
// 				<div className="items-start md:grid md:grid-cols-[300px_1fr] md:gap-14">
// 					{/* Poster */}
// 					<div className="hidden md:block">
// 						<Image
// 							src={getPosterUrl(media.poster_path)}
// 							alt={title}
// 							width={300}
// 							height={450}
// 							className="rounded-2xl shadow-2xl"
// 							priority
// 						/>
// 					</div>

// 					{/* Content */}
// 					<div className="-mt-24 flex flex-col gap-4 md:mt-0 md:gap-6">
// 						{/* Title + Real friend activity */}
// 						<div className="flex flex-wrap items-center gap-6">
// 							<h1 className="text-3xl font-bold tracking-tight md:text-5xl">
// 								{title}
// 							</h1>

// 							<MediaFriendActivity
// 								mediaId={media.id}
// 								mediaType={mediaType}
// 							/>
// 						</div>

// 						{/* Meta */}
// 						<div className="flex flex-wrap items-center gap-6 text-sm text-muted">
// 							<div className="flex items-center gap-2">
// 								<Calendar className="h-4 w-4" />
// 								<span>{year}</span>
// 							</div>

// 							<div className="flex items-center gap-2">
// 								<Clock className="h-4 w-4" />
// 								<span>{runtimeLabel}</span>
// 							</div>
// 						</div>

// 						{/* Ratings */}
// 						<MediaRatings
// 							mediaId={media.id}
// 							mediaType={mediaType}
// 							tmdbRating={media.vote_average}
// 							tmdbVoteCount={media.vote_count}
// 							refreshKey={ratingsRefreshKey}
// 						/>

// 						{/* Genres */}
// 						{genres.length > 0 && (
// 							<div className="flex flex-wrap gap-2 text-xs md:text-sm">
// 								{genres.map((genre) => (
// 									<span
// 										key={genre.id}
// 										className="rounded-full bg-surface-elevated px-2 py-0.5 text-gray-300 md:px-3 md:py-1"
// 									>
// 										{genre.name}
// 									</span>
// 								))}
// 							</div>
// 						)}

// 						{/* Overview */}
// 						<div className="max-w-2xl">
// 							<ExpandableText text={media.overview} />
// 						</div>

// 						{/* Actions */}
// 						<div className="max-w-sm space-y-4">
// 							{movie ? (
// 								<MovieDiaryActions
// 									id={media.id}
// 									title={title}
// 									poster={getPosterUrl(media.poster_path)}
// 									backdrop={getPosterUrl(media.backdrop_path)}
// 								/>
// 							) : (
// 								<TvDiaryActions
// 									id={media.id}
// 									title={title}
// 									poster={getPosterUrl(media.poster_path)}
// 									backdrop={getPosterUrl(media.backdrop_path)}
// 								/>
// 							)}

// 							<div className="grid grid-cols-2 gap-3">
// 								<button
// 									type="button"
// 									onClick={handleWatchLater}
// 									disabled={watchlistSaving}
// 									className={`flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm transition disabled:opacity-50 ${
// 										inDiary
// 											? "bg-white/10 text-muted hover:bg-white/15"
// 											: inWatchlist
// 												? "bg-green-500/15 text-green-300 hover:bg-green-500/20"
// 												: "bg-surface-elevated hover:bg-surface-neutral"
// 									}`}
// 								>
// 									{inWatchlist && !inDiary ? (
// 										<CheckCircle2 className="h-4 w-4" />
// 									) : (
// 										<Clock className="h-4 w-4" />
// 									)}

// 									<span>
// 										{watchlistSaving
// 											? "Saving..."
// 											: inWatchlist && !inDiary
// 												? "In watchlist"
// 												: "Watch later"}
// 									</span>
// 								</button>

// 								<RateMediaButton
// 									mediaId={media.id}
// 									mediaType={mediaType}
// 									title={title}
// 									onRated={() =>
// 										setRatingsRefreshKey(
// 											(value) => value + 1,
// 										)
// 									}
// 								/>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</div>

// 			{infoModal.open && (
// 				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
// 					<div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#15151a] p-6 text-white shadow-2xl">
// 						<div className="flex items-start justify-between gap-4">
// 							<div>
// 								<h2 className="text-xl font-bold">
// 									{infoModal.title}
// 								</h2>

// 								<p className="mt-3 text-sm leading-6 text-muted">
// 									{infoModal.message}
// 								</p>
// 							</div>

// 							<button
// 								type="button"
// 								onClick={closeInfoModal}
// 								disabled={watchlistSaving}
// 								className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-white disabled:opacity-50"
// 								aria-label="Close"
// 							>
// 								<X className="h-5 w-5" />
// 							</button>
// 						</div>

// 						<div className="mt-6 flex justify-end gap-3">
// 							<button
// 								type="button"
// 								onClick={closeInfoModal}
// 								disabled={watchlistSaving}
// 								className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-2 text-sm font-bold text-white transition hover:bg-white/[0.08] disabled:opacity-50"
// 							>
// 								Cancel
// 							</button>

// 							{infoModal.type === "confirm" ? (
// 								<button
// 									type="button"
// 									onClick={handleRemoveFromWatchlist}
// 									disabled={watchlistSaving}
// 									className="flex items-center gap-2 rounded-full bg-accent px-6 py-2 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
// 								>
// 									<Trash2 className="h-4 w-4" />
// 									{watchlistSaving ? "Removing..." : "Remove"}
// 								</button>
// 							) : (
// 								<button
// 									type="button"
// 									onClick={closeInfoModal}
// 									disabled={watchlistSaving}
// 									className="rounded-full bg-accent px-6 py-2 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
// 								>
// 									Okay
// 								</button>
// 							)}
// 						</div>
// 					</div>
// 				</div>
// 			)}
// 		</>
// 	);
// }

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Clock, Calendar, X, Trash2 } from "lucide-react";

import ExpandableText from "@/components/details/expandable-text";
import MovieDiaryActions from "@/components/details/movie-diary-actions";
import TvDiaryActions from "@/components/details/tv-diary-actions";
import MediaRatings from "@/components/media/media-ratings";
import RateMediaButton from "@/components/media/rate-media-button";
import MediaFriendActivity from "@/components/media/media-friend-activity";

import { getPosterUrl } from "@/utils/tmdb-image";
import {
	addToWatchlist,
	getWatchlist,
	removeFromWatchlist,
} from "@/utils/watchlist-storage";
import { getDiary } from "@/utils/diary-storage";
import type { DiaryEntry } from "@/types/diary";
import { Movie } from "@/types/movie";
import { TvShow } from "@/types/tv-show";
import {
	MEDIA_SAVED_STATE_UPDATED_EVENT,
	notifyMediaSavedStateUpdated,
	type MediaSavedStateUpdatedEventDetail,
} from "@/utils/media-saved-events";
import {
	USER_RATING_UPDATED_EVENT,
	type UserRatingUpdatedEventDetail,
} from "@/utils/user-ratings";

type Media = Movie | TvShow;

interface FriendActivity {
	id: number;
	name: string;
	avatar: string;
}

interface MediaHeroContentProps {
	media: Media;
	friends: FriendActivity[];
}

type InfoModalState = {
	open: boolean;
	title: string;
	message: string;
	type: "info" | "confirm";
};

/* ===== TYPE GUARD ===== */
function isMovie(media: Media): media is Movie {
	return "title" in media;
}

export default function MediaHeroContent({ media }: MediaHeroContentProps) {
	const [ratingsRefreshKey, setRatingsRefreshKey] = useState(0);
	const [inWatchlist, setInWatchlist] = useState(false);
	const [inDiary, setInDiary] = useState(false);
	const [watchlistSaving, setWatchlistSaving] = useState(false);
	const [infoModal, setInfoModal] = useState<InfoModalState>({
		open: false,
		title: "",
		message: "",
		type: "info",
	});

	const refreshTimerRef = useRef<number | null>(null);

	const movie = isMovie(media);
	const mediaType: "movie" | "tv" = movie ? "movie" : "tv";

	const title = movie ? media.title : media.name;

	const posterUrl = getPosterUrl(media.poster_path);
	const backdropUrl = getPosterUrl(media.backdrop_path ?? media.poster_path);

	const year = movie
		? media.release_date
			? new Date(media.release_date).getFullYear()
			: "—"
		: media.first_air_date
			? new Date(media.first_air_date).getFullYear()
			: "—";

	const runtimeLabel = movie
		? media.runtime
			? `${Math.floor(media.runtime / 60)}h ${media.runtime % 60}m`
			: "—"
		: media.number_of_seasons
			? `${media.number_of_seasons} season${
					media.number_of_seasons > 1 ? "s" : ""
				} · ${media.number_of_episodes ?? 0} episodes`
			: "—";

	const genres = media.genres ?? [];

	const loadSavedState = useCallback(async (): Promise<void> => {
		const [watchlist, diary] = await Promise.all([
			getWatchlist().catch(() => []),
			getDiary().catch(() => []),
		]);

		const diaryHasItem = diary.some(
			(item) => item.id === media.id && item.type === mediaType,
		);

		const watchlistHasItem = watchlist.some(
			(item) => item.id === media.id && item.type === mediaType,
		);

		// Diary wins. If it exists in both, clean the watchlist copy.
		if (diaryHasItem && watchlistHasItem) {
			await removeFromWatchlist(media.id, mediaType).catch(() => {});
			setInDiary(true);
			setInWatchlist(false);
			return;
		}

		setInDiary(diaryHasItem);
		setInWatchlist(watchlistHasItem);
	}, [media.id, mediaType]);

	const scheduleSavedStateRefresh = useCallback((): void => {
		if (refreshTimerRef.current !== null) {
			window.clearTimeout(refreshTimerRef.current);
		}

		refreshTimerRef.current = window.setTimeout(() => {
			void loadSavedState();
			refreshTimerRef.current = null;
		}, 500);
	}, [loadSavedState]);

	useEffect(() => {
		void loadSavedState();
	}, [loadSavedState]);

	useEffect(() => {
		function handleSavedStateChanged(event: Event): void {
			const customEvent =
				event as CustomEvent<MediaSavedStateUpdatedEventDetail>;

			if (
				customEvent.detail.mediaId === media.id &&
				customEvent.detail.mediaType === mediaType
			) {
				void loadSavedState();
			}
		}

		function handleRatingChanged(event: Event): void {
			const customEvent =
				event as CustomEvent<UserRatingUpdatedEventDetail>;

			if (
				customEvent.detail.mediaId === media.id &&
				customEvent.detail.mediaType === mediaType
			) {
				setRatingsRefreshKey((value) => value + 1);
			}
		}

		function handleWindowFocus(): void {
			void loadSavedState();
		}

		function handleVisibilityChange(): void {
			if (document.visibilityState === "visible") {
				void loadSavedState();
			}
		}

		function handleDocumentClick(): void {
			scheduleSavedStateRefresh();
		}

		window.addEventListener(
			MEDIA_SAVED_STATE_UPDATED_EVENT,
			handleSavedStateChanged,
		);

		window.addEventListener(USER_RATING_UPDATED_EVENT, handleRatingChanged);
		window.addEventListener("focus", handleWindowFocus);
		document.addEventListener("visibilitychange", handleVisibilityChange);
		document.addEventListener("click", handleDocumentClick);

		return () => {
			window.removeEventListener(
				MEDIA_SAVED_STATE_UPDATED_EVENT,
				handleSavedStateChanged,
			);

			window.removeEventListener(
				USER_RATING_UPDATED_EVENT,
				handleRatingChanged,
			);

			window.removeEventListener("focus", handleWindowFocus);
			document.removeEventListener(
				"visibilitychange",
				handleVisibilityChange,
			);
			document.removeEventListener("click", handleDocumentClick);

			if (refreshTimerRef.current !== null) {
				window.clearTimeout(refreshTimerRef.current);
			}
		};
	}, [media.id, mediaType, loadSavedState, scheduleSavedStateRefresh]);

	function closeInfoModal(): void {
		setInfoModal({
			open: false,
			title: "",
			message: "",
			type: "info",
		});
	}

	async function handleWatchLater(): Promise<void> {
		try {
			setWatchlistSaving(true);

			// Fresh check every click, so deleting from diary works without reload.
			const diary = await getDiary().catch(() => []);
			const currentInDiary = diary.some(
				(item) => item.id === media.id && item.type === mediaType,
			);

			setInDiary(currentInDiary);

			if (currentInDiary) {
				setInWatchlist(false);

				setInfoModal({
					open: true,
					type: "info",
					title: "Already in your diary",
					message:
						"This title is already saved in your diary. Remove it from your diary first if you want to move it to your watchlist.",
				});

				return;
			}

			const watchlist = await getWatchlist().catch(() => []);
			const currentInWatchlist = watchlist.some(
				(item) => item.id === media.id && item.type === mediaType,
			);

			setInWatchlist(currentInWatchlist);

			if (currentInWatchlist) {
				setInfoModal({
					open: true,
					type: "confirm",
					title: "Remove from watchlist?",
					message: `"${title}" is already in your watchlist. Do you want to remove it?`,
				});

				return;
			}

			const entry: DiaryEntry = {
				id: media.id,
				type: mediaType,
				title,
				poster: posterUrl,
				backdrop: backdropUrl,
				status: "planned",
				progress: undefined,
				rating: null,
				updatedAt: new Date().toISOString(),
			};

			await addToWatchlist(entry);

			setInWatchlist(true);
			setInDiary(false);

			notifyMediaSavedStateUpdated({
				mediaId: media.id,
				mediaType,
				source: "watchlist",
			});

			setInfoModal({
				open: true,
				type: "info",
				title: "Added to watchlist",
				message: `"${title}" has been added to your watchlist.`,
			});
		} catch (error) {
			console.error(error);

			setInfoModal({
				open: true,
				type: "info",
				title: "Could not save",
				message:
					error instanceof Error
						? error.message
						: "You need to log in first to save this.",
			});
		} finally {
			setWatchlistSaving(false);
		}
	}

	async function handleRemoveFromWatchlist(): Promise<void> {
		try {
			setWatchlistSaving(true);

			await removeFromWatchlist(media.id, mediaType);

			setInWatchlist(false);
			closeInfoModal();

			notifyMediaSavedStateUpdated({
				mediaId: media.id,
				mediaType,
				source: "watchlist",
			});
		} catch (error) {
			console.error(error);

			setInfoModal({
				open: true,
				type: "info",
				title: "Could not remove",
				message:
					error instanceof Error
						? error.message
						: "Something went wrong while removing this from your watchlist.",
			});
		} finally {
			setWatchlistSaving(false);
		}
	}

	return (
		<>
			<div className="relative px-6 md:px-24 md:pt-40 md:pb-16">
				<div className="items-start md:grid md:grid-cols-[300px_1fr] md:gap-14">
					{/* Poster */}
					<div className="hidden md:block">
						<Image
							src={getPosterUrl(media.poster_path)}
							alt={title}
							width={300}
							height={450}
							className="rounded-2xl shadow-2xl"
							priority
						/>
					</div>

					{/* Content */}
					<div className="-mt-24 flex flex-col gap-4 md:mt-0 md:gap-6">
						{/* Title + Real friend activity */}
						<div className="flex flex-wrap items-center gap-6">
							<h1 className="text-3xl font-bold tracking-tight md:text-5xl">
								{title}
							</h1>

							<MediaFriendActivity
								mediaId={media.id}
								mediaType={mediaType}
							/>
						</div>

						{/* Meta */}
						<div className="flex flex-wrap items-center gap-6 text-sm text-muted">
							<div className="flex items-center gap-2">
								<Calendar className="h-4 w-4" />
								<span>{year}</span>
							</div>

							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4" />
								<span>{runtimeLabel}</span>
							</div>
						</div>

						{/* Ratings */}
						<MediaRatings
							mediaId={media.id}
							mediaType={mediaType}
							tmdbRating={media.vote_average}
							tmdbVoteCount={media.vote_count}
							refreshKey={ratingsRefreshKey}
						/>

						{/* Genres */}
						{genres.length > 0 && (
							<div className="flex flex-wrap gap-2 text-xs md:text-sm">
								{genres.map((genre) => (
									<span
										key={genre.id}
										className="rounded-full bg-surface-elevated px-2 py-0.5 text-gray-300 md:px-3 md:py-1"
									>
										{genre.name}
									</span>
								))}
							</div>
						)}

						{/* Overview */}
						<div className="max-w-2xl">
							<ExpandableText text={media.overview} />
						</div>

						{/* Actions */}
						<div className="max-w-sm space-y-4">
							{movie ? (
								<MovieDiaryActions
									id={media.id}
									title={title}
									poster={getPosterUrl(media.poster_path)}
									backdrop={getPosterUrl(media.backdrop_path)}
								/>
							) : (
								<TvDiaryActions
									id={media.id}
									title={title}
									poster={getPosterUrl(media.poster_path)}
									backdrop={getPosterUrl(media.backdrop_path)}
								/>
							)}

							<div className="grid grid-cols-2 gap-3">
								<button
									type="button"
									onClick={handleWatchLater}
									disabled={watchlistSaving}
									className={`flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm transition disabled:opacity-50 ${
										inDiary
											? "bg-white/10 text-muted hover:bg-white/15"
											: inWatchlist
												? "bg-green-500/15 text-green-300 hover:bg-green-500/20"
												: "bg-surface-elevated hover:bg-surface-neutral"
									}`}
								>
									{inWatchlist && !inDiary ? (
										<CheckCircle2 className="h-4 w-4" />
									) : (
										<Clock className="h-4 w-4" />
									)}

									<span>
										{watchlistSaving
											? "Saving..."
											: inWatchlist && !inDiary
												? "In watchlist"
												: "Watch later"}
									</span>
								</button>

								<RateMediaButton
									mediaId={media.id}
									mediaType={mediaType}
									title={title}
									onRated={() =>
										setRatingsRefreshKey(
											(value) => value + 1,
										)
									}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{infoModal.open && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
					<div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#15151a] p-6 text-white shadow-2xl">
						<div className="flex items-start justify-between gap-4">
							<div>
								<h2 className="text-xl font-bold">
									{infoModal.title}
								</h2>

								<p className="mt-3 text-sm leading-6 text-muted">
									{infoModal.message}
								</p>
							</div>

							<button
								type="button"
								onClick={closeInfoModal}
								disabled={watchlistSaving}
								className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-white disabled:opacity-50"
								aria-label="Close"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<div className="mt-6 flex justify-end gap-3">
							<button
								type="button"
								onClick={closeInfoModal}
								disabled={watchlistSaving}
								className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-2 text-sm font-bold text-white transition hover:bg-white/[0.08] disabled:opacity-50"
							>
								Cancel
							</button>

							{infoModal.type === "confirm" ? (
								<button
									type="button"
									onClick={handleRemoveFromWatchlist}
									disabled={watchlistSaving}
									className="flex items-center gap-2 rounded-full bg-accent px-6 py-2 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
								>
									<Trash2 className="h-4 w-4" />
									{watchlistSaving ? "Removing..." : "Remove"}
								</button>
							) : (
								<button
									type="button"
									onClick={closeInfoModal}
									disabled={watchlistSaving}
									className="rounded-full bg-accent px-6 py-2 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
								>
									Okay
								</button>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
}