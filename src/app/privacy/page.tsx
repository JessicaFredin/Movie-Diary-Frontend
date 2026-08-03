import TmdbAttribution from "@/components/legal/tmdb-attribution";

const sections = [
	{
		title: "1. Who we are",
		text: "Movie Diary is a movie and TV diary app. For privacy questions, account requests or data requests, contact us at contact@jamdevco.com.",
	},
	{
		title: "2. Beta notice",
		text: "Movie Diary is currently in development and may be offered as a beta service. During beta, features may change and some technical issues may occur. We still aim to handle personal data carefully and transparently.",
	},
	{
		title: "3. Information we collect",
		text: "We may collect account information such as your email address, user ID, display name, username, avatar, profile text, account settings and authentication information.",
	},
	{
		title: "4. Content you create",
		text: "We may store content you create in Movie Diary, including diary entries, watchlist items, ratings, reviews, notes, episode notes, moods, watched-with information, comments, friendships, reports, achievements and profile activity.",
	},
	{
		title: "5. Technical information",
		text: "We may process technical information needed to operate and secure the service, such as timestamps, device/browser information, error logs, security logs, IP-related information, session data and similar technical data.",
	},
	{
		title: "6. How we use your information",
		text: "We use your information to create and manage your account, save your diary and watchlist, show ratings and notes, provide social features, display profiles, enable comments, prevent abuse, improve the app, troubleshoot problems and keep the service secure.",
	},
	{
		title: "7. Legal bases",
		text: "Where GDPR applies, we process personal data based on one or more legal bases, such as providing the service you request, our legitimate interests in operating and securing Movie Diary, compliance with legal obligations, and consent where required.",
	},
	{
		title: "8. Public profile and activity",
		text: "Some information may be visible to other users depending on your privacy settings and app features. This may include your display name, username, avatar, comments, ratings, diary activity, watchlist activity, achievements, friendships or profile information.",
	},
	{
		title: "9. Comments, notes and user content",
		text: "Content you submit may be stored and displayed inside the app. You should not submit private information you do not want stored or shown. Inappropriate or copyright-protected material that you do not have permission to use is not allowed.",
	},
	{
		title: "10. Reports and moderation",
		text: "If users report content or accounts, we may review the reported material and related account information to enforce rules, protect users, prevent abuse and improve safety.",
	},
	{
		title: "11. Third-party services",
		text: "Movie Diary may use third-party services for hosting, authentication, databases, storage, analytics, error monitoring and movie/TV data. These services may process data according to their own terms and privacy policies.",
	},
	{
		title: "12. Movie and TV data",
		text: "Movie Diary uses third-party movie and TV data, including data from TMDB. Movie Diary does not own the external movie, TV, poster, image, rating or metadata shown through the service.",
	},
	{
		title: "13. Cookies and local storage",
		text: "Movie Diary may use cookies, local storage or similar technologies to keep you logged in, remember preferences, improve user experience, support security and operate core features.",
	},
	{
		title: "14. Data retention",
		text: "We keep personal data for as long as your account exists or as long as needed to provide the service, comply with legal obligations, resolve disputes, keep security records, prevent abuse or maintain backups for a limited period.",
	},
	{
		title: "15. Account deletion",
		text: "You may request deletion of your account by contacting contact@jamdevco.com or using an account deletion feature if available. Deletion may remove or anonymize your profile, diary entries, ratings, watchlist, notes, comments and related data, subject to backups, technical limits and legal obligations.",
	},
	{
		title: "16. Your rights",
		text: "Depending on where you live, especially if you are in the EU/EEA, you may have rights to access, correct, delete, restrict, object to or receive a copy of your personal data. You may also have the right to withdraw consent where processing is based on consent.",
	},
	{
		title: "17. Security",
		text: "We use reasonable technical and organizational measures to protect personal data. However, no online service can be guaranteed to be completely secure.",
	},
	{
		title: "18. Children",
		text: "Movie Diary is not intended for children who are too young to consent to digital services under applicable law. If you believe a child has provided personal data without proper permission, contact us.",
	},
	{
		title: "19. International transfers",
		text: "Some service providers may process data in countries outside your country of residence. Where required, we aim to rely on appropriate safeguards for such transfers.",
	},
	{
		title: "20. Changes to this Privacy Policy",
		text: "We may update this Privacy Policy when Movie Diary changes, when legal requirements change or when we need to clarify how data is handled. The latest version will be posted on this page.",
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
					Last updated: August 3, 2026
				</p>

				<div className="mt-6 rounded-3xl border border-accent/30 bg-accent/10 p-6">
					<h2 className="text-xl font-black">Beta privacy notice</h2>

					<p className="mt-3 leading-8 text-white/70">
						Movie Diary is currently in development. This policy is
						written for a beta launch and should be reviewed before
						a larger public or commercial release.
					</p>
				</div>

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

				<div className="mt-10">
					<TmdbAttribution />
				</div>

				<div className="mt-10 rounded-3xl border border-accent/30 bg-accent/10 p-6">
					<h2 className="text-xl font-black">Privacy contact</h2>

					<p className="mt-3 leading-8 text-white/70">
						For privacy questions, account deletion or data
						requests, contact{" "}
						<a
							href="mailto:contact@jamdevco.com"
							className="font-bold text-accent hover:text-accent-hover"
						>
							contact@jamdevco.com
						</a>
						.
					</p>
				</div>
			</section>
		</main>
	);
}
