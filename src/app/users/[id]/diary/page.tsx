"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Globe2, Lock } from "lucide-react";

import MediaToolbar from "@/components/diary/media-toolbar";
import LoadMoreButton from "@/components/diary/load-more-button";
import MediaCard from "@/components/media/media-card";
import PrivateDiaryGate from "@/components/profile/private-diary-gate";
import { createClient } from "@/lib/supabase/client";
import type { DiaryEntry } from "@/types/diary";

type AccessStatus = "none" | "pending" | "accepted" | "declined";
type MediaType = "movie" | "tv";

type ProfileRow = {
	id: string;
	display_name: string | null;
	is_private_diary: boolean;
};

type AccessRequestRow = {
	status: AccessStatus;
};

type PublicDiaryEntry = {
	id: number;
	media_id: string;
	media_type: MediaType;
	title_snapshot: string | null;
	poster_path_snapshot: string | null;
	backdrop_path_snapshot: string | null;
	rating: number | null;
	status: "watching" | "completed" | "planned";
	progress: DiaryEntry["progress"] | null;
	updated_at: string | null;
	created_at: string | null;
};

const GENRES = [
	"Action",
	"Comedy",
	"Drama",
	"Horror",
	"Sci-Fi",
	"Thriller",
	"Romance",
	"Animation",
	"Documentary",
];

const SERVICES = [
	"Netflix",
	"Prime Video",
	"Disney+",
	"Max",
	"Apple TV+",
	"Hulu",
];

function mapPublicEntryToDiaryEntry(entry: PublicDiaryEntry): DiaryEntry {
	return {
		id: Number(entry.media_id),
		type: entry.media_type,
		title: entry.title_snapshot ?? "Untitled",
		poster: entry.poster_path_snapshot ?? "",
		backdrop:
			entry.backdrop_path_snapshot ?? entry.poster_path_snapshot ?? "",
		status: entry.status,
		progress: entry.progress ?? undefined,
		rating: entry.rating,
		updatedAt:
			entry.updated_at ?? entry.created_at ?? new Date().toISOString(),
	} as DiaryEntry;
}

