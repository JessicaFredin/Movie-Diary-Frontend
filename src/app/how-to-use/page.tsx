import Link from "next/link";
import {
	BookOpen,
	BookmarkPlus,
	CheckCircle2,
	Clock,
	FileText,
	MessageCircle,
	NotebookPen,
	Search,
	Shield,
	Star,
	Trophy,
	UserPlus,
} from "lucide-react";

const steps = [
	{
		icon: Search,
		title: "Browse or search",
		description:
			"Start from the home page to discover movies and TV shows. You can search by title, filter by type, genre or rating, and sort results by popularity, rating, release date or title.",
	},
	{
		icon: CheckCircle2,
		title: "Add watched titles to your diary",
		description:
			"When you have watched a movie or show, save it to your diary. Your diary becomes your personal watching history.",
	},
	{
		icon: Clock,
		title: "Track TV progress",
		description:
			"For TV shows, you can save your current season and episode so you always know where you left off.",
	},
	{
		icon: BookmarkPlus,
		title: "Save titles for later",
		description:
			"If you have not watched something yet, add it to your watchlist. You can move it to your diary later when you watch it.",
	},
	{
		icon: Star,
		title: "Rate what you watch",
		description:
			"Rate movies and shows from 1 to 10. Your personal rating is separate from the public TMDB rating.",
	},
	{
		icon: NotebookPen,
		title: "Write notes",
		description:
			"Save personal notes for movies, shows and specific TV episodes. You can add moods, mark favorite episodes and remember who you watched with.",
	},
	{
		icon: MessageCircle,
		title: "Comment and discuss",
		description:
			"Share your thoughts on titles and join discussions. If your comment reveals important plot details, mark it as a spoiler.",
	},
	{
		icon: UserPlus,
		title: "Connect with friends",
		description:
			"Add friends and see their activity when their privacy settings allow it. This makes it easier to discover what people you know are watching.",
	},
	{
		icon: Trophy,
		title: "Unlock achievements",
		description:
			"Earn achievements as you use Movie Diary, such as logging titles, rating movies, watching genres, adding notes and building your profile.",
	},
];

const quickTips = [
	{
		title: "Diary vs watchlist",
		text: "Use your diary for things you have watched. Use your watchlist for things you want to watch later.",
	},
	{
		title: "Your rating vs TMDB rating",
		text: "Your rating is your own score. TMDB rating is the public movie database score shown for reference.",
	},
	{
		title: "Notes are personal",
		text: "Use notes to remember thoughts, moods, favorite episodes or who you watched something with.",
	},
	{
		title: "Spoilers matter",
		text: "Mark comments as spoilers when they reveal important plot details, endings or surprises.",
	},
];

export default function HowToUsePage() {
	return (
		<main className="min-h-screen bg-black px-5 py-16 text-white md:px-12">
			<section className="mx-auto max-w-6xl">
				<p className="mb-3 text-sm font-bold uppercase tracking-wide text-accent">
					How to use
				</p>

				<h1 className="text-4xl font-black md:text-6xl">
					How Movie Diary works
				</h1>

				<p className="mt-5 max-w-3xl text-base leading-8 text-white/60 md:text-lg">
					Movie Diary helps you keep track of what you watch, what you
					want to watch, what you thought about it, and how your taste
					develops over time.
				</p>

				<div className="mt-8 rounded-3xl border border-accent/30 bg-accent/10 p-6">
					<div className="flex items-start gap-4">
						<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent">
							<BookOpen className="h-6 w-6" />
						</div>

						<div>
							<h2 className="text-xl font-black">
								The simple flow
							</h2>

							<p className="mt-3 leading-8 text-white/70">
								Find a movie or show, choose whether it belongs
								in your diary or watchlist, add your rating,
								write notes if you want, and keep building your
								personal movie profile.
							</p>
						</div>
					</div>
				</div>

				<div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
					{steps.map((step, index) => {
						const Icon = step.icon;

						return (
							<div
								key={step.title}
								className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-accent/40 hover:bg-white/[0.045]"
							>
								<div className="mb-5 flex items-center gap-4">
									<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
										<Icon className="h-6 w-6" />
									</div>

									<div>
										<p className="text-xs font-bold uppercase tracking-wide text-white/35">
											Step {index + 1}
										</p>

										<h2 className="text-xl font-black">
											{step.title}
										</h2>
									</div>
								</div>

								<p className="leading-7 text-white/60">
									{step.description}
								</p>
							</div>
						);
					})}
				</div>

				<div className="mt-14">
					<div className="flex items-center gap-3">
						<FileText className="h-6 w-6 text-accent" />

						<h2 className="text-2xl font-black">Quick tips</h2>
					</div>

					<div className="mt-6 grid gap-4 md:grid-cols-2">
						{quickTips.map((tip) => (
							<div
								key={tip.title}
								className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-accent/40 hover:bg-white/[0.04]"
							>
								<h3 className="font-black">{tip.title}</h3>

								<p className="mt-2 text-sm leading-7 text-white/60">
									{tip.text}
								</p>
							</div>
						))}
					</div>
				</div>

				<div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
					<div className="flex items-start gap-4">
						<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
							<Shield className="h-6 w-6" />
						</div>

						<div>
							<h2 className="text-2xl font-black">
								Be respectful
							</h2>

							<p className="mt-3 leading-8 text-white/60">
								Movie Diary works best when people share
								thoughts respectfully. Do not harass users,
								spam, post illegal content, impersonate others
								or intentionally ruin titles with unmarked
								spoilers.
							</p>
						</div>
					</div>
				</div>

				<div className="mt-12 flex flex-wrap gap-4">
					<Link
						href="/"
						className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
					>
						Browse titles
					</Link>

					<Link
						href="/my-diary"
						className="rounded-full border border-white/10 px-6 py-3 text-sm font-bold text-white transition hover:border-accent/40 hover:bg-white/10"
					>
						Open my diary
					</Link>

					<Link
						href="/my-watchlist"
						className="rounded-full border border-white/10 px-6 py-3 text-sm font-bold text-white transition hover:border-accent/40 hover:bg-white/10"
					>
						Open watchlist
					</Link>

					<Link
						href="/my-notes"
						className="rounded-full border border-white/10 px-6 py-3 text-sm font-bold text-white transition hover:border-accent/40 hover:bg-white/10"
					>
						View notes
					</Link>
				</div>
			</section>
		</main>
	);
}
