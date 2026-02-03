import { Genre } from "./genre";

export interface Movie {
	id: number;
	media_type: "movie";
	title: string;
	poster_path: string | null;
	backdrop_path: string | null;
	vote_average: number;
	release_date: string;
	overview: string;
	runtime: number;
	genres?: Genre[];
	genre_ids?: number[];
}
