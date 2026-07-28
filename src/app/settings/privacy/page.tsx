"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Users,
	BookOpen,
	Eye,
	Star,
	Globe,
	UserPlus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
	getOrCreateUserSettings,
	saveUserSettings,
	type UserSettings,
} from "@/utils/settings-storage";

type PrivacyState = {
	public_profile: boolean;
	public_diary: boolean;
	public_watchlist: boolean;
	public_ratings: boolean;
	show_online_status: boolean;
	allow_friend_requests: boolean;
};

const privacyOptions: {
	key: keyof PrivacyState;
	label: string;
	description: string;
	icon: typeof Users;
}[] = [
	{
		key: "public_profile",
		label: "Public Profile",
		description: "Anyone can view your profile",
		icon: Users,
	},
	{
		key: "public_diary",
		label: "Public Diary",
		description: "Share your watch diary with everyone",
		icon: BookOpen,
	},
	{
		key: "public_watchlist",
		label: "Public Watchlist",
		description: "Let others see what you plan to watch",
		icon: Eye,
	},
	{
		key: "public_ratings",
		label: "Public Ratings",
		description: "Show your ratings to other users",
		icon: Star,
	},
	{
		key: "show_online_status",
		label: "Online Status",
		description: "Show when you're active",
		icon: Globe,
	},
	{
		key: "allow_friend_requests",
		label: "Friend Requests",
		description: "Allow others to send requests",
		icon: UserPlus,
	},
];

export default function PrivacyPage() {
	const router = useRouter();
	const supabase = useMemo(() => createClient(), []);

	const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
	const [settings, setSettings] = useState<PrivacyState | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		async function loadSettings(): Promise<void> {
			setLoading(true);

			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				setSettings(null);
				setUserSettings(null);
				setLoading(false);
				return;
			}

			const savedSettings = await getOrCreateUserSettings(
				supabase,
				user.id,
			);

			const { data: profileData } = await supabase
				.from("profiles")
				.select(
					"is_public, is_private_diary, allow_friend_requests, show_online_status",
				)
				.eq("id", user.id)
				.maybeSingle();

			const profile = profileData as {
				is_public: boolean | null;
				is_private_diary: boolean | null;
				allow_friend_requests: boolean | null;
				show_online_status: boolean | null;
			} | null;

			setUserSettings(savedSettings);

			setSettings({
				public_profile: profile?.is_public ?? true,
				public_diary: !(profile?.is_private_diary ?? true),
				public_watchlist: savedSettings.public_watchlist,
				public_ratings: savedSettings.public_ratings,
				show_online_status: profile?.show_online_status ?? false,
				allow_friend_requests: profile?.allow_friend_requests ?? true,
			});

			setLoading(false);
		}

		void loadSettings();
	}, [supabase]);

	function toggle(key: keyof PrivacyState): void {
		setSettings((current) =>
			current
				? {
						...current,
						[key]: !current[key],
					}
				: current,
		);
	}

	async function handleSave(): Promise<void> {
		if (!settings || !userSettings) return;

		setSaving(true);
		setMessage("");

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				setMessage("You need to be logged in.");
				return;
			}

			await saveUserSettings(supabase, {
				...userSettings,
				public_watchlist: settings.public_watchlist,
				public_ratings: settings.public_ratings,
			});

			const { error } = await supabase
				.from("profiles")
				.update({
					is_public: settings.public_profile,
					is_private_diary: !settings.public_diary,
					allow_friend_requests: settings.allow_friend_requests,
					show_online_status: settings.show_online_status,
					updated_at: new Date().toISOString(),
				})
				.eq("id", user.id);

			if (error) {
				throw new Error(error.message);
			}

			setMessage("Privacy settings saved.");
		} catch (error) {
			setMessage(
				error instanceof Error
					? error.message
					: "Could not save privacy settings.",
			);
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="mx-auto max-w-3xl space-y-8 px-6 py-10">
			<div className="flex items-center gap-4 border-b border-border pb-4">
				<button
					type="button"
					onClick={() => router.back()}
					className="text-muted transition hover:text-white"
					aria-label="Go back"
				>
					<ArrowLeft size={20} />
				</button>

				<h1 className="text-xl font-semibold">Privacy</h1>
			</div>

			<div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-lg">
				{privacyOptions.map((option) => {
					const Icon = option.icon;

					return (
						<div
							key={option.key}
							className="flex items-center justify-between border-b border-border px-6 py-5 last:border-none"
						>
							<div className="flex items-center gap-4">
								<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-muted">
									<Icon size={18} className="text-muted" />
								</div>

								<div>
									<p className="font-medium">
										{option.label}
									</p>
									<p className="text-sm text-muted">
										{option.description}
									</p>
								</div>
							</div>

							<Toggle
								enabled={Boolean(settings?.[option.key])}
								disabled={loading || !settings}
								onClick={() => toggle(option.key)}
							/>
						</div>
					);
				})}
			</div>

			{message && (
				<p className="rounded-xl bg-white/5 px-4 py-3 text-sm text-muted">
					{message}
				</p>
			)}

			<button
				type="button"
				onClick={handleSave}
				disabled={saving || loading || !settings}
				className="w-full rounded-xl bg-accent py-4 font-semibold disabled:opacity-50"
			>
				{saving ? "Saving..." : "Save Privacy Settings"}
			</button>
		</div>
	);
}

function Toggle({
	enabled,
	disabled,
	onClick,
}: {
	enabled: boolean;
	disabled?: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`relative h-6 w-12 rounded-full transition disabled:opacity-50 ${
				enabled ? "bg-accent" : "bg-surface-muted"
			}`}
		>
			<span
				className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
					enabled ? "right-1" : "left-1"
				}`}
			/>
		</button>
	);
}
