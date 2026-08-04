import { NextRequest, NextResponse } from "next/server";

import {
	createClient,
	type SupabaseClient,
	type User,
} from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type DeleteAccountBody = {
	confirmation?: string;
	password?: string | null;
};

type DeleteAccountSuccess = {
	success: true;
};

type DeleteAccountError = {
	error: string;
};

type DeleteAccountResponse = DeleteAccountSuccess | DeleteAccountError;

function getRequiredEnv(name: string): string {
	const value = process.env[name];

	if (!value) {
		throw new Error(`${name} is missing.`);
	}

	return value;
}

function getPublicSupabaseKey(): string {
	const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (publishableKey) return publishableKey;
	if (anonKey) return anonKey;

	throw new Error(
		"Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
	);
}

function userNeedsPassword(user: User): boolean {
	const providers =
		user.identities?.map((identity) => identity.provider) ?? [];

	return providers.includes("email");
}

async function deleteOptionalRows(
	adminClient: SupabaseClient,
	table: string,
	column: string,
	userId: string,
): Promise<void> {
	const { error } = await adminClient.from(table).delete().eq(column, userId);

	if (error) {
		console.warn(
			`Could not delete optional rows from ${table}.${column}:`,
			error.message,
		);
	}
}

async function deleteRequiredRows(
	adminClient: SupabaseClient,
	table: string,
	column: string,
	userId: string,
): Promise<void> {
	const { error } = await adminClient.from(table).delete().eq(column, userId);

	if (error) {
		throw new Error(`Could not delete from ${table}: ${error.message}`);
	}
}

export async function POST(
	request: NextRequest,
): Promise<NextResponse<DeleteAccountResponse>> {
	try {
		const supabaseUrl = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
		const publicKey = getPublicSupabaseKey();
		const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

		const body = (await request.json()) as DeleteAccountBody;

		if (body.confirmation !== "DELETE") {
			return NextResponse.json(
				{ error: "Confirmation text is incorrect." },
				{ status: 400 },
			);
		}

		const authHeader = request.headers.get("authorization");
		const token = authHeader?.replace("Bearer ", "");

		if (!token) {
			return NextResponse.json(
				{ error: "Missing authorization token." },
				{ status: 401 },
			);
		}

		const userClient = createClient(supabaseUrl, publicKey, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		});

		const {
			data: { user },
			error: userError,
		} = await userClient.auth.getUser(token);

		if (userError || !user) {
			return NextResponse.json(
				{
					error: userError?.message ?? "You are not logged in.",
				},
				{ status: 401 },
			);
		}

		const requiresPassword = userNeedsPassword(user);

		if (requiresPassword) {
			if (!body.password) {
				return NextResponse.json(
					{ error: "Password is required." },
					{ status: 400 },
				);
			}

			if (!user.email) {
				return NextResponse.json(
					{ error: "Could not verify your email account." },
					{ status: 400 },
				);
			}

			const { error: passwordError } =
				await userClient.auth.signInWithPassword({
					email: user.email,
					password: body.password,
				});

			if (passwordError) {
				return NextResponse.json(
					{ error: "Password is incorrect." },
					{ status: 401 },
				);
			}
		}

		const adminClient = createClient(supabaseUrl, serviceRoleKey, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		});

		const userId = user.id;

		/*
			Optional deletes.
			These may fail if the table or column does not exist yet.
			That should not block account deletion.
		*/

		await deleteOptionalRows(
			adminClient,
			"content_reports",
			"reporter_user_id",
			userId,
		);

		await deleteOptionalRows(
			adminClient,
			"content_reports",
			"reported_user_id",
			userId,
		);

		await deleteOptionalRows(
			adminClient,
			"comment_reports",
			"reporter_id",
			userId,
		);

		await deleteOptionalRows(
			adminClient,
			"media_comment_reports",
			"reporter_id",
			userId,
		);

		await deleteOptionalRows(
			adminClient,
			"comment_spoiler_views",
			"user_id",
			userId,
		);

		await deleteOptionalRows(
			adminClient,
			"media_comment_spoiler_views",
			"user_id",
			userId,
		);

		await deleteOptionalRows(
			adminClient,
			"comment_likes",
			"user_id",
			userId,
		);

		await deleteOptionalRows(
			adminClient,
			"media_comment_likes",
			"user_id",
			userId,
		);

		await deleteOptionalRows(
			adminClient,
			"diary_access_requests",
			"owner_id",
			userId,
		);

		await deleteOptionalRows(
			adminClient,
			"diary_access_requests",
			"requester_id",
			userId,
		);

		await deleteOptionalRows(
			adminClient,
			"friend_requests",
			"sender_id",
			userId,
		);

		await deleteOptionalRows(
			adminClient,
			"friend_requests",
			"receiver_id",
			userId,
		);

		await deleteOptionalRows(
			adminClient,
			"friend_requests",
			"requester_id",
			userId,
		);

		await deleteOptionalRows(
			adminClient,
			"friend_requests",
			"addressee_id",
			userId,
		);

		await deleteOptionalRows(
			adminClient,
			"notifications",
			"user_id",
			userId,
		);

		await deleteOptionalRows(
			adminClient,
			"notifications",
			"actor_id",
			userId,
		);

		/*
			Required deletes.
			If these fail, account deletion should stop.
		*/

		await deleteRequiredRows(
			adminClient,
			"media_comments",
			"user_id",
			userId,
		);

		await deleteRequiredRows(adminClient, "comments", "user_id", userId);

		await deleteRequiredRows(adminClient, "friendships", "user_id", userId);

		await deleteRequiredRows(
			adminClient,
			"friendships",
			"friend_id",
			userId,
		);

		await deleteRequiredRows(
			adminClient,
			"watchlist_entries",
			"user_id",
			userId,
		);

		await deleteRequiredRows(
			adminClient,
			"user_ratings",
			"user_id",
			userId,
		);

		await deleteRequiredRows(
			adminClient,
			"diary_entries",
			"user_id",
			userId,
		);

		await deleteRequiredRows(adminClient, "media_notes", "user_id", userId);

		await deleteRequiredRows(
			adminClient,
			"tv_episode_notes",
			"user_id",
			userId,
		);

		await deleteOptionalRows(
			adminClient,
			"user_settings",
			"user_id",
			userId,
		);

		await deleteRequiredRows(adminClient, "profiles", "id", userId);

		const { error: deleteUserError } =
			await adminClient.auth.admin.deleteUser(userId);

		if (deleteUserError) {
			return NextResponse.json(
				{ error: deleteUserError.message },
				{ status: 500 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Delete account error:", error);

		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Could not delete account.",
			},
			{ status: 500 },
		);
	}
}
