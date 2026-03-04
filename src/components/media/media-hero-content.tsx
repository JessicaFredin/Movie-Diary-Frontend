// "use client";

// import Image from "next/image";
// import { Clock, Star } from "lucide-react";
// import { getPosterUrl } from "@/utils/tmdb-image";
// import { Media } from "./media-hero";
// import MediaMeta from "./media-meta";
// import MediaRating from "./media-rating";
// import MediaGenres from "./media-genres";
// import MediaFriends from "./media-friends";
// import ExpandableText from "@/components/details/expandable-text";
// import MovieDiaryActions from "@/components/details/movie-diary-actions";

// interface FriendActivity {
// 	id: number;
// 	name: string;
// 	avatar: string;
// }

// interface Props {
// 	media: Media;
// 	friends: FriendActivity[];
// }

// export default function MediaHeroContent({ media, friends }: Props) {
// 	const isMovie = "title" in media;

// 	const title = isMovie ? media.title : media.name;

// 	const year =
// 		isMovie && media.release_date
// 			? new Date(media.release_date).getFullYear()
// 			: !isMovie && media.first_air_date
// 				? new Date(media.first_air_date).getFullYear()
// 				: "—";

// 	const runtimeLabel = isMovie ? media.runtime
// 			? `${Math.floor(media.runtime / 60)}h ${media.runtime % 60}min`
// 			: "—"
// 		: media.number_of_seasons
// 			? `${media.number_of_seasons} season${
// 					media.number_of_seasons > 1 ? "s" : ""
// 				}`
// 			: "—";

// 	const genres = media.genres ?? [];

// 	return (
// 		<div className="relative px-6 md:px-24 md:pt-40 md:pb-16">
// 			<div className="md:grid md:grid-cols-[300px_1fr] md:gap-14 items-start">
// 				{/* Poster */}
// 				<div className="hidden md:block">
// 					<Image
// 						src={getPosterUrl(media.poster_path)}
// 						alt={title}
// 						width={300}
// 						height={450}
// 						className="rounded-2xl shadow-2xl"
// 						priority
// 					/>
// 				</div>

// 				{/* Right side */}
// 				<div className="-mt-24 md:mt-0 flex flex-col gap-4 md:gap-6">
// 					{/* Title + Friends */}
// 					<div className="flex items-center gap-6 flex-wrap">
// 						<h1 className="text-3xl md:text-5xl font-bold tracking-tight">
// 							{title}
// 						</h1>

// 						<MediaFriends friends={friends} />
// 					</div>

// 					<MediaMeta year={year} runtimeLabel={runtimeLabel} />

// 					<MediaRating
// 						voteAverage={media.vote_average}
// 						voteCount={media.vote_count}
// 					/>

// 					<MediaGenres genres={genres} />

// 					<div className="max-w-2xl">
// 						<ExpandableText text={media.overview} />
// 					</div>

// 					<div className="max-w-sm space-y-4">
// 						<MovieDiaryActions
// 							id={media.id}
// 							title={title}
// 							poster={getPosterUrl(media.poster_path)}
// 							backdrop={getPosterUrl(media.backdrop_path)}
// 						/>

// 						<div className="grid grid-cols-2 gap-3">
// 							<button className="flex items-center justify-center gap-2 rounded-full bg-gray-800 hover:bg-gray-700 px-4 py-2 text-sm transition">
// 								<Clock className="w-4 h-4" />
// 								<span>Watch later</span>
// 							</button>

// 							<button className="flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm border border-gray-700 hover:border-[#FF414E] transition">
// 								<Star className="w-4 h-4" />
// 								<span>Rate</span>
// 							</button>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

"use client";

import Image from "next/image";
import { Clock, Star, Calendar } from "lucide-react";
import ExpandableText from "@/components/details/expandable-text";
import MovieDiaryActions from "@/components/details/movie-diary-actions";
import TvDiaryActions from "@/components/details/tv-diary-actions";
import { getPosterUrl } from "@/utils/tmdb-image";
import { Movie } from "@/types/movie";
import { TvShow } from "@/types/tv-show";

type Media = Movie | TvShow;

interface FriendActivity {
	id: number;
	name: string;
	avatar: string;
}

interface MediaHeroContentProps {
	media: Media;
	friends: FriendActivity[];
}

/* ===== TYPE GUARD ===== */
function isMovie(media: Media): media is Movie {
	return "title" in media;
}

