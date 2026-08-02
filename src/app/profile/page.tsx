// "use client";

// import { useEffect, useMemo, useState } from "react";
// import {
// 	Camera,
// 	Film,
// 	Globe2,
// 	Lock,
// 	Pencil,
// 	Save,
// 	Users,
// 	X,
// } from "lucide-react";

// import { createClient } from "@/lib/supabase/client";
// import ProfileBanner from "@/components/profile/profile-banner";
// import ProfileAvatar from "@/components/profile/profile-avatar";
// import ProfileDiaryStrip from "@/components/profile/profile-diary-strip";
// import ProfileAchievementsPreview from "@/components/achievements/profile-achievements-preview";
// import StreamingServices from "@/components/profile/streaming-services";

// type ProfileData = {
// 	id: string;
// 	display_name: string;
// 	bio: string;
// 	avatar_url: string | null;
// 	banner_url: string;
// 	is_private_diary: boolean;
// 	created_at: string | null;
// };

// type DiaryPreviewItem = {
// 	id: number;
// 	media_id: string;
// 	media_type: "movie" | "tv";
// 	title_snapshot: string | null;
// 	poster_path_snapshot: string | null;
// 	updated_at: string | null;
// 	created_at: string | null;
// };

// const DEFAULT_BANNER = "/images/profile-banner.jpg";

// function getNameFromUser(user: {
// 	email?: string | null;
// 	user_metadata?: {
// 		full_name?: string;
// 		name?: string;
// 	};
// }) {
// 	return (
// 		user.user_metadata?.full_name ||
// 		user.user_metadata?.name ||
// 		user.email ||
// 		"User"
// 	);
// }

// function formatJoined(date?: string | null) {
// 	if (!date) return "Joined recently";

// 	return `Joined ${new Intl.DateTimeFormat("en", {
// 		month: "long",
// 		year: "numeric",
// 	}).format(new Date(date))}`;
// }

// export default function ProfilePage() {
// 	const supabase = useMemo(() => createClient(), []);

// 	const [profile, setProfile] = useState<ProfileData | null>(null);
// 	const [diaryItems, setDiaryItems] = useState<DiaryPreviewItem[]>([]);
// 	const [friendCount, setFriendCount] = useState(0);
// 	const [loggedCount, setLoggedCount] = useState(0);
// 	const [loading, setLoading] = useState(true);

// 	const [editMode, setEditMode] = useState(false);
// 	const [saving, setSaving] = useState(false);

// 	const [draftDisplayName, setDraftDisplayName] = useState("");
// 	const [draftBio, setDraftBio] = useState("");
// 	const [draftPrivateDiary, setDraftPrivateDiary] = useState(true);

// 	useEffect(() => {
// 		async function loadProfile() {
// 			setLoading(true);

// 			const {
// 				data: { user },
// 			} = await supabase.auth.getUser();

// 			if (!user) {
// 				setProfile(null);
// 				setLoading(false);
// 				return;
// 			}

// 			const { data: profileData, error } = await supabase
// 				.from("profiles")
// 				.select(
// 					"id, display_name, bio, avatar_url, banner_url, is_private_diary, created_at",
// 				)
// 				.eq("id", user.id)
// 				.maybeSingle();

// 			if (error) {
// 				console.error(error.message);
// 			}

// 			const displayName =
// 				profileData?.display_name || getNameFromUser(user);

// 			const loadedProfile: ProfileData = {
// 				id: user.id,
// 				display_name: displayName,
// 				bio: profileData?.bio || "",
// 				avatar_url:
// 					profileData?.avatar_url ||
// 					user.user_metadata?.avatar_url ||
// 					null,
// 				banner_url: profileData?.banner_url || DEFAULT_BANNER,
// 				is_private_diary: profileData?.is_private_diary ?? true,
// 				created_at:
// 					profileData?.created_at ||
// 					user.created_at ||
// 					new Date().toISOString(),
// 			};

// 			setProfile(loadedProfile);
// 			setDraftDisplayName(loadedProfile.display_name);
// 			setDraftBio(loadedProfile.bio);
// 			setDraftPrivateDiary(loadedProfile.is_private_diary);

