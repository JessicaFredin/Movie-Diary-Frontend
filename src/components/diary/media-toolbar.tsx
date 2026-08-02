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
	activeFilterCount?: number;
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
	onFilterClick,
	activeFilterCount = 0,
}: Props) {
	return (
		<div className="mb-8">
			<h2 className="mb-2 text-2xl font-semibold text-white">{title}</h2>

			<div className="no-scrollbar mb-3 flex gap-4 overflow-x-auto">
				{["all", "movies", "tv"].map((tab) => (
					<button
						type="button"
						key={tab}
						onClick={() =>
							onTabChange(tab as "all" | "movies" | "tv")
						}
						className={`whitespace-nowrap text-sm transition ${
							activeTab === tab
								? "font-semibold text-accent"
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

			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex flex-wrap items-center gap-4 text-sm text-muted">
					<p className="whitespace-nowrap">{total} Titles</p>
					<SortDropdown value={sort} onChange={onSortChange} />
				</div>

				<div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:w-auto">
					<div className="w-full flex-1 sm:w-auto">
						<SearchBar query={query} onChange={onQueryChange} />
					</div>

					<div className="flex items-center justify-between gap-3 sm:justify-start">
						{onFilterClick && (
							<FilterButton
								onClick={onFilterClick}
								activeFilterCount={activeFilterCount}
							/>
						)}

						<ViewToggle view={view} onChange={onViewChange} />
					</div>
				</div>
			</div>
		</div>
	);
}
