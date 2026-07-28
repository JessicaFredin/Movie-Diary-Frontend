// // // "use client";

// // // import { useEffect, useState } from "react";
// // // import AddToDiaryButton from "@/components/diary/add-to-diary-button";
// // // import AddToDiaryModal from "@/components/diary/add-to-diary-modal";
// // // import { getDiary, removeDiaryEntry } from "@/utils/diary-storage";
// // // import { isInDiary } from "@/utils/is-in-diary";
// // // import { DiaryEntry } from "@/types/diary";
// // // import { Pencil, Trash2 } from "lucide-react";

// // // type Props = {
// // // 	id: number;
// // // 	title: string;
// // // 	poster: string;
// // // 	backdrop: string;
// // // };

// // // export default function MovieDiaryActions({
// // // 	id,
// // // 	title,
// // // 	poster,
// // // 	backdrop,
// // // }: Props) {
// // // 	const [open, setOpen] = useState(false);
// // // 	const alreadyAdded = isInDiary(id, "movie");
// // // 	const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
// // // 	const [refresh, setRefresh] = useState(false);

// // // 	/* --------------------------
// // // 	   Load entry when editing
// // // 	---------------------------*/
// // // 	useEffect(() => {
// // // 		if (!alreadyAdded) return;

// // // 		const entry = getDiary().find((e) => e.id === id && e.type === "movie");

// // // 		if (entry) {
// // // 			setSelectedEntry(entry);
// // // 		}
// // // 	}, [alreadyAdded, id, refresh]);

// // // 	/* --------------------------
// // // 	   DELETE
// // // 	---------------------------*/
// // // 	function handleDelete() {
// // // 		removeDiaryEntry(id, "movie");
// // // 		setRefresh((v) => !v);
// // // 	}

// // // 	return (
// // // 		<>
// // // 			{/* NOT ADDED → SHOW ADD BUTTON */}
// // // 			{!alreadyAdded && (
// // // 				<AddToDiaryButton
// // // 					variant="pill"
// // // 					isAdded={false}
// // // 					onClick={() => setOpen(true)}
// // // 				/>
// // // 			)}

// // // 			{/* ADDED → SHOW EDIT + DELETE */}
// // // 			{alreadyAdded && (
// // // 				<div className="flex gap-3">
// // // 					<button
// // // 						onClick={() => setOpen(true)}
// // // 						className="flex items-center justify-center gap-2 rounded-full bg-surface-elevated hover:bg-surface-neutral px-4 py-2 text-sm transition"
// // // 					>
// // // 						<Pencil className="w-4 h-4" />
// // // 						Edit
// // // 					</button>

// // // 					<button
// // // 						onClick={handleDelete}
// // // 						className="flex items-center justify-center gap-2 rounded-full border border-accent text-accent hover:bg-accent hover:text-white px-4 py-2 text-sm transition"
// // // 					>
// // // 						<Trash2 className="w-4 h-4" />
// // // 						Delete
// // // 					</button>
// // // 				</div>
// // // 			)}

// // // 			{/* MODAL */}
// // // 			{open && (
// // // 				<AddToDiaryModal
// // // 					open={open}
// // // 					onClose={() => {
// // // 						setOpen(false);
// // // 						setRefresh((v) => !v);
// // // 					}}
// // // 					content={{
// // // 						id,
// // // 						type: "movie",
// // // 						title,
// // // 						poster,
// // // 						backdrop,
// // // 					}}
// // // 					initialData={selectedEntry ?? undefined}
// // // 				/>
// // // 			)}
// // // 		</>
// // // 	);
// // // }

// // "use client";

// // import { useCallback, useEffect, useState } from "react";
// // import AddToDiaryButton from "@/components/diary/add-to-diary-button";
// // import AddToDiaryModal from "@/components/diary/add-to-diary-modal";
// // import { getDiary, removeDiaryEntry } from "@/utils/diary-storage";
// // import type { DiaryEntry } from "@/types/diary";
// // import { Pencil, Trash2 } from "lucide-react";

