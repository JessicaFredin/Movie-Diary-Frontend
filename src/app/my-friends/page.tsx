"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
	ArrowUpRight,
	Ban,
	Calendar,
	Eye,
	Film,
	Heart,
	List,
	Lock,
	MessageCircle,
	MoreHorizontal,
	Search,
	Send,
	Share2,
	Sparkles,
	Tv,
	UserMinus,
	UserPlus,
	Users,
	VolumeX,
	X,
	Trash2,
} from "lucide-react";

type Friend = {
	id: number;
	name: string;
	username: string;
	avatarUrl?: string;
	hasPublicDiary: boolean;
	isOnline: boolean;
	lastSeen?: string;
	isFriend: boolean;
	isMuted?: boolean;

	movieCount: number;
	tvCount: number;
	reviewCount: number;
	watchedThisWeek: number;
	mutual: number;
	tasteMatch: number;
	topGenres: string[];
	recentActivity: string;

	since: string;
	lastMessage?: string;
	lastMessageTime?: string;
	unreadCount?: number;
};

type DiaryItem = {
	id: number;
	type: "movie" | "tv";
	title: string;
	added: string;
	season?: number;
	episode?: number;
	rating?: number;
};

type Activity = {
	id: number;
	userId: number;
	user: string;
	action: string;
	title: string;
	time: string;
};

type ChatMessage = {
	id: number;
	from: "me" | "them";
	text: string;
	time: string;
	date?: string;
};

const AVATAR_COLORS = [
	"from-rose-500 to-red-700",
	"from-indigo-500 to-purple-700",
	"from-emerald-500 to-teal-700",
	"from-orange-500 to-red-700",
	"from-purple-500 to-fuchsia-700",
	"from-sky-500 to-blue-700",
];

const INITIAL_FRIENDS: Friend[] = [
	{
		id: 1,
		name: "Alex Rivera",
		username: "@alexr",
		avatarUrl: "https://i.pravatar.cc/150?img=1",
		hasPublicDiary: true,
		isOnline: true,
		isFriend: true,
		movieCount: 412,
		tvCount: 67,
		reviewCount: 289,
		watchedThisWeek: 4,
		mutual: 38,
		tasteMatch: 87,
		topGenres: ["Sci-Fi", "Drama", "Thriller"],
		recentActivity: "Watched Dune: Part Two",
		since: "Jan 2023",
		lastMessage: "You HAVE to watch this 😭",
		lastMessageTime: "18:42",
		unreadCount: 2,
	},
	{
		id: 2,
		name: "Mia Chen",
		username: "@miachen",
		avatarUrl: "https://i.pravatar.cc/150?img=5",
		hasPublicDiary: true,
		isOnline: false,
		lastSeen: "Recently online",
		isFriend: false,
		movieCount: 631,
		tvCount: 112,
		reviewCount: 402,
		watchedThisWeek: 1,
		mutual: 61,
		tasteMatch: 92,
		topGenres: ["Thriller", "Indie", "Mystery"],
		recentActivity: "Rated The Holdovers",
		since: "Mar 2022",
		lastMessage: "That ending was wild",
		lastMessageTime: "Yesterday",
	},
	{
		id: 3,
		name: "James Okoro",
		username: "@jokoro",
		avatarUrl: "https://i.pravatar.cc/150?img=8",
		hasPublicDiary: false,
		isOnline: true,
		isFriend: true,
		movieCount: 198,
		tvCount: 34,
		reviewCount: 87,
		watchedThisWeek: 3,
		mutual: 28,
		tasteMatch: 74,
		topGenres: ["Action", "Comedy", "Sci-Fi"],
		recentActivity: "Added The Zone of Interest to watchlist",
		since: "Sep 2023",
		lastMessage: "Any recs?",
		lastMessageTime: "21:10",
		unreadCount: 1,
	},
	{
		id: 4,
		name: "Sarah Kim",
		username: "@sarahk",
		avatarUrl: "https://i.pravatar.cc/150?img=15",
		hasPublicDiary: true,
		isOnline: false,
		lastSeen: "2 hours ago",
		isFriend: false,
		movieCount: 845,
		tvCount: 203,
		reviewCount: 510,
		watchedThisWeek: 2,
		mutual: 44,
		tasteMatch: 78,
		topGenres: ["Drama", "Romance", "Indie"],
		recentActivity: "Reviewed Poor Things",
		since: "Nov 2021",
		lastMessage: "Starting episode 1 now",
		lastMessageTime: "19:01",
	},
	{
		id: 5,
		name: "Tom Nguyen",
		username: "@tomn",
		avatarUrl: "https://i.pravatar.cc/150?img=12",
		hasPublicDiary: true,
		isOnline: true,
		isFriend: true,
		movieCount: 324,
		tvCount: 89,
		reviewCount: 156,
		watchedThisWeek: 6,
		mutual: 19,
		tasteMatch: 71,
		topGenres: ["Horror", "Crime", "Thriller"],
		recentActivity: "Watched Longlegs",
		since: "Jun 2023",
		lastMessage: "This one was actually scary",
		lastMessageTime: "Today",
	},
	{
		id: 6,
		name: "Luna Petrova",
		username: "@lunap",
		avatarUrl: "https://i.pravatar.cc/150?img=32",
		hasPublicDiary: true,
		isOnline: true,
		isFriend: true,
		movieCount: 567,
		tvCount: 145,
		reviewCount: 341,
		watchedThisWeek: 5,
		mutual: 52,
		tasteMatch: 95,
		topGenres: ["Fantasy", "Drama", "Animation"],
		recentActivity: "Favorited an episode",
		since: "Feb 2022",
		lastMessage: "Comfort show night?",
		lastMessageTime: "16:28",
	},
];

