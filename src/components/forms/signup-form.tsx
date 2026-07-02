"use client";

import { useState } from "react";
import Input from "../ui/input";
import Button from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SignupForm() {
	const supabase = createClient();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage("");
		setSuccessMessage("");

		if (!acceptedTerms) {
			setErrorMessage("You need to accept the Terms & Privacy.");
			return;
		}

		setLoading(true);

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					full_name: name,
				},
				emailRedirectTo: `${window.location.origin}/auth/callback?next=/profile`,
			},
		});

		setLoading(false);

		if (error) {
			setErrorMessage(error.message);
			return;
		}

		setSuccessMessage(
			"Account created. Check your email to confirm your account.",
		);
	};

	const signUpWithGoogle = async () => {
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback?next=/profile`,
			},
		});
	};

	const signUpWithFacebook = async () => {
		await supabase.auth.signInWithOAuth({
			provider: "facebook",
			options: {
				redirectTo: `${window.location.origin}/auth/callback?next=/profile`,
			},
		});
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 w-full max-w-sm mx-auto bg-[#070707] p-6 rounded-md"
		>
			<h2 className="text-2xl font-semibold text-white">
				Let’s get started
			</h2>

			{errorMessage && (
				<p className="text-sm text-red-400">{errorMessage}</p>
			)}

			{successMessage && (
				<p className="text-sm text-green-400">{successMessage}</p>
			)}

			<Input
				label="Full Name"
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				required
			/>

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

			<div className="flex items-center gap-2 text-sm">
				<input
					type="checkbox"
					checked={acceptedTerms}
					onChange={(e) => setAcceptedTerms(e.target.checked)}
					className="accent-accent w-4 h-4"
				/>
				<span className="text-muted">
					I agree to the Terms & Privacy
				</span>
			</div>

			<Button type="submit" variant="primary" disabled={loading}>
				{loading ? "Creating account..." : "Create Account"}
			</Button>

			<Button type="button" variant="google" onClick={signUpWithGoogle}>
				<FcGoogle size={20} /> Sign up with Google
			</Button>

			<Button
				type="button"
				variant="facebook"
				onClick={signUpWithFacebook}
			>
				<FaFacebookF size={20} className="text-blue-500" /> Sign up with
				Facebook
			</Button>

			<p className="text-sm text-muted text-center">
				Already have an account?{" "}
				<Link href="/login" className="text-white hover:underline">
					Login
				</Link>
			</p>
		</form>
	);
}
