export type AchievementCategory =
	| "Diary"
	| "Movies"
	| "TV"
	| "Ratings"
	| "Watchlist"
	| "Social"
	| "Profile";

export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export type AchievementRuleKey =
	| "diary_total"
	| "movie_diary_total"
	| "tv_diary_total"
	| "completed_total"
	| "completed_movie_total"
	| "completed_tv_total"
	| "watching_total"
	| "ratings_total"
	| "high_ratings_total"
	| "perfect_ratings_total"
	| "low_ratings_total"
	| "watchlist_total"
	| "friends_total"
	| "comments_total"
	| "active_days_total"
	| "profile_complete";

export type AchievementDefinition = {
	id: string;
	title: string;
	description: string;
	category: AchievementCategory;
	icon: string;
	target: number;
	rarity: AchievementRarity;
	isHidden: boolean;
	sortOrder: number;
	rule: AchievementRuleKey;
};

export type AchievementStats = Record<AchievementRuleKey, number>;

export type AchievementProgressRow = {
	achievement_id: string;
	progress: number;
	target: number;
};

export type UserAchievementRow = {
	achievement_id: string;
	unlocked_at: string;
};

export type AchievementViewItem = AchievementDefinition & {
	progress: number;
	unlocked: boolean;
	unlockedAt: string | null;
};
