"use client";

import { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Hero from "./hero";
import { Movie, TvShow } from "@/types";

type Props = {
	items: (Movie | TvShow)[];
	intervalMs?: number;
};

export default function HeroCarousel({ items, intervalMs = 10000 }: Props) {
	const [index, setIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	const validItems = useMemo(
		() => items.filter((item) => item.backdrop_path && item.overview),
		[items],
	);

	useEffect(() => {
		if (validItems.length === 0 || isPaused) return;

		const timer = setInterval(() => {
			setIndex((prev) => (prev + 1) % validItems.length);
		}, intervalMs);

		return () => clearInterval(timer);
	}, [validItems.length, intervalMs, isPaused]);

	if (validItems.length === 0) return null;

	const item = validItems[index];

	return (
		<div
			className="relative overflow-hidden"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			<AnimatePresence mode="wait">
				<motion.div
					key={item.id}
					initial={{ opacity: 0, x: 40 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -40 }}
					transition={{
						duration: 0.3,
						ease: "easeInOut",
					}}
				>
					<Hero
						id={item.id}
						type={item.media_type}
						title={
							item.media_type === "movie" ? item.title : item.name
						}
						description={item.overview}
						backdropPath={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
						posterPath={`https://image.tmdb.org/t/p/original${item.poster_path}`}
						year={
							item.media_type === "movie"
								? item.release_date?.slice(0, 4)
								: item.first_air_date?.slice(0, 4)
						}
						rating={item.vote_average}
						genre_ids={item.genre_ids}
					/>
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
