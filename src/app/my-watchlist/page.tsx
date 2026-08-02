"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { KeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getWatchlist, removeFromWatchlist } from "@/utils/watchlist-storage";
import { DiaryEntry } from "@/types/diary";
import AddToDiaryModal from "@/components/diary/add-to-diary-modal";
import MediaToolbar from "@/components/diary/media-toolbar";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Trash2, Plus, Star, BookmarkCheck } from "lucide-react";
import MediaCard from "@/components/media/media-card";
import LoadMoreButton from "@/components/ui/load-more-button";
import { GENRE_MAP } from "@/constants/genres";

const ITEMS_PER_LOAD = 24;

const GENRES = Array.from(new Set(Object.values(GENRE_MAP))).sort();

type WatchlistSort =
	| "Popularity"
	| "Recently added"
	| "Oldest"
	| "A-Z"
	| "Z-A"
	| "Highest rated"
	| "Lowest rated";

type GenreSnapshot = {
	id?: number;
	name?: string;
};

type WatchlistItemWithGenres = DiaryEntry & {
	genre?: string;
	genreIds?: number[];
	genreNames?: string[];
	genre_ids?: number[];
	genre_names?: string[];
	genres?: Array<GenreSnapshot | string>;
};

function getQueryGenres(value: string | null): string[] {
	if (!value) return [];

	return value
		.split(",")
		.map((genre) => genre.trim())
		.filter(Boolean);
}

function getNumberParam(value: string | null): number {
	if (!value) return 0;

	const number = Number(value);

	if (Number.isNaN(number)) return 0;

	return number;
}

function getImageUrl(path?: string | null): string {
	if (!path) return "/logo.png";
	if (path.startsWith("http")) return path;

	const cleanPath = path.startsWith("/") ? path : `/${path}`;

	if (cleanPath.startsWith("/images/") || cleanPath === "/logo.png") {
		return cleanPath;
	}

	return `https://image.tmdb.org/t/p/w500${cleanPath}`;
}

function getHref(entry: DiaryEntry): string {
	return entry.type === "movie" ? `/movie/${entry.id}` : `/tv/${entry.id}`;
}

