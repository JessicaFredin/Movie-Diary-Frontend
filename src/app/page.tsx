// "use client";

// import useSWRInfinite from "swr/infinite";

// import Row from "@/components/home/row";
// import Filter from "@/components/home/filter";
// import HeroCarousel from "@/components/home/hero-carousel";
// import HeroCarouselSkeleton from "@/components/home/hero-carousel-skeleton";
// import MediaCard from "@/components/media/media-card";

// import { fetcher } from "@/utils/fetcher";
// import type { Movie, TvShow, TMDBListResponse } from "@/types";

// /* ---------------- KEYS ---------------- */

// const getTrendingKey = (
// 	pageIndex: number,
// 	prev: TMDBListResponse<Movie | TvShow> | null,
// ) => {
// 	if (prev && pageIndex + 1 > prev.total_pages) return null;
// 	return `/api/tmdb/trending?type=all&timeWindow=week&page=${pageIndex + 1}`;
// };

// const getMoviesKey = (
// 	pageIndex: number,
// 	prev: TMDBListResponse<Movie> | null,
// ) => {
// 	if (prev && pageIndex + 1 > prev.total_pages) return null;
// 	return `/api/tmdb/popular-movies?page=${pageIndex + 1}`;
// };

// const getTvKey = (pageIndex: number, prev: TMDBListResponse<TvShow> | null) => {
// 	if (prev && pageIndex + 1 > prev.total_pages) return null;
// 	return `/api/tmdb/popular-tv-shows?page=${pageIndex + 1}`;
// };

// /* ---------------- HELPERS ---------------- */

// function dedupeByMediaAndId<T extends { id: number; media_type?: string }>(
// 	items: T[],
// ) {
// 	const map = new Map<string, T>();

// 	for (const item of items) {
// 		if (!item?.id) continue;

// 		const type = item.media_type ?? ("title" in item ? "movie" : "tv");
// 		const key = `${type}-${item.id}`;

// 		map.set(key, item);
// 	}

// 	return Array.from(map.values());
// }

// function getSearchItemType(item: Movie | TvShow): "movie" | "tv" | null {
// 	if (item.media_type === "movie") return "movie";
// 	if (item.media_type === "tv") return "tv";

// 	if ("title" in item) return "movie";
// 	if ("name" in item) return "tv";

// 	return null;
// }

// function getSearchItemTitle(item: Movie | TvShow) {
// 	if ("title" in item) return item.title;
// 	if ("name" in item) return item.name;

// 	return "Untitled";
// }

// /* ---------------- PAGE ---------------- */

// export default function HomePage() {
// 	/* ---------- TRENDING ---------- */

// 	const {
// 		data: trendingPages,
// 		size: trendingSize,
// 		setSize: setTrendingSize,
// 		isValidating: trendingValidating,
// 		error: trendingError,
// 	} = useSWRInfinite<TMDBListResponse<Movie | TvShow>>(
// 		getTrendingKey,
// 		fetcher,
// 	);

// 	const trendingItems = dedupeByMediaAndId(
// 		trendingPages?.flatMap((p) => p.results) ?? [],
// 	);

// 	const showHeroSkeleton = !trendingPages && !trendingError;

// 	/* ---------- MOVIES ---------- */

// 	const {
// 		data: moviePages,
// 		size: moviesSize,
// 		setSize: setMoviesSize,
// 		isValidating: moviesValidating,
// 	} = useSWRInfinite<TMDBListResponse<Movie>>(getMoviesKey, fetcher);

// 	const popularMovies = dedupeByMediaAndId(
// 		moviePages?.flatMap((p) => p.results) ?? [],
// 	);

// 	/* ---------- TV ---------- */

// 	const {
// 		data: tvPages,
// 		size: tvSize,
// 		setSize: setTvSize,
// 		isValidating: tvValidating,
// 	} = useSWRInfinite<TMDBListResponse<TvShow>>(getTvKey, fetcher);

// 	const popularTvShows = dedupeByMediaAndId(
// 		tvPages?.flatMap((p) => p.results) ?? [],
// 	);

// 	return (
// 		<main>
// 			{showHeroSkeleton ? (
// 				<HeroCarouselSkeleton />
// 			) : (
// 				trendingItems.length > 0 && (
// 					<HeroCarousel items={trendingItems.slice(0, 10)} />
// 				)
// 			)}

// 			<div className="px-6 md:px-12">
// 				<div className="mb-6 mt-12 flex items-center justify-end">
// 					<Filter onFilterChange={() => {}} />
// 				</div>

