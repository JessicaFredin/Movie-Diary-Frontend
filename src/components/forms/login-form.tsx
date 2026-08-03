"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../ui/input";
import Button from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import {
	createClient,
	getRememberMeStorage,
	setRememberMeStorage,
} from "@/lib/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type LoginMode = "login" | "forgot-password" | "reset-password";

export default function LoginForm() {
	const router = useRouter();
	const supabase = createClient();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [remember, setRemember] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [mode, setMode] = useState<LoginMode>("login");

	const searchParams = useSearchParams();

	const rawRedirectTo = searchParams.get("redirectTo");
	const redirectTo =
		rawRedirectTo && rawRedirectTo.startsWith("/") ? rawRedirectTo : "/";

	useEffect(() => {
		setRemember(getRememberMeStorage());
	}, []);

	useEffect(() => {
		const urlMode = searchParams.get("mode");
		const type = searchParams.get("type");

		if (urlMode === "reset-password" || type === "recovery") {
			setMode("reset-password");
		}
	}, [searchParams]);

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event) => {
			if (event === "PASSWORD_RECOVERY") {
				setMode("reset-password");
				setErrorMessage("");
				setSuccessMessage("Enter your new password.");
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [supabase.auth]);

	function clearMessages() {
		setErrorMessage("");
		setSuccessMessage("");
	}

	function handleRememberChange(value: boolean) {
		setRemember(value);
		setRememberMeStorage(value);
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		clearMessages();
		setLoading(true);

		setRememberMeStorage(remember);

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		setLoading(false);

		if (error) {
			setErrorMessage(error.message);
			return;
		}

		router.replace(redirectTo);
		router.refresh();
	};

	const handleForgotPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		clearMessages();
		setLoading(true);

		const redirectUrl = `${window.location.origin}/login?mode=reset-password`;

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: redirectUrl,
		});

		setLoading(false);

		if (error) {
			setErrorMessage(error.message);
			return;
		}

		setSuccessMessage(
			"Password reset email sent. Open the link in your email to choose a new password.",
		);
	};

	const handleUpdatePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		clearMessages();

		if (newPassword.length < 6) {
			setErrorMessage("Password must be at least 6 characters.");
			return;
		}

		if (newPassword !== confirmPassword) {
			setErrorMessage("Passwords do not match.");
			return;
		}

		setLoading(true);

		const { error } = await supabase.auth.updateUser({
			password: newPassword,
		});

		setLoading(false);

		if (error) {
			setErrorMessage(error.message);
			return;
		}

		setSuccessMessage("Password updated successfully.");

		setTimeout(() => {
			router.replace(redirectTo);
			router.refresh();
		}, 800);
	};

	const getOAuthRedirectUrl = () => {
		return `${window.location.origin}/auth/callback?next=${encodeURIComponent(
			redirectTo,
		)}`;
	};

	const loginWithGoogle = async () => {
		setRememberMeStorage(remember);

		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: getOAuthRedirectUrl(),
			},
		});
	};

	const loginWithFacebook = async () => {
		setRememberMeStorage(remember);

		await supabase.auth.signInWithOAuth({
			provider: "facebook",
			options: {
				redirectTo: getOAuthRedirectUrl(),
			},
		});
	};

	if (mode === "forgot-password") {
		return (
			<form
				onSubmit={handleForgotPassword}
				className="flex flex-col gap-4 w-full max-w-sm mx-auto bg-[#070707] p-6 rounded-md"
			>
				<h2 className="text-2xl font-semibold text-white">
					Forgot password?
				</h2>

				<p className="text-sm text-muted">
					Enter your email and we’ll send you a reset link.
				</p>

				{errorMessage && (
					<p className="text-sm text-red-400">{errorMessage}</p>
				)}

				{successMessage && (
					<p className="text-sm text-green-400">{successMessage}</p>
				)}

				<Input
					label="E-mail"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>

				<Button type="submit" variant="primary" disabled={loading}>
					{loading ? "Sending..." : "Send reset link"}
				</Button>

				<button
					type="button"
					onClick={() => {
						clearMessages();
						setMode("login");
					}}
					className="text-sm text-muted hover:text-white"
				>
					Back to login
				</button>
			</form>
		);
	}

	if (mode === "reset-password") {
		return (
			<form
				onSubmit={handleUpdatePassword}
				className="flex flex-col gap-4 w-full max-w-sm mx-auto bg-[#070707] p-6 rounded-md"
			>
				<h2 className="text-2xl font-semibold text-white">
					Reset password
				</h2>

				<p className="text-sm text-muted">
					Choose a new password for your account.
				</p>

				{errorMessage && (
					<p className="text-sm text-red-400">{errorMessage}</p>
				)}

				{successMessage && (
					<p className="text-sm text-green-400">{successMessage}</p>
				)}

				<Input
					label="New password"
					type="password"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
					required
				/>

				<Input
					label="Confirm password"
					type="password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
				/>

				<Button type="submit" variant="primary" disabled={loading}>
					{loading ? "Updating..." : "Update password"}
				</Button>

				<button
					type="button"
					onClick={() => {
						clearMessages();
						setMode("login");
					}}
					className="text-sm text-muted hover:text-white"
				>
					Back to login
				</button>
			</form>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 w-full max-w-sm mx-auto bg-[#070707] p-6 rounded-md"
		>
			<h2 className="text-2xl font-semibold text-white">Login</h2>

			{errorMessage && (
				<p className="text-sm text-red-400">{errorMessage}</p>
			)}

			{successMessage && (
				<p className="text-sm text-green-400">{successMessage}</p>
			)}

			<Input
				label="E-mail"
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
			/>

			<Input
				label="Password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			/>

			<div className="flex items-center justify-between text-sm">
				<label className="flex items-center gap-2 text-muted">
					<input
						type="checkbox"
						checked={remember}
						onChange={(e) => handleRememberChange(e.target.checked)}
						className="accent-accent w-4 h-4"
					/>
					Remember me
				</label>

				<button
					type="button"
					onClick={() => {
						clearMessages();
						setMode("forgot-password");
					}}
					className="text-muted hover:text-white"
				>
					Forgot password?
				</button>
			</div>

			<Button type="submit" variant="primary" disabled={loading}>
				{loading ? "Logging in..." : "Login"}
			</Button>

			<Button type="button" variant="google" onClick={loginWithGoogle}>
				<FcGoogle size={20} /> Log in with Google
			</Button>

			<Button
				type="button"
				variant="facebook"
				onClick={loginWithFacebook}
			>
				<FaFacebookF size={20} className="text-blue-500" /> Log in with
				Facebook
			</Button>

			<p className="text-sm text-muted text-center">
				Don’t have an account?{" "}
				<Link href="/signup" className="text-white hover:underline">
					Signup
				</Link>
			</p>
		</form>
	);
}
