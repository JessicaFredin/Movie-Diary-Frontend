"use client";

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

export default function SettingsPage() {
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

	return (
		<div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
			{/* HEADER */}
			<div className="flex items-center justify-between border-b border-border pb-4">
				<div className="flex items-center gap-3">
					<ArrowLeft
						size={20}
						className="text-muted cursor-pointer"
					/>

					<h1 className="text-xl font-semibold">Settings</h1>
				</div>
			</div>

			{/* PROFILE CARD */}
			<div className="bg-surface rounded-3xl p-6 flex items-center justify-between border border-border shadow-lg">
				<div className="flex items-center gap-4">
					{/* Avatar */}
					<div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-white font-semibold text-lg">
						JD
					</div>

					{/* Name + Email */}
					<div>
						<p className="font-semibold text-lg">John Doe</p>
						<p className="text-muted text-sm">john@example.com</p>
					</div>
				</div>

				<button className="text-accent text-sm font-medium hover:underline">
					View Profile
				</button>
			</div>

			{/* SETTINGS LIST */}
			<div className="bg-surface rounded-3xl border border-border overflow-hidden shadow-lg">
				{settings.map((item, index) => (
					<Link key={index} href={item.route}>
						<div
							className={`flex items-center justify-between px-6 py-5 hover:bg-white/5 transition cursor-pointer ${
								index !== settings.length - 1
									? "border-b border-border"
									: ""
							}`}
						>
							{/* LEFT */}
							<div className="flex items-center gap-4">
								{/* ICON */}
								<div
									className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}
								>
									{item.icon}
								</div>

								{/* TEXT */}
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

							{/* RIGHT CHEVRON */}
							<ChevronRight size={18} className="text-muted" />
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
