"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Globe2, Lock } from "lucide-react";

import RecentlyLogged from "@/components/profile/recently-logged";
import ProfileBanner from "@/components/profile/profile-banner";
import ProfileAvatar from "@/components/profile/profile-avatar";
import ProfileInfo from "@/components/profile/profile-info";
import ProfileStats from "@/components/profile/profile-stats";
import BottomNav from "@/components/profile/bottom-nav";
import Recommendations from "@/components/profile/recommendations";
import StreamingServices from "@/components/profile/streaming-services";
import { createClient } from "@/lib/supabase/client";

type ProfileData = {
	banner_url: string;
	avatar_url: string | null;
	bio: string;
	display_name: string;
	is_private_diary: boolean;
	created_at: string | null;
};

type ProfileRow = {
	banner_url: string | null;
	avatar_url: string | null;
	bio: string | null;
	display_name: string | null;
	is_private_diary: boolean | null;
	created_at: string | null;
};

const defaultProfile: ProfileData = {
	banner_url: "/images/profile-banner.jpg",
	avatar_url: null,
	bio: "",
	display_name: "User",
	is_private_diary: true,
	created_at: null,
};

function formatJoined(date?: string | null) {
	if (!date) return "Joined recently";

	return `Joined ${new Intl.DateTimeFormat("en", {
		month: "long",
		year: "numeric",
	}).format(new Date(date))}`;
}

export default function ProfilePage() {
	const supabase = useMemo(() => createClient(), []);

	const [userId, setUserId] = useState<string | null>(null);
	const [profile, setProfile] = useState<ProfileData | null>(null);
	const [loggedCount, setLoggedCount] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadProfile() {
			setLoading(true);

			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				setLoading(false);
				return;
			}

			setUserId(user.id);

			const { data, error } = await supabase
				.from("profiles")
				.select(
					"bio, avatar_url, banner_url, display_name, is_private_diary, created_at",
				)
				.eq("id", user.id)
				.maybeSingle();

			if (error) {
				console.error(error.message);
			}

			const profileRow = data as ProfileRow | null;

			const signedUpName =
				user.user_metadata?.full_name ||
				user.user_metadata?.name ||
				user.email ||
				"User";

			setProfile({
				banner_url: profileRow?.banner_url || defaultProfile.banner_url,
				avatar_url:
					profileRow?.avatar_url ||
					user.user_metadata?.avatar_url ||
					defaultProfile.avatar_url,
				bio: profileRow?.bio || defaultProfile.bio,
				display_name: profileRow?.display_name || signedUpName,
				is_private_diary:
					profileRow?.is_private_diary ??
					defaultProfile.is_private_diary,
				created_at: profileRow?.created_at || user.created_at || null,
			});

			const { count } = await supabase
				.from("diary_entries")
				.select("id", { count: "exact", head: true })
				.eq("user_id", user.id);

			setLoggedCount(count ?? 0);
			setLoading(false);
		}

		loadProfile();
	}, [supabase]);

	async function updateProfile(updated: Partial<ProfileData>) {
		if (!profile || !userId) return;

		const newProfile: ProfileData = {
			banner_url: updated.banner_url ?? profile.banner_url,
			avatar_url: updated.avatar_url ?? profile.avatar_url,
			bio: updated.bio ?? profile.bio,
			display_name: updated.display_name ?? profile.display_name,
			is_private_diary:
				updated.is_private_diary ?? profile.is_private_diary,
			created_at: profile.created_at,
		};

		setProfile(newProfile);

		const { error } = await supabase.from("profiles").upsert({
			id: userId,
			banner_url: newProfile.banner_url,
			avatar_url: newProfile.avatar_url,
			bio: newProfile.bio,
			display_name: newProfile.display_name,
			is_private_diary: newProfile.is_private_diary,
			updated_at: new Date().toISOString(),
		});

		if (error) {
			alert(error.message);
		}
	}

	if (loading) return null;

	if (!profile) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-black text-white">
				<p>You need to log in to view your profile.</p>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-black text-white pb-20 md:pb-0">
			<ProfileBanner
				src={profile.banner_url}
				onChange={(banner_url) => updateProfile({ banner_url })}
			/>

			<section className="relative z-10 -mt-20 px-6 md:px-24">
				<div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
					<div className="flex flex-col gap-5 sm:flex-row sm:items-end">
						<ProfileAvatar
							src={profile.avatar_url}
							name={profile.display_name}
							onChange={(avatar_url) =>
								updateProfile({ avatar_url })
							}
						/>

						<div className="pb-2">
							<h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
								{profile.display_name}
							</h1>

							<p className="mt-1 text-sm text-muted">
								{formatJoined(profile.created_at)}
							</p>

							<div
								className={`mt-3 flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs uppercase tracking-wide ${
									profile.is_private_diary
										? "border-white/10 bg-white/[0.04] text-muted"
										: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
								}`}
							>
								{profile.is_private_diary ? (
									<Lock className="h-3.5 w-3.5" />
								) : (
									<Globe2 className="h-3.5 w-3.5" />
								)}

								{profile.is_private_diary
									? "Private diary"
									: "Public diary"}
							</div>

							<div className="mt-4">
								<StreamingServices
									userId={userId ?? undefined}
									editable
								/>
							</div>
						</div>
					</div>

					<div className="flex flex-col items-start gap-4 lg:items-end lg:pb-4">
						<ProfileStats
							friendsCount={0}
							loggedCount={loggedCount}
						/>

						{userId && (
							<Link
								href={`/users/${userId}`}
								className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-semibold hover:bg-white/[0.09]"
							>
								<ExternalLink className="h-4 w-4" />
								View public profile
							</Link>
						)}
					</div>
				</div>

				<div className="mt-10 max-w-3xl">
					<ProfileInfo
						displayName={profile.display_name}
						bio={profile.bio}
						isPrivateDiary={profile.is_private_diary}
						onSave={(values) =>
							updateProfile({
								display_name: values.displayName,
								bio: values.bio,
								is_private_diary: values.isPrivateDiary,
							})
						}
					/>
				</div>
			</section>

			<RecentlyLogged />
			<Recommendations />
			<BottomNav />
		</main>
	);
}
