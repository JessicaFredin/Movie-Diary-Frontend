/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import DiscoverHeader from "@/components/diary/discover-header";
import MovieGrid from "@/components/diary/movie-grid";
import LoadMoreButton from "@/components/diary/load-more-button";
import { getDiary } from "@/utils/diary-storage";
import { DiaryEntry } from "@/types/diary";

export default function MyDiaryPage() {
	const [activeTab, setActiveTab] = useState<"all" | "movies" | "tv">("all");
	const [sort, setSort] = useState("Popularity");
	const [query, setQuery] = useState("");
	const [items, setItems] = useState<DiaryEntry[]>([]);

	useEffect(() => {
		setItems(getDiary());
	}, []);

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

	return (
		<div className="relative px-6 md:px-24 py-10 overflow-hidden">
			{/* Swoosh Background */}
			<img
				src="/images/swoosh.svg"
				alt=""
				className="absolute inset-0 w-full h-full object-cover opacity-[0.25] pointer-events-none"
			/>

			<DiscoverHeader
				total={searchedItems.length}
				activeTab={activeTab}
				onTabChange={setActiveTab}
				sort={sort}
				onSortChange={setSort}
				query={query}
				onQueryChange={setQuery}
			/>

			<MovieGrid items={searchedItems} />

			<div className="flex justify-center mt-8 transition-all">
				<LoadMoreButton
					onClick={() => console.log("Load more clicked")}
				/>
			</div>
		</div>
	);
}
