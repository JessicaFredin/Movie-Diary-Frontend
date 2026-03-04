"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Compass, Search, User } from "lucide-react";

const items = [
	{ href: "/", label: "Home", icon: Home },
	{ href: "/diary", label: "Diary", icon: BookOpen },
	{ href: "/discover", label: "Discover", icon: Compass },
	{ href: "/search", label: "Search", icon: Search },
	{ href: "/profile", label: "Profile", icon: User },
];

export default function MobileBottomNav() {
	const pathname = usePathname();

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-dark border-t border-surface-elevated md:hidden">
			<ul className="flex justify-around py-2">
				{items.map(({ href, label, icon: Icon }) => {
					const active = pathname === href;

					return (
						<li key={href}>
							<Link
								href={href}
								className="flex flex-col items-center text-xs"
							>
								<Icon
									className={`w-5 h-5 ${
										active ? "text-accent" : "text-muted"
									}`}
								/>
								<span
									className={
										active ? "text-accent" : "text-muted"
									}
								>
									{label}
								</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
