"use client";

import { useEffect, useRef, useState } from "react";
import {
	MoreHorizontal,
	MessageCircle,
	List,
	Lock,
	VolumeX,
	Trash2,
	X,
	Send,
} from "lucide-react";

/* ---------------- TYPES ---------------- */

type Friend = {
	id: number;
	name: string;
	avatarUrl?: string;
	hasPublicDiary: boolean;
	isOnline: boolean;
	lastSeen?: string;

	movieCount: number;
	tvCount: number;

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
};

type ChatMessage = {
	id: number;
	from: "me" | "them";
	text: string;
	time: string;
	date?: string;
};

/* ---------------- MOCK DATA ---------------- */

const FRIENDS: Friend[] = [
	{
		id: 1,
		name: "Jane Doe",
		avatarUrl: "/images/avatar.jpg",
		hasPublicDiary: true,
		isOnline: true,
		movieCount: 42,
		tvCount: 12,
		lastMessage: "You HAVE to watch this 😭",
		lastMessageTime: "18:42",
		unreadCount: 2,
	},
	{
		id: 2,
		name: "Alex Johnson",
		hasPublicDiary: true,
		isOnline: false,
		lastSeen: "Recently online",
		movieCount: 18,
		tvCount: 5,
		lastMessage: "That ending was wild",
		lastMessageTime: "Yesterday",
	},
	{
		id: 3,
		name: "Maya Chen",
		hasPublicDiary: false,
		isOnline: false,
		lastSeen: "2 hours ago",
		movieCount: 7,
		tvCount: 1,
		lastMessage: "Any recs?",
		lastMessageTime: "21:10",
		unreadCount: 1,
	},
	{
		id: 4,
		name: "Daniel Brooks",
		hasPublicDiary: true,
		isOnline: true,
		movieCount: 33,
		tvCount: 9,
		lastMessage: "Starting episode 1 now",
		lastMessageTime: "19:01",
	},
];

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
		{
			id: 4,
			from: "me",
			text: "I will as soon as I finish my current series",
			time: "18:43",
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
};

const DIARY_ITEMS: DiaryItem[] = [
	{ id: 1, type: "movie", title: "Dune: Part Two", added: "2 days ago" },
];

/* ---------------- HELPERS ---------------- */

const AVATAR_COLORS = [
	"bg-rose-500",
	"bg-indigo-500",
	"bg-emerald-500",
	"bg-orange-500",
	"bg-purple-500",
	"bg-sky-500",
];

