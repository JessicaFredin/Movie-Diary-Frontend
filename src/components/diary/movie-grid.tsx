import MovieCard from "../home/movie-card";
import { DiaryEntry } from "@/types/diary";

export default function MovieGrid({ items }: { items: DiaryEntry[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
			{items.map((entry) => (
				<MovieCard
					key={`${entry.type}-${entry.id}`}
					variant="logged"
					id={entry.id}
					title={entry.title}
					posterPath={entry.poster}
					type={entry.type}
					lastLogged={entry.updatedAt}
					status={entry.status}
					progress={entry.progress}
				/>
			))}
		</div>
	);
}
