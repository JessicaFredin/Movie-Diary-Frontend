import { DiaryEntry } from "@/types/diary";

const KEY = "movie_watchlist";

export function getWatchlist(): DiaryEntry[] {
	if (typeof window === "undefined") return [];
	const data = localStorage.getItem(KEY);
	return data ? JSON.parse(data) : [];
}

export function addToWatchlist(entry: DiaryEntry) {
	const list = getWatchlist();
	if (list.find((i) => i.id === entry.id && i.type === entry.type)) return;
	localStorage.setItem(KEY, JSON.stringify([entry, ...list]));
}

export function removeFromWatchlist(id: number, type: "movie" | "tv") {
	const list = getWatchlist().filter(
		(i) => !(i.id === id && i.type === type),
	);
	localStorage.setItem(KEY, JSON.stringify(list));
}
