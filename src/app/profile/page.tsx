"use client";

import { useEffect, useMemo, useState } from "react";
import { Film, Globe2, Lock, Pencil, Save, Users, X } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import ProfileBanner from "@/components/profile/profile-banner";
import ProfileAvatar from "@/components/profile/profile-avatar";
import ProfileDiaryStrip, {
	ProfileAchievements,
} from "@/components/profile/profile-diary-strip";
import StreamingServices from "@/components/profile/streaming-services";

type ProfileData = {
	id: string;
	display_name: string;
	bio: string;
	avatar_url: string | null;
	banner_url: string;
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

export default function ProfilePage() {
	const supabase = useMemo(() => createClient(), []);

	const [profile, setProfile] = useState<ProfileData | null>(null);
	const [diaryItems, setDiaryItems] = useState<DiaryPreviewItem[]>([]);
	const [friendCount, setFriendCount] = useState(0);
	const [loggedCount, setLoggedCount] = useState(0);
	const [loading, setLoading] = useState(true);

	const [editMode, setEditMode] = useState(false);
	const [saving, setSaving] = useState(false);

	const [draftDisplayName, setDraftDisplayName] = useState("");
	const [draftBio, setDraftBio] = useState("");
	const [draftPrivateDiary, setDraftPrivateDiary] = useState(true);

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
					"id, display_name, bio, avatar_url, banner_url, is_private_diary, created_at",
				)
				.eq("id", user.id)
				.maybeSingle();

			if (error) {
				console.error(error.message);
			}

			const displayName =
				profileData?.display_name || getNameFromUser(user);

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
				created_at:
					profileData?.created_at ||
					user.created_at ||
					new Date().toISOString(),
			};

			setProfile(loadedProfile);
			setDraftDisplayName(loadedProfile.display_name);
			setDraftBio(loadedProfile.bio);
			setDraftPrivateDiary(loadedProfile.is_private_diary);

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

		loadProfile();
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

	async function handleSaveChanges() {
		if (!profile) return;

		try {
			setSaving(true);

			await updateProfile({
				display_name: draftDisplayName.trim() || profile.display_name,
				bio: draftBio,
				is_private_diary: draftPrivateDiary,
			});

			setEditMode(false);
		} finally {
			setSaving(false);
		}
	}

	function handleCancelEdit() {
		if (!profile) return;

		setDraftDisplayName(profile.display_name);
		setDraftBio(profile.bio);
		setDraftPrivateDiary(profile.is_private_diary);
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

	return (
		<main className="min-h-screen bg-black text-white">
			<section>
				<ProfileBanner
					src={profile.banner_url}
					editable={editMode}
					onChange={(banner_url) => updateProfile({ banner_url })}
				/>

				<div className="relative -mt-24 px-6 md:px-16">
					<div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
						<div className="flex flex-col gap-6 md:flex-row md:items-end">
							<ProfileAvatar
								src={profile.avatar_url}
								displayName={profile.display_name}
								editable={editMode}
								onChange={(avatar_url) =>
									updateProfile({ avatar_url })
								}
							/>

							<div className="pb-4">
								<h1 className="text-4xl font-black md:text-5xl">
									{profile.display_name}
								</h1>

								<p className="mt-2 text-muted">
									{formatJoined(profile.created_at)}
								</p>

								<div className="mt-3 flex w-fit items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-green-300">
									{profile.is_private_diary ? (
										<>
											<Lock className="h-3.5 w-3.5" />
											Private diary
										</>
									) : (
										<>
											<Globe2 className="h-3.5 w-3.5" />
											Public diary
										</>
									)}
								</div>

								<div className="mt-4">
									<StreamingServices
										userId={profile.id}
										editable={editMode}
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

							{!editMode && (
								<button
									type="button"
									onClick={() => setEditMode(true)}
									className="flex h-14 w-[180px] items-center justify-center gap-2 rounded-full bg-accent text-sm font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover"
								>
									<Pencil className="h-4 w-4" />
									Edit profile
								</button>
							)}
						</div>
					</div>

					{!editMode && (
						<div className="mt-10 max-w-3xl">
							<p className="whitespace-pre-line text-lg leading-8 text-gray-200">
								{profile.bio ||
									"You haven’t written a bio yet."}
							</p>
						</div>
					)}

					{editMode && (
						<div className="mt-12 max-w-5xl rounded-3xl border border-white/10 bg-white/[0.025] p-6 md:p-8">
							<div className="grid gap-6 md:grid-cols-2">
								<div>
									<label className="mb-2 block text-xs uppercase tracking-wide text-muted">
										Display name
									</label>

									<input
										value={draftDisplayName}
										onChange={(event) =>
											setDraftDisplayName(
												event.target.value,
											)
										}
										className="h-14 w-full rounded-2xl border border-white/10 bg-[#151515] px-5 text-white outline-none focus:border-accent"
									/>
								</div>
							</div>

							<div className="mt-6">
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
									className="min-h-[140px] w-full resize-y rounded-2xl border border-white/10 bg-[#151515] px-5 py-4 text-white outline-none focus:border-accent"
								/>
							</div>

							<div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-[#151515] p-5">
								<div className="flex items-start gap-3">
									<Lock className="mt-1 h-5 w-5 text-white" />

									<div>
										<p className="font-bold text-white">
											Private diary
										</p>

										<p className="mt-1 text-sm text-muted">
											Only friends you approve can see
											what you have been watching.
										</p>
									</div>
								</div>

								<button
									type="button"
									onClick={() =>
										setDraftPrivateDiary((value) => !value)
									}
									className={`relative h-8 w-14 rounded-full transition ${
										draftPrivateDiary
											? "bg-accent"
											: "bg-white/20"
									}`}
									aria-label="Toggle private diary"
								>
									<span
										className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
											draftPrivateDiary
												? "left-7"
												: "left-1"
										}`}
									/>
								</button>
							</div>

							<div className="mt-6 flex flex-wrap gap-3">
								<button
									type="button"
									onClick={handleSaveChanges}
									disabled={saving}
									className="flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
								>
									<Save className="h-4 w-4" />
									{saving ? "Saving..." : "Save changes"}
								</button>

								<button
									type="button"
									onClick={handleCancelEdit}
									disabled={saving}
									className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-6 text-sm font-bold text-white transition hover:bg-white/[0.1] disabled:opacity-50"
								>
									<X className="h-4 w-4" />
									Cancel
								</button>
							</div>
						</div>
					)}
				</div>
			</section>

			{!editMode && (
				<>
					<ProfileDiaryStrip
						items={diaryItems}
						displayName={profile.display_name}
						isPrivate={profile.is_private_diary}
						showViewAll={diaryItems.length > 0}
						viewAllHref="/my-diary"
					/>

					<ProfileAchievements />
				</>
			)}
		</main>
	);
}
