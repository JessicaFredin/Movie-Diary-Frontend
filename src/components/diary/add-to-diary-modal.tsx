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

type Props = {
	open: boolean;
	onClose: () => void;
	content: {
		id: number;
		type: "movie" | "tv";
		title: string;
		poster: string ;
		backdrop: string;
	};
};

export default function AddToDiaryModal({ open, onClose, content }: Props) {
	const [status, setStatus] = useState<"watching" | "completed" | "planned">(
		content.type === "movie" ? "completed" : "watching",
	);

	const [season, setSeason] = useState(1);
	const [episode, setEpisode] = useState(1);
	const [rating, setRating] = useState<number | null>(null);

	const [tvDetails, setTvDetails] = useState<TvShow | null>(null);

	useEffect(() => {
		if (!open || content.type !== "tv") return;

		fetch(`/api/tmdb/tv/${content.id}`)
			.then((res) => res.json())
			.then(setTvDetails)
			.catch(console.error);
	}, [open, content]);

	useEffect(() => {
		if (!tvDetails?.seasons?.length) return;

		const firstSeason = tvDetails.seasons[0].season_number;
		setSeason(firstSeason);
		setEpisode(1);
	}, [tvDetails]);

	if (!open) return null;

	function handleSave() {
		const finalStatus = status;
		let progress = undefined;

		if (
			content.type === "tv" &&
			tvDetails?.seasons &&
			status !== "planned"
		) {
			progress = calculateTvProgress(tvDetails.seasons, season, episode);
		}

		const entry = {
			id: content.id,
			type: content.type,
			title: content.title,
			poster: content.poster,
			backdrop: content.backdrop,
			status: finalStatus,
			progress,
			rating,
			updatedAt: new Date().toISOString(),
		};

		updateDiaryEntry(entry);
		onClose();
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
						<p className="text-sm text-gray-400 capitalize">
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
						className="flex-1 rounded-full bg-gray-800 py-2 text-sm"
					>
						Cancel
					</button>

					<button
						onClick={handleSave}
						className="flex-1 rounded-full bg-[#FF414E] py-2 text-sm font-semibold"
					>
						Save to diary
					</button>
				</div>
			</div>
		</div>
	);
}