function formatDate(value?: string | null): string {
	if (!value) return "Unknown date";

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) return "Unknown date";

	return new Intl.DateTimeFormat("en", {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(date);
}

function getTime(value?: string | null): number {
	if (!value) return 0;

	const date = new Date(value);
	const time = date.getTime();

	return Number.isNaN(time) ? 0 : time;
}

function normalizeGenre(value: string): string {
	return value.trim().toLowerCase();
}

function getItemGenres(entry: DiaryEntry): string[] {
	const item = entry as WatchlistItemWithGenres;
	const genres = new Set<string>();

	if (item.genre) {
		genres.add(item.genre);
	}

	if (Array.isArray(item.genreNames)) {
		item.genreNames.forEach((genre) => {
			if (genre) genres.add(genre);
		});
	}

	if (Array.isArray(item.genre_names)) {
		item.genre_names.forEach((genre) => {
			if (genre) genres.add(genre);
		});
	}

	if (Array.isArray(item.genreIds)) {
		item.genreIds.forEach((genreId) => {
			const genreName = GENRE_MAP[genreId];

			if (genreName) genres.add(genreName);
		});
	}

	if (Array.isArray(item.genre_ids)) {
		item.genre_ids.forEach((genreId) => {
			const genreName = GENRE_MAP[genreId];

			if (genreName) genres.add(genreName);
		});
	}

	if (Array.isArray(item.genres)) {
		item.genres.forEach((genre) => {
			if (typeof genre === "string") {
				genres.add(genre);
				return;
			}

			if (genre.name) {
				genres.add(genre.name);
				return;
			}

			if (typeof genre.id === "number" && GENRE_MAP[genre.id]) {
				genres.add(GENRE_MAP[genre.id]);
			}
		});
	}

	return Array.from(genres);
}

function getTmdbRating(entry: DiaryEntry): number | null {
	const rawRating = entry.tmdbRating as unknown;

	if (typeof rawRating === "number" && rawRating > 0) {
		return rawRating;
	}

	if (typeof rawRating === "string") {
		const parsedRating = Number(rawRating);

		if (!Number.isNaN(parsedRating) && parsedRating > 0) {
			return parsedRating;
		}
	}

	return null;
}

function itemHasGenre(entry: DiaryEntry, selectedGenres: string[]): boolean {
	if (selectedGenres.length === 0) return true;

	const itemGenres = getItemGenres(entry).map(normalizeGenre);
	const selected = selectedGenres.map(normalizeGenre);

	return selected.some((genre) => itemGenres.includes(genre));
}

function sortWatchlistItems(items: DiaryEntry[], sort: string): DiaryEntry[] {
	const typedSort = sort as WatchlistSort;

	return [...items].sort((a, b) => {
		if (typedSort === "A-Z") {
			return a.title.localeCompare(b.title);
		}

		if (typedSort === "Z-A") {
			return b.title.localeCompare(a.title);
		}

		if (typedSort === "Highest rated") {
			return (getTmdbRating(b) ?? 0) - (getTmdbRating(a) ?? 0);
		}

		if (typedSort === "Lowest rated") {
			return (getTmdbRating(a) ?? 0) - (getTmdbRating(b) ?? 0);
		}

		if (typedSort === "Oldest") {
			return getTime(a.updatedAt) - getTime(b.updatedAt);
		}

		return getTime(b.updatedAt) - getTime(a.updatedAt);
	});
}

function WatchlistListItem({
	item,
	onRemove,
	onAddToDiary,
}: {
	item: DiaryEntry;
	onRemove: (entry: DiaryEntry) => void | Promise<void>;
	onAddToDiary: (entry: DiaryEntry) => void;
}) {
	const router = useRouter();

	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const href = getHref(item);
	const posterUrl = getImageUrl(item.poster);
	const tmdbRating = getTmdbRating(item);

	function openDetails(): void {
		router.push(href);
	}

	function handleKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			openDetails();
		}
	}

	async function handleConfirmRemove(): Promise<void> {
		try {
			setDeleting(true);
			await onRemove(item);
			setDeleteOpen(false);
		} catch (error) {
			console.error("Failed to remove watchlist item:", error);
			alert("Could not remove this from your watchlist.");
		} finally {
			setDeleting(false);
		}
	}

	return (
		<>
			<div
				role="button"
				tabIndex={0}
				onClick={openDetails}
				onKeyDown={handleKeyDown}
				className="group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-3 transition hover:border-accent/50 hover:bg-white/[0.055]"
			>
				<div className="flex gap-3 sm:gap-4">
					<Link
						href={href}
						onClick={(event) => event.stopPropagation()}
						className="relative h-[130px] w-[88px] shrink-0 overflow-hidden rounded-2xl bg-surface-elevated sm:h-[180px] sm:w-[120px]"
					>
						<Image
							src={posterUrl}
							alt={item.title}
							fill
							sizes="120px"
							className="object-cover transition duration-300 group-hover:scale-105"
						/>
					</Link>

					<div className="flex min-w-0 flex-1 flex-col py-0.5 sm:py-1">
						<div className="flex items-start justify-between gap-2 sm:gap-3">
							<div className="min-w-0 flex-1">
								<Link
									href={href}
									onClick={(event) => event.stopPropagation()}
								>
									<h3 className="line-clamp-2 text-sm font-black leading-tight text-white transition hover:text-accent sm:text-xl">
										{item.title}
									</h3>
								</Link>

								<div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-muted sm:gap-2 sm:text-xs">
									<span className="rounded-full border border-white/10 bg-black/25 px-2 py-0.5 font-semibold capitalize sm:px-2.5 sm:py-1">
										{item.type === "movie"
											? "Movie"
											: "TV Show"}
									</span>

									<span className="rounded-full border border-green-500/25 bg-green-500/10 px-2 py-0.5 font-semibold text-green-300 sm:px-2.5 sm:py-1">
										Planned
									</span>

									<span className="hidden sm:inline">
										{formatDate(item.updatedAt)}
									</span>
								</div>
							</div>

							<div
								className="flex shrink-0 flex-col items-center gap-1.5 sm:gap-2"
								onClick={(event) => event.stopPropagation()}
							>
								{tmdbRating !== null && (
									<div className="hidden shrink-0 items-center gap-1 rounded-full bg-black/40 px-3 py-1.5 text-sm font-bold text-white sm:flex">
										<Star className="h-4 w-4 fill-accent text-accent" />
										{tmdbRating.toFixed(1)}
									</div>
								)}

								<button
									type="button"
									onClick={() => onAddToDiary(item)}
									className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-white transition hover:bg-accent sm:h-9 sm:w-9"
									title="Add to diary"
								>
									<Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
								</button>

								<button
									type="button"
									onClick={() => setDeleteOpen(true)}
									className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/60 text-accent transition hover:bg-accent hover:text-white sm:h-9 sm:w-9"
									title="Remove"
								>
									<Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
								</button>
							</div>
						</div>

						<div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4 sm:gap-3">
							<div className="flex items-center gap-1.5 text-xs font-semibold text-green-300 sm:gap-2 sm:text-sm">
								<BookmarkCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
								<span>Saved for later</span>
							</div>
						</div>

						<p className="mt-2 hidden text-xs text-muted sm:block">
							Added {formatDate(item.updatedAt)}
						</p>
					</div>
				</div>
			</div>

			<ConfirmDialog
				open={deleteOpen}
				title="Remove from watchlist?"
				description={`Are you sure you want to remove "${item.title}" from your watchlist?`}
				confirmLabel="Remove"
				loading={deleting}
				onCancel={() => setDeleteOpen(false)}
				onConfirm={handleConfirmRemove}
			/>
		</>
	);
}

