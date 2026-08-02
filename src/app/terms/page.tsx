const sections = [
	{
		title: "1. Acceptance of these Terms",
		text: "By creating an account or using Movie Diary, you agree to these Terms & Conditions. If you do not agree, you should not use the service.",
	},
	{
		title: "2. Your account",
		text: "You are responsible for keeping your login details secure. You must not use another person’s account without permission or provide false information when using the service.",
	},
	{
		title: "3. User content",
		text: "You may post comments, ratings, profile information and other content. You are responsible for what you post. Do not post illegal, abusive, hateful, threatening, harassing, misleading or infringing content.",
	},
	{
		title: "4. Spoilers and reports",
		text: "If your comment contains spoilers, you should mark it as a spoiler. Users may report comments that break rules or harm the experience for others.",
	},
	{
		title: "5. Acceptable use",
		text: "You must not misuse Movie Diary, attempt to break security, scrape data without permission, spam, harass users, impersonate others, or use the service for unlawful purposes.",
	},
	{
		title: "6. Movie and TV data",
		text: "Movie Diary may display movie and TV information from third-party sources. We do not own the rights to external movie, TV, poster or rating data shown through the service.",
	},
	{
		title: "7. Availability",
		text: "We try to keep Movie Diary available, but we cannot guarantee that it will always be uninterrupted, error-free or available at all times.",
	},
	{
		title: "8. Account deletion",
		text: "You may request or perform account deletion. When your account is deleted, your personal account data may be permanently removed, subject to technical limitations and legal obligations.",
	},
	{
		title: "9. Changes to the service",
		text: "We may update, change or remove features from Movie Diary. We may also update these Terms when needed.",
	},
	{
		title: "10. Limitation of liability",
		text: "Movie Diary is provided as is. To the maximum extent allowed by law, we are not liable for indirect losses, data loss, service interruptions or issues caused by third-party services.",
	},
];

export default function TermsPage() {
	return (
		<main className="min-h-screen bg-black px-5 py-16 text-white md:px-12">
			<section className="mx-auto max-w-4xl">
				<p className="mb-3 text-sm font-bold uppercase tracking-wide text-accent">
					Legal
				</p>

				<h1 className="text-4xl font-black md:text-6xl">
					Terms & Conditions
				</h1>

				<p className="mt-5 text-sm text-white/45">
					Last updated: July 31, 2026
				</p>

				<p className="mt-6 max-w-3xl leading-8 text-white/60">
					These terms are a general template for Movie Diary. They are
					not legal advice. Before publishing the app publicly, you
					should have the final version reviewed properly.
				</p>

				<div className="mt-10 space-y-5">
					{sections.map((section) => (
						<div
							key={section.title}
							className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
						>
							<h2 className="text-xl font-black">
								{section.title}
							</h2>

							<p className="mt-3 leading-8 text-white/60">
								{section.text}
							</p>
						</div>
					))}
				</div>

				<div className="mt-10 rounded-3xl border border-accent/30 bg-accent/10 p-6">
					<h2 className="text-xl font-black">Contact</h2>

					<p className="mt-3 leading-8 text-white/70">
						Questions about these Terms can be sent to{" "}
						<a
							href="mailto:support@moviediary.app"
							className="font-bold text-accent hover:text-accent-hover"
						>
							support@moviediary.app
						</a>
						.
					</p>
				</div>
			</section>
		</main>
	);
}
