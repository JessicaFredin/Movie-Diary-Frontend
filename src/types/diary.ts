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

	updatedAt: string;
};
