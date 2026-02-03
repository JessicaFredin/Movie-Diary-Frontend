import { fetchTvShowDetails } from "@/services/tmdb-services";
import { NextResponse } from "next/server";

export async function GET(
	_: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const tv = await fetchTvShowDetails(Number(id));
		return NextResponse.json(tv);
	} catch (err) {
		return NextResponse.json(
			{ error: "Failed to fetch TV show", err },
			{ status: 500 },
		);
	}
}
