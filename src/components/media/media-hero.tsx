// // "use client";

// // import Image from "next/image";
// // import { Clock, Star, Calendar } from "lucide-react";
// // import ExpandableText from "@/components/details/expandable-text";
// // import MovieDiaryActions from "@/components/details/movie-diary-actions";
// // import { getPosterUrl } from "@/utils/tmdb-image";
// // import { Movie } from "@/types/movie";
// // import { TvShow } from "@/types/tv-show";

// // type Media = Movie | TvShow;

// // interface FriendActivity {
// // 	id: number;
// // 	name: string;
// // 	avatar: string;
// // }

// // interface MediaHeroProps {
// // 	media: Media;
// // 	friends?: FriendActivity[];
// // }

// // export default function MediaHero({ media, friends = [] }: MediaHeroProps) {;
// //     const isMovie = "title" in media;

// // 	const title = isMovie ? media.title : media.name;

// // 	const year =
// // 		isMovie && media.release_date
// // 			? new Date(media.release_date).getFullYear()
// // 			: !isMovie && media.first_air_date
// // 				? new Date(media.first_air_date).getFullYear()
// // 				: "—";

// // 	const runtimeLabel = isMovie
// // 		? media.runtime
// // 			? `${Math.floor(media.runtime / 60)}h ${media.runtime % 60}min`
// // 			: "—"
// // 		: media.number_of_seasons
// // 			? `${media.number_of_seasons} season${
// // 					media.number_of_seasons > 1 ? "s" : ""
// // 				}`
// // 			: "—";

// // 	const genres = media.genres ?? [];

// // 	return (
// // 		<div className="relative">
// // 			{/* Desktop backdrop */}
// // 			<div className="hidden md:block absolute inset-0 h-[500px]">
// // 				<Image
// // 					src={getPosterUrl(media.backdrop_path || media.poster_path)}
// // 					alt={title}
// // 					fill
// // 					className="object-cover opacity-40"
// // 					priority
// // 				/>
// // 				<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />
// // 			</div>

// // 			{/* Mobile banner */}
// // 			<div className="relative h-[70vh] md:hidden">
// // 				<Image
// // 					src={getPosterUrl(media.poster_path)}
// // 					alt={title}
// // 					fill
// // 					className="object-cover"
// // 				/>
// // 				<div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
// // 			</div>

// // 			{/* Content */}
// // 			<div className="relative px-6 md:px-24 md:pt-40 md:pb-16">
// // 				<div className="md:grid md:grid-cols-[300px_1fr] md:gap-14 items-start">
// // 					{/* Poster */}
// // 					<div className="hidden md:block">
// // 						<Image
// // 							src={getPosterUrl(media.poster_path)}
// // 							alt={title}
// // 							width={300}
// // 							height={450}
// // 							className="rounded-2xl shadow-2xl"
// // 							priority
// // 						/>
// // 					</div>

// // 					{/* Details */}
// // 					<div className="-mt-24 md:mt-0 flex flex-col gap-4 md:gap-6">
// // 						{/* Title + Friends */}
// // 						<div className="flex items-center gap-6 flex-wrap">
// // 							<h1 className="text-3xl md:text-5xl font-bold tracking-tight">
// // 								{title}
// // 							</h1>

// // 							{friends.length > 0 && (
// // 								<div className="flex items-center gap-3">
// // 									<div className="flex -space-x-3">
// // 										{friends.slice(0, 5).map((friend) => (
// // 											<div
// // 												key={friend.id}
// // 												className="w-8 h-8 rounded-full border-2 border-black overflow-hidden"
// // 											>
// // 												<img
// // 													src={friend.avatar}
// // 													alt={friend.name}
// // 													className="w-full h-full object-cover"
// // 												/>
// // 											</div>
// // 										))}
// // 									</div>

// // 									<p className="text-sm whitespace-nowrap">
// // 										<span className="font-medium text-white">
// // 											{friends.length} friends
// // 										</span>{" "}
// // 										<span className="text-gray-400">
// // 											have watched this
// // 										</span>
// // 									</p>
// // 								</div>
// // 							)}
// // 						</div>

