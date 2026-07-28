"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
	getOrCreateUserSettings,
	saveUserSettings,
	type LanguagePreference,
	type ThemePreference,
	type UserSettings,
} from "@/utils/settings-storage";

const languages: { code: LanguagePreference; flag: string; name: string }[] = [
	{ code: "en", flag: "US", name: "English" },
	{ code: "sv", flag: "SE", name: "Svenska" },
	{ code: "es", flag: "ES", name: "Español" },
	{ code: "fr", flag: "FR", name: "Français" },
	{ code: "de", flag: "DE", name: "Deutsch" },
	{ code: "pt", flag: "BR", name: "Português" },
	{ code: "ja", flag: "JP", name: "日本語" },
	{ code: "ko", flag: "KR", name: "한국어" },
];

const themes: { value: ThemePreference; icon: string; label: string }[] = [
	{ value: "dark", icon: "🌙", label: "Dark" },
	{ value: "light", icon: "☀️", label: "Light" },
	{ value: "system", icon: "📱", label: "System" },
];

export default function LanguagePage() {
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

	async function handleSave(): Promise<void> {
		if (!settings) return;

		setSaving(true);
		setMessage("");

		try {
			await saveUserSettings(supabase, settings);
			setMessage("Preferences saved.");
		} catch (error) {
			setMessage(
				error instanceof Error
					? error.message
					: "Could not save preferences.",
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

				<h1 className="text-xl font-semibold">Language & Appearance</h1>
			</div>

			<div className="space-y-4 rounded-3xl border border-border bg-surface p-6 shadow-lg">
				<h2 className="font-semibold">Language</h2>

				{languages.map((language) => {
					const active = settings?.language === language.code;

					return (
						<button
							key={language.code}
							type="button"
							disabled={loading || !settings}
							onClick={() =>
								setSettings((current) =>
									current
										? {
												...current,
												language: language.code,
											}
										: current,
								)
							}
							className={`flex w-full items-center justify-between rounded-xl border px-5 py-4 text-left transition disabled:opacity-50 ${
								active
									? "border-accent bg-red-500/10"
									: "border-border bg-surface-muted hover:bg-white/5"
							}`}
						>
							<p>
								<span className="mr-2 text-muted">
									{language.flag}
								</span>
								{language.name}
							</p>

							{active && (
								<Check size={16} className="text-accent" />
							)}
						</button>
					);
				})}
			</div>

			<div className="space-y-4 rounded-3xl border border-border bg-surface p-6 shadow-lg">
				<h2 className="font-semibold">Theme</h2>

				<div className="grid grid-cols-3 gap-4">
					{themes.map((theme) => {
						const active = settings?.theme === theme.value;

						return (
							<button
								key={theme.value}
								type="button"
								disabled={loading || !settings}
								onClick={() =>
									setSettings((current) =>
										current
											? {
													...current,
													theme: theme.value,
												}
											: current,
									)
								}
								className={`rounded-xl border p-6 text-center transition disabled:opacity-50 ${
									active
										? "border-accent bg-red-500/10"
										: "border-border bg-surface-muted hover:bg-white/5"
								}`}
							>
								<span>{theme.icon}</span>
								<p className="mt-2">{theme.label}</p>
							</button>
						);
					})}
				</div>
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
				{saving ? "Saving..." : "Save Preferences"}
			</button>
		</div>
	);
}
