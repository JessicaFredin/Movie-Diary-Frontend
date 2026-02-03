// // "use client";

// // import Image from "next/image";
// // import { Icon } from "@iconify/react";
// // import { useRouter } from "next/navigation";
// // import { getPosterUrl } from "@/utils/tmdb-image";
// // import { progress } from "framer-motion/m";

// // type MovieCardProps = {
// // 	id: number;
// // 	title: string;
// // 	posterPath: string | null;
// // 	rating?: number;
// // 	type: "movie" | "tv";
// // 	onAdd?: (id: number, type: "movie" | "tv") => void;
// // 	variant?: "home" | "diary" | "logged";

// // 	// diary-only
// // 	addedAt?: string;
// // 	lastLogged?: string;
// // 	progress?: {
// // 		season: number;
// // 		episode: number;
// // 		// episodeTitle?: string;
// // 	};

// // 	status?: "watching" | "completed" | "planned";

// // 	progressInfo?: {
// // 		progress: number;
// // 		percentage: number;
// // 		isFinished: boolean;
// // 	};

// // };

// // export default function MovieCard({
// // 	id,
// // 	title,
// // 	posterPath,
// // 	rating,
// // 	type,
// // 	onAdd,
// // 	variant = "home",
// // 	addedAt,
// // 	lastLogged,
// // 	progress,
// // }: MovieCardProps) {
// // 	const router = useRouter();

// // 	const isHome = variant === "home";
// // 	const isDiary = variant === "diary";
// // 	const isLogged = variant === "logged";

// // 	const isFinished =
// // 		isLogged && type === "tv" && progress && progress.episode >= 999; // or your own completion logic

// // 	const handleNavigate = () => {
// // 		router.push(`/${type}/${id}`);
// // 	};

// // 	return (
// // 		<div
// // 			onClick={handleNavigate}
// // 			role="button"
// // 			tabIndex={0}
// // 			onKeyDown={(e) => {
// // 				if (e.key === "Enter") handleNavigate();
// // 			}}
// // 			className={`relative cursor-pointer transition-transform hover:scale-105 focus:outline-none
// // 				${isHome ? "w-[160px] md:w-[200px] flex-shrink-0" : ""}`}
// // 		>
// // 			{/* Poster */}
// // 			<Image
// // 				src={getPosterUrl(posterPath)}
// // 				alt={title}
// // 				// width={200}
// // 				// height={300}
// // 				width={isHome ? 200 : 180}
// // 				height={isHome ? 300 : 260}
// // 				className="rounded-xl shadow-xl object-cover w-full h-auto"
// // 			/>

// // 			{/* {isLogged && type === "tv" && typeof progress === "number" && (
// // 				<div className="absolute top-2 left-2 bg-black/70 text-white text-[11px] px-2 py-1 rounded-md shadow-md">
// // 					{progress >= 1
// // 						? "Finished ✅"
// // 						: `${Math.round(progress * 100)}% Watched`}
// // 				</div>
// // 			)} */}

// // 			{/* {isLogged && type === "tv" && progress && (
// // 				<div className="absolute top-2 left-2 bg-black/70 text-white text-[11px] px-2 py-1 rounded-md shadow-md">
// // 					{isFinished ? "Finished ✅" : "Watching"}
// // 				</div>
// // 			)} */}

// // 			{isLogged && type === "tv" && progress && (
// // 				<div className="absolute top-2 left-2 bg-black/70 text-white text-[11px] px-2 py-1 rounded-md shadow-md">
// // 					{variant === "logged" && (
// // 						<>
// // 							{progress.episode >= 1 ? "Watching" : ""}
// // 							{progress.episode >= 999 ? "Finished ✅" : ""}
// // 						</>
// // 					)}
// // 				</div>
// // 			)}

// // 			{/* Hover Overlay */}
// // 			<div
// // 				className={`absolute inset-0 rounded-xl bg-gradient-to-t from-black/80 via-black/20 to-transparent
// // opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col p-3
// // ${isHome ? "justify-between" : "justify-end"}`}
// // 			>
// // 				{/* TOP ROW — HOME ONLY */}
// // 				{isHome && (
// // 					<div className="flex justify-between items-start">
// // 						{typeof rating === "number" && (
// // 							<span className="text-yellow-400 text-xs font-medium bg-black/60 px-2 py-0.5 rounded-md">
// // 								★ {rating.toFixed(1)}
// // 							</span>
// // 						)}

