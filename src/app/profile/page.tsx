// "use client"

// import RecentlyLogged from "@/components/profile/recently-logged";
// import ProfileBanner from "@/components/profile/profile-banner";
// import ProfileAvatar from "@/components/profile/profile-avatar";
// import ProfileInfo from "@/components/profile/profile-info";
// import ProfileStats from "@/components/profile/profile-stats";
// import BottomNav from "@/components/profile/bottom-nav";
// import Recommendations from "@/components/profile/recommendations";
// // import CompactWatchStats from "@/components/profile/compact-watch-stats";
// import { getProfile, saveProfile, ProfileData } from "@/utils/profile-storage";
// import { useEffect, useState } from "react";

// export default function ProfilePage() {
// 	const [profile, setProfile] = useState<ProfileData | null>(null);

// 	useEffect(() => {
// 		setProfile(getProfile());
// 	}, []);

// 	if (!profile) return null;

// 	function handleSave(data: ProfileData) {
// 		saveProfile(data);
// 		setProfile(data);
// 	}

// 	function updateProfile(updated: Partial<ProfileData>) {
// 		if (!profile) return;

// 		const newProfile: ProfileData = {
// 			banner: updated.banner ?? profile.banner,
// 			avatar: updated.avatar ?? profile.avatar,
// 			bio: updated.bio ?? profile.bio,
// 		};

// 		setProfile(newProfile);
// 		saveProfile(newProfile);
// 	}

// 	return (
// 		<div className="min-h-screen flex flex-col">
// 			{/* Banner */}
// 			<ProfileBanner
// 				src={profile.banner}
// 				onChange={(banner) => updateProfile({ banner })}
// 			/>

// 			{/* Avatar + Info + Stats */}
// 			<div className="flex items-start justify-between ">
// 				<div className="relative">
// 					<div className="absolute -top-12">
// 						<ProfileAvatar
// 							src={profile.avatar}
// 							onChange={(avatar) => updateProfile({ avatar })}
// 						/>
// 					</div>
// 					<ProfileInfo
// 						bio={profile.bio}
// 						onChange={(bio) => updateProfile({ bio })}
// 					/>
// 				</div>
// 				<div className="mt-6 flex flex-col items-end gap-3">
// 					<ProfileStats />
// 				</div>
// 			</div>

// 			{/* <div className="flex flex-col items-center">
// 				<CompactWatchStats />
// 			</div> */}

// 			{/* Recently Logged */}
// 			<RecentlyLogged />

// 			{/* Recommendations */}
// 			<Recommendations />

// 			{/* Mobile Bottom Nav */}
// 			<BottomNav />

// 		</div>
// 	);
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import RecentlyLogged from "@/components/profile/recently-logged";
import ProfileBanner from "@/components/profile/profile-banner";
import ProfileAvatar from "@/components/profile/profile-avatar";
import ProfileInfo from "@/components/profile/profile-info";
import ProfileStats from "@/components/profile/profile-stats";
import BottomNav from "@/components/profile/bottom-nav";
import Recommendations from "@/components/profile/recommendations";
import { createClient } from "@/lib/supabase/client";

type ProfileData = {
	banner_url: string;
	avatar_url: string | null;
	bio: string;
};

const defaultProfile: ProfileData = {
	banner_url: "/images/profile-banner.jpg",
	avatar_url: null,
	bio: "",
};

export default function ProfilePage() {
	const supabase = useMemo(() => createClient(), []);
	const [userId, setUserId] = useState<string | null>(null);
	const [profile, setProfile] = useState<ProfileData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadProfile() {
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
				.select("bio, avatar_url, banner_url")
				.eq("id", user.id)
				.single();

			if (error) {
				console.error(error.message);
			}

			setProfile({
				banner_url: data?.banner_url || defaultProfile.banner_url,
				avatar_url:
					data?.avatar_url ||
					user.user_metadata?.avatar_url ||
					defaultProfile.avatar_url,
				bio: data?.bio || defaultProfile.bio,
			});

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
		};

		setProfile(newProfile);

		const { error } = await supabase
			.from("profiles")
			.update({
				banner_url: newProfile.banner_url,
				avatar_url: newProfile.avatar_url,
				bio: newProfile.bio,
			})
			.eq("id", userId);

		if (error) {
			alert(error.message);
		}
	}

	if (loading) return null;

	if (!profile) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p>You need to log in to view your profile.</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col">
			<ProfileBanner
				src={profile.banner_url}
				onChange={(banner_url) => updateProfile({ banner_url })}
			/>

			<div className="flex items-start justify-between">
				<div className="relative">
					<div className="absolute -top-12">
						<ProfileAvatar
							src={profile.avatar_url}
							onChange={(avatar_url) =>
								updateProfile({ avatar_url })
							}
						/>
					</div>

					<ProfileInfo
						bio={profile.bio}
						onChange={(bio) => updateProfile({ bio })}
					/>
				</div>

				<div className="mt-6 flex flex-col items-end gap-3">
					<ProfileStats />
				</div>
			</div>

			<RecentlyLogged />
			<Recommendations />
			<BottomNav />
		</div>
	);
}