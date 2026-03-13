"use client"

import RecentlyLogged from "@/components/profile/recently-logged";
import ProfileBanner from "@/components/profile/profile-banner";
import ProfileAvatar from "@/components/profile/profile-avatar";
import ProfileInfo from "@/components/profile/profile-info";
import ProfileStats from "@/components/profile/profile-stats";
import BottomNav from "@/components/profile/bottom-nav";
import Recommendations from "@/components/profile/recommendations";
// import CompactWatchStats from "@/components/profile/compact-watch-stats";
import { getProfile, saveProfile, ProfileData } from "@/utils/profile-storage";
import { useEffect, useState } from "react";


export default function ProfilePage() {
	const [profile, setProfile] = useState<ProfileData | null>(null);

	useEffect(() => {
		setProfile(getProfile());
	}, []);

	if (!profile) return null;

	function handleSave(data: ProfileData) {
		saveProfile(data);
		setProfile(data);
	}

	function updateProfile(updated: Partial<ProfileData>) {
		if (!profile) return;

		const newProfile: ProfileData = {
			banner: updated.banner ?? profile.banner,
			avatar: updated.avatar ?? profile.avatar,
			bio: updated.bio ?? profile.bio,
		};

		setProfile(newProfile);
		saveProfile(newProfile);
	}

	
	return (
		<div className="min-h-screen flex flex-col">
			{/* Banner */}
			<ProfileBanner
				src={profile.banner}
				onChange={(banner) => updateProfile({ banner })}
			/>

			{/* Avatar + Info + Stats */}
			<div className="flex items-start justify-between ">
				<div className="relative">
					<div className="absolute -top-12">
						<ProfileAvatar
							src={profile.avatar}
							onChange={(avatar) => updateProfile({ avatar })}
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

			{/* <div className="flex flex-col items-center">
				<CompactWatchStats />
			</div> */}

			{/* Recently Logged */}
			<RecentlyLogged />

			{/* Recommendations */}
			<Recommendations />

			{/* Mobile Bottom Nav */}
			<BottomNav />


		</div>
	);
}