// // 						{/* Meta */}
// // 						<div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
// // 							<div className="flex items-center gap-2">
// // 								<Calendar className="w-4 h-4" />
// // 								<span>{year}</span>
// // 							</div>

// // 							<div className="flex items-center gap-2">
// // 								<Clock className="w-4 h-4" />
// // 								<span>{runtimeLabel}</span>
// // 							</div>
// // 						</div>

// // 						{/* Rating */}
// // 						<div className="flex items-center gap-3">
// // 							<div className="flex items-center gap-2 bg-[#FF414E]/10 backdrop-blur-md px-4 py-2 rounded-full">
// // 								<Star className="w-4 h-4 text-[#FF414E] fill-[#FF414E]" />
// // 								<span className="font-semibold">
// // 									{media.vote_average
// // 										? media.vote_average.toFixed(1)
// // 										: "—"}
// // 								</span>
// // 								<span className="text-gray-400 text-xs">
// // 									/ 10
// // 								</span>
// // 							</div>
// // 							<span className="text-gray-400">
// // 								{media.vote_count
// // 									? `${media.vote_count.toLocaleString()} ratings`
// // 									: ""}
// // 							</span>
// // 						</div>

// // 						{/* Genres */}
// // 						{genres.length > 0 && (
// // 							<div className="flex flex-wrap gap-2 text-xs md:text-sm">
// // 								{genres.map((genre) => (
// // 									<span
// // 										key={genre.id}
// // 										className="bg-gray-800 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-gray-300"
// // 									>
// // 										{genre.name}
// // 									</span>
// // 								))}
// // 							</div>
// // 						)}

// // 						{/* Overview */}
// // 						<div className="max-w-2xl">
// // 							<ExpandableText text={media.overview} />
// // 						</div>

// // 						{/* Actions */}
// // 						<div className="max-w-sm space-y-4">
// // 							<MovieDiaryActions
// // 								id={media.id}
// // 								title={title}
// // 								poster={getPosterUrl(media.poster_path)}
// // 								backdrop={getPosterUrl(media.backdrop_path)}
// // 							/>

// // 							<div className="grid grid-cols-2 gap-3">
// // 								<button className="flex items-center justify-center gap-2 rounded-full bg-gray-800 hover:bg-gray-700 px-4 py-2 text-sm transition">
// // 									<Clock className="w-4 h-4" />
// // 									<span>Watch later</span>
// // 								</button>

// // 								<button className="flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm border border-gray-700 hover:border-[#FF414E] transition">
// // 									<Star className="w-4 h-4" />
// // 									<span>Rate</span>
// // 								</button>
// // 							</div>
// // 						</div>
// // 					</div>
// // 				</div>
// // 			</div>
// // 		</div>
// // 	);
// // }

// "use client";

// import { Movie } from "@/types/movie";
// import { TvShow } from "@/types/tv-show";
// import MediaHeroBackdrop from "./media-hero-backdrop";
// import MediaHeroContent from "./media-hero-content";

// export type Media = Movie | TvShow;

// interface FriendActivity {
// 	id: number;
// 	name: string;
// 	avatar: string;
// }

// interface MediaHeroProps {
// 	media: Media;
// 	friends?: FriendActivity[];
// }

// export default function MediaHero({ media, friends = [] }: MediaHeroProps) {
// 	return (
// 		<div className="relative">
// 			<MediaHeroBackdrop media={media} />
// 			<MediaHeroContent media={media} friends={friends} />
// 		</div>
// 	);
// }

"use client";

import { Movie } from "@/types/movie";
import { TvShow } from "@/types/tv-show";
import MediaHeroBackdrop from "./media-hero-backdrop";
import MediaHeroContent from "./media-hero-content";

export type Media = Movie | TvShow;

interface FriendActivity {
	id: number;
	name: string;
	avatar: string;
}

interface MediaHeroProps {
	media: Media;
	friends?: FriendActivity[];
}

export default function MediaHero({ media, friends = [] }: MediaHeroProps) {
	return (
		<div className="relative">
			<MediaHeroBackdrop media={media} />
			<MediaHeroContent media={media} friends={friends} />
		</div>
	);
}