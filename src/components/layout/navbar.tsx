"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import {
	Menu,
	User,
	Notebook,
	Bookmark,
	Users,
	Settings,
	LogOut,
	Bell,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import NotificationDropdown from "@/components/notifications/notification-dropdown";
import MobileNotifications from "@/components/notifications/mobile-notifications";
import NavbarSearch from "./navbar-search";
import { countPendingNotifications } from "@/utils/notifications";

const navItems = [
	{ name: "Login", href: "/login", auth: "guest" },
	{ name: "Signup", href: "/signup", auth: "guest" },
];

const profileNavItems = [
	{ label: "Profile", href: "/profile", icon: User },
	{ label: "My Diary", href: "/my-diary", icon: Notebook },
	{ label: "My Watchlist", href: "/my-watchlist", icon: Bookmark },
	{ label: "My Friends", href: "/friends", icon: Users },
	{ label: "Settings", href: "/settings", icon: Settings },
];

function getInitials(nameOrEmail: string) {
	const clean = nameOrEmail.trim();

	if (clean.includes("@")) {
		return clean[0]?.toUpperCase() ?? "U";
	}

	const parts = clean.split(" ").filter(Boolean);

	if (parts.length >= 2) {
		return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
	}

	return clean.slice(0, 2).toUpperCase();
}

