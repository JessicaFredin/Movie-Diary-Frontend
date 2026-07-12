"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Film, MessageCircle, Pencil, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ProfileDiaryStrip, {
	ProfileAchievements,
} from "@/components/profile/profile-diary-strip";
import StreamingServices from "@/components/profile/streaming-services";
import AddFriendButton from "@/components/friends/add-friend-button";

type ProfileRow = {
	id: string;
	display_name: string | null;
	bio: string | null;
	avatar_url: string | null;
	banner_url: string | null;
	is_private_diary: boolean;
	created_at: string | null;
};

type DiaryPreviewItem = {
	id: number;
	media_id: string;
	media_type: "movie" | "tv";
	title_snapshot: string | null;
	poster_path_snapshot: string | null;
	updated_at: string | null;
	created_at: string | null;
};

type AccessRequestRow = {
	status: "pending" | "accepted" | "declined";
};

const DEFAULT_BANNER = "/images/profile-banner.jpg";

function getInitials(name: string) {
	return name.trim().slice(0, 1).toUpperCase() || "U";
}

function formatJoined(date?: string | null) {
	if (!date) return "Joined recently";

	return `Joined ${new Intl.DateTimeFormat("en", {
		month: "long",
		year: "numeric",
	}).format(new Date(date))}`;
}

