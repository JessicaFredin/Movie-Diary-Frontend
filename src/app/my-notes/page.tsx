"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	BookOpen,
	ChevronDown,
	FileText,
	Heart,
	Pencil,
	Search,
	StickyNote,
	Trash2,
	Users,
	X,
} from "lucide-react";

import ConfirmDialog from "@/components/ui/confirm-dialog";
import MediaNotesModal from "@/components/media/media-notes-modal";
import {
	deleteAllNotesForMedia,
	deleteEpisodeNote,
	deleteMediaNote,
	getAllNotes,
	type EpisodeNote,
	type MediaNote,
	type MediaType,
} from "@/utils/media-notes-storage";

type NoteSort = "latest" | "title_asc" | "most_notes" | "favorites";

type NoteItem =
	| {
			kind: "media";
			id: string;
			mediaId: number;
			mediaType: MediaType;
			title: string;
			noteTitle: string;
			posterPath: string | null;
			note: string;
			emotions: string[];
			watchedWith: string[];
			isFavorite: false;
			updatedAt: string;
	  }
	| {
			kind: "episode";
			id: string;
			mediaId: number;
			mediaType: "tv";
			title: string;
			noteTitle: string;
			posterPath: string | null;
			seasonNumber: number;
			episodeNumber: number;
			note: string;
			emotions: string[];
			watchedWith: string[];
			isFavorite: boolean;
			updatedAt: string;
	  };

type NoteGroup = {
	key: string;
	mediaId: number;
	mediaType: MediaType;
	title: string;
	posterPath: string | null;
	latestUpdatedAt: string;
	notes: NoteItem[];
};

type DeleteTarget =
	| { kind: "single"; note: NoteItem }
	| { kind: "all"; group: NoteGroup }
	| null;

const INITIAL_VISIBLE_NOTES = 3;

function getImageUrl(path?: string | null): string {
	if (!path) return "/logo.png";
	if (path.startsWith("http")) return path;

	if (path.startsWith("/images/") || path === "/logo.png") {
		return path;
	}

	const cleanPath = path.startsWith("/") ? path : `/${path}`;

	return `https://image.tmdb.org/t/p/w500${cleanPath}`;
}

function formatDate(value?: string | null): string {
	if (!value) return "Recently";

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) return "Recently";

	return new Intl.DateTimeFormat("en", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
}

function getTime(value?: string | null): number {
	if (!value) return 0;

	const time = new Date(value).getTime();

	return Number.isNaN(time) ? 0 : time;
}

function getHref(group: NoteGroup): string {
	return group.mediaType === "movie"
		? `/movie/${group.mediaId}`
		: `/tv/${group.mediaId}`;
}

function getNoteTitle(
	value: string | null | undefined,
	fallback: string,
): string {
	const cleanValue = value?.trim();

	return cleanValue || fallback;
}

function getFavoriteCount(group: NoteGroup): number {
	return group.notes.filter((note) => note.isFavorite).length;
}

function sortNotesInsideGroup(
	notes: NoteItem[],
	mediaType: MediaType,
): NoteItem[] {
	if (mediaType === "movie") {
		return [...notes].sort(
			(a, b) => getTime(b.updatedAt) - getTime(a.updatedAt),
		);
	}

	return [...notes].sort((a, b) => {
		if (a.kind === "media" && b.kind !== "media") return -1;
		if (a.kind !== "media" && b.kind === "media") return 1;

		if (a.kind === "media" && b.kind === "media") {
			return getTime(b.updatedAt) - getTime(a.updatedAt);
		}

		if (a.kind === "episode" && b.kind === "episode") {
			if (a.seasonNumber !== b.seasonNumber) {
				return a.seasonNumber - b.seasonNumber;
			}

			return a.episodeNumber - b.episodeNumber;
		}

		return 0;
	});
}

function sortGroups(groups: NoteGroup[], sort: NoteSort): NoteGroup[] {
	return [...groups].sort((a, b) => {
		if (sort === "title_asc") {
			return a.title.localeCompare(b.title);
		}

		if (sort === "most_notes") {
			return b.notes.length - a.notes.length;
		}

		if (sort === "favorites") {
			return getFavoriteCount(b) - getFavoriteCount(a);
		}

		return getTime(b.latestUpdatedAt) - getTime(a.latestUpdatedAt);
	});
}

