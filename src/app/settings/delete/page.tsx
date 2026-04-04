"use client";

import { ArrowLeft, AlertTriangle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteAccount() {
	const router = useRouter();
	return (
		<div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
			<div className="flex items-center gap-4 border-b border-border pb-4">
				<ArrowLeft
					size={20}
					className="text-muted cursor-pointer"
					onClick={() => router.back()}
				/>
				<h1 className="text-xl font-semibold">Delete Account</h1>
			</div>

			<div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-6 flex gap-4">
				<AlertTriangle className="text-red-500" />

				<div>
					<p className="font-semibold">This action is irreversible</p>

					<p className="text-sm text-muted">
						Deleting your account will permanently remove all your
						data.
					</p>
				</div>
			</div>

			<div className="bg-surface border border-border rounded-3xl p-6 space-y-4">
				<p>
					Type{" "}
					<span className="text-accent font-semibold">DELETE</span> to
					confirm
				</p>

				<input
					placeholder="Type DELETE"
					className="w-full bg-surface-muted border border-border rounded-xl px-4 py-3"
				/>

				<button className="w-full bg-accent py-4 rounded-xl flex items-center justify-center gap-2">
					<Trash2 size={16} />
					Permanently Delete Account
				</button>
			</div>
		</div>
	);
}
