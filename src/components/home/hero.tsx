"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import ExpandableText from "@/components/details/expandable-text";
import type { Genre } from "@/types/genre";
import { GENRE_MAP } from "@/constants/genres";
import AddToDiaryModal from "../diary/add-to-diary-modal";
import { useState } from "react";

type Props = {
	id: number;
	type: "movie" | "tv";
	title: string;
	description?: string | null;
	backdropPath: string;
	posterPath: string;
	year?: string;
	rating?: number;
	genres?: Genre[];
	genre_ids?: number[];
};

export default function Hero({
	id,
	type,
	title,
	description,
	backdropPath,
	posterPath,
	year,
	rating,
	genres = [],
	genre_ids = [],
}: Props) {
	const router = useRouter();
	const [isDiaryOpen, setIsDiaryOpen] = useState(false);

	return (
		<section className="relative h-[60vh] w-full overflow-hidden md:h-[70vh]">
			<Image
				src={backdropPath}
				alt={title}
				fill
				priority
				className="absolute inset-0 h-full w-full object-cover object-top"
			/>

			{/* Dark left glass panel */}
			<div className="hidden md:block absolute inset-y-0 left-0 z-10 w-[34%] bg-black/55 backdrop-blur-[28px]" />

			{/* Extra dark fade so white text is always readable */}
			<div className="absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/35 to-black/5" />
			<div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

			{/* Text content */}
			<div className="absolute z-20 flex h-full w-full flex-col justify-center px-5 text-white md:w-[34%] md:items-start md:px-12">
				<div className="max-w-full">
					<div className="mb-3 flex max-w-full items-center gap-3">
						{typeof rating === "number" && (
							<span className="shrink-0 text-sm font-semibold text-warning">
								★ {rating.toFixed(1)}
							</span>
						)}

						<h1 className="truncate text-2xl font-bold leading-tight text-white sm:text-3xl md:text-5xl">
							{title}
						</h1>

						{year && (
							<span className="shrink-0 text-sm text-gray-300">
								({year})
							</span>
						)}
					</div>

					<div className="max-w-full text-sm leading-6 text-gray-100 md:text-base">
						<ExpandableText text={description ?? ""} />
					</div>

					{genre_ids.length > 0 && (
						<div className="mt-4 flex max-w-full flex-wrap gap-2">
							{genre_ids.map((genreId) => {
								const genreName = GENRE_MAP[genreId];

								if (!genreName) return null;

								return (
									<span
										key={genreId}
										className="rounded-full border border-accent/70  bg-white/10 px-3 py-1 text-xs text-white shadow-sm backdrop-blur-md"
									>
										{genreName}
									</span>
								);
							})}
						</div>
					)}

					<div className="mt-6 flex items-center gap-3">
						<button
							type="button"
							onClick={() => router.push(`/${type}/${id}`)}
							className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
						>
							More Info
						</button>

						<button
							type="button"
							onClick={() => setIsDiaryOpen(true)}
							className="group/add-diary relative flex h-10 w-10 items-center justify-center rounded-full border border-white/70 text-white transition hover:bg-white"
							aria-label="Add to diary"
						>
							<Icon
								icon="material-symbols:add-2-rounded"
								className="h-6 w-6 transition group-hover/add-diary:text-black"
							/>

							<span className="absolute left-full ml-2 hidden whitespace-nowrap rounded-full bg-black/80 px-3 py-1 text-xs text-white opacity-0 transition-opacity group-hover/add-diary:opacity-100 md:block">
								Add to Diary
							</span>
						</button>
					</div>
				</div>
			</div>

			<AddToDiaryModal
				open={isDiaryOpen}
				onClose={() => setIsDiaryOpen(false)}
				content={{
					id,
					type,
					title,
					poster: posterPath,
					backdrop: backdropPath,
				}}
			/>
		</section>
	);
}
