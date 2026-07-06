"use client";

import { useEffect, useState } from "react";
import MediaCard from "@/components/media/media-card";

type TestMedia = {
	id: number;
	media_type?: "movie" | "tv";
	title?: string;
	name?: string;
	poster_path?: string | null;
	backdrop_path?: string | null;
	vote_average?: number | null;
};

export default function TestPage() {
	const [items, setItems] = useState<TestMedia[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function load() {
			const res = await fetch(
				"/api/tmdb/trending?type=all&timeWindow=week&page=1",
			);

			const data = await res.json();

			setItems(
				(data.results ?? [])
					.filter(
						(item: TestMedia) =>
							item.id &&
							(item.media_type === "movie" ||
								item.media_type === "tv") &&
							item.poster_path,
					)
					.slice(0, 12),
			);

			setLoading(false);
		}

		load();
	}, []);

	if (loading) {
		return (
			<main className="min-h-screen px-6 py-10 md:px-12">
				<p className="text-white">Loading test cards...</p>
			</main>
		);
	}

	return (
		<main className="min-h-screen px-6 py-10 md:px-12">
			<h1 className="mb-2 text-2xl font-bold text-white">
				Media Card Test
			</h1>

			<p className="mb-8 text-sm text-muted">
				Try adding movies and TV shows. Refresh the page after saving to
				check that Supabase remembers the diary state.
            </p>
            

			<div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
				{items.map((item) => (
					<MediaCard
						key={`${item.media_type}-${item.id}`}
						media={item}
						variant="default"
					/>
				))}
			</div>

			<h2 className="mb-4 mt-12 text-xl font-semibold text-white">
				Large variant
			</h2>

			<div className="flex flex-wrap gap-6">
				{items.slice(0, 3).map((item) => (
					<MediaCard
						key={`large-${item.media_type}-${item.id}`}
						media={item}
						variant="large"
					/>
				))}
			</div>
		</main>
	);
}
