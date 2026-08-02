"use client";

import { useEffect, useMemo, useState } from "react";
import {
	FileText,
	Heart,
	Pencil,
	Plus,
	Save,
	Trash2,
	Users,
	X,
} from "lucide-react";

import ConfirmDialog from "@/components/ui/confirm-dialog";
import {
	deleteEpisodeNote,
	deleteMediaNote,
	getMediaNotesBundle,
	saveEpisodeNote,
	saveMediaNote,
	type EpisodeNote,
	type MediaNote,
	type MediaType,
} from "@/utils/media-notes-storage";

type MediaNotesModalProps = {
	open: boolean;
	onClose: () => void;
	mediaId: number;
	mediaType: MediaType;
	title: string;
	posterPath?: string | null;
};

type TvEpisodeOption = {
	episodeNumber: number;
	name: string;
};

type TvSeasonOption = {
	seasonNumber: number;
	name: string;
	episodeCount: number;
	episodes?: TvEpisodeOption[];
};

type DeleteTarget =
	| { kind: "media"; id: string; title: string }
	| { kind: "episode"; id: string; title: string }
	| null;

const EMOTIONS = [
	"Emotional",
	"Funny",
	"Comfort",
	"Shocking",
	"Romantic",
	"Sad",
	"Exciting",
	"Boring",
	"Confusing",
	"Beautiful",
];