export default function Navbar() {
	const pathname = usePathname();
	const router = useRouter();
	const supabase = useMemo(() => createClient(), []);

	const [open, setOpen] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);
	const [notifOpen, setNotifOpen] = useState(false);
	const [mobileNotifOpen, setMobileNotifOpen] = useState(false);

	const [user, setUser] = useState<SupabaseUser | null>(null);
	const [displayName, setDisplayName] = useState("User");
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
	const [unreadCount, setUnreadCount] = useState(0);

	const loadNotificationCount = useCallback(async () => {
		const count = await countPendingNotifications(supabase);
		setUnreadCount(count);
	}, [supabase]);

	const loadUser = useCallback(async () => {
		const {
			data: { user: authUser },
		} = await supabase.auth.getUser();

		setUser(authUser);

		if (!authUser) {
			setDisplayName("User");
			setAvatarUrl(null);
			setUnreadCount(0);
			return;
		}

		const { data: profile } = await supabase
			.from("profiles")
			.select("display_name, avatar_url")
			.eq("id", authUser.id)
			.maybeSingle();

		setDisplayName(
			profile?.display_name ||
				authUser.user_metadata?.full_name ||
				authUser.user_metadata?.name ||
				authUser.email ||
				"User",
		);

		setAvatarUrl(profile?.avatar_url || null);

		await loadNotificationCount();
	}, [supabase, loadNotificationCount]);

	useEffect(() => {
		void loadUser();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(() => {
			void loadUser();
		});

		function handleAvatarUpdated(event: Event) {
			const customEvent = event as CustomEvent<{ avatarUrl: string }>;
			setAvatarUrl(customEvent.detail.avatarUrl);
		}

		window.addEventListener("profile-avatar-updated", handleAvatarUpdated);

		return () => {
			subscription.unsubscribe();
			window.removeEventListener(
				"profile-avatar-updated",
				handleAvatarUpdated,
			);
		};
	}, [supabase, loadUser]);

	useEffect(() => {
		function handleFocus() {
			if (user?.id) {
				void loadNotificationCount();
			}
		}

		window.addEventListener("focus", handleFocus);

		return () => {
			window.removeEventListener("focus", handleFocus);
		};
	}, [user?.id, loadNotificationCount]);

	const logout = async () => {
		await supabase.auth.signOut();
		setProfileOpen(false);
		setOpen(false);
		setNotifOpen(false);
		setMobileNotifOpen(false);
		router.push("/login");
		router.refresh();
	};

	const visibleNavItems = navItems.filter((item) => {
		if (item.auth === "guest") return !user;
		return false;
	});

	return (
		<nav className="sticky top-0 left-0 right-0 z-50 bg-surface-dark py-4 text-white shadow-md">
			<div className="flex items-center justify-between px-6 lg:px-12">
				{/* Logo */}
				<Link href="/">
					<Image
						src="/logo.png"
						alt="Movie Diary Logo"
						width={2000}
						height={1000}
						className="h-auto w-[100px]"
						priority
					/>
				</Link>

				<NavbarSearch />

				{/* Desktop links */}
				<ul className="hidden items-center gap-6 md:flex">
					{visibleNavItems.map((item) => (
						<li key={item.href}>
							<Link
								href={item.href}
								className={`${
									pathname === item.href
										? "text-accent"
										: "text-muted"
								} transition hover:text-white`}
							>
								{item.name}
							</Link>
						</li>
					))}

					{user && (
						<>
							{/* Notifications */}
							<li className="relative">
								<button
									type="button"
									onClick={async () => {
										setNotifOpen((value) => !value);
										await loadNotificationCount();
									}}
									className="relative"
									aria-label="Notifications"
								>
									<Bell className="h-5 w-5 text-muted hover:text-white" />

									{unreadCount > 0 && (
										<span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs">
											{unreadCount > 9
												? "9+"
												: unreadCount}
										</span>
									)}
								</button>

								{notifOpen && (
									<NotificationDropdown
										onClose={() => {
											setNotifOpen(false);
											void loadNotificationCount();
										}}
										onCountChange={setUnreadCount}
									/>
								)}
							</li>

							{/* Profile avatar */}
							<li className="relative">
								<button
									type="button"
									onClick={() =>
										setProfileOpen((value) => !value)
									}
									className="h-9 w-9 cursor-pointer overflow-hidden rounded-full border border-accent focus:outline-none"
									aria-label="Profile menu"
								>
									{avatarUrl ? (
										<Image
											src={avatarUrl}
											alt={displayName}
											className="h-full w-full object-cover"
											width={36}
											height={36}
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center bg-surface-elevated text-sm font-bold text-white">
											{getInitials(displayName)}
										</div>
									)}
								</button>

								{profileOpen && (
									<div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg bg-surface-elevated shadow-lg">
										{profileNavItems.map((item) => {
											const Icon = item.icon;

											return (
												<Link
													key={item.href}
													href={item.href}
													onClick={() =>
														setProfileOpen(false)
													}
													className="block px-4 py-2 hover:bg-surface-neutral"
												>
													<Icon className="mr-2 inline h-4 w-4" />
													{item.label}
												</Link>
											);
										})}

										<button
											type="button"
											onClick={logout}
											className="w-full px-4 py-2 text-left hover:bg-surface-neutral"
										>
											<LogOut className="mr-2 inline h-4 w-4" />
											Log out
										</button>
									</div>
								)}
							</li>
						</>
					)}
				</ul>

				{/* Mobile */}
				<div className="flex items-center gap-4 md:hidden">
					{user && (
						<button
							type="button"
							onClick={async () => {
								await loadNotificationCount();
								setMobileNotifOpen(true);
							}}
							className="relative"
							aria-label="Notifications"
						>
							<Bell />

							{unreadCount > 0 && (
								<span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs">
									{unreadCount > 9 ? "9+" : unreadCount}
								</span>
							)}
						</button>
					)}

					<button
						type="button"
						onClick={() => setOpen((value) => !value)}
						className="md:hidden"
						aria-label="Menu"
					>
						<Menu className="h-6 w-6" />
					</button>
				</div>
			</div>

			{mobileNotifOpen && (
				<MobileNotifications
					onClose={() => {
						setMobileNotifOpen(false);
						void loadNotificationCount();
					}}
					onCountChange={setUnreadCount}
				/>
			)}

			{/* Mobile dropdown */}
			{open && (
				<div className="mt-4 space-y-3 px-6 md:hidden">
					{visibleNavItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							onClick={() => setOpen(false)}
							className="block text-muted hover:text-white"
						>
							{item.name}
						</Link>
					))}

					{user && (
						<>
							<Link
								href="/profile"
								onClick={() => setOpen(false)}
								className="block text-muted hover:text-white"
							>
								Profile
							</Link>

							<Link
								href="/my-diary"
								onClick={() => setOpen(false)}
								className="block text-muted hover:text-white"
							>
								My Diary
							</Link>

							<Link
								href="/my-watchlist"
								onClick={() => setOpen(false)}
								className="block text-muted hover:text-white"
							>
								My Watchlist
							</Link>

							<Link
								href="/friends"
								onClick={() => setOpen(false)}
								className="block text-muted hover:text-white"
							>
								My Friends
							</Link>

							<Link
								href="/settings"
								onClick={() => setOpen(false)}
								className="block text-muted hover:text-white"
							>
								Settings
							</Link>

							<button
								type="button"
								onClick={logout}
								className="block w-full text-left text-gray-300 hover:text-white"
							>
								Log out
							</button>
						</>
					)}
				</div>
			)}
		</nav>
	);
}
