"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Lock, Trophy } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { checkAchievementsForCurrentUser } from "@/utils/achievements";
import type { AchievementViewItem } from "@/lib/achievements/types";

function getProgressPercentage(item: AchievementViewItem): number {
	if (item.target <= 0) return 0;
	return Math.min(100, Math.round((item.progress / item.target) * 100));
}

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

function AchievementPreviewCard({ item }: { item: AchievementViewItem }) {
	const percentage = getProgressPercentage(item);
	const hiddenLocked = item.isHidden && !item.unlocked;

	return (
		<div
			className={`flex h-[320px] min-w-[260px] flex-col rounded-3xl border bg-[#050505] p-6 transition md:min-w-0 ${
				item.unlocked
					? "border-accent/25 shadow-[0_0_26px_rgba(255,65,78,0.08)]"
					: "border-white/10 opacity-80 hover:border-white/20"
			}`}
		>
			<div className="flex items-start justify-between gap-4">
				<div
					className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${
						item.unlocked
							? "bg-white/[0.08]"
							: "bg-white/[0.04] text-muted"
					}`}
				>
					{hiddenLocked ? (
						<Lock className="h-5 w-5" />
					) : (
						<span>{item.icon}</span>
					)}
				</div>

				{item.unlocked ? (
					<div className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold text-green-300">
						<CheckCircle2 className="h-3.5 w-3.5" />
						Unlocked
					</div>
				) : (
					<div className="rounded-full bg-white/[0.05] px-3 py-1 text-xs font-bold text-muted">
						Locked
					</div>
				)}
			</div>

			<div className="mt-10 min-h-0">
				<h3 className="line-clamp-2 text-xl font-black leading-tight text-white">
					{hiddenLocked ? "Secret Achievement" : item.title}
				</h3>

				<p className="mt-4 line-clamp-3 text-sm leading-6 text-muted">
					{hiddenLocked
						? "Keep using Movie Diary to discover this."
						: item.description}
				</p>
			</div>

			<div className="mt-auto pt-6">
				<div className="mb-2 flex items-center justify-between text-sm">
					<span className="text-muted">
						{item.progress}/{item.target}
					</span>

					<span className="text-xs text-muted">{percentage}%</span>
				</div>

				<div className="h-1.5 overflow-hidden rounded-full bg-white/10">
					<div
						className={`h-full rounded-full ${
							item.unlocked ? "bg-accent" : "bg-white/25"
						}`}
						style={{ width: `${percentage}%` }}
					/>
				</div>
			</div>
		</div>
	);
}

export default function ProfileAchievementsPreview() {
	const supabase = useMemo(() => createClient(), []);

	const [achievements, setAchievements] = useState<AchievementViewItem[]>([]);
	const [loading, setLoading] = useState(true);

	const loadAchievements = useCallback(async (): Promise<void> => {
		setLoading(true);

		try {
			const state = await checkAchievementsForCurrentUser(supabase);
			setAchievements(state);
		} catch (error) {
			console.error("Failed to load profile achievements:", error);
			setAchievements([]);
		} finally {
			setLoading(false);
		}
	}, [supabase]);

	useEffect(() => {
		void loadAchievements();
	}, [loadAchievements]);

	const sortedAchievements = useMemo(() => {
		return [...achievements].sort(sortAchievements);
	}, [achievements]);

	const previewAchievements = sortedAchievements.slice(0, 5);

	const unlockedCount = achievements.filter(
		(item: AchievementViewItem) => item.unlocked,
	).length;

	if (loading) {
		return (
			<section className="px-5 py-16 md:px-16">
				<p className="text-muted">Loading achievements...</p>
			</section>
		);
	}

	if (achievements.length === 0) return null;

	return (
		<section className="px-5 py-16 md:px-16">
			<div className="mb-8 flex items-end justify-between gap-4">
				<div>
					<div className="flex items-center gap-3">
						<Trophy className="h-8 w-8 text-accent" />

						<h2 className="text-4xl font-black text-white">
							Achievements
						</h2>
					</div>

					<p className="mt-1 text-lg text-muted">
						{unlockedCount} of {achievements.length} unlocked
					</p>
				</div>

				<Link
					href="/achievements"
					className="shrink-0 text-sm font-black text-accent transition hover:text-accent-hover"
				>
					View all
				</Link>
			</div>

			<div className="flex gap-5 overflow-x-auto pb-3 lg:grid lg:grid-cols-3 lg:overflow-visible xl:grid-cols-5">
				{previewAchievements.map((item: AchievementViewItem) => (
					<AchievementPreviewCard key={item.id} item={item} />
				))}
			</div>
		</section>
	);
}
