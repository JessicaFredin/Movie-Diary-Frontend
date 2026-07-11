"use client";

import { useEffect, useMemo, useState } from "react";
import { getDiary } from "@/utils/diary-storage";
import type { DiaryEntry } from "@/types/diary";
import MovieGrid from "../diary/movie-grid";

const MAX_RECENT_ITEMS = 7;

export default function RecentlyLogged() {
	const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
	const [loading, setLoading] = useState(true);

	async function loadDiary() {
		try {
			setLoading(true);

			const entries = await getDiary();

			setDiaryEntries(Array.isArray(entries) ? entries : []);
		} catch (error) {
			console.error("Failed to load recently logged:", error);
			setDiaryEntries([]);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadDiary();
	}, []);

	const recentEntries = useMemo(() => {
		return [...diaryEntries]
			.sort((a, b) => {
				const dateA = new Date(a.updatedAt ?? 0).getTime();
				const dateB = new Date(b.updatedAt ?? 0).getTime();

				return dateB - dateA;
			})
			.slice(0, MAX_RECENT_ITEMS);
	}, [diaryEntries]);

	if (loading) {
		return (
			<div className="mt-10 px-6 md:px-24">
				<h3 className="font-semibold text-lg mb-4 text-white">
					Recently logged
				</h3>

				<p className="text-sm text-muted">Loading...</p>
			</div>
		);
	}

	if (recentEntries.length === 0) {
		return (
			<div className="mt-10 px-6 md:px-24">
				<h3 className="font-semibold text-lg mb-4 text-white">
					Recently logged
				</h3>

				<p className="text-sm text-muted">
					You haven’t logged anything yet.
				</p>
			</div>
		);
	}

	return (
		<div className="mt-10 px-6 md:px-24">
			<h3 className="font-semibold text-lg mb-4 text-white">
				Recently logged
			</h3>

			<MovieGrid items={recentEntries} onDiaryChanged={loadDiary} />
		</div>
	);
}
