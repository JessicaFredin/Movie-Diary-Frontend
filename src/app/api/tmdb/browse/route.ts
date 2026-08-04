import { NextRequest, NextResponse } from "next/server";

type MediaType = "movie" | "tv";
type BrowseType = "all" | "movie" | "tv";
type BrowseSort =
	| "popular"
	| "top_rated"
	| "newest"
	| "oldest"
	| "most_rated"
	| "title_asc"
	| "title_desc";

type TmdbItem = {
	id: number;
	media_type?: MediaType;
	title?: string;
	name?: string;
	poster_path?: string | null;
	backdrop_path?: string | null;
	vote_average?: number | null;
	vote_count?: number | null;
	popularity?: number | null;
	release_date?: string;
	first_air_date?: string;
	genre_ids?: number[];
};

type TmdbResponse = {
	page: number;
	results: TmdbItem[];
	total_pages: number;
	total_results: number;
};

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const movieGenreMap: Record<string, number> = {
	Action: 28,
	Adventure: 12,
	Animation: 16,
	Comedy: 35,
	Crime: 80,
	Documentary: 99,
	Drama: 18,
	Family: 10751,
	Fantasy: 14,
	History: 36,
	Horror: 27,
	Music: 10402,
	Mystery: 9648,
	Romance: 10749,
	"Sci-Fi": 878,
	Thriller: 53,
	War: 10752,
	Western: 37,
};

const tvGenreMap: Record<string, number> = {
	Action: 10759,
	Adventure: 10759,
	Animation: 16,
	Comedy: 35,
	Crime: 80,
	Documentary: 99,
	Drama: 18,
	Family: 10751,
	Kids: 10762,
	Mystery: 9648,
	Reality: 10764,
	"Sci-Fi": 10765,
	Talk: 10767,
	War: 10768,
	Western: 37,
	Thriller: 9648,
	History: 10768,
};

