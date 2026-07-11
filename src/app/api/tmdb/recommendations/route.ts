import { NextResponse } from "next/server";

type MediaType = "movie" | "tv";

type TmdbRecommendationItem = {
	id: number;
	media_type: MediaType;
	title?: string;
	name?: string;
	poster_path: string | null;
	backdrop_path: string | null;
	vote_average: number | null;
};

type TmdbRecommendationsResponse = {
	results: TmdbRecommendationItem[];
};

function isMediaType(value: string | null): value is MediaType {
	return value === "movie" || value === "tv";
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function parseRecommendationItem(
	item: unknown,
	type: MediaType,
): TmdbRecommendationItem | null {
	if (!isRecord(item)) return null;

	const id = item.id;
	const title = item.title;
	const name = item.name;
	const posterPath = item.poster_path;
	const backdropPath = item.backdrop_path;
	const voteAverage = item.vote_average;

	if (typeof id !== "number") return null;

	return {
		id,
		media_type: type,
		title: typeof title === "string" ? title : undefined,
		name: typeof name === "string" ? name : undefined,
		poster_path: typeof posterPath === "string" ? posterPath : null,
		backdrop_path: typeof backdropPath === "string" ? backdropPath : null,
		vote_average: typeof voteAverage === "number" ? voteAverage : null,
	};
}

function parseRecommendationsResponse(
	data: unknown,
	type: MediaType,
): TmdbRecommendationsResponse {
	if (!isRecord(data) || !Array.isArray(data.results)) {
		return { results: [] };
	}

	return {
		results: data.results
			.map((item) => parseRecommendationItem(item, type))
			.filter((item): item is TmdbRecommendationItem => item !== null),
	};
}

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);

	const id = searchParams.get("id");
	const type = searchParams.get("type");

	if (!id || !isMediaType(type)) {
		return NextResponse.json(
			{ error: "Missing or invalid id/type" },
			{ status: 400 },
		);
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

	const res = await fetch(
		`${tmdbBaseUrl}/${type}/${id}/recommendations?language=en-US&page=1`,
		{
			headers: {
				Authorization: `Bearer ${tmdbToken}`,
				Accept: "application/json",
			},
			next: { revalidate: 60 * 60 },
		},
	);

	if (!res.ok) {
		return NextResponse.json(
			{ error: "Failed to fetch TMDB recommendations" },
			{ status: res.status },
		);
	}

	const data: unknown = await res.json();
	const parsed = parseRecommendationsResponse(data, type);

	return NextResponse.json(parsed.results);
}
