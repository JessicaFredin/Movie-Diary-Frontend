// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import Hero from "./hero";
// import { Movie, TvShow } from "@/types";

// type Props = {
// 	items: (Movie | TvShow)[];
// 	intervalMs?: number;
// };

// function getMediaType(item: Movie | TvShow): "movie" | "tv" {
// 	if ("media_type" in item && item.media_type === "tv") return "tv";
// 	if ("media_type" in item && item.media_type === "movie") return "movie";

// 	return "title" in item ? "movie" : "tv";
// }

// function getMediaTitle(item: Movie | TvShow) {
// 	if ("title" in item && item.title) return item.title;
// 	if ("name" in item && item.name) return item.name;

// 	return "Untitled";
// }

// function getMediaYear(item: Movie | TvShow) {
// 	if ("release_date" in item && item.release_date) {
// 		return item.release_date.slice(0, 4);
// 	}

// 	if ("first_air_date" in item && item.first_air_date) {
// 		return item.first_air_date.slice(0, 4);
// 	}

// 	return undefined;
// }

// export default function HeroCarousel({ items, intervalMs = 4000 }: Props) {
// 	const [index, setIndex] = useState(0);
// 	const [isPaused, setIsPaused] = useState(false);

// 	const validItems = useMemo(() => {
// 		return items.filter((item) => item.backdrop_path && item.overview);
// 	}, [items]);

// 	useEffect(() => {
// 		if (validItems.length === 0) return;

// 		setIndex((currentIndex) =>
// 			currentIndex >= validItems.length ? 0 : currentIndex,
// 		);
// 	}, [validItems.length]);

// 	useEffect(() => {
// 		if (validItems.length <= 1 || isPaused) return;

// 		const timer = window.setInterval(() => {
// 			setIndex((prev) => (prev + 1) % validItems.length);
// 		}, intervalMs);

// 		return () => window.clearInterval(timer);
// 	}, [validItems.length, intervalMs, isPaused]);

// 	if (validItems.length === 0) return null;

// 	const item = validItems[index];
// 	const type = getMediaType(item);

// 	function goToPrevious() {
// 		setIndex((prev) => (prev === 0 ? validItems.length - 1 : prev - 1));
// 	}

// 	function goToNext() {
// 		setIndex((prev) => (prev + 1) % validItems.length);
// 	}

// 	return (
// 		<div
// 			className="group/carousel relative overflow-hidden"
// 			onMouseEnter={() => setIsPaused(true)}
// 			onMouseLeave={() => setIsPaused(false)}
// 		>
// 			<AnimatePresence mode="wait">
// 				<motion.div
// 					key={`${type}-${item.id}`}
// 					initial={{ opacity: 0, x: 40 }}
// 					animate={{ opacity: 1, x: 0 }}
// 					exit={{ opacity: 0, x: -40 }}
// 					transition={{
// 						duration: 0.35,
// 						ease: "easeInOut",
// 					}}
// 				>
// 					<Hero
// 						id={item.id}
// 						type={type}
// 						title={getMediaTitle(item)}
// 						description={item.overview}
// 						backdropPath={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
// 						posterPath={`https://image.tmdb.org/t/p/original${item.poster_path}`}
// 						year={getMediaYear(item)}
// 						rating={item.vote_average}
// 						genre_ids={item.genre_ids}
// 					/>
// 				</motion.div>
// 			</AnimatePresence>

// 			{validItems.length > 1 && (
// 				<>
// 					<button
// 						type="button"
// 						onClick={goToPrevious}
// 						className="absolute left-2 top-1/2 z-40 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white/70 opacity-0 backdrop-blur-sm transition duration-200 hover:bg-black/45 hover:text-white hover:opacity-100 group-hover/carousel:opacity-70 md:flex"
// 						aria-label="Previous slide"
// 					>
// 						<ChevronLeft className="h-5 w-5" />
// 					</button>

// 					<button
// 						type="button"
// 						onClick={goToNext}
// 						className="absolute right-4 top-1/2 z-40 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white/70 opacity-0 backdrop-blur-sm transition duration-200 hover:bg-black/45 hover:text-white hover:opacity-100 group-hover/carousel:opacity-70 md:flex"
// 						aria-label="Next slide"
// 					>
// 						<ChevronRight className="h-5 w-5" />
// 					</button>

// 					<div className="absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
// 						{validItems.map((slide, slideIndex) => (
// 							<button
// 								key={`${slide.id}-${slideIndex}`}
// 								type="button"
// 								onClick={() => setIndex(slideIndex)}
// 								className={`h-2.5 rounded-full transition ${
// 									index === slideIndex
// 										? "w-7 bg-accent"
// 										: "w-2.5 bg-white/40 hover:bg-white/70"
// 								}`}
// 								aria-label={`Go to slide ${slideIndex + 1}`}
// 							/>
// 						))}
// 					</div>
// 				</>
// 			)}
// 		</div>
// 	);
// }

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Star } from "lucide-react";

