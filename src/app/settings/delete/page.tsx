"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, AlertTriangle, Trash2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type DeleteAccountResponse = {
	error?: string;
	success?: boolean;
};

type AuthProviderState = {
	loading: boolean;
	requiresPassword: boolean;
	providerLabel: string;
};

export default function DeleteAccount() {
	const router = useRouter();
	const supabase = useMemo(() => createClient(), []);

	const [confirmation, setConfirmation] = useState("");
	const [password, setPassword] = useState("");
	const [deleting, setDeleting] = useState(false);
	const [message, setMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const [authProvider, setAuthProvider] = useState<AuthProviderState>({
		loading: true,
		requiresPassword: false,
		providerLabel: "your account",
	});

	useEffect(() => {
		async function loadAuthProvider(): Promise<void> {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				setAuthProvider({
					loading: false,
					requiresPassword: false,
					providerLabel: "your account",
				});
				return;
			}

			const providers =
				user.identities?.map((identity) => identity.provider) ?? [];

			const hasEmailProvider = providers.includes("email");
			const hasGoogleProvider = providers.includes("google");
			const hasFacebookProvider = providers.includes("facebook");

			setAuthProvider({
				loading: false,
				requiresPassword: hasEmailProvider,
				providerLabel: hasGoogleProvider
					? "your Google account"
					: hasFacebookProvider
						? "your Facebook account"
						: hasEmailProvider
							? "your email account"
							: "your account",
			});
		}

		void loadAuthProvider();
	}, [supabase]);

	async function handleDelete(): Promise<void> {
		setMessage("");
		setSuccessMessage("");

		if (confirmation !== "DELETE") {
			setMessage("Type DELETE to confirm.");
			return;
		}

		if (authProvider.requiresPassword && !password) {
			setMessage("Enter your password to confirm account deletion.");
			return;
		}

		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session?.access_token) {
			setMessage("You need to be logged in.");
			return;
		}

		try {
			setDeleting(true);

			const response = await fetch("/api/account/delete", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session.access_token}`,
				},
				body: JSON.stringify({
					confirmation,
					password: authProvider.requiresPassword ? password : null,
				}),
			});

			const result = (await response.json()) as DeleteAccountResponse;

			if (!response.ok || !result.success) {
				setMessage(result.error ?? "Could not delete account.");
				return;
			}

			setSuccessMessage(
				"Your account has been deleted successfully. Redirecting...",
			);

			await supabase.auth.signOut();

			window.setTimeout(() => {
				router.replace("/signup");
				router.refresh();
			}, 1400);
		} catch (error) {
			console.error("Delete account error:", error);

			setMessage(
				error instanceof Error
					? error.message
					: "Could not delete account.",
			);
		} finally {
			setDeleting(false);
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
					disabled={deleting}
				>
					<ArrowLeft size={20} />
				</button>

				<h1 className="text-xl font-semibold">Delete Account</h1>
			</div>

			<div className="flex gap-4 rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
				<AlertTriangle className="shrink-0 text-red-500" />

				<div>
					<p className="font-semibold">This action is irreversible</p>

					<p className="text-sm text-muted">
						Deleting your account will permanently remove all your
						data.
					</p>
				</div>
			</div>

			<div className="space-y-4 rounded-3xl border border-border bg-surface p-6">
				<div>
					<p>
						Type{" "}
						<span className="font-semibold text-accent">
							DELETE
						</span>{" "}
						to confirm
					</p>

					<p className="mt-1 text-sm text-muted">
						You are deleting {authProvider.providerLabel}.
					</p>
				</div>

				<input
					value={confirmation}
					onChange={(event) => setConfirmation(event.target.value)}
					placeholder="Type DELETE"
					disabled={deleting || Boolean(successMessage)}
					className="w-full rounded-xl border border-border bg-surface-muted px-4 py-3 outline-none focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
				/>

				{authProvider.loading ? (
					<div className="rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm text-muted">
						Checking login method...
					</div>
				) : authProvider.requiresPassword ? (
					<input
						type="password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						placeholder="Enter your password"
						disabled={deleting || Boolean(successMessage)}
						className="w-full rounded-xl border border-border bg-surface-muted px-4 py-3 outline-none focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
					/>
				) : (
					<div className="rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm text-muted">
						No password is required because this account uses an
						external login provider.
					</div>
				)}

				{message && (
					<p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
						{message}
					</p>
				)}

				{successMessage && (
					<div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
						<CheckCircle2 size={16} />
						<p>{successMessage}</p>
					</div>
				)}

				<button
					type="button"
					onClick={handleDelete}
					disabled={
						deleting ||
						authProvider.loading ||
						Boolean(successMessage)
					}
					className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-4 font-semibold disabled:opacity-50"
				>
					<Trash2 size={16} />
					{deleting ? "Deleting..." : "Permanently Delete Account"}
				</button>
			</div>
		</div>
	);
}
