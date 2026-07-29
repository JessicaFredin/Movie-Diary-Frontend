"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
	evaluateAchievements,
	getAchievementState,
} from "@/lib/achievements/evaluator";
import type {
	AchievementDefinition,
	AchievementViewItem,
} from "@/lib/achievements/types";

export const ACHIEVEMENTS_UNLOCKED_EVENT = "movie-diary-achievements-unlocked";

export type AchievementsUnlockedEventDetail = {
	achievements: AchievementDefinition[];
};

export function notifyAchievementsUnlocked(
	achievements: AchievementDefinition[],
): void {
	if (typeof window === "undefined") return;
	if (achievements.length === 0) return;

	window.dispatchEvent(
		new CustomEvent<AchievementsUnlockedEventDetail>(
			ACHIEVEMENTS_UNLOCKED_EVENT,
			{
				detail: {
					achievements,
				},
			},
		),
	);
}

export async function checkAchievementsForCurrentUser(
	supabase: SupabaseClient,
): Promise<AchievementViewItem[]> {
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error) {
		throw new Error(error.message);
	}

	if (!user) {
		return [];
	}

	const before = await getAchievementState(supabase, user.id).catch(
		(): AchievementViewItem[] => [],
	);

	const beforeUnlockedIds = new Set<string>(
		before
			.filter((item: AchievementViewItem) => item.unlocked)
			.map((item: AchievementViewItem) => item.id),
	);

	const after = await evaluateAchievements(supabase, user.id);

	const newlyUnlocked = after.filter(
		(item: AchievementViewItem) =>
			item.unlocked && !beforeUnlockedIds.has(item.id),
	);

	notifyAchievementsUnlocked(newlyUnlocked);

	return after;
}

export async function getAchievementStateForCurrentUser(
	supabase: SupabaseClient,
): Promise<AchievementViewItem[]> {
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error) {
		throw new Error(error.message);
	}

	if (!user) {
		return [];
	}

	return getAchievementState(supabase, user.id);
}
