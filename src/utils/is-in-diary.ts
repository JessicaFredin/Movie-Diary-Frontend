import { getDiary } from "@/utils/diary-storage";

export function isInDiary(id: number, type: "movie" | "tv") {
	const diary = getDiary();
	return diary.some((entry) => entry.id === id && entry.type === type);
}