// // type Props = {
// // 	id: number;
// // 	title: string;
// // 	poster: string;
// // 	backdrop: string;
// // };

// // export default function MovieDiaryActions({
// // 	id,
// // 	title,
// // 	poster,
// // 	backdrop,
// // }: Props) {
// // 	const [open, setOpen] = useState(false);
// // 	const [alreadyAdded, setAlreadyAdded] = useState(false);
// // 	const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
// // 	const [loading, setLoading] = useState(true);

// // 	const loadEntry = useCallback(async () => {
// // 		setLoading(true);

// // 		try {
// // 			const diary = await getDiary();

// // 			const entry = diary.find(
// // 				(item) => item.id === id && item.type === "movie",
// // 			);

// // 			setAlreadyAdded(Boolean(entry));
// // 			setSelectedEntry(entry ?? null);
// // 		} catch (error) {
// // 			console.error("Failed to load movie diary entry:", error);
// // 			setAlreadyAdded(false);
// // 			setSelectedEntry(null);
// // 		} finally {
// // 			setLoading(false);
// // 		}
// // 	}, [id]);

// // 	useEffect(() => {
// // 		loadEntry();
// // 	}, [loadEntry]);

// // 	async function handleDelete() {
// // 		try {
// // 			await removeDiaryEntry(id, "movie");
// // 			await loadEntry();
// // 		} catch (error) {
// // 			console.error("Failed to delete movie diary entry:", error);
// // 			alert("Could not delete this from your diary.");
// // 		}
// // 	}

// // 	if (loading) return null;

// // 	return (
// // 		<>
// // 			{!alreadyAdded && (
// // 				<AddToDiaryButton
// // 					variant="pill"
// // 					isAdded={false}
// // 					onClick={() => setOpen(true)}
// // 				/>
// // 			)}

// // 			{alreadyAdded && (
// // 				<div className="flex gap-3">
// // 					<button
// // 						type="button"
// // 						onClick={() => setOpen(true)}
// // 						className="flex items-center justify-center gap-2 rounded-full bg-surface-elevated hover:bg-surface-neutral px-4 py-2 text-sm transition"
// // 					>
// // 						<Pencil className="w-4 h-4" />
// // 						Edit
// // 					</button>

// // 					<button
// // 						type="button"
// // 						onClick={handleDelete}
// // 						className="flex items-center justify-center gap-2 rounded-full border border-accent text-accent hover:bg-accent hover:text-white px-4 py-2 text-sm transition"
// // 					>
// // 						<Trash2 className="w-4 h-4" />
// // 						Delete
// // 					</button>
// // 				</div>
// // 			)}

// // 			{open && (
// // 				<AddToDiaryModal
// // 					open={open}
// // 					onClose={async () => {
// // 						setOpen(false);
// // 						await loadEntry();
// // 					}}
// // 					content={{
// // 						id,
// // 						type: "movie",
// // 						title,
// // 						poster,
// // 						backdrop,
// // 					}}
// // 					initialData={selectedEntry ?? undefined}
// // 				/>
// // 			)}
// // 		</>
// // 	);
// // }

// "use client";

// import { useCallback, useEffect, useState } from "react";
// import AddToDiaryButton from "@/components/diary/add-to-diary-button";
// import AddToDiaryModal from "@/components/diary/add-to-diary-modal";
// import ConfirmDialog from "@/components/ui/confirm-dialog";
// import { getDiary, removeDiaryEntry } from "@/utils/diary-storage";
// import { getWatchlist, removeFromWatchlist } from "@/utils/watchlist-storage";
// import type { DiaryEntry } from "@/types/diary";
// import { CheckCircle2, Pencil, Plus, Trash2 } from "lucide-react";

// type Status = "watching" | "completed" | "planned";

// type Props = {
// 	id: number;
// 	title: string;
// 	poster: string;
// 	backdrop: string;
// };

