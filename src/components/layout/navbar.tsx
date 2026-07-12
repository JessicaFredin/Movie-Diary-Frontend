// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useMemo, useState } from "react";
// import type { User as SupabaseUser } from "@supabase/supabase-js";
// import {
// 	Menu,
// 	User,
// 	Notebook,
// 	Bookmark,
// 	Users,
// 	Settings,
// 	LogOut,
// 	Bell,
// } from "lucide-react";

// import { createClient } from "@/lib/supabase/client";
// import NotificationDropdown from "@/components/notifications/notification-dropdown";
// import MobileNotifications from "@/components/notifications/mobile-notifications";
// import NavbarSearch from "./navbar-search";

// type NotificationType =
// 	| "friend_request"
// 	| "friend_accept"
// 	| "like"
// 	| "comment"
// 	| "diary_request";

// interface Notification {
// 	id: number;
// 	type: NotificationType;
// 	user: string;
// 	message: string;
// 	time: string;
// 	unread: boolean;
// }

// const mockNotifications: Notification[] = [
// 	{
// 		id: 1,
// 		type: "friend_request",
// 		user: "Emma Torres",
// 		message: "sent you a friend request",
// 		time: "2h ago",
// 		unread: true,
// 	},
// 	{
// 		id: 2,
// 		type: "like",
// 		user: "James Okoro",
// 		message: "liked your review of Dune: Part Two",
// 		time: "5h ago",
// 		unread: true,
// 	},
// 	{
// 		id: 3,
// 		type: "comment",
// 		user: "Mia Chen",
// 		message: "commented on your review",
// 		time: "1d ago",
// 		unread: false,
// 	},
// ];

// const navItems = [
// 	{ name: "Login", href: "/login", auth: "guest" },
// 	{ name: "Signup", href: "/signup", auth: "guest" },
// ];

// const profileNavItems = [
// 	{ label: "Profile", href: "/profile", icon: User },
// 	{ label: "My Diary", href: "/my-diary", icon: Notebook },
// 	{ label: "My Watchlist", href: "/my-watchlist", icon: Bookmark },
// 	{ label: "My Friends", href: "/friends", icon: Users },
// 	{ label: "Settings", href: "/settings", icon: Settings },
// ];

// function getInitials(nameOrEmail: string) {
// 	const clean = nameOrEmail.trim();

// 	if (clean.includes("@")) {
// 		return clean[0]?.toUpperCase() ?? "U";
// 	}

// 	const parts = clean.split(" ").filter(Boolean);

// 	if (parts.length >= 2) {
// 		return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
// 	}

// 	return clean.slice(0, 2).toUpperCase();
// }

// export default function Navbar() {
// 	const pathname = usePathname();
// 	const router = useRouter();
// 	const supabase = useMemo(() => createClient(), []);

// 	const [open, setOpen] = useState(false);
// 	const [profileOpen, setProfileOpen] = useState(false);
// 	const [notifOpen, setNotifOpen] = useState(false);
// 	const [mobileNotifOpen, setMobileNotifOpen] = useState(false);

// 	const [user, setUser] = useState<SupabaseUser | null>(null);
// 	const [displayName, setDisplayName] = useState("User");
// 	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

// 	const unreadCount = mockNotifications.filter((n) => n.unread).length;

// 	useEffect(() => {
// 		async function loadUser() {
// 			const {
// 				data: { user },
// 			} = await supabase.auth.getUser();

// 			setUser(user);

// 			if (!user) {
// 				setDisplayName("User");
// 				setAvatarUrl(null);
// 				return;
// 			}

// 			const { data: profile } = await supabase
// 				.from("profiles")
// 				.select("display_name, avatar_url")
// 				.eq("id", user.id)
// 				.single();

// 			setDisplayName(
// 				profile?.display_name ||
// 					user.user_metadata?.full_name ||
// 					user.user_metadata?.name ||
// 					user.email ||
// 					"User",
// 			);

// 			// Database avatar should always win
// 			setAvatarUrl(profile?.avatar_url || null);
// 		}

// 		loadUser();

// 		const {
// 			data: { subscription },
// 		} = supabase.auth.onAuthStateChange(() => {
// 			loadUser();
// 		});

// 		function handleAvatarUpdated(event: Event) {
// 			const customEvent = event as CustomEvent<{ avatarUrl: string }>;
// 			setAvatarUrl(customEvent.detail.avatarUrl);
// 		}

// 		window.addEventListener("profile-avatar-updated", handleAvatarUpdated);

// 		return () => {
// 			subscription.unsubscribe();
// 			window.removeEventListener(
// 				"profile-avatar-updated",
// 				handleAvatarUpdated,
// 			);
// 		};
// 	}, [supabase]);

// 	const logout = async () => {
// 		await supabase.auth.signOut();
// 		setProfileOpen(false);
// 		setOpen(false);
// 		router.push("/login");
// 		router.refresh();
// 	};

// 	const visibleNavItems = navItems.filter((item) => {
// 		if (item.auth === "guest") return !user;
// 		return false;
// 	});