const ACTIVITY_FEED: Activity[] = [
	{
		id: 1,
		userId: 1,
		user: "Alex",
		action: "watched",
		title: "Dune: Part Two",
		time: "2h ago",
	},
	{
		id: 2,
		userId: 4,
		user: "Sarah",
		action: "reviewed",
		title: "Poor Things",
		time: "5h ago",
	},
	{
		id: 3,
		userId: 3,
		user: "James",
		action: "added to watchlist",
		title: "The Zone of Interest",
		time: "1d ago",
	},
	{
		id: 4,
		userId: 6,
		user: "Luna",
		action: "rated",
		title: "Spirited Away",
		time: "2d ago",
	},
];

const DIARY_ITEMS: Record<number, DiaryItem[]> = {
	1: [
		{
			id: 1,
			type: "movie",
			title: "Dune: Part Two",
			added: "2 days ago",
			rating: 9,
		},
		{
			id: 2,
			type: "tv",
			title: "The Bear",
			added: "4 days ago",
			season: 2,
			episode: 5,
			rating: 8.5,
		},
	],
	2: [
		{
			id: 3,
			type: "movie",
			title: "The Holdovers",
			added: "Yesterday",
			rating: 8,
		},
	],
	4: [
		{
			id: 4,
			type: "movie",
			title: "Poor Things",
			added: "5h ago",
			rating: 8.5,
		},
	],
	5: [
		{
			id: 5,
			type: "movie",
			title: "Longlegs",
			added: "Today",
			rating: 7,
		},
	],
	6: [
		{
			id: 6,
			type: "movie",
			title: "Spirited Away",
			added: "2d ago",
			rating: 10,
		},
	],
};

const CHAT_HISTORY: Record<number, ChatMessage[]> = {
	1: [
		{
			id: 1,
			from: "them",
			text: "Have you seen Dune Part Two?",
			time: "17:40",
			date: "Today",
		},
		{ id: 2, from: "me", text: "Not yet 👀", time: "17:45" },
		{
			id: 3,
			from: "them",
			text: "You HAVE to watch this 😭",
			time: "18:42",
		},
	],
	2: [
		{
			id: 1,
			from: "them",
			text: "That ending was wild",
			time: "20:55",
			date: "Yesterday",
		},
		{ id: 2, from: "me", text: "I know right??", time: "21:02" },
	],
	3: [
		{
			id: 1,
			from: "them",
			text: "Any recs?",
			time: "21:10",
			date: "Today",
		},
	],
	5: [
		{
			id: 1,
			from: "them",
			text: "This one was actually scary",
			time: "13:11",
			date: "Today",
		},
	],
	6: [
		{
			id: 1,
			from: "them",
			text: "Comfort show night?",
			time: "16:28",
			date: "Today",
		},
	],
};

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

