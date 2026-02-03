import { NextResponse } from "next/server";
import { fetchPopularTvShows } from "@/services/tmdb-services";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;

    try {
        const data = await fetchPopularTvShows(page);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Popular tv shows API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch popular tv shows" },
            { status: 500 },
        );
    }
}
