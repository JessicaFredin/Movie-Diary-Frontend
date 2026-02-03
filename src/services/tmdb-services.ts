import "server-only";

import axios, { AxiosResponse } from "axios";
import {
	Movie,
	TvShow,
	TMDBListResponse,
	Episode,
	Trailer,
	WatchProvider,
} from "@/types";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_API_BASE_URL;

if (!API_KEY) {
	throw new Error("TMDB API key is not defined in environment variables");
}

const tmdb = axios.create({
	baseURL: BASE_URL,
	headers: {
		Authorization: `Bearer ${API_KEY}`,
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	params: {
		language: "en-US",
	},
});

async function handleTmdbRequest<T>(
	request: Promise<AxiosResponse<T>>,
): Promise<T> {
	try {
		const response = await request;
		return response.data;
	} catch (error) {
		console.error("TMDB API error:", error);
		throw new Error("Failed to fetch data from TMDB");
	}
}

export function fetchTrending(
	mediaType: "movie" | "tv" | "all" = "all",
	timeWindow: "day" | "week" = "day",
	page = 1,
) {
	return handleTmdbRequest<TMDBListResponse<Movie | TvShow>>(
		tmdb.get(`/trending/${mediaType}/${timeWindow}`, { params: { page } }),
	);
}

export function fetchPopularMovies(page = 1) {
	return handleTmdbRequest<TMDBListResponse<Movie>>(
		tmdb.get("/movie/popular", { params: { page } }),
	);
}

export function fetchPopularTvShows(page = 1) {
	return handleTmdbRequest<TMDBListResponse<TvShow>>(
		tmdb.get("/tv/popular", { params: { page } }),
	);
}

export function fetchMovieDetails(movieId: number) {
	return handleTmdbRequest<Movie>(tmdb.get(`/movie/${movieId}`));
}

export function fetchTvShowDetails(tvShowId: number) {
	return handleTmdbRequest<TvShow>(tmdb.get(`/tv/${tvShowId}`));
}

export function fetchEpisodeDetails(
	tvShowId: number,
	season: number,
	episode: number,
) {
	return handleTmdbRequest<Episode>(
		tmdb.get(`/tv/${tvShowId}/season/${season}/episode/${episode}`),
	);
}

export async function fetchMovieTrailer(movieId: number) {
	const data = await handleTmdbRequest<{
		results: Trailer[];
	}>(tmdb.get(`/movie/${movieId}/videos`));

	return (
		data.results.find(
			(v) => v.site === "YouTube" && v.type === "Trailer" && v.official,
		) ??
		data.results.find(
			(v) => v.site === "YouTube" && v.type === "Trailer",
		) ??
		null
	);
}

export async function fetchTvShowTrailer(tvShowId: number) {
	const data = await handleTmdbRequest<{
		results: Trailer[];
	}>(tmdb.get(`/tv/${tvShowId}/videos`));

	return (
		data.results.find(
			(v) => v.site === "YouTube" && v.type === "Trailer" && v.official,
		) ??
		data.results.find(
			(v) => v.site === "YouTube" && v.type === "Trailer",
		) ??
		null
	);
}

export async function fetchMovieWatchProviders(
	movieId: number,
	countryCode: string = "US",
) {
	const data = await handleTmdbRequest<{
		results: Record<
			string,
			{
				flatrate?: WatchProvider[];
				rent?: WatchProvider[];
				buy?: WatchProvider[];
			}
		>;
	}>(tmdb.get(`/movie/${movieId}/watch/providers`));

	const country = data.results[countryCode];

	if (!country) return [];

	// Prefer flatrate (streaming)
	return country.flatrate ?? country.rent ?? country.buy ?? [];
}

export async function fetchTvShowWatchProviders(
	tvShowId: number,
	countryCode: string = "US",
) {
	const data = await handleTmdbRequest<{
		results: Record<
			string,
			{
				flatrate?: WatchProvider[];
				rent?: WatchProvider[];
				buy?: WatchProvider[];
			}
		>;
	}>(tmdb.get(`/tv/${tvShowId}/watch/providers`));

	const country = data.results[countryCode];

	if (!country) return [];

	// Prefer flatrate (streaming)
	return country.flatrate ?? country.rent ?? country.buy ?? [];
}


export function searchTmdb(query: string, page = 1) {
	return handleTmdbRequest<TMDBListResponse<Movie | TvShow>>(
		tmdb.get("/search/multi", {
			params: {
				query,
				page,
				include_adult: false,
			},
		}),
	);
}
