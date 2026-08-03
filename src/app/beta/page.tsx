import Link from "next/link";
import {
	AlertTriangle,
	Bug,
	Mail,
	Rocket,
	ShieldAlert,
	Sparkles,
	Wrench,
} from "lucide-react";

const betaPoints = [
	{
		icon: Rocket,
		title: "Movie Diary is in beta",
		text: "The app is still being developed. You may notice missing features, design changes, bugs, temporary errors or changes to how pages work.",
	},
	{
		icon: Wrench,
		title: "Features can change",
		text: "During beta, features may be added, removed, redesigned or reset. Feedback from early users may directly affect how the app develops.",
	},
	{
		icon: Bug,
		title: "Bugs can happen",
		text: "If something does not work as expected, please report it. Include what page you were on and what happened.",
	},
	{
		icon: ShieldAlert,
		title: "Use responsibly",
		text: "Do not upload or post illegal, inappropriate, abusive, hateful, harassing or copyright-protected material that you do not have permission to use.",
	},
];

export default function BetaPage() {
	return (
		<main className="min-h-screen bg-black px-5 py-16 text-white md:px-12">
			<section className="mx-auto max-w-5xl">
				<div className="rounded-[2rem] border border-accent/30 bg-accent/10 p-8 md:p-10">
					<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-white">
						<Sparkles className="h-7 w-7" />
					</div>

					<p className="mb-3 text-sm font-bold uppercase tracking-wide text-accent">
						Beta notice
					</p>

					<h1 className="text-4xl font-black md:text-6xl">
						Movie Diary is still in development
					</h1>

					<p className="mt-6 max-w-3xl text-base leading-8 text-white/70 md:text-lg">
						Movie Diary is currently a beta product. You are welcome
						to try it, create an account and give feedback, but the
						app is still being improved.
					</p>
				</div>

				<div className="mt-10 grid gap-5 md:grid-cols-2">
					{betaPoints.map((point) => {
						const Icon = point.icon;

						return (
							<div
								key={point.title}
								className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
							>
								<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
									<Icon className="h-6 w-6" />
								</div>

								<h2 className="text-xl font-black">
									{point.title}
								</h2>

								<p className="mt-3 leading-8 text-white/60">
									{point.text}
								</p>
							</div>
						);
					})}
				</div>

				<div className="mt-10 rounded-3xl border border-yellow-400/30 bg-yellow-400/10 p-6">
					<div className="flex items-start gap-4">
						<AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-yellow-300" />

						<div>
							<h2 className="text-xl font-black text-yellow-200">
								Do not rely on beta data as permanent
							</h2>

							<p className="mt-3 leading-8 text-white/70">
								We try to protect your data, but during beta you
								should understand that bugs, migrations or
								feature changes may affect saved content.
								Important notes should also be kept somewhere
								else.
							</p>
						</div>
					</div>
				</div>

				<div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
					<h2 className="text-2xl font-black">
						Feedback and support
					</h2>

					<p className="mt-4 leading-8 text-white/60">
						Found a bug, have feedback or want your account/data
						deleted? Contact us at{" "}
						<a
							href="mailto:contact@jamdevco.com"
							className="font-bold text-accent hover:text-accent-hover"
						>
							contact@jamdevco.com
						</a>
						.
					</p>

					<div className="mt-6 flex flex-wrap gap-4">
						<Link
							href="/contact"
							className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
						>
							<Mail className="h-4 w-4" />
							Contact us
						</Link>

						<Link
							href="/terms"
							className="rounded-full border border-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
						>
							Read Terms
						</Link>

						<Link
							href="/privacy"
							className="rounded-full border border-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
						>
							Read Privacy Policy
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
