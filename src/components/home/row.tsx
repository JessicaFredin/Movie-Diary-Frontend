"use client";

import { ReactNode } from "react";
import MovieCardSkeleton from "./movie-card-skeleton";

type Props = {
	title: string;
	children: ReactNode;
	onScrollEnd?: () => void;
	isLoadingMore?: boolean;
};

export default function Row({
	title,
	children,
	onScrollEnd,
	isLoadingMore,
}: Props) {
	const PREFETCH_OFFSET = 700;

	return (
		<section className="mb-8">
			<h2 className="text-xl md:text-2xl font-semibold text-white mb-4 px-2">
				{title}
			</h2>

			{/* Horizontal Scroll with hidden scrollbar */}
			<div
				className="flex gap-4 overflow-x-auto px-2 overflow-y-hidden snap-x snap-mandatory
				scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
				onScroll={(e) => {
					console.log("SCROLLING ROW"); // 👈 MUST appear
					if (!onScrollEnd || isLoadingMore) return;

					const el = e.currentTarget;

					if (
						el.scrollLeft + el.clientWidth >=
						el.scrollWidth - PREFETCH_OFFSET
					) {
						console.log("SCROLL END TRIGGERED"); // 👈 MUST appear
						onScrollEnd();
					}
				}}
		
			>
				{children}

				{/* Skeletons while fetching */}
				{isLoadingMore &&
					Array.from({ length: 8 }).map((_, i) => (
						<MovieCardSkeleton key={i} />
					))}
			</div>
		</section>
	);
}
