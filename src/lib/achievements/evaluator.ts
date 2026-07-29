"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { achievementDefinitions } from "./definitions";
import type {
	AchievementProgressRow,
	AchievementStats,
	AchievementViewItem,
	UserAchievementRow,
} from "./types";

type ProfileRow = {
	display_name: string | null;
	bio: string | null;
	avatar_url: string | null;
};

type DiaryDateRow = {
	created_at: string | null;
};

async function countByUser(
	supabase: SupabaseClient,
	table: string,
	userId: string,
): Promise<number> {
	const { count, error } = await supabase
		.from(table)
		.select("id", { count: "exact", head: true })
		.eq("user_id", userId);

	if (error) {
		console.warn(`Could not count ${table}:`, error.message);
		return 0;
	}

	return count ?? 0;
}

async function countDiaryByMediaType(
	supabase: SupabaseClient,
	userId: string,
	mediaType: "movie" | "tv",
): Promise<number> {
	const { count, error } = await supabase
		.from("diary_entries")
		.select("id", { count: "exact", head: true })
		.eq("user_id", userId)
		.eq("media_type", mediaType);

	if (error) {
		console.warn(
			`Could not count ${mediaType} diary entries:`,
			error.message,
		);
		return 0;
	}

	return count ?? 0;
}

async function countCompletedByMediaType(
	supabase: SupabaseClient,
	userId: string,
	mediaType: "movie" | "tv",
): Promise<number> {
	const { count, error } = await supabase
		.from("diary_entries")
		.select("id", { count: "exact", head: true })
		.eq("user_id", userId)
		.eq("media_type", mediaType)
		.eq("status", "completed");

	if (error) {
		console.warn(`Could not count completed ${mediaType}:`, error.message);
		return 0;
	}

	return count ?? 0;
}

async function countDiaryByStatus(
	supabase: SupabaseClient,
	userId: string,
	status: "watching" | "completed",
): Promise<number> {
	const { count, error } = await supabase
		.from("diary_entries")
		.select("id", { count: "exact", head: true })
		.eq("user_id", userId)
		.eq("status", status);

	if (error) {
		console.warn(`Could not count ${status} diary entries:`, error.message);
		return 0;
	}

	return count ?? 0;
}

async function countRatingsByMinimum(
	supabase: SupabaseClient,
	userId: string,
	minimum: number,
): Promise<number> {
	const { count, error } = await supabase
		.from("user_ratings")
		.select("id", { count: "exact", head: true })
		.eq("user_id", userId)
		.gte("rating", minimum);

	if (error) {
		console.warn("Could not count high ratings:", error.message);
		return 0;
	}

	return count ?? 0;
}

async function countRatingsByMaximum(
	supabase: SupabaseClient,
	userId: string,
	maximum: number,
): Promise<number> {
	const { count, error } = await supabase
		.from("user_ratings")
		.select("id", { count: "exact", head: true })
		.eq("user_id", userId)
		.lte("rating", maximum);

	if (error) {
		console.warn("Could not count low ratings:", error.message);
		return 0;
	}

	return count ?? 0;
}

async function countPerfectRatings(
	supabase: SupabaseClient,
	userId: string,
): Promise<number> {
	const { count, error } = await supabase
		.from("user_ratings")
		.select("id", { count: "exact", head: true })
		.eq("user_id", userId)
		.eq("rating", 10);

	if (error) {
		console.warn("Could not count perfect ratings:", error.message);
		return 0;
	}

	return count ?? 0;
}

async function countActiveDays(
	supabase: SupabaseClient,
	userId: string,
): Promise<number> {
	const { data, error } = await supabase
		.from("diary_entries")
		.select("created_at")
		.eq("user_id", userId);

	if (error) {
		console.warn("Could not count active days:", error.message);
		return 0;
	}

	const rows = (data ?? []) as DiaryDateRow[];

	const days = new Set<string>();

	rows.forEach((row) => {
		if (!row.created_at) return;

		const date = new Date(row.created_at);

		if (Number.isNaN(date.getTime())) return;

		days.add(date.toISOString().slice(0, 10));
	});

	return days.size;
}

async function countGenreTotal(
	supabase: SupabaseClient,
	userId: string,
	genreName: string,
): Promise<number> {
	const { count, error } = await supabase
		.from("diary_entries")
		.select("id", { count: "exact", head: true })
		.eq("user_id", userId)
		.contains("genre_names", [genreName]);

	if (error) {
		console.warn(`Could not count genre ${genreName}:`, error.message);
		return 0;
	}

	return count ?? 0;
}

