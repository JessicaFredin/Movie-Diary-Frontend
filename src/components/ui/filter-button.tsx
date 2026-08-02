"use client";

import { SlidersHorizontal } from "lucide-react";

type FilterButtonProps = {
	onClick?: () => void;
	activeFilterCount?: number;
};

export default function FilterButton({
	onClick,
	activeFilterCount = 0,
}: FilterButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="flex h-10 items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 text-sm text-muted transition-all duration-200 hover:text-white"
		>
			<SlidersHorizontal size={16} />
			<span>Filters</span>

			{activeFilterCount > 0 && (
				<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-black leading-none text-white">
					{activeFilterCount}
				</span>
			)}
		</button>
	);
}
