export function calculateTvProgress(
	seasons: { season_number: number; episode_count: number }[],
	currentSeason: number,
	currentEpisode: number,
) {
	const totalSeasons = seasons.length;
	let totalEpisodes = 0;
	let watchedEpisodes = 0;

	for (const season of seasons) {
		totalEpisodes += season.episode_count;

		if (season.season_number < currentSeason) {
			watchedEpisodes += season.episode_count;
		} else if (season.season_number === currentSeason) {
			watchedEpisodes += currentEpisode;
		}
	}

	const percentage = Math.min(
		Math.round((watchedEpisodes / totalEpisodes) * 100),
		100,
	);

	return {
		currentSeason,
		currentEpisode,
		totalSeasons,
		totalEpisodes,
		percentage,
	};
}
