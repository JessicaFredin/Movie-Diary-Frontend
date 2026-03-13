"use client";

import { useEffect, useState } from "react";
import AddToDiaryButton from "@/components/diary/add-to-diary-button";
import AddToDiaryModal from "@/components/diary/add-to-diary-modal";
import { getDiary, removeDiaryEntry } from "@/utils/diary-storage";
import { isInDiary } from "@/utils/is-in-diary";
import { DiaryEntry } from "@/types/diary";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
	id: number;
	title: string;
	poster: string;
	backdrop: string;
};

export default function TvDiaryActions({ id, title, poster, backdrop }: Props) {
	const [open, setOpen] = useState(false);
	const alreadyAdded = isInDiary(id, "tv");
	const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
	const [refresh, setRefresh] = useState(false);

	/* --------------------------
	   Load entry when editing
	---------------------------*/
	useEffect(() => {
		if (!alreadyAdded) return;

		const entry = getDiary().find((e) => e.id === id && e.type === "tv");

		if (entry) {
			setSelectedEntry(entry);
		}
	}, [alreadyAdded, id, refresh]);

	/* --------------------------
	   DELETE
	---------------------------*/
	function handleDelete() {
		removeDiaryEntry(id, "tv");
		setRefresh((v) => !v);
	}

	return (
		<>
			{/* NOT ADDED → SHOW ADD BUTTON */}
			{!alreadyAdded && (
				<AddToDiaryButton
					variant="pill"
					isAdded={false}
					onClick={() => setOpen(true)}
				/>
			)}

			{/* ADDED → SHOW EDIT + DELETE */}
			{alreadyAdded && (
				<div className="flex gap-3">
					<button
						onClick={() => setOpen(true)}
						className="flex items-center justify-center gap-2 rounded-full bg-surface-elevated hover:bg-surface-neutral px-4 py-2 text-sm transition"
					>
						<Pencil className="w-4 h-4" />
						Edit
					</button>

					<button
						onClick={handleDelete}
						className="flex items-center justify-center gap-2 rounded-full border border-accent text-accent hover:bg-accent hover:text-white px-4 py-2 text-sm transition"
					>
						<Trash2 className="w-4 h-4" />
						Delete
					</button>
				</div>
            )}
            
            {/* MODAL */}
			{open && (
				<AddToDiaryModal
					open={open}
					onClose={() => {
						setOpen(false);
						setRefresh((v) => !v);
					}}
					content={{
						id,
						type: "tv",
						title,
						poster,
						backdrop,
					}}
					initialData={selectedEntry ?? undefined}
				/>
			)}
		</>
	);
}