// 			const { data: diaryData } = await supabase
// 				.from("diary_entries")
// 				.select(
// 					"id, media_id, media_type, title_snapshot, poster_path_snapshot, updated_at, created_at",
// 				)
// 				.eq("user_id", user.id)
// 				.order("updated_at", {
// 					ascending: false,
// 					nullsFirst: false,
// 				})
// 				.order("created_at", { ascending: false })
// 				.limit(6);

// 			setDiaryItems((diaryData ?? []) as DiaryPreviewItem[]);

// 			const { count: loggedTotal } = await supabase
// 				.from("diary_entries")
// 				.select("id", { count: "exact", head: true })
// 				.eq("user_id", user.id);

// 			setLoggedCount(loggedTotal ?? 0);

// 			const { count: friendsTotal } = await supabase
// 				.from("friendships")
// 				.select("id", { count: "exact", head: true })
// 				.eq("user_id", user.id);

// 			setFriendCount(friendsTotal ?? 0);

// 			setLoading(false);
// 		}

// 		void loadProfile();
// 	}, [supabase]);

// 	async function updateProfile(updated: Partial<ProfileData>) {
// 		if (!profile) return;

// 		const newProfile: ProfileData = {
// 			...profile,
// 			...updated,
// 		};

// 		setProfile(newProfile);

// 		const { error } = await supabase.from("profiles").upsert(
// 			{
// 				id: newProfile.id,
// 				display_name: newProfile.display_name,
// 				bio: newProfile.bio,
// 				avatar_url: newProfile.avatar_url,
// 				banner_url: newProfile.banner_url,
// 				is_private_diary: newProfile.is_private_diary,
// 				updated_at: new Date().toISOString(),
// 			},
// 			{
// 				onConflict: "id",
// 			},
// 		);

// 		if (error) {
// 			alert(error.message);
// 		}
// 	}

// 	async function handleSaveChanges() {
// 		if (!profile) return;

// 		try {
// 			setSaving(true);

// 			await updateProfile({
// 				display_name: draftDisplayName.trim() || profile.display_name,
// 				bio: draftBio,
// 				is_private_diary: draftPrivateDiary,
// 			});

// 			setEditMode(false);
// 		} finally {
// 			setSaving(false);
// 		}
// 	}

// 	function handleCancelEdit() {
// 		if (!profile) return;

// 		setDraftDisplayName(profile.display_name);
// 		setDraftBio(profile.bio);
// 		setDraftPrivateDiary(profile.is_private_diary);
// 		setEditMode(false);
// 	}

// 	if (loading) {
// 		return (
// 			<main className="min-h-screen bg-black px-6 py-12 text-white">
// 				Loading profile...
// 			</main>
// 		);
// 	}

// 	if (!profile) {
// 		return (
// 			<main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
// 				<p>You need to log in to view your profile.</p>
// 			</main>
// 		);
// 	}

// 	return (
// 		<main className="min-h-screen bg-black text-white">
// 			<section>
// 				<div className="relative">
// 					<ProfileBanner
// 						src={profile.banner_url}
// 						editable={editMode}
// 						onChange={(banner_url) => updateProfile({ banner_url })}
// 					/>

// 					{editMode && (
// 						<div className="pointer-events-none absolute bottom-6 right-6 z-30 flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-white text-black shadow-lg lg:hidden">
// 							<Camera className="h-4 w-4" />
// 						</div>
// 					)}
// 				</div>

// 				<div className="relative -mt-24 px-5 md:px-16">
// 					<div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
// 						<div className="flex flex-col gap-5 md:flex-row md:items-end md:gap-6">
// 							<div className="relative h-[145px] w-[145px] md:h-auto md:w-auto">
// 								<div className="absolute left-0 top-0 origin-top-left scale-[0.82] md:static md:scale-100">
// 									<div className="relative">
// 										<ProfileAvatar
// 											src={profile.avatar_url}
// 											displayName={profile.display_name}
// 											editable={editMode}
// 											onChange={(avatar_url) =>
// 												updateProfile({ avatar_url })
// 											}
// 										/>

// 										{editMode && (
// 											<div className="pointer-events-none absolute bottom-2 right-0 z-40 flex h-9 w-9 items-center justify-center rounded-full border-2 border-accent bg-white text-black shadow-lg lg:hidden">
// 												<Camera className="h-4 w-4" />
// 											</div>
// 										)}
// 									</div>
// 								</div>
// 							</div>

