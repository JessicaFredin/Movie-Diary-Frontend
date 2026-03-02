"use client";

import Image from "next/image";
import { getPosterUrl } from "@/utils/tmdb-image";
import { Media } from "./media-hero";

interface Props {
	media: Media;
}

export default function MediaHeroBackdrop({ media }: Props) {
	const title = "title" in media ? media.title : media.name;

	return (
		<>
			{/* Desktop backdrop */}
			<div className="hidden md:block absolute inset-0 h-[500px]">
				<Image
					src={getPosterUrl(media.backdrop_path || media.poster_path)}
					alt={title}
					fill
					className="object-cover opacity-40"
					priority
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />
			</div>

			{/* Mobile banner */}
			<div className="relative h-[70vh] md:hidden">
				<Image
					src={getPosterUrl(media.poster_path)}
					alt={title}
					fill
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
			</div>
		</>
	);
}
