"use client";

import SortDropdown from "@/components/ui/sort-dropdown";
import SearchBar from "@/components/diary/search-bar";
import FilterButton from "@/components/ui/filter-button";
import ViewToggle from "../ui/view-toggle";

type Props = {
	title: string;
	total: number;
	activeTab: "all" | "movies" | "tv";
	onTabChange: (tab: "all" | "movies" | "tv") => void;
	sort: string;
	onSortChange: (val: string) => void;
	query: string;
	onQueryChange: (val: string) => void;
	view: "grid" | "list";
	onViewChange: (val: "grid" | "list") => void;
	onFilterClick?: () => void;
};

export default function MediaToolbar({
	title,
	total,
	activeTab,
	onTabChange,
	sort,
	onSortChange,
	query,
	onQueryChange,
	view,
	onViewChange,
	onFilterClick
}: Props) {
	return (
		<div className="mb-8">
			{/* Title */}
			<h2 className="font-semibold text-2xl text-white mb-2">{title}</h2>

			{/* Tabs */}
			<div className="flex gap-4 mb-3 overflow-x-auto no-scrollbar">
				{["all", "movies", "tv"].map((tab) => (
					<button
						key={tab}
						onClick={() =>
							onTabChange(tab as "all" | "movies" | "tv")
						}
						className={`text-sm whitespace-nowrap transition ${
							activeTab === tab
								? "text-accent font-semibold"
								: "text-muted hover:text-white"
						}`}
					>
						{tab === "all"
							? "All"
							: tab === "movies"
								? "Movies"
								: "TV Shows"}
					</button>
				))}
			</div>

			{/* Controls */}
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				{/* Left section */}
				<div className="flex flex-wrap items-center gap-4 text-sm text-muted">
					<p className="whitespace-nowrap">{total} Titles</p>
					<SortDropdown value={sort} onChange={onSortChange} />
				</div>

				{/* Right section */}
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 w-full lg:w-auto">
					{/* Search full width on mobile */}
					<div className="w-full sm:w-auto flex-1">
						<SearchBar query={query} onChange={onQueryChange} />
					</div>

					<div className="flex items-center gap-3 justify-between sm:justify-start">
						{onFilterClick && (
							<FilterButton onClick={onFilterClick} />
						)}

						<ViewToggle view={view} onChange={onViewChange} />
					</div>
				</div>
			</div>
		</div>
	);
}