import Hero from "./hero";
import ExpandableText from "@/components/details/expandable-text";
import { Movie, TvShow } from "@/types";

type Props = {
	items: (Movie | TvShow)[];
	intervalMs?: number;
};

const movieGenreMap: Record<number, string> = {
	28: "Action",
	12: "Adventure",
	16: "Animation",
	35: "Comedy",
	80: "Crime",
	99: "Documentary",
	18: "Drama",
	10751: "Family",
	14: "Fantasy",
	36: "History",
	27: "Horror",
	10402: "Music",
	9648: "Mystery",
	10749: "Romance",
	878: "Sci-Fi",
	10770: "TV Movie",
	53: "Thriller",
	10752: "War",
	37: "Western",
};

const tvGenreMap: Record<number, string> = {
	10759: "Action",
	16: "Animation",
	35: "Comedy",
	80: "Crime",
	99: "Documentary",
	18: "Drama",
	10751: "Family",
	10762: "Kids",
	9648: "Mystery",
	10763: "News",
	10764: "Reality",
	10765: "Sci-Fi",
	10766: "Soap",
	10767: "Talk",
	10768: "War",
	37: "Western",
};

function getMediaType(item: Movie | TvShow): "movie" | "tv" {
	if ("media_type" in item && item.media_type === "tv") return "tv";
	if ("media_type" in item && item.media_type === "movie") return "movie";

	return "title" in item ? "movie" : "tv";
}

function getMediaTitle(item: Movie | TvShow): string {
	if ("title" in item && item.title) return item.title;
	if ("name" in item && item.name) return item.name;

	return "Untitled";
}

function getMediaYear(item: Movie | TvShow): string | undefined {
	if ("release_date" in item && item.release_date) {
		return item.release_date.slice(0, 4);
	}

	if ("first_air_date" in item && item.first_air_date) {
		return item.first_air_date.slice(0, 4);
	}

	return undefined;
}

function getMediaHref(id: number, type: "movie" | "tv"): string {
	return type === "movie" ? `/movie/${id}` : `/tv/${id}`;
}

function getImageUrl(path: string | null | undefined): string {
	if (!path) return "/logo.png";
	if (path.startsWith("http")) return path;

	return `https://image.tmdb.org/t/p/original${path}`;
}

