const lastUpdated = "August 3, 2026";

const sections = [
	{
		title: "1. Acceptance of these Terms",
		text: "By creating an account, accessing, browsing or using Movie Diary, you agree to these Terms & Conditions. If you do not agree to these Terms, you must not use the service. These Terms apply to all users of Movie Diary, including visitors, registered users and anyone who submits content.",
	},
	{
		title: "2. About Movie Diary",
		text: "Movie Diary is a personal movie and TV tracking service that lets users save titles, create diary entries, rate movies and shows, write notes, manage a watchlist, interact with other users and keep track of viewing activity. Movie Diary is provided for personal, entertainment and informational use only.",
	},
	{
		title: "3. Beta and development status",
		text: "Movie Diary is currently in development and may be offered as a beta or early-access service. Features may change, break, be removed, reset or become temporarily unavailable. You should not rely on Movie Diary as a permanent archive of important information. We may update the app frequently while improving it.",
	},
	{
		title: "4. Eligibility",
		text: "You must be old enough to legally use online services in your country. If you are under the age required to create an online account without parental consent, you may only use Movie Diary with permission from a parent or legal guardian.",
	},
	{
		title: "5. Your account",
		text: "You are responsible for keeping your login details secure and for all activity that happens through your account. You must not create an account using false information, impersonate another person, use another person’s account without permission, or attempt to access accounts that do not belong to you.",
	},
	{
		title: "6. User content",
		text: "You may submit content such as ratings, reviews, comments, notes, profile information, usernames, avatars and other material. You keep ownership of your own content, but you give Movie Diary a limited, worldwide, non-exclusive, royalty-free licence to host, store, display, reproduce, modify for formatting, and make your content available as needed to operate, moderate and improve the service.",
	},
	{
		title: "7. Content rules",
		text: "You are responsible for the content you post. You must not post content that is illegal, abusive, hateful, threatening, harassing, defamatory, sexually exploitative, discriminatory, misleading, spam, malware, privacy-invasive, or content that infringes someone else’s intellectual property or other rights.",
	},
	{
		title: "8. Inappropriate and copyrighted material",
		text: "Inappropriate material and copyright-protected material that you do not own or have permission to use is not allowed. This includes uploading, posting or sharing copyrighted images, movie posters, screenshots, videos, text, logos, trademarks, celebrity images, artwork or other protected material unless you have the legal right to do so. You are responsible for any content you upload. We may remove content that appears to infringe copyright, violates these Terms or creates legal risk.",
	},
	{
		title: "9. Copyright reports and takedowns",
		text: "If you believe content on Movie Diary infringes your copyright or other rights, contact us at contact@jamdevco.com with enough information to identify the content and explain your claim. We may remove or restrict access to reported content while we review it. Users who repeatedly upload infringing content may have their account restricted, suspended or deleted.",
	},
	{
		title: "10.Reports and illegal content",
		text: "Users can report content that they believe is illegal, inappropriate, abusive, copyright-infringing, privacy-invasive or otherwise against these Terms. Reports can be submitted through the Report Content page or by contacting us at contact@jamdevco.com. We may review, restrict, remove or disable access to reported content where appropriate.",
	},
	{
		title: "11. Spoilers",
		text: "Movie Diary may include discussions about movies and TV shows. If your content contains spoilers, you should mark it clearly where the feature is available. We are not responsible if you see spoilers posted by other users.",
	},
	{
		title: "12. Moderation and enforcement",
		text: "We may review, hide, remove, restrict or delete content if we believe it breaks these Terms, harms other users, creates legal risk, or affects the safety or quality of the service. We may also suspend or terminate accounts that misuse Movie Diary. Moderation decisions may be based on user reports, manual review, automated tools or a combination of these.",
	},
	{
		title: "13. Reporting content",
		text: "Users may report content or behaviour that they believe breaks these Terms. Reports should be made in good faith. Abuse of reporting tools, false reports, harassment through reports or attempts to manipulate moderation decisions are not allowed.",
	},
	{
		title: "14. Acceptable use",
		text: "You must not misuse Movie Diary. This includes trying to break security, probe or attack the service, scrape data without permission, spam, overload the service, reverse engineer protected parts of the app, bypass access controls, upload malicious code, impersonate others, harass users, or use Movie Diary for unlawful purposes.",
	},
	{
		title: "15. Personal notes and private content",
		text: "Some features may allow you to save personal notes, watch history, diary entries or private information. You are responsible for what you choose to store. Do not save sensitive information that you do not want stored in an online service.",
	},
	{
		title: "16. Public profiles and interactions",
		text: "Some parts of Movie Diary may be visible to other users, such as usernames, profile details, comments, ratings, public activity or other social features. You should only share information that you are comfortable making visible to others.",
	},
	{
		title: "17. Third-party movie and TV data",
		text: "Movie Diary may display movie and TV information, posters, images, ratings, metadata and other content from third-party providers such as TMDB. Movie Diary does not own that third-party content and does not claim any rights in movie titles, posters, trademarks, images, ratings, metadata or related intellectual property belonging to their respective owners.",
	},
	{
		title: "18. TMDB attribution",
		text: "Movie Diary uses the TMDB API. This product uses the TMDB API but is not endorsed or certified by TMDB. Any TMDB data, images, logos or attribution shown in Movie Diary are used only to identify the source of movie and TV data and do not imply endorsement, certification, sponsorship or approval by TMDB.",
	},
	{
		title: "19. Accuracy of third-party data",
		text: "Movie and TV data shown in Movie Diary may be inaccurate, incomplete, outdated or unavailable. We do not guarantee the accuracy of third-party data, including titles, descriptions, posters, release dates, ratings, genres, episode information or other metadata.",
	},
	{
		title: "20. Intellectual property",
		text: "Movie Diary, including its design, branding, layout, code, features and original content, is owned by us or our licensors. You may not copy, reproduce, distribute, sell, resell or exploit any part of Movie Diary without permission, except as allowed by law.",
	},
	{
		title: "21. Feedback",
		text: "If you send us feedback, suggestions, ideas or feature requests, you allow us to use them without restriction or payment to you. This helps us improve Movie Diary, but it does not create any obligation for us to build or implement your suggestion.",
	},
	{
		title: "22. Service availability",
		text: "We try to keep Movie Diary available and working well, but we do not guarantee that the service will always be available, uninterrupted, secure, accurate or error-free. The service may be unavailable because of maintenance, updates, bugs, outages, third-party services or events outside our control.",
	},
	{
		title: "23. Changes to Movie Diary",
		text: "We may update, change, suspend, limit or remove parts of Movie Diary at any time. We may also add or remove features, change how features work, or stop providing the service entirely.",
	},
	{
		title: "24. Account deletion",
		text: "You may request or perform account deletion where this feature is available. When your account is deleted, your personal account data may be permanently removed, anonymised or disconnected from your account, subject to technical limitations, backups, security requirements and legal obligations.",
	},
	{
		title: "25. Privacy",
		text: "Our handling of personal data is explained in our Privacy Policy. By using Movie Diary, you understand that your personal data will be processed as described there. You should read the Privacy Policy carefully before using the service.",
	},
	{
		title: "26. No professional advice",
		text: "Movie Diary is an entertainment and tracking service. Any information shown through the service, including ratings, recommendations, trends or user opinions, is for general informational purposes only and should not be treated as professional advice.",
	},
	{
		title: "27. No warranties",
		text: "Movie Diary is provided “as is” and “as available”. To the maximum extent permitted by law, we make no warranties or guarantees about the service, including that it will be accurate, reliable, secure, uninterrupted, error-free, suitable for your needs, or free from harmful components.",
	},
	{
		title: "28. Limitation of liability",
		text: "To the maximum extent permitted by law, Movie Diary and its owners, developers and operators will not be liable for indirect, incidental, special, consequential or punitive damages, loss of data, loss of profits, loss of goodwill, service interruptions, account issues, third-party service failures, third-party content, or content posted by users.",
	},
	{
		title: "29. Indemnity",
		text: "If your use of Movie Diary, your content, or your breach of these Terms causes claims, damages, losses, liabilities or expenses, you agree to be responsible for them to the extent permitted by law.",
	},
	{
		title: "30. Termination",
		text: "We may suspend or terminate your access to Movie Diary if you break these Terms, create risk for the service, harm other users, or use the service unlawfully. You may stop using Movie Diary at any time.",
	},
	{
		title: "31. Changes to these Terms",
		text: "We may update these Terms from time to time. If changes are significant, we may notify users through the service or by other reasonable means. Your continued use of Movie Diary after the Terms are updated means you accept the updated Terms.",
	},
	{
		title: "32. Governing law",
		text: "These Terms are governed by the laws of Sweden, unless mandatory consumer protection laws in your country require otherwise. If a dispute cannot be resolved informally, it may be handled by the competent courts or authorities under applicable law.",
	},
	{
		title: "33. Contact",
		text: "Questions about these Terms, account deletion, reports or legal requests can be sent to contact@jamdevco.com.",
	},
];

