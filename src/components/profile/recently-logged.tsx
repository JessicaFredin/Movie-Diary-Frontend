"use client";

import { getDiary } from "@/utils/diary-storage";
import { DiaryEntry } from "@/types/diary";
import MovieGrid from "../diary/movie-grid";

export default function RecentlyLogged() {
	const diaryEntries: DiaryEntry[] = getDiary();

	return (
		<div className="mt-10 px-6 md:px-24">
			<h3 className="font-semibold text-lg mb-4 text-white">
				Recently logged
			</h3>

			<MovieGrid items={diaryEntries}></MovieGrid>
		</div>
	);
}