// // 						{onAdd && (
// // 							<button
// // 								onClick={(e) => {
// // 									e.stopPropagation();
// // 									onAdd(id, type);
// // 								}}
// // 								className="p-1.5 rounded-full bg-[#FF414E] text-white hover:bg-[#e63946] transition-all"
// // 								title="Add to Diary"
// // 								aria-label="Add to diary"
// // 							>
// // 								<Icon
// // 									icon="material-symbols:add-2-rounded"
// // 									className="w-5 h-5"
// // 								/>
// // 							</button>
// // 						)}
// // 					</div>
// // 				)}

// // 				{/* BOTTOM ROW */}
// // 				{/* <div className="flex flex-col gap-0.5">
// // 					<h3 className="text-white font-semibold text-sm md:text-base truncate">
// // 						{title}
// // 					</h3>

// // 					<p className="text-xs text-gray-300">
// // 						{type === "movie" ? "Movie" : "TV Show"}
// // 					</p>
// // 				</div> */}

// // 				{/* BOTTOM ROW */}
// // 				<div className="flex flex-col gap-0.5">
// // 					<h3 className="text-white font-semibold text-sm md:text-base truncate">
// // 						{title}
// // 					</h3>

// // 					{/* TYPE — always visible */}
// // 					<p className="text-xs text-gray-300">
// // 						{type === "movie" ? "Movie" : "TV Show"}
// // 					</p>

// // 					{/* MOVIE — diary/logged info */}
// // 					{isLogged && type === "movie" && addedAt && (
// // 						<p className="text-[11px] text-gray-400">
// // 							Logged {addedAt}
// // 						</p>
// // 					)}

// // 					{/* TV — episode info */}
// // 					{isLogged && type === "tv" && progress && (
// // 						<>
// // 							<span className="mt-1 inline-block text-xs font-medium text-white bg-red-500/80 px-2 py-0.5 rounded-md w-fit">
// // 								S{progress.season} • E{progress.episode}
// // 							</span>

// // 							{progress.episodeTitle && (
// // 								<p className="text-xs text-gray-300 truncate">
// // 									{progress.episodeTitle}
// // 								</p>
// // 							)}

// // 							{lastLogged && (
// // 								<p className="text-[11px] text-gray-400">
// // 									Last logged: {lastLogged}
// // 								</p>
// // 							)}
// // 						</>
// // 					)}

// // 				</div>
// // 			</div>
// // 		</div>
// // 	);
// // }

// "use client";

// import Image from "next/image";
// import { Icon } from "@iconify/react";
// import { useRouter } from "next/navigation";
// import { getPosterUrl } from "@/utils/tmdb-image";
// import formatDate from "@/utils/format-date";
// import { isInDiary } from "@/utils/is-in-diary";
// import { useEffect, useState } from "react";
// import AddToDiaryButton from "../diary/add-to-diary-button";

// type MovieCardProps = {
// 	id: number;
// 	title: string;
// 	posterPath: string | null;
// 	backdropPath: string | null;
// 	rating?: number;
// 	type: "movie" | "tv";
// 	// onAdd?: (id: number, type: "movie" | "tv") => void;

// 	onAdd?: (content: {
// 		id: number;
// 		type: "movie" | "tv";
// 		title: string;
// 		poster: string;
// 		backdrop: string;
// 	}) => void;

// 	variant?: "home" | "diary" | "logged";

// 	progress?: {
// 		currentSeason: number;
// 		currentEpisode: number;
// 		totalSeasons: number;
// 		totalEpisodes: number;
// 		percentage: number;
// 	};

// 	lastLogged?: string;
// 	status?: "watching" | "completed" | "planned";
// };

// export default function MovieCard({
// 	id,
// 	title,
// 	posterPath,
// 	backdropPath,
// 	rating,
// 	type,
// 	onAdd,
// 	variant = "home",
// 	progress,
// 	lastLogged,
// 	// status,
// }: MovieCardProps) {
// 	const router = useRouter();
// 	const isHome = variant === "home";
// 	const isLogged = variant === "logged";
// 	// const alreadyAdded = isInDiary(id, type);
// 	const [alreadyAdded, setAlreadyAdded] = useState(false);

// 	useEffect(() => {
// 		setAlreadyAdded(isInDiary(id, type));
// 	}, [id, type]);

