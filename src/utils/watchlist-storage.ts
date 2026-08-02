// import { createClient } from "@/lib/supabase/client";
// import type { DiaryEntry } from "@/types/diary";
// import { GENRE_MAP } from "@/constants/genres";

// type MediaType = "movie" | "tv";

// type DbWatchlistItem = {
// 	id: number;
// 	user_id: string;
// 	api_source: string;
// 	media_id: string;
// 	media_type: MediaType;
// 	title_snapshot: string;
// 	poster_path_snapshot: string | null;
// 	backdrop_path_snapshot: string | null;
// 	status: "planned";
// 	created_at: string;
// 	updated_at: string | null;
// };

// function mapDbToWatchlistItem(row: DbWatchlistItem): DiaryEntry {
// 	return {
// 		id: Number(row.media_id),
// 		type: row.media_type,
// 		title: row.title_snapshot,
// 		poster: row.poster_path_snapshot ?? "",
// 		backdrop: row.backdrop_path_snapshot ?? row.poster_path_snapshot ?? "",
// 		status: "planned",
// 		progress: undefined,
// 		rating: null,
// 		updatedAt: row.updated_at ?? row.created_at,
// 	} as DiaryEntry;
// }

// export async function getWatchlist(): Promise<DiaryEntry[]> {
// 	const supabase = createClient();

// 	const {
// 		data: { user },
// 	} = await supabase.auth.getUser();

// 	if (!user) return [];

// 	const { data, error } = await supabase
// 		.from("watchlist_items")
// 		.select("*")
// 		.eq("user_id", user.id)
// 		.order("updated_at", { ascending: false, nullsFirst: false })
// 		.order("created_at", { ascending: false });

// 	if (error) {
// 		console.error("Failed to load watchlist:", error.message);
// 		return [];
// 	}

// 	return ((data ?? []) as DbWatchlistItem[]).map(mapDbToWatchlistItem);
// }

// export async function addToWatchlist(entry: DiaryEntry) {
// 	const supabase = createClient();

// 	const {
// 		data: { user },
// 	} = await supabase.auth.getUser();

// 	if (!user) {
// 		throw new Error("You need to be logged in to save to watchlist.");
// 	}

// 	const payload = {
// 		user_id: user.id,
// 		api_source: "tmdb",
// 		media_id: String(entry.id),
// 		media_type: entry.type,
// 		title_snapshot: entry.title,
// 		poster_path_snapshot: entry.poster ?? null,
// 		backdrop_path_snapshot: entry.backdrop ?? entry.poster ?? null,
// 		status: "planned",
// 		updated_at: new Date().toISOString(),
// 	};

// 	const { error } = await supabase.from("watchlist_items").upsert(payload, {
// 		onConflict: "user_id,media_id,media_type",
// 	});

// 	if (error) throw error;
// }

// export async function removeFromWatchlist(id: number, type: MediaType) {
// 	const supabase = createClient();

// 	const {
// 		data: { user },
// 	} = await supabase.auth.getUser();

// 	if (!user) {
// 		throw new Error("You need to be logged in to remove from watchlist.");
// 	}

// 	const { error } = await supabase
// 		.from("watchlist_items")
// 		.delete()
// 		.eq("user_id", user.id)
// 		.eq("media_id", String(id))
// 		.eq("media_type", type);

// 	if (error) throw error;
// }

import { createClient } from "@/lib/supabase/client";
import type { DiaryEntry } from "@/types/diary";
import { GENRE_MAP } from "@/constants/genres";

type MediaType = "movie" | "tv";

type GenreSnapshot = {
	id?: number;
	name?: string;
};

type DbWatchlistItem = {
	id: number;
	user_id: string;
	api_source: string;
	media_id: string;
	media_type: MediaType;
	title_snapshot: string;
	poster_path_snapshot: string | null;
	backdrop_path_snapshot: string | null;
	status: "planned";
	rating: number | null;
	genre_ids: number[] | null;
	genre_names: string[] | null;
	genres: Array<GenreSnapshot | string> | null;
	created_at: string;
	updated_at: string | null;
};

function getGenreIds(entry: DiaryEntry): number[] {
	return entry.genreIds ?? [];
}

function getGenreNames(entry: DiaryEntry): string[] {
	if (entry.genreNames && entry.genreNames.length > 0) {
		return entry.genreNames;
	}

	return getGenreIds(entry)
		.map((id) => GENRE_MAP[id])
		.filter((name): name is string => Boolean(name));
}

function getGenres(entry: DiaryEntry): Array<GenreSnapshot | string> {
	if (entry.genres && entry.genres.length > 0) {
		return entry.genres;
	}

	return getGenreIds(entry)
		.map((id) => ({
			id,
			name: GENRE_MAP[id],
		}))
		.filter((genre) => Boolean(genre.name));
}

function mapDbToWatchlistItem(row: DbWatchlistItem): DiaryEntry {
	return {
		id: Number(row.media_id),
		type: row.media_type,
		title: row.title_snapshot,
		poster: row.poster_path_snapshot ?? "",
		backdrop: row.backdrop_path_snapshot ?? row.poster_path_snapshot ?? "",
		status: "planned",
		progress: undefined,
		rating: row.rating ?? null,
		updatedAt: row.updated_at ?? row.created_at,
		genreIds: row.genre_ids ?? [],
		genreNames: row.genre_names ?? [],
		genres: row.genres ?? [],
	} as DiaryEntry;
}

export async function getWatchlist(): Promise<DiaryEntry[]> {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return [];

	const { data, error } = await supabase
		.from("watchlist_items")
		.select("*")
		.eq("user_id", user.id)
		.order("updated_at", { ascending: false, nullsFirst: false })
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Failed to load watchlist:", error.message);
		return [];
	}

	return ((data ?? []) as DbWatchlistItem[]).map(mapDbToWatchlistItem);
}

export async function addToWatchlist(entry: DiaryEntry) {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("You need to be logged in to save to watchlist.");
	}

	const genreIds = getGenreIds(entry);
	const genreNames = getGenreNames(entry);
	const genres = getGenres(entry);

	const payload = {
		user_id: user.id,
		api_source: "tmdb",
		media_id: String(entry.id),
		media_type: entry.type,
		title_snapshot: entry.title,
		poster_path_snapshot: entry.poster ?? null,
		backdrop_path_snapshot: entry.backdrop ?? entry.poster ?? null,
		status: "planned",
		rating: entry.rating ?? null,
		genre_ids: genreIds,
		genre_names: genreNames,
		genres,
		updated_at: new Date().toISOString(),
	};

	const { error } = await supabase.from("watchlist_items").upsert(payload, {
		onConflict: "user_id,media_id,media_type",
	});

	if (error) throw error;
}

export async function removeFromWatchlist(id: number, type: MediaType) {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("You need to be logged in to remove from watchlist.");
	}

	const { error } = await supabase
		.from("watchlist_items")
		.delete()
		.eq("user_id", user.id)
		.eq("media_id", String(id))
		.eq("media_type", type);

	if (error) throw error;
}