function getAvatarColor(id: number): string {
	return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function getOnlineLabel(friend: Friend): string {
	if (friend.isOnline) return "Online now";
	return friend.lastSeen ?? "Offline";
}

function getTabCount(tab: string, friends: Friend[]): number {
	if (tab === "Friends")
		return friends.filter((friend) => friend.isFriend).length;
	if (tab === "Discover")
		return friends.filter((friend) => !friend.isFriend).length;
	if (tab === "Online")
		return friends.filter((friend) => friend.isOnline).length;
	return friends.length;
}

export default function FriendsPage() {
	const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
	const [activeTab, setActiveTab] = useState("All");
	const [search, setSearch] = useState("");
	const [openMenu, setOpenMenu] = useState<number | null>(null);
	const [selectedCompare, setSelectedCompare] = useState<Friend | null>(null);
	const [diaryFriend, setDiaryFriend] = useState<Friend | null>(null);
	const [chatOpen, setChatOpen] = useState(false);
	const [activeChat, setActiveChat] = useState<Friend | null>(null);
	const [draftMessage, setDraftMessage] = useState("");
	const [chatMessages, setChatMessages] =
		useState<Record<number, ChatMessage[]>>(CHAT_HISTORY);

	const menuRef = useRef<HTMLDivElement | null>(null);
	const bottomRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent): void {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setOpenMenu(null);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [activeChat, chatMessages]);

	useEffect(() => {
		const interval = window.setInterval(() => {
			setFriends((currentFriends) =>
				currentFriends.map((friend) =>
					Math.random() > 0.88
						? { ...friend, isOnline: !friend.isOnline }
						: friend,
				),
			);
		}, 7000);

		return () => window.clearInterval(interval);
	}, []);

	const filteredFriends = useMemo(() => {
		const cleanSearch = search.trim().toLowerCase();

		return friends.filter((friend) => {
			if (activeTab === "Friends" && !friend.isFriend) return false;
			if (activeTab === "Discover" && friend.isFriend) return false;
			if (activeTab === "Online" && !friend.isOnline) return false;

			if (!cleanSearch) return true;

			return (
				friend.name.toLowerCase().includes(cleanSearch) ||
				friend.username.toLowerCase().includes(cleanSearch) ||
				friend.topGenres.some((genre) =>
					genre.toLowerCase().includes(cleanSearch),
				)
			);
		});
	}, [friends, activeTab, search]);

	const friendCount = friends.filter((friend) => friend.isFriend).length;
	const onlineCount = friends.filter((friend) => friend.isOnline).length;
	const averageMatch = Math.round(
		friends.reduce((total, friend) => total + friend.tasteMatch, 0) /
			friends.length,
	);

	function toggleFriend(id: number): void {
		setFriends((currentFriends) =>
			currentFriends.map((friend) =>
				friend.id === id
					? { ...friend, isFriend: !friend.isFriend }
					: friend,
			),
		);
		setOpenMenu(null);
	}

	function toggleMute(id: number): void {
		setFriends((currentFriends) =>
			currentFriends.map((friend) =>
				friend.id === id
					? { ...friend, isMuted: !friend.isMuted }
					: friend,
			),
		);
		setOpenMenu(null);
	}

	function removeFriend(id: number): void {
		setFriends((currentFriends) =>
			currentFriends.map((friend) =>
				friend.id === id ? { ...friend, isFriend: false } : friend,
			),
		);
		setOpenMenu(null);
	}

	function openChat(friend: Friend): void {
		setActiveChat(friend);
		setChatOpen(true);
		setOpenMenu(null);
	}

	function sendMessage(): void {
		if (!activeChat || !draftMessage.trim()) return;

		const newMessage: ChatMessage = {
			id: Date.now(),
			from: "me",
			text: draftMessage.trim(),
			time: new Intl.DateTimeFormat("en", {
				hour: "2-digit",
				minute: "2-digit",
			}).format(new Date()),
		};

		setChatMessages((currentMessages) => ({
			...currentMessages,
			[activeChat.id]: [
				...(currentMessages[activeChat.id] ?? []),
				newMessage,
			],
		}));

		setDraftMessage("");
	}

	return (
		<main className="relative min-h-screen overflow-hidden bg-black px-5 py-10 text-white md:px-12 lg:px-20">
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute left-[-140px] top-[-160px] h-[420px] w-[420px] rounded-full bg-accent/20 blur-[120px]" />
				<div className="absolute right-[-160px] top-[180px] h-[420px] w-[420px] rounded-full bg-red-700/20 blur-[130px]" />
				<div className="absolute bottom-[-220px] left-[35%] h-[420px] w-[420px] rounded-full bg-white/5 blur-[120px]" />
			</div>

			<section className="relative z-10 mx-auto max-w-7xl">
				<div className="mb-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-8">
					<div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
						<div>
							<div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-bold text-accent">
								<Users className="h-4 w-4" />
								Social circle
							</div>

							<h1 className="text-4xl font-black tracking-tight md:text-6xl">
								My friends
							</h1>

							<p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
								See what your friends are watching, compare your
								taste, open their public diaries and keep the
								movie conversation going.
							</p>
						</div>

						<div className="grid grid-cols-3 gap-3 sm:min-w-[420px]">
							<HeroStat label="Friends" value={friendCount} />
							<HeroStat label="Online" value={onlineCount} />
							<HeroStat
								label="Avg match"
								value={`${averageMatch}%`}
							/>
						</div>
					</div>
				</div>

				<div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div className="relative w-full lg:max-w-lg">
						<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
						<input
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search by name, username or genre..."
							className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-accent/70 focus:bg-accent/10"
						/>

						{search && (
							<button
								type="button"
								onClick={() => setSearch("")}
								className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 transition hover:text-white"
								aria-label="Clear search"
							>
								<X className="h-4 w-4" />
							</button>
						)}
					</div>

					<div className="flex w-full gap-2 overflow-x-auto rounded-full border border-white/10 bg-white/[0.04] p-1 lg:w-fit">
						{["All", "Friends", "Discover", "Online"].map((tab) => (
							<button
								key={tab}
								type="button"
								onClick={() => setActiveTab(tab)}
								className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition ${
									activeTab === tab
										? "bg-accent text-white shadow-lg shadow-accent/25"
										: "text-white/55 hover:bg-white/[0.06] hover:text-white"
								}`}
							>
								{tab}
								<span className="ml-2 text-xs opacity-70">
									{getTabCount(tab, friends)}
								</span>
							</button>
						))}
					</div>
				</div>

				<div className="grid gap-8 xl:grid-cols-[1fr_360px]">
					<div>
						{filteredFriends.length === 0 ? (
							<div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
								<p className="text-sm text-white/55">
									No friends found.
								</p>
							</div>
						) : (
							<div className="grid gap-6 md:grid-cols-2">
								{filteredFriends.map((friend, index) => (
									<FriendCard
										key={friend.id}
										friend={friend}
										index={index}
										openMenu={openMenu}
										menuRef={menuRef}
										onToggleMenu={() =>
											setOpenMenu(
												openMenu === friend.id
													? null
													: friend.id,
											)
										}
										onToggleFriend={() =>
											toggleFriend(friend.id)
										}
										onRemoveFriend={() =>
											removeFriend(friend.id)
										}
										onToggleMute={() =>
											toggleMute(friend.id)
										}
										onOpenChat={() => openChat(friend)}
										onOpenCompare={() =>
											setSelectedCompare(friend)
										}
										onOpenDiary={() => {
											setDiaryFriend(friend);
											setOpenMenu(null);
										}}
									/>
								))}
							</div>
						)}
					</div>

					<aside className="space-y-6">
						<div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
							<div className="mb-5 flex items-center justify-between">
								<div>
									<h2 className="text-xl font-black">
										Recent activity
									</h2>
									<p className="mt-1 text-xs text-white/45">
										What your circle is watching
									</p>
								</div>

								<Sparkles className="h-5 w-5 text-accent" />
							</div>

							<div className="space-y-3">
								{ACTIVITY_FEED.map((activity) => (
									<ActivityItem
										key={activity.id}
										activity={activity}
										friend={friends.find(
											(item) =>
												item.id === activity.userId,
										)}
									/>
								))}
							</div>
						</div>

						<div className="rounded-3xl border border-accent/20 bg-accent/10 p-5">
							<h2 className="text-lg font-black">
								Find better matches
							</h2>

							<p className="mt-3 text-sm leading-7 text-white/65">
								Use Discover to find people with similar taste.
								The match score is based on shared titles,
								genres and rating style.
							</p>
						</div>
					</aside>
				</div>
			</section>

			<button
				type="button"
				onClick={() => setChatOpen((current) => !current)}
				className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-2xl shadow-accent/30 transition hover:scale-105 hover:bg-accent-hover"
				aria-label="Open messages"
			>
				<MessageCircle className="h-6 w-6" />

				{friends.some((friend) => (friend.unreadCount ?? 0) > 0) && (
					<span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-black bg-white px-1 text-xs font-black text-accent">
						{friends.reduce(
							(total, friend) =>
								total + (friend.unreadCount ?? 0),
							0,
						)}
					</span>
				)}
			</button>

			{chatOpen && (
				<ChatPanel
					friends={friends}
					activeChat={activeChat}
					messages={
						activeChat ? (chatMessages[activeChat.id] ?? []) : []
					}
					draftMessage={draftMessage}
					bottomRef={bottomRef}
					onClose={() => setChatOpen(false)}
					onBack={() => setActiveChat(null)}
					onSelectFriend={setActiveChat}
					onDraftChange={setDraftMessage}
					onSend={sendMessage}
				/>
			)}

			{selectedCompare && (
				<CompareModal
					friend={selectedCompare}
					onClose={() => setSelectedCompare(null)}
				/>
			)}

			{diaryFriend && (
				<DiaryModal
					friend={diaryFriend}
					items={DIARY_ITEMS[diaryFriend.id] ?? []}
					onClose={() => setDiaryFriend(null)}
				/>
			)}

			<style jsx global>{`
				@keyframes friendCardIn {
					from {
						opacity: 0;
						transform: translateY(12px) scale(0.98);
					}
					to {
						opacity: 1;
						transform: translateY(0) scale(1);
					}
				}

				.friend-card-in {
					animation: friendCardIn 0.45s ease forwards;
				}
			`}</style>
		</main>
	);
}

function HeroStat({ label, value }: { label: string; value: number | string }) {
	return (
		<div className="rounded-3xl border border-white/10 bg-black/25 p-4 text-center">
			<p className="text-2xl font-black">{value}</p>
			<p className="mt-1 text-xs font-bold uppercase tracking-wide text-white/40">
				{label}
			</p>
		</div>
	);
}

function FriendCard({
	friend,
	index,
	openMenu,
	menuRef,
	onToggleMenu,
	onToggleFriend,
	onRemoveFriend,
	onToggleMute,
	onOpenChat,
	onOpenCompare,
	onOpenDiary,
}: {
	friend: Friend;
	index: number;
	openMenu: number | null;
	menuRef: React.RefObject<HTMLDivElement | null>;
	onToggleMenu: () => void;
	onToggleFriend: () => void;
	onRemoveFriend: () => void;
	onToggleMute: () => void;
	onOpenChat: () => void;
	onOpenCompare: () => void;
	onOpenDiary: () => void;
}) {
	const menuOpen = openMenu === friend.id;

	return (
		<div
			style={{ animationDelay: `${index * 55}ms` }}
			className="friend-card-in group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 opacity-0 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-white/[0.055] hover:shadow-accent/10"
		>
			<div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-accent/15 to-transparent opacity-0 transition group-hover:opacity-100" />

			<div className="relative z-10">
				<div className="mb-5 flex items-start justify-between gap-4">
					<div className="flex min-w-0 items-center gap-4">
						<Avatar friend={friend} size="large" />

						<div className="min-w-0">
							<div className="flex items-center gap-2">
								<h3 className="truncate text-lg font-black">
									{friend.name}
								</h3>

								{friend.isMuted && (
									<VolumeX className="h-4 w-4 text-white/35" />
								)}
							</div>

							<p className="text-sm text-white/45">
								{friend.username}
							</p>

							<p className="mt-1 text-xs font-semibold text-white/45">
								{getOnlineLabel(friend)}
							</p>
						</div>
					</div>

					<div
						ref={menuOpen ? menuRef : undefined}
						className="relative"
					>
						<button
							type="button"
							onClick={onToggleMenu}
							className="flex h-10 w-10 items-center justify-center rounded-full bg-black/25 text-white/50 transition hover:bg-white/10 hover:text-white"
							aria-label="Open friend menu"
						>
							<MoreHorizontal className="h-5 w-5" />
						</button>

						{menuOpen && (
							<div className="absolute right-0 top-12 z-40 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#111116]/95 p-2 shadow-2xl backdrop-blur-xl">
								<MenuItem
									icon={<Eye className="h-4 w-4" />}
									label="Visit profile"
								/>
								<MenuItem
									icon={<List className="h-4 w-4" />}
									label="View diary"
									onClick={onOpenDiary}
								/>
								<MenuItem
									icon={<MessageCircle className="h-4 w-4" />}
									label="Send message"
									onClick={onOpenChat}
								/>
								<MenuItem
									icon={<Share2 className="h-4 w-4" />}
									label="Share profile"
								/>
								<MenuItem
									icon={<VolumeX className="h-4 w-4" />}
									label={
										friend.isMuted
											? "Unmute activity"
											: "Mute activity"
									}
									onClick={onToggleMute}
								/>

								<div className="my-1 h-px bg-white/10" />

								{friend.isFriend && (
									<MenuItem
										icon={<UserMinus className="h-4 w-4" />}
										label="Remove friend"
										danger
										onClick={onRemoveFriend}
									/>
								)}

								<MenuItem
									icon={<Ban className="h-4 w-4" />}
									label="Block user"
									danger
								/>
							</div>
						)}
					</div>
				</div>

				<div className="mb-5 flex items-center gap-3">
					<MatchRing value={friend.tasteMatch} />

					<div>
						<p className="text-sm font-black">
							{friend.tasteMatch}% taste match
						</p>
						<p className="mt-1 text-xs leading-5 text-white/45">
							{friend.mutual} mutual titles · friends since{" "}
							{friend.since}
						</p>
					</div>
				</div>

				<div className="mb-5 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
					<MiniStat label="Movies" value={friend.movieCount} />
					<MiniStat label="Shows" value={friend.tvCount} />
					<MiniStat label="Reviews" value={friend.reviewCount} />
				</div>

				<div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
					<p className="text-xs font-bold uppercase tracking-wide text-white/35">
						Recent activity
					</p>
					<p className="mt-2 line-clamp-1 text-sm font-semibold">
						{friend.recentActivity}
					</p>
					<p className="mt-1 text-xs text-white/45">
						{friend.watchedThisWeek} watched this week
					</p>
				</div>

				<div className="mb-6 flex flex-wrap gap-2">
					{friend.topGenres.map((genre) => (
						<span
							key={genre}
							className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-xs font-bold text-white/65"
						>
							{genre}
						</span>
					))}
				</div>

				<div className="flex gap-3">
					<button
						type="button"
						className="flex-1 rounded-full bg-accent px-4 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
					>
						Visit Profile
					</button>

					<button
						type="button"
						onClick={onOpenCompare}
						className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white transition hover:border-accent/50 hover:bg-accent/10"
					>
						Compare
						<ArrowUpRight className="h-4 w-4" />
					</button>

					<button
						type="button"
						onClick={onToggleFriend}
						className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition ${
							friend.isFriend
								? "border border-white/10 bg-white/[0.04] text-white/60 hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
								: "bg-white text-black hover:bg-white/85"
						}`}
						title={friend.isFriend ? "Remove friend" : "Add friend"}
					>
						{friend.isFriend ? (
							<UserMinus className="h-5 w-5" />
						) : (
							<UserPlus className="h-5 w-5" />
						)}
					</button>
				</div>
			</div>
		</div>
	);
}

function Avatar({
	friend,
	size = "small",
}: {
	friend: Friend;
	size?: "small" | "large";
}) {
	const sizeClass = size === "large" ? "h-16 w-16" : "h-10 w-10";

	return (
		<div className="relative shrink-0">
			{friend.avatarUrl ? (
				<img
					src={friend.avatarUrl}
					alt={friend.name}
					className={`${sizeClass} rounded-full object-cover ring-2 ring-white/10`}
				/>
			) : (
				<div
					className={`${sizeClass} flex items-center justify-center rounded-full bg-gradient-to-br ${getAvatarColor(
						friend.id,
					)} font-black text-white ring-2 ring-white/10`}
				>
					{getInitials(friend.name)}
				</div>
			)}

			{friend.isOnline && (
				<span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-black bg-green-400 shadow-lg shadow-green-400/40" />
			)}
		</div>
	);
}

function MatchRing({ value }: { value: number }) {
	const radius = 24;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (value / 100) * circumference;

	return (
		<div className="relative h-16 w-16 shrink-0">
			<svg className="h-full w-full -rotate-90">
				<circle
					cx="32"
					cy="32"
					r={radius}
					stroke="rgba(255,255,255,0.10)"
					strokeWidth="6"
					fill="none"
				/>
				<circle
					cx="32"
					cy="32"
					r={radius}
					stroke="currentColor"
					strokeWidth="6"
					fill="none"
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap="round"
					className="text-accent transition-all duration-700"
				/>
			</svg>

			<div className="absolute inset-0 flex items-center justify-center text-xs font-black">
				{value}%
			</div>
		</div>
	);
}

function MiniStat({ label, value }: { label: string; value: number }) {
	return (
		<div className="border-r border-white/10 p-3 text-center last:border-r-0">
			<p className="text-lg font-black">{value}</p>
			<p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-white/35">
				{label}
			</p>
		</div>
	);
}

function ActivityItem({
	activity,
	friend,
}: {
	activity: Activity;
	friend?: Friend;
}) {
	return (
		<div className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 transition hover:border-accent/40 hover:bg-white/[0.04]">
			{friend ? (
				<Avatar friend={friend} />
			) : (
				<div className="h-10 w-10 rounded-full bg-white/10" />
			)}

			<div className="min-w-0 flex-1">
				<p className="text-sm leading-6 text-white/65">
					<span className="font-bold text-white">
						{activity.user}
					</span>{" "}
					{activity.action}{" "}
					<span className="font-bold text-white">
						{activity.title}
					</span>
				</p>
				<p className="mt-1 text-xs text-white/35">{activity.time}</p>
			</div>
		</div>
	);
}

function MenuItem({
	icon,
	label,
	danger,
	onClick,
}: {
	icon: ReactNode;
	label: string;
	danger?: boolean;
	onClick?: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
				danger
					? "text-red-300 hover:bg-red-500/15 hover:text-red-200"
					: "text-white/65 hover:bg-white/[0.06] hover:text-white"
			}`}
		>
			{icon}
			{label}
		</button>
	);
}

function ChatPanel({
	friends,
	activeChat,
	messages,
	draftMessage,
	bottomRef,
	onClose,
	onBack,
	onSelectFriend,
	onDraftChange,
	onSend,
}: {
	friends: Friend[];
	activeChat: Friend | null;
	messages: ChatMessage[];
	draftMessage: string;
	bottomRef: React.RefObject<HTMLDivElement | null>;
	onClose: () => void;
	onBack: () => void;
	onSelectFriend: (friend: Friend) => void;
	onDraftChange: (value: string) => void;
	onSend: () => void;
}) {
	return (
		<div className="fixed bottom-24 right-5 z-40 flex h-[620px] w-[calc(100vw-40px)] max-w-[390px] flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#101014]/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
			<div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
				<div className="min-w-0">
					<p className="font-black">
						{activeChat ? activeChat.name : "Messages"}
					</p>
					<p className="mt-0.5 text-xs text-white/40">
						{activeChat
							? getOnlineLabel(activeChat)
							: "Chat with your friends"}
					</p>
				</div>

				<div className="flex items-center gap-2">
					{activeChat && (
						<button
							type="button"
							onClick={onBack}
							className="rounded-full px-3 py-1.5 text-xs font-bold text-white/55 transition hover:bg-white/10 hover:text-white"
						>
							Back
						</button>
					)}

					<button
						type="button"
						onClick={onClose}
						className="flex h-9 w-9 items-center justify-center rounded-full text-white/45 transition hover:bg-white/10 hover:text-white"
						aria-label="Close messages"
					>
						<X className="h-5 w-5" />
					</button>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto p-3">
				{!activeChat && (
					<div className="space-y-2">
						{friends
							.filter((friend) => friend.isFriend)
							.map((friend) => {
								const unread = (friend.unreadCount ?? 0) > 0;

								return (
									<button
										key={friend.id}
										type="button"
										onClick={() => onSelectFriend(friend)}
										className="flex w-full gap-3 rounded-2xl p-3 text-left transition hover:bg-white/[0.06]"
									>
										<div className="relative">
											<Avatar friend={friend} />

											{unread && (
												<span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-accent ring-2 ring-[#101014]" />
											)}
										</div>

										<div className="min-w-0 flex-1">
											<div className="flex items-center justify-between gap-3">
												<p
													className={`truncate text-sm ${
														unread
															? "font-black"
															: "font-bold"
													}`}
												>
													{friend.name}
												</p>

												<span className="shrink-0 text-xs text-white/35">
													{friend.lastMessageTime}
												</span>
											</div>

											<p
												className={`mt-1 truncate text-xs ${
													unread
														? "font-semibold text-white"
														: "text-white/45"
												}`}
											>
												{friend.lastMessage ??
													"No messages yet"}
											</p>
										</div>
									</button>
								);
							})}
					</div>
				)}

				{activeChat && (
					<div className="space-y-3">
						{messages.length === 0 && (
							<p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm text-white/45">
								No messages yet.
							</p>
						)}

						{messages.map((message) => (
							<div key={message.id}>
								{message.date && (
									<p className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-white/25">
										{message.date}
									</p>
								)}

								<div
									className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-6 ${
										message.from === "me"
											? "ml-auto bg-accent text-white"
											: "bg-white/[0.08] text-white/85"
									}`}
								>
									{message.text}

									<p className="mt-1 text-right text-[10px] text-white/55">
										{message.time}
									</p>
								</div>
							</div>
						))}

						<div ref={bottomRef} />
					</div>
				)}
			</div>

			{activeChat && (
				<div className="flex gap-2 border-t border-white/10 p-3">
					<input
						value={draftMessage}
						onChange={(event) => onDraftChange(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								onSend();
							}
						}}
						className="h-11 flex-1 rounded-full border border-white/10 bg-black/30 px-4 text-sm outline-none transition placeholder:text-white/35 focus:border-accent/70"
						placeholder="Type a message..."
					/>

					<button
						type="button"
						onClick={onSend}
						className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white transition hover:bg-accent-hover disabled:opacity-50"
						disabled={!draftMessage.trim()}
						aria-label="Send message"
					>
						<Send className="h-4 w-4" />
					</button>
				</div>
			)}
		</div>
	);
}

