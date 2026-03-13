"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import StatusSelector from "./status-selector";
import TvProgressPicker from "./tv-progress-picker";
import RatingInput from "./rating-input";
import type { TvShow } from "@/types";
import { updateDiaryEntry } from "@/utils/diary-storage";
import { calculateTvProgress } from "@/utils/progress";
import { getPosterUrl } from "@/utils/tmdb-image";
import { DiaryEntry } from "@/types/diary";

type Props = {
	open: boolean;
	onClose: () => void;
	content: {
		id: number;
		type: "movie" | "tv";
		title: string;
		poster: string;
		backdrop: string;
	};
	initialData?: DiaryEntry; 
};

export default function AddToDiaryModal({
	open,
	onClose,
	content,
	initialData,
}: Props) {
	const [status, setStatus] = useState<"watching" | "completed" | "planned">(
		content.type === "movie" ? "completed" : "watching",
	);

	const [season, setSeason] = useState(1);
	const [episode, setEpisode] = useState(1);
	const [rating, setRating] = useState<number | null>(null);

	const [tvDetails, setTvDetails] = useState<TvShow | null>(null);

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

		// ADD MODE (reset defaults)
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
	}, [open, content]);

	useEffect(() => {
		if (!tvDetails?.seasons?.length) return;
		if (initialData) return; // 🔥 do NOT override edit mode

		const firstSeason = tvDetails.seasons[0].season_number;
		setSeason(firstSeason);
		setEpisode(1);
	}, [tvDetails, initialData]);

	if (!open) return null;

	/* -------------------------------
	   SAVE (ADD OR EDIT)
	--------------------------------*/
	function handleSave() {
		let progress = undefined;

		if (
			content.type === "tv" &&
			tvDetails?.seasons &&
			status !== "planned"
		) {
			progress = calculateTvProgress(tvDetails.seasons, season, episode);
		}

		const entry: DiaryEntry = {
			id: content.id,
			type: content.type,
			title: content.title,
			poster: content.poster,
			backdrop: content.backdrop,
			status,
			progress,
			rating,
			updatedAt: new Date().toISOString(),
		};

		updateDiaryEntry(entry);
		onClose();
	}

	// function handleSave() {
	// 	const finalStatus = status;
	// 	let progress = undefined;

	// 	if (
	// 		content.type === "tv" &&
	// 		tvDetails?.seasons &&
	// 		status !== "planned"
	// 	) {
	// 		progress = calculateTvProgress(tvDetails.seasons, season, episode);
	// 	}

	// 	const entry = {
	// 		id: content.id,
	// 		type: content.type,
	// 		title: content.title,
	// 		poster: content.poster,
	// 		backdrop: content.backdrop,
	// 		status: finalStatus,
	// 		progress,
	// 		rating,
	// 		updatedAt: new Date().toISOString(),
	// 	};

	// 	updateDiaryEntry(entry);
	// 	onClose();
	// }

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
				<div className="mt-4">
					<RatingInput value={rating} onChange={setRating} />
				</div>

				{/* ACTIONS */}
				<div className="mt-6 flex gap-3">
					<button
						onClick={onClose}
						className="flex-1 rounded-full bg-surface-elevated py-2 text-sm"
					>
						Cancel
					</button>

					<button
						onClick={handleSave}
						className="flex-1 rounded-full bg-accent py-2 text-sm font-semibold"
					>
						Save to diary
					</button>
				</div>
			</div>
		</div>
	);
}
