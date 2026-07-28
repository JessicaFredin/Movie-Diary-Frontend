"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type InputProps = {
	label: string;
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
};

export default function PasswordSecurity() {
	const router = useRouter();
	const supabase = useMemo(() => createClient(), []);

	const [email, setEmail] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		async function loadUser(): Promise<void> {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			setEmail(user?.email ?? "");
		}

		void loadUser();
	}, [supabase]);

	async function handleUpdatePassword(): Promise<void> {
		setMessage("");
		setErrorMessage("");

		if (!email) {
			setErrorMessage("You need to be logged in.");
			return;
		}

		if (!currentPassword || !newPassword || !confirmPassword) {
			setErrorMessage("Fill in all password fields.");
			return;
		}

		if (newPassword.length < 6) {
			setErrorMessage("Your new password must be at least 6 characters.");
			return;
		}

		if (newPassword !== confirmPassword) {
			setErrorMessage("The new passwords do not match.");
			return;
		}

		try {
			setSaving(true);

			const { error: loginError } =
				await supabase.auth.signInWithPassword({
					email,
					password: currentPassword,
				});

			if (loginError) {
				setErrorMessage("Your current password is incorrect.");
				return;
			}

			const { error } = await supabase.auth.updateUser({
				password: newPassword,
			});

			if (error) {
				setErrorMessage(error.message);
				return;
			}

			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			setMessage("Your password has been updated.");
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

				<h1 className="text-xl font-semibold">Password & Security</h1>
			</div>

			<div className="space-y-6 rounded-3xl border border-border bg-surface p-6 shadow-lg">
				<Input
					label="Current Password"
					placeholder="Enter current password"
					value={currentPassword}
					onChange={setCurrentPassword}
				/>

				<Input
					label="New Password"
					placeholder="Enter new password"
					value={newPassword}
					onChange={setNewPassword}
				/>

				<Input
					label="Confirm New Password"
					placeholder="Confirm new password"
					value={confirmPassword}
					onChange={setConfirmPassword}
				/>
			</div>

			<div className="space-y-4 rounded-3xl border border-border bg-surface p-6 shadow-lg">
				<h2 className="text-lg font-semibold">
					Two-Factor Authentication
				</h2>

				<p className="text-sm text-muted">
					Two-factor authentication can be added later through
					Supabase Auth MFA.
				</p>

				<button
					type="button"
					disabled
					className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-border bg-surface-muted px-4 py-2 opacity-60"
				>
					📱 2FA coming soon
				</button>
			</div>

			{message && (
				<p className="rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-300">
					{message}
				</p>
			)}

			{errorMessage && (
				<p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
					{errorMessage}
				</p>
			)}

			<button
				type="button"
				onClick={handleUpdatePassword}
				disabled={saving}
				className="w-full rounded-xl bg-accent py-4 font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
			>
				{saving ? "Updating..." : "Update Password"}
			</button>
		</div>
	);
}

function Input({ label, placeholder, value, onChange }: InputProps) {
	const [visible, setVisible] = useState(false);

	return (
		<div className="space-y-2">
			<p className="text-sm text-muted">{label}</p>

			<div className="relative">
				<input
					type={visible ? "text" : "password"}
					placeholder={placeholder}
					value={value}
					onChange={(event) => onChange(event.target.value)}
					className="w-full rounded-xl border border-border bg-surface-muted px-4 py-3 pr-12 outline-none focus:border-accent"
				/>

				<button
					type="button"
					onClick={() => setVisible((value) => !value)}
					className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-white"
					aria-label={visible ? "Hide password" : "Show password"}
				>
					{visible ? <EyeOff size={16} /> : <Eye size={16} />}
				</button>
			</div>
		</div>
	);
}
