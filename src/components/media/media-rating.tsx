"use client";

import { Star } from "lucide-react";

interface Props {
	voteAverage?: number;
	voteCount?: number;
}

export default function MediaRating({ voteAverage, voteCount }: Props) {
	return (
		<div className="flex items-center gap-3">
			<div className="flex items-center gap-2 bg-accent/10 backdrop-blur-md px-4 py-2 rounded-full">
				<Star className="w-4 h-4 text-accent fill-accent" />
				<span className="font-semibold">
					{voteAverage ? voteAverage.toFixed(1) : "—"}
				</span>
				<span className="text-muted text-xs">/ 10</span>
			</div>

			{voteCount && (
				<span className="text-muted">
					{voteCount.toLocaleString()} ratings
				</span>
			)}
		</div>
	);
}
