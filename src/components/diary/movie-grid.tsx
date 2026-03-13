import MovieCard from "../home/movie-card";
import { DiaryEntry } from "@/types/diary";

type Props = {
	items: DiaryEntry[];
	onEdit: (entry: DiaryEntry) => void;
	onDelete: (entry: DiaryEntry) => void;
};

export default function MovieGrid({ items, onEdit, onDelete }: Props) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
			{items.map((entry) => (
				<MovieCard
					key={`${entry.type}-${entry.id}`}
					variant="logged"
					id={entry.id}
					title={entry.title}
					posterPath={entry.poster}
					backdropPath={entry.backdrop ?? entry.poster}
					type={entry.type}
					lastLogged={entry.updatedAt}
					status={entry.status}
					progress={entry.progress}
					onEdit={() => onEdit(entry)}
					onDelete={() => onDelete(entry)}
				/>
			))}
		</div>
	);
}
