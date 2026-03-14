/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import MediaToolbar from "@/components/diary/media-toolbar";
import MovieGrid from "@/components/diary/movie-grid";
import LoadMoreButton from "@/components/diary/load-more-button";
import { getDiary } from "@/utils/diary-storage";
import { DiaryEntry } from "@/types/diary";
import AddToDiaryModal from "@/components/diary/add-to-diary-modal";
import { updateDiaryEntry, removeDiaryEntry } from "@/utils/diary-storage";

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

export default function MyDiaryPage() {
	const [activeTab, setActiveTab] = useState<"all" | "movies" | "tv">("all");
	const [sort, setSort] = useState("Popularity");
	const [query, setQuery] = useState("");
	const [items, setItems] = useState<DiaryEntry[]>([]);
	const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [view, setView] = useState<"grid" | "list">("grid");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
	const [selectedServices, setSelectedServices] = useState<string[]>([]);

	useEffect(() => {
		setItems(getDiary());
	}, []);

	function openEditModal(entry: DiaryEntry) {
		setSelectedEntry(entry);
		setIsModalOpen(true);
	}

	function handleDelete(entry: DiaryEntry) {
		removeDiaryEntry(entry.id, entry.type);
		setItems(getDiary());
	}

	const filteredItems = useMemo(() => {
		return items.filter((item) => {
			if (activeTab === "movies") return item.type === "movie";
			if (activeTab === "tv") return item.type === "tv";
			return true;
		});
	}, [items, activeTab]);

	const searchedItems = useMemo(() => {
		if (!query) return filteredItems;
		return filteredItems.filter((i) =>
			i.title.toLowerCase().includes(query.toLowerCase()),
		);
	}, [filteredItems, query]);

	function clearAllFilters() {
		setSelectedGenres([]);
		setSelectedServices([]);
	}

	const activeFilterCount = selectedGenres.length + selectedServices.length;

	return (
		<div className="relative px-6 md:px-24 py-10 overflow-hidden">
			{/* Swoosh Background */}
			<img
				src="/images/swoosh.svg"
				alt=""
				className="absolute inset-0 w-full h-full object-cover opacity-[0.25] pointer-events-none"
			/>

			<MediaToolbar
				title="My Diary"
				total={searchedItems.length}
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

			<MovieGrid
				items={searchedItems}
				onEdit={openEditModal}
				onDelete={handleDelete}
			/>

			<div className="flex justify-center mt-8 transition-all">
				<LoadMoreButton
					onClick={() => console.log("Load more clicked")}
				/>
			</div>

			{isModalOpen && selectedEntry && (
				<AddToDiaryModal
					open={isModalOpen}
					onClose={() => {
						setIsModalOpen(false);
						setSelectedEntry(null);
						setItems(getDiary()); // REFRESH AFTER SAVE
					}}
					content={{
						id: selectedEntry.id,
						type: selectedEntry.type,
						title: selectedEntry.title,
						poster: selectedEntry.poster,
						backdrop:
							selectedEntry.backdrop ?? selectedEntry.poster,
					}}
					initialData={selectedEntry}
				/>
			)}
		</div>
	);
}
