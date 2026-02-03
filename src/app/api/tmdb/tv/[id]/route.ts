import { fetchTvShowDetails } from "@/services/tmdb-services";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
	try {
		const tv = await fetchTvShowDetails(Number(params.id));
		return NextResponse.json(tv);
	} catch (err) {
		return NextResponse.json(
			{ error: "Failed to fetch TV show", err },
			{ status: 500 },
		);
	}
}