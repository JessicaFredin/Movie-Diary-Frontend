"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const options = [
	"Push Notifications",
	"Email Notifications",
	"Friend Requests",
	"Recommendations",
	"Diary Comments",
	"Weekly Digest",
	"New Releases",
];

type ToggleProps = {
	enabled: boolean;
};

export default function NotificationsPage() {
    const router = useRouter();
    
	return (
		<div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
			<div className="flex items-center gap-4 border-b border-border pb-4">
				<ArrowLeft
					size={20}
					className="text-muted cursor-pointer"
					onClick={() => router.back()}
				/>
				<h1 className="text-xl font-semibold">Notifications</h1>
			</div>

			<div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-lg">
				{options.map((o, i) => (
					<div
						key={i}
						className="flex items-center justify-between px-6 py-5 border-b border-border"
					>
						<div>
							<p className="font-medium">{o}</p>
							<p className="text-sm text-muted">
								Example description
							</p>
						</div>

						<Toggle enabled={i % 2 === 0} />
					</div>
				))}
			</div>

			<button className="w-full bg-accent py-4 rounded-xl font-semibold">
				Save Notifications
			</button>
		</div>
	);
}

function Toggle({ enabled }: ToggleProps) {
	return (
		<div
			className={`w-12 h-6 rounded-full ${
				enabled ? "bg-accent" : "bg-surface-muted"
			} relative`}
		>
			<div
				className={`absolute top-1 w-4 h-4 rounded-full bg-white transition ${
					enabled ? "right-1" : "left-1"
				}`}
			/>
		</div>
	);
}