// 							<div className="flex w-full items-start justify-between gap-4 pb-0 md:block md:w-auto md:pb-4">
// 								<div className="min-w-0">
// 									<h1 className="text-3xl font-black leading-tight md:text-5xl">
// 										{profile.display_name}
// 									</h1>

// 									<p className="mt-1 text-sm text-muted md:mt-2 md:text-base">
// 										{formatJoined(profile.created_at)}
// 									</p>

// 									<div
// 										className={`mt-2 flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide md:mt-3 md:gap-2 md:px-4 md:py-1.5 md:text-xs ${
// 											profile.is_private_diary
// 												? "border-white/10 bg-white/5 text-muted"
// 												: "border-green-500/30 bg-green-500/10 text-green-300"
// 										}`}
// 									>
// 										{profile.is_private_diary ? (
// 											<>
// 												<Lock className="h-3 w-3 md:h-3.5 md:w-3.5" />
// 												Private diary
// 											</>
// 										) : (
// 											<>
// 												<Globe2 className="h-3 w-3 md:h-3.5 md:w-3.5" />
// 												Public diary
// 											</>
// 										)}
// 									</div>

// 									<div className="mt-3 md:mt-4">
// 										<StreamingServices
// 											userId={profile.id}
// 											editable={editMode}
// 										/>
// 									</div>
// 								</div>

// 								<div className="flex shrink-0 flex-col items-center gap-3 md:hidden">
// 									<div className="flex gap-3">
// 										<div className="text-center">
// 											<div className="mb-1 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
// 												<Users className="h-4 w-4" />
// 											</div>

// 											<p className="text-sm font-bold leading-none">
// 												{friendCount}
// 											</p>

// 											<p className="mt-1 text-[9px] text-muted">
// 												FRIENDS
// 											</p>
// 										</div>

// 										<div className="text-center">
// 											<div className="mb-1 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
// 												<Film className="h-4 w-4" />
// 											</div>

// 											<p className="text-sm font-bold leading-none">
// 												{loggedCount}
// 											</p>

// 											<p className="mt-1 text-[9px] text-muted">
// 												LOGGED
// 											</p>
// 										</div>
// 									</div>

// 									{!editMode && (
// 										<button
// 											type="button"
// 											onClick={() => setEditMode(true)}
// 											className="flex h-9 w-[104px] items-center justify-center gap-1.5 rounded-full bg-accent text-xs font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover"
// 										>
// 											<Pencil className="h-3.5 w-3.5" />
// 											Edit
// 										</button>
// 									)}
// 								</div>
// 							</div>
// 						</div>

// 						<div className="hidden flex-col items-center gap-6 pb-4 lg:flex lg:min-w-[260px]">
// 							<div className="flex gap-6">
// 								<div className="text-center">
// 									<div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
// 										<Users className="h-6 w-6" />
// 									</div>

// 									<p className="text-xl font-bold">
// 										{friendCount}
// 									</p>

// 									<p className="text-xs text-muted">
// 										FRIENDS
// 									</p>
// 								</div>

// 								<div className="text-center">
// 									<div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
// 										<Film className="h-6 w-6" />
// 									</div>

// 									<p className="text-xl font-bold">
// 										{loggedCount}
// 									</p>

// 									<p className="text-xs text-muted">LOGGED</p>
// 								</div>
// 							</div>

// 							{!editMode && (
// 								<button
// 									type="button"
// 									onClick={() => setEditMode(true)}
// 									className="flex h-14 w-[180px] items-center justify-center gap-2 rounded-full bg-accent text-sm font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover"
// 								>
// 									<Pencil className="h-4 w-4" />
// 									Edit profile
// 								</button>
// 							)}
// 						</div>
// 					</div>

// 					{!editMode && (
// 						<div className="mt-8 max-w-3xl md:mt-10">
// 							<p className="whitespace-pre-line text-sm leading-6 text-gray-200 md:text-lg md:leading-8">
// 								{profile.bio ||
// 									"You haven’t written a bio yet."}
// 							</p>
// 						</div>
// 					)}

// 					{editMode && (
// 						<div className="mt-8 max-w-5xl rounded-3xl border border-white/10 bg-white/[0.025] p-4 md:mt-12 md:p-8">
// 							<div className="grid gap-6 md:grid-cols-2">
// 								<div>
// 									<label className="mb-2 block text-xs uppercase tracking-wide text-muted">
// 										Display name
// 									</label>