function mapMediaNote(note: MediaNote): NoteItem {
	const title = note.title_snapshot ?? "Untitled";

	return {
		kind: "media",
		id: note.id,
		mediaId: Number(note.media_id),
		mediaType: note.media_type,
		title,
		noteTitle: getNoteTitle(note.note_title, title),
		posterPath: note.poster_path_snapshot,
		note: note.note ?? "",
		emotions: note.emotions ?? [],
		watchedWith: note.watched_with ?? [],
		isFavorite: false,
		updatedAt: note.updated_at ?? note.created_at,
	};
}

function mapEpisodeNote(note: EpisodeNote): NoteItem {
	const fallbackTitle = `S${note.season_number} · E${note.episode_number}`;

	return {
		kind: "episode",
		id: note.id,
		mediaId: Number(note.tv_id),
		mediaType: "tv",
		title: note.title_snapshot ?? "Untitled",
		noteTitle: getNoteTitle(note.note_title, fallbackTitle),
		posterPath: note.poster_path_snapshot,
		seasonNumber: note.season_number,
		episodeNumber: note.episode_number,
		note: note.note ?? "",
		emotions: note.emotions ?? (note.mood ? [note.mood] : []),
		watchedWith: note.watched_with ?? [],
		isFavorite: note.is_favorite,
		updatedAt: note.updated_at ?? note.created_at,
	};
}

function groupNotes(notes: NoteItem[]): NoteGroup[] {
	const map = new Map<string, NoteGroup>();

	for (const note of notes) {
		const key = `${note.mediaType}-${note.mediaId}`;
		const existing = map.get(key);

		if (!existing) {
			map.set(key, {
				key,
				mediaId: note.mediaId,
				mediaType: note.mediaType,
				title: note.title,
				posterPath: note.posterPath,
				latestUpdatedAt: note.updatedAt,
				notes: [note],
			});

			continue;
		}

		existing.notes.push(note);

		if (getTime(note.updatedAt) > getTime(existing.latestUpdatedAt)) {
			existing.latestUpdatedAt = note.updatedAt;
		}

		if (!existing.posterPath && note.posterPath) {
			existing.posterPath = note.posterPath;
		}
	}

	return Array.from(map.values()).map((group) => ({
		...group,
		notes: sortNotesInsideGroup(group.notes, group.mediaType),
	}));
}

function matchesSearch(group: NoteGroup, query: string): boolean {
	const cleanQuery = query.trim().toLowerCase();

	if (!cleanQuery) return true;

	if (group.title.toLowerCase().includes(cleanQuery)) return true;

	return group.notes.some((note) => {
		const text = [
			note.noteTitle,
			note.note,
			...note.emotions,
			...note.watchedWith,
			note.kind === "episode"
				? `season ${note.seasonNumber} episode ${note.episodeNumber}`
				: "main note movie show note",
		]
			.join(" ")
			.toLowerCase();

		return text.includes(cleanQuery);
	});
}

