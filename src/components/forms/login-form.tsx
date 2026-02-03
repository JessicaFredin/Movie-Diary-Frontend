"use client";

import { useState } from "react";
import Input from "../ui/input";
import Button from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { useAuth } from "@/context/auth-context";


export default function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [remember, setRemember] = useState(false);
	const { login } = useAuth();


	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 w-full max-w-sm mx-auto bg-[#070707] p-6 rounded-md"
		>
			<h2 className="text-2xl font-semibold text-white">Login</h2>

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
				<label className="flex items-center gap-2 text-gray-300">
					<input
						type="checkbox"
						checked={remember}
						onChange={(e) => setRemember(e.target.checked)}
						className="accent-[#FF414E] w-4 h-4"
					/>
					Remember me
				</label>
				<a href="#" className="text-gray-400 hover:text-white">
					Forgot password?
				</a>
			</div>

			<Button type="submit" variant="primary">
				Login
			</Button>

			<button
				onClick={() =>
					login({
						id: "demo-user",
						email: "demo@example.com",
						name: "Demo User",
						avatar: "/images/avatar.jpg",
					})
				}
				className="mt-4 rounded bg-red-500 px-4 py-2"
			>
				Dev login
			</button>

			<Button type="button" variant="google">
				<FcGoogle size={20} /> Log in with Google
			</Button>

			<Button type="button" variant="facebook">
				<FaFacebookF size={20} className="text-blue-500" /> Log in with
				Facebook
			</Button>

			<p className="text-sm text-gray-400 text-center">
				Don’t have an account?{" "}
				<a href="/signup" className="text-white hover:underline">
					Signup
				</a>
			</p>
		</form>
	);
}
