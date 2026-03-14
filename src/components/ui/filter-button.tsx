"use client";

import { SlidersHorizontal } from "lucide-react";

type FilterButtonProps = {
	onClick?: () => void;
};

export default function FilterButton({ onClick }: FilterButtonProps) {
	return (
		<button
			onClick={onClick}
			className="flex items-center gap-2 px-4 h-10 rounded-full bg-[#1b1b1b] border border-border text-muted hover:text-white text-sm transition-all duration-200"
		>
			<SlidersHorizontal size={16} />
			Filters
		</button>
	);
}
