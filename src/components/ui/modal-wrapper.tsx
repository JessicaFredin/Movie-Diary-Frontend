"use client";

import { X } from "lucide-react";

type Props = {
	children: React.ReactNode;
	close: () => void;
};

export default function ModalWrapper({ children, close }: Props) {
	return (
		<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
			<div className="bg-surface rounded-3xl p-8 w-[520px] relative shadow-2xl">
				<button
					onClick={close}
					className="absolute right-5 top-5 text-muted"
				>
					<X size={18} />
				</button>
				{children}
			</div>
		</div>
	);
}