function getTmdbAuth(): {
	accessToken: string | null;
	apiKey: string | null;
} {

	const rawApiKey = process.env.TMDB_API_KEY ?? null;
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
	params: Record<string, string | number | undefined>,
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

async function tmdbFetch(
	path: string,
	params: Record<string, string | number | undefined>,
): Promise<TmdbResponse> {
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

	return (await response.json()) as TmdbResponse;
}

function getMovieSort(sort: BrowseSort): string {
	if (sort === "top_rated") return "vote_average.desc";
	if (sort === "newest") return "primary_release_date.desc";
	if (sort === "oldest") return "primary_release_date.asc";
	if (sort === "most_rated") return "vote_count.desc";
	if (sort === "title_asc") return "title.asc";
	if (sort === "title_desc") return "title.desc";

	return "popularity.desc";
}

function getTvSort(sort: BrowseSort): string {
	if (sort === "top_rated") return "vote_average.desc";
	if (sort === "newest") return "first_air_date.desc";
	if (sort === "oldest") return "first_air_date.asc";
	if (sort === "most_rated") return "vote_count.desc";
	if (sort === "title_asc") return "name.asc";
	if (sort === "title_desc") return "name.desc";

	return "popularity.desc";
}

function getDateValue(item: TmdbItem): number {
	const date = item.release_date || item.first_air_date;

	if (!date) return 0;

	const time = new Date(date).getTime();

	return Number.isNaN(time) ? 0 : time;
}

function getTitleValue(item: TmdbItem): string {
	return (item.title || item.name || "").toLowerCase();
}

function sortItems(items: TmdbItem[], sort: BrowseSort): TmdbItem[] {
	return [...items].sort((a, b) => {
		if (sort === "top_rated") {
			return (b.vote_average ?? 0) - (a.vote_average ?? 0);
		}

		if (sort === "newest") {
			return getDateValue(b) - getDateValue(a);
		}

		if (sort === "oldest") {
			return getDateValue(a) - getDateValue(b);
		}

		if (sort === "most_rated") {
			return (b.vote_count ?? 0) - (a.vote_count ?? 0);
		}

		if (sort === "title_asc") {
			return getTitleValue(a).localeCompare(getTitleValue(b));
		}

		if (sort === "title_desc") {
			return getTitleValue(b).localeCompare(getTitleValue(a));
		}

		return (b.popularity ?? 0) - (a.popularity ?? 0);
	});
}

function dedupe(items: TmdbItem[]): TmdbItem[] {
	const map = new Map<string, TmdbItem>();

	items.forEach((item) => {
		if (!item.id || !item.media_type) return;
		map.set(`${item.media_type}-${item.id}`, item);
	});

	return Array.from(map.values());
}

function normalizeGenre(value: string): string {
	return value.trim().toLowerCase();
}

function getGenreIds(genreValues: string[], mediaType: MediaType): number[] {
	const genreMap = mediaType === "movie" ? movieGenreMap : tvGenreMap;

	const normalizedGenreMap = new Map<string, number>();

	Object.entries(genreMap).forEach(([name, id]) => {
		normalizedGenreMap.set(normalizeGenre(name), id);
	});

	return genreValues
		.map((genre) => {
			const trimmedGenre = genre.trim();
			const numericGenre = Number(trimmedGenre);

			if (!Number.isNaN(numericGenre)) {
				return numericGenre;
			}

			return normalizedGenreMap.get(normalizeGenre(trimmedGenre));
		})
		.filter((id): id is number => typeof id === "number");
}

function filterSearchResults(
	items: TmdbItem[],
	type: BrowseType,
	minRating: number,
	genreValues: string[],
): TmdbItem[] {
	return items.filter((item) => {
		if (item.media_type !== "movie" && item.media_type !== "tv") {
			return false;
		}

		if (type !== "all" && item.media_type !== type) {
			return false;
		}

		if (!item.poster_path) {
			return false;
		}

		if ((item.vote_average ?? 0) < minRating) {
			return false;
		}

		if (genreValues.length === 0) {
			return true;
		}

		const selectedIds = getGenreIds(genreValues, item.media_type);

		if (selectedIds.length === 0) {
			return true;
		}

		const itemGenreIds = item.genre_ids ?? [];

		return selectedIds.some((id) => itemGenreIds.includes(id));
	});
}

function getBrowseType(value: string | null): BrowseType {
	if (value === "movie" || value === "tv") return value;

	return "all";
}

function getBrowseSort(value: string | null): BrowseSort {
	if (
		value === "popular" ||
		value === "top_rated" ||
		value === "newest" ||
		value === "oldest" ||
		value === "most_rated" ||
		value === "title_asc" ||
		value === "title_desc"
	) {
		return value;
	}

	return "popular";
}

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;

		const page = Number(searchParams.get("page") ?? "1");
		const query = searchParams.get("query")?.trim() ?? "";
		const type = getBrowseType(searchParams.get("type"));
		const sort = getBrowseSort(searchParams.get("sort"));
		const minRating = Number(searchParams.get("minRating") ?? "0");

		const genres =
			searchParams
				.get("genres")
				?.split(",")
				.map((genre) => genre.trim())
				.filter(Boolean) ?? [];

		if (query) {
			const searchData = await tmdbFetch("/search/multi", {
				query,
				page,
				include_adult: "false",
				language: "en-US",
			});

			const filtered = filterSearchResults(
				searchData.results,
				type,
				minRating,
				genres,
			);

			return NextResponse.json({
				page: searchData.page,
				results: sortItems(dedupe(filtered), sort),
				total_pages: searchData.total_pages,
				total_results: searchData.total_results,
			});
		}

		const voteCountMinimum = sort === "top_rated" ? 50 : 0;

		if (type === "movie") {
			const movieGenreIds = getGenreIds(genres, "movie");

			const data = await tmdbFetch("/discover/movie", {
				page,
				include_adult: "false",
				include_video: "false",
				language: "en-US",
				sort_by: getMovieSort(sort),
				"vote_average.gte": minRating,
				"vote_count.gte": voteCountMinimum,
				with_genres: movieGenreIds.join(","),
			});

			return NextResponse.json({
				...data,
				results: data.results
					.filter((item) => Boolean(item.poster_path))
					.map((item) => ({
						...item,
						media_type: "movie" as const,
					})),
			});
		}

		if (type === "tv") {
			const tvGenreIds = getGenreIds(genres, "tv");

			const data = await tmdbFetch("/discover/tv", {
				page,
				include_adult: "false",
				language: "en-US",
				sort_by: getTvSort(sort),
				"vote_average.gte": minRating,
				"vote_count.gte": voteCountMinimum,
				with_genres: tvGenreIds.join(","),
			});

			return NextResponse.json({
				...data,
				results: data.results
					.filter((item) => Boolean(item.poster_path))
					.map((item) => ({
						...item,
						media_type: "tv" as const,
					})),
			});
		}

		const [movieData, tvData] = await Promise.all([
			tmdbFetch("/discover/movie", {
				page,
				include_adult: "false",
				include_video: "false",
				language: "en-US",
				sort_by: getMovieSort(sort),
				"vote_average.gte": minRating,
				"vote_count.gte": voteCountMinimum,
				with_genres: getGenreIds(genres, "movie").join(","),
			}),
			tmdbFetch("/discover/tv", {
				page,
				include_adult: "false",
				language: "en-US",
				sort_by: getTvSort(sort),
				"vote_average.gte": minRating,
				"vote_count.gte": voteCountMinimum,
				with_genres: getGenreIds(genres, "tv").join(","),
			}),
		]);

		const combined = dedupe([
			...movieData.results.map((item) => ({
				...item,
				media_type: "movie" as const,
			})),
			...tvData.results.map((item) => ({
				...item,
				media_type: "tv" as const,
			})),
		]).filter((item) => Boolean(item.poster_path));

		return NextResponse.json({
			page,
			results: sortItems(combined, sort),
			total_pages: Math.max(movieData.total_pages, tvData.total_pages),
			total_results: movieData.total_results + tvData.total_results,
		});
	} catch (error) {
		console.error("Browse API error:", error);

		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Could not load browse results.",
			},
			{ status: 500 },
		);
	}
}
