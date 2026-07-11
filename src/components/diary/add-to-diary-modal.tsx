// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import StatusSelector from "./status-selector";
// import TvProgressPicker from "./tv-progress-picker";
// import RatingInput from "./rating-input";
// import type { TvShow } from "@/types";
// import { updateDiaryEntry } from "@/utils/diary-storage";
// import { calculateTvProgress } from "@/utils/progress";
// import { getPosterUrl } from "@/utils/tmdb-image";
// import { DiaryEntry } from "@/types/diary";
// import { addToWatchlist } from "@/utils/watchlist-storage";

// type Props = {
// 	open: boolean;
// 	onClose: () => void;
// 	content: {
// 		id: number;
// 		type: "movie" | "tv";
// 		title: string;
// 		poster: string;
// 		backdrop: string;
// 	};
// 	initialData?: DiaryEntry;
// 	onSave?: (status: "watching" | "completed" | "planned") => void;
// };

// export default function AddToDiaryModal({
// 	open,
// 	onClose,
// 	content,
// 	initialData,
// 	onSave,
// }: Props) {
// 	const [status, setStatus] = useState<"watching" | "completed" | "planned">(
// 		content.type === "movie" ? "completed" : "watching",
// 	);

// 	const [season, setSeason] = useState(1);
// 	const [episode, setEpisode] = useState(1);
// 	const [rating, setRating] = useState<number | null>(null);

// 	const [tvDetails, setTvDetails] = useState<TvShow | null>(null);

// 	/* -------------------------------
// 	   PREFILL WHEN EDITING
// 	--------------------------------*/
// 	useEffect(() => {
// 		if (!initialData) return;

// 		setStatus(initialData.status);
// 		setRating(initialData.rating ?? null);

// 		if (initialData.progress) {
// 			setSeason(initialData.progress.currentSeason);
// 			setEpisode(initialData.progress.currentEpisode);
// 		}
// 	}, [initialData]);

// 	useEffect(() => {
// 		if (!open) return;

// 		// EDIT MODE
// 		if (initialData) {
// 			setStatus(initialData.status);
// 			setRating(initialData.rating ?? null);

// 			if (initialData.progress) {
// 				setSeason(initialData.progress.currentSeason);
// 				setEpisode(initialData.progress.currentEpisode);
// 			}

// 			return;
// 		}

// 		// ADD MODE (reset defaults)
// 		setStatus(content.type === "movie" ? "completed" : "watching");
// 		setRating(null);
// 		setSeason(1);
// 		setEpisode(1);
// 	}, [open, initialData, content.type]);

// 	useEffect(() => {
// 		if (!open || content.type !== "tv") return;

// 		fetch(`/api/tmdb/tv/${content.id}`)
// 			.then((res) => res.json())
// 			.then(setTvDetails)
// 			.catch(console.error);
// 	}, [open, content]);

// 	useEffect(() => {
// 		if (!tvDetails?.seasons?.length) return;
// 		if (initialData) return; // 🔥 do NOT override edit mode

// 		const firstSeason = tvDetails.seasons[0].season_number;
// 		setSeason(firstSeason);
// 		setEpisode(1);
// 	}, [tvDetails, initialData]);

// 	// useEffect(() => {
// 	// 	if (
// 	// 		content.type === "tv" &&
// 	// 		tvDetails?.seasons?.length &&
// 	// 		status === "watching"
// 	// 	) {
// 	// 		const lastSeason = tvDetails.seasons[tvDetails.seasons.length - 1];

// 	// 		const lastEpisode = lastSeason.episode_count;

// 	// 		if (
// 	// 			season === lastSeason.season_number &&
// 	// 			episode === lastEpisode
// 	// 		) {
// 	// 			setStatus("completed");
// 	// 		}
// 	// 	}
// 	// }, [season, episode, tvDetails, status, content.type]);

// 	useEffect(() => {
// 		if (content.type !== "tv" || !tvDetails?.seasons?.length) return;

// 		const lastSeason = tvDetails.seasons[tvDetails.seasons.length - 1];

// 		const lastEpisode = lastSeason.episode_count;

// 		const isFullyWatched =
// 			season === lastSeason.season_number && episode === lastEpisode;

// 		// If fully watched → completed
// 		if (isFullyWatched && status !== "completed") {
// 			setStatus("completed");
// 		}

// 		// If NOT fully watched but currently completed → revert to watching
// 		if (!isFullyWatched && status === "completed") {
// 			setStatus("watching");
// 		}
// 	}, [season, episode, tvDetails, content.type]);

