"use client";

import { useMemo, useState } from "react";
import {
	AlertTriangle,
	CheckCircle2,
	FileWarning,
	Flag,
	LinkIcon,
	Send,
	User,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const reportTypes = [
	"Copyright infringement",
	"Inappropriate content",
	"Harassment or abuse",
	"Hate or discrimination",
	"Spam or misleading content",
	"Privacy violation",
	"Other",
];

const contentTypes = [
	"Profile",
	"Avatar",
	"Banner image",
	"Comment",
	"Display name",
	"Other",
];

export default function ReportContentPage() {
	const supabase = useMemo(() => createClient(), []);

	const [reportType, setReportType] = useState(reportTypes[0]);
	const [contentType, setContentType] = useState(contentTypes[0]);
	const [contentUrl, setContentUrl] = useState("");
	const [reportedUser, setReportedUser] = useState("");
	const [description, setDescription] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setSuccess(false);
		setErrorMessage("");

		if (!description.trim()) {
			setErrorMessage("Please describe what you are reporting.");
			return;
		}

		try {
			setSubmitting(true);

			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();

			if (userError) {
				throw new Error(userError.message);
			}

			if (!user) {
				throw new Error("You need to be logged in to submit a report.");
			}

			const { error } = await supabase.from("content_reports").insert({
				reporter_user_id: user.id,
				report_type: reportType,
				content_type: contentType,
				content_url: contentUrl.trim() || null,
				reported_user: reportedUser.trim() || null,
				description: description.trim(),
			});

			if (error) {
				throw new Error(error.message);
			}

			setSuccess(true);
			setContentUrl("");
			setReportedUser("");
			setDescription("");
			setReportType(reportTypes[0]);
			setContentType(contentTypes[0]);
		} catch (error) {
			setErrorMessage(
				error instanceof Error
					? error.message
					: "Could not submit report.",
			);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<main className="min-h-screen bg-black px-5 py-16 text-white md:px-12">
			<section className="mx-auto max-w-5xl">
				<div className="mb-10">
					<div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-accent">
						<Flag className="h-4 w-4" />
						Report content
					</div>

					<h1 className="text-4xl font-black md:text-6xl">
						Report a problem
					</h1>

					<p className="mt-5 max-w-3xl text-base leading-8 text-white/60 md:text-lg">
						Use this form to report copyrighted material,
						inappropriate content, harassment, spam, privacy issues
						or anything else that may break Movie Diary’s rules.
					</p>
				</div>

				<div className="grid gap-6 lg:grid-cols-[1fr_380px]">
					<form
						onSubmit={handleSubmit}
						className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
					>
						<div className="grid gap-5 md:grid-cols-2">
							<div>
								<label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted">
									Report type
								</label>

								<select
									value={reportType}
									onChange={(event) =>
										setReportType(event.target.value)
									}
									className="h-12 w-full rounded-2xl border border-white/10 bg-[#151515] px-4 text-sm font-semibold text-white outline-none transition focus:border-accent"
								>
									{reportTypes.map((type) => (
										<option key={type} value={type}>
											{type}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted">
									Content type
								</label>

								<select
									value={contentType}
									onChange={(event) =>
										setContentType(event.target.value)
									}
									className="h-12 w-full rounded-2xl border border-white/10 bg-[#151515] px-4 text-sm font-semibold text-white outline-none transition focus:border-accent"
								>
									{contentTypes.map((type) => (
										<option key={type} value={type}>
											{type}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="mt-5">
							<label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
								<LinkIcon className="h-3.5 w-3.5" />
								Link to content
							</label>

							<input
								value={contentUrl}
								onChange={(event) =>
									setContentUrl(event.target.value)
								}
								placeholder="Paste the page link here if possible"
								className="h-12 w-full rounded-2xl border border-white/10 bg-[#151515] px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-accent"
							/>
						</div>

						<div className="mt-5">
							<label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
								<User className="h-3.5 w-3.5" />
								Reported user
							</label>

							<input
								value={reportedUser}
								onChange={(event) =>
									setReportedUser(event.target.value)
								}
								placeholder="Display name, if known"
								className="h-12 w-full rounded-2xl border border-white/10 bg-[#151515] px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-accent"
							/>
						</div>

						<div className="mt-5">
							<label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
								<FileWarning className="h-3.5 w-3.5" />
								What is wrong?
							</label>

							<textarea
								value={description}
								onChange={(event) =>
									setDescription(event.target.value)
								}
								placeholder="Explain what you are reporting. For copyright, describe what belongs to you or what you believe is being used without permission."
								className="min-h-[180px] w-full resize-y rounded-2xl border border-white/10 bg-[#151515] px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-white/35 focus:border-accent"
							/>
						</div>

						{errorMessage && (
							<div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
								{errorMessage}
							</div>
						)}

						{success && (
							<div className="mt-5 flex items-center gap-2 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-300">
								<CheckCircle2 className="h-4 w-4" />
								Report submitted. Thank you.
							</div>
						)}

						<button
							type="submit"
							disabled={submitting}
							className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-black text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover disabled:opacity-50"
						>
							<Send className="h-4 w-4" />
							{submitting ? "Submitting..." : "Submit report"}
						</button>
					</form>

					<aside className="space-y-5">
						<div className="rounded-3xl border border-accent/30 bg-accent/10 p-6">
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white">
								<AlertTriangle className="h-6 w-6" />
							</div>

							<h2 className="text-xl font-black">
								What can be reported?
							</h2>

							<p className="mt-3 text-sm leading-7 text-white/70">
								You can report copyrighted images, movie
								posters, screenshots, celebrity photos, abusive
								comments, harassment, spam, fake profiles,
								privacy violations or anything that feels unsafe
								or inappropriate.
							</p>
						</div>

						<div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
							<h2 className="text-xl font-black">
								Copyright reports
							</h2>

							<p className="mt-3 text-sm leading-7 text-white/60">
								If you report copyrighted material, include the
								link to the content and explain why you believe
								it is being used without permission. We may
								remove content that appears to infringe rights
								or breaks Movie Diary’s Terms.
							</p>
						</div>

						<div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
							<h2 className="text-xl font-black">
								Prefer email?
							</h2>

							<p className="mt-3 text-sm leading-7 text-white/60">
								You can also contact us directly at{" "}
								<a
									href="mailto:contact@jamdevco.com"
									className="font-bold text-accent transition hover:text-accent-hover"
								>
									contact@jamdevco.com
								</a>
								.
							</p>
						</div>
					</aside>
				</div>
			</section>
		</main>
	);
}
