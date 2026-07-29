"use client";

import { CheckCircle2, Lock } from "lucide-react";
import type { AchievementViewItem } from "@/lib/achievements/types";

type Props = {
	item: AchievementViewItem;
	compact?: boolean;
};

const rarityText = {
	common: "text-gray-300",
	rare: "text-blue-300",
	epic: "text-purple-300",
	legendary: "text-yellow-300",
};

function getProgressPercentage(item: AchievementViewItem): number {
	if (item.target <= 0) return 0;
	return Math.min(100, Math.round((item.progress / item.target) * 100));
}

export default function AchievementCard({ item, compact = false }: Props) {
	const percentage = getProgressPercentage(item);
	const hiddenLocked = item.isHidden && !item.unlocked;

	return (
		<div
			className={`relative flex flex-col rounded-3xl border bg-[#050505] p-6 transition ${
				compact ? "h-[280px]" : "h-[320px]"
			} ${
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

			<div className="mt-7 min-h-0">
				<p
					className={`text-xs font-black uppercase tracking-wide ${
						rarityText[item.rarity]
					}`}
				>
					{item.rarity}
				</p>

				<h3 className="mt-3 line-clamp-2 text-xl font-black leading-tight text-white">
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
					<span className="text-muted">Progress</span>

					<span className="font-bold text-white">
						{item.progress}/{item.target}
					</span>
				</div>

				<div className="h-2 overflow-hidden rounded-full bg-white/10">
					<div
						className={`h-full rounded-full ${
							item.unlocked ? "bg-accent" : "bg-white/25"
						}`}
						style={{ width: `${percentage}%` }}
					/>
				</div>

				{item.unlockedAt && (
					<p className="mt-5 text-xs text-muted">
						Unlocked{" "}
						{new Intl.DateTimeFormat("en", {
							month: "short",
							day: "numeric",
							year: "numeric",
						}).format(new Date(item.unlockedAt))}
					</p>
				)}
			</div>
		</div>
	);
}
