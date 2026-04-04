"use client";

import { ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const languages = [
	{ code: "US", name: "English" },
	{ code: "ES", name: "Español" },
	{ code: "FR", name: "Français" },
	{ code: "DE", name: "Deutsch" },
	{ code: "BR", name: "Português" },
	{ code: "JP", name: "日本語" },
	{ code: "KR", name: "한국어" },
];

export default function LanguagePage() {
        const router = useRouter();
	return (
		<div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
			<div className="flex items-center gap-4 border-b border-border pb-4">
				<ArrowLeft
					size={20}
					className="text-muted cursor-pointer"
					onClick={() => router.back()}
				/>
				<h1 className="text-xl font-semibold">Language & Appearance</h1>
			</div>

			<div className="bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-lg">
				<h2 className="font-semibold">Language</h2>

				{languages.map((l, i) => (
					<div
						key={i}
						className={`flex items-center justify-between px-5 py-4 rounded-xl border ${
							i === 0
								? "border-accent bg-red-500/10"
								: "border-border bg-surface-muted"
						}`}
					>
						<p>
							<span className="text-muted mr-2">{l.code}</span>
							{l.name}
						</p>

						{i === 0 && <Check size={16} className="text-accent" />}
					</div>
				))}
			</div>

			{/* THEME */}

			<div className="bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-lg">
				<h2 className="font-semibold">Theme</h2>

				<div className="grid grid-cols-3 gap-4">
					<div className="border border-accent bg-red-500/10 rounded-xl p-6 text-center">
						🌙
						<p className="mt-2">Dark</p>
					</div>

					<div className="border border-border bg-surface-muted rounded-xl p-6 text-center">
						☀️
						<p className="mt-2">Light</p>
					</div>

					<div className="border border-border bg-surface-muted rounded-xl p-6 text-center">
						📱
						<p className="mt-2">System</p>
					</div>
				</div>
			</div>

			<button className="w-full bg-accent py-4 rounded-xl font-semibold">
				Save Preferences
			</button>
		</div>
	);
}
