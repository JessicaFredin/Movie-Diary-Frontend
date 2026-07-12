"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Plus,
	Pencil,
	Trash2,
	PlayCircle,
	Star,
	CheckCircle2,
} from "lucide-react";

import AddToDiaryModal from "@/components/diary/add-to-diary-modal";
import { createClient } from "@/lib/supabase/client";
import { removeDiaryEntry } from "@/utils/diary-storage";
import { getWatchlist, removeFromWatchlist } from "@/utils/watchlist-storage";
import type { DiaryEntry } from "@/types/diary";
import ConfirmDialog from "@/components/ui/confirm-dialog";

type MediaType = "movie" | "tv";
type CardVariant = "default" | "compact" | "large" | "row" | "watchlist";

type TmdbMedia = {
	id: number;
	media_type?: "movie" | "tv";
	title?: string;
	name?: string;
	original_title?: string;
	original_name?: string;
	poster_path?: string | null;
	backdrop_path?: string | null;
	vote_average?: number | null;
};

type DbDiaryEntry = {
	id: number;
	media_id: string;
	media_type: MediaType;
	title_snapshot: string | null;
	poster_path_snapshot: string | null;
	backdrop_path_snapshot: string | null;
	rating: number | null;
	status: "watching" | "completed" | "planned";
	progress: DiaryEntry["progress"] | null;
	created_at: string;
	updated_at: string | null;
};

type ProgressShape = {
	currentSeason?: number;
	currentEpisode?: number;
	percentage?: number;
	progress?: number;
};

type SaveStatus = "watching" | "completed" | "planned";

type Props = {
	media?: TmdbMedia;

	id?: number;
	type?: MediaType;
	title?: string;
	posterPath?: string | null;
	backdropPath?: string | null;
	rating?: number | null;

	variant?: CardVariant;
	showDeleteButton?: boolean;
	onDiaryChanged?: () => void | Promise<void>;

	initialDiaryEntry?: DiaryEntry | null;

	onWatchlistRemove?: () => void | Promise<void>;
	onWatchlistSave?: (status: SaveStatus) => void | Promise<void>;

	readOnly?: boolean;
};

function getMediaType(media?: TmdbMedia, explicitType?: MediaType): MediaType {
	if (explicitType) return explicitType;
	if (media?.media_type === "tv") return "tv";
	return "movie";
}

function getMediaTitle(media?: TmdbMedia, explicitTitle?: string) {
	return (
		explicitTitle ||
		media?.title ||
		media?.name ||
		media?.original_title ||
		media?.original_name ||
		"Untitled"
	);
}

function getImageUrl(path?: string | null, size = "w500") {
	if (!path) return "/logo.png";
	if (path.startsWith("http")) return path;

	if (
		path.startsWith("/images/") ||
		path === "/logo.png" ||
		path.startsWith("/logo")
	) {
		return path;
	}

	const cleanPath = path.startsWith("/") ? path : `/${path}`;
	return `https://image.tmdb.org/t/p/${size}${cleanPath}`;
}

function mapDbToDiaryEntry(row: DbDiaryEntry): DiaryEntry {
	return {
		id: Number(row.media_id),
		type: row.media_type,
		title: row.title_snapshot ?? "",
		poster: row.poster_path_snapshot ?? "",
		backdrop: row.backdrop_path_snapshot ?? row.poster_path_snapshot ?? "",
		status: row.status,
		progress: row.progress ?? undefined,
		rating: row.rating,
		updatedAt: row.updated_at ?? row.created_at,
	} as DiaryEntry;
}

function getProgress(entry: DiaryEntry | null): ProgressShape | null {
	if (!entry?.progress) return null;
	return entry.progress as ProgressShape;
}

function getProgressPercentage(entry: DiaryEntry | null) {
	const progress = getProgress(entry);
	const percentage = progress?.percentage ?? progress?.progress;

	if (typeof percentage !== "number") return null;

	return Math.min(100, Math.max(0, Math.round(percentage)));
}

