"use client";

import Image from "next/image";
import { Clock, Star } from "lucide-react";
import { getPosterUrl } from "@/utils/tmdb-image";
import { Media } from "./media-hero";
import MediaMeta from "./media-meta";
import MediaRating from "./media-rating";
import MediaGenres from "./media-genres";
import MediaFriends from "./media-friends";
import ExpandableText from "@/components/details/expandable-text";
import MovieDiaryActions from "@/components/details/movie-diary-actions";

interface FriendActivity {
	id: number;
	name: string;
	avatar: string;
}

interface Props {
	media: Media;
	friends: FriendActivity[];
}

export default function MediaHeroContent({ media, friends }: Props) {
	const isMovie = "title" in media;

	const title = isMovie ? media.title : media.name;

	const year =
		isMovie && media.release_date
			? new Date(media.release_date).getFullYear()
			: !isMovie && media.first_air_date
				? new Date(media.first_air_date).getFullYear()
				: "—";

	const runtimeLabel = isMovie ? media.runtime
			? `${Math.floor(media.runtime / 60)}h ${media.runtime % 60}min`
			: "—"
		: media.number_of_seasons
			? `${media.number_of_seasons} season${
					media.number_of_seasons > 1 ? "s" : ""
				}`
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

				{/* Right side */}
				<div className="-mt-24 md:mt-0 flex flex-col gap-4 md:gap-6">
					{/* Title + Friends */}
					<div className="flex items-center gap-6 flex-wrap">
						<h1 className="text-3xl md:text-5xl font-bold tracking-tight">
							{title}
						</h1>

						<MediaFriends friends={friends} />
					</div>

					<MediaMeta year={year} runtimeLabel={runtimeLabel} />

					<MediaRating
						voteAverage={media.vote_average}
						voteCount={media.vote_count}
					/>

					<MediaGenres genres={genres} />

					<div className="max-w-2xl">
						<ExpandableText text={media.overview} />
					</div>

					<div className="max-w-sm space-y-4">
						<MovieDiaryActions
							id={media.id}
							title={title}
							poster={getPosterUrl(media.poster_path)}
							backdrop={getPosterUrl(media.backdrop_path)}
						/>

						<div className="grid grid-cols-2 gap-3">
							<button className="flex items-center justify-center gap-2 rounded-full bg-gray-800 hover:bg-gray-700 px-4 py-2 text-sm transition">
								<Clock className="w-4 h-4" />
								<span>Watch later</span>
							</button>

							<button className="flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm border border-gray-700 hover:border-[#FF414E] transition">
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
