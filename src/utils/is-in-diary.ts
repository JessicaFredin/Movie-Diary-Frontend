import { getDiary } from "@/utils/diary-storage";

export async function isInDiary(id: number, type: "movie" | "tv") {
	const diary = await getDiary();

	return diary.some((entry) => entry.id === id && entry.type === type);
}