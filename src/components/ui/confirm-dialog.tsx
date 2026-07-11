"use client";

import { AlertTriangle, X } from "lucide-react";

type Props = {
	open: boolean;
	title: string;
	description: string;
	confirmLabel?: string;
	cancelLabel?: string;
	loading?: boolean;
	onConfirm: () => void | Promise<void>;
	onCancel: () => void;
};

export default function ConfirmDialog({
	open,
	title,
	description,
	confirmLabel = "Delete",
	cancelLabel = "Cancel",
	loading = false,
	onConfirm,
	onCancel,
}: Props) {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
			<div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0f0f14] p-5 text-white shadow-2xl">
				<div className="mb-4 flex items-start justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15 text-red-400">
							<AlertTriangle className="h-5 w-5" />
						</div>

						<h2 className="text-lg font-semibold">{title}</h2>
					</div>

					<button
						type="button"
						onClick={onCancel}
						disabled={loading}
						className="rounded-full p-1 text-muted hover:bg-white/10 hover:text-white disabled:opacity-50"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<p className="text-sm leading-6 text-muted">{description}</p>

				<div className="mt-6 flex gap-3">
					<button
						type="button"
						onClick={onCancel}
						disabled={loading}
						className="flex-1 rounded-full bg-surface-elevated py-2 text-sm hover:bg-surface-neutral disabled:opacity-50"
					>
						{cancelLabel}
					</button>

					<button
						type="button"
						onClick={onConfirm}
						disabled={loading}
						className="flex-1 rounded-full bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
					>
						{loading ? "Deleting..." : confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}
