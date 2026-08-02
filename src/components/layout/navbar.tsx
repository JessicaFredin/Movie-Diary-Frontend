"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
	StickyNote,
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
	{ label: "My Notes", href: "/my-notes", icon: StickyNote },
	{ label: "My Friends", href: "/friends", icon: Users },
	{ label: "Settings", href: "/settings", icon: Settings },
];

function getInitials(nameOrEmail: string): string {
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

	const notificationRef = useRef<HTMLLIElement | null>(null);
	const profileRef = useRef<HTMLLIElement | null>(null);
	const mobileMenuRef = useRef<HTMLDivElement | null>(null);
	const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);
	const mobileNotificationRef = useRef<HTMLDivElement | null>(null);
	const mobileNotificationButtonRef = useRef<HTMLButtonElement | null>(null);

	const [open, setOpen] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);
	const [notifOpen, setNotifOpen] = useState(false);
	const [mobileNotifOpen, setMobileNotifOpen] = useState(false);

	const [user, setUser] = useState<SupabaseUser | null>(null);
	const [displayName, setDisplayName] = useState("User");
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
	const [unreadCount, setUnreadCount] = useState(0);

	const currentPath = pathname || "/";
	const safeRedirectPath =
		currentPath === "/login" || currentPath === "/signup"
			? "/"
			: currentPath;

	const loginHref = `/login?redirectTo=${encodeURIComponent(
		safeRedirectPath,
	)}`;

	const signupHref = `/signup?redirectTo=${encodeURIComponent(
		safeRedirectPath,
	)}`;

	function getGuestHref(href: string): string {
		if (href === "/login") return loginHref;
		if (href === "/signup") return signupHref;
		return href;
	}

	const loadNotificationCount = useCallback(async (): Promise<void> => {
		const count = await countPendingNotifications(supabase);
		setUnreadCount(count);
	}, [supabase]);

	const loadUser = useCallback(async (): Promise<void> => {
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

		function handleAvatarUpdated(event: Event): void {
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
		function handleFocus(): void {
			if (user?.id) {
				void loadNotificationCount();
			}
		}

		window.addEventListener("focus", handleFocus);

		return () => {
			window.removeEventListener("focus", handleFocus);
		};
	}, [user?.id, loadNotificationCount]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent): void {
			const target = event.target;

			if (!(target instanceof Node)) return;

			if (
				notifOpen &&
				notificationRef.current &&
				!notificationRef.current.contains(target)
			) {
				setNotifOpen(false);
			}

			if (
				profileOpen &&
				profileRef.current &&
				!profileRef.current.contains(target)
			) {
				setProfileOpen(false);
			}

			if (
				open &&
				mobileMenuRef.current &&
				mobileMenuButtonRef.current &&
				!mobileMenuRef.current.contains(target) &&
				!mobileMenuButtonRef.current.contains(target)
			) {
				setOpen(false);
			}

			if (
				mobileNotifOpen &&
				mobileNotificationRef.current &&
				mobileNotificationButtonRef.current &&
				!mobileNotificationRef.current.contains(target) &&
				!mobileNotificationButtonRef.current.contains(target)
			) {
				setMobileNotifOpen(false);
			}
		}

		function handleEscape(event: KeyboardEvent): void {
			if (event.key === "Escape") {
				setNotifOpen(false);
				setProfileOpen(false);
				setMobileNotifOpen(false);
				setOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [notifOpen, profileOpen, open, mobileNotifOpen]);

	const logout = async (): Promise<void> => {
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

				<ul className="hidden items-center gap-6 md:flex">
					{visibleNavItems.map((item) => (
						<li key={item.href}>
							<Link
								href={getGuestHref(item.href)}
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
							<li ref={notificationRef} className="relative">
								<button
									type="button"
									onClick={async () => {
										setNotifOpen((value) => {
											const next = !value;

											if (next) {
												setProfileOpen(false);
												setOpen(false);
												setMobileNotifOpen(false);
											}

											return next;
										});

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

							<li ref={profileRef} className="relative">
								<button
									type="button"
									onClick={() => {
										setProfileOpen((value) => {
											const next = !value;

											if (next) {
												setNotifOpen(false);
												setOpen(false);
												setMobileNotifOpen(false);
											}

											return next;
										});
									}}
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

				<div className="flex items-center gap-4 md:hidden">
					{user && (
						<button
							ref={mobileNotificationButtonRef}
							type="button"
							onClick={async () => {
								setMobileNotifOpen(true);
								setOpen(false);
								setProfileOpen(false);
								setNotifOpen(false);

								await loadNotificationCount();
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
						ref={mobileMenuButtonRef}
						type="button"
						onClick={() => {
							setOpen((value) => {
								const next = !value;

								if (next) {
									setNotifOpen(false);
									setProfileOpen(false);
									setMobileNotifOpen(false);
								}

								return next;
							});
						}}
						className="md:hidden"
						aria-label="Menu"
					>
						<Menu className="h-6 w-6" />
					</button>
				</div>
			</div>

			{mobileNotifOpen && (
				<div ref={mobileNotificationRef}>
					<MobileNotifications
						onClose={() => {
							setMobileNotifOpen(false);
							void loadNotificationCount();
						}}
						onCountChange={setUnreadCount}
					/>
				</div>
			)}

			{open && (
				<div
					ref={mobileMenuRef}
					className="mt-4 space-y-3 px-6 md:hidden"
				>
					{visibleNavItems.map((item) => (
						<Link
							key={item.href}
							href={getGuestHref(item.href)}
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
								href="/friends"
								onClick={() => setOpen(false)}
								className="block text-muted hover:text-white"
							>
								My Notes
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
