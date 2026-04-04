"use client";

import { Globe, Lock, Pencil, Trash2 } from "lucide-react";
import { List } from "@/types/list";

type Props = {
	list: List;
	openList: (list: List) => void;
	menuOpen: number | null;
	setMenuOpen: (id: number | null) => void;
	openEdit: (list: List) => void;
};

export default function ListCard({
	list,
	openList,
	menuOpen,
	setMenuOpen,
	openEdit,
}: Props) {
	return (
		<div
			className="bg-surface rounded-2xl overflow-hidden shadow-xl hover:-translate-y-1 transition cursor-pointer"
			onClick={() => openList(list)}
		>
			<div className="h-24 relative" style={{ background: list.color }}>
				<div className="absolute right-3 top-3 bg-black/30 rounded-full p-2">
					{list.isPublic ? <Globe size={14} /> : <Lock size={14} />}
				</div>
			</div>

			<div className="p-4 flex items-start justify-between">
				<div>
					<p className="font-medium">{list.title}</p>
					<p className="text-sm text-muted">
						{list.items.length} titles
					</p>
				</div>

				<div className="relative">
					<button
						onClick={(e) => {
							e.stopPropagation();
							setMenuOpen(list.id);
						}}
						className="text-muted"
					>
						•••
					</button>

					{menuOpen === list.id && (
						<div className="absolute right-0 top-6 bg-surface rounded-xl shadow-xl p-2 w-36">
							<button
								onClick={(e) => {
									e.stopPropagation();
									openEdit(list);
									setMenuOpen(null);
								}}
								className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-md w-full"
							>
								<Pencil size={14} /> Edit
							</button>

							<button className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-md text-red-400 w-full">
								<Trash2 size={14} /> Delete
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