async function getProfileComplete(
	supabase: SupabaseClient,
	userId: string,
): Promise<number> {
	const { data, error } = await supabase
		.from("profiles")
		.select("display_name, bio, avatar_url")
		.eq("id", userId)
		.maybeSingle();

	if (error) {
		console.warn("Could not load profile for achievements:", error.message);
		return 0;
	}

	const profile = data as ProfileRow | null;

	const hasDisplayName = Boolean(profile?.display_name?.trim());
	const hasBio = Boolean(profile?.bio?.trim());
	const hasAvatar = Boolean(profile?.avatar_url);

	return hasDisplayName && hasBio && hasAvatar ? 1 : 0;
}

export async function getAchievementStats(
	supabase: SupabaseClient,
	userId: string,
): Promise<AchievementStats> {
	const [
		diaryTotal,
		movieDiaryTotal,
		tvDiaryTotal,
		completedTotal,
		completedMovieTotal,
		completedTvTotal,
		watchingTotal,
		ratingsTotal,
		highRatingsTotal,
		perfectRatingsTotal,
		lowRatingsTotal,
		watchlistTotal,
		friendsTotal,
		commentsTotal,
		activeDaysTotal,
		profileComplete,
		genreActionTotal,
		genreAdventureTotal,
		genreAnimationTotal,
		genreComedyTotal,
		genreCrimeTotal,
		genreDocumentaryTotal,
		genreDramaTotal,
		genreFamilyTotal,
		genreFantasyTotal,
		genreHistoryTotal,
		genreHorrorTotal,
		genreMusicTotal,
		genreMysteryTotal,
		genreRomanceTotal,
		genreScienceFictionTotal,
		genreThrillerTotal,
		genreWarTotal,
		genreWesternTotal,
		genreRealityTotal,
		genreKidsTotal,
		genreTalkTotal,
		genreActionAdventureTotal,
		genreSciFiFantasyTotal,
	] = await Promise.all([
		countByUser(supabase, "diary_entries", userId),
		countDiaryByMediaType(supabase, userId, "movie"),
		countDiaryByMediaType(supabase, userId, "tv"),
		countDiaryByStatus(supabase, userId, "completed"),
		countCompletedByMediaType(supabase, userId, "movie"),
		countCompletedByMediaType(supabase, userId, "tv"),
		countDiaryByStatus(supabase, userId, "watching"),
		countByUser(supabase, "user_ratings", userId),
		countRatingsByMinimum(supabase, userId, 8),
		countPerfectRatings(supabase, userId),
		countRatingsByMaximum(supabase, userId, 3),
		countByUser(supabase, "watchlist_entries", userId),
		countByUser(supabase, "friendships", userId),
		countByUser(supabase, "media_comments", userId),
		countActiveDays(supabase, userId),
		getProfileComplete(supabase, userId),
		countGenreTotal(supabase, userId, "Action"),
		countGenreTotal(supabase, userId, "Adventure"),
		countGenreTotal(supabase, userId, "Animation"),
		countGenreTotal(supabase, userId, "Comedy"),
		countGenreTotal(supabase, userId, "Crime"),
		countGenreTotal(supabase, userId, "Documentary"),
		countGenreTotal(supabase, userId, "Drama"),
		countGenreTotal(supabase, userId, "Family"),
		countGenreTotal(supabase, userId, "Fantasy"),
		countGenreTotal(supabase, userId, "History"),
		countGenreTotal(supabase, userId, "Horror"),
		countGenreTotal(supabase, userId, "Music"),
		countGenreTotal(supabase, userId, "Mystery"),
		countGenreTotal(supabase, userId, "Romance"),
		countGenreTotal(supabase, userId, "Science Fiction"),
		countGenreTotal(supabase, userId, "Thriller"),
		countGenreTotal(supabase, userId, "War"),
		countGenreTotal(supabase, userId, "Western"),
		countGenreTotal(supabase, userId, "Reality"),
		countGenreTotal(supabase, userId, "Kids"),
		countGenreTotal(supabase, userId, "Talk"),
		countGenreTotal(supabase, userId, "Action & Adventure"),
		countGenreTotal(supabase, userId, "Sci-Fi & Fantasy"),
	]);

	return {
		diary_total: diaryTotal,
		movie_diary_total: movieDiaryTotal,
		tv_diary_total: tvDiaryTotal,
		completed_total: completedTotal,
		completed_movie_total: completedMovieTotal,
		completed_tv_total: completedTvTotal,
		watching_total: watchingTotal,
		ratings_total: ratingsTotal,
		high_ratings_total: highRatingsTotal,
		perfect_ratings_total: perfectRatingsTotal,
		low_ratings_total: lowRatingsTotal,
		watchlist_total: watchlistTotal,
		friends_total: friendsTotal,
		comments_total: commentsTotal,
		active_days_total: activeDaysTotal,
		profile_complete: profileComplete,
		genre_action_total: genreActionTotal,
		genre_adventure_total: genreAdventureTotal,
		genre_animation_total: genreAnimationTotal,
		genre_comedy_total: genreComedyTotal,
		genre_crime_total: genreCrimeTotal,
		genre_documentary_total: genreDocumentaryTotal,
		genre_drama_total: genreDramaTotal,
		genre_family_total: genreFamilyTotal,
		genre_fantasy_total: genreFantasyTotal,
		genre_history_total: genreHistoryTotal,
		genre_horror_total: genreHorrorTotal,
		genre_music_total: genreMusicTotal,
		genre_mystery_total: genreMysteryTotal,
		genre_romance_total: genreRomanceTotal,
		genre_science_fiction_total: genreScienceFictionTotal,
		genre_thriller_total: genreThrillerTotal,
		genre_war_total: genreWarTotal,
		genre_western_total: genreWesternTotal,
		genre_reality_total: genreRealityTotal,
		genre_kids_total: genreKidsTotal,
		genre_talk_total: genreTalkTotal,
		genre_action_adventure_total: genreActionAdventureTotal,
		genre_sci_fi_fantasy_total: genreSciFiFantasyTotal,
	};
}