export default function MyNotesPage() {
	const [notes, setNotes] = useState<NoteItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [sort, setSort] = useState<NoteSort>("latest");
	const [message, setMessage] = useState("");
	const [visibleByGroup, setVisibleByGroup] = useState<
		Record<string, number>
	>({});
	const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
	const [activeNotesGroup, setActiveNotesGroup] = useState<NoteGroup | null>(
		null,
	);
	const [deleting, setDeleting] = useState(false);

	async function loadNotes(): Promise<void> {
		try {
			setLoading(true);
			setMessage("");

			const data = await getAllNotes();

			const allNotes = [
				...data.mediaNotes.map(mapMediaNote),
				...data.episodeNotes.map(mapEpisodeNote),
			];

			setNotes(allNotes);
		} catch (error) {
			console.error(error);
			setMessage(
				error instanceof Error
					? error.message
					: "Could not load notes.",
			);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		void loadNotes();
	}, []);

	const allGroups = useMemo(() => groupNotes(notes), [notes]);

	const groups = useMemo(() => {
		return sortGroups(
			allGroups.filter((group) => matchesSearch(group, query)),
			sort,
		);
	}, [allGroups, query, sort]);

	const totalNotes = notes.length;
	const favoriteCount = notes.filter((note) => note.isFavorite).length;
	const titleCount = allGroups.length;
	const queryActive = query.trim().length > 0;

	async function handleConfirmDelete(): Promise<void> {
		if (!deleteTarget) return;

		try {
			setDeleting(true);
			setMessage("");

			if (deleteTarget.kind === "single") {
				if (deleteTarget.note.kind === "media") {
					await deleteMediaNote(deleteTarget.note.id);
				} else {
					await deleteEpisodeNote(deleteTarget.note.id);
				}
			} else {
				await deleteAllNotesForMedia({
					mediaId: deleteTarget.group.mediaId,
					mediaType: deleteTarget.group.mediaType,
				});
			}

			setDeleteTarget(null);
			await loadNotes();
		} catch (error) {
			console.error(error);
			setMessage(
				error instanceof Error
					? error.message
					: "Could not delete note.",
			);
		} finally {
			setDeleting(false);
		}
	}

	function showMore(groupKey: string): void {
		setVisibleByGroup((current) => ({
			...current,
			[groupKey]:
				(current[groupKey] ?? INITIAL_VISIBLE_NOTES) +
				INITIAL_VISIBLE_NOTES,
		}));
	}

	const deleteTitle =
		deleteTarget?.kind === "single"
			? deleteTarget.note.noteTitle
			: deleteTarget?.kind === "all"
				? deleteTarget.group.title
				: "";

	return (
		<main className="min-h-screen bg-black px-5 py-10 text-white md:px-16">
			<div className="mx-auto max-w-7xl">
				<div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
					<div>
						<div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-accent">
							<FileText className="h-5 w-5" />
							My notes
						</div>

						<h1 className="mt-3 text-4xl font-black md:text-5xl">
							Your movie thoughts
						</h1>

						<p className="mt-3 max-w-2xl text-sm leading-6 text-muted md:text-base">
							All your movie, show and episode notes in one place.
						</p>
					</div>

					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						<NotesSortDropdown value={sort} onChange={setSort} />

						<div
							className={`flex h-12 items-center gap-3 rounded-full border px-4 transition ${
								queryActive
									? "border-accent bg-accent/10 shadow-[0_0_18px_rgba(255,64,85,0.18)]"
									: "border-white/10 bg-white/[0.05] focus-within:border-accent focus-within:bg-accent/10"
							}`}
						>
							<Search
								className={`h-4 w-4 transition ${
									queryActive ? "text-accent" : "text-muted"
								}`}
							/>

							<input
								value={query}
								onChange={(event) =>
									setQuery(event.target.value)
								}
								placeholder="Search notes..."
								className="w-[220px] bg-transparent text-sm text-white outline-none placeholder:text-muted"
							/>

							{queryActive && (
								<button
									type="button"
									onClick={() => setQuery("")}
									className="text-muted transition hover:text-white"
									aria-label="Clear search"
								>
									<X className="h-4 w-4" />
								</button>
							)}
						</div>
					</div>
				</div>

				<div className="mt-8 grid gap-4 sm:grid-cols-3">
					<StatCard
						icon={<StickyNote className="h-5 w-5" />}
						label="Total notes"
						value={totalNotes}
					/>

					<StatCard
						icon={<Heart className="h-5 w-5" />}
						label="Favorites"
						value={favoriteCount}
						yellow
					/>

					<StatCard
						icon={<FileText className="h-5 w-5" />}
						label="Titles"
						value={titleCount}
					/>
				</div>

				{message && (
					<p className="mt-6 rounded-2xl border border-accent/25 bg-accent/10 px-4 py-3 text-sm text-accent">
						{message}
					</p>
				)}

				{loading ? (
					<p className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-sm text-muted">
						Loading notes...
					</p>
				) : groups.length === 0 ? (
					<div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
						<p className="text-sm text-muted">No notes found.</p>
					</div>
				) : (
					<div className="mt-10 space-y-6">
						{groups.map((group) => {
							const visibleCount =
								visibleByGroup[group.key] ??
								INITIAL_VISIBLE_NOTES;

							const visibleNotes = group.notes.slice(
								0,
								visibleCount,
							);

							const hiddenCount =
								group.notes.length - visibleNotes.length;

							return (
								<NoteGroupCard
									key={group.key}
									group={group}
									visibleNotes={visibleNotes}
									hiddenCount={hiddenCount}
									onShowMore={() => showMore(group.key)}
									onEdit={() => setActiveNotesGroup(group)}
									onDeleteSingle={(note) =>
										setDeleteTarget({
											kind: "single",
											note,
										})
									}
									onDeleteAll={() =>
										setDeleteTarget({
											kind: "all",
											group,
										})
									}
								/>
							);
						})}
					</div>
				)}
			</div>

			{activeNotesGroup && (
				<MediaNotesModal
					open={Boolean(activeNotesGroup)}
					onClose={async () => {
						setActiveNotesGroup(null);
						await loadNotes();
					}}
					mediaId={activeNotesGroup.mediaId}
					mediaType={activeNotesGroup.mediaType}
					title={activeNotesGroup.title}
					posterPath={activeNotesGroup.posterPath}
				/>
			)}

			<ConfirmDialog
				open={Boolean(deleteTarget)}
				title={
					deleteTarget?.kind === "all"
						? "Delete all notes?"
						: "Delete note?"
				}
				description={
					deleteTarget?.kind === "all"
						? `Are you sure you want to delete all notes for "${deleteTitle}"?`
						: `Are you sure you want to delete "${deleteTitle}"?`
				}
				confirmLabel="Delete"
				loading={deleting}
				onCancel={() => setDeleteTarget(null)}
				onConfirm={handleConfirmDelete}
			/>
		</main>
	);
}

