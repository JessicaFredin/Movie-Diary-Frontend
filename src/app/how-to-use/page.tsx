import Link from "next/link";
import {
	Search,
	Plus,
	Star,
	Clock,
	MessageCircle,
	UserPlus,
	Trophy,
} from "lucide-react";

const steps = [
	{
		icon: Search,
		title: "Browse or search",
		description:
			"Use the home page to search for movies and TV shows, filter by type, genre or rating, and sort results.",
	},
	{
		icon: Plus,
		title: "Add to your diary",
		description:
			"When you have watched something, add it to your diary. For TV shows, you can also track season and episode progress.",
	},
	{
		icon: Clock,
		title: "Save to watchlist",
		description:
			"If you have not watched it yet, save it to your watchlist so you can come back to it later.",
	},
	{
		icon: Star,
		title: "Rate titles",
		description:
			"Rate movies and shows from 1 to 10. Your rating helps build your personal taste profile.",
	},
	{
		icon: MessageCircle,
		title: "Comment and discuss",
		description:
			"Share thoughts on a title. Mark your comment as a spoiler if it reveals important plot details.",
	},
	{
		icon: UserPlus,
		title: "Add friends",
		description:
			"Connect with friends and see their activity when their privacy settings allow it.",
	},
	{
		icon: Trophy,
		title: "Unlock achievements",
		description:
			"Use Movie Diary more and unlock achievements for logging, rating, watching genres, adding friends and more.",
	},
];

export default function HowToUsePage() {
	return (
		<main className="min-h-screen bg-black px-5 py-16 text-white md:px-12">
			<section className="mx-auto max-w-5xl">
				<p className="mb-3 text-sm font-bold uppercase tracking-wide text-accent">
					How to use
				</p>

				<h1 className="text-4xl font-black md:text-6xl">
					How Movie Diary works
				</h1>

				<p className="mt-5 max-w-3xl text-base leading-8 text-white/60 md:text-lg">
					Movie Diary is built to be simple: find a title, decide what
					you want to do with it, and keep your profile updated as
					your watching history grows.
				</p>

				<div className="mt-12 grid gap-5 md:grid-cols-2">
					{steps.map((step, index) => {
						const Icon = step.icon;

						return (
							<div
								key={step.title}
								className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
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

				<div className="mt-12 flex flex-wrap gap-4">
					<Link
						href="/"
						className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
					>
						Browse titles
					</Link>

					<Link
						href="/profile"
						className="rounded-full border border-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
					>
						Go to profile
					</Link>
				</div>
			</section>
		</main>
	);
}
