"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
	BookOpen,
	Compass,
	Film,
	Home,
	Search,
	Tv,
	User,
	X,
	Bookmark
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type NavLinkItem = {
	type: "link";
	href: string;
	label: string;
	icon: typeof Home;
};

type NavSearchItem = {
	type: "search";
	label: string;
	icon: typeof Search;
};

type NavItem = NavLinkItem | NavSearchItem;

type ProfileSearchResult = {
	id: string;
	display_name: string | null;
	avatar_url: string | null;
};

type MediaType = "movie" | "tv";

type MediaSearchResult = {
	id: number;
	media_type: MediaType;
	title?: string;
	name?: string;
	poster_path: string | null;
	release_date?: string | null;
	first_air_date?: string | null;
};

const items: NavItem[] = [
	{ type: "link", href: "/", label: "Home", icon: Home },
	{ type: "link", href: "/my-diary", label: "Diary", icon: BookOpen },
	{ type: "link", href: "/my-watchlist", label: "Watchlist", icon: Bookmark },
	{ type: "search", label: "Search", icon: Search },
	{ type: "link", href: "/profile", label: "Profile", icon: User },
];

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function isMediaType(value: unknown): value is MediaType {
	return value === "movie" || value === "tv";
}

function parseMediaResult(item: unknown): MediaSearchResult | null {
	if (!isRecord(item)) return null;

	const id = item.id;
	const mediaType = item.media_type;
	const title = item.title;
	const name = item.name;
	const posterPath = item.poster_path;
	const releaseDate = item.release_date;
	const firstAirDate = item.first_air_date;

	if (typeof id !== "number") return null;
	if (!isMediaType(mediaType)) return null;

	return {
		id,
		media_type: mediaType,
		title: typeof title === "string" ? title : undefined,
		name: typeof name === "string" ? name : undefined,
		poster_path: typeof posterPath === "string" ? posterPath : null,
		release_date: typeof releaseDate === "string" ? releaseDate : null,
		first_air_date: typeof firstAirDate === "string" ? firstAirDate : null,
	};
}

function parseMediaResults(data: unknown): MediaSearchResult[] {
	if (!isRecord(data)) return [];

	const results = data.results;

	if (!Array.isArray(results)) return [];

	return results
		.map(parseMediaResult)
		.filter((item): item is MediaSearchResult => item !== null)
		.filter((item) => item.poster_path !== null)
		.slice(0, 10);
}

function getMediaTitle(item: MediaSearchResult) {
	return item.media_type === "movie"
		? (item.title ?? "Untitled")
		: (item.name ?? "Untitled");
}

function getMediaYear(item: MediaSearchResult) {
	const date =
		item.media_type === "movie" ? item.release_date : item.first_air_date;

	return date ? date.slice(0, 4) : "—";
}

function getMediaHref(item: MediaSearchResult) {
	return item.media_type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;
}

function getPosterUrl(path: string | null) {
	if (!path) return "/logo.png";
	if (path.startsWith("http")) return path;

	const cleanPath = path.startsWith("/") ? path : `/${path}`;
	return `https://image.tmdb.org/t/p/w200${cleanPath}`;
}

function getInitials(name: string) {
	const clean = name.trim();

	if (!clean) return "U";

	const parts = clean.split(" ").filter(Boolean);

	if (parts.length >= 2) {
		return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
	}

	return clean.slice(0, 1).toUpperCase();
}