// 				<Row
// 					title="Trending This Week"
// 					onScrollEnd={() =>
// 						!trendingValidating && setTrendingSize(trendingSize + 1)
// 					}
// 					isLoadingMore={trendingValidating}
// 				>
// 					{trendingItems.map((item) => {
// 						const mediaType = getSearchItemType(item);

// 						if (!mediaType || !item.id || !item.poster_path) {
// 							return null;
// 						}

// 						return (
// 							<MediaCard
// 								key={`${mediaType}-${item.id}`}
// 								id={item.id}
// 								type={mediaType}
// 								title={getSearchItemTitle(item)}
// 								posterPath={item.poster_path}
// 								backdropPath={
// 									item.backdrop_path ?? item.poster_path
// 								}
// 								rating={item.vote_average}
// 								variant="row"
// 							/>
// 						);
// 					})}
// 				</Row>

// 				<Row
// 					title="Top Movies"
// 					onScrollEnd={() =>
// 						!moviesValidating && setMoviesSize(moviesSize + 1)
// 					}
// 					isLoadingMore={moviesValidating}
// 				>
// 					{popularMovies.map((movie) => {
// 						if (!movie.id || !movie.poster_path) {
// 							return null;
// 						}

// 						return (
// 							<MediaCard
// 								key={movie.id}
// 								id={movie.id}
// 								type="movie"
// 								title={movie.title}
// 								posterPath={movie.poster_path}
// 								backdropPath={
// 									movie.backdrop_path ?? movie.poster_path
// 								}
// 								rating={movie.vote_average}
// 								variant="row"
// 							/>
// 						);
// 					})}
// 				</Row>

// 				<Row
// 					title="Top TV Shows"
// 					onScrollEnd={() => !tvValidating && setTvSize(tvSize + 1)}
// 					isLoadingMore={tvValidating}
// 				>
// 					{popularTvShows.map((tv) => {
// 						if (!tv.id || !tv.poster_path) {
// 							return null;
// 						}

// 						return (
// 							<MediaCard
// 								key={tv.id}
// 								id={tv.id}
// 								type="tv"
// 								title={tv.name}
// 								posterPath={tv.poster_path}
// 								backdropPath={
// 									tv.backdrop_path ?? tv.poster_path
// 								}
// 								rating={tv.vote_average}
// 								variant="row"
// 							/>
// 						);
// 					})}
// 				</Row>
// 			</div>
// 		</main>
// 	);
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { Filter as FilterIcon, SlidersHorizontal, Star, X } from "lucide-react";

import SearchBar from "@/components/diary/search-bar";
import BrowseSortDropdown, {
	type BrowseSort,
} from "@/components/home/browse-sort-dropdown";
import HeroCarousel from "@/components/home/hero-carousel";
import HeroCarouselSkeleton from "@/components/home/hero-carousel-skeleton";
import MediaCard from "@/components/media/media-card";
import LoadMoreButton from "@/components/ui/load-more-button";

import { fetcher } from "@/utils/fetcher";
import type { Movie, TvShow, TMDBListResponse } from "@/types";

type MediaType = "movie" | "tv";
type BrowseType = "all" | "movie" | "tv";

type BrowseItem = (Movie | TvShow) & {
	media_type: MediaType;
};

const ITEMS_PER_LOAD = 24;

const genres = [
	"Action",
	"Adventure",
	"Comedy",
	"Drama",
	"History",
	"Mystery",
	"Sci-Fi",
	"Thriller",
	"Horror",
	"Romance",
	"Animation",
	"Crime",
];

const getTrendingKey = (
	pageIndex: number,
	prev: TMDBListResponse<Movie | TvShow> | null,
) => {
	if (prev && pageIndex + 1 > prev.total_pages) return null;

	return `/api/tmdb/trending?type=all&timeWindow=week&page=${pageIndex + 1}`;
};

function dedupeByMediaAndId<T extends { id: number; media_type?: string }>(
	items: T[],
): T[] {
	const map = new Map<string, T>();

	for (const item of items) {
		if (!item?.id) continue;

		const type = item.media_type ?? ("title" in item ? "movie" : "tv");
		const key = `${type}-${item.id}`;

		map.set(key, item);
	}

	return Array.from(map.values());
}

function getItemType(item: Movie | TvShow | BrowseItem): MediaType | null {
	if (item.media_type === "movie") return "movie";
	if (item.media_type === "tv") return "tv";

	if ("title" in item) return "movie";
	if ("name" in item) return "tv";

	return null;
}

function getItemTitle(item: Movie | TvShow | BrowseItem): string {
	if ("title" in item && item.title) return item.title;
	if ("name" in item && item.name) return item.name;

	return "Untitled";
}

