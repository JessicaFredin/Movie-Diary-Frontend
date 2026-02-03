type Props = {
	seasons: {
		season_number: number;
		episode_count: number;
	}[];
	season: number;
	episode: number;
	onSeasonChange: (v: number) => void;
	onEpisodeChange: (v: number) => void;
};

export default function TvProgressPicker({
	seasons,
	season,
	episode,
	onSeasonChange,
	onEpisodeChange,
}: Props) {
	const currentSeason = seasons.find((s) => s.season_number === season);

	return (
		<div className="flex gap-3">
			{/* Season */}
			<select
				value={season}
				onChange={(e) => {
					onSeasonChange(Number(e.target.value));
					onEpisodeChange(1); // reset episode on season change
				}}
				className="flex-1 rounded-lg bg-gray-900 px-3 py-2 text-sm"
			>
				{seasons.map((s) => (
					<option key={s.season_number} value={s.season_number}>
						Season {s.season_number}
					</option>
				))}
			</select>

			{/* Episode */}
			<select
				value={episode}
				onChange={(e) => onEpisodeChange(Number(e.target.value))}
				className="flex-1 rounded-lg bg-gray-900 px-3 py-2 text-sm"
			>
				{Array.from(
					{ length: currentSeason?.episode_count ?? 0 },
					(_, i) => i + 1,
				).map((ep) => (
					<option key={ep} value={ep}>
						Episode {ep}
					</option>
				))}
			</select>
		</div>
	);
}
