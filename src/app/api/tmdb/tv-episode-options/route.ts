import { NextRequest, NextResponse } from "next/server";

type TmdbSeason = {
	season_number: number;
	name: string;
	episode_count: number;
};

type TmdbTvDetails = {
	seasons?: TmdbSeason[];
};

type TmdbEpisode = {
	episode_number: number;
	name: string;
};

type TmdbSeasonDetails = {
	episodes?: TmdbEpisode[];
};

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

function getTmdbAuth(): {
	accessToken: string | null;
	apiKey: string | null;
} {
	const rawApiKey =
		process.env.TMDB_API_KEY ??
		process.env.NEXT_PUBLIC_TMDB_API_KEY ??
		null;

	const accessToken =
		process.env.TMDB_ACCESS_TOKEN ??
		process.env.TMDB_READ_ACCESS_TOKEN ??
		process.env.TMDB_BEARER_TOKEN ??
		(rawApiKey?.startsWith("eyJ") ? rawApiKey : null);

	const apiKey = rawApiKey && !rawApiKey.startsWith("eyJ") ? rawApiKey : null;

	if (!accessToken && !apiKey) {
		throw new Error(
			"Missing TMDB credentials. Add TMDB_ACCESS_TOKEN or TMDB_API_KEY to .env.local.",
		);
	}

	return {
		accessToken,
		apiKey,
	};
}

function buildTmdbUrl(
	path: string,
	params: Record<string, string | number | undefined> = {},
): string {
	const { apiKey } = getTmdbAuth();
	const url = new URL(`${TMDB_BASE_URL}${path}`);

	if (apiKey) {
		url.searchParams.set("api_key", apiKey);
	}

	Object.entries(params).forEach(([key, value]) => {
		if (value === undefined) return;
		if (String(value).trim() === "") return;

		url.searchParams.set(key, String(value));
	});

	return url.toString();
}

async function tmdbFetch<T>(
	path: string,
	params: Record<string, string | number | undefined> = {},
): Promise<T> {
	const { accessToken } = getTmdbAuth();
	const url = buildTmdbUrl(path, params);

	const response = await fetch(url, {
		headers: {
			Accept: "application/json",
			...(accessToken
				? {
						Authorization: `Bearer ${accessToken}`,
					}
				: {}),
		},
		cache: "no-store",
	});

	if (!response.ok) {
		const text = await response.text();

		throw new Error(
			`TMDB request failed: ${response.status}. ${text.slice(0, 200)}`,
		);
	}

	return (await response.json()) as T;
}

export async function GET(request: NextRequest) {
	try {
		const tvId = request.nextUrl.searchParams.get("tvId");

		if (!tvId) {
			return NextResponse.json(
				{ error: "Missing tvId." },
				{ status: 400 },
			);
		}

		const tvDetails = await tmdbFetch<TmdbTvDetails>(`/tv/${tvId}`, {
			language: "en-US",
		});

		const seasons = (tvDetails.seasons ?? [])
			.filter((season) => season.season_number > 0)
			.filter((season) => season.episode_count > 0);

		const seasonsWithEpisodes = await Promise.all(
			seasons.map(async (season) => {
				const seasonDetails = await tmdbFetch<TmdbSeasonDetails>(
					`/tv/${tvId}/season/${season.season_number}`,
					{
						language: "en-US",
					},
				);

				return {
					seasonNumber: season.season_number,
					name: season.name || `Season ${season.season_number}`,
					episodeCount: season.episode_count,
					episodes: (seasonDetails.episodes ?? []).map((episode) => ({
						episodeNumber: episode.episode_number,
						name:
							episode.name?.trim() ||
							`Episode ${episode.episode_number}`,
					})),
				};
			}),
		);

		return NextResponse.json({
			seasons: seasonsWithEpisodes,
		});
	} catch (error) {
		console.error("TV episode options API error:", error);

		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Could not load episode options.",
			},
			{ status: 500 },
		);
	}
}
