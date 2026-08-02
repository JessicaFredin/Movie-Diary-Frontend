export type DiaryEntry = {
	id: number; // TMDB id
	type: "movie" | "tv";
	title: string;
	poster: string;
	backdrop?: string;

	status: "watching" | "completed" | "planned";

	// TV only
	progress?: {
		currentSeason: number;
		currentEpisode: number;
		totalSeasons: number;
		totalEpisodes: number;
		percentage: number;
	};

	// Movie only
	watched?: boolean;

	rating?: number | null;
	review?: string | null;

	updatedAt: string;

	genre?: string;
	service?: string;

	genreIds?: number[];
	genreNames?: string[];

	genres?: Array<{ id?: number; name?: string } | string>;
};
