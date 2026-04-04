"use client";

import {
	Clock,
	Film,
	Tv,
	Star,
	User,
	Video,
	Flame,
	TrendingUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function YearInReviewPage() {
	const genres = [
		{ name: "Sci-Fi", value: 38 },
		{ name: "Thriller", value: 29 },
		{ name: "Drama", value: 24 },
		{ name: "Action", value: 21 },
	];

	const maxGenre = Math.max(...genres.map((g) => g.value));

	const genreRef = useRef<HTMLDivElement>(null);
	const [animateGenres, setAnimateGenres] = useState(false);
	const streamingRef = useRef<HTMLDivElement>(null);
	const [animateStreaming, setAnimateStreaming] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (
						entry.target === genreRef.current &&
						entry.isIntersecting
					) {
						setAnimateGenres(true);
					}
					if (
						entry.target === streamingRef.current &&
						entry.isIntersecting
					) {
						setAnimateStreaming(true);
					}
				});
			},
			{ threshold: 0.4 },
		);

		if (genreRef.current) observer.observe(genreRef.current);
		if (streamingRef.current) observer.observe(streamingRef.current);

		return () => observer.disconnect();
	}, []);

	return (
		<div className="min-h-screen bg-background text-white px-4 py-10 flex justify-center overflow-x-hidden">
			<div className="w-full max-w-6xl space-y-6">
				{/* HEADER */}
				<div className="space-y-3">
					<p className="text-xs tracking-widest text-muted uppercase">
						Your year in review
					</p>

					<h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-[90%]">
						2025: Your Year in{" "}
						<span className="text-accent">Motion</span>
					</h1>

					<p className="text-muted max-w-lg">
						You spent{" "}
						<span className="font-semibold text-white">
							13 days
						</span>{" "}
						of your life in front of a screen this year. Make them
						count.
					</p>
				</div>

				{/* TOP GRID */}
				<div className="grid md:grid-cols-3 gap-6 min-w-0">
					{/* WATCH TIME */}
					<div className="bg-[#1b1b1b] rounded-3xl p-6 md:col-span-2 shadow-xl space-y-6 min-w-0 flex flex-col justify-between">
						<div className="flex items-center gap-2 text-sm text-muted tracking-widest uppercase">
							<Clock size={16} />
							Total watch time
						</div>

						<div className="flex items-end gap-3">
							<span className="text-6xl font-bold text-accent">
								312
							</span>
							<span className="text-3xl text-muted">hours</span>
						</div>

						<p className="text-muted text-sm">
							That&apos;s about 13 full days of pure cinema.
						</p>
					</div>

					{/* MOVIES + EPISODES */}
					<div className="flex md:flex-col gap-6 min-w-0">
						<div className="bg-[#1b1b1b] rounded-3xl p-6 shadow-xl flex-1 space-y-3 min-w-0">
							<div className="flex items-center gap-2 text-sm text-muted uppercase tracking-widest">
								<Film size={16} />
								Movies
							</div>

							<p className="text-4xl font-bold">142</p>

							<p className="text-muted text-sm">
								watched this year
							</p>
						</div>

						<div className="bg-[#1b1b1b] rounded-3xl p-6 shadow-xl flex-1 space-y-3 min-w-0">
							<div className="flex items-center gap-2 text-sm text-muted uppercase tracking-widest">
								<Tv size={16} />
								Episodes
							</div>

							<p className="text-4xl font-bold">84</p>

							<p className="text-muted text-sm">
								binged across 12 shows
							</p>
						</div>
					</div>
				</div>

				{/* SECOND GRID */}
				<div className="grid md:grid-cols-2 gap-6 min-w-0">
					{/* TOP GENRE */}
					<div
						ref={genreRef}
						className="relative bg-[#1b1b1b] rounded-3xl p-6 shadow-xl space-y-6 overflow-hidden min-w-0"
					>
						{/* subtle background icon */}
						<Star
							size={120}
							className="absolute right-4 bottom-4 opacity-[0.04]"
						/>

						<div className="flex items-center gap-2 text-sm uppercase tracking-widest text-muted">
							<Star size={16} />
							Top genre
						</div>

						<h2 className="text-4xl font-bold text-accent">
							Sci-Fi
						</h2>

						<div className="space-y-4 text-sm">
							{genres.map((g, i) => {
								const width = (g.value / maxGenre) * 100;

								return (
									<div
										key={i}
										className="grid grid-cols-[70px_1fr_40px] items-center gap-3"
									>
										<span className="text-muted">
											{g.name}
										</span>

										<div className="w-full h-2 bg-muted/20 rounded-full overflow-hidden">
											<div
												className="h-full bg-accent rounded-full transition-all duration-[1200ms] ease-out"
												style={{
													width: animateGenres
														? `${width}%`
														: "0%",
												}}
											/>
										</div>

										<span className="text-muted text-right">
											{g.value}
										</span>
									</div>
								);
							})}
						</div>
					</div>

					{/* MOST WATCHED ACTORS */}
					<div className="bg-[#1b1b1b] rounded-3xl p-6 shadow-xl space-y-6 min-w-0">
						<div className="flex items-center gap-2 text-sm uppercase tracking-widest text-muted">
							<User size={16} />
							Most watched actors
						</div>

						<div
							className="flex gap-6 overflow-x-auto custom-scrollbar pb-6 scroll-smooth snap-x snap-mandator [-webkit-overflow-scrolling:touch]"
						>
							{[
								{
									initials: "LD",
									name: "Leonardo DiCaprio",
									films: 8,
								},
								{
									initials: "FP",
									name: "Florence Pugh",
									films: 6,
								},
								{
									initials: "TC",
									name: "Timothée Chalamet",
									films: 5,
								},
								{ initials: "Z", name: "Zendaya", films: 5 },
								{
									initials: "OI",
									name: "Oscar Isaac",
									films: 4,
								},
							].map((a, i) => (
								<div
									key={i}
									className="flex flex-col items-center min-w-[90px] text-center space-y-2 snap-start transition-transform"
								>
									<div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center text-sm font-semibold">
										{a.initials}
									</div>

									<p className="text-sm truncate w-[90px]">
										{a.name.split(" ")[0]}{" "}
										{a.name.split(" ")[1]?.[0]}.
									</p>

									<p className="text-accent text-sm">
										{a.films} films
									</p>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* THIRD GRID */}
				<div className="grid md:grid-cols-3 gap-6 min-w-0">
					{/* TOP DIRECTORS */}
					<div className="bg-[#1b1b1b] rounded-3xl p-6 shadow-xl space-y-4">
						<div className="flex items-center gap-2 text-sm uppercase tracking-widest text-muted">
							<Video size={16} />
							Top directors
						</div>

						{[
							["Denis Villeneuve", 4],
							["Christopher Nolan", 3],
							["Greta Gerwig", 3],
							["Jordan Peele", 2],
						].map((d, i) => (
							<div key={i} className="flex justify-between">
								<span className="text-muted">
									{i + 1}.{" "}
									<span className="text-white">{d[0]}</span>
								</span>

								<span className="text-accent text-sm">
									{d[1]} films
								</span>
							</div>
						))}
					</div>

					{/* STREAMING */}
					<div
						ref={streamingRef}
						className="bg-[#1b1b1b] rounded-3xl p-6 shadow-xl space-y-6"
					>
						<div className="flex items-center gap-2 text-sm uppercase tracking-widest text-muted">
							<TrendingUp size={16} />
							Top streaming service
						</div>

						<h2 className="text-3xl font-bold">Netflix</h2>

						<div className="space-y-4 text-sm">
							{[
								["Netflix", 42],
								["Apple TV+", 24],
								["Theater", 18],
								["Max", 16],
							].map((s, i) => (
								<div
									key={i}
									className="grid grid-cols-[90px_1fr_40px] items-center gap-3"
								>
									<span className="text-muted">{s[0]}</span>

									<div className="w-full h-2 bg-muted/20 rounded-full overflow-hidden">
										<div
											className="h-full bg-accent rounded-full transition-all duration-[1200ms] ease-out"
											style={{
												width: animateStreaming
													? `${s[1]}%`
													: "0%",
											}}
										/>
									</div>

									<span className="text-muted text-right">
										{s[1]}%
									</span>
								</div>
							))}
						</div>
					</div>

					{/* STREAK */}
					<div className="bg-[#1b1b1b] rounded-3xl p-6 shadow-xl text-center space-y-6">
						<div className="flex items-center justify-center gap-2 text-sm uppercase tracking-widest text-muted">
							<Flame size={16} />
							Streak
						</div>

						<div className="space-y-1">
							<p className="text-5xl font-bold bg-gradient-to-b from-orange-300 to-red-500 bg-clip-text text-transparent">
								14
							</p>

							<p className="text-muted text-sm">
								day longest streak
							</p>
						</div>

						<div className="border-t border-muted/20 pt-4">
							<p className="text-2xl font-semibold">5</p>

							<p className="text-muted text-sm">
								current streak 🔥
							</p>
						</div>
					</div>
				</div>

				{/* YEAR BREAKDOWN */}
				<div className="bg-[#1b1b1b] rounded-3xl p-6 shadow-xl space-y-10 overflow-hidden">
					<div className="flex items-center gap-2 text-sm uppercase tracking-widest text-muted">
						<TrendingUp size={16} />
						Year breakdown
					</div>

					{(() => {
						
						const months: [string, number][] = [
							["Jan", 8],
							["Feb", 10],
							["Mar", 14],
							["Apr", 12],
							["May", 9],
							["Jun", 15],
							["Jul", 18],
							["Aug", 11],
							["Sep", 13],
							["Oct", 16],
							["Nov", 10],
							["Dec", 6],
						];

						const total = months.reduce((a, b) => a + b[1], 0);
						const max = Math.max(...months.map((m) => m[1]));
						const peakMonth = months.find((m) => m[1] === max)?.[0];

						const radius = 70;
						const circumference = 2 * Math.PI * radius;

						let cumulative = 0;

						const segments = months.map((m) => {
							const fraction = m[1] / total;
							const dash = fraction * circumference;

							const segment = {
								name: m[0],
								value: m[1],
								fraction,
								dasharray: `${dash} ${circumference - dash}`,
								offset: -cumulative,
							};

							cumulative += dash;

							return segment;
						});

						return (
							<div className="flex flex-col md:flex-row items-center gap-10">
								{/* DONUT CHART */}
								<div className="relative w-[220px] h-[220px] flex-shrink-0">
									<svg
										viewBox="0 0 200 200"
										className="w-full h-full -rotate-90"
									>
										<defs>
											<linearGradient id="accentGradient">
												<stop
													offset="0%"
													stopColor="#ff414e"
												/>
												<stop
													offset="100%"
													stopColor="#ff7a82"
												/>
											</linearGradient>

											<filter id="softGlow">
												<feGaussianBlur
													stdDeviation="4"
													result="blur"
												/>
												<feMerge>
													<feMergeNode in="blur" />
													<feMergeNode in="SourceGraphic" />
												</feMerge>
											</filter>
										</defs>

										{/* base ring */}
										<circle
											cx="100"
											cy="100"
											r={radius}
											fill="none"
											stroke="#2a2a2a"
											strokeWidth="16"
										/>

										{/* segments */}
										{segments.map((s, i) => (
											<circle
												key={i}
												cx="100"
												cy="100"
												r={radius}
												fill="none"
												stroke="url(#accentGradient)"
												strokeWidth="16"
												strokeDasharray={s.dasharray}
												strokeDashoffset={s.offset}
												filter="url(#softGlow)"
												className="transition-all duration-700 hover:brightness-125"
												style={{
													animation: `segmentReveal 0.8s ease ${i * 0.05}s forwards`,
													opacity: 0,
												}}
											/>
										))}
									</svg>

									{/* CENTER GLASS */}
									<div className="absolute inset-0 flex flex-col items-center justify-center text-center backdrop-blur-sm rounded-full">
										<p className="text-4xl font-bold text-accent">
											{total}
										</p>

										<p className="text-xs text-muted tracking-wide">
											titles watched
										</p>
									</div>
								</div>

								{/* LEGEND */}
								<div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 text-sm w-full">
									{months.map((m, i) => {
										const percent = Math.round(
											(m[1] / total) * 100,
										);
										const isPeak = m[1] === max;

										return (
											<div key={i} className="space-y-1">
												<div className="flex justify-between items-center">
													<span
														className={
															isPeak
																? "text-accent font-semibold"
																: "text-muted"
														}
													>
														{m[0]}
													</span>

													<span className="text-white">
														{m[1]}
													</span>
												</div>

												<div className="h-1.5 w-full rounded-full bg-muted/20 overflow-hidden">
													<div
														className="h-full bg-gradient-to-r from-accent to-red-400 rounded-full transition-all duration-700"
														style={{
															width: `${percent}%`,
														}}
													/>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						);
					})()}

					<p className="text-sm text-muted text-center">
						Your most active month was{" "}
						<span className="text-accent font-semibold">Jul</span>{" "}
						with 18 titles watched.
					</p>

					<style>
						{`
			@keyframes segmentReveal {
				from { opacity: 0; transform: scale(0.96); }
				to { opacity: 1; transform: scale(1); }
			}
		`}
					</style>
				</div>

				{/* SHARE BUTTON */}
				<div className="flex justify-center pt-4">
					<button className="bg-accent hover:opacity-90 text-black font-semibold px-10 py-4 rounded-xl transition">
						Share 2025 Summary
					</button>
				</div>
			</div>
		</div>
	);
}
