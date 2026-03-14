"use client";

import { useEffect, useMemo, useState } from "react";
import { getWatchlist, removeFromWatchlist } from "@/utils/watchlist-storage";
import { DiaryEntry } from "@/types/diary";
import MovieGrid from "@/components/diary/movie-grid";
import AddToDiaryModal from "@/components/diary/add-to-diary-modal";
import MediaToolbar from "@/components/diary/media-toolbar";
import { getPosterUrl } from "@/utils/tmdb-image";
import { Trash2, Plus } from "lucide-react";

const GENRES = [
	"Action",
	"Comedy",
	"Drama",
	"Horror",
	"Sci-Fi",
	"Thriller",
	"Romance",
	"Animation",
	"Documentary",
];

const SERVICES = [
	"Netflix",
	"Prime Video",
	"Disney+",
	"Max",
	"Apple TV+",
	"Hulu",
];

export default function WatchlistPage() {
	const [items, setItems] = useState<DiaryEntry[]>([]);
	const [query, setQuery] = useState("");
	const [view, setView] = useState<"grid" | "list">("grid");
	const [activeTab, setActiveTab] = useState<"all" | "movies" | "tv">("all");
	const [sort, setSort] = useState("Latest");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [selected, setSelected] = useState<DiaryEntry | null>(null);

	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
	const [selectedServices, setSelectedServices] = useState<string[]>([]);

	useEffect(() => {
		setItems(getWatchlist());
	}, []);

	function handleRemove(entry: DiaryEntry) {
		removeFromWatchlist(entry.id, entry.type);
		setItems(getWatchlist());
	}

    
	/* -------------------------
	   FILTER PIPELINE
	--------------------------*/

	const filteredItems = useMemo(() => {
		let result = [...items];

		// Tab filter
		if (activeTab === "movies") {
			result = result.filter((i) => i.type === "movie");
		}

		if (activeTab === "tv") {
			result = result.filter((i) => i.type === "tv");
		}

		// Search
		if (query) {
			result = result.filter((i) =>
				i.title.toLowerCase().includes(query.toLowerCase()),
			);
		}


		// Genre filter
		if (selectedGenres.length > 0) {
			result = result.filter(
				(i) => i.genre && selectedGenres.includes(i.genre),
			);
		}

		// Service filter
		if (selectedServices.length > 0) {
			result = result.filter(
				(i) => i.service && selectedServices.includes(i.service),
			);
		}

		// Sorting
		switch (sort) {
			case "A-Z":
				result.sort((a, b) => a.title.localeCompare(b.title));
				break;

			case "Z-A":
				result.sort((a, b) => b.title.localeCompare(a.title));
				break;

			case "Oldest":
				result.sort(
					(a, b) =>
						new Date(a.updatedAt).getTime() -
						new Date(b.updatedAt).getTime(),
				);
				break;

			case "Recently Added":
			default:
				result.sort(
					(a, b) =>
						new Date(b.updatedAt).getTime() -
						new Date(a.updatedAt).getTime(),
				);
		}

		return result;
	}, [items, activeTab, query, selectedGenres, selectedServices, sort]);

	function clearAllFilters() {
		setSelectedGenres([]);
		setSelectedServices([]);
	}

	const activeFilterCount = selectedGenres.length + selectedServices.length;

	return (
		<div className="relative px-6 md:px-24 py-10">
			{/* Swoosh Background */}
			<img
				src="/images/swoosh.svg"
				alt=""
				className="absolute inset-0 w-full h-full object-cover opacity-[0.25] pointer-events-none"
			/>

			{/* MEDIA TOOLBAR */}
			<MediaToolbar
				title="My Watchlist"
				total={filteredItems.length}
				activeTab={activeTab}
				onTabChange={setActiveTab}
				sort={sort}
				onSortChange={setSort}
				query={query}
				onQueryChange={setQuery}
				view={view}
				onViewChange={setView}
				onFilterClick={() => setFiltersOpen(!filtersOpen)}
			/>

			{/* FILTER PANEL */}
			{filtersOpen && (
				<div className="mb-8 p-6 rounded-2xl bg-[#1b1b1b] border border-border">
					<div className="flex justify-between items-center mb-6">
						<h3 className="text-lg font-semibold">Filters</h3>

						{activeFilterCount > 0 && (
							<button
								onClick={clearAllFilters}
								className="text-accent text-sm hover:underline"
							>
								Clear all
							</button>
						)}
					</div>

					{/* GENRE */}
					<div className="mb-6">
						<h4 className="text-xs uppercase tracking-wide text-muted mb-3">
							Genre
						</h4>

						<div className="flex flex-wrap gap-2">
							{GENRES.map((genre) => {
								const active = selectedGenres.includes(genre);

								return (
									<button
										key={genre}
										onClick={() => {
											setSelectedGenres((prev) =>
												active
													? prev.filter(
															(g) => g !== genre,
														)
													: [...prev, genre],
											);
										}}
										className={`px-3 py-1.5 rounded-full text-sm transition
								${active ? "bg-accent text-white" : "bg-[#2a2a2a] text-muted hover:bg-[#333]"}
							`}
									>
										{genre}
									</button>
								);
							})}
						</div>
					</div>

					{/* STREAMING SERVICES */}
					<div>
						<h4 className="text-xs uppercase tracking-wide text-muted mb-3">
							Streaming Service
						</h4>

						<div className="flex flex-wrap gap-2">
							{SERVICES.map((service) => {
								const active =
									selectedServices.includes(service);

								return (
									<button
										key={service}
										onClick={() => {
											setSelectedServices((prev) =>
												active
													? prev.filter(
															(s) =>
																s !== service,
														)
													: [...prev, service],
											);
										}}
										className={`px-3 py-1.5 rounded-full text-sm transition
								${active ? "bg-accent text-white" : "bg-[#2a2a2a] text-muted hover:bg-[#333]"}
							`}
									>
										{service}
									</button>
								);
							})}
						</div>
					</div>
				</div>
            )}
            
			{/* GRID VIEW */}
			{view === "grid" && (
				<MovieGrid
					items={filteredItems}
					onDelete={handleRemove}
					onAdd={(entry) => setSelected(entry)}
				/>
			)}

			{/* LIST VIEW */}
			{view === "list" && (
				<div className="space-y-4">
					{filteredItems.map((item) => (
						<div
							key={item.id}
							className="group relative flex gap-6 p-5 rounded-2xl bg-[#1b1b1b] border border-border transition hover:border-accent"
						>
							{/* Poster */}
							<img
								src={getPosterUrl(item.poster)}
								alt={item.title}
								className="w-24 h-36 object-cover rounded-xl shadow-md"
							/>

							{/* Content */}
							<div className="flex-1 flex flex-col justify-between">
								<div>
									<h3 className="text-lg font-semibold">
										{item.title}
									</h3>

									<p className="text-sm text-muted capitalize">
										{item.type === "movie"
											? "Movie"
											: "TV Show"}
									</p>

									{/* Extra Details */}
									<p className="text-xs text-muted mt-2">
										Status:{" "}
										<span className="capitalize">
											{item.status}
										</span>
									</p>

									{item.rating && (
										<p className="text-xs text-muted">
											Rating: ★ {item.rating}
										</p>
									)}

									<p className="text-xs text-muted">
										Added:{" "}
										{new Date(
											item.updatedAt,
										).toLocaleDateString()}
									</p>
								</div>
							</div>

							{/* Hover Actions */}
							<div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition">
								{/* Add to diary */}
								<button
									onClick={(e) => {
										e.stopPropagation();
										setSelected(item);
									}}
									className="p-2 rounded-full bg-accent hover:bg-accent/80 transition"
									title="Add to diary"
								>
									<Plus size={16} />
								</button>

								{/* Trash */}
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleRemove(item);
									}}
									className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition"
									title="Remove"
								>
									<Trash2 size={16} />
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			{selected && (
				<AddToDiaryModal
					open={true}
					onClose={() => {
						// ONLY CLOSE
						setSelected(null);
					}}
					onSave={(status) => {
						// Only remove if NOT planned
						if (status !== "planned") {
							removeFromWatchlist(selected.id, selected.type);

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

			{/* {selected && (
				<AddToDiaryModal
					open={true}
					onClose={() => {
						if (selected) {
							removeFromWatchlist(selected.id, selected.type);
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
			)} */}
		</div>
	);
}