// export default function MovieDiaryActions({
// 	id,
// 	title,
// 	poster,
// 	backdrop,
// }: Props) {
// 	const [open, setOpen] = useState(false);
// 	const [confirmOpen, setConfirmOpen] = useState(false);

// 	const [alreadyAdded, setAlreadyAdded] = useState(false);
// 	const [inWatchlist, setInWatchlist] = useState(false);

// 	const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
// 	const [watchlistEntry, setWatchlistEntry] = useState<DiaryEntry | null>(
// 		null,
// 	);

// 	const [loading, setLoading] = useState(true);
// 	const [deleting, setDeleting] = useState(false);

// 	const loadEntry = useCallback(async () => {
// 		setLoading(true);

// 		try {
// 			const diary = await getDiary();

// 			const diaryEntry =
// 				diary.find((item) => item.id === id && item.type === "movie") ??
// 				null;

// 			setAlreadyAdded(Boolean(diaryEntry));
// 			setSelectedEntry(diaryEntry);

// 			if (diaryEntry) {
// 				setInWatchlist(false);
// 				setWatchlistEntry(null);
// 				return;
// 			}

// 			const watchlist = await getWatchlist();

// 			const plannedEntry =
// 				watchlist.find(
// 					(item) => item.id === id && item.type === "movie",
// 				) ?? null;

// 			setInWatchlist(Boolean(plannedEntry));
// 			setWatchlistEntry(plannedEntry);
// 		} catch (error) {
// 			console.error("Failed to load movie status:", error);
// 			setAlreadyAdded(false);
// 			setInWatchlist(false);
// 			setSelectedEntry(null);
// 			setWatchlistEntry(null);
// 		} finally {
// 			setLoading(false);
// 		}
// 	}, [id]);

// 	useEffect(() => {
// 		loadEntry();
// 	}, [loadEntry]);

// 	async function handleDelete() {
// 		try {
// 			setDeleting(true);

// 			if (alreadyAdded) {
// 				await removeDiaryEntry(id, "movie");
// 			}

// 			if (inWatchlist) {
// 				await removeFromWatchlist(id, "movie");
// 			}

// 			setConfirmOpen(false);
// 			await loadEntry();
// 		} catch (error) {
// 			console.error("Failed to remove movie:", error);
// 			alert(
// 				`Could not remove this from your ${
// 					alreadyAdded ? "diary" : "watchlist"
// 				}.`,
// 			);
// 		} finally {
// 			setDeleting(false);
// 		}
// 	}

// 	async function handleModalSave(status: Status) {
// 		if (status !== "planned") {
// 			try {
// 				await removeFromWatchlist(id, "movie");
// 			} catch {
// 				// Ignore if it was not in watchlist.
// 			}
// 		}

// 		setOpen(false);
// 		await loadEntry();
// 	}

// 	if (loading) return null;

// 	const activeEntry = selectedEntry ?? watchlistEntry ?? undefined;

// 	const deleteTarget = alreadyAdded ? "diary" : "watchlist";

// 	return (
// 		<>
// 			{/* NOT ADDED AND NOT PLANNED */}
// 			{!alreadyAdded && !inWatchlist && (
// 				<AddToDiaryButton
// 					variant="pill"
// 					isAdded={false}
// 					onClick={() => setOpen(true)}
// 				/>
// 			)}

// 			{/* PLANNED / WATCHLIST */}
// 			{!alreadyAdded && inWatchlist && (
// 				<div className="space-y-3">
// 					<div className="flex items-center gap-2 text-sm font-semibold text-green-400">
// 						<CheckCircle2 className="h-4 w-4" />
// 						<span>Planned</span>
// 					</div>

// 					<div className="flex gap-3">
// 						<button
// 							type="button"
// 							onClick={() => setOpen(true)}
// 							className="flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
// 						>
// 							<Plus className="h-4 w-4" />
// 							Add to diary
// 						</button>

