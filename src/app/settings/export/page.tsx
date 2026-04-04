"use client";

import { ArrowLeft, Download } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DataExport() {
    const router = useRouter()
	const exports = [
		{ title: "Full Data Export", format: "JSON" },
		{ title: "Diary Only", format: "CSV" },
		{ title: "Ratings Only", format: "CSV" },
		{ title: "Watchlist", format: "CSV" },
	];

	return (
		<div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
			<div className="flex items-center gap-4 border-b border-border pb-4">
				<ArrowLeft
					size={20}
					className="text-muted cursor-pointer"
					onClick={() => router.back()}
				/>
				<h1 className="text-xl font-semibold">Data Export</h1>
			</div>

			<div className="bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-lg">
				<p className="text-muted">
					Download a complete copy of your data including diary
					entries, ratings, watchlist and profile information.
				</p>

				{exports.map((e, i) => (
					<div
						key={i}
						className="flex items-center justify-between bg-surface-muted border border-border rounded-xl px-5 py-4"
					>
						<div>
							<p className="font-medium">{e.title}</p>
							<p className="text-sm text-muted">Export format</p>
						</div>

						<button className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg">
							<Download size={14} />
							{e.format}
						</button>
					</div>
				))}
			</div>
		</div>
	);
}