export async function evaluateAchievements(
	supabase: SupabaseClient,
	userId: string,
): Promise<AchievementViewItem[]> {
	const stats = await getAchievementStats(supabase, userId);

	const progressRows = achievementDefinitions.map((achievement) => ({
		user_id: userId,
		achievement_id: achievement.id,
		progress: Math.min(stats[achievement.rule], achievement.target),
		target: achievement.target,
		updated_at: new Date().toISOString(),
	}));

	const { error: progressError } = await supabase
		.from("user_achievement_progress")
		.upsert(progressRows, {
			onConflict: "user_id,achievement_id",
		});

	if (progressError) {
		throw new Error(progressError.message);
	}

	const { data: unlockedData, error: unlockedError } = await supabase
		.from("user_achievements")
		.select("achievement_id, unlocked_at")
		.eq("user_id", userId);

	if (unlockedError) {
		throw new Error(unlockedError.message);
	}

	const existingUnlockedRows = (unlockedData ?? []) as UserAchievementRow[];

	const existingUnlockedIds = new Set<string>(
		existingUnlockedRows.map((row) => row.achievement_id),
	);

	const newlyUnlocked = achievementDefinitions.filter((achievement) => {
		const progress = stats[achievement.rule];

		return (
			progress >= achievement.target &&
			!existingUnlockedIds.has(achievement.id)
		);
	});

	if (newlyUnlocked.length > 0) {
		const { error: insertError } = await supabase
			.from("user_achievements")
			.upsert(
				newlyUnlocked.map((achievement) => ({
					user_id: userId,
					achievement_id: achievement.id,
					unlocked_at: new Date().toISOString(),
				})),
				{
					onConflict: "user_id,achievement_id",
				},
			);

		if (insertError) {
			throw new Error(insertError.message);
		}
	}

	return getAchievementState(supabase, userId);
}

export async function getAchievementState(
	supabase: SupabaseClient,
	userId: string,
): Promise<AchievementViewItem[]> {
	const [progressResult, unlockedResult] = await Promise.all([
		supabase
			.from("user_achievement_progress")
			.select("achievement_id, progress, target")
			.eq("user_id", userId),
		supabase
			.from("user_achievements")
			.select("achievement_id, unlocked_at")
			.eq("user_id", userId),
	]);

	if (progressResult.error) {
		throw new Error(progressResult.error.message);
	}

	if (unlockedResult.error) {
		throw new Error(unlockedResult.error.message);
	}

	const progressRows = (progressResult.data ??
		[]) as AchievementProgressRow[];
	const unlockedRows = (unlockedResult.data ?? []) as UserAchievementRow[];

	const progressMap = new Map<string, AchievementProgressRow>(
		progressRows.map((row) => [row.achievement_id, row]),
	);

	const unlockedMap = new Map<string, string>(
		unlockedRows.map((row) => [row.achievement_id, row.unlocked_at]),
	);

	return achievementDefinitions
		.map((achievement): AchievementViewItem => {
			const progress = progressMap.get(achievement.id);

			return {
				...achievement,
				progress: progress?.progress ?? 0,
				unlocked: unlockedMap.has(achievement.id),
				unlockedAt: unlockedMap.get(achievement.id) ?? null,
			};
		})
		.sort((a, b) => a.sortOrder - b.sortOrder);
}