export default function MobileBottomNav() {
	const pathname = usePathname();
	const router = useRouter();
	const supabase = useMemo(() => createClient(), []);

	const [searchOpen, setSearchOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [peopleResults, setPeopleResults] = useState<ProfileSearchResult[]>(
		[],
	);
	const [mediaResults, setMediaResults] = useState<MediaSearchResult[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!searchOpen) return;

		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = originalOverflow;
		};
	}, [searchOpen]);

	useEffect(() => {
		let cancelled = false;

		async function searchSite() {
			const cleanQuery = query.trim();

			if (cleanQuery.length < 2) {
				setPeopleResults([]);
				setMediaResults([]);
				setLoading(false);
				return;
			}

			setLoading(true);

			try {
				const [profilesResponse, mediaResponse] = await Promise.all([
					supabase
						.from("profiles")
						.select("id, display_name, avatar_url")
						.ilike("display_name", `%${cleanQuery}%`)
						.limit(6),

					fetch(
						`/api/tmdb/search?query=${encodeURIComponent(
							cleanQuery,
						)}&page=1`,
					),
				]);

				if (cancelled) return;

				if (profilesResponse.error) {
					console.error(profilesResponse.error.message);
					setPeopleResults([]);
				} else {
					setPeopleResults(
						(profilesResponse.data ?? []) as ProfileSearchResult[],
					);
				}

				if (!mediaResponse.ok) {
					setMediaResults([]);
				} else {
					const mediaData: unknown = await mediaResponse.json();
					setMediaResults(parseMediaResults(mediaData));
				}
			} catch (error) {
				console.error("Mobile search failed:", error);

				if (!cancelled) {
					setPeopleResults([]);
					setMediaResults([]);
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		const timeout = window.setTimeout(searchSite, 250);

		return () => {
			cancelled = true;
			window.clearTimeout(timeout);
		};
	}, [query, supabase]);

	function closeSearch() {
		setSearchOpen(false);
		setQuery("");
		setPeopleResults([]);
		setMediaResults([]);
	}

	function goTo(href: string) {
		closeSearch();
		router.push(href);
	}

	return (
		<>
			{searchOpen && (
				<div className="fixed inset-0 z-[90] bg-black text-white md:hidden">
					{/* TOP SEARCH HEADER */}
					<div className="sticky top-0 z-20 border-b border-white/10 bg-[#08080a]/95 px-4 pb-4 pt-4 backdrop-blur-xl">
						<div className="flex items-center gap-3">
							<div className="relative flex-1">
								<Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />

								<input
									autoFocus
									value={query}
									onChange={(event) =>
										setQuery(event.target.value)
									}
									placeholder="Search movies, shows, people..."
									className="
										h-12 w-full rounded-full border border-white/10
										bg-white/[0.07] pl-12 pr-11 text-sm text-white
										outline-none placeholder:text-muted
										focus:border-accent focus:bg-white/[0.1]
									"
								/>

								{query && (
									<button
										type="button"
										onClick={() => setQuery("")}
										className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white"
									>
										<X className="h-4 w-4" />
									</button>
								)}
							</div>

							<button
								type="button"
								onClick={closeSearch}
								className="rounded-full px-2 py-2 text-sm font-semibold text-muted hover:text-white"
							>
								Cancel
							</button>
						</div>
					</div>

					{/* RESULTS */}
					<div className="h-[calc(100vh-80px)] overflow-y-auto px-4 pb-24 pt-5">
						{query.trim().length < 2 && (
							<div className="flex min-h-[45vh] flex-col items-center justify-center text-center">
								<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.06]">
									<Search className="h-7 w-7 text-muted" />
								</div>

								<h2 className="text-lg font-bold text-white">
									Search Movie Diary
								</h2>

								<p className="mt-2 max-w-[260px] text-sm text-muted">
									Find movies, TV shows, and other users.
								</p>
							</div>
						)}

						{query.trim().length >= 2 && loading && (
							<div className="space-y-3">
								{Array.from({ length: 6 }).map((_, index) => (
									<div
										key={index}
										className="h-16 animate-pulse rounded-2xl bg-white/[0.06]"
									/>
								))}
							</div>
						)}

						{query.trim().length >= 2 && !loading && (
							<>
								{peopleResults.length === 0 &&
									mediaResults.length === 0 && (
										<div className="flex min-h-[45vh] flex-col items-center justify-center text-center">
											<p className="text-sm text-muted">
												No results found.
											</p>
										</div>
									)}

								{peopleResults.length > 0 && (
									<section>
										<h3 className="mb-3 text-xs uppercase tracking-wide text-muted">
											People
										</h3>

										<div className="space-y-2">
											{peopleResults.map((person) => {
												const name =
													person.display_name ??
													"User";

												return (
													<button
														key={person.id}
														type="button"
														onClick={() =>
															goTo(
																`/users/${person.id}`,
															)
														}
														className="
															flex w-full items-center gap-3 rounded-2xl
															bg-white/[0.05] px-4 py-3 text-left
															transition hover:bg-white/[0.09]
														"
													>
														<div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-elevated">
															{person.avatar_url ? (
																<Image
																	src={
																		person.avatar_url
																	}
																	alt={name}
																	width={48}
																	height={48}
																	className="h-full w-full object-cover"
																/>
															) : (
																<span className="text-sm font-bold text-white">
																	{getInitials(
																		name,
																	)}
																</span>
															)}
														</div>

														<div className="min-w-0">
															<p className="truncate text-sm font-bold text-white">
																{name}
															</p>
															<p className="text-xs text-muted">
																User
															</p>
														</div>
													</button>
												);
											})}
										</div>
									</section>
								)}

								{mediaResults.length > 0 && (
									<section className="mt-7">
										<h3 className="mb-3 text-xs uppercase tracking-wide text-muted">
											Movies & Shows
										</h3>

										<div className="space-y-2">
											{mediaResults.map((item) => (
												<button
													key={`${item.media_type}-${item.id}`}
													type="button"
													onClick={() =>
														goTo(getMediaHref(item))
													}
													className="
														flex w-full items-center gap-3 rounded-2xl
														bg-white/[0.05] px-4 py-3 text-left
														transition hover:bg-white/[0.09]
													"
												>
													<div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-elevated">
														<Image
															src={getPosterUrl(
																item.poster_path,
															)}
															alt={getMediaTitle(
																item,
															)}
															fill
															className="object-cover"
														/>
													</div>

													<div className="min-w-0 flex-1">
														<p className="truncate text-sm font-bold text-white">
															{getMediaTitle(
																item,
															)}
														</p>

														<div className="mt-1 flex items-center gap-2 text-xs text-muted">
															{item.media_type ===
															"movie" ? (
																<Film className="h-3.5 w-3.5" />
															) : (
																<Tv className="h-3.5 w-3.5" />
															)}

															<span>
																{item.media_type ===
																"movie"
																	? "Movie"
																	: "TV Show"}
															</span>

															<span>·</span>

															<span>
																{getMediaYear(
																	item,
																)}
															</span>
														</div>
													</div>
												</button>
											))}
										</div>
									</section>
								)}
							</>
						)}
					</div>
				</div>
			)}

			<nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-surface-elevated bg-surface-dark pb-[env(safe-area-inset-bottom)] md:hidden">
				<ul className="flex justify-around py-2">
					{items.map((item) => {
						const Icon = item.icon;

						if (item.type === "search") {
							return (
								<li key="mobile-search">
									<button
										type="button"
										onClick={() => setSearchOpen(true)}
										className="flex flex-col items-center text-xs"
									>
										<Icon
											className={`h-5 w-5 ${
												searchOpen
													? "text-accent"
													: "text-muted"
											}`}
										/>

										<span
											className={
												searchOpen
													? "text-accent"
													: "text-muted"
											}
										>
											{item.label}
										</span>
									</button>
								</li>
							);
						}

						const active =
							pathname === item.href ||
							(item.href !== "/" &&
								pathname.startsWith(item.href));

						return (
							<li key={item.href}>
								<Link
									href={item.href}
									className="flex flex-col items-center text-xs"
								>
									<Icon
										className={`h-5 w-5 ${
											active
												? "text-accent"
												: "text-muted"
										}`}
									/>

									<span
										className={
											active
												? "text-accent"
												: "text-muted"
										}
									>
										{item.label}
									</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</>
	);
}
