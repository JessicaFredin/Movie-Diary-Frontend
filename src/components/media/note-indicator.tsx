"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { StickyNote } from "lucide-react";

import {
	getMediaNotePresence,
	type MediaType,
} from "@/utils/media-notes-storage";

type NoteIndicatorProps = {
	onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
	count?: number;
	mediaId: number;
	mediaType: MediaType;
};

export default function NoteIndicator({
	onClick,
	count,
	mediaId,
	mediaType,
}: NoteIndicatorProps) {
	const [hasNote, setHasNote] = useState(false);

	useEffect(() => {
		let mounted = true;

		async function loadPresence(): Promise<void> {
			try {
				const exists = await getMediaNotePresence(mediaId, mediaType);

				if (mounted) {
					setHasNote(exists);
				}
			} catch (error) {
				console.error("Failed to check note presence:", error);

				if (mounted) {
					setHasNote(false);
				}
			}
		}

		void loadPresence();

		return () => {
			mounted = false;
		};
	}, [mediaId, mediaType]);

	if (!hasNote) return null;

	return (
		<button
			type="button"
			onClick={onClick}
			className="flex items-center gap-1 rounded-full border border-accent/30 bg-black/75 px-2.5 py-1 text-xs font-bold text-accent shadow-lg shadow-accent/10 backdrop-blur transition hover:bg-accent/15 hover:text-white"
			title="View notes"
			aria-label="View notes"
		>
			<StickyNote className="h-3.5 w-3.5 text-accent" />
			<span>Note</span>

			{typeof count === "number" && count > 1 && (
				<span className="ml-0.5 rounded-full bg-accent px-1.5 py-0.5 text-[9px] leading-none text-white">
					{count}
				</span>
			)}
		</button>
	);
}
