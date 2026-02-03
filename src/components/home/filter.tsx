"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

const genres = [
	"Action",
	"Adventure",
	"Comedy",
	"Drama",
	"Fantasy",
	"Horror",
	"Romance",
	"Sci-Fi",
	"Thriller",
];

type Props = {
	onFilterChange?: (filters: { genres: string[]; sort: string }) => void;
};

export default function FilterSidebar({ onFilterChange }: Props) {
	const [open, setOpen] = useState(false);
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
	const [sort, setSort] = useState("popularity");

	const toggleGenre = (genre: string) => {
		const newSelection = selectedGenres.includes(genre)
			? selectedGenres.filter((g) => g !== genre)
			: [...selectedGenres, genre];

		setSelectedGenres(newSelection);
		onFilterChange?.({ genres: newSelection, sort });
	};

	const handleSortChange = (value: string) => {
		setSort(value);
		onFilterChange?.({ genres: selectedGenres, sort: value });
	};

	return (
		<>
			{/* Filter Button */}
			<button
				onClick={() => setOpen(true)}
				className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm cursor-pointer"
			>
				<Icon icon="mi:filter" className="w-5 h-5" />
				Filters
			</button>

			{/* Overlay */}
			{open && (
				<div
					onClick={() => setOpen(false)}
					className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
				/>
			)}

			{/* Sidebar */}
			<div
				className={`fixed top-0 right-0 h-full w-72 bg-[#111] text-white shadow-xl z-50 transform transition-transform duration-300 ${
					open ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="flex justify-between items-center p-4 border-b border-white/10">
					<h2 className="text-lg font-semibold">Filters</h2>
					<button onClick={() => setOpen(false)} className="cursor-pointer">
						<Icon icon="mdi:close" className="w-6 h-6" />
					</button>
				</div>

				<div className="p-4 space-y-6">
					{/* Sort */}
					<div>
						<h3 className="text-sm font-semibold mb-2">Sort By</h3>
						<select
							value={sort}
							onChange={(e) => handleSortChange(e.target.value)}
							className="w-full bg-black/30 border border-white/20 rounded px-2 py-1 text-sm"
						>
							<option value="popularity">Popularity</option>
							<option value="release_date">Release Date</option>
							<option value="rating">Rating</option>
							<option value="alphabetical">A-Z</option>
						</select>
					</div>

					{/* Genres */}
					<div>
						<h3 className="text-sm font-semibold mb-2">Genres</h3>
						<div className="grid grid-cols-2 gap-2">
							{genres.map((genre) => (
								<label
									key={genre}
									className={`flex items-center gap-2 cursor-pointer rounded px-2 py-1 ${
										selectedGenres.includes(genre)
											? "bg-[#FF414E]/80"
											: "bg-white/10"
									}`}
								>
									<input
										type="checkbox"
										checked={selectedGenres.includes(genre)}
										onChange={() => toggleGenre(genre)}
										className="accent-[#FF414E]"
									/>
									<span className="text-sm">{genre}</span>
								</label>
							))}
						</div>
					</div>

					{/* Clear All */}
					<button
						onClick={() => {
							setSelectedGenres([]);
							setSort("popularity");
							onFilterChange?.({
								genres: [],
								sort: "popularity",
							});
						}}
						className="w-full py-2 rounded bg-[#FF414E] hover:bg-[#e63946] text-white font-medium"
					>
						Clear All
					</button>
				</div>
			</div>
		</>
	);
}
