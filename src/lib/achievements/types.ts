export type AchievementCategory =
	| "Diary"
	| "Movies"
	| "TV"
	| "Ratings"
	| "Watchlist"
	| "Social"
	| "Profile"
	| "Genres";

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
	| "profile_complete"
	| "genre_action_total"
	| "genre_adventure_total"
	| "genre_animation_total"
	| "genre_comedy_total"
	| "genre_crime_total"
	| "genre_documentary_total"
	| "genre_drama_total"
	| "genre_family_total"
	| "genre_fantasy_total"
	| "genre_history_total"
	| "genre_horror_total"
	| "genre_music_total"
	| "genre_mystery_total"
	| "genre_romance_total"
	| "genre_science_fiction_total"
	| "genre_thriller_total"
	| "genre_war_total"
	| "genre_western_total"
	| "genre_reality_total"
	| "genre_kids_total"
	| "genre_talk_total"
	| "genre_action_adventure_total"
	| "genre_sci_fi_fantasy_total";

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
