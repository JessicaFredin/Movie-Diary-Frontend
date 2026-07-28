"use client";

import type { SupabaseClient } from "@supabase/supabase-js";

export type LanguagePreference =
	| "en"
	| "es"
	| "fr"
	| "de"
	| "pt"
	| "ja"
	| "ko"
	| "sv";

export type ThemePreference = "dark" | "light" | "system";

export type UserSettings = {
	user_id: string;
	language: LanguagePreference;
	theme: ThemePreference;
	push_notifications: boolean;
	email_notifications: boolean;
	friend_request_notifications: boolean;
	recommendation_notifications: boolean;
	diary_comment_notifications: boolean;
	weekly_digest_notifications: boolean;
	new_release_notifications: boolean;
	public_watchlist: boolean;
	public_ratings: boolean;
};

export const defaultUserSettings = (userId: string): UserSettings => ({
	user_id: userId,
	language: "en",
	theme: "dark",
	push_notifications: true,
	email_notifications: false,
	friend_request_notifications: true,
	recommendation_notifications: true,
	diary_comment_notifications: true,
	weekly_digest_notifications: false,
	new_release_notifications: true,
	public_watchlist: true,
	public_ratings: true,
});

export async function getOrCreateUserSettings(
	supabase: SupabaseClient,
	userId: string,
): Promise<UserSettings> {
	const { data, error } = await supabase
		.from("user_settings")
		.select(
			"user_id, language, theme, push_notifications, email_notifications, friend_request_notifications, recommendation_notifications, diary_comment_notifications, weekly_digest_notifications, new_release_notifications, public_watchlist, public_ratings",
		)
		.eq("user_id", userId)
		.maybeSingle();

	if (error) {
		throw new Error(error.message);
	}

	if (data) {
		return data as UserSettings;
	}

	const defaults = defaultUserSettings(userId);

	const { data: inserted, error: insertError } = await supabase
		.from("user_settings")
		.insert(defaults)
		.select(
			"user_id, language, theme, push_notifications, email_notifications, friend_request_notifications, recommendation_notifications, diary_comment_notifications, weekly_digest_notifications, new_release_notifications, public_watchlist, public_ratings",
		)
		.single();

	if (insertError) {
		throw new Error(insertError.message);
	}

	return inserted as UserSettings;
}

export async function saveUserSettings(
	supabase: SupabaseClient,
	settings: UserSettings,
): Promise<void> {
	const { error } = await supabase.from("user_settings").upsert(
		{
			...settings,
			updated_at: new Date().toISOString(),
		},
		{
			onConflict: "user_id",
		},
	);

	if (error) {
		throw new Error(error.message);
	}
}