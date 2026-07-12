"use client";

import { useEffect, useState } from "react";
import MediaCard from "@/components/media/media-card";
import { getDiary } from "@/utils/diary-storage";
import { getWatchlist } from "@/utils/watchlist-storage";
import type { DiaryEntry } from "@/types/diary";

type MediaType = "movie" | "tv";

type RecommendationItem = {
	id: number;
	media_type: MediaType;
	title?: string;
	name?: string;
	poster_path: string | null;
	backdrop_path: string | null;
	vote_average: number | null;
};

const MAX_SOURCE_ITEMS = 5;
const MAX_RECOMMENDATIONS = 12;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function isMediaType(value: unknown): value is MediaType {
	return value === "movie" || value === "tv";
}

function parseRecommendationItem(item: unknown): RecommendationItem | null {
	if (!isRecord(item)) return null;

	const id = item.id;
	const mediaType = item.media_type;
	const title = item.title;
	const name = item.name;
	const posterPath = item.poster_path;
	const backdropPath = item.backdrop_path;
	const voteAverage = item.vote_average;

	if (typeof id !== "number") return null;
	if (!isMediaType(mediaType)) return null;

	return {
		id,
		media_type: mediaType,
		title: typeof title === "string" ? title : undefined,
		name: typeof name === "string" ? name : undefined,
		poster_path: typeof posterPath === "string" ? posterPath : null,
		backdrop_path: typeof backdropPath === "string" ? backdropPath : null,
		vote_average: typeof voteAverage === "number" ? voteAverage : null,
	};
}

function parseRecommendations(data: unknown): RecommendationItem[] {
	if (!Array.isArray(data)) return [];

	return data
		.map(parseRecommendationItem)
		.filter((item): item is RecommendationItem => item !== null);
}

function getTitle(item: RecommendationItem) {
	if (item.media_type === "movie") return item.title ?? "Untitled";
	return item.name ?? "Untitled";
}

function sortByRecentlyUpdated(entries: DiaryEntry[]) {
	return [...entries].sort((a, b) => {
		const dateA = new Date(a.updatedAt ?? 0).getTime();
		const dateB = new Date(b.updatedAt ?? 0).getTime();

		return dateB - dateA;
	});
}

export default function Recommendations() {
	const [recommendations, setRecommendations] = useState<
		RecommendationItem[]
	>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		async function loadRecommendations() {
			try {
				setLoading(true);

				const diary = await getDiary();
				const watchlist = await getWatchlist();

				const userItems = [...diary, ...watchlist];
				const sourceItems = sortByRecentlyUpdated(userItems).slice(
					0,
					MAX_SOURCE_ITEMS,
				);

				if (sourceItems.length === 0) {
					if (!cancelled) setRecommendations([]);
					return;
				}

				const recommendationGroups = await Promise.all(
					sourceItems.map(async (item) => {
						const res = await fetch(
							`/api/tmdb/recommendations?id=${item.id}&type=${item.type}`,
						);

						if (!res.ok) return [];

						const data: unknown = await res.json();
						return parseRecommendations(data);
					}),
				);

				const alreadySavedKeys = new Set(
					userItems.map((item) => `${item.type}-${item.id}`),
				);

				const uniqueRecommendations = new Map<
					string,
					RecommendationItem
				>();

				for (const item of recommendationGroups.flat()) {
					if (!item.poster_path) continue;

					const key = `${item.media_type}-${item.id}`;

					if (alreadySavedKeys.has(key)) continue;
					if (uniqueRecommendations.has(key)) continue;

					uniqueRecommendations.set(key, item);
				}

				const finalRecommendations = Array.from(
					uniqueRecommendations.values(),
				).slice(0, MAX_RECOMMENDATIONS);

				if (!cancelled) {
					setRecommendations(finalRecommendations);
				}
			} catch (error) {
				console.error("Failed to load recommendations:", error);

				if (!cancelled) {
					setRecommendations([]);
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		loadRecommendations();

		return () => {
			cancelled = true;
		};
	}, []);

	if (loading) {
		return (
			<div className="mt-10 px-6 md:px-24">
				<h3 className="font-semibold text-lg mb-4 text-white">
					Recommendations
				</h3>

				<p className="text-sm text-muted">Loading recommendations...</p>
			</div>
		);
	}

	if (recommendations.length === 0) {
		return (
			<div className="mt-10 px-6 md:px-24">
				<h3 className="font-semibold text-lg mb-4 text-white">
					Recommendations
				</h3>

				<p className="text-sm text-muted">
					Add a few movies or TV shows to your diary to get better
					recommendations.
				</p>
			</div>
		);
	}

	return (
		<div className="mt-10 px-6 md:px-24">
			<h3 className="font-semibold text-lg mb-4 text-white">
				Recommendations
			</h3>

			<div
				className="
					flex gap-5 overflow-x-auto px-1 pt-4 pb-6
					snap-x snap-mandatory scroll-smooth
					scrollbar-hide [&::-webkit-scrollbar]:hidden
					[-ms-overflow-style:'none'] [scrollbar-width:'none']
				"
			>
				{recommendations.map((item) => (
					<MediaCard
						key={`${item.media_type}-${item.id}`}
						id={item.id}
						type={item.media_type}
						title={getTitle(item)}
						posterPath={item.poster_path}
						backdropPath={item.backdrop_path ?? item.poster_path}
						rating={item.vote_average}
						variant="row"
					/>
				))}
			</div>
		</div>
	);
}