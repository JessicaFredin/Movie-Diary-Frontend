"use client";
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
import { useState } from "react";

const privacyOptions = [
	{
		label: "Public Profile",
		description: "Anyone can view your profile",
		icon: Users,
		default: true,
	},
	{
		label: "Public Diary",
		description: "Share your watch diary with everyone",
		icon: BookOpen,
		default: false,
	},
	{
		label: "Public Watchlist",
		description: "Let others see what you plan to watch",
		icon: Eye,
		default: true,
	},
	{
		label: "Public Ratings",
		description: "Show your ratings to other users",
		icon: Star,
		default: true,
	},
	{
		label: "Online Status",
		description: "Show when you're active",
		icon: Globe,
		default: false,
	},
	{
		label: "Friend Requests",
		description: "Allow others to send requests",
		icon: UserPlus,
		default: true,
	},
];

export default function PrivacyPage() {
    const router = useRouter()
	const [settings, setSettings] = useState(
		privacyOptions.map((o) => o.default),
	);

	function toggle(index: number) {
		const updated = [...settings];
		updated[index] = !updated[index];
		setSettings(updated);
	}

	return (
		<div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
			{/* Header */}
			<div className="flex items-center gap-4 border-b border-border pb-4">
				<ArrowLeft
					size={20}
					className="text-muted cursor-pointer"
					onClick={() => router.back()}
				/>
				<h1 className="text-xl font-semibold">Privacy</h1>
			</div>

			{/* Settings Card */}
			<div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-lg">
				{privacyOptions.map((option, i) => {
					const Icon = option.icon;

					return (
						<div
							key={i}
							className="flex items-center justify-between px-6 py-5 border-b border-border last:border-none"
						>
							<div className="flex items-center gap-4">
								<div className="w-10 h-10 rounded-xl bg-surface-muted flex items-center justify-center">
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
								enabled={settings[i]}
								onClick={() => toggle(i)}
							/>
						</div>
					);
				})}
			</div>

			{/* Save Button */}
			<button className="w-full bg-accent py-4 rounded-xl font-semibold">
				Save Privacy Settings
			</button>
		</div>
	);
}

function Toggle({
	enabled,
	onClick,
}: {
	enabled: boolean;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className={`w-12 h-6 rounded-full transition relative ${
				enabled ? "bg-accent" : "bg-surface-muted"
			}`}
		>
			<div
				className={`absolute top-1 w-4 h-4 rounded-full bg-white transition ${
					enabled ? "right-1" : "left-1"
				}`}
			/>
		</button>
	);
}