function TmdbNotice() {
	return (
		<div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-accent/40 hover:bg-white/[0.045]">
			<div className="flex flex-col gap-5 sm:flex-row sm:items-center">
				<div className="flex h-14 w-32 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white p-3">
					<img
						src="/images/tmdb-logo.svg"
						alt="TMDB logo"
						className="max-h-10 w-full object-contain"
					/>
				</div>

				<div>
					<h2 className="text-xl font-black">TMDB attribution</h2>

					<p className="mt-3 leading-8 text-white/60">
						This product uses the TMDB API but is not endorsed or
						certified by TMDB. Movie Diary does not own the movie,
						TV show, poster, backdrop, rating, metadata or image
						data provided by TMDB or other third-party providers.
					</p>
				</div>
			</div>
		</div>
	);
}

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
					Last updated: {lastUpdated}
				</p>

				<div className="mt-8 rounded-3xl border border-accent/30 bg-accent/10 p-6">
					<h2 className="text-xl font-black">Important summary</h2>

					<p className="mt-3 leading-8 text-white/70">
						Movie Diary is currently in development. Use it
						respectfully. Do not post illegal, abusive,
						inappropriate or infringing content. Copyright-protected
						material that you do not have permission to use is not
						allowed. Movie and TV data may come from third-party
						providers such as TMDB. The service is provided as is,
						and we cannot guarantee that it will always be available
						or error-free.
					</p>
				</div>

				<p className="mt-6 max-w-3xl leading-8 text-white/60">
					These Terms explain the rules for using Movie Diary. They
					are written to be clear and practical, but they are still a
					template and should be reviewed by a qualified legal
					professional before you rely on them for a public launch.
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

					<TmdbNotice />
				</div>

				<div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
					<h2 className="text-xl font-black">Contact</h2>

					<p className="mt-3 leading-8 text-white/70">
						Questions about these Terms, account deletion, reports
						or legal requests can be sent to{" "}
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