// 	const handleNavigate = () => {
// 		router.push(`/${type}/${id}`);
// 	};

// 	return (
// 		<div
// 			onClick={handleNavigate}
// 			role="button"
// 			tabIndex={0}
// 			className={`relative cursor-pointer transition-transform hover:scale-105 focus:outline-none
// 				${isHome ? "w-[160px] md:w-[200px] flex-shrink-0" : ""}`}
// 		>
// 			<Image
// 				src={getPosterUrl(posterPath)}
// 				alt={title}
// 				width={isHome ? 200 : 180}
// 				height={isHome ? 300 : 260}
// 				className="rounded-xl shadow-xl object-cover w-full h-auto"
// 			/>

// 			{variant === "logged" && progress && (
// 				<div className="absolute top-2 left-2 bg-black/70 text-white text-[11px] px-2 py-1 rounded-md shadow-md">
// 					{progress?.percentage == 100
// 						? "Finished ✅"
// 						: `${progress.percentage}% Watched`}
// 				</div>
// 			)}

// 			{/* Hover Overlay */}
// 			<div
// 				className={`absolute inset-0 rounded-xl bg-gradient-to-t from-black/80 via-black/20 to-transparent
// 				opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col p-3
// 				${isHome ? "justify-between" : "justify-end"}`}
// 			>
// 				{isHome && (
// 					<div className="flex justify-between items-start">
// 						{typeof rating === "number" && (
// 							<span className="text-yellow-400 text-xs font-medium bg-black/60 px-2 py-0.5 rounded-md">
// 								★ {rating.toFixed(1)}
// 							</span>
// 						)}

// 						{/* {onAdd && (
// 							<button
// 								onClick={(e) => {
// 									e.stopPropagation();
// 									onAdd(id, type);
// 								}}
// 								className="p-1.5 rounded-full bg-[#FF414E] text-white hover:bg-[#e63946]"
// 							>
// 								<Icon icon="material-symbols:add-2-rounded" />
// 							</button>
// 						)} */}

// 						{/* {onAdd && !alreadyAdded && (
// 							<button
// 								onClick={(e) => {
// 									e.stopPropagation();
// 									onAdd(id, type);
// 								}}
// 								className="p-1.5 rounded-full bg-[#FF414E] text-white hover:bg-[#e63946] transition"
// 								title="Add to diary"
// 							>
// 								<Icon
// 									icon="material-symbols:add-2-rounded"
// 									className="w-5 h-5"
// 								/>
// 							</button>
// 						)} */}

// 						{onAdd && (
// 							// <button
// 							// 	onClick={(e) => {
// 							// 		e.stopPropagation();
// 							// 		if (!alreadyAdded) {
// 							// 			onAdd(id, type);
// 							// 		}
// 							// 	}}
// 							// 	disabled={alreadyAdded}
// 							// 	title={
// 							// 		alreadyAdded
// 							// 			? "Already in diary"
// 							// 			: "Add to diary"
// 							// 	}
// 							// 	className={`p-1.5 rounded-full text-white transition
// 							// 		${
// 							// 			alreadyAdded
// 							// 				? "bg-green-600 cursor-default"
// 							// 				: "bg-[#FF414E] hover:bg-[#e63946]"
// 							// 		}
// 							// 	`}
// 							// 					>
// 							// 	<Icon
// 							// 		icon={
// 							// 			alreadyAdded
// 							// 				? "material-symbols:check-rounded"
// 							// 				: "material-symbols:add-2-rounded"
// 							// 		}
// 							// 		className="w-5 h-5"
// 							// 	/>
// 							// </button>

// 							// <AddToDiaryButton
// 							// 	onClick={() => onAdd(id, type)}
// 							// 	isAdded={alreadyAdded}
// 							// 	variant="card"
// 							// />

// 							<AddToDiaryButton
// 								variant="card"
// 								isAdded={alreadyAdded}
// 								onClick={() => {
// 									if (!posterPath || !backdropPath) return;

// 									onAdd?.({
// 										id,
// 										type,
// 										title,
// 										poster: posterPath,
// 										backdrop: backdropPath,
// 									});
// 								}}
// 							/>
// 						)}
// 					</div>
// 				)}

// 				{/* Bottom */}
// 				<div className="flex flex-col gap-0.5">
// 					<h3 className="text-white font-semibold text-sm md:text-base truncate">
// 						{title}
// 					</h3>

