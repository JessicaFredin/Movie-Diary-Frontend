// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import StatusSelector from "./status-selector";
// import TvProgressPicker from "./tv-progress-picker";
// import RatingInput from "./rating-input";
// import type { TvShow } from "@/types";
// import { updateDiaryEntry, removeDiaryEntry } from "@/utils/diary-storage";
// import { calculateTvProgress } from "@/utils/progress";
// import { getPosterUrl } from "@/utils/tmdb-image";
// import { DiaryEntry } from "@/types/diary";
// import { addToWatchlist } from "@/utils/watchlist-storage";

// type Status = "watching" | "completed" | "planned";

// type Props = {
// 	open: boolean;
// 	onClose: () => void | Promise<void>;
// 	content: {
// 		id: number;
// 		type: "movie" | "tv";
// 		title: string;
// 		poster: string;
// 		backdrop: string;
// 	};
// 	initialData?: DiaryEntry;
// 	onSave?: (status: Status) => void | Promise<void>;
// };

// export default function AddToDiaryModal({
// 	open,
// 	onClose,
// 	content,
// 	initialData,
// 	onSave,
// }: Props) {
// 	const [status, setStatus] = useState<Status>(
// 		content.type === "movie" ? "completed" : "watching",
// 	);

// 	const [season, setSeason] = useState(1);
// 	const [episode, setEpisode] = useState(1);
// 	const [rating, setRating] = useState<number | null>(null);
// 	const [tvDetails, setTvDetails] = useState<TvShow | null>(null);
// 	const [saving, setSaving] = useState(false);

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

// 		// ADD MODE
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
// 	}, [open, content.id, content.type]);

// 	useEffect(() => {
// 		if (!tvDetails?.seasons?.length) return;
// 		if (initialData) return;

// 		const firstSeason = tvDetails.seasons[0].season_number;
// 		setSeason(firstSeason);
// 		setEpisode(1);
// 	}, [tvDetails, initialData]);

// 	useEffect(() => {
// 		if (content.type !== "tv" || !tvDetails?.seasons?.length) return;

// 		const lastSeason = tvDetails.seasons[tvDetails.seasons.length - 1];
// 		const lastEpisode = lastSeason.episode_count;

// 		const isFullyWatched =
// 			season === lastSeason.season_number && episode === lastEpisode;

// 		if (isFullyWatched && status !== "completed") {
// 			setStatus("completed");
// 		}

// 		if (!isFullyWatched && status === "completed") {
// 			setStatus("watching");
// 		}
// 	}, [season, episode, tvDetails, content.type, status]);

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
// 	   SAVE
// 	--------------------------------*/
// 	async function handleSave() {
// 		try {
// 			setSaving(true);

// 			let progress: DiaryEntry["progress"] | undefined = undefined;

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
// 				rating: status === "planned" ? null : rating,
// 				updatedAt: new Date().toISOString(),
// 			};

// 			// Planned = watchlist, NOT diary
// 			if (status === "planned") {
// 				await addToWatchlist({
// 					...entry,
// 					status: "planned",
// 					progress: undefined,
// 					rating: null,
// 				});

// 				// If it was already saved in the Supabase diary,
// 				// remove it from diary when switching back to Planned.
// 				try {
// 					await removeDiaryEntry(content.id, content.type);
// 				} catch {
// 					// Ignore if it was not in the diary.
// 				}

// 				await onSave?.(status);
// 				await onClose();
// 				return;
// 			}

// 			// Watching/completed = Supabase diary
// 			await updateDiaryEntry(entry);

// 			await onSave?.(status);
// 			await onClose();
// 		} catch (error) {
// 			console.error(error);
// 			alert(
// 				"You need to log in first, or something went wrong while saving.",
// 			);
// 		} finally {
// 			setSaving(false);
// 		}
// 	}

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
// 						type="button"
// 						onClick={onClose}
// 						disabled={saving}
// 						className="flex-1 rounded-full bg-surface-elevated py-2 text-sm disabled:opacity-50"
// 					>
// 						Cancel
// 					</button>

// 					<button
// 						type="button"
// 						onClick={handleSave}
// 						disabled={saving}
// 						className="flex-1 rounded-full bg-accent py-2 text-sm font-semibold disabled:opacity-50"
// 					>
// 						{saving
// 							? "Saving..."
// 							: status === "planned"
// 								? "Save to watchlist"
// 								: "Save to diary"}
// 					</button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import Image from "next/image";
import { Star, X } from "lucide-react";

import StatusSelector from "./status-selector";
import TvProgressPicker from "./tv-progress-picker";
import type { TvShow } from "@/types";
import { updateDiaryEntry, removeDiaryEntry } from "@/utils/diary-storage";
import { calculateTvProgress } from "@/utils/progress";
import { getPosterUrl } from "@/utils/tmdb-image";
import type { DiaryEntry } from "@/types/diary";
import { addToWatchlist } from "@/utils/watchlist-storage";
import { createClient } from "@/lib/supabase/client";
import { deleteUserRating, saveUserRating } from "@/utils/user-ratings";

type Status = "watching" | "completed" | "planned";
type StarFill = "empty" | "half" | "full";

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

function getStarFill(starNumber: number, value: number): StarFill {
	if (value >= starNumber) return "full";
	if (value >= starNumber - 0.5) return "half";
	return "empty";
}

function calculateStarRating(
	event: MouseEvent<HTMLButtonElement>,
	starIndex: number,
): number {
	const rect = event.currentTarget.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const isLeftHalf = x < rect.width / 2;

	return starIndex + (isLeftHalf ? 0.5 : 1);
}

