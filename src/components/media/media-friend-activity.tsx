"use client";

import Link from "next/link";
import { BookOpen, ExternalLink, Lock, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type MediaType = "movie" | "tv";

type Props = {
	mediaId: number;
	mediaType: MediaType;
};

type FriendWatchedRow = {
	id: string;
	display_name: string | null;
	avatar_url: string | null;
	is_private_diary: boolean | null;
	watched_at: string | null;
};

type FriendWatched = {
	id: string;
	name: string;
	avatarUrl: string | null;
	isPrivateDiary: boolean;
	watchedAt: string | null;
};

function getInitials(name: string) {
	const clean = name.trim();

	if (!clean) return "U";

	const parts = clean.split(" ").filter(Boolean);

	if (parts.length >= 2) {
		return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
	}

	return clean.slice(0, 2).toUpperCase();
}

export default function MediaFriendActivity({ mediaId, mediaType }: Props) {
	const supabase = useMemo(() => createClient(), []);

	const [friendsWatched, setFriendsWatched] = useState<FriendWatched[]>([]);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);

	const loadFriendsWatched = useCallback(async () => {
		setLoading(true);

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			setFriendsWatched([]);
			setLoading(false);
			return;
		}

		const { data, error } = await supabase.rpc(
			"get_friends_who_logged_media",
			{
				target_media_id: String(mediaId),
				target_media_type: mediaType,
			},
		);

		if (error) {
			console.error(
				"Failed to load friends who watched this:",
				error.message,
			);
			setFriendsWatched([]);
			setLoading(false);
			return;
		}

		const rows = (data ?? []) as FriendWatchedRow[];

		const watchedFriends = rows.map((row) => ({
			id: row.id,
			name: row.display_name || "User",
			avatarUrl: row.avatar_url,
			isPrivateDiary: row.is_private_diary ?? true,
			watchedAt: row.watched_at,
		}));

		setFriendsWatched(watchedFriends);
		setLoading(false);
	}, [mediaId, mediaType, supabase]);

	useEffect(() => {
		loadFriendsWatched();

		function refreshOnFocus() {
			loadFriendsWatched();
		}

		function refreshOnVisibilityChange() {
			if (document.visibilityState === "visible") {
				loadFriendsWatched();
			}
		}

		window.addEventListener("focus", refreshOnFocus);
		document.addEventListener(
			"visibilitychange",
			refreshOnVisibilityChange,
		);

		return () => {
			window.removeEventListener("focus", refreshOnFocus);
			document.removeEventListener(
				"visibilitychange",
				refreshOnVisibilityChange,
			);
		};
	}, [loadFriendsWatched]);

	if (loading || friendsWatched.length === 0) return null;

	const previewFriends = friendsWatched.slice(0, 5);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="flex items-center gap-3 text-left"
			>
				<div className="flex -space-x-3">
					{previewFriends.map((friend) => (
						<div
							key={friend.id}
							className="h-8 w-8 overflow-hidden rounded-full border-2 border-black bg-surface-elevated"
						>
							{friend.avatarUrl ? (
								<img
									src={friend.avatarUrl}
									alt={friend.name}
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
									{getInitials(friend.name)}
								</div>
							)}
						</div>
					))}
				</div>

				<p className="whitespace-nowrap text-sm">
					<span className="font-medium text-white">
						{friendsWatched.length}{" "}
						{friendsWatched.length === 1 ? "friend" : "friends"}
					</span>{" "}
					<span className="text-muted">have watched this</span>
				</p>
			</button>

			{open && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
					<div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#15151a] shadow-2xl">
						<div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
							<div>
								<h2 className="text-xl font-bold text-white">
									Friends who watched this
								</h2>

								<p className="mt-1 text-sm text-muted">
									{friendsWatched.length}{" "}
									{friendsWatched.length === 1
										? "friend"
										: "friends"}
								</p>
							</div>

							<button
								type="button"
								onClick={() => setOpen(false)}
								className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-white"
								aria-label="Close"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<div className="max-h-[430px] overflow-y-auto">
							{friendsWatched.map((friend) => (
								<div
									key={friend.id}
									className="flex flex-col gap-4 border-b border-white/5 px-6 py-4 transition hover:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between"
								>
									<div className="flex items-center gap-4">
										<Link
											href={`/users/${friend.id}`}
											onClick={() => setOpen(false)}
											className="h-11 w-11 overflow-hidden rounded-full bg-surface-elevated"
										>
											{friend.avatarUrl ? (
												<img
													src={friend.avatarUrl}
													alt={friend.name}
													className="h-full w-full object-cover"
												/>
											) : (
												<div className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
													{getInitials(friend.name)}
												</div>
											)}
										</Link>

										<div>
											<Link
												href={`/users/${friend.id}`}
												onClick={() => setOpen(false)}
												className="font-semibold text-white hover:text-accent"
											>
												{friend.name}
											</Link>

											<div className="mt-1 flex items-center gap-2 text-sm text-muted">
												<BookOpen className="h-3.5 w-3.5" />
												<span>Logged this</span>
											</div>
										</div>
									</div>

									<div className="flex flex-wrap items-center gap-2 sm:justify-end">
										<Link
											href={`/users/${friend.id}`}
											onClick={() => setOpen(false)}
											className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 text-xs font-bold text-white transition hover:bg-white/[0.1]"
										>
											<ExternalLink className="h-3.5 w-3.5" />
											Profile
										</Link>

										{friend.isPrivateDiary ? (
											<div className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 text-xs font-bold text-muted">
												<Lock className="h-3.5 w-3.5" />
												Private diary
											</div>
										) : (
											<Link
												href={`/users/${friend.id}/diary`}
												onClick={() => setOpen(false)}
												className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-accent px-4 text-xs font-bold text-white transition hover:bg-accent-hover"
											>
												<BookOpen className="h-3.5 w-3.5" />
												View diary
											</Link>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</>
	);
}
