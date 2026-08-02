import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const quickLinks = [
	{ label: "Trending", href: "/" },
	{ label: "Top Movies", href: "/" },
	{ label: "Top TV Shows", href: "/" },
];

const diaryLinks = [
	{ label: "Profile", href: "/profile" },
	{ label: "My Watchlist", href: "/my-watchlist" },
	{ label: "My Diary", href: "/my-diary" },
	{ label: "My Friends", href: "/my-friends" },
];

const supportLinks = [
	{ label: "About us", href: "/about" },
	{ label: "Terms & Conditions", href: "/terms" },
	{ label: "How to use", href: "/how-to-use" },
	{ label: "Contact us", href: "/contact" },
];

type FooterLink = {
	label: string;
	href: string;
};

function FooterColumn({
	title,
	links,
}: {
	title: string;
	links: FooterLink[];
}) {
	return (
		<div className="min-w-0">
			<h4 className="mb-3 text-xs font-bold text-white sm:text-sm md:mb-4">
				{title}
			</h4>

			<ul className="space-y-2 text-xs text-white/55 sm:text-sm md:space-y-3 md:text-base">
				{links.map((link) => (
					<li key={link.label}>
						<Link
							href={link.href}
							className="transition hover:text-white"
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export default function Footer() {
	return (
		<footer className="relative my-12 text-white md:my-16">
			{/* Background logo */}
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
				<Image
					src="/logo.png"
					alt=""
					width={900}
					height={450}
					className="w-[390px] max-w-[92vw] opacity-[0.045] sm:w-[560px] md:w-[760px] md:max-w-[85vw] md:opacity-[0.06]"
				/>
			</div>

			<div className="relative w-full px-5 py-8 sm:px-6 sm:py-10 md:px-12 md:py-12 lg:px-20 xl:px-20 2xl:px-24">
				<div className="flex flex-col gap-9 lg:flex-row lg:items-start lg:justify-between">
					{/* LEFT LINKS */}
					<div className="grid grid-cols-3 gap-5 sm:gap-10 lg:w-auto lg:gap-20 xl:gap-24">
						<FooterColumn title="Quick Links" links={quickLinks} />
						<FooterColumn title="Your Diary" links={diaryLinks} />
						<FooterColumn title="Support" links={supportLinks} />
					</div>

					{/* RIGHT SIDE */}
					<div className="flex flex-col items-center text-center lg:w-[280px] lg:items-end lg:text-right">
						{/* Follow */}
						<div className="w-fit text-left">
							<h4 className="mb-3 text-center text-sm font-medium text-white/60 md:text-base lg:text-left">
								Follow Us
							</h4>

							<div className="flex items-center gap-4">
								<a
									href="https://x.com"
									target="_blank"
									rel="noreferrer"
									aria-label="X"
									className="text-2xl text-white transition hover:text-accent"
								>
									<FaXTwitter />
								</a>

								<a
									href="https://instagram.com"
									target="_blank"
									rel="noreferrer"
									aria-label="Instagram"
									className="text-2xl text-white transition hover:text-accent"
								>
									<FaInstagram />
								</a>

								<a
									href="https://linkedin.com"
									target="_blank"
									rel="noreferrer"
									aria-label="LinkedIn"
									className="text-2xl text-white transition hover:text-accent"
								>
									<FaLinkedinIn />
								</a>
							</div>
						</div>

						{/* Powered by */}
						<div className="mt-10 flex flex-col items-center gap-1 lg:mt-14 lg:items-end">
							<p className="relative -left-[18px] text-sm font-medium text-white/60 md:text-base">
								Powered by
							</p>

							{/* Crops transparent padding inside JAM_logo.png */}
							<div className="relative h-[34px] w-[210px] overflow-hidden sm:h-[38px] sm:w-[220px] md:h-[42px] md:w-[230px]">
								<Image
									src="/JAM_logo.png"
									alt="JAM Development Co."
									width={260}
									height={90}
									className="absolute left-1/2 top-1/2 h-auto w-[210px] -translate-x-1/2 -translate-y-1/2 object-contain sm:w-[220px] md:w-[230px]"
								/>
							</div>
						</div>

						{/* Legal links */}
						<div className="mt-5 flex flex-wrap justify-center gap-4 text-xs text-white/55 sm:text-sm lg:justify-end lg:gap-5">
							<Link
								href="/privacy"
								className="transition hover:text-white"
							>
								Privacy Policy
							</Link>

							<Link
								href="/terms"
								className="transition hover:text-white"
							>
								Terms of Service
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
