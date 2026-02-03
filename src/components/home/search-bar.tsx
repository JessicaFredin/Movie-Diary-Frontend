"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

type Props = {
	onSearch?: (query: string) => void;
};

export default function SearchBar({ onSearch }: Props) {
	const [query, setQuery] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (onSearch) onSearch(query);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-2 w-full md:w-72"
		>
			<Icon icon="mdi:magnify" className="w-5 h-5 text-gray-300" />
			<input
				type="text"
				placeholder="Search movies & shows..."
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				className="bg-transparent outline-none text-sm text-white w-full placeholder-gray-400"
			/>
		</form>
	);
}
