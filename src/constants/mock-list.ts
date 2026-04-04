import { List } from "@/types/list";

export const initialLists: List[] = [
	{
		id: 1,
		title: "Best Horror Movies",
		description: "",
		color: "#ff414e",
		isPublic: true,
		items: [],
	},
	{
		id: 2,
		title: "Movies to Watch With Friends",
		description: "Perfect picks for movie night",
		color: "#facc15",
		isPublic: true,
		items: [],
	},
	{
		id: 3,
		title: "Childhood Favorites",
		description: "Nostalgia hits different",
		color: "#38bdf8",
		isPublic: false,
		items: [
			{
				id: 1,
				title: "Interstellar",
				year: 2014,
				rating: 9.2,
				emoji: "🚀",
			},
			{
				id: 2,
				title: "The Shining",
				year: 1980,
				rating: 8.4,
				emoji: "🪓",
			},
		],
	},
	{
		id: 4,
		title: "Top 10 Sci-Fi",
		description: "",
		color: "#a855f7",
		isPublic: true,
		items: [],
	},
];
