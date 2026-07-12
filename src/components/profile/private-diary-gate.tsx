"use client";

import { Lock } from "lucide-react";

type AccessStatus = "none" | "pending" | "accepted" | "declined";

type Props = {
	displayName: string;
	requestStatus: AccessStatus;
	requesting?: boolean;
	onRequestAccess: () => void | Promise<void>;
};

export default function PrivateDiaryGate({
	displayName,
	requestStatus,
	requesting = false,
	onRequestAccess,
}: Props) {
	const buttonText =
		requestStatus === "pending"
			? "Request sent"
			: requestStatus === "declined"
				? "Request again"
				: "Request Access";

	return (
		<section className="px-6 md:px-16 mt-16">
			<div className="mb-6">
				<div className="flex items-center gap-2">
					<h2 className="text-3xl font-bold text-white">Diary</h2>
					<Lock className="h-5 w-5 text-muted" />
				</div>

				<p className="mt-1 text-muted">
					Latest titles {displayName} has logged
				</p>
			</div>

			<div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
				{/* Blurred fake diary preview */}
				<div className="flex gap-5 overflow-hidden p-5 opacity-50 blur-md">
					{Array.from({ length: 6 }).map((_, index) => (
						<div
							key={index}
							className="h-[270px] min-w-[180px] rounded-2xl bg-gradient-to-br from-accent/30 via-white/10 to-black"
						/>
					))}
				</div>

				<div className="absolute inset-0 bg-black/50" />

				<div className="absolute inset-0 flex items-center justify-center px-4">
					<div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111114]/95 px-8 py-7 text-center shadow-2xl">
						<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
							<Lock className="h-6 w-6 text-muted" />
						</div>

						<h3 className="text-lg font-bold text-white">
							Diary is Private
						</h3>

						<p className="mt-2 text-sm leading-6 text-muted">
							{displayName} keeps their diary private. Request
							access to view their logged movies and shows.
						</p>

						<button
							type="button"
							onClick={onRequestAccess}
							disabled={requesting || requestStatus === "pending"}
							className="mt-5 rounded-xl bg-accent px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
						>
							{requesting ? "Sending..." : buttonText}
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
