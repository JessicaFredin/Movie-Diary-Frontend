export interface Episode {
	id: number;
	name: string;
	overview: string;
	episode_number: number;
	season_number: number;
	air_date: string;
	still_path: string | null;
	vote_average: number;
}
