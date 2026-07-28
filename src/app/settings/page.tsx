"use client";

import { useEffect, useMemo, useState } from "react";
import {
	ArrowLeft,
	Lock,
	Globe,
	Bell,
	Shield,
	Download,
	Trash2,
	ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ProfileCardData = {
	display_name: string;
	email: string;
	avatar_url: string | null;
};

function getInitials(nameOrEmail: string): string {
	const clean = nameOrEmail.trim();

	if (!clean) return "U";

	const parts = clean.split(" ").filter(Boolean);

	if (parts.length >= 2) {
		return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
	}

	return clean.slice(0, 2).toUpperCase();
}

export default function SettingsPage() {
	const router = useRouter();
	const supabase = useMemo(() => createClient(), []);

	const [profile, setProfile] = useState<ProfileCardData | null>(null);
	const [loading, setLoading] = useState(true);

	const settings = [
		{
			icon: <Lock size={18} />,
			title: "Password & Security",
			description: "Update password and login settings",
			color: "bg-red-500/15 text-red-400",
			route: "/settings/security",
		},
		{
			icon: <Globe size={18} />,
			title: "Language & Appearance",
			description: "Display language and theme preferences",
			color: "bg-blue-500/15 text-blue-400",
			route: "/settings/language",
		},
		{
			icon: <Bell size={18} />,
			title: "Notifications",
			description: "Manage how you receive alerts",
			color: "bg-yellow-500/15 text-yellow-400",
			route: "/settings/notifications",
		},
		{
			icon: <Shield size={18} />,
			title: "Privacy",
			description: "Control who can see your activity",
			color: "bg-green-500/15 text-green-400",
			route: "/settings/privacy",
		},
		{
			icon: <Download size={18} />,
			title: "Data Export",
			description: "Download a copy of your data",
			color: "bg-purple-500/15 text-purple-400",
			route: "/settings/export",
		},
		{
			icon: <Trash2 size={18} />,
			title: "Delete Account",
			description: "Permanently remove your account",
			color: "bg-red-600/15 text-red-500",
			danger: true,
			route: "/settings/delete",
		},
	];

	useEffect(() => {
		async function loadProfile(): Promise<void> {
			setLoading(true);

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
				.maybeSingle();

			const profileData = data as {
				display_name: string | null;
				avatar_url: string | null;
			} | null;

			setProfile({
				display_name:
					profileData?.display_name ||
					user.user_metadata?.full_name ||
					user.user_metadata?.name ||
					user.email ||
					"User",
				email: user.email ?? "",
				avatar_url:
					profileData?.avatar_url ||
					user.user_metadata?.avatar_url ||
					null,
			});

			setLoading(false);
		}

		void loadProfile();
	}, [supabase]);

	return (
		<div className="mx-auto max-w-3xl space-y-8 px-6 py-10">
			<div className="flex items-center justify-between border-b border-border pb-4">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => router.back()}
						className="text-muted transition hover:text-white"
						aria-label="Go back"
					>
						<ArrowLeft size={20} />
					</button>

					<h1 className="text-xl font-semibold">Settings</h1>
				</div>
			</div>

			<div className="flex items-center justify-between rounded-3xl border border-border bg-surface p-6 shadow-lg">
				<div className="flex items-center gap-4">
					<div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-accent text-lg font-semibold text-white">
						{profile?.avatar_url ? (
							<img
								src={profile.avatar_url}
								alt={profile.display_name}
								className="h-full w-full object-cover"
							/>
						) : (
							getInitials(profile?.display_name ?? "User")
						)}
					</div>

					<div>
						<p className="text-lg font-semibold">
							{loading
								? "Loading..."
								: (profile?.display_name ?? "Not logged in")}
						</p>
						<p className="text-sm text-muted">
							{profile?.email ?? ""}
						</p>
					</div>
				</div>

				<Link
					href="/profile"
					className="text-sm font-medium text-accent hover:underline"
				>
					View Profile
				</Link>
			</div>

			<div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-lg">
				{settings.map((item, index) => (
					<Link key={item.route} href={item.route}>
						<div
							className={`flex cursor-pointer items-center justify-between px-6 py-5 transition hover:bg-white/5 ${
								index !== settings.length - 1
									? "border-b border-border"
									: ""
							}`}
						>
							<div className="flex items-center gap-4">
								<div
									className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}
								>
									{item.icon}
								</div>

								<div>
									<p
										className={`font-medium ${
											item.danger ? "text-red-500" : ""
										}`}
									>
										{item.title}
									</p>

									<p className="text-sm text-muted">
										{item.description}
									</p>
								</div>
							</div>

							<ChevronRight size={18} className="text-muted" />
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}