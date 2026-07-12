"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Film, Search, Tv, User, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type PersonResult = {
	id: string;
	display_name: string;
	avatar_url: string | null;
};

type MediaType = "movie" | "tv";

type MediaResult = {
	id: number;
	media_type: MediaType;
	title: string;
	poster_path: string | null;
	backdrop_path: string | null;
	vote_average: number | null;
	year: string | null;
};

type SiteSearchResponse = {
	results: MediaResult[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function isMediaType(value: unknown): value is MediaType {
	return value === "movie" || value === "tv";
}

function parsePersonRow(row: unknown): PersonResult | null {
	if (!isRecord(row)) return null;

	const id = row.id;
	const displayName = row.display_name;
	const avatarUrl = row.avatar_url;

	if (typeof id !== "string") return null;

	return {
		id,
		display_name:
			typeof displayName === "string" && displayName.trim()
				? displayName
				: "User",
		avatar_url: typeof avatarUrl === "string" ? avatarUrl : null,
	};
}

function parseMediaItem(item: unknown): MediaResult | null {
	if (!isRecord(item)) return null;

	const id = item.id;
	const mediaType = item.media_type;
	const title = item.title;
	const posterPath = item.poster_path;
	const backdropPath = item.backdrop_path;
	const voteAverage = item.vote_average;
	const year = item.year;

	if (typeof id !== "number") return null;
	if (!isMediaType(mediaType)) return null;
	if (typeof title !== "string") return null;

	return {
		id,
		media_type: mediaType,
		title,
		poster_path: typeof posterPath === "string" ? posterPath : null,
		backdrop_path: typeof backdropPath === "string" ? backdropPath : null,
		vote_average: typeof voteAverage === "number" ? voteAverage : null,
		year: typeof year === "string" ? year : null,
	};
}

function parseSearchResponse(data: unknown): SiteSearchResponse {
	if (!isRecord(data)) return { results: [] };

	const results = data.results;

	if (!Array.isArray(results)) return { results: [] };

	return {
		results: results
			.map(parseMediaItem)
			.filter((item): item is MediaResult => item !== null),
	};
}

function getInitial(name: string) {
	return name.trim().slice(0, 1).toUpperCase() || "U";
}

function getPosterUrl(path: string | null) {
	if (!path) return null;
	if (path.startsWith("http")) return path;

	const cleanPath = path.startsWith("/") ? path : `/${path}`;
	return `https://image.tmdb.org/t/p/w92${cleanPath}`;
}

export default function NavbarSearch() {
	const router = useRouter();
	const supabase = useMemo(() => createClient(), []);
	const wrapperRef = useRef<HTMLDivElement>(null);

	const [query, setQuery] = useState("");
	const [people, setPeople] = useState<PersonResult[]>([]);
	const [media, setMedia] = useState<MediaResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const cleanQuery = query.trim();
	const hasQuery = cleanQuery.length > 0;
	const hasResults = people.length > 0 || media.length > 0;

	useEffect(() => {
		function handleMouseDown(event: MouseEvent) {
			if (!wrapperRef.current) return;

			if (!wrapperRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		}

		function handleEscape(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setOpen(false);
			}
		}

		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("keydown", handleEscape);
		};
	}, []);

	useEffect(() => {
		if (!hasQuery) {
			setPeople([]);
			setMedia([]);
			setLoading(false);
			return;
		}

		let cancelled = false;

		const timeout = window.setTimeout(async () => {
			try {
				setLoading(true);
				setOpen(true);

				const [peopleResponse, mediaResponse] = await Promise.all([
					supabase
						.from("profiles")
						.select("id, display_name, avatar_url")
						.ilike("display_name", `%${cleanQuery}%`)
						.limit(5),
					fetch(
						`/api/tmdb/site-search?query=${encodeURIComponent(
							cleanQuery,
						)}`,
					),
				]);

				if (cancelled) return;

				const rawPeopleData: unknown[] = Array.isArray(
					peopleResponse.data,
				)
					? peopleResponse.data
					: [];

				const parsedPeople = rawPeopleData
					.map(parsePersonRow)
					.filter((item): item is PersonResult => item !== null);

				setPeople(parsedPeople);

				if (mediaResponse.ok) {
					const mediaJson: unknown = await mediaResponse.json();

					if (!cancelled) {
						setMedia(parseSearchResponse(mediaJson).results);
					}
				} else {
					setMedia([]);
				}
			} catch (error) {
				console.error("Search failed:", error);

				if (!cancelled) {
					setPeople([]);
					setMedia([]);
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}, 250);

		return () => {
			cancelled = true;
			window.clearTimeout(timeout);
		};
	}, [cleanQuery, hasQuery, supabase]);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!hasQuery) return;

		if (people[0]) {
			router.push(`/users/${people[0].id}`);
			setOpen(false);
			return;
		}

		if (media[0]) {
			router.push(
				media[0].media_type === "movie"
					? `/movie/${media[0].id}`
					: `/tv/${media[0].id}`,
			);
			setOpen(false);
			return;
		}

		router.push(`/?search=${encodeURIComponent(cleanQuery)}`);
		setOpen(false);
	}

	function clearSearch() {
		setQuery("");
		setPeople([]);
		setMedia([]);
		setOpen(false);
	}

	function goToPerson(person: PersonResult) {
		router.push(`/users/${person.id}`);
		setOpen(false);
	}

	function goToMedia(item: MediaResult) {
		router.push(
			item.media_type === "movie"
				? `/movie/${item.id}`
				: `/tv/${item.id}`,
		);
		setOpen(false);
	}

	return (
		<div
			ref={wrapperRef}
			className="relative mx-8 hidden max-w-3xl flex-1 md:block"
		>
			<form
				onSubmit={handleSubmit}
				className="flex h-12 items-center rounded-full border border-white/10 bg-white/[0.05] px-5 text-muted transition focus-within:border-accent"
			>
				<Search className="mr-3 h-5 w-5 shrink-0" />

				<input
					value={query}
					onFocus={() => {
						if (hasQuery) setOpen(true);
					}}
					onChange={(event) => {
						setQuery(event.target.value);
						setOpen(true);
					}}
					placeholder="Search movies, shows, and people"
					className="w-full bg-transparent text-sm text-white outline-none placeholder:text-muted"
				/>

				{hasQuery && (
					<button
						type="button"
						onClick={clearSearch}
						className="ml-3 rounded-full p-1 text-muted transition hover:bg-white/10 hover:text-white"
						aria-label="Clear search"
					>
						<X className="h-4 w-4" />
					</button>
				)}
			</form>

			{open && hasQuery && (
				<div className="absolute left-0 right-0 top-[58px] z-50 max-h-[520px] overflow-y-auto rounded-2xl border border-white/10 bg-[#111114] py-4 shadow-2xl shadow-black/40">
					{loading && !hasResults && (
						<p className="px-5 py-4 text-sm text-muted">
							Searching...
						</p>
					)}

					{!loading && !hasResults && (
						<p className="px-5 py-4 text-sm text-muted">
							No results found.
						</p>
					)}

					{people.length > 0 && (
						<div>
							<p className="px-5 pb-3 text-xs uppercase tracking-wide text-muted">
								People
							</p>

							<div>
								{people.map((person) => (
									<button
										key={person.id}
										type="button"
										onClick={() => goToPerson(person)}
										className="flex w-full items-center gap-4 px-5 py-3 text-left transition hover:bg-white/[0.06]"
									>
										<div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-elevated text-sm font-bold text-white">
											{person.avatar_url ? (
												<img
													src={person.avatar_url}
													alt={person.display_name}
													className="h-full w-full object-cover"
												/>
											) : (
												<>
													{person.display_name ===
													"User" ? (
														<User className="h-5 w-5 text-muted" />
													) : (
														getInitial(
															person.display_name,
														)
													)}
												</>
											)}
										</div>

										<div className="min-w-0">
											<p className="truncate font-semibold text-white">
												{person.display_name}
											</p>
											<p className="text-sm text-muted">
												user
											</p>
										</div>
									</button>
								))}
							</div>
						</div>
					)}

					{media.length > 0 && (
						<div className={people.length > 0 ? "mt-5" : ""}>
							<p className="px-5 pb-3 text-xs uppercase tracking-wide text-muted">
								Movies & Shows
							</p>

							<div>
								{media.map((item) => {
									const posterUrl = getPosterUrl(
										item.poster_path,
									);

									return (
										<button
											key={`${item.media_type}-${item.id}`}
											type="button"
											onClick={() => goToMedia(item)}
											className="flex w-full items-center gap-4 px-5 py-3 text-left transition hover:bg-white/[0.06]"
										>
											<div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-accent/20 text-white">
												{posterUrl ? (
													<img
														src={posterUrl}
														alt={item.title}
														className="h-full w-full object-cover"
													/>
												) : item.media_type ===
												  "movie" ? (
													<Film className="h-5 w-5" />
												) : (
													<Tv className="h-5 w-5" />
												)}
											</div>

											<div className="min-w-0">
												<p className="truncate font-semibold text-white">
													{item.title}
												</p>

												<p className="text-sm text-muted">
													{item.media_type === "movie"
														? "Movie"
														: "TV Show"}
													{item.year
														? ` · ${item.year}`
														: ""}
												</p>
											</div>
										</button>
									);
								})}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
