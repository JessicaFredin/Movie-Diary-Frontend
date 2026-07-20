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