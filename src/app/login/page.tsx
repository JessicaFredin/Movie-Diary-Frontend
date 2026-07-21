import Image from "next/image";
import LoginForm from "@/components/forms/login-form";
import { Suspense } from "react";

function LoginFormFallback() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
			<div className="w-full max-w-sm rounded-md bg-[#070707] p-6">
				<p className="text-sm text-muted">Loading login...</p>
			</div>
		</div>
	);
}

export default function LoginPage() {
	return (
		<div className="flex flex-col md:flex-row min-h-screen items-center justify-center">
			{/* Mobile image (no swooshes) */}
			<div className="md:hidden items-center justify-center">
				<Image
					src="/images/illustration-mobile.svg"
					alt="Login illustration mobile"
					width={400}
					height={400}
					priority
				/>
			</div>

			{/* Desktop image (with swooshes) */}
			<div className="hidden md:flex items-center justify-center">
				<Image
					src="/images/illustration.svg"
					alt="Login illustration desktop"
					width={1000}
					height={1000}
					className="ms-50"
					priority
				/>
			</div>
			

			{/* RIGHT: Login Form */}
			<main className="flex w-full md:w-1/2 items-center justify-center p-6">
			
				<Suspense fallback={<LoginFormFallback />}>
					<LoginForm />
				</Suspense>
			</main>
		</div>
	);
}