// 	useEffect(() => {
// 		if (
// 			content.type === "tv" &&
// 			status === "completed" &&
// 			tvDetails?.seasons?.length
// 		) {
// 			const lastSeason = tvDetails.seasons[tvDetails.seasons.length - 1];

// 			setSeason(lastSeason.season_number);
// 			setEpisode(lastSeason.episode_count);
// 		}
// 	}, [status, tvDetails, content.type]);

// 	if (!open) return null;

// 	/* -------------------------------
// 	   SAVE (ADD OR EDIT)
// 	--------------------------------*/
// 	// function handleSave() {
// 	// 	let progress = undefined;

// 	// 	// if (
// 	// 	// 	content.type === "tv" &&
// 	// 	// 	tvDetails?.seasons &&
// 	// 	// 	status !== "planned"
// 	// 	// ) {
// 	// 	// 	progress = calculateTvProgress(tvDetails.seasons, season, episode);
// 	// 	// }

// 	// 	if (
// 	// 		content.type === "tv" &&
// 	// 		tvDetails?.seasons &&
// 	// 		status !== "planned"
// 	// 	) {
// 	// 		if (status === "completed") {
// 	// 			const lastSeason =
// 	// 				tvDetails.seasons[tvDetails.seasons.length - 1];

// 	// 			progress = calculateTvProgress(
// 	// 				tvDetails.seasons,
// 	// 				lastSeason.season_number,
// 	// 				lastSeason.episode_count,
// 	// 			);
// 	// 		} else {
// 	// 			progress = calculateTvProgress(
// 	// 				tvDetails.seasons,
// 	// 				season,
// 	// 				episode,
// 	// 			);
// 	// 		}
// 	// 	}

// 	// 	const entry: DiaryEntry = {
// 	// 		id: content.id,
// 	// 		type: content.type,
// 	// 		title: content.title,
// 	// 		poster: content.poster,
// 	// 		backdrop: content.backdrop,
// 	// 		status,
// 	// 		progress,
// 	// 		rating,
// 	// 		updatedAt: new Date().toISOString(),
// 	// 	};

// 	// 	// If Planned send to watchlist otherwise to diary
// 	// 	if (status === "planned") {
// 	// 		addToWatchlist(entry);
// 	// 	} else {
// 	// 		updateDiaryEntry(entry);
// 	// 	}

// 	// 	onSave?.(status);
// 	// 	onClose();
// 	// }

// 	async function handleSave() {
// 		try {
// 			let progress = undefined;

// 			if (
// 				content.type === "tv" &&
// 				tvDetails?.seasons &&
// 				status !== "planned"
// 			) {
// 				if (status === "completed") {
// 					const lastSeason =
// 						tvDetails.seasons[tvDetails.seasons.length - 1];

// 					progress = calculateTvProgress(
// 						tvDetails.seasons,
// 						lastSeason.season_number,
// 						lastSeason.episode_count,
// 					);
// 				} else {
// 					progress = calculateTvProgress(
// 						tvDetails.seasons,
// 						season,
// 						episode,
// 					);
// 				}
// 			}

// 			const entry: DiaryEntry = {
// 				id: content.id,
// 				type: content.type,
// 				title: content.title,
// 				poster: content.poster,
// 				backdrop: content.backdrop,
// 				status,
// 				progress,
// 				rating,
// 				updatedAt: new Date().toISOString(),
// 			};

// 			await updateDiaryEntry(entry);
// 			await onSave?.(status);
// 			onClose();
// 		} catch (error) {
// 			console.error(error);
// 			alert(
// 				"You need to log in first, or something went wrong while saving.",
// 			);
// 		}
// 	}

// 	// function handleSave() {
// 	// 	const finalStatus = status;
// 	// 	let progress = undefined;

// 	// 	if (
// 	// 		content.type === "tv" &&
// 	// 		tvDetails?.seasons &&
// 	// 		status !== "planned"
// 	// 	) {
// 	// 		progress = calculateTvProgress(tvDetails.seasons, season, episode);
// 	// 	}

// 	// 	const entry = {
// 	// 		id: content.id,
// 	// 		type: content.type,
// 	// 		title: content.title,
// 	// 		poster: content.poster,
// 	// 		backdrop: content.backdrop,
// 	// 		status: finalStatus,
// 	// 		progress,
// 	// 		rating,
// 	// 		updatedAt: new Date().toISOString(),
// 	// 	};

// 	// 	updateDiaryEntry(entry);
// 	// 	onClose();
// 	// }

