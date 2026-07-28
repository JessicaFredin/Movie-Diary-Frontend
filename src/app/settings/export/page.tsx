"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ExportType = "full-json" | "diary-csv" | "ratings-csv" | "watchlist-csv";

type ExportOption = {
	title: string;
	description: string;
	format: string;
	type: ExportType;
};

const exports: ExportOption[] = [
	{
		title: "Full Data Export",
		description: "Profile, settings, diary, ratings and watchlist.",
		format: "JSON",
		type: "full-json",
	},
	{
		title: "Diary Only",
		description: "All saved diary entries.",
		format: "CSV",
		type: "diary-csv",
	},
	{
		title: "Ratings Only",
		description: "All your user ratings.",
		format: "CSV",
		type: "ratings-csv",
	},
	{
		title: "Watchlist",
		description: "All titles saved for later.",
		format: "CSV",
		type: "watchlist-csv",
	},
];

function downloadFile(
	filename: string,
	content: string,
	mimeType: string,
): void {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");

	link.href = url;
	link.download = filename;
	link.click();

	URL.revokeObjectURL(url);
}

function toCsv(rows: Record<string, unknown>[]): string {
	if (rows.length === 0) return "";

	const headers = Array.from(
		rows.reduce<Set<string>>((set, row) => {
			Object.keys(row).forEach((key) => set.add(key));
			return set;
		}, new Set<string>()),
	);

	const escapeValue = (value: unknown): string => {
		if (value === null || value === undefined) return "";

		const stringValue =
			typeof value === "object" ? JSON.stringify(value) : String(value);

		return `"${stringValue.replace(/"/g, '""')}"`;
	};

	return [
		headers.join(","),
		...rows.map((row) =>
			headers.map((header) => escapeValue(row[header])).join(","),
		),
	].join("\n");
}

export default function DataExport() {
	const router = useRouter();
	const supabase = useMemo(() => createClient(), []);

	const [loadingType, setLoadingType] = useState<ExportType | null>(null);
	const [message, setMessage] = useState("");

	async function fetchRows(
		table: string,
		userId: string,
		userColumn = "user_id",
	): Promise<Record<string, unknown>[]> {
		const { data, error } = await supabase
			.from(table)
			.select("*")
			.eq(userColumn, userId);

		if (error) {
			console.warn(`Could not export ${table}:`, error.message);
			return [];
		}

		return (data ?? []) as Record<string, unknown>[];
	}

	async function handleExport(type: ExportType): Promise<void> {
		setLoadingType(type);
		setMessage("");

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				setMessage("You need to be logged in to export data.");
				return;
			}

			const timestamp = new Date().toISOString().slice(0, 10);

			if (type === "diary-csv") {
				const diary = await fetchRows("diary_entries", user.id);
				downloadFile(
					`movie-diary-diary-${timestamp}.csv`,
					toCsv(diary),
					"text/csv;charset=utf-8",
				);
				return;
			}

			if (type === "ratings-csv") {
				const ratings = await fetchRows("user_ratings", user.id);
				downloadFile(
					`movie-diary-ratings-${timestamp}.csv`,
					toCsv(ratings),
					"text/csv;charset=utf-8",
				);
				return;
			}

			if (type === "watchlist-csv") {
				const watchlist = await fetchRows("watchlist_entries", user.id);
				downloadFile(
					`movie-diary-watchlist-${timestamp}.csv`,
					toCsv(watchlist),
					"text/csv;charset=utf-8",
				);
				return;
			}

			const { data: profile } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", user.id)
				.maybeSingle();

			const fullExport = {
				exported_at: new Date().toISOString(),
				user: {
					id: user.id,
					email: user.email,
					created_at: user.created_at,
				},
				profile,
				settings: await fetchRows("user_settings", user.id),
				diary_entries: await fetchRows("diary_entries", user.id),
				user_ratings: await fetchRows("user_ratings", user.id),
				watchlist_entries: await fetchRows(
					"watchlist_entries",
					user.id,
				),
				friendships: await fetchRows("friendships", user.id),
				friend_requests_sent: await fetchRows(
					"friend_requests",
					user.id,
					"sender_id",
				),
				friend_requests_received: await fetchRows(
					"friend_requests",
					user.id,
					"receiver_id",
				),
				diary_access_requests_sent: await fetchRows(
					"diary_access_requests",
					user.id,
					"requester_id",
				),
				diary_access_requests_received: await fetchRows(
					"diary_access_requests",
					user.id,
					"owner_id",
				),
			};

			downloadFile(
				`movie-diary-full-export-${timestamp}.json`,
				JSON.stringify(fullExport, null, 2),
				"application/json;charset=utf-8",
			);
		} finally {
			setLoadingType(null);
		}
	}

	return (
		<div className="mx-auto max-w-3xl space-y-8 px-6 py-10">
			<div className="flex items-center gap-4 border-b border-border pb-4">
				<button
					type="button"
					onClick={() => router.back()}
					className="text-muted transition hover:text-white"
					aria-label="Go back"
				>
					<ArrowLeft size={20} />
				</button>

				<h1 className="text-xl font-semibold">Data Export</h1>
			</div>

			<div className="space-y-4 rounded-3xl border border-border bg-surface p-6 shadow-lg">
				<p className="text-muted">
					Download a copy of your data from your account.
				</p>

				{exports.map((item) => (
					<div
						key={item.type}
						className="flex items-center justify-between rounded-xl border border-border bg-surface-muted px-5 py-4"
					>
						<div>
							<p className="font-medium">{item.title}</p>
							<p className="text-sm text-muted">
								{item.description}
							</p>
						</div>

						<button
							type="button"
							onClick={() => void handleExport(item.type)}
							disabled={loadingType !== null}
							className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 disabled:opacity-50"
						>
							<Download size={14} />
							{loadingType === item.type
								? "Preparing..."
								: item.format}
						</button>
					</div>
				))}
			</div>

			{message && (
				<p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
					{message}
				</p>
			)}
		</div>
	);
}
