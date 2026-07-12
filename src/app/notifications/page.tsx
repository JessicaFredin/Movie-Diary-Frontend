"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Clock, Lock, UserRound, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type RequestStatus = "pending" | "accepted" | "declined";

type DiaryAccessRequest = {
	id: number;
	owner_id: string;
	requester_id: string;
	status: RequestStatus;
	created_at: string;
	updated_at: string;
};

type ProfileRow = {
	id: string;
	display_name: string | null;
	avatar_url: string | null;
};

type RequestWithProfile = DiaryAccessRequest & {
	requesterProfile: ProfileRow | null;
};

function getInitials(name: string) {
	return name.trim().slice(0, 1).toUpperCase() || "U";
}

function formatDate(date: string) {
	return new Intl.DateTimeFormat("en", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(new Date(date));
}

export default function NotificationsPage() {
	const supabase = useMemo(() => createClient(), []);

	const [requests, setRequests] = useState<RequestWithProfile[]>([]);
	const [loading, setLoading] = useState(true);
	const [updatingId, setUpdatingId] = useState<number | null>(null);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);

	const loadRequests = useCallback(async () => {
		setLoading(true);

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			setCurrentUserId(null);
			setRequests([]);
			setLoading(false);
			return;
		}

		setCurrentUserId(user.id);

		const { data: requestData, error: requestError } = await supabase
			.from("diary_access_requests")
			.select(
				"id, owner_id, requester_id, status, created_at, updated_at",
			)
			.eq("owner_id", user.id)
			.order("created_at", { ascending: false });

		if (requestError) {
			console.error("Failed to load requests:", requestError.message);
			setRequests([]);
			setLoading(false);
			return;
		}

		const typedRequests = (requestData ?? []) as DiaryAccessRequest[];
		const requesterIds = typedRequests.map(
			(request) => request.requester_id,
		);

		if (requesterIds.length === 0) {
			setRequests([]);
			setLoading(false);
			return;
		}

		const { data: profileData, error: profileError } = await supabase
			.from("profiles")
			.select("id, display_name, avatar_url")
			.in("id", requesterIds);

		if (profileError) {
			console.error(
				"Failed to load requester profiles:",
				profileError.message,
			);
		}

		const typedProfiles = (profileData ?? []) as ProfileRow[];

		const profileMap = new Map<string, ProfileRow>(
			typedProfiles.map((profile) => [profile.id, profile]),
		);

		const mergedRequests: RequestWithProfile[] = typedRequests.map(
			(request) => ({
				...request,
				requesterProfile: profileMap.get(request.requester_id) ?? null,
			}),
		);

		setRequests(mergedRequests);
		setLoading(false);
	}, [supabase]);

	useEffect(() => {
		loadRequests();
	}, [loadRequests]);

	async function updateRequestStatus(
		requestId: number,
		status: "accepted" | "declined",
	) {
		try {
			setUpdatingId(requestId);

			const { error } = await supabase
				.from("diary_access_requests")
				.update({
					status,
					updated_at: new Date().toISOString(),
				})
				.eq("id", requestId);

			if (error) {
				alert(error.message);
				return;
			}

			setRequests((prev) =>
				prev.map((request) =>
					request.id === requestId
						? {
								...request,
								status,
								updated_at: new Date().toISOString(),
							}
						: request,
				),
			);
		} finally {
			setUpdatingId(null);
		}
	}

	const pendingRequests = requests.filter(
		(request) => request.status === "pending",
	);

	const handledRequests = requests.filter(
		(request) => request.status !== "pending",
	);

	if (loading) {
		return (
			<main className="min-h-screen bg-black px-6 py-12 text-white md:px-24">
				<p className="text-muted">Loading notifications...</p>
			</main>
		);
	}

	if (!currentUserId) {
		return (
			<main className="min-h-screen bg-black px-6 py-12 text-white md:px-24">
				<h1 className="text-4xl font-black">Notifications</h1>

				<p className="mt-4 text-muted">
					You need to sign in to view your notifications.
				</p>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-black px-6 py-12 text-white md:px-24">
			<div className="mb-10">
				<h1 className="text-4xl font-black">Notifications</h1>

				<p className="mt-2 text-muted">
					Diary access requests and account activity.
				</p>
			</div>

			<section>
				<div className="mb-5 flex items-center justify-between">
					<h2 className="text-xl font-bold">Diary access requests</h2>

					<span className="rounded-full bg-white/[0.05] px-3 py-1 text-sm text-muted">
						{pendingRequests.length} pending
					</span>
				</div>

				{pendingRequests.length === 0 ? (
					<div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-muted">
						No pending requests.
					</div>
				) : (
					<div className="space-y-4">
						{pendingRequests.map((request) => {
							const profile = request.requesterProfile;
							const displayName =
								profile?.display_name ?? "Unknown user";

							return (
								<div
									key={request.id}
									className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-[#111114] p-5 md:flex-row md:items-center md:justify-between"
								>
									<div className="flex items-center gap-4">
										<div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-600">
											{profile?.avatar_url ? (
												<img
													src={profile.avatar_url}
													alt={displayName}
													className="h-full w-full object-cover"
												/>
											) : (
												<span className="text-xl font-bold text-white">
													{getInitials(displayName)}
												</span>
											)}
										</div>

										<div>
											<p className="font-bold text-white">
												{displayName}
											</p>

											<p className="mt-1 flex items-center gap-2 text-sm text-muted">
												<Lock className="h-4 w-4" />
												Wants access to your private
												diary
											</p>

											<p className="mt-1 flex items-center gap-2 text-xs text-muted">
												<Clock className="h-3.5 w-3.5" />
												Requested{" "}
												{formatDate(request.created_at)}
											</p>
										</div>
									</div>

									<div className="flex gap-3">
										<Link
											href={`/users/${request.requester_id}`}
											className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
										>
											<UserRound className="h-4 w-4" />
											View profile
										</Link>

										<button
											type="button"
											onClick={() =>
												updateRequestStatus(
													request.id,
													"declined",
												)
											}
											disabled={updatingId === request.id}
											className="flex items-center justify-center gap-2 rounded-full border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
										>
											<X className="h-4 w-4" />
											Decline
										</button>

										<button
											type="button"
											onClick={() =>
												updateRequestStatus(
													request.id,
													"accepted",
												)
											}
											disabled={updatingId === request.id}
											className="flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50"
										>
											<Check className="h-4 w-4" />
											Accept
										</button>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</section>

			{handledRequests.length > 0 && (
				<section className="mt-12">
					<h2 className="mb-5 text-xl font-bold">Handled requests</h2>

					<div className="space-y-3">
						{handledRequests.map((request) => {
							const profile = request.requesterProfile;
							const displayName =
								profile?.display_name ?? "Unknown user";

							return (
								<div
									key={request.id}
									className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4"
								>
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-600">
											{profile?.avatar_url ? (
												<img
													src={profile.avatar_url}
													alt={displayName}
													className="h-full w-full object-cover"
												/>
											) : (
												<span className="font-bold text-white">
													{getInitials(displayName)}
												</span>
											)}
										</div>

										<div>
											<p className="text-sm font-semibold">
												{displayName}
											</p>
											<p className="text-xs text-muted">
												{formatDate(request.updated_at)}
											</p>
										</div>
									</div>

									<span
										className={`rounded-full px-3 py-1 text-xs font-bold ${
											request.status === "accepted"
												? "bg-green-500/15 text-green-300"
												: "bg-red-500/15 text-red-300"
										}`}
									>
										{request.status}
									</span>
								</div>
							);
						})}
					</div>
				</section>
			)}
		</main>
	);
}