function getInitials(name: string) {
	return name
		.split(" ")
		.map((n) => n[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

function getAvatarColor(id: number) {
	return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

/* ---------------- PAGE ---------------- */

export default function FriendsPage() {
	const [openMenu, setOpenMenu] = useState<number | null>(null);
	const [chatOpen, setChatOpen] = useState(false);
	const [activeChat, setActiveChat] = useState<Friend | null>(null);
	const [diaryFriend, setDiaryFriend] = useState<Friend | null>(null);

	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [activeChat]);

	return (
		<main className="px-6 md:px-24 py-14 text-white relative">
			{/* FRIEND GRID */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{FRIENDS.map((friend) => (
					<div
						key={friend.id}
						className="relative rounded-2xl bg-white/[0.035] border border-white/10 hover:border-white/20 transition"
					>
						<div className="p-5 relative">
							<button
								onClick={() =>
									setOpenMenu(
										openMenu === friend.id
											? null
											: friend.id,
									)
								}
								className="absolute top-4 right-4 text-white/40 hover:text-white"
							>
								<MoreHorizontal size={18} />
							</button>

							{openMenu === friend.id && (
								<div className="absolute top-12 right-4 w-52 rounded-xl bg-[#0f0f14]/95 backdrop-blur border border-white/10 shadow-2xl z-20">
									<MenuItem
										icon={<List size={16} />}
										label="View diary"
										onClick={() => {
											setDiaryFriend(friend);
											setOpenMenu(null);
										}}
									/>
									<MenuItem
										icon={<VolumeX size={16} />}
										label="Mute activity"
									/>
									<div className="h-px bg-white/10 my-1" />
									<MenuItem
										icon={<Trash2 size={16} />}
										label="Remove friend"
										danger
									/>
								</div>
							)}

							<div className="flex items-center gap-4">
								<div className="relative">
									{friend.avatarUrl ? (
										<img
											src={friend.avatarUrl}
											className="w-14 h-14 rounded-full object-cover"
										/>
									) : (
										<div
											className={`w-14 h-14 rounded-full flex items-center justify-center font-semibold text-white ${getAvatarColor(
												friend.id,
											)}`}
										>
											{getInitials(friend.name)}
										</div>
									)}
								</div>

								<div className="flex-1">
									<p className="font-medium">{friend.name}</p>
									<p className="text-sm text-white/50">
										{friend.isOnline
											? "Online now"
											: (friend.lastSeen ?? "Offline")}
									</p>
									{friend.hasPublicDiary && (
										<p className="mt-1 text-xs text-white/40">
											🎬 {friend.movieCount} movies · 📺{" "}
											{friend.tvCount} shows
										</p>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* FLOATING CHAT BUTTON */}
			<button
				onClick={() => setChatOpen((v) => !v)}
				className="fixed bottom-6 right-6 z-40 rounded-full bg-[#FF414E] p-4 shadow-xl shadow-[#FF414E]/30 hover:scale-105 transition"
			>
				<MessageCircle />
			</button>

			{/* CHAT PANEL */}
			{chatOpen && (
				<div className="fixed bottom-24 right-6 w-80 bg-[#0f0f14]/95 backdrop-blur rounded-2xl shadow-2xl border border-white/10 z-40 flex flex-col overflow-hidden">
					<div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
						<p className="font-medium">
							{activeChat ? activeChat.name : "Messages"}
						</p>
						<button onClick={() => setActiveChat(null)}>
							<X size={16} />
						</button>
					</div>

					<div className="flex-1 overflow-y-auto p-3 space-y-3">
						{/* PREVIEW LIST — UNCHANGED */}
						{!activeChat &&
							FRIENDS.map((friend) => {
								const unread = (friend.unreadCount ?? 0) > 0;

								return (
									<button
										key={friend.id}
										onClick={() => setActiveChat(friend)}
										className="w-full flex gap-3 p-2 rounded-xl hover:bg-white/10 transition"
									>
										<div className="relative">
											<div
												className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${
													friend.avatarUrl
														? ""
														: getAvatarColor(
																friend.id,
															)
												}`}
											>
												{friend.avatarUrl ? (
													<img
														src={friend.avatarUrl}
														className="w-full h-full rounded-full object-cover"
													/>
												) : (
													getInitials(friend.name)
												)}
											</div>

											{unread && (
												<span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#FF414E] rounded-full" />
											)}
										</div>

										<div className="flex-1 text-left">
											<p
												className={`text-sm ${unread ? "font-semibold" : "font-medium"}`}
											>
												{friend.name}
											</p>
											<p
												className={`text-xs truncate ${
													unread
														? "font-semibold text-white"
														: "text-white/50"
												}`}
											>
												{friend.lastMessage}
											</p>
										</div>

										<span className="text-xs text-white/40">
											{friend.lastMessageTime}
										</span>
									</button>
								);
							})}

						{/* CHAT THREAD — NEW */}
						{activeChat &&
							CHAT_HISTORY[activeChat.id]?.map((msg) => (
								<div key={msg.id}>
									{msg.date && (
										<p className="text-center text-xs text-white/30 mb-2">
											{msg.date}
										</p>
									)}
									<div
										className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
											msg.from === "me"
												? "ml-auto bg-[#FF414E]"
												: "bg-white/10"
										}`}
									>
										{msg.text}
										<p className="mt-1 text-[10px] text-white/60 text-right">
											{msg.time}
										</p>
									</div>
								</div>
							))}
						<div ref={bottomRef} />
					</div>

					{activeChat && (
						<div className="p-3 border-t border-white/10 flex gap-2">
							<input
								className="flex-1 bg-black/40 rounded-xl px-3 py-2 text-sm focus:outline-none"
								placeholder="Type a message…"
							/>
							<button className="px-3 rounded-xl bg-[#FF414E]">
								<Send size={16} />
							</button>
						</div>
					)}
				</div>
			)}

			{/* DIARY MODAL */}
			{diaryFriend && (
				<Modal onClose={() => setDiaryFriend(null)}>
					<h2 className="text-xl font-semibold mb-4">
						{diaryFriend.name}’s diary
					</h2>

					{diaryFriend.hasPublicDiary ? (
						<div className="space-y-3">
							{DIARY_ITEMS.map((item) => (
								<div
									key={item.id}
									className="p-4 rounded-xl bg-white/5"
								>
									<p className="font-medium">{item.title}</p>
								</div>
							))}
						</div>
					) : (
						<div className="text-center text-white/60 py-12">
							<Lock className="mx-auto mb-4" />
							<p>{diaryFriend.name}’s diary is private</p>
						</div>
					)}
				</Modal>
			)}
		</main>
	);
}

/* ---------------- SHARED UI ---------------- */

function MenuItem({
	icon,
	label,
	danger,
	onClick,
}: {
	icon: React.ReactNode;
	label: string;
	danger?: boolean;
	onClick?: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition
			${danger ? "text-red-400 hover:bg-red-500/20" : "hover:bg-white/10"}`}
		>
			{icon}
			{label}
		</button>
	);
}

function Modal({
	children,
	onClose,
}: {
	children: React.ReactNode;
	onClose: () => void;
}) {
	return (
		<div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center">
			<div className="relative w-full max-w-lg bg-[#0f0f14]/95 rounded-2xl p-6 border border-white/10">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-white/40 hover:text-white"
				>
					<X />
				</button>
				{children}
			</div>
		</div>
	);
}
