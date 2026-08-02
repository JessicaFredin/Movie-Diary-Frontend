"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type SortOption = {
	label: string;
	value: string;
};

type Props = {
	value: string;
	onChange: (value: string) => void;
};

const options: SortOption[] = [
	{ label: "Popularity", value: "Popularity" },
	{ label: "Highest rated", value: "Highest rated" },
	{ label: "Lowest rated", value: "Lowest rated" },
	{ label: "Recently added", value: "Recently added" },
	{ label: "Oldest", value: "Oldest" },
	{ label: "A-Z", value: "A-Z" },
	{ label: "Z-A", value: "Z-A" },
];

function getLabel(value: string): string {
	return (
		options.find((option) => option.value === value)?.label ?? "Popularity"
	);
}

export default function SortDropdown({ value, onChange }: Props) {
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
