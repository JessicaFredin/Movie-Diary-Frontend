import { ReactNode } from "react";

interface CardProps {
	children: ReactNode;
}

export default function Card({ children }: CardProps) {
	return (
		<div className="bg-surface-dark border border-surface-neutral rounded-lg p-4 shadow-md hover:shadow-lg transition">
			{children}
		</div>
	);
}
