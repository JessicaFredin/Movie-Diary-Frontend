"use client";

import useSWRInfinite from "swr/infinite";

import Row from "@/components/home/row";
import Filter from "@/components/home/filter";
import HeroCarousel from "@/components/home/hero-carousel";
import HeroCarouselSkeleton from "@/components/home/hero-carousel-skeleton";
import MediaCard from "@/components/media/media-card";

import { fetcher } from "@/utils/fetcher";
import type { Movie, TvShow, TMDBListResponse } from "@/types";

/* ---------------- KEYS ---------------- */

const getTrendingKey = (
	pageIndex: number,
	prev: TMDBListResponse<Movie | TvShow> | null,
) => {
	if (prev && pageIndex + 1 > prev.total_pages) return null;
	return `/api/tmdb/trending?type=all&timeWindow=week&page=${pageIndex + 1}`;
};

const getMoviesKey = (
	pageIndex: number,
	prev: TMDBListResponse<Movie> | null,
) => {
	if (prev && pageIndex + 1 > prev.total_pages) return null;
	return `/api/tmdb/popular-movies?page=${pageIndex + 1}`;
};

const getTvKey = (pageIndex: number, prev: TMDBListResponse<TvShow> | null) => {
	if (prev && pageIndex + 1 > prev.total_pages) return null;
	return `/api/tmdb/popular-tv-shows?page=${pageIndex + 1}`;
};

/* ---------------- HELPERS ---------------- */

function dedupeByMediaAndId<T extends { id: number; media_type?: string }>(
	items: T[],
) {
	const map = new Map<string, T>();

	for (const item of items) {
		if (!item?.id) continue;

		const type = item.media_type ?? ("title" in item ? "movie" : "tv");
		const key = `${type}-${item.id}`;

		map.set(key, item);
	}

	return Array.from(map.values());
}

function getSearchItemType(item: Movie | TvShow): "movie" | "tv" | null {
	if (item.media_type === "movie") return "movie";
	if (item.media_type === "tv") return "tv";

	if ("title" in item) return "movie";
	if ("name" in item) return "tv";

	return null;
}

function getSearchItemTitle(item: Movie | TvShow) {
	if ("title" in item) return item.title;
	if ("name" in item) return item.name;

	return "Untitled";
}

/* ---------------- PAGE ---------------- */

export default function HomePage() {
	/* ---------- TRENDING ---------- */

	const {
		data: trendingPages,
		size: trendingSize,
		setSize: setTrendingSize,
		isValidating: trendingValidating,
		error: trendingError,
	} = useSWRInfinite<TMDBListResponse<Movie | TvShow>>(
		getTrendingKey,
		fetcher,
	);

	const trendingItems = dedupeByMediaAndId(
		trendingPages?.flatMap((p) => p.results) ?? [],
	);

	const showHeroSkeleton = !trendingPages && !trendingError;

	/* ---------- MOVIES ---------- */

	const {
		data: moviePages,
		size: moviesSize,
		setSize: setMoviesSize,
		isValidating: moviesValidating,
	} = useSWRInfinite<TMDBListResponse<Movie>>(getMoviesKey, fetcher);

	const popularMovies = dedupeByMediaAndId(
		moviePages?.flatMap((p) => p.results) ?? [],
	);

	/* ---------- TV ---------- */

	const {
		data: tvPages,
		size: tvSize,
		setSize: setTvSize,
		isValidating: tvValidating,
	} = useSWRInfinite<TMDBListResponse<TvShow>>(getTvKey, fetcher);

	const popularTvShows = dedupeByMediaAndId(
		tvPages?.flatMap((p) => p.results) ?? [],
	);

	return (
		<main>
			{showHeroSkeleton ? (
				<HeroCarouselSkeleton />
			) : (
				trendingItems.length > 0 && (
					<HeroCarousel items={trendingItems.slice(0, 10)} />
				)
			)}

			<div className="px-6 md:px-12">
				<div className="mb-6 mt-12 flex items-center justify-end">
					<Filter onFilterChange={() => {}} />
				</div>

				<Row
					title="Trending This Week"
					onScrollEnd={() =>
						!trendingValidating && setTrendingSize(trendingSize + 1)
					}
					isLoadingMore={trendingValidating}
				>
					{trendingItems.map((item) => {
						const mediaType = getSearchItemType(item);

						if (!mediaType || !item.id || !item.poster_path) {
							return null;
						}

						return (
							<MediaCard
								key={`${mediaType}-${item.id}`}
								id={item.id}
								type={mediaType}
								title={getSearchItemTitle(item)}
								posterPath={item.poster_path}
								backdropPath={
									item.backdrop_path ?? item.poster_path
								}
								rating={item.vote_average}
								variant="row"
							/>
						);
					})}
				</Row>

				<Row
					title="Top Movies"
					onScrollEnd={() =>
						!moviesValidating && setMoviesSize(moviesSize + 1)
					}
					isLoadingMore={moviesValidating}
				>
					{popularMovies.map((movie) => {
						if (!movie.id || !movie.poster_path) {
							return null;
						}

						return (
							<MediaCard
								key={movie.id}
								id={movie.id}
								type="movie"
								title={movie.title}
								posterPath={movie.poster_path}
								backdropPath={
									movie.backdrop_path ?? movie.poster_path
								}
								rating={movie.vote_average}
								variant="row"
							/>
						);
					})}
				</Row>

				<Row
					title="Top TV Shows"
					onScrollEnd={() => !tvValidating && setTvSize(tvSize + 1)}
					isLoadingMore={tvValidating}
				>
					{popularTvShows.map((tv) => {
						if (!tv.id || !tv.poster_path) {
							return null;
						}

						return (
							<MediaCard
								key={tv.id}
								id={tv.id}
								type="tv"
								title={tv.name}
								posterPath={tv.poster_path}
								backdropPath={
									tv.backdrop_path ?? tv.poster_path
								}
								rating={tv.vote_average}
								variant="row"
							/>
						);
					})}
				</Row>
			</div>
		</main>
	);
}
