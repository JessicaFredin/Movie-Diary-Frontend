"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type SortDropdownProps = {
	value: string;
	onChange: (val: string) => void;
};

const options = ["Popularity", "Recently added", "A-Z", "Z-A"];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
	const [open, setOpen] = useState(false);

	return (
		<div className="relative inline-block text-sm">
			{/* Trigger button */}
			<button
				onClick={() => setOpen(!open)}
				className="flex items-center gap-1 text-white hover:text-[#FF414E] transition-colors cursor-pointer"
			>
				<span>sorted by {value}</span>
				<ChevronDown size={16} />
			</button>

			{/* Dropdown menu */}
			{open && (
				<div className="absolute left-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-10">
					<ul className="py-2">
						{options.map((opt) => (
							<li
								key={opt}
								onClick={() => {
									onChange(opt);
									setOpen(false);
								}}
								className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
									opt === value ? "font-semibold" : ""
								}`}
							>
								{opt}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