// 	return (
// 		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
// 			<div className="w-full max-w-md rounded-2xl bg-[#0f0f14] p-5 text-white shadow-2xl">
// 				{/* HEADER */}
// 				<div className="flex gap-4">
// 					<Image
// 						src={getPosterUrl(content.backdrop)}
// 						alt={content.title}
// 						width={80}
// 						height={120}
// 						className="rounded-lg object-cover"
// 					/>

// 					<div className="flex flex-col justify-center">
// 						<h2 className="text-lg font-semibold">
// 							{content.title}
// 						</h2>
// 						<p className="text-sm text-muted capitalize">
// 							{content.type}
// 						</p>
// 					</div>
// 				</div>

// 				{/* STATUS */}
// 				<div className="mt-6">
// 					<StatusSelector value={status} onChange={setStatus} />
// 				</div>

// 				{/* TV PROGRESS */}
// 				{content.type === "tv" && status !== "planned" && (
// 					<div className="mt-4">
// 						<TvProgressPicker
// 							seasons={tvDetails?.seasons ?? []}
// 							season={season}
// 							episode={episode}
// 							onSeasonChange={setSeason}
// 							onEpisodeChange={setEpisode}
// 						/>
// 					</div>
// 				)}

// 				{/* OPTIONAL RATING */}
// 				{status !== "planned" && (
// 					<div className="mt-4">
// 						<RatingInput value={rating} onChange={setRating} />
// 					</div>
// 				)}

// 				{/* ACTIONS */}
// 				<div className="mt-6 flex gap-3">
// 					<button
// 						onClick={onClose}
// 						className="flex-1 rounded-full bg-surface-elevated py-2 text-sm"
// 					>
// 						Cancel
// 					</button>

// 					<button
// 						onClick={handleSave}
// 						className="flex-1 rounded-full bg-accent py-2 text-sm font-semibold"
// 					>
// 						Save to diary
// 					</button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import StatusSelector from "./status-selector";
import TvProgressPicker from "./tv-progress-picker";
import RatingInput from "./rating-input";
import type { TvShow } from "@/types";
import { updateDiaryEntry, removeDiaryEntry } from "@/utils/diary-storage";
import { calculateTvProgress } from "@/utils/progress";
import { getPosterUrl } from "@/utils/tmdb-image";
import { DiaryEntry } from "@/types/diary";
import { addToWatchlist } from "@/utils/watchlist-storage";

type Status = "watching" | "completed" | "planned";

type Props = {
	open: boolean;
	onClose: () => void | Promise<void>;
	content: {
		id: number;
		type: "movie" | "tv";
		title: string;
		poster: string;
		backdrop: string;
	};
	initialData?: DiaryEntry;
	onSave?: (status: Status) => void | Promise<void>;
};

