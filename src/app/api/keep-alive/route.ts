import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const authHeader = request.headers.get("authorization");

	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return new Response("Unauthorized", { status: 401 });
	}

	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
	);

    
    const queries = await Promise.all([
		supabase.from("profiles").select("id").limit(1),
		supabase.from("profiles").select("id").limit(1),
		supabase.from("profiles").select("id").limit(1),
	]);

	const error = queries.find((result) => result.error)?.error;

	if (error) {
		console.error("Supabase keep-alive failed:", error);
		return Response.json({ success: false }, { status: 500 });
	}

	return Response.json({ success: true });
}