function getTvEpisodeLabel(entry: DiaryEntry | null) {
	const progress = getProgress(entry);

	if (!progress?.currentSeason || !progress?.currentEpisode) return null;

	return `S${progress.currentSeason} · E${progress.currentEpisode}`;
}

export default function MediaCard({
	media,
	id,
	type,
	title,
	posterPath,
	backdropPath,
	rating,
	variant = "default",
	showDeleteButton = true,
	onDiaryChanged,
	initialDiaryEntry,
	onWatchlistRemove,
	onWatchlistSave,
	readOnly = false,
}: Props) {
	const router = useRouter();
	const supabase = useMemo(() => createClient(), []);

	const isWatchlist = variant === "watchlist";

	const mediaId = id ?? media?.id;
	const mediaType = getMediaType(media, type);
	const mediaTitle = getMediaTitle(media, title);
	const mediaPosterPath = posterPath ?? media?.poster_path ?? null;
	const mediaBackdropPath =
		backdropPath ?? media?.backdrop_path ?? mediaPosterPath;
	const mediaRating = rating ?? media?.vote_average ?? null;

	const [diaryEntry, setDiaryEntry] = useState<DiaryEntry | null>(
		isWatchlist ? null : (initialDiaryEntry ?? null),
	);

	const [watchlistEntry, setWatchlistEntry] = useState<DiaryEntry | null>(
		null,
	);

	const [modalOpen, setModalOpen] = useState(false);
	const [checkingDiary, setCheckingDiary] = useState(true);
	const [message, setMessage] = useState("");
	const [deleting, setDeleting] = useState(false);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

	useEffect(() => {
		if (isWatchlist) {
			setDiaryEntry(null);
			setCheckingDiary(false);
			return;
		}

		if (initialDiaryEntry !== undefined) {
			setDiaryEntry(initialDiaryEntry);
			setCheckingDiary(false);
		}
	}, [initialDiaryEntry, isWatchlist]);

	const isAdded = !isWatchlist && Boolean(diaryEntry);
	const isPlanned = !isWatchlist && !isAdded && Boolean(watchlistEntry);

	const progressPercentage = getProgressPercentage(diaryEntry);
	const tvEpisodeLabel = getTvEpisodeLabel(diaryEntry);

	const isFinished =
		diaryEntry?.status === "completed" || progressPercentage === 100;

	const displayProgressPercentage =
		isFinished && mediaType === "tv" ? 100 : progressPercentage;

	const posterUrl = getImageUrl(mediaPosterPath, "w500");

	const href =
		mediaId && mediaType === "movie"
			? `/movie/${mediaId}`
			: mediaId
				? `/tv/${mediaId}`
				: "#";

	const sizeClass =
		variant === "row"
			? "w-[220px] min-w-[220px] shrink-0"
			: variant === "compact"
				? "w-[150px]"
				: variant === "large"
					? "w-[260px]"
					: "w-full";

	const loadDiaryStatus = useCallback(async () => {
		if (!mediaId) return;

		if (isWatchlist) {
			setDiaryEntry(null);
			setCheckingDiary(false);
			return;
		}

		if (initialDiaryEntry !== undefined) {
			setDiaryEntry(initialDiaryEntry);
			setCheckingDiary(false);
			return;
		}

		setCheckingDiary(true);

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			setDiaryEntry(null);
			setWatchlistEntry(null);
			setCheckingDiary(false);
			return;
		}

		const { data, error } = await supabase
			.from("diary_entries")
			.select(
				"id, media_id, media_type, title_snapshot, poster_path_snapshot, backdrop_path_snapshot, rating, status, progress, created_at, updated_at",
			)
			.eq("user_id", user.id)
			.eq("media_id", String(mediaId))
			.eq("media_type", mediaType)
			.maybeSingle();

		if (error) {
			console.error(error.message);
			setDiaryEntry(null);
			setCheckingDiary(false);
			return;
		}

		if (data) {
			setDiaryEntry(mapDbToDiaryEntry(data as DbDiaryEntry));
			setWatchlistEntry(null);
			setCheckingDiary(false);
			return;
		}

		const watchlist = await getWatchlist();

		const plannedItem =
			watchlist.find(
				(item) => item.id === mediaId && item.type === mediaType,
			) ?? null;

		setDiaryEntry(null);
		setWatchlistEntry(plannedItem);
		setCheckingDiary(false);
	}, [mediaId, mediaType, supabase, initialDiaryEntry, isWatchlist]);

	useEffect(() => {
		loadDiaryStatus();
	}, [loadDiaryStatus]);

	async function handleAddOrEditClick() {
		setMessage("");

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			setMessage("You need to log in first to save this to your diary.");
			return;
		}

		setModalOpen(true);
	}

	async function handleDeleteClick() {
		if (!mediaId) return;

		try {
			setDeleting(true);

			if (isWatchlist || isPlanned) {
				await removeFromWatchlist(mediaId, mediaType);
				setWatchlistEntry(null);
				await onWatchlistRemove?.();
				await onDiaryChanged?.();
				return;
			}

			if (!isAdded) return;

			await removeDiaryEntry(mediaId, mediaType);
			setDiaryEntry(null);
			await onDiaryChanged?.();
		} catch (error) {
			console.error(error);
			alert("Could not remove this.");
		} finally {
			setDeleting(false);
		}
	}

	async function refreshAfterSave(status?: SaveStatus) {
		if (isWatchlist && status) {
			await onWatchlistSave?.(status);
			return;
		}

		if (status === "planned" && mediaId) {
			setDiaryEntry(null);

			setWatchlistEntry({
				id: mediaId,
				type: mediaType,
				title: mediaTitle,
				poster: mediaPosterPath ?? "",
				backdrop: mediaBackdropPath ?? mediaPosterPath ?? "",
				status: "planned",
				progress: undefined,
				rating: null,
				updatedAt: new Date().toISOString(),
			} as DiaryEntry);

			await onDiaryChanged?.();
			return;
		}

		setWatchlistEntry(null);

		await onDiaryChanged?.();

		if (initialDiaryEntry === undefined) {
			await loadDiaryStatus();
		}
	}

	async function handleModalClose() {
		setModalOpen(false);

		if (!isWatchlist) {
			await refreshAfterSave();
		}
	}

	function handleCardClick() {
		if (href !== "#") router.push(href);
	}

	const bottomStatusText = (() => {
		if (isWatchlist || isPlanned) return "Planned";
		if (!isAdded) return "Not added";

		if (mediaType === "movie") return "Added";
		if (isFinished) return "Finished";

		if (progressPercentage !== null) {
			return `${progressPercentage}% watched`;
		}

		if (diaryEntry?.status === "planned") return "Planned";

		return "Watching";
	})();

	const isPositiveStatus = isAdded || isWatchlist || isPlanned;

	return (
		<>
			<div className={`relative ${sizeClass}`}>
				<div
					onClick={handleCardClick}
					className={`group relative cursor-pointer overflow-hidden rounded-xl bg-surface-elevated transition duration-300 hover:-translate-y-1 ${
						isPositiveStatus
							? "ring-1 ring-green-500/40 shadow-[0_0_18px_rgba(34,197,94,0.20)]"
							: "ring-1 ring-white/10 hover:ring-accent/80"
					}`}
				>
					<div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl">
						<Image
							src={posterUrl}
							alt={mediaTitle}
							fill
							sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 14vw"
							className={`object-cover transition duration-300 group-hover:scale-105 ${
								isPositiveStatus
									? "brightness-[0.68]"
									: "brightness-100"
							}`}
						/>

						<div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent" />

						{/* ACTIONS */}
						{!readOnly && (
							<>
								{isWatchlist ? (
									<div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												handleAddOrEditClick();
											}}
											disabled={checkingDiary}
											className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white shadow-lg transition hover:bg-accent-hover disabled:opacity-50"
											title="Add to diary"
										>
											<Plus className="h-5 w-5" />
										</button>

										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												setConfirmDeleteOpen(true);
											}}
											disabled={deleting}
											className="flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white shadow-lg transition hover:bg-red-600 disabled:opacity-50"
											title="Remove from watchlist"
										>
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
								) : !isAdded ? (
									<div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												handleAddOrEditClick();
											}}
											disabled={checkingDiary}
											className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white shadow-lg transition hover:bg-accent-hover disabled:opacity-50"
											title={
												isPlanned
													? "Move to diary"
													: "Add to diary"
											}
										>
											<Plus className="h-5 w-5" />
										</button>

										{isPlanned && (
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													setConfirmDeleteOpen(true);
												}}
												disabled={deleting}
												className="flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white shadow-lg transition hover:bg-red-600 disabled:opacity-50"
												title="Remove from watchlist"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										)}
									</div>
								) : (
									<div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												handleAddOrEditClick();
											}}
											disabled={checkingDiary}
											className="flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white shadow-lg transition hover:bg-accent disabled:opacity-50"
											title="Edit diary entry"
										>
											<Pencil className="h-4 w-4" />
										</button>

										{showDeleteButton && (
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													setConfirmDeleteOpen(true);
												}}
												disabled={deleting}
												className="flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white shadow-lg transition hover:bg-red-600 disabled:opacity-50"
												title="Remove from diary"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										)}
									</div>
								)}
							</>
						)}

						{/* BOTTOM INFO */}
						<div className="absolute bottom-0 left-0 right-0 z-10 p-3">
							<h3 className="line-clamp-2 text-base font-bold leading-tight text-white">
								{mediaTitle}
							</h3>

							<div className="mt-1 flex items-center justify-between gap-2">
								<p
									className={`flex items-center gap-1 text-xs ${
										isPositiveStatus
											? "font-semibold text-green-400"
											: "text-gray-300"
									}`}
								>
									{isPositiveStatus && (
										<CheckCircle2 className="h-3.5 w-3.5" />
									)}
									{bottomStatusText}
								</p>

								{mediaRating !== null &&
									mediaRating !== undefined && (
										<span className="flex items-center gap-1 rounded-full bg-black/75 px-2 py-0.5 text-xs text-white">
											<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
											{mediaRating.toFixed(1)}
										</span>
									)}
							</div>

							{/* TV PROGRESS */}
							{isAdded && mediaType === "tv" && (
								<div className="mt-2">
									{displayProgressPercentage !== null && (
										<>
											<div className="mb-1 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
												<div
													className="h-full rounded-full bg-accent"
													style={{
														width: `${displayProgressPercentage}%`,
													}}
												/>
											</div>

											<p className="mb-2 text-[10px] font-semibold text-gray-300">
												{displayProgressPercentage}%
												watched
											</p>
										</>
									)}

									{tvEpisodeLabel && (
										<div className="flex w-fit items-center gap-1 rounded-md bg-accent px-2 py-1 text-xs font-semibold text-white">
											<PlayCircle className="h-3.5 w-3.5" />
											<span>{tvEpisodeLabel}</span>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</div>

				{message && (
					<div className="mt-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">
						{message}{" "}
						<Link href="/login" className="underline">
							Log in
						</Link>
					</div>
				)}
			</div>

			{modalOpen && mediaId && (
				<AddToDiaryModal
					open={modalOpen}
					onClose={handleModalClose}
					content={{
						id: mediaId,
						type: mediaType,
						title: mediaTitle,
						poster: mediaPosterPath ?? "",
						backdrop: mediaBackdropPath ?? mediaPosterPath ?? "",
					}}
					initialData={diaryEntry ?? watchlistEntry ?? undefined}
					onSave={refreshAfterSave}
				/>
			)}

			<ConfirmDialog
				open={confirmDeleteOpen}
				title={`Remove from ${isWatchlist ? "watchlist" : "diary"}?`}
				description={`Are you sure you want to remove "${mediaTitle}" from your ${
					isWatchlist ? "watchlist" : "diary"
				}?`}
				confirmLabel="Remove"
				loading={deleting}
				onCancel={() => setConfirmDeleteOpen(false)}
				onConfirm={async () => {
					await handleDeleteClick();
					setConfirmDeleteOpen(false);
				}}
			/>
		</>
	);
}
