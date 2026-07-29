"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AchievementCard from "@/components/achievements/achievement-card";
import { checkAchievementsForCurrentUser } from "@/utils/achievements";
import type {
	AchievementCategory,
	AchievementViewItem,
} from "@/lib/achievements/types";

const tabs: ("All" | AchievementCategory)[] = [
	"All",
	"Diary",
	"Movies",
	"TV",
	"Ratings",
	"Watchlist",
	"Social",
	"Profile",
];

function sortAchievements(
	a: AchievementViewItem,
	b: AchievementViewItem,
): number {
	if (a.unlocked !== b.unlocked) {
		return a.unlocked ? -1 : 1;
	}

	if (a.unlocked && b.unlocked) {
		const aTime = a.unlockedAt ? new Date(a.unlockedAt).getTime() : 0;
		const bTime = b.unlockedAt ? new Date(b.unlockedAt).getTime() : 0;

		return bTime - aTime;
	}

	const aProgress = a.target > 0 ? a.progress / a.target : 0;
	const bProgress = b.target > 0 ? b.progress / b.target : 0;

	if (aProgress !== bProgress) {
		return bProgress - aProgress;
	}

	return a.sortOrder - b.sortOrder;
}

export default function AchievementsGrid() {
	const supabase = useMemo(() => createClient(), []);

	const [items, setItems] = useState<AchievementViewItem[]>([]);
	const [activeTab, setActiveTab] = useState<"All" | AchievementCategory>(
		"All",
	);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [message, setMessage] = useState("");

	const loadAchievements = useCallback(async (): Promise<void> => {
		setMessage("");

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			setItems([]);
			setMessage("You need to log in to view achievements.");
			setLoading(false);
			return;
		}

		const state = await checkAchievementsForCurrentUser(supabase);
		setItems(state);
		setLoading(false);
	}, [supabase]);

	useEffect(() => {
		void loadAchievements();
	}, [loadAchievements]);

	async function handleRefresh(): Promise<void> {
		setRefreshing(true);

		try {
			await loadAchievements();
		} finally {
			setRefreshing(false);
		}
	}

	const filteredItems = useMemo(() => {
		const filtered =
			activeTab === "All"
				? items
				: items.filter(
						(item: AchievementViewItem) =>
							item.category === activeTab,
					);

		return [...filtered].sort(sortAchievements);
	}, [items, activeTab]);

	const unlockedCount = items.filter(
		(item: AchievementViewItem) => item.unlocked,
	).length;

	const totalCount = items.length;

	if (loading) {
		return (
			<section className="px-6 py-12 text-white md:px-24">
				Loading achievements...
			</section>
		);
	}

	return (
		<section className="px-6 py-12 text-white md:px-24">
			<div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
				<div>
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
							<Trophy className="h-6 w-6" />
						</div>

						<div>
							<h1 className="text-4xl font-black">
								Achievements
							</h1>

							<p className="mt-1 text-muted">
								{unlockedCount} of {totalCount} unlocked
							</p>
						</div>
					</div>
				</div>

				<button
					type="button"
					onClick={handleRefresh}
					disabled={refreshing}
					className="flex h-11 w-fit items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm font-bold transition hover:bg-white/[0.08] disabled:opacity-50"
				>
					<RefreshCw
						className={`h-4 w-4 ${
							refreshing ? "animate-spin" : ""
						}`}
					/>
					Check progress
				</button>
			</div>

			{message && (
				<p className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-muted">
					{message}
				</p>
			)}

			<div className="mb-8 flex gap-2 overflow-x-auto pb-2">
				{tabs.map((tab) => (
					<button
						key={tab}
						type="button"
						onClick={() => setActiveTab(tab)}
						className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
							activeTab === tab
								? "bg-accent text-white"
								: "bg-white/[0.05] text-muted hover:bg-white/[0.08] hover:text-white"
						}`}
					>
						{tab}
					</button>
				))}
			</div>

			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{filteredItems.map((item: AchievementViewItem) => (
					<AchievementCard key={item.id} item={item} />
				))}
			</div>
		</section>
	);
}