// 									<input
// 										value={draftDisplayName}
// 										onChange={(event) =>
// 											setDraftDisplayName(
// 												event.target.value,
// 											)
// 										}
// 										className="h-11 w-full rounded-2xl border border-white/10 bg-[#151515] px-4 text-sm text-white outline-none focus:border-accent md:h-14 md:px-5 md:text-base"
// 									/>
// 								</div>
// 							</div>

// 							<div className="mt-5 md:mt-6">
// 								<div className="mb-2 flex items-center justify-between">
// 									<label className="block text-xs uppercase tracking-wide text-muted">
// 										Bio
// 									</label>

// 									<span className="text-xs text-muted">
// 										{draftBio.length}/280
// 									</span>
// 								</div>

// 								<textarea
// 									value={draftBio}
// 									maxLength={280}
// 									onChange={(event) =>
// 										setDraftBio(event.target.value)
// 									}
// 									placeholder="A little about you and your taste in movies..."
// 									className="min-h-[110px] w-full resize-y rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-sm text-white outline-none focus:border-accent md:min-h-[140px] md:px-5 md:py-4 md:text-base"
// 								/>
// 							</div>

// 							<div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#151515] p-4 md:mt-6 md:p-5">
// 								<div className="flex items-start gap-3">
// 									<Lock className="mt-1 h-4 w-4 text-white md:h-5 md:w-5" />

// 									<div>
// 										<p className="text-sm font-bold text-white md:text-base">
// 											Private diary
// 										</p>

// 										<p className="mt-1 text-xs text-muted md:text-sm">
// 											Only friends you approve can see
// 											what you have been watching.
// 										</p>
// 									</div>
// 								</div>

// 								<button
// 									type="button"
// 									onClick={() =>
// 										setDraftPrivateDiary((value) => !value)
// 									}
// 									className={`relative h-7 w-12 shrink-0 rounded-full transition md:h-8 md:w-14 ${
// 										draftPrivateDiary
// 											? "bg-accent"
// 											: "bg-white/20"
// 									}`}
// 									aria-label="Toggle private diary"
// 								>
// 									<span
// 										className={`absolute top-1 h-5 w-5 rounded-full bg-white transition md:h-6 md:w-6 ${
// 											draftPrivateDiary
// 												? "left-6 md:left-7"
// 												: "left-1"
// 										}`}
// 									/>
// 								</button>
// 							</div>

// 							<div className="mt-5 flex flex-wrap gap-3 md:mt-6">
// 								<button
// 									type="button"
// 									onClick={handleSaveChanges}
// 									disabled={saving}
// 									className="flex h-10 items-center justify-center gap-2 rounded-full bg-accent px-5 text-xs font-bold text-white transition hover:bg-accent-hover disabled:opacity-50 md:h-12 md:px-6 md:text-sm"
// 								>
// 									<Save className="h-4 w-4" />
// 									{saving ? "Saving..." : "Save changes"}
// 								</button>

// 								<button
// 									type="button"
// 									onClick={handleCancelEdit}
// 									disabled={saving}
// 									className="flex h-10 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-5 text-xs font-bold text-white transition hover:bg-white/[0.1] disabled:opacity-50 md:h-12 md:px-6 md:text-sm"
// 								>
// 									<X className="h-4 w-4" />
// 									Cancel
// 								</button>
// 							</div>
// 						</div>
// 					)}
// 				</div>
// 			</section>

// 			{!editMode && (
// 				<>
// 					<ProfileDiaryStrip
// 						items={diaryItems}
// 						displayName={profile.display_name}
// 						isPrivate={profile.is_private_diary}
// 						showViewAll={diaryItems.length > 0}
// 						viewAllHref="/my-diary"
// 					/>

