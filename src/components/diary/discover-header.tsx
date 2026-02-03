"use client";

import SortDropdown from "@/components/ui/sort-dropdown";
import SearchBar from "@/components/diary/search-bar";
import FilterButton from "@/components/ui/filter-button";

type Props = {
	total: number;
	activeTab: "all" | "movies" | "tv";
	onTabChange: (tab: "all" | "movies" | "tv") => void;
	sort: string;
	onSortChange: (val: string) => void;
	query: string;
	onQueryChange: (val: string) => void;
};

export default function DiscoverHeader({
	total,
	activeTab,
	onTabChange,
	sort,
	onSortChange,
	query,
	onQueryChange,
}: Props) {
	return (
		<div className="mb-6">
			{/* Title */}
			<h2 className="font-semibold text-2xl text-white mb-2">My Diary</h2>

			{/* Tabs */}
			<div className="flex gap-4 mb-3">
				{["all", "movies", "tv"].map((tab) => (
					<button
						key={tab}
						onClick={() =>
							onTabChange(tab as "all" | "movies" | "tv")
						}
						className={`text-sm cursor-pointer ${
							activeTab === tab
								? "text-[#FF414E] font-semibold"
								: "text-gray-400 hover:text-white"
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

			{/* Bottom row: left = titles + sort, right = search + filter */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				{/* Left side */}
				<div className="flex items-center gap-6 text-sm text-gray-300">
					<p>{total} Titles</p>
					<SortDropdown value={sort} onChange={onSortChange} />
				</div>

				{/* Right side */}
				<div className="flex items-center gap-4">
					<SearchBar query={query} onChange={onQueryChange} />
					<FilterButton />
				</div>
			</div>
		</div>
	);
}
