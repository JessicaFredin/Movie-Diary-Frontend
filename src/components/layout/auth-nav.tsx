"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FaRegBell } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";

type Profile = {
	display_name: string | null;
	avatar_url: string | null;
};

function getInitials(nameOrEmail: string) {
	const clean = nameOrEmail.trim();

	if (clean.includes("@")) {
		return clean[0]?.toUpperCase() ?? "U";
	}

	const parts = clean.split(" ").filter(Boolean);

	if (parts.length >= 2) {
		return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
	}

	return clean.slice(0, 2).toUpperCase();
}

export default function AuthNav() {
	const supabase = useMemo(() => createClient(), []);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [fallbackName, setFallbackName] = useState("User");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadUser() {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				setProfile(null);
				setLoading(false);
				return;
			}

			const { data } = await supabase
				.from("profiles")
				.select("display_name, avatar_url")
				.eq("id", user.id)
				.single();

			setFallbackName(
				data?.display_name ||
					user.user_metadata?.full_name ||
					user.user_metadata?.name ||
					user.email ||
					"User",
			);

			setProfile({
				display_name: data?.display_name ?? null,
				avatar_url:
					data?.avatar_url ?? user.user_metadata?.avatar_url ?? null,
			});

			setLoading(false);
		}

		loadUser();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(() => {
			loadUser();
		});

		return () => subscription.unsubscribe();
	}, [supabase]);

	if (loading) return null;

	if (!profile) {
		return (
			<div className="flex items-center gap-8 text-gray-300">
				<Link href="/login" className="hover:text-white">
					Login
				</Link>
				<Link href="/signup" className="hover:text-white">
					Signup
				</Link>
			</div>
		);
	}

	const initials = getInitials(profile.display_name || fallbackName);

	return (
		<div className="flex items-center gap-5">
			<button className="relative text-gray-300 hover:text-white">
				<FaRegBell size={18} />

				<span className="absolute -right-2 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
					2
				</span>
			</button>

			<Link href="/profile">
				{profile.avatar_url ? (
					<img
						src={profile.avatar_url}
						alt="Profile"
						className="h-11 w-11 rounded-full border-2 border-accent object-cover"
					/>
				) : (
					<div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-accent bg-[#1f2937] text-sm font-bold text-white">
						{initials}
					</div>
				)}
			</Link>
		</div>
	);
}