// 						<button
// 							type="button"
// 							onClick={() => setConfirmOpen(true)}
// 							className="flex items-center justify-center gap-2 rounded-full border border-accent px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent hover:text-white"
// 						>
// 							<Trash2 className="h-4 w-4" />
// 							Remove
// 						</button>
// 					</div>
// 				</div>
// 			)}

// 			{/* ADDED TO DIARY */}
// 			{alreadyAdded && (
// 				<div className="space-y-3">
// 					<div className="flex items-center gap-2 text-sm font-semibold text-green-400">
// 						<CheckCircle2 className="h-4 w-4" />
// 						<span>Added to diary</span>
// 					</div>

// 					<div className="flex gap-3">
// 						<button
// 							type="button"
// 							onClick={() => setOpen(true)}
// 							className="flex items-center justify-center gap-2 rounded-full bg-surface-elevated px-4 py-2 text-sm transition hover:bg-surface-neutral"
// 						>
// 							<Pencil className="h-4 w-4" />
// 							Edit
// 						</button>

// 						<button
// 							type="button"
// 							onClick={() => setConfirmOpen(true)}
// 							className="flex items-center justify-center gap-2 rounded-full border border-accent px-4 py-2 text-sm text-accent transition hover:bg-accent hover:text-white"
// 						>
// 							<Trash2 className="h-4 w-4" />
// 							Delete
// 						</button>
// 					</div>
// 				</div>
// 			)}

// 			{open && (
// 				<AddToDiaryModal
// 					open={open}
// 					onClose={async () => {
// 						setOpen(false);
// 						await loadEntry();
// 					}}
// 					onSave={handleModalSave}
// 					content={{
// 						id,
// 						type: "movie",
// 						title,
// 						poster,
// 						backdrop,
// 					}}
// 					initialData={activeEntry}
// 				/>
// 			)}

// 			<ConfirmDialog
// 				open={confirmOpen}
// 				title={`Remove from ${deleteTarget}?`}
// 				description={`Are you sure you want to remove "${title}" from your ${deleteTarget}? This will not delete the movie itself.`}
// 				confirmLabel="Remove"
// 				loading={deleting}
// 				onCancel={() => setConfirmOpen(false)}
// 				onConfirm={handleDelete}
// 			/>
// 		</>
// 	);
// }

"use client";

import { useCallback, useEffect, useState } from "react";
import AddToDiaryButton from "@/components/diary/add-to-diary-button";
import AddToDiaryModal from "@/components/diary/add-to-diary-modal";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { getDiary, removeDiaryEntry } from "@/utils/diary-storage";
import { getWatchlist, removeFromWatchlist } from "@/utils/watchlist-storage";
import type { DiaryEntry } from "@/types/diary";
import { CheckCircle2, Pencil, Plus, Trash2 } from "lucide-react";

type Status = "watching" | "completed" | "planned";

type Props = {
	id: number;
	title: string;
	poster: string;
	backdrop: string;
};

