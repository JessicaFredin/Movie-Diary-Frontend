"use client";

import { Genre } from "@/types/genre";

interface Props {
	genres?: Genre[];
}

export default function MediaGenres({ genres = [] }: Props) {
	if (!genres.length) return null;

	return (
		<div className="flex flex-wrap gap-2 text-xs md:text-sm">
			{genres.map((genre) => (
				<span
					key={genre.id}
					className="bg-gray-800 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-gray-300"
				>
					{genre.name}
				</span>
			))}
		</div>
	);
}