function WatchlistList({
	items,
	onRemove,
	onAddToDiary,
}: {
	items: DiaryEntry[];
	onRemove: (entry: DiaryEntry) => void | Promise<void>;
	onAddToDiary: (entry: DiaryEntry) => void;
}) {
	return (
		<div className="relative z-10 space-y-4">
			{items.map((item) => (
				<WatchlistListItem
					key={`${item.type}-${item.id}`}
					item={item}
					onRemove={onRemove}
					onAddToDiary={onAddToDiary}
				/>
			))}
		</div>
	);
}

export default function WatchlistPage() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const hasMounted = useRef(false);

	const [items, setItems] = useState<DiaryEntry[]>([]);
	const [query, setQuery] = useState(searchParams.get("q") ?? "");
	const [view, setView] = useState<"grid" | "list">(
		searchParams.get("view") === "list" ? "list" : "grid",
	);
	const [activeTab, setActiveTab] = useState<"all" | "movies" | "tv">(() => {
		const tab = searchParams.get("tab");

		if (tab === "movies" || tab === "tv") return tab;

		return "all";
	});
	const [sort, setSort] = useState(searchParams.get("sort") ?? "Popularity");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [selected, setSelected] = useState<DiaryEntry | null>(null);

	const [selectedGenres, setSelectedGenres] = useState<string[]>(
		getQueryGenres(searchParams.get("genres")),
	);
	const [minimumRating, setMinimumRating] = useState(
		getNumberParam(searchParams.get("minRating")),
	);
	const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

	useEffect(() => {
		async function loadWatchlist() {
			const list = await getWatchlist();
			setItems(list);
		}

		void loadWatchlist();
	}, []);

	useEffect(() => {
		setVisibleCount(ITEMS_PER_LOAD);
	}, [activeTab, query, selectedGenres, minimumRating, sort]);

	useEffect(() => {
		if (!hasMounted.current) {
			hasMounted.current = true;
			return;
		}

		const params = new URLSearchParams();

		if (query.trim()) params.set("q", query.trim());
		if (activeTab !== "all") params.set("tab", activeTab);
		if (view !== "grid") params.set("view", view);
		if (sort !== "Popularity") params.set("sort", sort);
		if (selectedGenres.length > 0) {
			params.set("genres", selectedGenres.join(","));
		}
		if (minimumRating > 0) {
			params.set("minRating", String(minimumRating));
		}

		const queryString = params.toString();
		const url = queryString ? `${pathname}?${queryString}` : pathname;

		router.replace(url, { scroll: false });
	}, [
		query,
		activeTab,
		view,
		sort,
		selectedGenres,
		minimumRating,
		pathname,
		router,
	]);

	async function handleRemove(entry: DiaryEntry) {
		await removeFromWatchlist(entry.id, entry.type);
		const list = await getWatchlist();
		setItems(list);
	}

	const filteredItems = useMemo(() => {
		const cleanQuery = query.trim().toLowerCase();

		return items.filter((item) => {
			if (activeTab === "movies" && item.type !== "movie") return false;
			if (activeTab === "tv" && item.type !== "tv") return false;

			if (cleanQuery && !item.title.toLowerCase().includes(cleanQuery)) {
				return false;
			}

			const tmdbRating = getTmdbRating(item);

			if (
				minimumRating > 0 &&
				(tmdbRating === null || tmdbRating < minimumRating)
			) {
				return false;
			}

			if (!itemHasGenre(item, selectedGenres)) {
				return false;
			}

			return true;
		});
	}, [items, activeTab, query, selectedGenres, minimumRating]);

	const sortedItems = useMemo(() => {
		return sortWatchlistItems(filteredItems, sort);
	}, [filteredItems, sort]);

	const visibleItems = useMemo(() => {
		return sortedItems.slice(0, visibleCount);
	}, [sortedItems, visibleCount]);

	const hasMoreItems = visibleCount < sortedItems.length;

	function clearAllFilters() {
		setSelectedGenres([]);
		setMinimumRating(0);
	}

	function toggleGenre(genre: string): void {
		setSelectedGenres((currentGenres) => {
			if (currentGenres.includes(genre)) {
				return currentGenres.filter((item) => item !== genre);
			}

			return [...currentGenres, genre];
		});
	}

	const activeFilterCount =
		selectedGenres.length + (minimumRating > 0 ? 1 : 0);

	return (
		<div className="relative px-6 py-10 md:px-24">
			<img
				src="/images/swoosh.svg"
				alt=""
				className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.25]"
			/>

			<MediaToolbar
				title="My Watchlist"
				total={sortedItems.length}
				activeTab={activeTab}
				onTabChange={setActiveTab}
				sort={sort}
				onSortChange={setSort}
				query={query}
				onQueryChange={setQuery}
				view={view}
				onViewChange={setView}
				activeFilterCount={activeFilterCount}
				onFilterClick={() => setFiltersOpen(!filtersOpen)}
			/>

			{filtersOpen && (
				<div className="mb-8 rounded-2xl border border-border bg-[#1b1b1b] p-6">
					<div className="mb-6 flex items-center justify-between">
						<h3 className="text-lg font-semibold">Filters</h3>

						{activeFilterCount > 0 && (
							<button
								type="button"
								onClick={clearAllFilters}
								className="text-sm text-accent hover:underline"
							>
								Clear all
							</button>
						)}
					</div>

					<div className="mb-6">
						<div className="mb-3 flex items-center gap-3">
							<h4 className="text-xs uppercase tracking-wide text-muted">
								Minimum TMDB rating
							</h4>

							<div className="flex items-center gap-1 text-sm font-semibold text-white">
								<Star className="h-4 w-4 fill-accent text-accent" />
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
								setMinimumRating(Number(event.target.value))
							}
							className="w-full max-w-md accent-accent"
						/>

						<div className="mt-2 flex max-w-md justify-between text-xs text-muted">
							<span>Any</span>
							<span>10</span>
						</div>
					</div>

					<div>
						<h4 className="mb-3 text-xs uppercase tracking-wide text-muted">
							Genre
						</h4>

						<div className="flex flex-wrap gap-2">
							{GENRES.map((genre) => {
								const active = selectedGenres.includes(genre);

								return (
									<button
										type="button"
										key={genre}
										onClick={() => toggleGenre(genre)}
										className={`rounded-full px-3 py-1.5 text-sm transition ${
											active
												? "bg-accent text-white"
												: "bg-[#2a2a2a] text-muted hover:bg-[#333]"
										}`}
									>
										{genre}
									</button>
								);
							})}
						</div>
					</div>
				</div>
			)}

			{view === "grid" && (
				<div className="relative z-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
					{visibleItems.map((item) => (
						<MediaCard
							key={`${item.type}-${item.id}`}
							id={item.id}
							type={item.type}
							title={item.title}
							posterPath={item.poster}
							backdropPath={item.backdrop ?? item.poster}
							rating={item.tmdbRating}
							ratingKind="tmdb"
							variant="watchlist"
							onWatchlistRemove={() => handleRemove(item)}
							onWatchlistSave={(status) => {
								if (status !== "planned") {
									handleRemove(item);
								}
							}}
						/>
					))}
				</div>
			)}

			{view === "list" && (
				<WatchlistList
					items={visibleItems}
					onRemove={handleRemove}
					onAddToDiary={setSelected}
				/>
			)}

			{sortedItems.length === 0 && (
				<div className="relative z-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
					<p className="text-sm text-muted">
						No watchlist items match your search or filters.
					</p>
				</div>
			)}

			{sortedItems.length > 0 && (
				<LoadMoreButton
					onClick={() =>
						setVisibleCount(
							(currentCount) => currentCount + ITEMS_PER_LOAD,
						)
					}
					hasMore={hasMoreItems}
					endText="You reached the end of your watchlist."
				/>
			)}

			{selected && (
				<AddToDiaryModal
					open={true}
					onClose={() => {
						setSelected(null);
					}}
					onSave={(status) => {
						if (status !== "planned") {
							void removeFromWatchlist(
								selected.id,
								selected.type,
							);

							setItems((prev) =>
								prev.filter(
									(i) =>
										!(
											i.id === selected.id &&
											i.type === selected.type
										),
								),
							);
						}

						setSelected(null);
					}}
					content={{
						id: selected.id,
						type: selected.type,
						title: selected.title,
						poster: selected.poster,
						backdrop: selected.backdrop ?? selected.poster,
					}}
				/>
			)}
		</div>
	);
}