export default function MovieDiaryActions({
	id,
	title,
	poster,
	backdrop,
}: Props) {
	const [open, setOpen] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);

	const [alreadyAdded, setAlreadyAdded] = useState(false);
	const [inWatchlist, setInWatchlist] = useState(false);

	const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
	const [watchlistEntry, setWatchlistEntry] = useState<DiaryEntry | null>(
		null,
	);

	const [loading, setLoading] = useState(true);
	const [deleting, setDeleting] = useState(false);

	const loadEntry = useCallback(async () => {
		setLoading(true);

		try {
			const diary = await getDiary();

			const diaryEntry =
				diary.find((item) => item.id === id && item.type === "movie") ??
				null;

			setAlreadyAdded(Boolean(diaryEntry));
			setSelectedEntry(diaryEntry);

			if (diaryEntry) {
				setInWatchlist(false);
				setWatchlistEntry(null);
				return;
			}

			const watchlist = await getWatchlist();

			const plannedEntry =
				watchlist.find(
					(item) => item.id === id && item.type === "movie",
				) ?? null;

			setInWatchlist(Boolean(plannedEntry));
			setWatchlistEntry(plannedEntry);
		} catch (error) {
			console.error("Failed to load movie status:", error);
			setAlreadyAdded(false);
			setInWatchlist(false);
			setSelectedEntry(null);
			setWatchlistEntry(null);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		void loadEntry();
	}, [loadEntry]);

	async function handleDelete() {
		try {
			setDeleting(true);

			if (alreadyAdded) {
				await removeDiaryEntry(id, "movie");
			}

			setConfirmOpen(false);
			await loadEntry();
		} catch (error) {
			console.error("Failed to remove movie:", error);
			alert("Could not remove this from your diary.");
		} finally {
			setDeleting(false);
		}
	}

	async function handleModalSave(status: Status) {
		if (status !== "planned") {
			try {
				await removeFromWatchlist(id, "movie");
			} catch {
				// Ignore if it was not in watchlist.
			}
		}

		setOpen(false);
		await loadEntry();
	}

	if (loading) return null;

	const activeEntry = selectedEntry ?? watchlistEntry ?? undefined;

	return (
		<>
			{/* NOT ADDED AND NOT PLANNED */}
			{!alreadyAdded && !inWatchlist && (
				<AddToDiaryButton
					variant="pill"
					isAdded={false}
					onClick={() => setOpen(true)}
				/>
			)}

			{/* PLANNED / WATCHLIST
			{!alreadyAdded && inWatchlist && (
				<div className="space-y-3">
					<div className="flex items-center gap-2 text-sm font-semibold text-green-400">
						<CheckCircle2 className="h-4 w-4" />
						<span>Planned</span>
					</div>

					<div className="flex gap-3">
						<button
							type="button"
							onClick={() => setOpen(true)}
							className="flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
						>
							<Plus className="h-4 w-4" />
							Add to diary
						</button>
					</div>
				</div>
			)} */}

			{/* PLANNED / WATCHLIST */}
			{!alreadyAdded && inWatchlist && (
				<div className="space-y-3">
					<div className="flex items-center gap-2 text-sm font-semibold text-green-400">
						<CheckCircle2 className="h-4 w-4" />
						<span>Planned</span>
					</div>

					<div className="w-full">
						<button
							type="button"
							onClick={() => setOpen(true)}
							className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
						>
							<Plus className="h-4 w-4" />
							Add to diary
						</button>
					</div>
				</div>
			)}

			{/* ADDED TO DIARY */}
			{alreadyAdded && (
				<div className="space-y-3">
					<div className="flex items-center gap-2 text-sm font-semibold text-green-400">
						<CheckCircle2 className="h-4 w-4" />
						<span>Added to diary</span>
					</div>

					<div className="flex gap-3">
						<button
							type="button"
							onClick={() => setOpen(true)}
							className="flex items-center justify-center gap-2 rounded-full bg-surface-elevated px-4 py-2 text-sm transition hover:bg-surface-neutral"
						>
							<Pencil className="h-4 w-4" />
							Edit
						</button>

						<button
							type="button"
							onClick={() => setConfirmOpen(true)}
							className="flex items-center justify-center gap-2 rounded-full border border-accent px-4 py-2 text-sm text-accent transition hover:bg-accent hover:text-white"
						>
							<Trash2 className="h-4 w-4" />
							Delete
						</button>
					</div>
				</div>
			)}

			{open && (
				<AddToDiaryModal
					open={open}
					onClose={async () => {
						setOpen(false);
						await loadEntry();
					}}
					onSave={handleModalSave}
					content={{
						id,
						type: "movie",
						title,
						poster,
						backdrop,
					}}
					initialData={activeEntry}
				/>
			)}

			<ConfirmDialog
				open={confirmOpen}
				title="Remove from diary?"
				description={`Are you sure you want to remove "${title}" from your diary? This will not delete the movie itself.`}
				confirmLabel="Remove"
				loading={deleting}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={handleDelete}
			/>
		</>
	);
}