import { ReactNode } from "react";

interface CardProps {
	children: ReactNode;
}

export default function Card({ children }: CardProps) {
	return (
		<div className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-md hover:shadow-lg transition">
			{children}
		</div>
	);
}
