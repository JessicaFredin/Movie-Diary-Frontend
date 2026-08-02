// import MediaCard from "@/components/media/media-card";
// import type { DiaryEntry } from "@/types/diary";

// type Props = {
// 	items: DiaryEntry[];
// 	onDiaryChanged?: () => void | Promise<void>;
// };

// export default function MovieGrid({ items, onDiaryChanged }: Props) {
// 	return (
// 		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
// 			{items.map((entry) => (
// 				<MediaCard
// 					key={`${entry.type}-${entry.id}`}
// 					id={entry.id}
// 					type={entry.type}
// 					title={entry.title}
// 					posterPath={entry.poster}
// 					backdropPath={entry.backdrop ?? entry.poster}
// 					rating={entry.rating}
// 					variant="default"
// 					showDeleteButton
// 					initialDiaryEntry={entry}
// 					onDiaryChanged={onDiaryChanged}
// 				/>
// 			))}
// 		</div>
// 	);
// }

import MediaCard from "@/components/media/media-card";
import type { DiaryEntry } from "@/types/diary";

type Props = {
	items?: DiaryEntry[];
	onDiaryChanged?: () => void | Promise<void>;
};

export default function MovieGrid({ items = [], onDiaryChanged }: Props) {
	const safeItems = Array.isArray(items) ? items : [];

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
			{safeItems.map((entry) => (
				<MediaCard
					key={`${entry.type}-${entry.id}`}
					id={entry.id}
					type={entry.type}
					title={entry.title}
					posterPath={entry.poster}
					backdropPath={entry.backdrop ?? entry.poster}
					rating={entry.rating}
					ratingKind="user"
					initialDiaryEntry={entry}
					onDiaryChanged={onDiaryChanged}
					variant="default"
					showDeleteButton
				/>
			))}
		</div>
	);
}
