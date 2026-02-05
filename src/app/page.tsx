"use client";

import { useState } from "react";
import useSWRInfinite from "swr/infinite";

import Row from "@/components/home/row";
import MovieCard from "@/components/home/movie-card";
import Filter from "@/components/home/filter";
import SearchBar from "@/components/home/search-bar";
import HeroCarousel from "@/components/home/hero-carousel";

import { fetcher } from "@/utils/fetcher";
import { Movie, TvShow, TMDBListResponse } from "@/types";
import MovieCardSkeleton from "@/components/home/movie-card-skeleton";
import AddToDiaryModal from "@/components/diary/add-to-diary-modal";

/* ---------------- TYPES ---------------- */

type SelectedItem = {
	id: number;
	type: "movie" | "tv";
	title: string;
	poster: string;
	backdrop: string;
};

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

const getSearchKey = (
	query: string,
	pageIndex: number,
	prev: TMDBListResponse<Movie | TvShow> | null,
) => {
	if (!query) return null;
	if (prev && pageIndex + 1 > prev.total_pages) return null;
	return `/api/tmdb/search?query=${encodeURIComponent(query)}&page=${pageIndex + 1}`;
};

/* ---------------- PAGE ---------------- */

export default function HomePage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [addModalOpen, setAddModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

	function handleAddToDiary(item: SelectedItem) {
		setSelectedItem(item);
		setAddModalOpen(true);
	}

	/* ---------- SEARCH ---------- */

	const {
		data: searchPages,
		size: searchSize,
		setSize: setSearchSize,
		isValidating: searchValidating,
	} = useSWRInfinite<TMDBListResponse<Movie | TvShow>>(
		(pageIndex, prev) => getSearchKey(searchQuery, pageIndex, prev),
		fetcher,
	);

	const searchResults = dedupeByMediaAndId(
		searchPages?.flatMap((p) => p.results) ?? [],
	);

	const isSearching = searchQuery.length > 0;

	/* ---------- TRENDING ---------- */

	const {
		data: trendingPages,
		size: trendingSize,
		setSize: setTrendingSize,
		isValidating: trendingValidating,
	} = useSWRInfinite<TMDBListResponse<Movie | TvShow>>(
		getTrendingKey,
		fetcher,
	);

	const trendingItems = dedupeByMediaAndId(
		trendingPages?.flatMap((p) => p.results) ?? [],
	);

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

	function dedupeByMediaAndId<T extends { id: number; media_type?: string }>(
		items: T[],
	) {
		const map = new Map<string, T>();

		for (const item of items) {
			if (!item?.id) continue;
			const key = `${item.media_type ?? "movie"}-${item.id}`;
			map.set(key, item);
		}

		return Array.from(map.values());
	}

	/* ---------- RENDER ---------- */

	return (
		<main>
			{/* HERO ONLY WHEN NOT SEARCHING */}
			{!isSearching && trendingItems.length > 0 && (
				<HeroCarousel items={trendingItems.slice(0, 10)} />
			)}

			<div className="px-6 md:px-12">
				<div className="flex items-center justify-between mb-6 mt-12">
					<SearchBar onSearch={setSearchQuery} />
					<Filter onFilterChange={() => {}} />
				</div>

				{/* SEARCH RESULTS */}
				{isSearching && (
					<>
						<h2 className="text-xl font-semibold text-white mb-4 px-2">
							Search results for “{searchQuery}”
						</h2>

						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
							{searchResults.map((item) => {
								if (
									!item?.id ||
									!item.media_type ||
									!item.poster_path ||
									!item.backdrop_path
								)
									return null;

								return (
									<MovieCard
										key={`${item.media_type}-${item.id}`}
										id={item.id}
										title={
											item.media_type === "movie"
												? item.title
												: item.name
										}
										posterPath={item.poster_path}
										backdropPath={item.backdrop_path}
										rating={item.vote_average}
										type={item.media_type}
										onAdd={handleAddToDiary}
									/>
								);
							})}
							{/* SKELETONS WHILE FETCHING MORE */}
							{searchValidating &&
								Array.from({ length: 12 }).map((_, i) => (
									<MovieCardSkeleton
										key={`search-skeleton-${i}`}
									/>
								))}
						</div>

						{searchResults.length > 0 && (
							<div className="flex justify-center mt-8">
								<button
									onClick={() =>
										setSearchSize(searchSize + 1)
									}
									className="px-4 py-2 rounded bg-white/10 hover:bg-white/20"
								>
									Load more
								</button>
							</div>
						)}
					</>
				)}

				{/* NORMAL HOME */}
				{!isSearching && (
					<>
						<Row
							title="Trending This Week"
							onScrollEnd={() =>
								!trendingValidating &&
								setTrendingSize(trendingSize + 1)
							}
							isLoadingMore={trendingValidating}
						>
							{trendingItems.map((item) => (
								<MovieCard
									key={`${item.media_type}-${item.id}`}
									id={item.id}
									title={
										item.media_type === "movie"
											? item.title
											: item.name
									}
									posterPath={item.poster_path}
									backdropPath={item.backdrop_path}
									rating={item.vote_average}
									type={item.media_type}
									onAdd={handleAddToDiary}
								/>
							))}
						</Row>

						<Row
							title="Top Movies"
							onScrollEnd={() =>
								!moviesValidating &&
								setMoviesSize(moviesSize + 1)
							}
							isLoadingMore={moviesValidating}
						>
							{popularMovies.map((movie) => (
								<MovieCard
									key={movie.id}
									id={movie.id}
									title={movie.title}
									posterPath={movie.poster_path}
									backdropPath={movie.backdrop_path}
									rating={movie.vote_average}
									type="movie"
									onAdd={handleAddToDiary}
								/>
							))}
						</Row>

						<Row
							title="Top TV Shows"
							onScrollEnd={() =>
								!tvValidating && setTvSize(tvSize + 1)
							}
							isLoadingMore={tvValidating}
						>
							{popularTvShows.map((tv) => (
								<MovieCard
									key={tv.id}
									id={tv.id}
									title={tv.name}
									posterPath={tv.poster_path}
									backdropPath={tv.backdrop_path}
									rating={tv.vote_average}
									type="tv"
									onAdd={handleAddToDiary}
								/>
							))}
						</Row>
					</>
				)}
			</div>

			{selectedItem && (
				<AddToDiaryModal
					open={addModalOpen}
					onClose={() => setAddModalOpen(false)}
					content={selectedItem}
				/>
			)}
		</main>
	);
}
