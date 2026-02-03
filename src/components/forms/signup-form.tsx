"use client";

import { useState } from "react";
import Input from "../ui/input";
import Button from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

export default function SignupForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [remember, setRemember] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Signup:", { name, email, password, remember });
		// Later: call API
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 w-full max-w-sm mx-auto bg-[#070707] p-6 rounded-md"
		>
			<h2 className="text-2xl font-semibold text-white">
				Let’s get started
			</h2>

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
					checked={remember}
					onChange={(e) => setRemember(e.target.checked)}
					className="accent-[#FF414E] w-4 h-4"
				/>
				<span className="text-gray-300">
					I agree to the Terms & Privacy
				</span>
			</div>

			<Button type="submit" variant="primary">
				Create Account
			</Button>

			<Button type="button" variant="google">
				<FcGoogle size={20} /> Sign up with Google
			</Button>

			<Button type="button" variant="facebook">
				<FaFacebookF size={20} className="text-blue-500" /> Sign up with
				Facebook
			</Button>

			<p className="text-sm text-gray-400 text-center">
				Already have an account?{" "}
				<a href="/login" className="text-white hover:underline">
					Login
				</a>
			</p>
		</form>
	);
}