export default function MediaHeroContent({
	media,
	friends,
}: MediaHeroContentProps) {
	const movie = isMovie(media);

	const title = movie ? media.title : media.name;

	const year = movie
		? media.release_date
			? new Date(media.release_date).getFullYear()
			: "—"
		: media.first_air_date
			? new Date(media.first_air_date).getFullYear()
			: "—";

	const runtimeLabel = movie
		? media.runtime
			? `${Math.floor(media.runtime / 60)}h ${media.runtime % 60}m`
			: "—"
		: media.number_of_seasons
			? `${media.number_of_seasons} season${
					media.number_of_seasons > 1 ? "s" : ""
				} · ${media.number_of_episodes ?? 0} episodes`
			: "—";

	const genres = media.genres ?? [];

	return (
		<div className="relative px-6 md:px-24 md:pt-40 md:pb-16">
			<div className="md:grid md:grid-cols-[300px_1fr] md:gap-14 items-start">
				{/* Poster */}
				<div className="hidden md:block">
					<Image
						src={getPosterUrl(media.poster_path)}
						alt={title}
						width={300}
						height={450}
						className="rounded-2xl shadow-2xl"
						priority
					/>
				</div>

				{/* Content */}
				<div className="-mt-24 md:mt-0 flex flex-col gap-4 md:gap-6">
					{/* Title + Friends */}
					<div className="flex items-center gap-6 flex-wrap">
						<h1 className="text-3xl md:text-5xl font-bold tracking-tight">
							{title}
						</h1>

						{friends.length > 0 && (
							<div className="flex items-center gap-3">
								<div className="flex -space-x-3">
									{friends.slice(0, 5).map((friend) => (
										<div
											key={friend.id}
											className="w-8 h-8 rounded-full border-2 border-black overflow-hidden"
										>
											<img
												src={friend.avatar}
												alt={friend.name}
												className="w-full h-full object-cover"
											/>
										</div>
									))}
								</div>

								<p className="text-sm whitespace-nowrap">
									<span className="font-medium text-white">
										{friends.length} friends
									</span>{" "}
									<span className="text-muted">
										have watched this
									</span>
								</p>
							</div>
						)}
					</div>

					{/* Meta */}
					<div className="flex flex-wrap items-center gap-6 text-sm text-muted">
						<div className="flex items-center gap-2">
							<Calendar className="w-4 h-4" />
							<span>{year}</span>
						</div>

						<div className="flex items-center gap-2">
							<Clock className="w-4 h-4" />
							<span>{runtimeLabel}</span>
						</div>
					</div>

					{/* Rating */}
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2 bg-accent/10 backdrop-blur-md px-4 py-2 rounded-full">
							<Star className="w-4 h-4 text-accent fill-accent" />
							<span className="font-semibold">
								{media.vote_average
									? media.vote_average.toFixed(1)
									: "—"}
							</span>
							<span className="text-muted text-xs">/ 10</span>
						</div>

						<span className="text-muted">
							{media.vote_count
								? `${media.vote_count.toLocaleString()} ratings`
								: ""}
						</span>
					</div>

					{/* Genres */}
					{genres.length > 0 && (
						<div className="flex flex-wrap gap-2 text-xs md:text-sm">
							{genres.map((genre) => (
								<span
									key={genre.id}
									className="bg-surface-elevated px-2 md:px-3 py-0.5 md:py-1 rounded-full text-gray-300"
								>
									{genre.name}
								</span>
							))}
						</div>
					)}

					{/* Overview */}
					<div className="max-w-2xl">
						<ExpandableText text={media.overview} />
					</div>

					{/* Actions */}
					<div className="max-w-sm space-y-4">
						{movie ? (
							<MovieDiaryActions
								id={media.id}
								title={title}
								poster={getPosterUrl(media.poster_path)}
								backdrop={getPosterUrl(media.backdrop_path)}
							/>
						) : (
							<TvDiaryActions
								id={media.id}
								title={title}
								poster={getPosterUrl(media.poster_path)}
								backdrop={getPosterUrl(media.backdrop_path)}
							/>
						)}

						<div className="grid grid-cols-2 gap-3">
							<button className="flex items-center justify-center gap-2 rounded-full bg-surface-elevated hover:bg-surface-neutral px-4 py-2 text-sm transition">
								<Clock className="w-4 h-4" />
								<span>Watch later</span>
							</button>

							<button className="flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm border border-surface-neutral hover:border-accent transition">
								<Star className="w-4 h-4" />
								<span>Rate</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}