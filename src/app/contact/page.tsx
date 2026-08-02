import Link from "next/link";
import { Mail, MessageCircle, ShieldQuestion } from "lucide-react";

export default function ContactPage() {
	return (
		<main className="min-h-screen bg-black px-5 py-16 text-white md:px-12">
			<section className="mx-auto max-w-5xl">
				<p className="mb-3 text-sm font-bold uppercase tracking-wide text-accent">
					Contact us
				</p>

				<h1 className="text-4xl font-black md:text-6xl">
					Need help with Movie Diary?
				</h1>

				<p className="mt-5 max-w-3xl text-base leading-8 text-white/60 md:text-lg">
					For support, account questions, privacy requests or general
					feedback, contact the Movie Diary team.
				</p>

				<div className="mt-12 grid gap-5 md:grid-cols-3">
					<div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
						<Mail className="mb-5 h-8 w-8 text-accent" />
						<h2 className="text-xl font-black">Email</h2>
						<p className="mt-3 text-sm leading-7 text-white/60">
							For general questions or support.
						</p>
						<a
							href="mailto:support@moviediary.app"
							className="mt-4 inline-block text-sm font-bold text-accent hover:text-accent-hover"
						>
							support@moviediary.app
						</a>
					</div>

					<div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
						<ShieldQuestion className="mb-5 h-8 w-8 text-accent" />
						<h2 className="text-xl font-black">Privacy</h2>
						<p className="mt-3 text-sm leading-7 text-white/60">
							For data access, deletion or privacy questions.
						</p>
						<a
							href="mailto:privacy@moviediary.app"
							className="mt-4 inline-block text-sm font-bold text-accent hover:text-accent-hover"
						>
							privacy@moviediary.app
						</a>
					</div>

					<div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
						<MessageCircle className="mb-5 h-8 w-8 text-accent" />
						<h2 className="text-xl font-black">Feedback</h2>
						<p className="mt-3 text-sm leading-7 text-white/60">
							Have an idea or found something broken?
						</p>
						<a
							href="mailto:feedback@moviediary.app"
							className="mt-4 inline-block text-sm font-bold text-accent hover:text-accent-hover"
						>
							feedback@moviediary.app
						</a>
					</div>
				</div>

				<div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
					<h2 className="text-2xl font-black">
						Before contacting us
					</h2>

					<p className="mt-4 leading-8 text-white/60">
						Check the how-to page first. Many common questions about
						diary entries, ratings, comments, watchlists and
						achievements are explained there.
					</p>

					<Link
						href="/how-to-use"
						className="mt-6 inline-flex rounded-full border border-white/10 px-6 py-3 text-sm font-bold transition hover:bg-white/10"
					>
						Read how to use Movie Diary
					</Link>
				</div>
			</section>
		</main>
	);
}
