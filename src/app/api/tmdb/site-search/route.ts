import { NextResponse } from "next/server";

type MediaType = "movie" | "tv";

type SearchResult = {
	id: number;
	media_type: MediaType;
	title: string;
	poster_path: string | null;
	backdrop_path: string | null;
	vote_average: number | null;
	year: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function getYear(date: unknown): string | null {
	if (typeof date !== "string" || !date) return null;
	return date.slice(0, 4);
}

function parseTmdbItem(item: unknown): SearchResult | null {
	if (!isRecord(item)) return null;

	const id = item.id;
	const mediaType = item.media_type;
	const title = item.title;
	const name = item.name;
	const posterPath = item.poster_path;
	const backdropPath = item.backdrop_path;
	const voteAverage = item.vote_average;
	const releaseDate = item.release_date;
	const firstAirDate = item.first_air_date;

	if (typeof id !== "number") return null;
	if (mediaType !== "movie" && mediaType !== "tv") return null;

	const finalTitle =
		mediaType === "movie"
			? typeof title === "string"
				? title
				: null
			: typeof name === "string"
				? name
				: null;

	if (!finalTitle) return null;

	return {
		id,
		media_type: mediaType,
		title: finalTitle,
		poster_path: typeof posterPath === "string" ? posterPath : null,
		backdrop_path: typeof backdropPath === "string" ? backdropPath : null,
		vote_average: typeof voteAverage === "number" ? voteAverage : null,
		year:
			mediaType === "movie"
				? getYear(releaseDate)
				: getYear(firstAirDate),
	};
}

function parseTmdbResponse(data: unknown): SearchResult[] {
	if (!isRecord(data)) return [];

	const results = data.results;

	if (!Array.isArray(results)) return [];

	return results
		.map(parseTmdbItem)
		.filter((item): item is SearchResult => item !== null)
		.slice(0, 8);
}

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const query = searchParams.get("query")?.trim();

	if (!query) {
		return NextResponse.json({ results: [] });
	}

	const tmdbBaseUrl =
		process.env.TMDB_API_BASE_URL ?? "https://api.themoviedb.org/3";

	const tmdbToken = process.env.TMDB_API_KEY;

	if (!tmdbToken) {
		return NextResponse.json(
			{ error: "Missing TMDB_API_KEY" },
			{ status: 500 },
		);
	}

	const url = `${tmdbBaseUrl}/search/multi?query=${encodeURIComponent(
		query,
	)}&include_adult=false&language=en-US&page=1`;

	const res = await fetch(url, {
		headers: {
			Authorization: `Bearer ${tmdbToken}`,
			Accept: "application/json",
		},
		next: { revalidate: 60 * 30 },
	});

	if (!res.ok) {
		return NextResponse.json(
			{ error: "Failed to search TMDB" },
			{ status: res.status },
		);
	}

	const data: unknown = await res.json();

	return NextResponse.json({
		results: parseTmdbResponse(data),
	});
}
