// "use client";

// import { useState } from "react";
// import Input from "../ui/input";
// import Button from "../ui/button";
// import { FcGoogle } from "react-icons/fc";
// import { FaFacebookF } from "react-icons/fa";
// import { useAuth } from "@/context/auth-context";

// export default function LoginForm() {
// 	const [email, setEmail] = useState("");
// 	const [password, setPassword] = useState("");
// 	const [remember, setRemember] = useState(false);
// 	const { login } = useAuth();

// 	const handleSubmit = (e: React.FormEvent) => {
// 		e.preventDefault();
// 	};

// 	return (
// 		<form
// 			onSubmit={handleSubmit}
// 			className="flex flex-col gap-4 w-full max-w-sm mx-auto bg-[#070707] p-6 rounded-md"
// 		>
// 			<h2 className="text-2xl font-semibold text-white">Login</h2>

// 			<Input
// 				label="E-mail"
// 				type="email"
// 				value={email}
// 				onChange={(e) => setEmail(e.target.value)}
// 				required
// 			/>

// 			<Input
// 				label="Password"
// 				type="password"
// 				value={password}
// 				onChange={(e) => setPassword(e.target.value)}
// 				required
// 			/>

// 			<div className="flex items-center justify-between text-sm">
// 				<label className="flex items-center gap-2 text-muted">
// 					<input
// 						type="checkbox"
// 						checked={remember}
// 						onChange={(e) => setRemember(e.target.checked)}
// 						className="accent-accent w-4 h-4"
// 					/>
// 					Remember me
// 				</label>
// 				<a href="#" className="text-muted hover:text-white">
// 					Forgot password?
// 				</a>
// 			</div>

// 			<Button type="submit" variant="primary">
// 				Login
// 			</Button>

// 			<button
// 				onClick={() =>
// 					login({
// 						id: "demo-user",
// 						email: "demo@example.com",
// 						name: "Demo User",
// 						avatar: "/images/avatar.jpg",
// 					})
// 				}
// 				className="mt-4 rounded bg-accent px-4 py-2"
// 			>
// 				Dev login
// 			</button>

// 			<Button type="button" variant="google">
// 				<FcGoogle size={20} /> Log in with Google
// 			</Button>

// 			<Button type="button" variant="facebook">
// 				<FaFacebookF size={20} className="text-blue-500" /> Log in with
// 				Facebook
// 			</Button>

// 			<p className="text-sm text-muted text-center">
// 				Don’t have an account?{" "}
// 				<a href="/signup" className="text-white hover:underline">
// 					Signup
// 				</a>
// 			</p>
// 		</form>
// 	);
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../ui/input";
import Button from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginForm() {
	const router = useRouter();
	const supabase = createClient();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [remember, setRemember] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage("");
		setLoading(true);

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		setLoading(false);

		if (error) {
			setErrorMessage(error.message);
			return;
		}

		router.push("/profile");
		router.refresh();
	};

	const loginWithGoogle = async () => {
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback?next=/profile`,
			},
		});
	};

	const loginWithFacebook = async () => {
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
			<h2 className="text-2xl font-semibold text-white">Login</h2>

			{errorMessage && (
				<p className="text-sm text-red-400">{errorMessage}</p>
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
						onChange={(e) => setRemember(e.target.checked)}
						className="accent-accent w-4 h-4"
					/>
					Remember me
				</label>

				<a href="#" className="text-muted hover:text-white">
					Forgot password?
				</a>
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