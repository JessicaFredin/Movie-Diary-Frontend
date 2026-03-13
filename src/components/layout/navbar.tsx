"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Menu, User, Notebook, Users, Settings, LogOut, Bell } from "lucide-react";

import NotificationDropdown from "@/components/notifications/notification-dropdown";
import MobileNotifications from "@/components/notifications/mobile-notifications";

type NotificationType =
	| "friend_request"
	| "friend_accept"
	| "like"
	| "comment"
	| "diary_request";

interface Notification {
	id: number;
	type: NotificationType;
	user: string;
	message: string;
	time: string;
	unread: boolean;
}

const mockNotifications: Notification[] = [
	{
		id: 1,
		type: "friend_request",
		user: "Emma Torres",
		message: "sent you a friend request",
		time: "2h ago",
		unread: true,
	},
	{
		id: 2,
		type: "like",
		user: "James Okoro",
		message: "liked your review of Dune: Part Two",
		time: "5h ago",
		unread: true,
	},
	{
		id: 3,
		type: "comment",
		user: "Mia Chen",
		message: "commented on your review",
		time: "1d ago",
		unread: false,
	},
];


const navItems = [
	{ name: "Login", href: "/login", auth: "guest" },
	{ name: "Signup", href: "/signup", auth: "guest" },
];

const profileNavItems = [
	{ label: "Profile", href: "/profile", icon: User },
	{ label: "My Diary", href: "/my-diary", icon: Notebook },
	{ label: "My Friends", href: "/friends", icon: Users },
	{ label: "Settings", href: "/settings", icon: Settings },
];

export default function Navbar() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const { user, logout } = useAuth();
	const [profileOpen, setProfileOpen] = useState(false);

	const [notifOpen, setNotifOpen] = useState(false);
	const [mobileNotifOpen, setMobileNotifOpen] = useState(false);

	const unreadCount = mockNotifications.filter((n) => n.unread).length;

	const visibleNavItems = navItems.filter((item) => {
		if (item.auth === "guest") return !user;
		return false;
	});

	return (
		<nav className="bg-surface-dark text-white py-4 shadow-md">
			<div className=" flex items-center justify-between px-6 lg:px-12">
				{/* Logo */}
				<Link href="/">
					<Image
						src="/logo.png"
						alt="Movie Diary Logo"
						width={40}
						height={40}
						priority
					/>
				</Link>

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

					{/* Avatar */}
					{user && (
						<>
							{/* Bell */}
							<li className="relative">
								<button
									onClick={() => setNotifOpen((v) => !v)}
									className="relative"
								>
									<Bell className="w-5 h-5 text-muted hover:text-white" />

									{unreadCount > 0 && (
										<span className="absolute -top-2 -right-2 bg-accent text-xs w-5 h-5 flex items-center justify-center rounded-full">
											{unreadCount}
										</span>
									)}
								</button>

								{notifOpen && (
									<NotificationDropdown
										onClose={() => setNotifOpen(false)}
									/>
								)}
							</li>

							<li className="relative">
								<button
									onClick={() => setProfileOpen((v) => !v)}
									className="w-9 h-9 rounded-full overflow-hidden cursor-pointer focus:outline-none border border-accent"
								>
									<Image
										src={
											user.avatar ?? "/images/avatar.jpg"
										}
										alt={user.name}
										width={36}
										height={36}
										className="object-cover w-full h-full"
									/>
								</button>

								{profileOpen && (
									<div className="absolute right-0 mt-2 w-48 rounded-lg bg-surface-elevated shadow-lg z-50">
										{profileNavItems.map((item) => (
											<Link
												key={item.href}
												href={item.href}
												onClick={() =>
													setProfileOpen(false)
												}
												className="block px-4 py-2 hover:bg-surface-neutral"
											>
												{item.icon && (
													<item.icon className="w-4 h-4 inline mr-2" />
												)}
												{item.label}
											</Link>
										))}

										<button
											onClick={() => {
												logout();
												setProfileOpen(false);
											}}
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
							onClick={() => setMobileNotifOpen(true)}
							className="relative"
						>
							<Bell />
							{unreadCount > 0 && (
								<span className="absolute -top-2 -right-2 bg-accent text-xs w-5 h-5 flex items-center justify-center rounded-full">
									{unreadCount}
								</span>
							)}
						</button>
					)}

					<button
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
				<div className="md:hidden mt-4 space-y-3 px-2">
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
						<button
							onClick={() => {
								logout();
								setOpen(false);
							}}
							className="block w-full text-left text-gray-300 hover:text-white"
						>
							Log out
						</button>
					)}
				</div>
			)}
		</nav>
	);
}
