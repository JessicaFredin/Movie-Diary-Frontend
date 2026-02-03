"use client";

// import { FiFilter } from "react-icons/fi";
import { SlidersHorizontal } from "lucide-react";

type FilterButtonProps = {
	onClick?: () => void;
};

export default function FilterButton({ onClick }: FilterButtonProps) {
	return (
		<button
			onClick={onClick}
			className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
		>
			<div className="flex items-center gap-2 text-sm text-white hover:text-[#FF414E] transition-all cursor-pointer">
				<SlidersHorizontal size={18} /> Filters
			</div>
		</button>
	);
}
