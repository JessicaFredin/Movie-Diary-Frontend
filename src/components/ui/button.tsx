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
			? "bg-accent text-white hover:bg-accent-hover" 
			: variant === "google"
			? "border border-gray-600 bg-transparent text-white hover:bg-surface-elevated"
			: variant === "facebook"
			? "border border-gray-600 bg-transparent text-white hover:bg-surface-elevated"
			: "bg-muted text-black hover:bg-muted";

	return (
		<button type={type} onClick={onClick} className={`${base} ${styles}`}>
			{children}
		</button>
	);
}
