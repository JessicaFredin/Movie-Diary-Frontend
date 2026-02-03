import { ReactNode } from "react";

interface ButtonProps {
	children: ReactNode;
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
	variant?: "primary" | "secondary" | "google" | "facebook";
}

export default function Button({
	children,
	onClick,
	type = "button",
	variant = "primary",
}: ButtonProps) {
	const base =
		"px-4 py-2 rounded-md font-medium transition w-full flex items-center justify-center gap-2";

	const styles =
		variant === "primary"
			? "bg-[#FF414E] text-white hover:bg-[#e63946]" 
			: variant === "google"
			? "border border-gray-600 bg-[#070707] text-white hover:bg-gray-800"
			: variant === "facebook"
			? "border border-gray-600 bg-[#070707] text-white hover:bg-gray-800"
			: "bg-gray-200 text-black hover:bg-gray-300";

	return (
		<button type={type} onClick={onClick} className={`${base} ${styles}`}>
			{children}
		</button>
	);
}