export default function PublicUserProfilePage() {
	const params = useParams<{ id: string }>();
	const profileId = params.id;

	const supabase = useMemo(() => createClient(), []);

	const [profile, setProfile] = useState<ProfileRow | null>(null);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);
	const [diaryItems, setDiaryItems] = useState<DiaryPreviewItem[]>([]);
	const [loggedCount, setLoggedCount] = useState(0);
	const [friendCount, setFriendCount] = useState(0);
	const [canShowDiary, setCanShowDiary] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadProfile() {
			setLoading(true);

			const {
				data: { user },
			} = await supabase.auth.getUser();

			setCurrentUserId(user?.id ?? null);

			const { data: profileData, error } = await supabase
				.from("profiles")
				.select(
					"id, display_name, bio, avatar_url, banner_url, is_private_diary, created_at",
				)
				.eq("id", profileId)
				.maybeSingle();

			if (error) {
				console.error(error);
				setLoading(false);
				return;
			}

			const typedProfile = profileData as ProfileRow | null;
			setProfile(typedProfile);

			if (!typedProfile) {
				setLoading(false);
				return;
			}

			const isOwnProfile = user?.id === profileId;

			const { count: diaryCount } = await supabase
				.from("diary_entries")
				.select("id", { count: "exact", head: true })
				.eq("user_id", profileId);

			setLoggedCount(diaryCount ?? 0);

			const { count: friendsTotal } = await supabase
				.from("friendships")
				.select("id", { count: "exact", head: true })
				.eq("user_id", profileId);

			setFriendCount(friendsTotal ?? 0);

			let isFriend = false;
			let hasDiaryAccess = false;

			if (user && !isOwnProfile) {
				const { data: friendship } = await supabase
					.from("friendships")
					.select("id")
					.eq("user_id", user.id)
					.eq("friend_id", profileId)
					.maybeSingle();

				isFriend = Boolean(friendship);

				const { data: diaryAccess } = await supabase
					.from("diary_access_requests")
					.select("status")
					.eq("owner_id", profileId)
					.eq("requester_id", user.id)
					.maybeSingle();

				const typedAccess = diaryAccess as AccessRequestRow | null;
				hasDiaryAccess = typedAccess?.status === "accepted";
			}

			const allowedToSeeDiary =
				isOwnProfile ||
				typedProfile.is_private_diary === false ||
				isFriend ||
				hasDiaryAccess;

			setCanShowDiary(allowedToSeeDiary);

			if (allowedToSeeDiary) {
				const { data: diaryData } = await supabase
					.from("diary_entries")
					.select(
						"id, media_id, media_type, title_snapshot, poster_path_snapshot, updated_at, created_at",
					)
					.eq("user_id", profileId)
					.order("updated_at", {
						ascending: false,
						nullsFirst: false,
					})
					.order("created_at", { ascending: false })
					.limit(6);

				setDiaryItems((diaryData ?? []) as DiaryPreviewItem[]);
			} else {
				setDiaryItems([]);
			}

			setLoading(false);
		}

		loadProfile();
	}, [profileId, supabase]);

	if (loading) {
		return (
			<main className="min-h-screen bg-black px-6 py-12 text-white">
				Loading profile...
			</main>
		);
	}

	if (!profile) {
		return (
			<main className="min-h-screen bg-black px-6 py-12 text-white">
				Profile not found.
			</main>
		);
	}

	const displayName = profile.display_name ?? "User";
	const isOwnProfile = currentUserId === profile.id;
	const diaryIsPrivate = profile.is_private_diary && !canShowDiary;

	return (
		<main className="min-h-screen bg-black text-white">
			<section>
				<div className="relative h-[430px] overflow-hidden">
					<img
						src={profile.banner_url ?? DEFAULT_BANNER}
						alt={`${displayName} cover`}
						className="h-full w-full object-cover"
					/>

					<div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />
				</div>

				<div className="relative -mt-24 px-6 md:px-16">
					<div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
						<div className="flex flex-col gap-6 md:flex-row md:items-end">
							<div className="h-36 w-36 shrink-0 overflow-hidden rounded-full border-4 border-accent bg-slate-500 shadow-[0_0_22px_#FF414E] md:h-44 md:w-44">
								{profile.avatar_url ? (
									<img
										src={profile.avatar_url}
										alt={displayName}
										className="h-full w-full object-cover"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center text-6xl text-white">
										{getInitials(displayName)}
									</div>
								)}
							</div>

							<div className="pb-4">
								<h1 className="text-4xl font-black md:text-5xl">
									{displayName}
								</h1>

								<p className="mt-2 text-muted">
									{formatJoined(profile.created_at)}
								</p>

								<div className="mt-4">
									<StreamingServices
										userId={profile.id}
										editable={false}
									/>
								</div>
							</div>
						</div>

						<div className="flex flex-col items-center gap-6 pb-4 lg:min-w-[260px]">
							<div className="flex gap-6">
								<div className="text-center">
									<div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
										<Users className="h-6 w-6" />
									</div>

									<p className="text-xl font-bold">
										{friendCount}
									</p>
									<p className="text-xs text-muted">
										FRIENDS
									</p>
								</div>

								<div className="text-center">
									<div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
										<Film className="h-6 w-6" />
									</div>

									<p className="text-xl font-bold">
										{loggedCount}
									</p>
									<p className="text-xs text-muted">LOGGED</p>
								</div>
							</div>

							{isOwnProfile ? (
								<Link
									href="/profile"
									className="flex h-14 w-[180px] items-center justify-center gap-2 rounded-full bg-accent text-sm font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover"
								>
									<Pencil className="h-4 w-4" />
									Edit profile
								</Link>
							) : (
								<div className="flex gap-4">
									<AddFriendButton profileId={profile.id} />

									<button
										type="button"
										className="flex h-14 w-[150px] items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] text-sm font-bold text-white transition hover:bg-white/[0.1]"
									>
										<MessageCircle className="h-4 w-4" />
										Message
									</button>
								</div>
							)}
						</div>
					</div>

					<div className="mt-10 max-w-3xl">
						<p className="whitespace-pre-line text-lg leading-8 text-gray-200">
							{profile.bio ||
								"This user has not written a bio yet."}
						</p>
					</div>
				</div>
			</section>

			<ProfileDiaryStrip
				items={diaryItems}
				displayName={displayName}
				isPrivate={diaryIsPrivate}
				showViewAll={canShowDiary}
				profileId={profile.id}
			/>

			<ProfileAchievements />
		</main>
	);
}
