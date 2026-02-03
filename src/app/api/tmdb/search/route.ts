import { NextResponse } from "next/server";
import { searchTmdb } from "@/services/tmdb-services";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);

	const query = searchParams.get("query");
	const page = Number(searchParams.get("page")) || 1;

	if (!query) {
		return NextResponse.json(
			{ results: [], page: 1, total_pages: 0 },
			{ status: 200 },
		);
	}

	try {
		const data = await searchTmdb(query, page);
		return NextResponse.json(data);
	} catch (error) {
		console.error("TMDB search API error:", error);
		return NextResponse.json(
			{ error: "Failed to search TMDB" },
			{ status: 500 },
		);
	}
}
