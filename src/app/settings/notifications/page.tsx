"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
	getOrCreateUserSettings,
	saveUserSettings,
	type UserSettings,
} from "@/utils/settings-storage";

type NotificationKey =
	| "push_notifications"
	| "email_notifications"
	| "friend_request_notifications"
	| "recommendation_notifications"
	| "diary_comment_notifications"
	| "weekly_digest_notifications"
	| "new_release_notifications";

const options: {
	key: NotificationKey;
	title: string;
	description: string;
}[] = [
	{
		key: "push_notifications",
		title: "Push Notifications",
		description: "Receive notifications inside the app.",
	},
	{
		key: "email_notifications",
		title: "Email Notifications",
		description: "Receive important updates by email.",
	},
	{
		key: "friend_request_notifications",
		title: "Friend Requests",
		description: "Notify me when someone sends a friend request.",
	},
	{
		key: "recommendation_notifications",
		title: "Recommendations",
		description: "Notify me about personalized recommendations.",
	},
	{
		key: "diary_comment_notifications",
		title: "Diary Comments",
		description: "Notify me when someone comments on my activity.",
	},
	{
		key: "weekly_digest_notifications",
		title: "Weekly Digest",
		description: "Send me a weekly summary of my activity.",
	},
	{
		key: "new_release_notifications",
		title: "New Releases",
		description: "Notify me when interesting new titles are released.",
	},
];

export default function NotificationsPage() {
	const router = useRouter();
	const supabase = useMemo(() => createClient(), []);

	const [settings, setSettings] = useState<UserSettings | null>(null);
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
				setLoading(false);
				return;
			}

			const data = await getOrCreateUserSettings(supabase, user.id);
			setSettings(data);
			setLoading(false);
		}

		void loadSettings();
	}, [supabase]);

	function toggle(key: NotificationKey): void {
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
		if (!settings) return;

		setSaving(true);
		setMessage("");

		try {
			await saveUserSettings(supabase, settings);
			setMessage("Notification settings saved.");
		} catch (error) {
			setMessage(
				error instanceof Error
					? error.message
					: "Could not save notification settings.",
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

				<h1 className="text-xl font-semibold">Notifications</h1>
			</div>

			<div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-lg">
				{options.map((option) => (
					<div
						key={option.key}
						className="flex items-center justify-between border-b border-border px-6 py-5 last:border-none"
					>
						<div>
							<p className="font-medium">{option.title}</p>
							<p className="text-sm text-muted">
								{option.description}
							</p>
						</div>

						<Toggle
							enabled={Boolean(settings?.[option.key])}
							disabled={loading || !settings}
							onClick={() => toggle(option.key)}
						/>
					</div>
				))}
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
				{saving ? "Saving..." : "Save Notifications"}
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
