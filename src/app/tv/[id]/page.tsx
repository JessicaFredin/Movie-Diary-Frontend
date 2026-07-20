import { notFound } from "next/navigation";
import { headers } from "next/headers";
import {
	fetchTvShowDetails,
	fetchTvShowTrailer,
	fetchTvShowWatchProviders,
} from "@/services/tmdb-services";
import MediaHero from "@/components/media/media-hero";
import MediaTrailerWatch from "@/components/media/media-trailer-watch";
import MediaCast from "@/components/media/media-cast";
import MediaComments from "@/components/media/media-comments";
import { Comment } from "@/types/comment";
import { fetchTvShowCast } from "@/services/tmdb-services";

type PageProps = {
	params: {
		id: string;
	};
};

const MOCK_FRIEND_ACTIVITY = [
	{
		id: 1,
		name: "Alex",
		avatar: "https://i.pravatar.cc/100?img=12",
	},
	{
		id: 2,
		name: "Jessica",
		avatar: "https://i.pravatar.cc/100?img=32",
	},
	{
		id: 3,
		name: "Daniel",
		avatar: "https://i.pravatar.cc/100?img=56",
	},
	{
		id: 4,
		name: "Sara",
		avatar: "https://i.pravatar.cc/100?img=68",
	},
	{
		id: 5,
		name: "Clauudia",
		avatar: "https://i.pravatar.cc/100?img=45",
	},
	{
		id: 6,
		name: "Matilda",
		avatar: "https://i.pravatar.cc/100?img=34",
	},
];


// 	{
// 		id: 1,
// 		name: "Timothée Chalamet",
// 		character: "Paul Atreides",
// 		image: "https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg",
// 	},
// 	{
// 		id: 2,
// 		name: "Zendaya",
// 		character: "Chani",
// 		image: "https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg",
// 	},
// 	{
// 		id: 3,
// 		name: "Rebecca Ferguson",
// 		character: "Lady Jessica",
// 		image: "https://image.tmdb.org/t/p/w185/lJloTOheuQSirSLXNA3JHsrMNfH.jpg",
// 	},
// 	{
// 		id: 4,
// 		name: "Oscar Isaac",
// 		character: "Duke Leto",
// 		image: "https://image.tmdb.org/t/p/w185/dW5U5yrIIPmMjRThR9KT2xH6nTz.jpg",
// 	},
// 	{
// 		id: 5,
// 		name: "Javier Bardem",
// 		character: "Stilgar",
// 		image: "https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg",
// 	},
// 	{
// 		id: 6,
// 		name: "Javier Bardem",
// 		character: "Stilgar",
// 		image: "https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg",
// 	},
// ];

const MOCK_COMMENTS: Comment[] = [
	{
		id: "1",
		author: "Sarah Chen",
		avatar: "https://i.pravatar.cc/100?img=44",
		initials: "SC",
		date: "2 days ago",
		text: "This film redefined what sci-fi can be. The way it handles time and human emotion is unlike anything I've ever seen.",
		likes: 24,
		liked: false,
		replies: [
			{
				id: "1-1",
				author: "Marcus Webb",
				avatar: "https://i.pravatar.cc/100?img=69",
				initials: "MW",
				date: "1 day ago",
				text: "Couldn't agree more!",
				likes: 8,
				liked: false,
			},
		],
	},
	{
		id: "2",
		author: "Alex Rivera",
		avatar: "https://i.pravatar.cc/100?img=68",
		initials: "AR",
		date: "5 days ago",
		text: "Watched this for the third time and I keep finding new layers.",
		likes: 31,
		liked: true,
	},
	{
		id: "3",
		author: "Alex Rivera",
		avatar: "https://i.pravatar.cc/100?img=58",
		initials: "AR",
		date: "5 days ago",
		text: "Watched this for the third time and I keep finding new layers.",
		likes: 31,
		liked: true,
	},
	{
		id: "4",
		author: "Sarah Chen",
		avatar: "https://i.pravatar.cc/100?img=78",
		initials: "SC",
		date: "2 days ago",
		text: "This film redefined what sci-fi can be. The way it handles time and human emotion is unlike anything I've ever seen.",
		likes: 24,
		liked: false,
		replies: [
			{
				id: "4-1",
				author: "Marcus Webb",
				initials: "MW",
				date: "1 day ago",
				text: "Couldn't agree more!",
				likes: 8,
				liked: false,
			},
		],
	},
];

export default async function TvShowDetailsPage({ params }: PageProps) {
	const { id } = await params;
	const tvId = Number(id);

	const cast = await fetchTvShowCast(tvId);

	if (!tvId || Number.isNaN(tvId)) {
		notFound();
	}

	const headersList = await headers();
	const country = headersList.get("x-vercel-ip-country") ?? "US";

	const tv = await fetchTvShowDetails(tvId);
	const trailer = await fetchTvShowTrailer(tvId);
	const providers = await fetchTvShowWatchProviders(tvId, country);

	if (!tv) {
		notFound();
	}

	return (
		<main>
			{/* ===== HERO ===== */}
			<MediaHero media={tv} friends={MOCK_FRIEND_ACTIVITY} />

			{/* ===== TRAILER + WATCH ===== */}
			<MediaTrailerWatch trailer={trailer} providers={providers} />

			{/* ===== CAST ===== */}
			<MediaCast cast={cast} />

			{/* ===== COMMENTS ===== */}
			{/* <MediaComments comments={MOCK_COMMENTS} /> */}
			<MediaComments mediaId={tv.id} mediaType="tv" />
		</main>
	);
}