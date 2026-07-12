"use client";

import Link from "next/link";
import { Lock, Trophy } from "lucide-react";

type DiaryPreviewItem = {
	id: number;
	media_id: string;
	media_type: "movie" | "tv";
	title_snapshot: string | null;
	poster_path_snapshot: string | null;
	updated_at: string | null;
	created_at: string | null;
};

type Props = {
	items: DiaryPreviewItem[];
	displayName: string;
	isPrivate?: boolean;
	showViewAll?: boolean;
	viewAllHref?: string;
};

const fallbackColors = [
	"bg-emerald-950",
	"bg-purple-950",
	"bg-orange-950",
	"bg-green-950",
	"bg-pink-950",
	"bg-slate-950",
];

function getImageUrl(path: string | null) {
	if (!path) return null;
	if (path.startsWith("http")) return path;
	if (path.startsWith("/images/")) return path;

	const cleanPath = path.startsWith("/") ? path : `/${path}`;
	return `https://image.tmdb.org/t/p/w500${cleanPath}`;
}

function getHref(item: DiaryPreviewItem) {
	return item.media_type === "movie"
		? `/movie/${item.media_id}`
		: `/tv/${item.media_id}`;
}

export default function ProfileDiaryStrip({
	items,
	displayName,
	isPrivate = false,
	showViewAll = true,
	viewAllHref = "/my-diary",
}: Props) {
	return (
		<section className="px-6 md:px-16 mt-16">
			<div className="mb-6 flex items-end justify-between gap-4">
				<div>
					<div className="flex items-center gap-2">
						<h2 className="text-3xl font-bold text-white">Diary</h2>

						{isPrivate && <Lock className="h-5 w-5 text-muted" />}
					</div>

					<p className="mt-1 text-muted">
						Latest titles {displayName} has logged
					</p>
				</div>

				{showViewAll && items.length > 0 && (
					<Link
						href={viewAllHref}
						className="text-sm font-semibold text-accent hover:underline"
					>
						View full diary
					</Link>
				)}
			</div>

			{items.length === 0 ? (
				<p className="text-muted">No titles logged yet.</p>
			) : (
				<div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide [&::-webkit-scrollbar]:hidden">
					{items.slice(0, 6).map((item, index) => {
						const imageUrl = getImageUrl(item.poster_path_snapshot);

						return (
							<Link
								key={`${item.media_type}-${item.media_id}`}
								href={getHref(item)}
								className={`relative h-[270px] min-w-[180px] overflow-hidden rounded-2xl border border-white/10 transition hover:-translate-y-1 hover:border-accent ${
									fallbackColors[
										index % fallbackColors.length
									]
								}`}
							>
								{imageUrl && (
									<img
										src={imageUrl}
										alt={
											item.title_snapshot ??
											"Title poster"
										}
										className="h-full w-full object-cover"
									/>
								)}

								<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

								<h3 className="absolute bottom-4 left-4 right-4 line-clamp-2 text-base font-bold text-white">
									{item.title_snapshot ?? "Untitled"}
								</h3>
							</Link>
						);
					})}
				</div>
			)}
		</section>
	);
}

export function ProfileAchievements() {
	const achievements = [
		{
			title: "First Reel",
			text: "Logged your very first title.",
			active: true,
			progress: "",
		},
		{
			title: "Century Club",
			text: "Log 100 movies or shows.",
			active: false,
			progress: "6/100",
		},
		{
			title: "On a Roll",
			text: "Active for over 3 months.",
			active: false,
			progress: "",
		},
		{
			title: "Social Butterfly",
			text: "Made 50 friends on Movie Diary.",
			active: false,
			progress: "0/50",
		},
		{
			title: "Cinephile",
			text: "Log 500 titles across all time.",
			active: false,
			progress: "6/500",
		},
		{
			title: "Original",
			text: "Joined in Movie Diary's first year.",
			active: true,
			progress: "",
		},
	];

	return (
		<section className="px-6 md:px-16 mt-16 pb-16">
			<div className="mb-6 flex items-end justify-between">
				<div>
					<h2 className="text-3xl font-bold text-white">
						Achievements
					</h2>
					<p className="mt-1 text-muted">2 of 6 unlocked</p>
				</div>

				<button className="text-sm font-semibold text-accent hover:underline">
					View all
				</button>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
				{achievements.map((achievement) => (
					<div
						key={achievement.title}
						className={`min-h-[190px] rounded-2xl border p-5 ${
							achievement.active
								? "border-accent/40 bg-accent/15"
								: "border-white/10 bg-white/[0.03]"
						}`}
					>
						<div
							className={`mb-8 flex h-12 w-12 items-center justify-center rounded-2xl ${
								achievement.active
									? "bg-accent/20 text-white"
									: "bg-white/5 text-muted"
							}`}
						>
							<Trophy className="h-5 w-5" />
						</div>

						<h3 className="font-bold text-white">
							{achievement.title}
						</h3>

						<p className="mt-2 text-sm text-muted">
							{achievement.text}
						</p>

						{achievement.progress && (
							<p className="mt-3 text-xs text-muted">
								{achievement.progress}
							</p>
						)}
					</div>
				))}
			</div>
		</section>
	);
}