function CompareModal({
	friend,
	onClose,
}: {
	friend: Friend;
	onClose: () => void;
}) {
	return (
		<Modal onClose={onClose}>
			<div className="flex items-center gap-4">
				<Avatar friend={friend} size="large" />

				<div>
					<p className="text-sm font-bold uppercase tracking-wide text-accent">
						Taste breakdown
					</p>
					<h2 className="mt-1 text-2xl font-black">{friend.name}</h2>
				</div>
			</div>

			<div className="mt-8 grid grid-cols-[100px_1fr] gap-6">
				<MatchRing value={friend.tasteMatch} />

				<div>
					<p className="text-lg font-black">
						{friend.tasteMatch}% taste match
					</p>
					<p className="mt-2 leading-7 text-white/60">
						Strong alignment in{" "}
						<span className="font-bold text-white">
							{friend.topGenres.join(", ")}
						</span>{" "}
						with {friend.mutual} overlapping titles.
					</p>
				</div>
			</div>

			<div className="mt-8 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-black/25">
				<MiniStat label="Movies" value={friend.movieCount} />
				<MiniStat label="Shows" value={friend.tvCount} />
				<MiniStat label="Reviews" value={friend.reviewCount} />
			</div>
		</Modal>
	);
}

function DiaryModal({
	friend,
	items,
	onClose,
}: {
	friend: Friend;
	items: DiaryItem[];
	onClose: () => void;
}) {
	return (
		<Modal onClose={onClose}>
			<div className="flex items-center gap-4">
				<Avatar friend={friend} size="large" />

				<div>
					<p className="text-sm font-bold uppercase tracking-wide text-accent">
						Friend diary
					</p>
					<h2 className="mt-1 text-2xl font-black">
						{friend.name}’s diary
					</h2>
				</div>
			</div>

			{friend.hasPublicDiary ? (
				<div className="mt-8 space-y-3">
					{items.length === 0 ? (
						<p className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/55">
							No public diary entries yet.
						</p>
					) : (
						items.map((item) => (
							<div
								key={item.id}
								className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
							>
								<div className="flex items-start justify-between gap-4">
									<div>
										<div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-white/35">
											{item.type === "movie" ? (
												<Film className="h-4 w-4" />
											) : (
												<Tv className="h-4 w-4" />
											)}
											{item.type === "movie"
												? "Movie"
												: "TV Show"}
										</div>

										<p className="font-black">
											{item.title}
										</p>

										{item.type === "tv" &&
											item.season &&
											item.episode && (
												<p className="mt-1 text-xs text-white/45">
													S{item.season} · E
													{item.episode}
												</p>
											)}

										<p className="mt-1 text-xs text-white/45">
											Added {item.added}
										</p>
									</div>

									{item.rating && (
										<div className="flex items-center gap-1 rounded-full bg-black/30 px-3 py-1 text-sm font-bold">
											<Heart className="h-4 w-4 fill-accent text-accent" />
											{item.rating.toFixed(1)}
										</div>
									)}
								</div>
							</div>
						))
					)}
				</div>
			) : (
				<div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
					<Lock className="mx-auto mb-4 h-8 w-8 text-white/35" />
					<p className="font-bold">
						{friend.name}’s diary is private
					</p>
					<p className="mt-2 text-sm text-white/45">
						You can still compare taste and send messages.
					</p>
				</div>
			)}
		</Modal>
	);
}

function Modal({
	children,
	onClose,
}: {
	children: ReactNode;
	onClose: () => void;
}) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
			<button
				type="button"
				onClick={onClose}
				className="absolute inset-0 cursor-default"
				aria-label="Close modal"
			/>

			<div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[#101014]/95 p-6 shadow-2xl shadow-black/60 backdrop-blur-xl md:p-8">
				<button
					type="button"
					onClick={onClose}
					className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full text-white/45 transition hover:bg-white/10 hover:text-white"
					aria-label="Close"
				>
					<X className="h-5 w-5" />
				</button>

				{children}
			</div>
		</div>
	);
}
