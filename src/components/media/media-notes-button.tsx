"use client";

import { useState } from "react";
import { StickyNote } from "lucide-react";

import MediaNotesModal from "@/components/media/media-notes-modal";
import type { MediaType } from "@/utils/media-notes-storage";

type Props = {
	mediaId: number;
	mediaType: MediaType;
	title: string;
	posterPath?: string | null;
};

export default function MediaNotesButton({
	mediaId,
	mediaType,
	title,
	posterPath,
}: Props) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-surface-elevated px-4 py-2 text-sm font-bold text-white transition hover:bg-surface-neutral"
			>
				<StickyNote className="h-4 w-4 text-yellow-300" />
				Notes
			</button>

			<MediaNotesModal
				open={open}
				onClose={() => setOpen(false)}
				mediaId={mediaId}
				mediaType={mediaType}
				title={title}
				posterPath={posterPath}
			/>
		</>
	);
}
