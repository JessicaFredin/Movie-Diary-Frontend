"use client";

import { Search } from "lucide-react";
import ModalWrapper from "@/components/ui/modal-wrapper";

type Props = {
	close: () => void;
};

export default function AddToListModal({ close }: Props) {
	const items = [
		{ title: "Blade Runner 2049", year: 2017, emoji: "🎬" },
		{ title: "Stranger Things", year: 2016, emoji: "🧪" },
		{ title: "Get Out", year: 2017, emoji: "🧠" },
		{ title: "Hereditary", year: 2018, emoji: "😈" },
		{ title: "Dune", year: 2021, emoji: "🏜️" },
	];

	return (
		<ModalWrapper close={close}>
			<h2 className="text-xl font-semibold mb-4">Add to List</h2>

			<div className="relative mb-4">
				<Search
					className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
					size={16}
				/>

				<input
					className="w-full bg-surface-muted pl-10 pr-4 py-3 rounded-xl outline-none border border-accent"
					placeholder="Search movies & shows..."
				/>
			</div>

			<div className="max-h-72 overflow-y-auto space-y-3 custom-scrollbar pr-2">
				{items.map((item, i) => (
					<div
						key={i}
						className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5"
					>
						<div className="flex items-center gap-3">
							<div className="text-xl">{item.emoji}</div>

							<div>
								<p>{item.title}</p>
								<p className="text-sm text-muted">
									Movie • {item.year}
								</p>
							</div>
						</div>

						<button className="text-accent text-xl">+</button>
					</div>
				))}
			</div>
		</ModalWrapper>
	);
}
