"use client";

import { ArrowLeft, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

type InputProps = {
	label: string;
	placeholder: string;
};

export default function PasswordSecurity() {
	const router = useRouter();

	return (
		<div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
			{/* HEADER */}

			<div className="flex items-center gap-4 border-b border-border pb-4">
				<ArrowLeft
					size={20}
					className="text-muted cursor-pointer"
					onClick={() => router.back()}
				/>
				<h1 className="text-xl font-semibold">Password & Security</h1>
			</div>

			{/* PASSWORD CARD */}

			<div className="bg-surface border border-border rounded-3xl p-6 space-y-6 shadow-lg">
				<Input
					label="Current Password"
					placeholder="Enter current password"
				/>
				<Input label="New Password" placeholder="Enter new password" />
				<Input
					label="Confirm New Password"
					placeholder="Confirm new password"
				/>
			</div>

			{/* 2FA CARD */}

			<div className="bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-lg">
				<h2 className="font-semibold text-lg">
					Two-Factor Authentication
				</h2>

				<p className="text-muted text-sm">
					Add an extra layer of security to your account
				</p>

				<button className="bg-surface-muted border border-border rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-white/5">
					📱 Enable 2FA
				</button>
			</div>

			{/* SAVE BUTTON */}

			<button className="w-full bg-accent py-4 rounded-xl font-semibold text-white hover:bg-accent-hover">
				Update Password
			</button>
		</div>
	);
}

function Input({ label, placeholder }: InputProps) {
	return (
		<div className="space-y-2">
			<p className="text-sm text-muted">{label}</p>

			<div className="relative">
				<input
					type="password"
					placeholder={placeholder}
					className="w-full bg-surface-muted border border-border rounded-xl px-4 py-3 outline-none"
				/>

				<Eye
					size={16}
					className="absolute right-4 top-1/2 -translate-y-1/2 text-muted"
				/>
			</div>
		</div>
	);
}
