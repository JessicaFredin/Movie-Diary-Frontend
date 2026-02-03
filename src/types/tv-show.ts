import { Genre } from "./genre";

export interface TvShow {
	id: number;
	media_type: "tv";
	name: string;
	original_name: string;
	poster_path: string | null;
	backdrop_path: string | null;
	vote_average: number;
	first_air_date: string;
	overview: string;
	number_of_seasons: number;
	number_of_episodes: number;
	genres?: Genre[];
	genre_ids?: number[];
	seasons?: TvSeason[];
}

export interface TvSeason {
	id: number;
	season_number: number;
	episode_count: number;
	name: string;
}