// 					<ProfileAchievementsPreview />
// 				</>
// 			)}
// 		</main>
// 	);
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import {
	Camera,
	Film,
	Globe2,
	Lock,
	Pencil,
	Save,
	UserCheck,
	Users,
	X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import ProfileBanner from "@/components/profile/profile-banner";
import ProfileAvatar from "@/components/profile/profile-avatar";
import ProfileDiaryStrip from "@/components/profile/profile-diary-strip";
import ProfileAchievementsPreview from "@/components/achievements/profile-achievements-preview";
import StreamingServices from "@/components/profile/streaming-services";

type DiaryVisibility =
	| "public"
	| "private_request"
	| "friends"
	| "selected_friends";

type ProfileData = {
	id: string;
	display_name: string;
	bio: string;
	avatar_url: string | null;
	banner_url: string;
	is_private_diary: boolean;
	diary_visibility: DiaryVisibility;
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

const DEFAULT_BANNER = "/images/profile-banner.jpg";

function getNameFromUser(user: {
	email?: string | null;
	user_metadata?: {
		full_name?: string;
		name?: string;
	};
}) {
	return (
		user.user_metadata?.full_name ||
		user.user_metadata?.name ||
		user.email ||
		"User"
	);
}

function formatJoined(date?: string | null) {
	if (!date) return "Joined recently";

	return `Joined ${new Intl.DateTimeFormat("en", {
		month: "long",
		year: "numeric",
	}).format(new Date(date))}`;
}

function getDiaryVisibilityInfo(profile: ProfileData) {
	if (profile.diary_visibility === "public") {
		return {
			label: "Public diary",
			Icon: Globe2,
			className: "border-green-500/30 bg-green-500/10 text-green-300",
		};
	}

	if (profile.diary_visibility === "friends") {
		return {
			label: "Friends can view",
			Icon: Users,
			className: "border-blue-400/30 bg-blue-400/10 text-blue-300",
		};
	}

	if (profile.diary_visibility === "selected_friends") {
		return {
			label: "Selected friends",
			Icon: UserCheck,
			className: "border-purple-400/30 bg-purple-400/10 text-purple-300",
		};
	}

	return {
		label: "Private diary",
		Icon: Lock,
		className: "border-white/10 bg-white/5 text-muted",
	};
}

export default function ProfilePage() {
	const supabase = useMemo(() => createClient(), []);

	const [profile, setProfile] = useState<ProfileData | null>(null);
	const [diaryItems, setDiaryItems] = useState<DiaryPreviewItem[]>([]);
	const [friendCount, setFriendCount] = useState(0);
	const [loggedCount, setLoggedCount] = useState(0);
	const [loading, setLoading] = useState(true);

	const [editMode, setEditMode] = useState(false);
	const [saving, setSaving] = useState(false);
	const [draftBio, setDraftBio] = useState("");

	useEffect(() => {
		async function loadProfile() {
			setLoading(true);

			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				setProfile(null);
				setLoading(false);
				return;
			}

			const { data: profileData, error } = await supabase
				.from("profiles")
				.select(
					"id, display_name, bio, avatar_url, banner_url, is_private_diary, diary_visibility, created_at",
				)
				.eq("id", user.id)
				.maybeSingle();

			if (error) {
				console.error(error.message);
			}

			const displayName =
				profileData?.display_name || getNameFromUser(user);

			const diaryVisibility =
				(profileData?.diary_visibility as DiaryVisibility | null) ??
				(profileData?.is_private_diary === false
					? "public"
					: "private_request");

			const loadedProfile: ProfileData = {
				id: user.id,
				display_name: displayName,
				bio: profileData?.bio || "",
				avatar_url:
					profileData?.avatar_url ||
					user.user_metadata?.avatar_url ||
					null,
				banner_url: profileData?.banner_url || DEFAULT_BANNER,
				is_private_diary: profileData?.is_private_diary ?? true,
				diary_visibility: diaryVisibility,
				created_at:
					profileData?.created_at ||
					user.created_at ||
					new Date().toISOString(),
			};

			setProfile(loadedProfile);
			setDraftBio(loadedProfile.bio);

			const { data: diaryData } = await supabase
				.from("diary_entries")
				.select(
					"id, media_id, media_type, title_snapshot, poster_path_snapshot, updated_at, created_at",
				)
				.eq("user_id", user.id)
				.order("updated_at", {
					ascending: false,
					nullsFirst: false,
				})
				.order("created_at", { ascending: false })
				.limit(6);

			setDiaryItems((diaryData ?? []) as DiaryPreviewItem[]);

			const { count: loggedTotal } = await supabase
				.from("diary_entries")
				.select("id", { count: "exact", head: true })
				.eq("user_id", user.id);

			setLoggedCount(loggedTotal ?? 0);

			const { count: friendsTotal } = await supabase
				.from("friendships")
				.select("id", { count: "exact", head: true })
				.eq("user_id", user.id);

			setFriendCount(friendsTotal ?? 0);

			setLoading(false);
		}

		void loadProfile();
	}, [supabase]);

	async function updateProfile(updated: Partial<ProfileData>) {
		if (!profile) return;

		const newProfile: ProfileData = {
			...profile,
			...updated,
		};

		setProfile(newProfile);

		const { error } = await supabase.from("profiles").upsert(
			{
				id: newProfile.id,
				display_name: newProfile.display_name,
				bio: newProfile.bio,
				avatar_url: newProfile.avatar_url,
				banner_url: newProfile.banner_url,
				is_private_diary: newProfile.is_private_diary,
				diary_visibility: newProfile.diary_visibility,
				updated_at: new Date().toISOString(),
			},
			{
				onConflict: "id",
			},
		);

		if (error) {
			alert(error.message);
		}
	}

	function handleStartEdit() {
		if (!profile) return;

		setDraftBio(profile.bio);
		setEditMode(true);
	}

	async function handleSaveChanges() {
		if (!profile) return;

		try {
			setSaving(true);

			await updateProfile({
				bio: draftBio,
			});

			setEditMode(false);
		} finally {
			setSaving(false);
		}
	}

	function handleCancelEdit() {
		if (!profile) return;

		setDraftBio(profile.bio);
		setEditMode(false);
	}

	if (loading) {
		return (
			<main className="min-h-screen bg-black px-6 py-12 text-white">
				Loading profile...
			</main>
		);
	}

	if (!profile) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
				<p>You need to log in to view your profile.</p>
			</main>
		);
	}

	const diaryVisibilityInfo = getDiaryVisibilityInfo(profile);
	const DiaryVisibilityIcon = diaryVisibilityInfo.Icon;

	return (
		<main className="min-h-screen bg-black text-white">
			<section>
				<div className="relative">
					<ProfileBanner
						src={profile.banner_url}
						editable={editMode}
						onChange={(banner_url) => updateProfile({ banner_url })}
					/>

					{editMode && (
						<div className="pointer-events-none absolute bottom-6 right-6 z-30 flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-white text-black shadow-lg lg:hidden">
							<Camera className="h-4 w-4" />
						</div>
					)}
				</div>

				<div className="relative -mt-24 px-5 md:px-16">
					<div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
						<div className="flex flex-col gap-5 md:flex-row md:items-end md:gap-6">
							<div className="relative h-[145px] w-[145px] md:h-auto md:w-auto">
								<div className="absolute left-0 top-0 origin-top-left scale-[0.82] md:static md:scale-100">
									<div className="relative">
										<ProfileAvatar
											src={profile.avatar_url}
											displayName={profile.display_name}
											editable={editMode}
											onChange={(avatar_url) =>
												updateProfile({ avatar_url })
											}
										/>

										{editMode && (
											<div className="pointer-events-none absolute bottom-1 right-[-10px] z-40 flex h-9 w-9 items-center justify-center rounded-full border-2 border-accent bg-white text-black shadow-lg lg:hidden">
												<Camera className="h-4 w-4" />
											</div>
										)}
									</div>
								</div>
							</div>

							<div className="flex w-full items-start justify-between gap-4 pb-0 md:block md:w-auto md:pb-4">
								<div className="min-w-0">
									<h1 className="text-3xl font-black leading-tight md:text-5xl">
										{profile.display_name}
									</h1>

									<p className="mt-1 text-sm text-muted md:mt-2 md:text-base">
										{formatJoined(profile.created_at)}
									</p>

									<div
										className={`mt-2 flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide md:mt-3 md:gap-2 md:px-4 md:py-1.5 md:text-xs ${diaryVisibilityInfo.className}`}
									>
										<DiaryVisibilityIcon className="h-3 w-3 md:h-3.5 md:w-3.5" />
										{diaryVisibilityInfo.label}
									</div>

									<div className="mt-3 md:mt-4">
										<StreamingServices
											userId={profile.id}
											editable={editMode}
										/>
									</div>
								</div>

								<div className="flex shrink-0 flex-col items-center gap-3 md:hidden">
									<div className="flex gap-3">
										<div className="text-center">
											<div className="mb-1 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
												<Users className="h-4 w-4" />
											</div>

											<p className="text-sm font-bold leading-none">
												{friendCount}
											</p>

											<p className="mt-1 text-[9px] text-muted">
												FRIENDS
											</p>
										</div>

										<div className="text-center">
											<div className="mb-1 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
												<Film className="h-4 w-4" />
											</div>

											<p className="text-sm font-bold leading-none">
												{loggedCount}
											</p>

											<p className="mt-1 text-[9px] text-muted">
												LOGGED
											</p>
										</div>
									</div>

									{!editMode ? (
										<button
											type="button"
											onClick={handleStartEdit}
											className="flex h-9 w-[104px] items-center justify-center gap-1.5 rounded-full bg-accent text-xs font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover"
										>
											<Pencil className="h-3.5 w-3.5" />
											Edit
										</button>
									) : (
										<div className="flex flex-col gap-2">
											<button
												type="button"
												onClick={handleSaveChanges}
												disabled={saving}
												className="flex h-9 w-[104px] items-center justify-center gap-1.5 rounded-full bg-accent text-xs font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover disabled:opacity-50"
											>
												<Save className="h-3.5 w-3.5" />
												{saving ? "Saving" : "Save"}
											</button>

											<button
												type="button"
												onClick={handleCancelEdit}
												disabled={saving}
												className="flex h-9 w-[104px] items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] text-xs font-bold text-white transition hover:bg-white/[0.1] disabled:opacity-50"
											>
												<X className="h-3.5 w-3.5" />
												Cancel
											</button>
										</div>
									)}
								</div>
							</div>
						</div>

						<div className="hidden flex-col items-center gap-6 pb-4 lg:flex lg:min-w-[260px]">
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

							{!editMode ? (
								<button
									type="button"
									onClick={handleStartEdit}
									className="flex h-14 w-[180px] items-center justify-center gap-2 rounded-full bg-accent text-sm font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover"
								>
									<Pencil className="h-4 w-4" />
									Edit profile
								</button>
							) : (
								<div className="flex flex-col gap-3">
									<button
										type="button"
										onClick={handleSaveChanges}
										disabled={saving}
										className="flex h-14 w-[180px] items-center justify-center gap-2 rounded-full bg-accent text-sm font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover disabled:opacity-50"
									>
										<Save className="h-4 w-4" />
										{saving ? "Saving..." : "Save changes"}
									</button>

									<button
										type="button"
										onClick={handleCancelEdit}
										disabled={saving}
										className="flex h-12 w-[180px] items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] text-sm font-bold text-white transition hover:bg-white/[0.1] disabled:opacity-50"
									>
										<X className="h-4 w-4" />
										Cancel
									</button>
								</div>
							)}
						</div>
					</div>

					<div className="mt-8 max-w-3xl md:mt-10">
						{editMode ? (
							<div>
								<div className="mb-2 flex items-center justify-between">
									<label className="block text-xs uppercase tracking-wide text-muted">
										Bio
									</label>

									<span className="text-xs text-muted">
										{draftBio.length}/280
									</span>
								</div>

								<textarea
									value={draftBio}
									maxLength={280}
									onChange={(event) =>
										setDraftBio(event.target.value)
									}
									placeholder="A little about you and your taste in movies..."
									className="min-h-[130px] w-full resize-y rounded-2xl border border-white/10 bg-[#151515] px-4 py-3 text-sm leading-6 text-white outline-none focus:border-accent md:min-h-[150px] md:px-5 md:py-4 md:text-lg md:leading-8"
								/>
							</div>
						) : (
							<p className="whitespace-pre-line text-sm leading-6 text-gray-200 md:text-lg md:leading-8">
								{profile.bio ||
									"You haven’t written a bio yet."}
							</p>
						)}
					</div>
				</div>
			</section>

			<>
				<ProfileDiaryStrip
					items={diaryItems}
					displayName={profile.display_name}
					isPrivate={profile.is_private_diary}
					showViewAll={diaryItems.length > 0}
					viewAllHref="/my-diary"
				/>

				<ProfileAchievementsPreview />
			</>
		</main>
	);
}