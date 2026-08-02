"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Pencil, PlayCircle, Star, Trash2 } from "lucide-react";

import MediaToolbar from "@/components/diary/media-toolbar";
import MovieGrid from "@/components/diary/movie-grid";
import AddToDiaryModal from "@/components/diary/add-to-diary-modal";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import LoadMoreButton from "@/components/ui/load-more-button";
import { getDiary, removeDiaryEntry } from "@/utils/diary-storage";
import type { DiaryEntry } from "@/types/diary";
import { GENRE_MAP } from "@/constants/genres";

const ITEMS_PER_LOAD = 24;

const GENRES = Array.from(new Set(Object.values(GENRE_MAP))).sort();

type DiaryStatusFilter = "all" | "watching" | "finished" | "rated" | "unrated";

type DiarySort =
	| "Popularity"
	| "Recently added"
	| "A-Z"
	| "Z-A"
	| "Highest rated"
	| "Lowest rated"
	| "Oldest";

type ProgressShape = {
	currentSeason?: number;
	currentEpisode?: number;
	percentage?: number;
	progress?: number;
};

type GenreSnapshot = {
	id?: number;
	name?: string;
};

type DiaryEntryWithGenres = DiaryEntry & {
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

function getProgress(entry: DiaryEntry): ProgressShape | null {
	if (!entry.progress) return null;
	return entry.progress as ProgressShape;
}

function getProgressPercentage(entry: DiaryEntry): number | null {
	const progress = getProgress(entry);
	const percentage = progress?.percentage ?? progress?.progress;

	if (typeof percentage !== "number") return null;

	return Math.min(100, Math.max(0, Math.round(percentage)));
}

function getUserRating(entry: DiaryEntry): number | null {
	const rawRating = entry.rating as unknown;

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

function getEpisodeLabel(entry: DiaryEntry): string | null {
	const progress = getProgress(entry);

	if (!progress?.currentSeason || !progress?.currentEpisode) {
		return null;
	}

	return `S${progress.currentSeason} · E${progress.currentEpisode}`;
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

function isFinishedEntry(entry: DiaryEntry): boolean {
	const progressPercentage = getProgressPercentage(entry);

	return (
		entry.status === "completed" ||
		progressPercentage === 100 ||
		entry.type === "movie"
	);
}

function getDiaryGenres(entry: DiaryEntry): string[] {
	const item = entry as DiaryEntryWithGenres;
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

function getDiaryGenreSnapshots(
	entry: DiaryEntry,
): { id: number; name: string }[] {
	const item = entry as DiaryEntryWithGenres;
	const map = new Map<number, string>();

	if (Array.isArray(item.genreIds)) {
		item.genreIds.forEach((genreId, index) => {
			const name = item.genreNames?.[index] ?? GENRE_MAP[genreId];

			if (name) {
				map.set(genreId, name);
			}
		});
	}

	if (Array.isArray(item.genre_ids)) {
		item.genre_ids.forEach((genreId, index) => {
			const name = item.genre_names?.[index] ?? GENRE_MAP[genreId];

			if (name) {
				map.set(genreId, name);
			}
		});
	}

	if (Array.isArray(item.genres)) {
		item.genres.forEach((genre) => {
			if (typeof genre === "string") return;

			if (typeof genre.id === "number" && genre.name) {
				map.set(genre.id, genre.name);
				return;
			}

			if (typeof genre.id === "number" && GENRE_MAP[genre.id]) {
				map.set(genre.id, GENRE_MAP[genre.id]);
			}
		});
	}

	return Array.from(map.entries()).map(([id, name]) => ({
		id,
		name,
	}));
}

function sortDiaryItems(items: DiaryEntry[], sort: string): DiaryEntry[] {
	const typedSort = sort as DiarySort;

	return [...items].sort((a, b) => {
		if (typedSort === "A-Z") {
			return a.title.localeCompare(b.title);
		}

		if (typedSort === "Z-A") {
			return b.title.localeCompare(a.title);
		}

		if (typedSort === "Highest rated") {
			return (getUserRating(b) ?? 0) - (getUserRating(a) ?? 0);
		}

		if (typedSort === "Lowest rated") {
			return (getUserRating(a) ?? 0) - (getUserRating(b) ?? 0);
		}

		if (typedSort === "Oldest") {
			return getTime(a.updatedAt) - getTime(b.updatedAt);
		}

		return getTime(b.updatedAt) - getTime(a.updatedAt);
	});
}

function DiaryListItem({
	item,
	onDiaryChanged,
}: {
	item: DiaryEntry;
	onDiaryChanged: () => void | Promise<void>;
}) {
	const router = useRouter();

	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const progressPercentage = getProgressPercentage(item);
	const episodeLabel = getEpisodeLabel(item);
	const href = getHref(item);
	const posterUrl = getImageUrl(item.poster);
	const isFinished = isFinishedEntry(item);

	function openDetails(): void {
		router.push(href);
	}

	function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			openDetails();
		}
	}

	async function handleDelete(): Promise<void> {
		try {
			setDeleting(true);
			await removeDiaryEntry(item.id, item.type);
			setDeleteOpen(false);
			await onDiaryChanged();
		} catch (error) {
			console.error("Failed to remove diary entry:", error);
			alert("Could not remove this from your diary.");
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
										{isFinished ? "Finished" : "Watching"}
									</span>

									<span className="hidden sm:inline">
										{formatDate(item.updatedAt)}
									</span>
								</div>
							</div>

							<div
								className="flex shrink-0 items-center gap-1.5 sm:gap-2"
								onClick={(event) => event.stopPropagation()}
							>
								{typeof item.rating === "number" && (
									<div className="hidden shrink-0 items-center gap-1 rounded-full bg-black/40 px-3 py-1.5 text-sm font-bold text-white sm:flex">
										<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
										{item.rating.toFixed(1)}
									</div>
								)}

								<button
									type="button"
									onClick={() => setEditOpen(true)}
									className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-white transition hover:bg-accent sm:h-9 sm:w-9"
									title="Edit"
								>
									<Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
								</button>

								<button
									type="button"
									onClick={() => setDeleteOpen(true)}
									className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/60 text-accent transition hover:bg-accent hover:text-white sm:h-9 sm:w-9"
									title="Delete"
								>
									<Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
								</button>
							</div>
						</div>

						<div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4 sm:gap-3">
							<div className="flex items-center gap-1.5 text-xs font-semibold text-green-300 sm:gap-2 sm:text-sm">
								<CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
								<span>
									{isFinished
										? "Added to diary"
										: "In progress"}
								</span>
							</div>

							{episodeLabel && !isFinished && (
								<div className="flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold text-white sm:px-3 sm:text-xs">
									<PlayCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
									{episodeLabel}
								</div>
							)}
						</div>

						{item.type === "tv" && progressPercentage !== null && (
							<div className="mt-3 max-w-md sm:mt-4">
								<div className="h-1.5 overflow-hidden rounded-full bg-white/10">
									<div
										className="h-full rounded-full bg-accent"
										style={{
											width: `${
												isFinished
													? 100
													: progressPercentage
											}%`,
										}}
									/>
								</div>

								<p className="mt-1 text-[10px] text-muted sm:text-xs">
									{isFinished ? 100 : progressPercentage}%
									watched
								</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{editOpen && (
				<AddToDiaryModal
					open={editOpen}
					onClose={async () => {
						setEditOpen(false);
						await onDiaryChanged();
					}}
					onSave={async () => {
						setEditOpen(false);
						await onDiaryChanged();
					}}
					content={{
						id: item.id,
						type: item.type,
						title: item.title,
						poster: item.poster ?? "",
						backdrop: item.backdrop ?? item.poster ?? "",
						genreIds: item.genreIds ?? [],
						genreNames: item.genreNames ?? [],
						genres: getDiaryGenreSnapshots(item),
					}}
					initialData={item}
				/>
			)}

			<ConfirmDialog
				open={deleteOpen}
				title="Remove from diary?"
				description={`Are you sure you want to remove "${item.title}" from your diary?`}
				confirmLabel="Remove"
				loading={deleting}
				onCancel={() => setDeleteOpen(false)}
				onConfirm={handleDelete}
			/>
		</>
	);
}

function DiaryList({
	items,
	onDiaryChanged,
}: {
	items: DiaryEntry[];
	onDiaryChanged: () => void | Promise<void>;
}) {
	return (
		<div className="relative z-10 space-y-4">
			{items.map((item) => (
				<DiaryListItem
					key={`${item.type}-${item.id}`}
					item={item}
					onDiaryChanged={onDiaryChanged}
				/>
			))}
		</div>
	);
}

export default function MyDiaryPage() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const hasMounted = useRef(false);

	const [activeTab, setActiveTab] = useState<"all" | "movies" | "tv">(() => {
		const tab = searchParams.get("tab");

		if (tab === "movies" || tab === "tv") return tab;

		return "all";
	});
	const [sort, setSort] = useState(searchParams.get("sort") ?? "Popularity");
	const [query, setQuery] = useState(searchParams.get("q") ?? "");
	const [items, setItems] = useState<DiaryEntry[]>([]);
	const [view, setView] = useState<"grid" | "list">(
		searchParams.get("view") === "list" ? "list" : "grid",
	);
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [selectedGenres, setSelectedGenres] = useState<string[]>(
		getQueryGenres(searchParams.get("genres")),
	);
	const [statusFilter, setStatusFilter] = useState<DiaryStatusFilter>(() => {
		const status = searchParams.get("status");

		if (
			status === "watching" ||
			status === "finished" ||
			status === "rated" ||
			status === "unrated"
		) {
			return status;
		}

		return "all";
	});
	const [minimumRating, setMinimumRating] = useState(
		getNumberParam(searchParams.get("minRating")),
	);
	const [loading, setLoading] = useState(true);
	const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

	const loadDiary = useCallback(async () => {
		setLoading(true);

		try {
			const diary = await getDiary();
			setItems(diary);
		} catch (error) {
			console.error("Failed to load diary:", error);
			setItems([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void loadDiary();
	}, [loadDiary]);

	useEffect(() => {
		setVisibleCount(ITEMS_PER_LOAD);
	}, [activeTab, sort, query, selectedGenres, statusFilter, minimumRating]);

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
		if (statusFilter !== "all") params.set("status", statusFilter);
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
		statusFilter,
		selectedGenres,
		minimumRating,
		pathname,
		router,
	]);

	const filteredItems = useMemo(() => {
		return items.filter((item) => {
			if (activeTab === "movies" && item.type !== "movie") return false;
			if (activeTab === "tv" && item.type !== "tv") return false;

			if (statusFilter === "watching" && isFinishedEntry(item)) {
				return false;
			}

			if (statusFilter === "finished" && !isFinishedEntry(item)) {
				return false;
			}

			const userRating = getUserRating(item);

			if (statusFilter === "rated" && userRating === null) {
				return false;
			}

			if (statusFilter === "unrated" && userRating !== null) {
				return false;
			}

			if (
				minimumRating > 0 &&
				(userRating === null || userRating < minimumRating)
			) {
				return false;
			}

			if (selectedGenres.length > 0) {
				const itemGenres = getDiaryGenres(item).map((genre) =>
					genre.toLowerCase(),
				);

				const hasSelectedGenre = selectedGenres.some((genre) =>
					itemGenres.includes(genre.toLowerCase()),
				);

				if (!hasSelectedGenre) return false;
			}

			return true;
		});
	}, [items, activeTab, statusFilter, minimumRating, selectedGenres]);

	const searchedItems = useMemo(() => {
		const cleanQuery = query.trim().toLowerCase();

		if (!cleanQuery) return filteredItems;

		return filteredItems.filter((item) =>
			item.title.toLowerCase().includes(cleanQuery),
		);
	}, [filteredItems, query]);

	const sortedItems = useMemo(() => {
		return sortDiaryItems(searchedItems, sort);
	}, [searchedItems, sort]);

	const visibleItems = useMemo(() => {
		return sortedItems.slice(0, visibleCount);
	}, [sortedItems, visibleCount]);

	const hasMoreItems = visibleCount < sortedItems.length;

	const activeFilterCount =
		selectedGenres.length +
		(statusFilter !== "all" ? 1 : 0) +
		(minimumRating > 0 ? 1 : 0);

	function clearAllFilters(): void {
		setSelectedGenres([]);
		setStatusFilter("all");
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

	return (
		<div className="relative overflow-hidden px-6 py-10 md:px-24">
			<img
				src="/images/swoosh.svg"
				alt=""
				className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.25]"
			/>

			<MediaToolbar
				title="My Diary"
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
				onFilterClick={() => setFiltersOpen((prev) => !prev)}
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
						<h4 className="mb-3 text-xs uppercase tracking-wide text-muted">
							Status
						</h4>

						<div className="flex flex-wrap gap-2">
							{[
								{ label: "All", value: "all" },
								{ label: "Watching", value: "watching" },
								{ label: "Finished", value: "finished" },
								{ label: "Rated", value: "rated" },
								{ label: "Unrated", value: "unrated" },
							].map((option) => {
								const active = statusFilter === option.value;

								return (
									<button
										type="button"
										key={option.value}
										onClick={() =>
											setStatusFilter(
												option.value as DiaryStatusFilter,
											)
										}
										className={`rounded-full px-3 py-1.5 text-sm transition ${
											active
												? "bg-accent text-white"
												: "bg-[#2a2a2a] text-muted hover:bg-[#333]"
										}`}
									>
										{option.label}
									</button>
								);
							})}
						</div>
					</div>

					<div className="mb-6">
						<div className="mb-3 flex items-center gap-3">
							<h4 className="text-xs uppercase tracking-wide text-muted">
								Minimum your rating
							</h4>

							<div className="flex items-center gap-1 text-sm font-semibold text-white">
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

			{loading ? (
				<div className="relative z-10 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
					{Array.from({ length: ITEMS_PER_LOAD }).map((_, index) => (
						<div
							key={index}
							className="aspect-[2/3] animate-pulse rounded-xl border border-white/10 bg-white/[0.04]"
						/>
					))}
				</div>
			) : sortedItems.length === 0 ? (
				<div className="relative z-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
					<p className="text-sm text-muted">
						No diary entries match your filters.
					</p>
				</div>
			) : (
				<>
					{view === "grid" ? (
						<MovieGrid
							items={visibleItems}
							onDiaryChanged={loadDiary}
						/>
					) : (
						<DiaryList
							items={visibleItems}
							onDiaryChanged={loadDiary}
						/>
					)}

					<LoadMoreButton
						onClick={() =>
							setVisibleCount(
								(currentCount) => currentCount + ITEMS_PER_LOAD,
							)
						}
						hasMore={hasMoreItems}
						endText="You reached the end of your diary."
					/>
				</>
			)}
		</div>
	);
}
