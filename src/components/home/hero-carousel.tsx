"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Hero from "./hero";
import { Movie, TvShow } from "@/types";

type Props = {
	items: (Movie | TvShow)[];
	intervalMs?: number;
};

function getMediaType(item: Movie | TvShow): "movie" | "tv" {
	if ("media_type" in item && item.media_type === "tv") return "tv";
	if ("media_type" in item && item.media_type === "movie") return "movie";

	return "title" in item ? "movie" : "tv";
}

function getMediaTitle(item: Movie | TvShow) {
	if ("title" in item && item.title) return item.title;
	if ("name" in item && item.name) return item.name;

	return "Untitled";
}

function getMediaYear(item: Movie | TvShow) {
	if ("release_date" in item && item.release_date) {
		return item.release_date.slice(0, 4);
	}

	if ("first_air_date" in item && item.first_air_date) {
		return item.first_air_date.slice(0, 4);
	}

	return undefined;
}

export default function HeroCarousel({ items, intervalMs = 4000 }: Props) {
	const [index, setIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	const validItems = useMemo(() => {
		return items.filter((item) => item.backdrop_path && item.overview);
	}, [items]);

	useEffect(() => {
		if (validItems.length === 0) return;

		setIndex((currentIndex) =>
			currentIndex >= validItems.length ? 0 : currentIndex,
		);
	}, [validItems.length]);

	useEffect(() => {
		if (validItems.length <= 1 || isPaused) return;

		const timer = window.setInterval(() => {
			setIndex((prev) => (prev + 1) % validItems.length);
		}, intervalMs);

		return () => window.clearInterval(timer);
	}, [validItems.length, intervalMs, isPaused]);

	if (validItems.length === 0) return null;

	const item = validItems[index];
	const type = getMediaType(item);

	function goToPrevious() {
		setIndex((prev) => (prev === 0 ? validItems.length - 1 : prev - 1));
	}

	function goToNext() {
		setIndex((prev) => (prev + 1) % validItems.length);
	}

	return (
		<div
			className="group/carousel relative overflow-hidden"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			<AnimatePresence mode="wait">
				<motion.div
					key={`${type}-${item.id}`}
					initial={{ opacity: 0, x: 40 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -40 }}
					transition={{
						duration: 0.35,
						ease: "easeInOut",
					}}
				>
					<Hero
						id={item.id}
						type={type}
						title={getMediaTitle(item)}
						description={item.overview}
						backdropPath={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
						posterPath={`https://image.tmdb.org/t/p/original${item.poster_path}`}
						year={getMediaYear(item)}
						rating={item.vote_average}
						genre_ids={item.genre_ids}
					/>
				</motion.div>
			</AnimatePresence>

			{validItems.length > 1 && (
				<>
					<button
						type="button"
						onClick={goToPrevious}
						className="absolute left-2 top-1/2 z-40 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white/70 opacity-0 backdrop-blur-sm transition duration-200 hover:bg-black/45 hover:text-white hover:opacity-100 group-hover/carousel:opacity-70 md:flex"
						aria-label="Previous slide"
					>
						<ChevronLeft className="h-5 w-5" />
					</button>

					<button
						type="button"
						onClick={goToNext}
						className="absolute right-4 top-1/2 z-40 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white/70 opacity-0 backdrop-blur-sm transition duration-200 hover:bg-black/45 hover:text-white hover:opacity-100 group-hover/carousel:opacity-70 md:flex"
						aria-label="Next slide"
					>
						<ChevronRight className="h-5 w-5" />
					</button>

					<div className="absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
						{validItems.map((slide, slideIndex) => (
							<button
								key={`${slide.id}-${slideIndex}`}
								type="button"
								onClick={() => setIndex(slideIndex)}
								className={`h-2.5 rounded-full transition ${
									index === slideIndex
										? "w-7 bg-accent"
										: "w-2.5 bg-white/40 hover:bg-white/70"
								}`}
								aria-label={`Go to slide ${slideIndex + 1}`}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
}
