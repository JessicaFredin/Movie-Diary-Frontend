// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextResponse } from "next/server";
// import { fetchTrending } from "@/services/tmdb-services";

// export async function GET(req: Request) {
// 	try {
// 		const { searchParams } = new URL(req.url);
// 		const type = (searchParams.get("type") || "all") as
// 			| "movie"
// 			| "tv"
// 			| "all";
// 		const page = parseInt(searchParams.get("page") || "1", 10);
// 		const timeWindow = (searchParams.get("timeWindow") || "week") as
// 			| "day"
// 			| "week";

// 		const data = await fetchTrending(type, timeWindow, page);

// 		return NextResponse.json(data);
// 	} catch (error: any) {
// 		return NextResponse.json(
// 			{ error: "Failed to fetch trending data" },
// 			{ status: 500 }
// 		);
// 	}
// }

import { NextResponse } from "next/server";
import { fetchTrending } from "@/services/tmdb-services";

type MediaType = "movie" | "tv" | "all";
type TimeWindow = "day" | "week";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);

	const type = searchParams.get("type");
	const timeWindow = searchParams.get("timeWindow");
	const pageParam = searchParams.get("page");

	const mediaType: MediaType =
		type === "movie" || type === "tv" || type === "all" ? type : "all";

	const window: TimeWindow =
		timeWindow === "day" || timeWindow === "week" ? timeWindow : "week";

	const page = Number(pageParam) > 0 ? Number(pageParam) : 1;

	try {
		const data = await fetchTrending(mediaType, window, page);
		return NextResponse.json(data);
	} catch (error) {
		console.error("Trending API error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch trending data" },
			{ status: 500 },
		);
	}
}