function NotesSortDropdown({
	value,
	onChange,
}: {
	value: NoteSort;
	onChange: (value: NoteSort) => void;
}) {
	const [open, setOpen] = useState(false);

	const options: { label: string; value: NoteSort }[] = [
		{ label: "Latest updated", value: "latest" },
		{ label: "Title A-Z", value: "title_asc" },
		{ label: "Most notes", value: "most_notes" },
		{ label: "Favorites first", value: "favorites" },
	];

	const label = options.find((option) => option.value === value)?.label;

	return (
		<div className="relative">
			<button
				type="button"
				onClick={() => setOpen((current) => !current)}
				className="flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 text-sm font-bold text-white transition hover:border-accent/50"
			>
				Sort: {label}
				<ChevronDown className="h-4 w-4" />
			</button>

			{open && (
				<div className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#15151a] shadow-2xl">
					{options.map((option) => (
						<button
							key={option.value}
							type="button"
							onClick={() => {
								onChange(option.value);
								setOpen(false);
							}}
							className={`block w-full px-4 py-3 text-left text-sm transition hover:bg-white/[0.08] ${
								option.value === value
									? "font-bold text-accent"
									: "text-muted"
							}`}
						>
							{option.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

function StatCard({
	icon,
	label,
	value,
	yellow,
}: {
	icon: React.ReactNode;
	label: string;
	value: number;
	yellow?: boolean;
}) {
	return (
		<div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
			<div
				className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${
					yellow
						? "bg-yellow-400/10 text-yellow-300"
						: "bg-accent/10 text-accent"
				}`}
			>
				{icon}
			</div>

			<p className="text-3xl font-black">{value}</p>
			<p className="mt-1 text-sm text-muted">{label}</p>
		</div>
	);
}

function NoteGroupCard({
	group,
	visibleNotes,
	hiddenCount,
	onShowMore,
	onEdit,
	onDeleteSingle,
	onDeleteAll,
}: {
	group: NoteGroup;
	visibleNotes: NoteItem[];
	hiddenCount: number;
	onShowMore: () => void;
	onEdit: () => void;
	onDeleteSingle: (note: NoteItem) => void;
	onDeleteAll: () => void;
}) {
	return (
		<section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-accent/60 hover:bg-white/[0.04] md:p-6">
			<div className="absolute right-5 top-5 flex gap-2">
				<button
					type="button"
					onClick={onEdit}
					className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06] text-white transition hover:bg-accent"
					title="Edit notes"
				>
					<Pencil className="h-5 w-5" />
				</button>

				<button
					type="button"
					onClick={onDeleteAll}
					className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent transition hover:bg-accent hover:text-white"
					title="Delete all notes"
				>
					<Trash2 className="h-5 w-5" />
				</button>
			</div>

			<div className="flex gap-5 pr-28">
				<Link
					href={getHref(group)}
					className="relative h-[225px] w-[150px] shrink-0 overflow-hidden rounded-2xl bg-white/[0.05] max-sm:h-[150px] max-sm:w-[100px]"
				>
					<Image
						src={getImageUrl(group.posterPath)}
						alt={group.title}
						fill
						sizes="150px"
						className="object-cover transition hover:scale-105"
					/>
				</Link>

				<div className="min-w-0 flex-1">
					<Link href={getHref(group)}>
						<h2 className="line-clamp-2 text-3xl font-black leading-tight transition hover:text-accent md:text-4xl">
							{group.title}
						</h2>
					</Link>

					<div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
						<span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 font-semibold text-gray-200">
							{group.mediaType === "movie" ? "Movie" : "TV Show"}
						</span>

						<span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-bold text-accent">
							{group.notes.length}{" "}
							{group.notes.length === 1 ? "note" : "notes"}
						</span>

						<span>Updated {formatDate(group.latestUpdatedAt)}</span>
					</div>

					<div className="mt-7 space-y-4">
						{visibleNotes.map((note) => (
							<NotePreviewCard
								key={`${note.kind}-${note.id}`}
								note={note}
								onDelete={() => onDeleteSingle(note)}
							/>
						))}

						{hiddenCount > 0 && (
							<button
								type="button"
								onClick={onShowMore}
								className="text-sm font-bold text-muted transition hover:text-white hover:underline"
							>
								+ {hiddenCount} more{" "}
								{hiddenCount === 1 ? "note" : "notes"}
							</button>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

function NotePreviewCard({
	note,
	onDelete,
}: {
	note: NoteItem;
	onDelete: () => void;
}) {
	const label = note.kind === "episode" ? "Episode note" : "Main note";

	return (
		<div className="rounded-3xl border border-white/10 bg-black/20 p-4 transition hover:border-accent/60 hover:bg-white/[0.035]">
			<div className="flex items-start justify-between gap-4">
				<div>
					<div className="flex items-center gap-2 text-sm font-black text-accent">
						<BookOpen className="h-4 w-4" />
						{label}
					</div>

					<h3 className="mt-2 text-lg font-black">
						{note.noteTitle}
					</h3>

					{note.kind === "episode" && (
						<p className="mt-1 text-xs font-bold text-muted">
							S{note.seasonNumber} · E{note.episodeNumber}
						</p>
					)}

					<p className="mt-1 text-xs text-muted">
						Updated {formatDate(note.updatedAt)}
					</p>
				</div>

				<button
					type="button"
					onClick={onDelete}
					className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/50 text-accent transition hover:bg-accent hover:text-white"
					title="Delete note"
				>
					<Trash2 className="h-4 w-4" />
				</button>
			</div>

			{note.isFavorite && (
				<div className="mt-4 flex w-fit items-center gap-2 rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-300">
					<Heart className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
					Favorite episode
				</div>
			)}

			<p className="mt-4 whitespace-pre-line text-sm font-semibold leading-6 text-gray-100">
				{note.note.trim() || "No written note."}
			</p>

			{note.emotions.length > 0 && (
				<div className="mt-4 flex flex-wrap gap-2">
					{note.emotions.map((emotion) => (
						<span
							key={emotion}
							className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold text-accent"
						>
							{emotion}
						</span>
					))}
				</div>
			)}

			{note.watchedWith.length > 0 && (
				<div className="mt-4 flex flex-wrap gap-2">
					{note.watchedWith.map((person) => (
						<span
							key={person}
							className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-muted"
						>
							<Users className="h-3.5 w-3.5" />
							{person}
						</span>
					))}
				</div>
			)}
		</div>
	);
}