function splitWatchedWith(value: string): string[] {
	return value
		.split(/\s*,\s*|\s+and\s+/i)
		.map((item) => item.trim().replace(/\s+/g, " "))
		.filter(Boolean);
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

function getNoteTime(note: {
	updated_at?: string | null;
	created_at?: string | null;
}): number {
	const time = new Date(note.updated_at ?? note.created_at ?? "").getTime();

	return Number.isNaN(time) ? 0 : time;
}

function sortLatestFirst<
	T extends { updated_at?: string | null; created_at?: string | null },
>(items: T[]): T[] {
	return [...items].sort((a, b) => getNoteTime(b) - getNoteTime(a));
}

function getTotalCount(mediaNotes: MediaNote[], episodeNotes: EpisodeNote[]) {
	return mediaNotes.length + episodeNotes.length;
}

function getDisplayNoteTitle(
	noteTitle: string | null | undefined,
	fallback: string,
): string {
	const cleanTitle = noteTitle?.trim();

	return cleanTitle || fallback;
}

function getEpisodeLabel(seasonNumber: number, episodeNumber: number): string {
	return `S${seasonNumber} · E${episodeNumber}`;
}

export default function MediaNotesModal({
	open,
	onClose,
	mediaId,
	mediaType,
	title,
	posterPath,
}: MediaNotesModalProps) {
	const [mediaNotes, setMediaNotes] = useState<MediaNote[]>([]);
	const [episodeNotes, setEpisodeNotes] = useState<EpisodeNote[]>([]);
	const [seasons, setSeasons] = useState<TvSeasonOption[]>([]);

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");

	const [mediaFormOpen, setMediaFormOpen] = useState(false);
	const [episodeFormOpen, setEpisodeFormOpen] = useState(false);

	const [editingMediaNoteId, setEditingMediaNoteId] = useState<string | null>(
		null,
	);
	const [editingEpisodeNoteId, setEditingEpisodeNoteId] = useState<
		string | null
	>(null);

	const [mediaNoteTitleDraft, setMediaNoteTitleDraft] = useState("");
	const [mediaNoteDraft, setMediaNoteDraft] = useState("");
	const [mediaEmotions, setMediaEmotions] = useState<string[]>([]);
	const [mediaWatchedWith, setMediaWatchedWith] = useState("");

	const [episodeNoteTitleDraft, setEpisodeNoteTitleDraft] = useState("");
	const [seasonNumber, setSeasonNumber] = useState(1);
	const [episodeNumber, setEpisodeNumber] = useState(1);
	const [episodeNoteDraft, setEpisodeNoteDraft] = useState("");
	const [episodeEmotions, setEpisodeEmotions] = useState<string[]>([]);
	const [episodeWatchedWith, setEpisodeWatchedWith] = useState("");
	const [favoriteEpisode, setFavoriteEpisode] = useState(false);

	const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

	const totalCount = getTotalCount(mediaNotes, episodeNotes);

	const selectedSeason = useMemo(() => {
		return (
			seasons.find((season) => season.seasonNumber === seasonNumber) ??
			seasons[0] ??
			null
		);
	}, [seasons, seasonNumber]);

	const episodeCount = selectedSeason?.episodeCount ?? 1;

	const selectedEpisode = useMemo(() => {
		return (
			selectedSeason?.episodes?.find(
				(episode) => episode.episodeNumber === episodeNumber,
			) ?? null
		);
	}, [selectedSeason, episodeNumber]);

	const selectedEpisodeTitle = useMemo(() => {
		const cleanName = selectedEpisode?.name?.trim();

		if (cleanName) return cleanName;

		return `Episode ${episodeNumber}`;
	}, [selectedEpisode, episodeNumber]);

	const allNotes = useMemo(() => {
		const mediaItems = sortLatestFirst(mediaNotes).map((note) => ({
			kind: "media" as const,
			note,
			time: getNoteTime(note),
		}));

		const episodeItems = [...episodeNotes]
			.sort((a, b) => {
				if (a.season_number !== b.season_number) {
					return a.season_number - b.season_number;
				}

				return a.episode_number - b.episode_number;
			})
			.map((note) => ({
				kind: "episode" as const,
				note,
				time: getNoteTime(note),
			}));

		return mediaType === "tv"
			? [...mediaItems, ...episodeItems]
			: mediaItems;
	}, [mediaNotes, episodeNotes, mediaType]);

	useEffect(() => {
		if (!open) return;

		async function loadNotes(): Promise<void> {
			try {
				setLoading(true);
				setMessage("");

				const bundle = await getMediaNotesBundle(mediaId, mediaType);

				setMediaNotes(sortLatestFirst(bundle.mediaNotes));
				setEpisodeNotes(sortLatestFirst(bundle.episodeNotes));
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

		void loadNotes();
	}, [open, mediaId, mediaType]);

	useEffect(() => {
		if (!open || mediaType !== "tv") return;

		async function loadTvOptions(): Promise<void> {
			try {
				const response = await fetch(
					`/api/tmdb/tv-episode-options?tvId=${mediaId}`,
				);

				if (!response.ok) {
					throw new Error("Could not load episode options.");
				}

				const data = (await response.json()) as {
					seasons?: TvSeasonOption[];
				};

				const nextSeasons = data.seasons ?? [];

				setSeasons(nextSeasons);

				if (nextSeasons.length > 0) {
					setSeasonNumber(nextSeasons[0].seasonNumber);
					setEpisodeNumber(1);
				}
			} catch (error) {
				console.error(error);
				setSeasons([]);
			}
		}

		void loadTvOptions();
	}, [open, mediaId, mediaType]);

	useEffect(() => {
		if (episodeNumber > episodeCount) {
			setEpisodeNumber(episodeCount);
		}
	}, [episodeCount, episodeNumber]);

	if (!open) return null;

	function resetMediaForm(): void {
		setEditingMediaNoteId(null);
		setMediaNoteTitleDraft("");
		setMediaNoteDraft("");
		setMediaEmotions([]);
		setMediaWatchedWith("");
		setMediaFormOpen(false);
	}

	function resetEpisodeForm(): void {
		setEditingEpisodeNoteId(null);
		setEpisodeNoteTitleDraft("");
		setSeasonNumber(seasons[0]?.seasonNumber ?? 1);
		setEpisodeNumber(1);
		setEpisodeNoteDraft("");
		setEpisodeEmotions([]);
		setEpisodeWatchedWith("");
		setFavoriteEpisode(false);
		setEpisodeFormOpen(false);
	}

	function toggleMediaEmotion(emotion: string): void {
		setMediaEmotions((current) =>
			current.includes(emotion)
				? current.filter((item) => item !== emotion)
				: [...current, emotion],
		);
	}

	function toggleEpisodeEmotion(emotion: string): void {
		setEpisodeEmotions((current) =>
			current.includes(emotion)
				? current.filter((item) => item !== emotion)
				: [...current, emotion],
		);
	}

	async function reloadNotes(): Promise<void> {
		const bundle = await getMediaNotesBundle(mediaId, mediaType);

		setMediaNotes(sortLatestFirst(bundle.mediaNotes));
		setEpisodeNotes(sortLatestFirst(bundle.episodeNotes));
	}

	async function handleSaveMediaNote(): Promise<void> {
		try {
			setSaving(true);
			setMessage("");

			await saveMediaNote({
				id: editingMediaNoteId ?? undefined,
				mediaId,
				mediaType,
				title,
				posterPath,
				noteTitle: mediaNoteTitleDraft.trim() || title,
				note: mediaNoteDraft,
				emotions: mediaEmotions,
				watchedWith: splitWatchedWith(mediaWatchedWith),
			});

			await reloadNotes();
			resetMediaForm();
		} catch (error) {
			console.error(error);
			setMessage(
				error instanceof Error ? error.message : "Could not save note.",
			);
		} finally {
			setSaving(false);
		}
	}

	async function handleSaveEpisodeNote(): Promise<void> {
		if (mediaType !== "tv") return;

		try {
			setSaving(true);
			setMessage("");

			await saveEpisodeNote({
				id: editingEpisodeNoteId ?? undefined,
				tvId: mediaId,
				title,
				posterPath,
				noteTitle: episodeNoteTitleDraft.trim() || selectedEpisodeTitle,
				seasonNumber,
				episodeNumber,
				note: episodeNoteDraft,
				emotions: episodeEmotions,
				isFavorite: favoriteEpisode,
				watchedWith: splitWatchedWith(episodeWatchedWith),
			});

			await reloadNotes();
			resetEpisodeForm();
		} catch (error) {
			console.error(error);
			setMessage(
				error instanceof Error
					? error.message
					: "Could not save episode note.",
			);
		} finally {
			setSaving(false);
		}
	}

	async function handleConfirmDelete(): Promise<void> {
		if (!deleteTarget) return;

		try {
			setSaving(true);

			if (deleteTarget.kind === "media") {
				await deleteMediaNote(deleteTarget.id);
			} else {
				await deleteEpisodeNote(deleteTarget.id);
			}

			await reloadNotes();
			setDeleteTarget(null);
		} catch (error) {
			console.error(error);
			setMessage(
				error instanceof Error
					? error.message
					: "Could not delete note.",
			);
		} finally {
			setSaving(false);
		}
	}

	function startEditMediaNote(note: MediaNote): void {
		setEditingMediaNoteId(note.id);
		setMediaNoteTitleDraft(
			getDisplayNoteTitle(note.note_title, note.title_snapshot ?? title),
		);
		setMediaNoteDraft(note.note ?? "");
		setMediaEmotions(note.emotions ?? []);
		setMediaWatchedWith((note.watched_with ?? []).join(", "));
		setMediaFormOpen(true);
		setEpisodeFormOpen(false);
	}

	function startEditEpisodeNote(note: EpisodeNote): void {
		setEditingEpisodeNoteId(note.id);
		setEpisodeNoteTitleDraft(
			getDisplayNoteTitle(
				note.note_title,
				`Episode ${note.episode_number}`,
			),
		);
		setSeasonNumber(note.season_number);
		setEpisodeNumber(note.episode_number);
		setEpisodeNoteDraft(note.note ?? "");
		setEpisodeEmotions(note.emotions ?? (note.mood ? [note.mood] : []));
		setEpisodeWatchedWith((note.watched_with ?? []).join(", "));
		setFavoriteEpisode(note.is_favorite);
		setEpisodeFormOpen(true);
		setMediaFormOpen(false);
	}

	return (
		<>
			<div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 px-5 py-6 backdrop-blur-sm sm:px-6 md:px-8">
				<button
					type="button"
					onClick={onClose}
					className="absolute inset-0 cursor-default"
					aria-label="Close notes"
				/>

				<div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#15151a] text-white shadow-2xl">
					<div className="shrink-0 border-b border-white/10 px-7 py-6">
						<div className="flex items-start justify-between gap-5">
							<div>
								<div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-accent">
									<FileText className="h-5 w-5" />
									Notes
								</div>

								<h2 className="mt-3 text-3xl font-black">
									{title}
								</h2>

								<p className="mt-2 text-sm text-muted">
									{totalCount === 0
										? "No saved notes yet"
										: `${totalCount} saved ${
												totalCount === 1
													? "note"
													: "notes"
											}`}
								</p>
							</div>

							<button
								type="button"
								onClick={onClose}
								className="rounded-full p-2 text-muted transition hover:bg-white/10 hover:text-white"
								aria-label="Close"
							>
								<X className="h-6 w-6" />
							</button>
						</div>
					</div>

					<div className="max-h-[calc(90vh-130px)] overflow-y-auto px-5 py-5 pr-7 md:px-7 md:pr-9">
						{message && (
							<p className="mb-5 rounded-2xl border border-accent/25 bg-accent/10 px-4 py-3 text-sm text-accent">
								{message}
							</p>
						)}

						<div className="mb-6 flex flex-wrap gap-3">
							<button
								type="button"
								onClick={() => {
									resetEpisodeForm();
									setMediaFormOpen((value) => !value);
								}}
								className="flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
							>
								<Plus className="h-4 w-4" />
								Add note
							</button>

							{mediaType === "tv" && (
								<button
									type="button"
									onClick={() => {
										resetMediaForm();
										setEpisodeFormOpen((value) => !value);
									}}
									className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.1]"
								>
									<Plus className="h-4 w-4" />
									Add episode note
								</button>
							)}
						</div>

						{mediaFormOpen && (
							<div className="mb-6 rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
								<h3 className="text-xl font-black">
									{editingMediaNoteId
										? "Edit note"
										: "Add new note"}
								</h3>

								<input
									value={mediaNoteTitleDraft}
									onChange={(event) =>
										setMediaNoteTitleDraft(
											event.target.value,
										)
									}
									placeholder="Title of your note"
									className="mt-5 h-14 w-full rounded-2xl border border-white/10 bg-[#111116] px-5 text-sm font-bold text-white outline-none transition placeholder:text-muted focus:border-accent"
								/>

								<textarea
									value={mediaNoteDraft}
									onChange={(event) =>
										setMediaNoteDraft(event.target.value)
									}
									placeholder="Write anything you want to remember..."
									className="mt-4 min-h-[120px] w-full resize-y rounded-2xl border border-white/10 bg-[#111116] px-5 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-muted focus:border-accent"
								/>

								<EmotionPicker
									selected={mediaEmotions}
									onToggle={toggleMediaEmotion}
								/>

								<WatchedWithInput
									value={mediaWatchedWith}
									onChange={setMediaWatchedWith}
								/>

								<div className="mt-5 flex flex-wrap justify-end gap-3">
									<button
										type="button"
										onClick={resetMediaForm}
										disabled={saving}
										className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold transition hover:bg-white/[0.08] disabled:opacity-50"
									>
										Cancel
									</button>

									<button
										type="button"
										onClick={handleSaveMediaNote}
										disabled={saving}
										className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
									>
										<Save className="h-4 w-4" />
										{saving ? "Saving..." : "Save note"}
									</button>
								</div>
							</div>
						)}

						{episodeFormOpen && mediaType === "tv" && (
							<div className="mb-6 rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
								<h3 className="text-xl font-black">
									{editingEpisodeNoteId
										? "Edit episode note"
										: "Add episode note"}
								</h3>

								{seasons.length === 0 ? (
									<p className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-muted">
										Could not load season and episode
										options.
									</p>
								) : (
									<div className="mt-5 grid gap-4 sm:grid-cols-2">
										<div>
											<label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted">
												Season
											</label>

											<select
												value={seasonNumber}
												onChange={(event) => {
													setSeasonNumber(
														Number(
															event.target.value,
														),
													);
													setEpisodeNumber(1);
												}}
												className="h-14 w-full rounded-2xl border border-white/10 bg-[#111116] px-4 text-sm font-bold text-white outline-none focus:border-accent"
											>
												{seasons.map((season) => (
													<option
														key={
															season.seasonNumber
														}
														value={
															season.seasonNumber
														}
													>
														{season.name}
													</option>
												))}
											</select>
										</div>

										<div>
											<label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted">
												Episode
											</label>

											<select
												value={episodeNumber}
												onChange={(event) =>
													setEpisodeNumber(
														Number(
															event.target.value,
														),
													)
												}
												className="h-14 w-full rounded-2xl border border-white/10 bg-[#111116] px-4 text-sm font-bold text-white outline-none focus:border-accent"
											>
												{Array.from({
													length: episodeCount,
												}).map((_, index) => {
													const episode = index + 1;
													const episodeOption =
														selectedSeason?.episodes?.find(
															(item) =>
																item.episodeNumber ===
																episode,
														);

													return (
														<option
															key={episode}
															value={episode}
														>
															{episodeOption?.name
																? `Episode ${episode} · ${episodeOption.name}`
																: `Episode ${episode}`}
														</option>
													);
												})}
											</select>
										</div>
									</div>
								)}

								<input
									value={episodeNoteTitleDraft}
									onChange={(event) =>
										setEpisodeNoteTitleDraft(
											event.target.value,
										)
									}
									placeholder="Title of your note"
									className="mt-5 h-14 w-full rounded-2xl border border-white/10 bg-[#111116] px-5 text-sm font-bold text-white outline-none transition placeholder:text-muted focus:border-accent"
								/>

								<p className="mt-2 text-xs font-bold text-muted">
									{getEpisodeLabel(
										seasonNumber,
										episodeNumber,
									)}
									{" · "}
									{selectedEpisodeTitle}
								</p>

								<textarea
									value={episodeNoteDraft}
									onChange={(event) =>
										setEpisodeNoteDraft(event.target.value)
									}
									placeholder="What did this episode make you feel?"
									className="mt-4 min-h-[120px] w-full resize-y rounded-2xl border border-white/10 bg-[#111116] px-5 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-muted focus:border-accent"
								/>

								<EmotionPicker
									selected={episodeEmotions}
									onToggle={toggleEpisodeEmotion}
								/>

								<WatchedWithInput
									value={episodeWatchedWith}
									onChange={setEpisodeWatchedWith}
								/>

								<button
									type="button"
									onClick={() =>
										setFavoriteEpisode((value) => !value)
									}
									className={`mt-5 flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-bold transition ${
										favoriteEpisode
											? "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
											: "border-white/10 bg-white/[0.04] text-muted hover:text-white"
									}`}
								>
									<Heart
										className={`h-4 w-4 ${
											favoriteEpisode
												? "fill-yellow-300 text-yellow-300"
												: ""
										}`}
									/>
									Favorite episode
								</button>

								<div className="mt-5 flex flex-wrap justify-end gap-3">
									<button
										type="button"
										onClick={resetEpisodeForm}
										disabled={saving}
										className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold transition hover:bg-white/[0.08] disabled:opacity-50"
									>
										Cancel
									</button>

									<button
										type="button"
										onClick={handleSaveEpisodeNote}
										disabled={
											saving || seasons.length === 0
										}
										className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
									>
										<Save className="h-4 w-4" />
										{saving
											? "Saving..."
											: "Save episode note"}
									</button>
								</div>
							</div>
						)}

						{loading ? (
							<p className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 text-sm text-muted">
								Loading notes...
							</p>
						) : totalCount === 0 ? (
							<div className="rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center">
								<p className="text-sm text-muted">
									No notes yet. Add your first one when you
									want to remember something.
								</p>
							</div>
						) : (
							<div className="space-y-4 pb-6">
								{allNotes.map((item) =>
									item.kind === "media" ? (
										<NoteCard
											key={`media-${item.note.id}`}
											title={getDisplayNoteTitle(
												item.note.note_title,
												item.note.title_snapshot ??
													title,
											)}
											date={item.note.updated_at}
											note={item.note.note}
											emotions={item.note.emotions}
											watchedWith={item.note.watched_with}
											onEdit={() =>
												startEditMediaNote(item.note)
											}
											onDelete={() =>
												setDeleteTarget({
													kind: "media",
													id: item.note.id,
													title: getDisplayNoteTitle(
														item.note.note_title,
														item.note
															.title_snapshot ??
															title,
													),
												})
											}
										/>
									) : (
										<NoteCard
											key={`episode-${item.note.id}`}
											title={getDisplayNoteTitle(
												item.note.note_title,
												`Episode ${item.note.episode_number}`,
											)}
											subtitle={`${getEpisodeLabel(
												item.note.season_number,
												item.note.episode_number,
											)}`}
											date={item.note.updated_at}
											note={item.note.note}
											emotions={
												item.note.emotions ??
												(item.note.mood
													? [item.note.mood]
													: [])
											}
											watchedWith={item.note.watched_with}
											isFavorite={item.note.is_favorite}
											onEdit={() =>
												startEditEpisodeNote(item.note)
											}
											onDelete={() =>
												setDeleteTarget({
													kind: "episode",
													id: item.note.id,
													title: getDisplayNoteTitle(
														item.note.note_title,
														`Episode ${item.note.episode_number}`,
													),
												})
											}
										/>
									),
								)}
							</div>
						)}
					</div>
				</div>
			</div>

			<ConfirmDialog
				open={Boolean(deleteTarget)}
				title="Delete note?"
				description={`Are you sure you want to delete "${
					deleteTarget?.title ?? "this note"
				}"?`}
				confirmLabel="Delete"
				loading={saving}
				onCancel={() => setDeleteTarget(null)}
				onConfirm={handleConfirmDelete}
			/>
		</>
	);
}

function EmotionPicker({
	selected,
	onToggle,
}: {
	selected: string[];
	onToggle: (emotion: string) => void;
}) {
	return (
		<div className="mt-5">
			<p className="mb-3 text-xs font-black uppercase tracking-wide text-muted">
				Emotion
			</p>

			<div className="flex flex-wrap gap-2">
				{EMOTIONS.map((emotion) => {
					const active = selected.includes(emotion);

					return (
						<button
							key={emotion}
							type="button"
							onClick={() => onToggle(emotion)}
							className={`rounded-full px-4 py-2 text-xs font-bold transition ${
								active
									? "bg-accent text-white"
									: "bg-white/[0.07] text-muted hover:bg-white/[0.1] hover:text-white"
							}`}
						>
							{emotion}
						</button>
					);
				})}
			</div>
		</div>
	);
}

function WatchedWithInput({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) {
	return (
		<div className="mt-5">
			<div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-muted">
				<Users className="h-4 w-4" />
				Watched with
			</div>

			<input
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder="Example: John, Jane and Mary..."
				className="h-14 w-full rounded-2xl border border-white/10 bg-[#111116] px-5 text-sm text-white outline-none transition placeholder:text-muted focus:border-accent"
			/>
		</div>
	);
}

function NoteCard({
	title,
	subtitle,
	date,
	note,
	emotions,
	watchedWith,
	isFavorite,
	onEdit,
	onDelete,
}: {
	title: string;
	subtitle?: string;
	date?: string | null;
	note?: string | null;
	emotions: string[];
	watchedWith: string[];
	isFavorite?: boolean;
	onEdit: () => void;
	onDelete: () => void;
}) {
	return (
		<div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-accent/60 hover:bg-white/[0.04] md:p-6">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h3 className="text-lg font-black">{title}</h3>

					{subtitle && (
						<p className="mt-1 text-sm font-bold text-accent">
							{subtitle}
						</p>
					)}

					<p className="mt-1 text-sm text-muted">
						Updated {formatDate(date)}
					</p>
				</div>

				<div className="flex shrink-0 gap-2">
					<button
						type="button"
						onClick={onEdit}
						className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-white transition hover:bg-accent"
						title="Edit note"
					>
						<Pencil className="h-4 w-4" />
					</button>

					<button
						type="button"
						onClick={onDelete}
						className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/50 text-accent transition hover:bg-accent hover:text-white"
						title="Delete note"
					>
						<Trash2 className="h-4 w-4" />
					</button>
				</div>
			</div>

			{isFavorite && (
				<div className="mt-4 flex w-fit items-center gap-2 rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-300">
					<Heart className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />
					Favorite episode
				</div>
			)}

			<p className="mt-5 whitespace-pre-line text-sm leading-6 text-gray-200">
				{note?.trim() || "No written note."}
			</p>

			{emotions.length > 0 && (
				<div className="mt-5 flex flex-wrap gap-2">
					{emotions.map((emotion) => (
						<span
							key={emotion}
							className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-bold text-accent"
						>
							{emotion}
						</span>
					))}
				</div>
			)}

			{watchedWith.length > 0 && (
				<div className="mt-5 flex flex-wrap gap-2">
					{watchedWith.map((person) => (
			
                        
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
