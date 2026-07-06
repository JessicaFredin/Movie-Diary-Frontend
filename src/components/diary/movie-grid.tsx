// import MovieCard from "../home/movie-card";
// import { DiaryEntry } from "@/types/diary";

// type Props = {
// 	items: DiaryEntry[];
// 	onEdit?: (entry: DiaryEntry) => void;
// 	onDelete?: (entry: DiaryEntry) => void;
// 	onAdd?: (entry: DiaryEntry) => void;
// };

// export default function MovieGrid({ items, onEdit, onDelete, onAdd }: Props) {
// 	return (
// 		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
// 			{items.map((entry) => (
// 				<MovieCard
// 					key={`${entry.type}-${entry.id}`}
// 					// variant="logged"
// 					variant={onEdit ? "logged" : "watchlist"}
// 					id={entry.id}
// 					title={entry.title}
// 					posterPath={entry.poster}
// 					backdropPath={entry.backdrop ?? entry.poster}
// 					type={entry.type}
// 					lastLogged={entry.updatedAt}
// 					status={entry.status}
// 					progress={entry.progress}
// 					onEdit={() => onEdit?.(entry)}
// 					onDelete={() => onDelete?.(entry)}
// 					onAdd={() => onAdd?.(entry)}
// 				/>
// 			))}
// 		</div>
// 	);
// }

import MediaCard from "@/components/media/media-card";
import type { DiaryEntry } from "@/types/diary";

type Props = {
	items: DiaryEntry[];
	onDiaryChanged?: () => void | Promise<void>;
};

export default function MovieGrid({ items, onDiaryChanged }: Props) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
			{items.map((entry) => (
				<MediaCard
					key={`${entry.type}-${entry.id}`}
					id={entry.id}
					type={entry.type}
					title={entry.title}
					posterPath={entry.poster}
					backdropPath={entry.backdrop ?? entry.poster}
					rating={entry.rating}
					variant="default"
					showDeleteButton
					initialDiaryEntry={entry}
					onDiaryChanged={onDiaryChanged}
				/>
			))}
		</div>
	);
}