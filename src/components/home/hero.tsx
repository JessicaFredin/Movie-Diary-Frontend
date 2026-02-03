// "use client";

// import Image from "next/image";
// import { Icon } from "@iconify/react";

// type Props = {
// 	id: number;
// 	type: "movie" | "tv";
// 	title: string;
// 	description: string;
// 	poster: string;
// 	year?: string;
// 	rating?: number;
// 	genres?: string[];
// };

// export default function Hero({
// 	id,
// 	type,
// 	title,
// 	description,
// 	poster,
// 	year,
// 	rating,
// 	genres = [],
// }: Props) {
// 	return (
// 		<section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
// 			{/* Background Image */}
// 			<Image
// 				src={poster}
// 				alt={title}
// 				fill
// 				priority
// 				className="absolute inset-0 w-full h-full object-cover object-top"
// 			/>

// 			{/* Blur Panel (only on md+ screens) */}
// 			<div className="hidden md:block absolute top-0 left-0 h-full w-[32%] bg-[#D9D9D9]/10 backdrop-blur-[30px] z-10"></div>

// 			{/* Gradient Overlay (only on mobile) */}
// 			<div className="block md:hidden absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>

// 			{/* Text Content */}
// 			<div className="absolute z-20 w-full md:w-[32%] px-4 md:px-6 text-white flex flex-col justify-center h-full items-center md:items-start text-center md:text-left">
// 				{/* Rating + Title + Year */}
// 				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-8 mb-2">
// 					{rating && (
// 						<span className="text-yellow-400 text-sm">
// 							★ {rating.toFixed(1)}
// 						</span>
// 					)}
// 					<h1 className="text-2xl sm:text-3xl md:text-5xl font-bold drop-shadow-[4px_4px_10px_rgba(0,0,0,0.3)]">
// 						{title}
// 					</h1>
// 					{year && (
// 						<span className="text-gray-300 text-sm">({year})</span>
// 					)}
// 				</div>

// 				{/* Description */}
// 				<p className="mt-2 md:mt-4 text-xs sm:text-sm md:text-base leading-relaxed text-white drop-shadow-[3px_3px_8px_rgba(0,0,0,0.4)] max-w-lg md:max-w-none">
// 					{description}
// 				</p>

// 				{/* Genres */}
// 				{genres.length > 0 && (
// 					<div className="mt-3 md:mt-4 flex flex-wrap justify-center md:justify-start gap-2">
// 						{genres.map((genre) => (
// 							<span
// 								key={genre}
// 								className="px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm text-white border border-[#FF414E] bg-white/10 backdrop-blur-sm"
// 							>
// 								{genre}
// 							</span>
// 						))}
// 					</div>
// 				)}

// 				{/* Buttons */}
// 				<div className="mt-4 md:mt-6 flex gap-3 md:gap-4 justify-center md:justify-start">
// 					<button className="px-4 sm:px-6 py-2 bg-[#FF414E] hover:bg-[#e63946] text-white font-semibold rounded-full cursor-pointer text-sm sm:text-base">
// 						More Info
// 					</button>
// 					<button className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-white text-white hover:bg-white transition-colors cursor-pointer group">
// 						<Icon
// 							icon="material-symbols:add-2-rounded"
// 							className="w-6 h-6 sm:w-7 sm:h-7 transition-colors group-hover:text-black"
// 						/>

// 						{/* Tooltip (desktop only) */}
// 						<span className="hidden md:block absolute left-full ml-2 px-3 py-1 text-xs text-white bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
// 							Add to Diary
// 						</span>
// 					</button>
// 				</div>
// 			</div>
// 		</section>
// 	);
// }

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
	console.log("Hero genres:", genres);
	const [isDiaryOpen, setIsDiaryOpen] = useState(false);

	return (
		<section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
			{/* Background Image */}
			<Image
				src={backdropPath}
				alt={title}
				fill
				priority
				className="absolute inset-0 w-full h-full object-cover object-top"
			/>

			{/* Blur Panel (desktop) */}
			<div className="hidden md:block absolute top-0 left-0 h-full w-[32%] bg-[#D9D9D9]/10 backdrop-blur-[30px] z-10" />

			{/* Mobile gradient */}
			<div className="block md:hidden absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

			{/* ===== TEXT CONTENT ===== */}
			<div className="absolute z-20 w-full md:w-[32%] px-4 md:px-6 text-white flex flex-col justify-center h-full items-center md:items-start text-center md:text-left overflow-hidden">
				{/* Rating + Title + Year */}
				<div className="flex items-center gap-2 md:gap-4 mb-2 flex-nowrap overflow-hidden max-w-full">
					{typeof rating === "number" && (
						<span className="text-yellow-400 text-sm whitespace-nowrap shrink-0">
							★ {rating.toFixed(1)}
						</span>
					)}

					<h1 className="text-2xl sm:text-3xl md:text-5xl font-bold truncate max-w-full">
						{title}
					</h1>

					{year && (
						<span className="text-gray-300 text-sm whitespace-nowrap shrink-0">
							({year})
						</span>
					)}
				</div>

				{/* Description (3 lines + see more) */}
				<div className="mt-2 md:mt-4 max-w-full">
					<ExpandableText text={description ?? ""} />
				</div>

				{/* Genres */}
				{genre_ids.length > 0 && (
					<div className="mt-3 md:mt-4 flex flex-wrap justify-center md:justify-start gap-2 max-w-full">
						{genre_ids.map((id) => (
							<span
								key={id}
								className="px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm text-white border border-[#FF414E] bg-white/10 backdrop-blur-sm whitespace-nowrap"
							>
								{GENRE_MAP[id]}
							</span>
						))}
					</div>
				)}

				{/* Buttons */}
				<div className="mt-4 md:mt-6 flex gap-3 md:gap-4 justify-center md:justify-start">
					<button
						onClick={() => router.push(`/${type}/${id}`)}
						className="px-4 sm:px-6 py-2 bg-[#FF414E] hover:bg-[#e63946] text-white font-semibold rounded-full cursor-pointer text-sm sm:text-base"
					>
						More Info
					</button>

					<button
						onClick={() => setIsDiaryOpen(true)}
						className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border border-white text-white hover:bg-white transition-colors cursor-pointer group"
					>
						<Icon
							icon="material-symbols:add-2-rounded"
							className="w-6 h-6 sm:w-7 sm:h-7 transition-colors group-hover:text-black"
						/>

						<span className="hidden md:block absolute left-full ml-2 px-3 py-1 text-xs text-white bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
							Add to Diary
						</span>
					</button>
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