function useDebouncedValue(value: string, delay: number): string {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timeout = window.setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => window.clearTimeout(timeout);
	}, [value, delay]);

	return debouncedValue;
}

export default function HomePage() {
	const [search, setSearch] = useState("");
	const [type, setType] = useState<BrowseType>("all");
	const [sort, setSort] = useState<BrowseSort>("top_rated");
	const [minimumRating, setMinimumRating] = useState(0);
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

	const debouncedSearch = useDebouncedValue(search, 250);

	const selectedGenresQuery = useMemo(() => {
		return selectedGenres.join(",");
	}, [selectedGenres]);

	const { data: trendingPages, error: trendingError } = useSWRInfinite<
		TMDBListResponse<Movie | TvShow>
	>(getTrendingKey, fetcher);

	const trendingItems = dedupeByMediaAndId(
		trendingPages?.flatMap((page) => page.results) ?? [],
	);

	const showHeroSkeleton = !trendingPages && !trendingError;

	const getBrowseKey = (
		pageIndex: number,
		prev: TMDBListResponse<BrowseItem> | null,
	) => {
		if (prev && pageIndex + 1 > prev.total_pages) return null;

		const params = new URLSearchParams({
			page: String(pageIndex + 1),
			query: debouncedSearch,
			type,
			sort,
			minRating: String(minimumRating),
			genres: selectedGenresQuery,
		});

		return `/api/tmdb/browse?${params.toString()}`;
	};

	const {
		data: browsePages,
		size: browseSize,
		setSize: setBrowseSize,
		isValidating: browseValidating,
		error: browseError,
	} = useSWRInfinite<TMDBListResponse<BrowseItem>>(getBrowseKey, fetcher, {
		revalidateFirstPage: false,
	});

	const browseItems = dedupeByMediaAndId(
		browsePages?.flatMap((page) => page.results) ?? [],
	);

	const visibleBrowseItems = browseItems.slice(0, visibleCount);

	const lastBrowsePage = browsePages?.[browsePages.length - 1] ?? null;

	const hasMoreBrowse =
		lastBrowsePage !== null &&
		lastBrowsePage.page < lastBrowsePage.total_pages;

	const hasMoreVisibleItems =
		visibleCount < browseItems.length || hasMoreBrowse;

	const initialLoading = !browsePages && browseValidating;
	const loadingMore = browseValidating && Boolean(browsePages);

	useEffect(() => {
		setBrowseSize(1);
		setVisibleCount(ITEMS_PER_LOAD);
	}, [
		debouncedSearch,
		type,
		sort,
		minimumRating,
		selectedGenresQuery,
		setBrowseSize,
	]);

	function toggleGenre(genre: string): void {
		setSelectedGenres((currentGenres) => {
			if (currentGenres.includes(genre)) {
				return currentGenres.filter((item) => item !== genre);
			}

			return [...currentGenres, genre];
		});
	}

	function clearFilters(): void {
		setType("all");
		setSort("top_rated");
		setMinimumRating(0);
		setSelectedGenres([]);
		setSearch("");
	}

	function loadMore(): void {
		if (browseValidating) return;

		const nextVisibleCount = visibleCount + ITEMS_PER_LOAD;

		setVisibleCount(nextVisibleCount);

		if (nextVisibleCount >= browseItems.length && hasMoreBrowse) {
			setBrowseSize(browseSize + 1);
		}
	}

	return (
		<main className="min-h-screen bg-black text-white">
			{showHeroSkeleton ? (
				<HeroCarouselSkeleton />
			) : (
				trendingItems.length > 0 && (
					<HeroCarousel items={trendingItems.slice(0, 10)} />
				)
			)}

			<section className="px-6 py-12 md:px-12">
				<div className="mb-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
					<div className="w-full max-w-[620px]">
						<h1 className="text-3xl font-black md:text-4xl">
							Browse to log
						</h1>

						<p className="mt-2 text-sm text-muted md:text-base">
							Find something you have watched and add it to your
							diary.
						</p>

						<SearchBar
							query={search}
							onChange={setSearch}
							placeholder="Search for movies & TV shows"
							className="mt-7 w-full"
						/>
					</div>

					<div className="flex shrink-0 items-center gap-5 xl:self-end xl:pb-2">
						<BrowseSortDropdown value={sort} onChange={setSort} />

						<button
							type="button"
							onClick={() => setFiltersOpen(true)}
							className="ml-auto flex h-10 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-6 text-sm font-bold transition hover:bg-white/[0.1]"
						>
							<SlidersHorizontal className="h-4 w-4" />
							Filters
						</button>
					</div>
				</div>

				{browseError && (
					<div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
						Could not load results. Check your terminal for the
						Browse API error.
					</div>
				)}

				{initialLoading && (
					<div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
						{Array.from({ length: ITEMS_PER_LOAD }).map(
							(_, index) => (
								<div
									key={index}
									className="aspect-[2/3] animate-pulse rounded-xl border border-white/10 bg-white/[0.04]"
								/>
							),
						)}
					</div>
				)}

				{!initialLoading && (
					<>
						<div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
							{visibleBrowseItems.map((item) => {
								const mediaType = getItemType(item);

								if (
									!mediaType ||
									!item.id ||
									!item.poster_path
								) {
									return null;
								}

								return (
									<MediaCard
										key={`${mediaType}-${item.id}`}
										id={item.id}
										type={mediaType}
										title={getItemTitle(item)}
										posterPath={item.poster_path}
										backdropPath={
											item.backdrop_path ??
											item.poster_path
										}
										rating={item.vote_average}
										variant="default"
									/>
								);
							})}
						</div>

						{!browseError && visibleBrowseItems.length === 0 ? (
							<div className="flex justify-center py-12">
								<p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-muted">
									No results found.
								</p>
							</div>
						) : (
							<LoadMoreButton
								onClick={loadMore}
								loading={loadingMore}
								disabled={browseValidating}
								hasMore={hasMoreVisibleItems}
								endText="You reached the end."
							/>
						)}
					</>
				)}
			</section>

			{filtersOpen && (
				<div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm">
					<button
						type="button"
						onClick={() => setFiltersOpen(false)}
						className="absolute inset-0 cursor-default"
						aria-label="Close filters"
					/>

					<aside className="absolute right-0 top-0 flex h-full w-full max-w-[430px] flex-col border-l border-white/10 bg-[#15151a] shadow-2xl">
						<div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
							<div className="flex items-center gap-3">
								<FilterIcon className="h-5 w-5" />

								<h2 className="text-2xl font-black">Filters</h2>
							</div>

							<button
								type="button"
								onClick={() => setFiltersOpen(false)}
								className="text-muted transition hover:text-white"
								aria-label="Close filters"
							>
								<X className="h-6 w-6" />
							</button>
						</div>

						<div className="flex-1 overflow-y-auto px-6 py-7">
							<div>
								<div className="mb-4 flex items-center justify-between">
									<p className="text-xs font-bold uppercase tracking-wide text-muted">
										Minimum rating
									</p>

									<div className="flex items-center gap-1 text-sm font-bold">
										<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
										{minimumRating.toFixed(1)}
									</div>
								</div>

								<input
									type="range"
									min="0"
									max="10"
									step="0.5"
									value={minimumRating}
									onChange={(event) =>
										setMinimumRating(
											Number(event.target.value),
										)
									}
									className="w-full accent-accent"
								/>

								<div className="mt-2 flex justify-between text-xs text-muted">
									<span>Any</span>
									<span>10</span>
								</div>
							</div>

							<div className="mt-9">
								<p className="mb-4 text-xs font-bold uppercase tracking-wide text-muted">
									Type
								</p>

								<div className="grid grid-cols-3 gap-3">
									{[
										{ label: "All", value: "all" },
										{ label: "Movies", value: "movie" },
										{ label: "Shows", value: "tv" },
									].map((item) => (
										<button
											key={item.value}
											type="button"
											onClick={() =>
												setType(
													item.value as BrowseType,
												)
											}
											className={`h-12 rounded-full border text-sm font-bold transition ${
												type === item.value
													? "border-white bg-white text-black"
													: "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
											}`}
										>
											{item.label}
										</button>
									))}
								</div>
							</div>

							<div className="mt-9">
								<p className="mb-4 text-xs font-bold uppercase tracking-wide text-muted">
									Genres
								</p>

								<div className="flex flex-wrap gap-3">
									{genres.map((genre) => {
										const selected =
											selectedGenres.includes(genre);

										return (
											<button
												key={genre}
												type="button"
												onClick={() =>
													toggleGenre(genre)
												}
												className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
													selected
														? "border-accent bg-accent text-white"
														: "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
												}`}
											>
												{genre}
											</button>
										);
									})}
								</div>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3 border-t border-white/10 px-6 py-5">
							<button
								type="button"
								onClick={clearFilters}
								className="h-12 rounded-full border border-white/10 text-sm font-bold transition hover:bg-white/[0.08]"
							>
								Clear all
							</button>

							<button
								type="button"
								onClick={() => setFiltersOpen(false)}
								className="h-12 rounded-full bg-accent text-sm font-bold transition hover:bg-accent-hover"
							>
								Show results
							</button>
						</div>
					</aside>
				</div>
			)}
		</main>
	);
}