export default function PublicDiaryPage() {
	const params = useParams<{ id: string }>();
	const profileId = params.id;

	const supabase = useMemo(() => createClient(), []);

	const [profile, setProfile] = useState<ProfileRow | null>(null);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);
	const [entries, setEntries] = useState<PublicDiaryEntry[]>([]);
	const [accessStatus, setAccessStatus] = useState<AccessStatus>("none");
	const [requestingAccess, setRequestingAccess] = useState(false);
	const [loading, setLoading] = useState(true);

	const [activeTab, setActiveTab] = useState<"all" | "movies" | "tv">("all");
	const [sort, setSort] = useState("Popularity");
	const [query, setQuery] = useState("");
	const [view, setView] = useState<"grid" | "list">("grid");
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
	const [selectedServices, setSelectedServices] = useState<string[]>([]);

	useEffect(() => {
		async function loadDiaryPage() {
			setLoading(true);

			const {
				data: { user },
			} = await supabase.auth.getUser();

			setCurrentUserId(user?.id ?? null);

			const { data: profileData, error: profileError } = await supabase
				.from("profiles")
				.select("id, display_name, is_private_diary")
				.eq("id", profileId)
				.maybeSingle();

			if (profileError) {
				console.error(profileError.message);
				setProfile(null);
				setEntries([]);
				setLoading(false);
				return;
			}

			const typedProfile = profileData as ProfileRow | null;
			setProfile(typedProfile);

			if (!typedProfile) {
				setEntries([]);
				setLoading(false);
				return;
			}

			const isOwnProfile = user?.id === profileId;

			let finalAccessStatus: AccessStatus = "none";

			if (user && !isOwnProfile && typedProfile.is_private_diary) {
				const { data: requestData, error: requestError } =
					await supabase
						.from("diary_access_requests")
						.select("status")
						.eq("owner_id", profileId)
						.eq("requester_id", user.id)
						.maybeSingle();

				if (requestError) {
					console.error(requestError.message);
				}

				const typedRequest = requestData as AccessRequestRow | null;
				finalAccessStatus = typedRequest?.status ?? "none";
			}

			setAccessStatus(finalAccessStatus);

			const canViewDiary =
				isOwnProfile ||
				typedProfile.is_private_diary === false ||
				finalAccessStatus === "accepted";

			if (!canViewDiary) {
				setEntries([]);
				setLoading(false);
				return;
			}

			const { data: diaryData, error: diaryError } = await supabase
				.from("diary_entries")
				.select(
					"id, media_id, media_type, title_snapshot, poster_path_snapshot, backdrop_path_snapshot, rating, status, progress, updated_at, created_at",
				)
				.eq("user_id", profileId)
				.order("updated_at", {
					ascending: false,
					nullsFirst: false,
				})
				.order("created_at", { ascending: false });

			if (diaryError) {
				console.error(diaryError.message);
				setEntries([]);
				setLoading(false);
				return;
			}

			setEntries((diaryData ?? []) as PublicDiaryEntry[]);
			setLoading(false);
		}

		loadDiaryPage();
	}, [profileId, supabase]);

	async function handleRequestAccess() {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			alert("You need to log in first to request access.");
			return;
		}

		if (user.id === profileId) return;

		try {
			setRequestingAccess(true);

			const { error } = await supabase
				.from("diary_access_requests")
				.upsert(
					{
						owner_id: profileId,
						requester_id: user.id,
						status: "pending",
						updated_at: new Date().toISOString(),
					},
					{
						onConflict: "owner_id,requester_id",
					},
				);

			if (error) {
				alert(error.message);
				return;
			}

			setAccessStatus("pending");
		} finally {
			setRequestingAccess(false);
		}
	}

	function clearAllFilters() {
		setSelectedGenres([]);
		setSelectedServices([]);
	}

	const displayName = profile?.display_name ?? "User";
	const isOwnProfile = currentUserId === profileId;

	const canViewDiary =
		isOwnProfile ||
		profile?.is_private_diary === false ||
		accessStatus === "accepted";

	const items = useMemo(() => {
		return entries.map(mapPublicEntryToDiaryEntry);
	}, [entries]);

	const filteredItems = useMemo(() => {
		return items.filter((item) => {
			if (activeTab === "movies") return item.type === "movie";
			if (activeTab === "tv") return item.type === "tv";
			return true;
		});
	}, [items, activeTab]);

	const searchedItems = useMemo(() => {
		if (!query) return filteredItems;

		return filteredItems.filter((item) =>
			item.title.toLowerCase().includes(query.toLowerCase()),
		);
	}, [filteredItems, query]);

	const activeFilterCount = selectedGenres.length + selectedServices.length;

	if (loading) {
		return (
			<main className="min-h-screen bg-black px-6 py-12 text-white">
				Loading diary...
			</main>
		);
	}

	if (!profile) {
		return (
			<main className="min-h-screen bg-black px-6 py-12 text-white">
				Diary not found.
			</main>
		);
	}

	if (!canViewDiary) {
		return (
			<main className="min-h-screen bg-black text-white">
				<div className="px-6 pt-12 md:px-24">
					<Link
						href={`/users/${profileId}`}
						className="inline-flex items-center gap-2 text-muted hover:text-white"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to profile
					</Link>
				</div>

				<PrivateDiaryGate
					displayName={displayName}
					requestStatus={accessStatus}
					requesting={requestingAccess}
					onRequestAccess={handleRequestAccess}
				/>
			</main>
		);
	}

	return (
		<div className="relative px-6 md:px-24 py-10 overflow-hidden min-h-screen bg-black text-white">
			<img
				src="/images/swoosh.svg"
				alt=""
				className="absolute inset-0 w-full h-full object-cover opacity-[0.25] pointer-events-none"
			/>

			<div className="relative z-10 mb-8 flex items-center justify-between gap-4">
				<Link
					href={`/users/${profileId}`}
					className="inline-flex items-center gap-2 text-sm text-muted hover:text-white"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to profile
				</Link>

				<div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-muted">
					{profile.is_private_diary ? (
						<>
							<Lock className="h-4 w-4" />
							Private diary
						</>
					) : (
						<>
							<Globe2 className="h-4 w-4" />
							Public diary
						</>
					)}
				</div>
			</div>

			<div className="relative z-10">
				<MediaToolbar
					title={isOwnProfile ? "My Diary" : `${displayName}'s Diary`}
					total={searchedItems.length}
					activeTab={activeTab}
					onTabChange={setActiveTab}
					sort={sort}
					onSortChange={setSort}
					query={query}
					onQueryChange={setQuery}
					view={view}
					onViewChange={setView}
					onFilterClick={() => setFiltersOpen((prev) => !prev)}
				/>

				{filtersOpen && (
					<div className="mb-8 p-6 rounded-2xl bg-[#1b1b1b] border border-border">
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-lg font-semibold">Filters</h3>

							{activeFilterCount > 0 && (
								<button
									type="button"
									onClick={clearAllFilters}
									className="text-accent text-sm hover:underline"
								>
									Clear all
								</button>
							)}
						</div>

						<div className="mb-6">
							<h4 className="text-xs uppercase tracking-wide text-muted mb-3">
								Genre
							</h4>

							<div className="flex flex-wrap gap-2">
								{GENRES.map((genre) => {
									const active =
										selectedGenres.includes(genre);

									return (
										<button
											type="button"
											key={genre}
											onClick={() => {
												setSelectedGenres((prev) =>
													active
														? prev.filter(
																(g) =>
																	g !== genre,
															)
														: [...prev, genre],
												);
											}}
											className={`px-3 py-1.5 rounded-full text-sm transition ${
												active
													? "bg-accent text-white"
													: "bg-[#2a2a2a] text-muted hover:bg-[#333]"
											}`}
										>
											{genre}
										</button>
									);
								})}
							</div>
						</div>

						<div>
							<h4 className="text-xs uppercase tracking-wide text-muted mb-3">
								Streaming Service
							</h4>

							<div className="flex flex-wrap gap-2">
								{SERVICES.map((service) => {
									const active =
										selectedServices.includes(service);

									return (
										<button
											type="button"
											key={service}
											onClick={() => {
												setSelectedServices((prev) =>
													active
														? prev.filter(
																(s) =>
																	s !==
																	service,
															)
														: [...prev, service],
												);
											}}
											className={`px-3 py-1.5 rounded-full text-sm transition ${
												active
													? "bg-accent text-white"
													: "bg-[#2a2a2a] text-muted hover:bg-[#333]"
											}`}
										>
											{service}
										</button>
									);
								})}
							</div>
						</div>
					</div>
				)}

				{searchedItems.length === 0 ? (
					<p className="relative z-10 text-sm text-muted">
						No entries found.
					</p>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
						{searchedItems.map((entry) => (
							<MediaCard
								key={`${entry.type}-${entry.id}`}
								id={entry.id}
								type={entry.type}
								title={entry.title}
								posterPath={entry.poster}
								backdropPath={entry.backdrop ?? entry.poster}
								rating={entry.rating}
								variant="default"
								initialDiaryEntry={entry}
								readOnly
							/>
						))}
					</div>
				)}

				<div className="flex justify-center mt-8 transition-all">
					<LoadMoreButton
						onClick={() => console.log("Load more clicked")}
					/>
				</div>
			</div>
		</div>
	);
}
