"use client";

import { Grid, List } from "lucide-react";

type Props = {
	view: "grid" | "list";
	onChange: (val: "grid" | "list") => void;
};

export default function ViewToggle({ view, onChange }: Props) {
	return (
		<div className="flex items-center h-10 rounded-full bg-[#1b1b1b] border border-border overflow-hidden">
			<button
				onClick={() => onChange("grid")}
				className={`px-3 h-full flex items-center justify-center transition ${
					view === "grid"
						? "bg-white/5 text-white"
						: "text-muted hover:text-white"
				}`}
			>
				<Grid size={16} />
			</button>

			<button
				onClick={() => onChange("list")}
				className={`px-3 h-full flex items-center justify-center transition ${
					view === "list"
						? "bg-white/5 text-white"
						: "text-muted hover:text-white"
				}`}
			>
				<List size={16} />
			</button>
		</div>
	);
}