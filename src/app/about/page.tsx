import Link from "next/link";
import { Film, Heart, Users, Star } from "lucide-react";

export default function AboutPage() {
	return (
		<main className="min-h-screen bg-black px-5 py-16 text-white md:px-12">
			<section className="mx-auto max-w-5xl">
				<p className="mb-3 text-sm font-bold uppercase tracking-wide text-accent">
					About us
				</p>

				<h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
					Your personal home for movies, shows, ratings and memories.
				</h1>

				<p className="mt-6 max-w-3xl text-base leading-8 text-white/60 md:text-lg">
					Movie Diary is made for people who love keeping track of
					what they watch. Log movies and TV shows, build your
					watchlist, rate titles, write comments, follow your
					progress, and share your taste with friends.
				</p>

				<div className="mt-12 grid gap-5 md:grid-cols-4">
					<div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
						<Film className="mb-5 h-8 w-8 text-accent" />
						<h2 className="font-bold">Log everything</h2>
						<p className="mt-2 text-sm leading-6 text-white/55">
							Keep a clean diary of movies and TV shows you have
							watched.
						</p>
					</div>

					<div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
						<Star className="mb-5 h-8 w-8 text-accent" />
						<h2 className="font-bold">Rate your taste</h2>
						<p className="mt-2 text-sm leading-6 text-white/55">
							Add ratings and compare your opinion with the wider
							community.
						</p>
					</div>

					<div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
						<Heart className="mb-5 h-8 w-8 text-accent" />
						<h2 className="font-bold">Save for later</h2>
						<p className="mt-2 text-sm leading-6 text-white/55">
							Build a watchlist so you never forget what you want
							to watch next.
						</p>
					</div>

					<div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
						<Users className="mb-5 h-8 w-8 text-accent" />
						<h2 className="font-bold">Connect</h2>
						<p className="mt-2 text-sm leading-6 text-white/55">
							Add friends and see what people close to you are
							watching.
						</p>
					</div>
				</div>

				<div className="mt-12 rounded-3xl border border-accent/30 bg-accent/10 p-6 md:p-8">
					<h2 className="text-2xl font-black">Why Movie Diary?</h2>

					<p className="mt-4 max-w-3xl leading-8 text-white/70">
						Because watching something is more fun when you can
						remember it, rate it, discuss it and look back at your
						history later. Movie Diary is designed to feel personal,
						social and easy to use.
					</p>

					<Link
						href="/"
						className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
					>
						Start browsing
					</Link>
				</div>
			</section>
		</main>
	);
}
