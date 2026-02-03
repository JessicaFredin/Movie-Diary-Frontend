import { DiaryEntry } from "@/types/diary";

const KEY = "my-diary";

export function getDiary(): DiaryEntry[] {
	if (typeof window === "undefined") return [];
	try {
		return JSON.parse(localStorage.getItem(KEY) || "[]");
	} catch {
		return [];
	}
}

export function saveDiary(entries: DiaryEntry[]) {
	localStorage.setItem(KEY, JSON.stringify(entries));
}

export function updateDiaryEntry(entry: DiaryEntry) {
	const diary = getDiary();
	const index = diary.findIndex(
		(e) => e.id === entry.id && e.type === entry.type,
	);

	if (index >= 0) {
		diary[index] = entry;
	} else {
		diary.unshift(entry);
	}

	saveDiary(diary);
}

export function removeDiaryEntry(id: number, type: "movie" | "tv") {
	const diary = getDiary().filter((e) => !(e.id === id && e.type === type));
	saveDiary(diary);
}
