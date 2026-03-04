import { NextResponse } from "next/server";
import { fetchAllStreamingProviders } from "@/services/tmdb-services";

export async function GET() {
	try {
        const providers = await fetchAllStreamingProviders();
        
		return NextResponse.json(providers);
	} catch (error) {
		console.error("Streaming providers error:", error);

		return NextResponse.json(
			{ error: "Failed to fetch streaming providers" },
			{ status: 500 },
		);
	}
}
