const lastUpdated = "August 3, 2026";

const sections = [
	{
		title: "1. Who we are",
		text: "Movie Diary is a movie and TV tracking service operated by JamDevCo. In this Privacy Policy, “Movie Diary”, “we”, “us” and “our” refer to the operator of the service. For privacy questions, you can contact us at contact@jamdevco.com.",
	},
	{
		title: "2. Information we collect",
		text: "We may collect account information such as your email address, display name, username, avatar, profile information, login provider, account settings and account creation date. We may also collect the content and activity you choose to save in Movie Diary, such as diary entries, watchlist items, ratings, reviews, notes, episode notes, moods, watched-with information, comments, friends, achievements and profile activity.",
	},
	{
		title: "3. Technical information",
		text: "When you use Movie Diary, we may process technical information needed to operate, secure and improve the service. This may include device information, browser type, IP address, approximate location based on IP, timestamps, authentication logs, error logs, security logs and usage events.",
	},
	{
		title: "4. Information you make public",
		text: "Some parts of Movie Diary may be visible to other users depending on the feature and your settings. This may include your display name, username, avatar, public profile, comments, ratings, diary activity, achievements, friend activity or other content you choose to share publicly.",
	},
	{
		title: "5. Private diary, watchlist and notes",
		text: "Some features may be private to your account, such as personal notes, diary entries, watchlist items or episode notes. We still process this information so the app can save it, display it to you, sync it across devices, back it up and keep the service working.",
	},
	{
		title: "6. How we use your information",
		text: "We use your information to create and manage your account, keep you logged in, save your diary and watchlist, display ratings and notes, enable comments and social features, unlock achievements, personalize your experience, respond to support requests, prevent abuse, improve the service and keep Movie Diary secure.",
	},
	{
		title: "7. Legal basis for processing",
		text: "Where GDPR or similar laws apply, we process personal data based on one or more legal bases: performance of a contract when we provide the service to you, legitimate interests when we secure and improve Movie Diary, consent where required for optional features or cookies, and legal obligations where we must keep or disclose information to comply with the law.",
	},
	{
		title: "8. Comments, reports and moderation",
		text: "Comments you post may be visible to other users. If content is reported, we may store and review the report, the reported content, related account information and moderation actions. We use this information to enforce rules, protect users, prevent abuse and improve community safety.",
	},
	{
		title: "9. Cookies and similar technologies",
		text: "Movie Diary may use cookies, local storage and similar technologies to keep you logged in, remember preferences, protect your session, understand basic usage and improve the experience. If we add non-essential analytics, advertising or tracking cookies, we will ask for consent where required.",
	},
	{
		title: "10. Third-party services",
		text: "Movie Diary may use third-party services for authentication, hosting, database storage, file storage, analytics, error monitoring, email, security and movie or TV data. These providers may process personal data only as needed to provide their services to us or according to their own policies where they act independently.",
	},
	{
		title: "11. Movie and TV data providers",
		text: "Movie Diary may display movie and TV metadata, posters, images, ratings and other information from third-party providers such as TMDB. Your interaction with Movie Diary may involve storing references to this data, such as movie IDs, show IDs, titles, poster paths and ratings.",
	},
	{
		title: "12. Sharing your information",
		text: "We do not sell your personal data. We may share personal data with service providers that help us operate Movie Diary, when required by law, to protect our rights or users, during a business transfer, or when you choose to make information public through the app.",
	},
	{
		title: "13. International transfers",
		text: "Some service providers may process data outside your country, including outside the EU/EEA. Where required, we rely on appropriate safeguards such as standard contractual clauses, adequacy decisions or other lawful transfer mechanisms.",
	},
	{
		title: "14. Data retention",
		text: "We keep personal data for as long as needed to provide Movie Diary, maintain your account, comply with legal obligations, resolve disputes, prevent abuse and protect the service. If you delete your account, we will delete or anonymise personal account data where reasonably possible, subject to backups, logs, security needs and legal obligations.",
	},
	{
		title: "15. Account deletion",
		text: "You may request or perform account deletion where available. Account deletion may remove or anonymise your profile, diary entries, watchlist, ratings, notes, comments and other account-related data. Some information may remain temporarily in backups or logs, and some public content may remain if it has been anonymised or is needed for legitimate reasons.",
	},
	{
		title: "16. Security",
		text: "We use reasonable technical and organisational measures to protect personal data against unauthorised access, loss, misuse or alteration. However, no online service can be guaranteed to be completely secure, so you should use a strong login method and keep your account details safe.",
	},
	{
		title: "17. Children",
		text: "Movie Diary is not intended for children who are too young to legally use online services without parental consent. If we learn that we have collected personal data from a child without required consent, we will take reasonable steps to delete it.",
	},
	{
		title: "18. Your privacy rights",
		text: "Depending on where you live, you may have the right to request access to your personal data, correction of inaccurate data, deletion, restriction, portability, objection to certain processing, and withdrawal of consent where processing is based on consent.",
	},
	{
		title: "19. How to exercise your rights",
		text: "To exercise privacy rights, contact us at contact@jamdevco.com. We may need to verify your identity before responding. We will respond within the time required by applicable law. If you are in the EU/EEA, you may also have the right to complain to your local data protection authority.",
	},
	{
		title: "20. Automated decision-making",
		text: "Movie Diary may use automated logic for features such as sorting, recommendations, achievements, filtering, spam prevention or security checks. We do not currently use automated decision-making that produces legal or similarly significant effects about you.",
	},
	{
		title: "21. Changes to this Privacy Policy",
		text: "We may update this Privacy Policy when Movie Diary changes, when we add new features, when providers change, or when legal requirements change. The updated date at the top shows when the latest version took effect. If changes are significant, we may provide additional notice where appropriate.",
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
					Last updated: {lastUpdated}
				</p>

				<div className="mt-8 rounded-3xl border border-accent/30 bg-accent/10 p-6">
					<h2 className="text-xl font-black">Quick summary</h2>

					<p className="mt-3 leading-8 text-white/70">
						Movie Diary stores the information needed to run your
						account and save your movie and TV activity, such as
						your profile, diary, watchlist, ratings, comments and
						notes. We do not sell your personal data. You can
						contact us to ask privacy questions or request access,
						correction or deletion.
					</p>
				</div>

				<p className="mt-6 max-w-3xl leading-8 text-white/60">
					This Privacy Policy explains what information Movie Diary
					collects, why we use it, how long we keep it, who may
					process it, and what rights you may have. It is written as a
					strong template, but it should be reviewed by a qualified
					legal professional before public launch.
				</p>

				<div className="mt-10 space-y-5">
					{sections.map((section) => (
						<div
							key={section.title}
							className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-accent/40 hover:bg-white/[0.045]"
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

				<div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
					<h2 className="text-xl font-black">Privacy contact</h2>

					<p className="mt-3 leading-8 text-white/70">
						For privacy questions, account deletion or data
						requests, contact{" "}
						<a
							href="mailto:contact@jamdevco.com"
							className="font-bold text-accent transition hover:text-accent-hover"
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
