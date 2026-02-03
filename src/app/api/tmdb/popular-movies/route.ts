import { NextResponse } from "next/server";
import { fetchPopularMovies } from "@/services/tmdb-services";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const page = Number(searchParams.get("page")) || 1;

	try {
		const data = await fetchPopularMovies(page);
		return NextResponse.json(data);
	} catch (error) {
		console.error("Popular movies API error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch popular movies" },
			{ status: 500 },
		);
	}
}
