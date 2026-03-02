import { notFound } from "next/navigation";
import { headers } from "next/headers";
import {
	fetchMovieDetails,
	fetchMovieTrailer,
	fetchMovieWatchProviders,
} from "@/services/tmdb-services";
import MediaHero from "@/components/media/media-hero";
import MediaTrailerWatch from "@/components/media/media-trailer-watch";
import MediaCast from "@/components/media/media-cast";
import MediaComments from "@/components/media/media-comments";
import { Comment } from "@/types/comment";

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

const MOCK_CAST = [
	{
		id: 1,
		name: "Timothée Chalamet",
		character: "Paul Atreides",
		image: "https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg",
	},
	{
		id: 2,
		name: "Zendaya",
		character: "Chani",
		image: "https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg",
	},
	{
		id: 3,
		name: "Rebecca Ferguson",
		character: "Lady Jessica",
		image: "https://image.tmdb.org/t/p/w185/lJloTOheuQSirSLXNA3JHsrMNfH.jpg",
	},
	{
		id: 4,
		name: "Oscar Isaac",
		character: "Duke Leto",
		image: "https://image.tmdb.org/t/p/w185/dW5U5yrIIPmMjRThR9KT2xH6nTz.jpg",
	},
	{
		id: 5,
		name: "Javier Bardem",
		character: "Stilgar",
		image: "https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg",
	},
	{
		id: 6,
		name: "Javier Bardem",
		character: "Stilgar",
		image: "https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg",
	},
];

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

// 	{
// 		id: "1",
// 		author: "Alex Sand",
// 		initials: "AS",
// 		avatar: "https://i.pravatar.cc/100?img=12",
// 		date: "3h",
// 		text: "Did NOT expect this movie to go that hard.",
// 		likes: 18,
// 		replies: [
// 			{
// 				id: "1-1",
// 				author: "Jessica Fredin",
// 				initials: "JF",
// 				avatar: "https://i.pravatar.cc/100?img=32",
// 				date: "2h",
// 				text: "Same. That last act was wild.",
// 				likes: 9,
// 				liked: false,
// 			},
// 			{
// 				id: "1-2",
// 				author: "Adam Pot",
// 				initials: "AP",
// 				avatar: "https://i.pravatar.cc/100?img=51",
// 				date: "1h",
// 				text: "I also agree with Jessica",
// 				likes: 9,
// 				liked: false,
// 			},
// 		],
// 	},
// 	{
// 		id: "2",
// 		author: "Sara",
// 		avatar: "https://i.pravatar.cc/100?img=68",
// 		date: "Yesterday",
// 		text: "Never watching this alone again 😭",
// 		likes: 29,
// 		replies: [
// 			{
// 				id: "2-1",
// 				author: "Daniel",
// 				avatar: "https://i.pravatar.cc/100?img=56",
// 				date: "Yesterday",
// 				text: "I made that mistake once.",
// 			},
// 		],
// 	},
// 	{
// 		id: "3",
// 		author: "Emma",
// 		avatar: "https://i.pravatar.cc/100?img=44",
// 		date: "2d",
// 		text: "Solid atmosphere, pacing could’ve been tighter.",
// 		likes: 7,
// 		replies: [],
// 	},
// ];

export default async function MovieDetailsPage({ params }: PageProps) {
	const { id } = await params;
	const movieId = Number(id);

	if (!movieId || Number.isNaN(movieId)) {
		notFound();
	}

	const headersList = await headers();
	const country = headersList.get("x-vercel-ip-country") ?? "US";

	const movie = await fetchMovieDetails(movieId);
	const trailer = await fetchMovieTrailer(movieId);
	const providers = await fetchMovieWatchProviders(movieId, country);

	if (!movie) {
		notFound();
	}

	return (
		<main>
			{/* ===== MEDIA INFO ===== */}
			<MediaHero media={movie} friends={MOCK_FRIEND_ACTIVITY} />

			{/* ===== TRAILER + WHERE TO WATCH WRAPPER ===== */}
			<MediaTrailerWatch trailer={trailer} providers={providers} />

			{/* ===== CAST ===== */}
			<MediaCast cast={MOCK_CAST} />

			{/* ===== COMMENTS ===== */}
			<MediaComments comments={MOCK_COMMENTS} />
		</main>
	);
}