export default function AddToDiaryModal({
	open,
	onClose,
	content,
	initialData,
	onSave,
}: Props) {
	const [status, setStatus] = useState<Status>(
		content.type === "movie" ? "completed" : "watching",
	);

	const [season, setSeason] = useState(1);
	const [episode, setEpisode] = useState(1);
	const [rating, setRating] = useState<number | null>(null);
	const [tvDetails, setTvDetails] = useState<TvShow | null>(null);
	const [saving, setSaving] = useState(false);

	/* -------------------------------
	   PREFILL WHEN EDITING
	--------------------------------*/
	useEffect(() => {
		if (!initialData) return;

		setStatus(initialData.status);
		setRating(initialData.rating ?? null);

		if (initialData.progress) {
			setSeason(initialData.progress.currentSeason);
			setEpisode(initialData.progress.currentEpisode);
		}
	}, [initialData]);

	useEffect(() => {
		if (!open) return;

		// EDIT MODE
		if (initialData) {
			setStatus(initialData.status);
			setRating(initialData.rating ?? null);

			if (initialData.progress) {
				setSeason(initialData.progress.currentSeason);
				setEpisode(initialData.progress.currentEpisode);
			}

			return;
		}

		// ADD MODE
		setStatus(content.type === "movie" ? "completed" : "watching");
		setRating(null);
		setSeason(1);
		setEpisode(1);
	}, [open, initialData, content.type]);

	useEffect(() => {
		if (!open || content.type !== "tv") return;

		fetch(`/api/tmdb/tv/${content.id}`)
			.then((res) => res.json())
			.then(setTvDetails)
			.catch(console.error);
	}, [open, content.id, content.type]);

	useEffect(() => {
		if (!tvDetails?.seasons?.length) return;
		if (initialData) return;

		const firstSeason = tvDetails.seasons[0].season_number;
		setSeason(firstSeason);
		setEpisode(1);
	}, [tvDetails, initialData]);

	useEffect(() => {
		if (content.type !== "tv" || !tvDetails?.seasons?.length) return;

		const lastSeason = tvDetails.seasons[tvDetails.seasons.length - 1];
		const lastEpisode = lastSeason.episode_count;

		const isFullyWatched =
			season === lastSeason.season_number && episode === lastEpisode;

		if (isFullyWatched && status !== "completed") {
			setStatus("completed");
		}

		if (!isFullyWatched && status === "completed") {
			setStatus("watching");
		}
	}, [season, episode, tvDetails, content.type, status]);

	useEffect(() => {
		if (
			content.type === "tv" &&
			status === "completed" &&
			tvDetails?.seasons?.length
		) {
			const lastSeason = tvDetails.seasons[tvDetails.seasons.length - 1];

			setSeason(lastSeason.season_number);
			setEpisode(lastSeason.episode_count);
		}
	}, [status, tvDetails, content.type]);

	if (!open) return null;

	/* -------------------------------
	   SAVE
	--------------------------------*/
	async function handleSave() {
		try {
			setSaving(true);

			let progress: DiaryEntry["progress"] | undefined = undefined;

			if (
				content.type === "tv" &&
				tvDetails?.seasons &&
				status !== "planned"
			) {
				if (status === "completed") {
					const lastSeason =
						tvDetails.seasons[tvDetails.seasons.length - 1];

					progress = calculateTvProgress(
						tvDetails.seasons,
						lastSeason.season_number,
						lastSeason.episode_count,
					);
				} else {
					progress = calculateTvProgress(
						tvDetails.seasons,
						season,
						episode,
					);
				}
			}

			const entry: DiaryEntry = {
				id: content.id,
				type: content.type,
				title: content.title,
				poster: content.poster,
				backdrop: content.backdrop,
				status,
				progress,
				rating: status === "planned" ? null : rating,
				updatedAt: new Date().toISOString(),
			};

			// Planned = watchlist, NOT diary
			if (status === "planned") {
				await addToWatchlist({
					...entry,
					status: "planned",
					progress: undefined,
					rating: null,
				});

				// If it was already saved in the Supabase diary,
				// remove it from diary when switching back to Planned.
				try {
					await removeDiaryEntry(content.id, content.type);
				} catch {
					// Ignore if it was not in the diary.
				}

				await onSave?.(status);
				await onClose();
				return;
			}

			// Watching/completed = Supabase diary
			await updateDiaryEntry(entry);

			await onSave?.(status);
			await onClose();
		} catch (error) {
			console.error(error);
			alert(
				"You need to log in first, or something went wrong while saving.",
			);
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
			<div className="w-full max-w-md rounded-2xl bg-[#0f0f14] p-5 text-white shadow-2xl">
				{/* HEADER */}
				<div className="flex gap-4">
					<Image
						src={getPosterUrl(content.backdrop)}
						alt={content.title}
						width={80}
						height={120}
						className="rounded-lg object-cover"
					/>

					<div className="flex flex-col justify-center">
						<h2 className="text-lg font-semibold">
							{content.title}
						</h2>
						<p className="text-sm text-muted capitalize">
							{content.type}
						</p>
					</div>
				</div>

				{/* STATUS */}
				<div className="mt-6">
					<StatusSelector value={status} onChange={setStatus} />
				</div>

				{/* TV PROGRESS */}
				{content.type === "tv" && status !== "planned" && (
					<div className="mt-4">
						<TvProgressPicker
							seasons={tvDetails?.seasons ?? []}
							season={season}
							episode={episode}
							onSeasonChange={setSeason}
							onEpisodeChange={setEpisode}
						/>
					</div>
				)}

				{/* OPTIONAL RATING */}
				{status !== "planned" && (
					<div className="mt-4">
						<RatingInput value={rating} onChange={setRating} />
					</div>
				)}

				{/* ACTIONS */}
				<div className="mt-6 flex gap-3">
					<button
						type="button"
						onClick={onClose}
						disabled={saving}
						className="flex-1 rounded-full bg-surface-elevated py-2 text-sm disabled:opacity-50"
					>
						Cancel
					</button>

					<button
						type="button"
						onClick={handleSave}
						disabled={saving}
						className="flex-1 rounded-full bg-accent py-2 text-sm font-semibold disabled:opacity-50"
					>
						{saving
							? "Saving..."
							: status === "planned"
								? "Save to watchlist"
								: "Save to diary"}
					</button>
				</div>
			</div>
		</div>
	);
}