function getGenreLabels(item: Movie | TvShow, type: "movie" | "tv"): string[] {
	const genreIds =
		"genre_ids" in item && Array.isArray(item.genre_ids)
			? item.genre_ids
			: [];

	const genreMap = type === "movie" ? movieGenreMap : tvGenreMap;

	return genreIds
		.map((id) => genreMap[id])
		.filter((name): name is string => Boolean(name));
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
			setIndex(
				(previousIndex) => (previousIndex + 1) % validItems.length,
			);
		}, intervalMs);

		return () => window.clearInterval(timer);
	}, [validItems.length, intervalMs, isPaused]);

	if (validItems.length === 0) return null;

	const item = validItems[index];
	const type = getMediaType(item);
	const title = getMediaTitle(item);
	const year = getMediaYear(item);
	const href = getMediaHref(item.id, type);
	const genres = getGenreLabels(item, type).slice(0, 3);

	function goToPrevious(): void {
		setIndex((previousIndex) =>
			previousIndex === 0 ? validItems.length - 1 : previousIndex - 1,
		);
	}

	function goToNext(): void {
		setIndex((previousIndex) => (previousIndex + 1) % validItems.length);
	}

	function handleSwipeEnd(
		_event: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo,
	): void {
		const swipeDistance = info.offset.x;
		const swipeVelocity = info.velocity.x;

		const distanceThreshold = 75;
		const velocityThreshold = 500;

		if (
			swipeDistance <= -distanceThreshold ||
			swipeVelocity <= -velocityThreshold
		) {
			goToNext();
			return;
		}

		if (
			swipeDistance >= distanceThreshold ||
			swipeVelocity >= velocityThreshold
		) {
			goToPrevious();
		}
	}

	return (
		<div
			className="group/carousel relative overflow-hidden bg-black"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			{/* DESKTOP ONLY */}
			<div className="hidden lg:block">
				<AnimatePresence mode="wait">
					<motion.div
						key={`desktop-${type}-${item.id}`}
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
							title={title}
							description={item.overview}
							backdropPath={getImageUrl(item.backdrop_path)}
							posterPath={getImageUrl(item.poster_path)}
							year={year}
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
							className="absolute left-3 top-1/2 z-40 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white/70 opacity-0 backdrop-blur-sm transition duration-200 hover:bg-black/45 hover:text-white hover:opacity-100 group-hover/carousel:opacity-70 lg:flex"
							aria-label="Previous slide"
						>
							<ChevronLeft className="h-5 w-5" />
						</button>

						<button
							type="button"
							onClick={goToNext}
							className="absolute right-4 top-1/2 z-40 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/20 text-white/70 opacity-0 backdrop-blur-sm transition duration-200 hover:bg-black/45 hover:text-white hover:opacity-100 group-hover/carousel:opacity-70 lg:flex"
							aria-label="Next slide"
						>
							<ChevronRight className="h-5 w-5" />
						</button>

						<div className="absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
							{validItems.map((slide, slideIndex) => (
								<button
									key={`desktop-dot-${slide.id}-${slideIndex}`}
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

			{/* MOBILE + TABLET ONLY */}
			<div
				className="relative block h-[540px] overflow-hidden sm:h-[610px] md:h-[680px] lg:hidden"
				style={{ touchAction: "pan-y" }}
			>
				<AnimatePresence mode="wait">
					<motion.div
						key={`responsive-${type}-${item.id}`}
						className="absolute inset-0 cursor-grab active:cursor-grabbing"
						initial={{ opacity: 0, scale: 1.02 }}
						animate={{ opacity: 1, scale: 1, x: 0 }}
						exit={{ opacity: 0, scale: 1.01 }}
						transition={{
							duration: 0.35,
							ease: "easeInOut",
						}}
						drag="x"
						dragConstraints={{ left: 0, right: 0 }}
						dragElastic={0.18}
						dragMomentum={false}
						onDragStart={() => setIsPaused(true)}
						onDragEnd={handleSwipeEnd}
					>
						<Image
							src={getImageUrl(item.backdrop_path)}
							alt={title}
							fill
							priority
							sizes="100vw"
							className="object-cover object-center"
						/>

						<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black" />
						<div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
						<div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black via-black/95 to-transparent" />

						<div className="absolute inset-x-0 bottom-16 z-20 px-5 sm:px-8 md:bottom-20 md:px-12">
							<div className="grid items-end gap-8 md:grid-cols-[minmax(0,1fr)_190px]">
								<div className="min-w-0 max-w-[620px]">
									<div className="mb-3 flex flex-wrap items-center gap-2">
										{typeof item.vote_average ===
											"number" && (
											<div className="flex items-center gap-1 text-xs font-bold text-yellow-300">
												<Star className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
												<span>
													{item.vote_average.toFixed(
														1,
													)}
												</span>
											</div>
										)}

										<h2 className="line-clamp-2 text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
											{title}
										</h2>

										{year && (
											<span className="shrink-0 text-xs font-semibold text-white/80">
												({year})
											</span>
										)}
									</div>

									<div className="mt-3 max-w-[560px] text-sm leading-6 text-gray-100 sm:text-base sm:leading-7 md:mt-4">
										<ExpandableText
											text={item.overview ?? ""}
										/>
									</div>

									{genres.length > 0 && (
										<div className="mt-4 flex flex-wrap gap-2">
											{genres.map((genre) => (
												<span
													key={genre}
													className="rounded-full border border-accent/70  bg-white/10 px-3 py-1 text-xs text-white shadow-sm backdrop-blur-md"
												>
													{genre}
												</span>
											))}
										</div>
									)}

									<div className="mt-5 flex items-center gap-3 md:mt-6">
										<Link
											href={href}
											className="rounded-full bg-accent px-5 py-3 text-xs font-black text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover sm:px-6 sm:text-sm"
										>
											More Info
										</Link>

										<Link
											href={href}
											className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-sm transition hover:border-accent hover:text-accent sm:h-12 sm:w-12"
											aria-label={`Open ${title}`}
										>
											<Plus className="h-5 w-5" />
										</Link>
									</div>
								</div>

								{item.poster_path && (
									<Link
										href={href}
										className="relative hidden aspect-[2/3] w-[190px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 md:block"
									>
										<Image
											src={getImageUrl(item.poster_path)}
											alt={title}
											fill
											sizes="190px"
											className="object-cover"
										/>
									</Link>
								)}
							</div>
						</div>
					</motion.div>
				</AnimatePresence>

				{validItems.length > 1 && (
					<>
						<button
							type="button"
							onClick={goToPrevious}
							className="absolute left-4 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white/80 backdrop-blur-sm transition hover:bg-black/60 hover:text-white sm:flex"
							aria-label="Previous slide"
						>
							<ChevronLeft className="h-5 w-5" />
						</button>

						<button
							type="button"
							onClick={goToNext}
							className="absolute right-4 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white/80 backdrop-blur-sm transition hover:bg-black/60 hover:text-white sm:flex"
							aria-label="Next slide"
						>
							<ChevronRight className="h-5 w-5" />
						</button>

						<div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 md:bottom-8">
							{validItems.map((slide, slideIndex) => (
								<button
									key={`responsive-dot-${slide.id}-${slideIndex}`}
									type="button"
									onClick={() => setIndex(slideIndex)}
									className={`h-2 rounded-full transition ${
										index === slideIndex
											? "w-7 bg-accent"
											: "w-2 bg-white/40 hover:bg-white/70"
									}`}
									aria-label={`Go to slide ${slideIndex + 1}`}
								/>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
}