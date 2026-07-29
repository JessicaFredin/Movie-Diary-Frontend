

// export default function SearchBar({ query, onChange }: Props) {
// 	return (
// 		<div className="relative flex items-center">
// 			<FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
// 			<input
// 				type="text"
// 				placeholder="Search for movies & TV shows"
// 				value={query}
// 				onChange={(e) => onChange(e.target.value)}
// 				className="w-[300px] bg-transparent border-b border-accent pl-10 py-1 text-white focus:outline-none"
// 			/>
// 		</div>
// 	);
// }



"use client";

import { Search, X } from "lucide-react";

type Props = {
	query: string;
	onChange: (val: string) => void;
	placeholder?: string;
	className?: string;
};

export default function SearchBar({
	query,
	onChange,
	placeholder = "Search for movies & TV shows",
	className = "",
}: Props) {
	return (
		<div className={`relative flex items-center ${className}`}>
			<Search className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />

			<input
				type="text"
				placeholder={placeholder}
				value={query}
				onChange={(event) => onChange(event.target.value)}
				className="w-full sm:w-[350px] border-b border-accent bg-transparent py-2 pl-10 pr-8 text-sm text-white placeholder:text-muted focus:outline-none"
			/>

			{query && (
				<button
					type="button"
					onClick={() => onChange("")}
					className="absolute right-0 top-1/2 -translate-y-1/2 text-muted transition hover:text-white"
					aria-label="Clear search"
				>
					<X className="h-4 w-4" />
				</button>
			)}
		</div>
	);
}
