"use client";

import { useEffect, useState } from "react";
import { Trophy, X } from "lucide-react";
import type { AchievementDefinition } from "@/lib/achievements/types";
import {
	ACHIEVEMENTS_UNLOCKED_EVENT,
	type AchievementsUnlockedEventDetail,
} from "@/utils/achievements";

export default function AchievementToast() {
	const [queue, setQueue] = useState<AchievementDefinition[]>([]);

	const current = queue[0] ?? null;

	useEffect(() => {
		function handleUnlocked(event: Event): void {
			const customEvent =
				event as CustomEvent<AchievementsUnlockedEventDetail>;

			setQueue((currentQueue) => [
				...currentQueue,
				...customEvent.detail.achievements,
			]);
		}

		window.addEventListener(ACHIEVEMENTS_UNLOCKED_EVENT, handleUnlocked);

		return () => {
			window.removeEventListener(
				ACHIEVEMENTS_UNLOCKED_EVENT,
				handleUnlocked,
			);
		};
	}, []);

	useEffect(() => {
		if (!current) return;

		const timer = window.setTimeout(() => {
			setQueue((currentQueue) => currentQueue.slice(1));
		}, 5000);

		return () => window.clearTimeout(timer);
	}, [current]);

	if (!current) return null;

	return (
		<div className="fixed bottom-6 right-6 z-[200] w-[calc(100vw-48px)] max-w-sm rounded-3xl border border-accent/30 bg-[#15151a] p-5 text-white shadow-2xl shadow-accent/20">
			<div className="flex items-start gap-4">
				<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-2xl">
					{current.icon || <Trophy className="h-6 w-6" />}
				</div>

				<div className="min-w-0 flex-1">
					<p className="text-xs font-bold uppercase tracking-wide text-accent">
						Achievement unlocked
					</p>

					<h3 className="mt-1 text-lg font-black">{current.title}</h3>

					<p className="mt-1 text-sm text-muted">
						{current.description}
					</p>
				</div>

				<button
					type="button"
					onClick={() =>
						setQueue((currentQueue) => currentQueue.slice(1))
					}
					className="text-muted transition hover:text-white"
					aria-label="Close achievement toast"
				>
					<X className="h-5 w-5" />
				</button>
			</div>
		</div>
	);
}