// 	return (
// 		<nav className="bg-surface-dark text-white py-4 shadow-md">
// 			<div className="flex items-center justify-between px-6 lg:px-12">
// 				{/* Logo */}
// 				<Link href="/">
// 					<Image
// 						src="/logo.png"
// 						alt="Movie Diary Logo"
// 						width={2000}
// 						height={1000}
// 						className="w-[100px] h-auto"
// 						priority
// 					/>
// 				</Link>

// 				<NavbarSearch />

// 				{/* Desktop links */}
// 				<ul className="hidden md:flex items-center gap-6">
// 					{visibleNavItems.map((item) => (
// 						<li key={item.href}>
// 							<Link
// 								href={item.href}
// 								className={`${
// 									pathname === item.href
// 										? "text-accent"
// 										: "text-muted"
// 								} hover:text-white transition`}
// 							>
// 								{item.name}
// 							</Link>
// 						</li>
// 					))}

// 					{user && (
// 						<>
// 							{/* Notifications */}
// 							<li className="relative">
// 								<button
// 									type="button"
// 									onClick={() => setNotifOpen((v) => !v)}
// 									className="relative"
// 								>
// 									<Bell className="w-5 h-5 text-muted hover:text-white" />

// 									{unreadCount > 0 && (
// 										<span className="absolute -top-2 -right-2 bg-accent text-xs w-5 h-5 flex items-center justify-center rounded-full">
// 											{unreadCount}
// 										</span>
// 									)}
// 								</button>

// 								{notifOpen && (
// 									<NotificationDropdown
// 										onClose={() => setNotifOpen(false)}
// 									/>
// 								)}
// 							</li>

// 							{/* Profile avatar */}
// 							<li className="relative">
// 								<button
// 									type="button"
// 									onClick={() => setProfileOpen((v) => !v)}
// 									className="w-9 h-9 rounded-full overflow-hidden cursor-pointer focus:outline-none border border-accent"
// 								>
// 									{avatarUrl ? (
// 										<Image
// 											src={avatarUrl}
// 											alt={displayName}
// 											className="object-cover w-full h-full"
// 											width={36}
// 											height={36}
// 										/>
// 									) : (
// 										<div className="flex h-full w-full items-center justify-center bg-surface-elevated text-sm font-bold text-white">
// 											{getInitials(displayName)}
// 										</div>
// 									)}
// 								</button>

// 								{profileOpen && (
// 									<div className="absolute right-0 mt-2 w-48 rounded-lg bg-surface-elevated shadow-lg z-50 overflow-hidden">
// 										{profileNavItems.map((item) => {
// 											const Icon = item.icon;

// 											return (
// 												<Link
// 													key={item.href}
// 													href={item.href}
// 													onClick={() =>
// 														setProfileOpen(false)
// 													}
// 													className="block px-4 py-2 hover:bg-surface-neutral"
// 												>
// 													<Icon className="w-4 h-4 inline mr-2" />
// 													{item.label}
// 												</Link>
// 											);
// 										})}

// 										<button
// 											type="button"
// 											onClick={logout}
// 											className="w-full text-left px-4 py-2 hover:bg-surface-neutral"
// 										>
// 											<LogOut className="w-4 h-4 inline mr-2" />
// 											Log out
// 										</button>
// 									</div>
// 								)}
// 							</li>
// 						</>
// 					)}
// 				</ul>

// 				{/* Mobile */}
// 				<div className="md:hidden flex items-center gap-4">
// 					{user && (
// 						<button
// 							type="button"
// 							onClick={() => setMobileNotifOpen(true)}
// 							className="relative"
// 						>
// 							<Bell />

// 							{unreadCount > 0 && (
// 								<span className="absolute -top-2 -right-2 bg-accent text-xs w-5 h-5 flex items-center justify-center rounded-full">
// 									{unreadCount}
// 								</span>
// 							)}
// 						</button>
// 					)}

// 					<button
// 						type="button"
// 						onClick={() => setOpen((v) => !v)}
// 						className="md:hidden"
// 					>
// 						<Menu className="w-6 h-6" />
// 					</button>
// 				</div>
// 			</div>

// 			{mobileNotifOpen && (
// 				<MobileNotifications
// 					onClose={() => setMobileNotifOpen(false)}
// 				/>
// 			)}

// 			{/* Mobile dropdown */}
// 			{open && (
// 				<div className="md:hidden mt-4 space-y-3 px-6">
// 					{visibleNavItems.map((item) => (
// 						<Link
// 							key={item.href}
// 							href={item.href}
// 							onClick={() => setOpen(false)}
// 							className="block text-muted hover:text-white"
// 						>
// 							{item.name}
// 						</Link>
// 					))}

// 					{user && (
// 						<>
// 							<Link
// 								href="/profile"
// 								onClick={() => setOpen(false)}
// 								className="block text-muted hover:text-white"
// 							>
// 								Profile
// 							</Link>

// 							<Link
// 								href="/my-diary"
// 								onClick={() => setOpen(false)}
// 								className="block text-muted hover:text-white"
// 							>
// 								My Diary
// 							</Link>

