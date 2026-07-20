"use client";

import { Star } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type MediaType = "movie" | "tv";

type Props = {
	mediaId: number;
	mediaType: MediaType;
	tmdbRating: number | null | undefined;
	tmdbVoteCount: number | null | undefined;
	refreshKey?: number;
};

type RatingRow = {
	rating: number;
};

function formatCount(count: number) {
	if (count === 1) return "1 rating";
	return `${count.toLocaleString()} ratings`;
}

export default function MediaRatings({
	mediaId,
	mediaType,
	tmdbRating,
	tmdbVoteCount,
	refreshKey = 0,
}: Props) {
	const supabase = useMemo(() => createClient(), []);

	const [userAverage, setUserAverage] = useState<number | null>(null);
	const [userCount, setUserCount] = useState(0);
	const [loading, setLoading] = useState(true);

	const loadRatings = useCallback(async () => {
		setLoading(true);

		const { data, error } = await supabase
			.from("user_ratings")
			.select("rating")
			.eq("media_id", String(mediaId))
			.eq("media_type", mediaType);

		if (error) {
			console.error("Failed to load user ratings:", error.message);
			setUserAverage(null);
			setUserCount(0);
			setLoading(false);
			return;
		}

		const ratings = (data ?? []) as RatingRow[];

		if (ratings.length === 0) {
			setUserAverage(null);
			setUserCount(0);
			setLoading(false);
			return;
		}

		const total = ratings.reduce(
			(sum, item) => sum + Number(item.rating),
			0,
		);

		setUserAverage(total / ratings.length);
		setUserCount(ratings.length);
		setLoading(false);
	}, [mediaId, mediaType, supabase]);

	useEffect(() => {
		loadRatings();
	}, [loadRatings, refreshKey]);

	return (
		<div className="flex flex-wrap items-center gap-3">
			<div className="flex min-w-[155px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2">
				<div className="flex items-center gap-2">
					<Star className="h-4 w-4 fill-accent text-accent" />

					<div className="flex items-end gap-1">
						<span className="text-xl font-black text-white">
							{typeof tmdbRating === "number"
								? tmdbRating.toFixed(1)
								: "—"}
						</span>

						<span className="pb-0.5 text-xs text-muted">/ 10</span>
					</div>
				</div>

				<div className="h-7 w-px bg-white/10" />

				<div>
					<p className="text-[10px] uppercase tracking-wide text-muted">
						TMDB
					</p>

					<p className="text-xs text-white">
						{typeof tmdbVoteCount === "number"
							? formatCount(tmdbVoteCount)
							: "No ratings"}
					</p>
				</div>
			</div>

			<div className="flex min-w-[155px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2">
				<div className="flex items-center gap-2">
					<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

					<div className="flex items-end gap-1">
						<span className="text-xl font-black text-white">
							{loading
								? "—"
								: userAverage !== null
									? userAverage.toFixed(1)
									: "—"}
						</span>

						<span className="pb-0.5 text-xs text-muted">/ 10</span>
					</div>
				</div>

				<div className="h-7 w-px bg-white/10" />

				<div>
					<p className="text-[10px] uppercase tracking-wide text-muted">
						Users
					</p>

					<p className="text-xs text-white">
						{loading ? "Loading..." : formatCount(userCount)}
					</p>
				</div>
			</div>
		</div>
	);
}
