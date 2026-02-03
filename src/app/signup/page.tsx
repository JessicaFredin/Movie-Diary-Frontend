import Image from "next/image";
import SignupForm from "@/components/forms/signup-form";

export default function SignupPage() {
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

			{/* RIGHT: Signup Form */}
			<div className="flex w-full md:w-1/2 items-center justify-center p-6">
				<SignupForm />
			</div>
		</div>
	);
}