// 							<Link
// 								href="/friends"
// 								onClick={() => setOpen(false)}
// 								className="block text-muted hover:text-white"
// 							>
// 								My Friends
// 							</Link>

// 							<Link
// 								href="/settings"
// 								onClick={() => setOpen(false)}
// 								className="block text-muted hover:text-white"
// 							>
// 								Settings
// 							</Link>

// 							<button
// 								type="button"
// 								onClick={logout}
// 								className="block w-full text-left text-gray-300 hover:text-white"
// 							>
// 								Log out
// 							</button>
// 						</>
// 					)}
// 				</div>
// 			)}
// 		</nav>
// 	);
// }

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

	const loadNotificationCount = useCallback(
		async (userId: string) => {
			const { count, error } = await supabase
				.from("diary_access_requests")
				.select("id", { count: "exact", head: true })
				.eq("owner_id", userId)
				.eq("status", "pending");

			if (error) {
				console.error(
					"Failed to load notification count:",
					error.message,
				);
				setUnreadCount(0);
				return;
			}

			setUnreadCount(count ?? 0);
		},
		[supabase],
	);

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
			.single();

		setDisplayName(
			profile?.display_name ||
				authUser.user_metadata?.full_name ||
				authUser.user_metadata?.name ||
				authUser.email ||
				"User",
		);

		setAvatarUrl(profile?.avatar_url || null);

		await loadNotificationCount(authUser.id);
	}, [supabase, loadNotificationCount]);

	useEffect(() => {
		loadUser();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(() => {
			loadUser();
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
				loadNotificationCount(user.id);
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
		router.push("/login");
		router.refresh();
	};

	const visibleNavItems = navItems.filter((item) => {
		if (item.auth === "guest") return !user;
		return false;
	});

	return (
		<nav className="bg-surface-dark text-white py-4 shadow-md sticky top-0 left-0 right-0 z-50">
			<div className="flex items-center justify-between px-6 lg:px-12">
				{/* Logo */}
				<Link href="/">
					<Image
						src="/logo.png"
						alt="Movie Diary Logo"
						width={2000}
						height={1000}
						className="w-[100px] h-auto"
						priority
					/>
				</Link>

				<NavbarSearch />

				{/* Desktop links */}
				<ul className="hidden md:flex items-center gap-6">
					{visibleNavItems.map((item) => (
						<li key={item.href}>
							<Link
								href={item.href}
								className={`${
									pathname === item.href
										? "text-accent"
										: "text-muted"
								} hover:text-white transition`}
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

										if (user.id) {
											await loadNotificationCount(
												user.id,
											);
										}
									}}
									className="relative"
								>
									<Bell className="w-5 h-5 text-muted hover:text-white" />

									{unreadCount > 0 && (
										<span className="absolute -top-2 -right-2 bg-accent text-xs w-5 h-5 flex items-center justify-center rounded-full">
											{unreadCount > 9
												? "9+"
												: unreadCount}
										</span>
									)}
								</button>

								{notifOpen && (
									<NotificationDropdown
										onClose={() => setNotifOpen(false)}
										onCountChange={setUnreadCount}
									/>
								)}
							</li>

							{/* Profile avatar */}
							<li className="relative">
								<button
									type="button"
									onClick={() => setProfileOpen((v) => !v)}
									className="w-9 h-9 rounded-full overflow-hidden cursor-pointer focus:outline-none border border-accent"
								>
									{avatarUrl ? (
										<Image
											src={avatarUrl}
											alt={displayName}
											className="object-cover w-full h-full"
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
									<div className="absolute right-0 mt-2 w-48 rounded-lg bg-surface-elevated shadow-lg z-50 overflow-hidden">
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
													<Icon className="w-4 h-4 inline mr-2" />
													{item.label}
												</Link>
											);
										})}

										<button
											type="button"
											onClick={logout}
											className="w-full text-left px-4 py-2 hover:bg-surface-neutral"
										>
											<LogOut className="w-4 h-4 inline mr-2" />
											Log out
										</button>
									</div>
								)}
							</li>
						</>
					)}
				</ul>

				{/* Mobile */}
				<div className="md:hidden flex items-center gap-4">
					{user && (
						<button
							type="button"
							onClick={async () => {
								await loadNotificationCount(user.id);
								setMobileNotifOpen(true);
							}}
							className="relative"
						>
							<Bell />

							{unreadCount > 0 && (
								<span className="absolute -top-2 -right-2 bg-accent text-xs w-5 h-5 flex items-center justify-center rounded-full">
									{unreadCount > 9 ? "9+" : unreadCount}
								</span>
							)}
						</button>
					)}

					<button
						type="button"
						onClick={() => setOpen((v) => !v)}
						className="md:hidden"
					>
						<Menu className="w-6 h-6" />
					</button>
				</div>
			</div>

			{mobileNotifOpen && (
				<MobileNotifications
					onClose={() => setMobileNotifOpen(false)}
				/>
			)}

			{/* Mobile dropdown */}
			{open && (
				<div className="md:hidden mt-4 space-y-3 px-6">
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