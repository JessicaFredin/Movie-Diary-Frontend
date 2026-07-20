"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, Calendar } from "lucide-react";

import ExpandableText from "@/components/details/expandable-text";
import MovieDiaryActions from "@/components/details/movie-diary-actions";
import TvDiaryActions from "@/components/details/tv-diary-actions";
import MediaRatings from "@/components/media/media-ratings";
import RateMediaButton from "@/components/media/rate-media-button";
import MediaFriendActivity from "@/components/media/media-friend-activity";

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

export default function MediaHeroContent({ media }: MediaHeroContentProps) {
	const [ratingsRefreshKey, setRatingsRefreshKey] = useState(0);

	const movie = isMovie(media);
	const mediaType: "movie" | "tv" = movie ? "movie" : "tv";

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
					{/* Title + Real friend activity */}
					<div className="flex items-center gap-6 flex-wrap">
						<h1 className="text-3xl md:text-5xl font-bold tracking-tight">
							{title}
						</h1>

						<MediaFriendActivity
							mediaId={media.id}
							mediaType={mediaType}
						/>
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

					{/* Ratings */}
					<MediaRatings
						mediaId={media.id}
						mediaType={mediaType}
						tmdbRating={media.vote_average}
						tmdbVoteCount={media.vote_count}
						refreshKey={ratingsRefreshKey}
					/>

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

							<RateMediaButton
								mediaId={media.id}
								mediaType={mediaType}
								title={title}
								onRated={() =>
									setRatingsRefreshKey((value) => value + 1)
								}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
