import { createClient } from "@/lib/supabase/client";
import type { DiaryEntry } from "@/types/diary";

type MediaType = "movie" | "tv";

type DbDiaryEntry = {
	id: number;
	user_id: string;
	api_source: string;
	media_id: string;
	media_type: MediaType;
	title_snapshot: string | null;
	poster_path_snapshot: string | null;
	backdrop_path_snapshot: string | null;
	watched_date: string | null;
	rating: number | null;
	review: string | null;
	season_number: number | null;
	episode_number: number | null;
	status: "watching" | "completed" | "planned";
	progress: DiaryEntry["progress"] | null;
	visibility: "private" | "public";
	created_at: string;
	updated_at: string | null;
};

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
		review: row.review ?? undefined,
		updatedAt: row.updated_at ?? row.created_at,
	} as DiaryEntry;
}

export async function getDiary(): Promise<DiaryEntry[]> {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return [];

	const { data, error } = await supabase
		.from("diary_entries")
		.select("*")
		.eq("user_id", user.id)
		.order("updated_at", { ascending: false, nullsFirst: false })
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Failed to load diary:", error.message);
		return [];
	}

	return ((data ?? []) as DbDiaryEntry[]).map(mapDbToDiaryEntry);
}

export async function updateDiaryEntry(entry: DiaryEntry) {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("You need to be logged in to save diary entries.");
	}

	const mediaId = String(entry.id);
	const mediaType = entry.type;

	const payload = {
		user_id: user.id,
		api_source: "tmdb",
		media_id: mediaId,
		media_type: mediaType,
		title_snapshot: entry.title,
		poster_path_snapshot: entry.poster ?? null,
		backdrop_path_snapshot: entry.backdrop ?? entry.poster ?? null,
		rating: entry.rating ?? null,
		review: entry.review ?? null,
		status: entry.status ?? "completed",
		progress: entry.progress ?? null,
		visibility: "private",
		updated_at: new Date().toISOString(),
	};

	const { data: existingEntry, error: findError } = await supabase
		.from("diary_entries")
		.select("id")
		.eq("user_id", user.id)
		.eq("media_id", mediaId)
		.eq("media_type", mediaType)
		.maybeSingle();

	if (findError) throw findError;

	if (existingEntry) {
		const { error } = await supabase
			.from("diary_entries")
			.update(payload)
			.eq("id", existingEntry.id);

		if (error) throw error;
		return;
	}

	const { error } = await supabase.from("diary_entries").insert(payload);

	if (error) throw error;
}

export async function removeDiaryEntry(id: number, type: MediaType) {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("You need to be logged in to remove diary entries.");
	}

	const { error } = await supabase
		.from("diary_entries")
		.delete()
		.eq("user_id", user.id)
		.eq("media_id", String(id))
		.eq("media_type", type);

	if (error) throw error;
}

/**
 * Keep this so old imports do not break.
 */
export async function saveDiary(entries: DiaryEntry[]) {
	for (const entry of entries) {
		await updateDiaryEntry(entry);
	}
}