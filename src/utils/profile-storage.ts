const KEY = "my-profile";

export type ProfileData = {
	banner: string;
	avatar: string;
	bio: string;
};

const defaultProfile: ProfileData = {
	banner: "/images/profile-banner.jpg",
	avatar: "/images/avatar.jpg",
	bio: "My name is Jane and I have a terrible memory, so this helps me keep all my TV shows and movies saved in one place.",
};

export function getProfile(): ProfileData {
	if (typeof window === "undefined") return defaultProfile;

	try {
		return JSON.parse(localStorage.getItem(KEY) || "null") || defaultProfile;
	} catch {
		return defaultProfile;
	}
}

export function saveProfile(data: ProfileData) {
	localStorage.setItem(KEY, JSON.stringify(data));
}