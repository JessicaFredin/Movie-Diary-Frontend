const sections = [
	{
		title: "1. Information we collect",
		text: "Movie Diary may collect account information such as your email, display name, avatar, profile information, diary entries, watchlist items, ratings, comments, friend activity, settings and technical information needed to operate the service.",
	},
	{
		title: "2. How we use information",
		text: "We use your information to provide your account, save your diary and watchlist, show your ratings, enable comments, manage friends, personalize your profile, unlock achievements and keep the service secure.",
	},
	{
		title: "3. Public profile and activity",
		text: "Some information may be visible to other users depending on your privacy settings. This can include your display name, avatar, diary activity, ratings, watchlist, comments or achievements.",
	},
	{
		title: "4. Comments and reports",
		text: "Comments you post may be visible to others. If a comment is reported, we may store and review the report to protect the community and enforce rules.",
	},
	{
		title: "5. Third-party services",
		text: "Movie Diary may use third-party services such as authentication, database hosting, analytics or movie/TV data providers. These services may process data according to their own policies.",
	},
	{
		title: "6. Cookies and local storage",
		text: "The app may use cookies, local storage or similar technologies to keep you logged in, remember preferences and improve the user experience.",
	},
	{
		title: "7. Data retention",
		text: "We keep your data for as long as your account exists or as long as needed to provide the service, comply with obligations, resolve disputes or prevent abuse.",
	},
	{
		title: "8. Account deletion",
		text: "You can delete your account from settings. Deletion may remove your profile, diary, ratings, watchlist, comments and related account data. Some technical backups or logs may remain for a limited period.",
	},
	{
		title: "9. Your rights",
		text: "Depending on where you live, you may have rights to access, correct, export or delete your personal data. You can contact us for privacy-related requests.",
	},
	{
		title: "10. Changes to this policy",
		text: "We may update this Privacy Policy when the service changes or when legal requirements change. The updated date will show when the policy was last changed.",
	},
];

export default function PrivacyPage() {
	return (
		<main className="min-h-screen bg-black px-5 py-16 text-white md:px-12">
			<section className="mx-auto max-w-4xl">
				<p className="mb-3 text-sm font-bold uppercase tracking-wide text-accent">
					Privacy
				</p>

				<h1 className="text-4xl font-black md:text-6xl">
					Privacy Policy
				</h1>

				<p className="mt-5 text-sm text-white/45">
					Last updated: July 31, 2026
				</p>

				<p className="mt-6 max-w-3xl leading-8 text-white/60">
					This is a general privacy template for Movie Diary. It
					should be reviewed before you publish the app publicly,
					especially if you collect real user data.
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
					<h2 className="text-xl font-black">Privacy contact</h2>

					<p className="mt-3 leading-8 text-white/70">
						For privacy questions or data requests, contact{" "}
						<a
							href="mailto:privacy@moviediary.app"
							className="font-bold text-accent hover:text-accent-hover"
						>
							privacy@moviediary.app
						</a>
						.
					</p>
				</div>
			</section>
		</main>
	);
}