function StarRatingInput({
	value,
	onChange,
	disabled = false,
}: {
	value: number | null;
	onChange: (value: number | null) => void;
	disabled?: boolean;
}) {
	const [hoveredRating, setHoveredRating] = useState<number | null>(null);

	const previewRating = hoveredRating ?? value ?? 0;

	return (
		<div>
			<div className="mb-3 flex items-center justify-between">
				<p className="text-sm font-semibold text-muted">
					Your rating{" "}
					<span className="font-normal text-muted">(optional)</span>
				</p>

				{value !== null && (
					<button
						type="button"
						onClick={() => onChange(null)}
						disabled={disabled}
						className="text-xs font-semibold text-muted transition hover:text-white disabled:opacity-50"
					>
						Clear
					</button>
				)}
			</div>

			<div
				onMouseLeave={() => setHoveredRating(null)}
				className="rounded-2xl border border-white/10 bg-surface-elevated/70 p-4"
			>
				<div className="flex items-center justify-center gap-1.5">
					{Array.from({ length: 10 }).map((_, index) => {
						const starNumber = index + 1;
						const fill = getStarFill(starNumber, previewRating);

						return (
							<button
								key={starNumber}
								type="button"
								disabled={disabled}
								onMouseMove={(event) => {
									setHoveredRating(
										calculateStarRating(event, index),
									);
								}}
								onClick={(event) => {
									onChange(calculateStarRating(event, index));
								}}
								className="relative h-7 w-7 shrink-0 transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50 sm:h-8 sm:w-8"
								aria-label={`Rate ${starNumber} out of 10`}
							>
								<Star className="absolute inset-0 h-7 w-7 text-white/25 sm:h-8 sm:w-8" />

								<span
									className={`absolute inset-0 overflow-hidden ${
										fill === "full"
											? "w-full"
											: fill === "half"
												? "w-1/2"
												: "w-0"
									}`}
								>
									<Star className="h-7 w-7 fill-yellow-400 text-yellow-400 sm:h-8 sm:w-8" />
								</span>
							</button>
						);
					})}
				</div>

				<div className="mt-4 text-center">
					{previewRating > 0 ? (
						<p className="text-2xl font-black text-white">
							{previewRating.toFixed(1)}
							<span className="ml-1 text-sm font-semibold text-muted">
								/ 10
							</span>
						</p>
					) : (
						<p className="text-sm text-muted">No rating selected</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default function AddToDiaryModal({
	open,
	onClose,
	content,
	initialData,
	onSave,
}: Props) {
	const supabase = useMemo(() => createClient(), []);

	const [status, setStatus] = useState<Status>(
		content.type === "movie" ? "completed" : "watching",
	);

	const [season, setSeason] = useState(1);
	const [episode, setEpisode] = useState(1);
	const [rating, setRating] = useState<number | null>(null);
	const [tvDetails, setTvDetails] = useState<TvShow | null>(null);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (!open) return;

		if (initialData) {
			setStatus(initialData.status);
			setRating(initialData.rating ?? null);

			if (initialData.progress) {
				setSeason(initialData.progress.currentSeason);
				setEpisode(initialData.progress.currentEpisode);
			}

			return;
		}

		setStatus(content.type === "movie" ? "completed" : "watching");
		setRating(null);
		setSeason(1);
		setEpisode(1);
	}, [open, initialData, content.type]);

	useEffect(() => {
		if (!open || content.type !== "tv") return;

		fetch(`/api/tmdb/tv/${content.id}`)
			.then((res) => res.json())
			.then((data: TvShow) => setTvDetails(data))
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

	async function handleSave(): Promise<void> {
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

			if (status === "planned") {
				await addToWatchlist({
					...entry,
					status: "planned",
					progress: undefined,
					rating: null,
				});

				try {
					await removeDiaryEntry(content.id, content.type);
				} catch {
					// Ignore if it was not in diary.
				}

				try {
					await deleteUserRating(supabase, {
						mediaId: content.id,
						mediaType: content.type,
					});
				} catch {
					// Ignore rating delete errors here.
				}

				await onSave?.(status);
				await onClose();
				return;
			}

			await updateDiaryEntry(entry);

			if (rating !== null) {
				await saveUserRating(supabase, {
					mediaId: content.id,
					mediaType: content.type,
					rating,
				});
			} else {
				await deleteUserRating(supabase, {
					mediaId: content.id,
					mediaType: content.type,
				});
			}

			await onSave?.(status);
			await onClose();
		} catch (error) {
			console.error(error);

			alert(
				error instanceof Error
					? error.message
					: "You need to log in first, or something went wrong while saving.",
			);
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
			<div className="relative w-full max-w-md rounded-2xl bg-[#0f0f14] p-5 text-white shadow-2xl">
				<button
					type="button"
					onClick={onClose}
					disabled={saving}
					className="absolute right-4 top-4 text-muted transition hover:text-white disabled:opacity-50"
					aria-label="Close"
				>
					<X className="h-5 w-5" />
				</button>

				<div className="flex gap-4 pr-8">
					<Image
						src={getPosterUrl(content.backdrop)}
						alt={content.title}
						width={80}
						height={120}
						className="h-[60px] w-[100px] rounded-lg object-cover"
					/>

					<div className="flex flex-col justify-center">
						<h2 className="line-clamp-1 text-lg font-semibold">
							{content.title}
						</h2>

						<p className="text-sm text-muted">
							{content.type === "movie" ? "Movie" : "TV Show"}
						</p>
					</div>
				</div>

				<div className="mt-6">
					<StatusSelector value={status} onChange={setStatus} />
				</div>

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

				{status !== "planned" && (
					<div className="mt-4">
						<StarRatingInput
							value={rating}
							onChange={setRating}
							disabled={saving}
						/>
					</div>
				)}

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