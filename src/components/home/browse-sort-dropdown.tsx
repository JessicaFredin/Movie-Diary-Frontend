"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export type BrowseSort =
	| "popular"
	| "top_rated"
	| "newest"
	| "oldest"
	| "most_rated"
	| "title_asc"
	| "title_desc";

type SortOption = {
	label: string;
	value: BrowseSort;
};

type Props = {
	value: BrowseSort;
	onChange: (value: BrowseSort) => void;
};

const options: SortOption[] = [
	{ label: "Popularity", value: "popular" },
	{ label: "Top rated", value: "top_rated" },
	{ label: "Newest", value: "newest" },
	{ label: "Oldest", value: "oldest" },
	{ label: "Most ratings", value: "most_rated" },
	{ label: "A-Z", value: "title_asc" },
	{ label: "Z-A", value: "title_desc" },
];

function getLabel(value: BrowseSort): string {
	return (
		options.find((option) => option.value === value)?.label ?? "Popularity"
	);
}

export default function BrowseSortDropdown({ value, onChange }: Props) {
	const [open, setOpen] = useState(false);
	const wrapperRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent): void {
			if (!wrapperRef.current) return;

			if (!wrapperRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div ref={wrapperRef} className="relative inline-block text-sm">
			<button
				type="button"
				onClick={() => setOpen((current) => !current)}
				className="flex items-center gap-4 font-semibold text-white transition-colors hover:text-accent"
			>
				<span>sorted by {getLabel(value)}</span>
				<ChevronDown size={16} />
			</button>

			{open && (
				<div className="absolute right-0 z-50 mt-2 w-44 rounded-md bg-white text-black shadow-lg xl:left-0 xl:right-auto">
					<ul className="py-2">
						{options.map((option) => (
							<li
								key={option.value}
								onClick={() => {
									onChange(option.value);
									setOpen(false);
								}}
								className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
									option.value === value
										? "font-semibold"
										: ""
								}`}
							>
								{option.label}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