// 					<p className="text-xs text-gray-300">
// 						{type === "movie" ? "Movie" : "TV Show"}
// 					</p>

// 					{isLogged && type === "tv" && progress && (
// 						<span className="mt-1 inline-block text-xs font-medium text-white bg-red-500/80 px-2 py-0.5 rounded-md w-fit">
// 							S{progress.currentSeason} • E
// 							{progress.currentEpisode}
// 						</span>
// 					)}

// 					{isLogged && lastLogged && (
// 						<p className="text-[11px] text-gray-400">
// 							Last logged: {formatDate(lastLogged)}
// 						</p>
// 					)}
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPosterUrl } from "@/utils/tmdb-image";
import formatDate from "@/utils/format-date";
import { isInDiary } from "@/utils/is-in-diary";
import AddToDiaryButton from "../diary/add-to-diary-button";

type AddPayload = {
	id: number;
	type: "movie" | "tv";
	title: string;
	poster: string;
	backdrop: string;
};

type MovieCardProps = {
	id: number;
	title: string;
	posterPath: string | null;
	backdropPath: string | null;
	rating?: number;
	type: "movie" | "tv";
	variant?: "home" | "diary" | "logged";
	progress?: {
		currentSeason: number;
		currentEpisode: number;
		totalSeasons: number;
		totalEpisodes: number;
		percentage: number;
	};
	lastLogged?: string;
	status?: "watching" | "completed" | "planned";
	onAdd?: (payload: AddPayload) => void;
};

export default function MovieCard({
	id,
	title,
	posterPath,
	backdropPath,
	rating,
	type,
	onAdd,
	variant = "home",
	progress,
	lastLogged,
}: MovieCardProps) {
	const router = useRouter();
	const isHome = variant === "home";
	const isLogged = variant === "logged";

	const [alreadyAdded, setAlreadyAdded] = useState(false);

	useEffect(() => {
		setAlreadyAdded(isInDiary(id, type));
	}, [id, type]);

	const handleNavigate = () => {
		router.push(`/${type}/${id}`);
	};

	return (
		<div
			onClick={handleNavigate}
			role="button"
			tabIndex={0}
			className={`relative cursor-pointer transition-transform hover:scale-105 focus:outline-none
				${isHome ? "w-[160px] md:w-[200px] flex-shrink-0" : ""}`}
		>
			<Image
				src={getPosterUrl(posterPath)}
				alt={title}
				width={isHome ? 200 : 180}
				height={isHome ? 300 : 260}
				className="rounded-xl shadow-xl object-cover w-full h-auto"
			/>

			{variant === "logged" && progress && (
				<div className="absolute top-2 left-2 bg-black/70 text-white text-[11px] px-2 py-1 rounded-md shadow-md">
					{progress?.percentage == 100
						? "Finished ✅"
						: `${progress.percentage}% Watched`}
				</div>
			)}

			{/* Hover Overlay */}
			<div
				className={`absolute inset-0 rounded-xl bg-gradient-to-t from-black/80 via-black/20 to-transparent
				opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col p-3
				${isHome ? "justify-between" : "justify-end"}`}
			>
				{isHome && (
					<div className="flex justify-between items-start">
						{typeof rating === "number" && (
							<span className="text-yellow-400 text-xs font-medium bg-black/60 px-2 py-0.5 rounded-md">
								★ {rating.toFixed(1)}
							</span>
						)}

						{onAdd && (
							<AddToDiaryButton
								variant="card"
								isAdded={alreadyAdded}
								onClick={() => {
									if (!posterPath || !backdropPath) return;

									onAdd({
										id,
										type,
										title,
										poster: posterPath,
										backdrop: backdropPath,
									});
								}}
							/>
						)}
					</div>
				)}
				{/* Bottom */}
				<div className="flex flex-col gap-0.5">
					<h3 className="text-white font-semibold text-sm md:text-base truncate">
						{title}
					</h3>
					<p className="text-xs text-gray-300">
						{type === "movie" ? "Movie" : "TV Show"}
					</p>

					{isLogged && type === "tv" && progress && (
						<span className="mt-1 inline-block text-xs font-medium text-white bg-red-500/80 px-2 py-0.5 rounded-md w-fit">
							S{progress.currentSeason} • E
							{progress.currentEpisode}
						</span>
					)}

					{isLogged && lastLogged && (
						<p className="text-[11px] text-gray-400">
							Last logged: {formatDate(lastLogged)}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
