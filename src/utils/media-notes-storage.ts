"use client";

import { createClient } from "@/lib/supabase/client";

export type MediaType = "movie" | "tv";

export type MediaNote = {
	id: string;
	user_id: string;
	media_id: string;
	media_type: MediaType;
	title_snapshot: string | null;
	poster_path_snapshot: string | null;
	note_title: string | null;
	note: string;
	emotions: string[];
	watched_with: string[];
	created_at: string;
	updated_at: string;
};

export type EpisodeNote = {
	id: string;
	user_id: string;
	tv_id: string;
	title_snapshot: string | null;
	poster_path_snapshot: string | null;
	note_title: string | null;
	season_number: number;
	episode_number: number;
	note: string;
	emotions: string[];
	mood: string | null;
	is_favorite: boolean;
	watched_with: string[];
	created_at: string;
	updated_at: string;
};

export type MediaNotesBundle = {
	mediaNotes: MediaNote[];
	episodeNotes: EpisodeNote[];
};

async function getUserId(): Promise<string | null> {
	const supabase = createClient();

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error) {
		throw new Error(error.message);
	}

	return user?.id ?? null;
}

function capitalizeNamePart(value: string): string {
	return value
		.toLowerCase()
		.split(" ")
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function normalizeWatchedWith(values?: string[] | null): string[] {
	return Array.from(
		new Set(
			(values ?? [])
				.flatMap((value) => value.split(/\s*,\s*|\s+and\s+/i))
				.map((value) => value.trim().replace(/\s+/g, " "))
				.filter(Boolean)
				.map(capitalizeNamePart),
		),
	);
}

function normalizeList(values?: string[] | null): string[] {
	return Array.from(
		new Set((values ?? []).map((value) => value.trim()).filter(Boolean)),
	);
}

function normalizeTitle(
	value: string | null | undefined,
	fallback: string,
): string {
	const cleanValue = value?.trim();

	if (cleanValue) return cleanValue;

	return fallback.trim() || "Untitled note";
}

function normalizeMediaNote(row: MediaNote): MediaNote {
	return {
		...row,
		note_title: normalizeTitle(
			row.note_title,
			row.title_snapshot ?? "Movie/show note",
		),
		emotions: normalizeList(row.emotions),
		watched_with: normalizeWatchedWith(row.watched_with),
	};
}

function normalizeEpisodeNote(row: EpisodeNote): EpisodeNote {
	return {
		...row,
		note_title: normalizeTitle(
			row.note_title,
			`S${row.season_number} · E${row.episode_number}`,
		),
		emotions: normalizeList(row.emotions ?? (row.mood ? [row.mood] : [])),
		mood: row.mood ?? null,
		watched_with: normalizeWatchedWith(row.watched_with),
	};
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

export async function getMediaNotes(
	mediaId: number,
	mediaType: MediaType,
): Promise<MediaNote[]> {
	const supabase = createClient();
	const userId = await getUserId();

	if (!userId) return [];

	const { data, error } = await supabase
		.from("media_notes")
		.select("*")
		.eq("user_id", userId)
		.eq("media_id", String(mediaId))
		.eq("media_type", mediaType)
		.order("updated_at", { ascending: false });

	if (error) {
		throw new Error(error.message);
	}

	return sortLatestFirst(
		((data ?? []) as MediaNote[]).map(normalizeMediaNote),
	);
}

export async function getMediaNote(
	mediaId: number,
	mediaType: MediaType,
): Promise<MediaNote | null> {
	const notes = await getMediaNotes(mediaId, mediaType);

	return notes[0] ?? null;
}

export async function getEpisodeNotes(tvId: number): Promise<EpisodeNote[]> {
	const supabase = createClient();
	const userId = await getUserId();

	if (!userId) return [];

	const { data, error } = await supabase
		.from("tv_episode_notes")
		.select("*")
		.eq("user_id", userId)
		.eq("tv_id", String(tvId))
		.order("updated_at", { ascending: false });

	if (error) {
		throw new Error(error.message);
	}

	return sortLatestFirst(
		((data ?? []) as EpisodeNote[]).map(normalizeEpisodeNote),
	);
}

export async function getMediaNotesBundle(
	mediaId: number,
	mediaType: MediaType,
): Promise<MediaNotesBundle> {
	const [mediaNotes, episodeNotes] = await Promise.all([
		getMediaNotes(mediaId, mediaType),
		mediaType === "tv" ? getEpisodeNotes(mediaId) : Promise.resolve([]),
	]);

	return {
		mediaNotes: sortLatestFirst(mediaNotes),
		episodeNotes: sortLatestFirst(episodeNotes),
	};
}

export async function saveMediaNote({
	id,
	mediaId,
	mediaType,
	title,
	posterPath,
	noteTitle,
	note,
	emotions,
	watchedWith,
}: {
	id?: string;
	mediaId: number;
	mediaType: MediaType;
	title: string;
	posterPath?: string | null;
	noteTitle: string;
	note: string;
	emotions: string[];
	watchedWith: string[];
}): Promise<MediaNote> {
	const supabase = createClient();
	const userId = await getUserId();

	if (!userId) {
		throw new Error("You need to log in first to save a note.");
	}

	const payload = {
		user_id: userId,
		media_id: String(mediaId),
		media_type: mediaType,
		title_snapshot: title,
		poster_path_snapshot: posterPath ?? null,
		note_title: normalizeTitle(noteTitle, title),
		note: note.trim(),
		emotions: normalizeList(emotions),
		watched_with: normalizeWatchedWith(watchedWith),
		updated_at: new Date().toISOString(),
	};

	const query = id
		? supabase
				.from("media_notes")
				.update(payload)
				.eq("id", id)
				.eq("user_id", userId)
				.select("*")
				.single()
		: supabase.from("media_notes").insert(payload).select("*").single();

	const { data, error } = await query;

	if (error) {
		throw new Error(error.message);
	}

	return normalizeMediaNote(data as MediaNote);
}

export async function deleteMediaNote(id: string): Promise<void> {
	const supabase = createClient();
	const userId = await getUserId();

	if (!userId) return;

	const { error } = await supabase
		.from("media_notes")
		.delete()
		.eq("id", id)
		.eq("user_id", userId);

	if (error) {
		throw new Error(error.message);
	}
}

export async function saveEpisodeNote({
	id,
	tvId,
	title,
	posterPath,
	noteTitle,
	seasonNumber,
	episodeNumber,
	note,
	emotions,
	isFavorite,
	watchedWith,
}: {
	id?: string;
	tvId: number;
	title: string;
	posterPath?: string | null;
	noteTitle: string;
	seasonNumber: number;
	episodeNumber: number;
	note: string;
	emotions: string[];
	isFavorite: boolean;
	watchedWith: string[];
}): Promise<EpisodeNote> {
	const supabase = createClient();
	const userId = await getUserId();

	if (!userId) {
		throw new Error("You need to log in first to save an episode note.");
	}

	const finalEmotions = normalizeList(emotions);

	const payload = {
		user_id: userId,
		tv_id: String(tvId),
		title_snapshot: title,
		poster_path_snapshot: posterPath ?? null,
		note_title: normalizeTitle(
			noteTitle,
			`S${seasonNumber} · E${episodeNumber}`,
		),
		season_number: seasonNumber,
		episode_number: episodeNumber,
		note: note.trim(),
		emotions: finalEmotions,
		mood: finalEmotions[0] ?? null,
		is_favorite: isFavorite,
		watched_with: normalizeWatchedWith(watchedWith),
		updated_at: new Date().toISOString(),
	};

	const query = id
		? supabase
				.from("tv_episode_notes")
				.update(payload)
				.eq("id", id)
				.eq("user_id", userId)
				.select("*")
				.single()
		: supabase
				.from("tv_episode_notes")
				.insert(payload)
				.select("*")
				.single();

	const { data, error } = await query;

	if (error) {
		throw new Error(error.message);
	}

	return normalizeEpisodeNote(data as EpisodeNote);
}

export async function deleteEpisodeNote(id: string): Promise<void> {
	const supabase = createClient();
	const userId = await getUserId();

	if (!userId) return;

	const { error } = await supabase
		.from("tv_episode_notes")
		.delete()
		.eq("id", id)
		.eq("user_id", userId);

	if (error) {
		throw new Error(error.message);
	}
}

export async function deleteAllNotesForMedia({
	mediaId,
	mediaType,
}: {
	mediaId: number;
	mediaType: MediaType;
}): Promise<void> {
	const supabase = createClient();
	const userId = await getUserId();

	if (!userId) return;

	const { error: mediaError } = await supabase
		.from("media_notes")
		.delete()
		.eq("user_id", userId)
		.eq("media_id", String(mediaId))
		.eq("media_type", mediaType);

	if (mediaError) {
		throw new Error(mediaError.message);
	}

	if (mediaType === "tv") {
		const { error: episodeError } = await supabase
			.from("tv_episode_notes")
			.delete()
			.eq("user_id", userId)
			.eq("tv_id", String(mediaId));

		if (episodeError) {
			throw new Error(episodeError.message);
		}
	}
}

export async function getMediaNotePresence(
	mediaId: number,
	mediaType: MediaType,
): Promise<boolean> {
	const bundle = await getMediaNotesBundle(mediaId, mediaType);

	const hasMediaNotes = bundle.mediaNotes.some(
		(note) =>
			Boolean(note.note?.trim()) ||
			note.emotions.length > 0 ||
			note.watched_with.length > 0,
	);

	const hasEpisodeNotes = bundle.episodeNotes.length > 0;

	return hasMediaNotes || hasEpisodeNotes;
}

export async function getAllNotes(): Promise<MediaNotesBundle> {
	const supabase = createClient();
	const userId = await getUserId();

	if (!userId) {
		return {
			mediaNotes: [],
			episodeNotes: [],
		};
	}

	const [
		{ data: mediaNotes, error: mediaError },
		{ data: episodeNotes, error: episodeError },
	] = await Promise.all([
		supabase
			.from("media_notes")
			.select("*")
			.eq("user_id", userId)
			.order("updated_at", { ascending: false }),

		supabase
			.from("tv_episode_notes")
			.select("*")
			.eq("user_id", userId)
			.order("updated_at", { ascending: false }),
	]);

	if (mediaError) {
		throw new Error(mediaError.message);
	}

	if (episodeError) {
		throw new Error(episodeError.message);
	}

	return {
		mediaNotes: sortLatestFirst(
			((mediaNotes ?? []) as MediaNote[]).map(normalizeMediaNote),
		),
		episodeNotes: sortLatestFirst(
			((episodeNotes ?? []) as EpisodeNote[]).map(normalizeEpisodeNote),
		),
	};
}
