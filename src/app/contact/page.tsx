import Link from "next/link";
import {
	AlertTriangle,
	Bug,
	Lightbulb,
	Mail,
	MessageCircle,
	ShieldQuestion,
	Trash2,
} from "lucide-react";

const contactCards = [
	{
		title: "General support",
		description:
			"Questions about your account, diary entries, watchlist, ratings, notes, comments or how Movie Diary works.",
		emailLabel: "contact@jamdevco.com",
		email: "contact@jamdevco.com",
		icon: Mail,
	},
	{
		title: "Privacy requests",
		description:
			"Request access, correction or deletion of your personal data, or ask questions about how your information is handled.",
		emailLabel: "contact@jamdevco.com",
		email: "contact@jamdevco.com",
		icon: ShieldQuestion,
	},
	{
		title: "Feedback & ideas",
		description:
			"Share feature ideas, design feedback, bug reports or anything that could make Movie Diary better.",
		emailLabel: "contact@jamdevco.com",
		email: "contact@jamdevco.com",
		icon: MessageCircle,
	},
];

const helpfulDetails = [
	{
		title: "For bugs",
		text: "Tell us what happened, what page you were on, what device/browser you used, and include a screenshot if possible.",
		icon: Bug,
	},
	{
		title: "For account deletion",
		text: "Use the same email connected to your account so we can verify the request safely.",
		icon: Trash2,
	},
	{
		title: "For unsafe content",
		text: "Include the username, comment, page or title where the issue appears so it can be reviewed faster.",
		icon: AlertTriangle,
	},
	{
		title: "For feature ideas",
		text: "Explain what you want to do, why it would help, and where in the app you imagine the feature should appear.",
		icon: Lightbulb,
	},
];

export default function ContactPage() {
	return (
		<main className="min-h-screen bg-black px-5 py-16 text-white md:px-12">
			<section className="mx-auto max-w-5xl">
				<p className="mb-3 text-sm font-bold uppercase tracking-wide text-accent">
					Contact
				</p>

				<h1 className="text-4xl font-black md:text-6xl">
					Need help with Movie Diary?
				</h1>

				<p className="mt-5 max-w-3xl text-base leading-8 text-white/60 md:text-lg">
					For support, privacy requests, account questions, bug
					reports or general feedback, contact the Movie Diary team.
					We try to review messages as soon as possible.
				</p>

				<div className="mt-8 rounded-3xl border border-accent/30 bg-accent/10 p-6">
					<h2 className="text-xl font-black">Main contact</h2>

					<p className="mt-3 leading-8 text-white/70">
						The best way to reach us is by email at{" "}
						<a
							href="mailto:contact@jamdevco.com"
							className="font-bold text-accent transition hover:text-accent-hover"
						>
							contact@jamdevco.com
						</a>
						. Please include enough details so we can understand and
						help with your request.
					</p>
				</div>

				<div className="mt-12 grid gap-5 md:grid-cols-3">
					{contactCards.map((card) => {
						const Icon = card.icon;

						return (
							<div
								key={card.title}
								className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-accent/40 hover:bg-white/[0.045]"
							>
								<Icon className="mb-5 h-8 w-8 text-accent" />

								<h2 className="text-xl font-black">
									{card.title}
								</h2>

								<p className="mt-3 text-sm leading-7 text-white/60">
									{card.description}
								</p>

								<a
									href={`mailto:${card.email}`}
									className="mt-4 inline-block text-sm font-bold text-accent transition hover:text-accent-hover"
								>
									{card.emailLabel}
								</a>
							</div>
						);
					})}
				</div>

				<div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
					<h2 className="text-2xl font-black">
						Before contacting us
					</h2>

					<p className="mt-4 leading-8 text-white/60">
						Check the how-to page first. Many common questions about
						diary entries, ratings, comments, watchlists, notes and
						achievements are explained there.
					</p>

					<Link
						href="/how-to-use"
						className="mt-6 inline-flex rounded-full border border-white/10 px-6 py-3 text-sm font-bold transition hover:border-accent/40 hover:bg-white/10"
					>
						Read how to use Movie Diary
					</Link>
				</div>

				<div className="mt-8 grid gap-4 md:grid-cols-2">
					{helpfulDetails.map((item) => {
						const Icon = item.icon;

						return (
							<div
								key={item.title}
								className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-accent/40 hover:bg-white/[0.04]"
							>
								<div className="flex items-start gap-4">
									<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
										<Icon className="h-5 w-5" />
									</div>

									<div>
										<h3 className="font-black">
											{item.title}
										</h3>

										<p className="mt-2 text-sm leading-7 text-white/60">
											{item.text}
										</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				<div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
					<h2 className="text-xl font-black">Legal requests</h2>

					<p className="mt-3 leading-8 text-white/60">
						For legal, privacy or moderation-related requests,
						please include your name, the email connected to your
						Movie Diary account, a clear description of the request,
						and any relevant links or screenshots.
					</p>
				</div>
			</section>
		</main>
	);
}
