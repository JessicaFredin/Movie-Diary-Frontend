"use client";

import { ReactNode, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
	const rowRef = useRef<HTMLDivElement>(null);
	const PREFETCH_OFFSET = 700;

	function scrollRow(direction: "left" | "right") {
		const row = rowRef.current;
		if (!row) return;

		row.scrollBy({
			left: direction === "right" ? 700 : -700,
			behavior: "smooth",
		});
	}

	function handleScroll() {
		const row = rowRef.current;
		if (!row || !onScrollEnd || isLoadingMore) return;

		if (
			row.scrollLeft + row.clientWidth >=
			row.scrollWidth - PREFETCH_OFFSET
		) {
			onScrollEnd();
		}
	}

	return (
		<section className="relative mb-10 overflow-visible">
			<div className="mb-2 flex items-center justify-between px-2">
				<h2 className="text-xl md:text-2xl font-semibold text-white">
					{title}
				</h2>

				<div className="hidden md:flex items-center gap-2">
					<button
						type="button"
						onClick={() => scrollRow("left")}
						className="flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white hover:bg-accent transition"
						aria-label="Scroll left"
					>
						<ChevronLeft className="h-5 w-5" />
					</button>

					<button
						type="button"
						onClick={() => scrollRow("right")}
						className="flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white hover:bg-accent transition"
						aria-label="Scroll right"
					>
						<ChevronRight className="h-5 w-5" />
					</button>
				</div>
			</div>

			<div
				ref={rowRef}
				onScroll={handleScroll}
				className="
					flex gap-5 overflow-x-auto px-2 pt-4 pb-6
					snap-x snap-mandatory scroll-smooth
					scrollbar-hide [&::-webkit-scrollbar]:hidden
					[-ms-overflow-style:'none'] [scrollbar-width:'none']
				"
			>
				{children}

				{isLoadingMore &&
					Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className="shrink-0">
							<MovieCardSkeleton />
						</div>
					))}
			</div>
		</section>
	);
}
