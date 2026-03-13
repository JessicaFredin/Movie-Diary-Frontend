"use client";

import { useEffect, useState } from "react";

interface Props {
	totalMinutes?: number;
	totalMovies?: number;
	totalEpisodes?: number;
}

export default function CompactWatchStats({
	totalMinutes = 18420,
	totalMovies = 312,
	totalEpisodes = 842,
}: Props) {
	const totalHours = Math.floor(totalMinutes / 60);

	const totalEntries = totalMovies + totalEpisodes;

	const moviePercentage =
		totalEntries === 0 ? 0 : (totalMovies / totalEntries) * 100;

	const tvPercentage = 100 - moviePercentage;

	const radius = 60;
	const circumference = 2 * Math.PI * radius;

	const [animatedMovie, setAnimatedMovie] = useState(0);
	const [animatedTV, setAnimatedTV] = useState(0);
	const [countHours, setCountHours] = useState(0);

	// Animate circle fill
	useEffect(() => {
		const timeout = setTimeout(() => {
			setAnimatedMovie(moviePercentage);
			setAnimatedTV(tvPercentage);
		}, 200);

		return () => clearTimeout(timeout);
	}, [moviePercentage, tvPercentage]);

	// Animate hour counter
	useEffect(() => {
		let start = 0;
		const duration = 1200;
		const increment = totalHours / (duration / 16);

		const counter = setInterval(() => {
			start += increment;
			if (start >= totalHours) {
				setCountHours(totalHours);
				clearInterval(counter);
			} else {
				setCountHours(Math.floor(start));
			}
		}, 16);

		return () => clearInterval(counter);
	}, [totalHours]);

	const movieOffset = circumference - (circumference * animatedMovie) / 100;

	const tvOffset = circumference - (circumference * animatedTV) / 100;

	return (
		<div className="relative group flex flex-col items-center gap-6">
			{/* Tooltip */}
			<div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition bg-surface border border-border px-4 py-3 rounded-xl text-xs text-white shadow-xl">
				<div className="flex items-center gap-2">
					<span className="text-[#FF414E]">●</span>
					<span>{totalMovies} Movies</span>
				</div>
				<div className="flex items-center gap-2 mt-1">
					<span className="text-[#3b82f6]">●</span>
					<span>{totalEpisodes} TV Shows</span>
				</div>
			</div>

			<div className="relative w-40 h-40">
				{/* Subtle glow */}
				<div className="absolute inset-0 rounded-full bg-[#FF414E] opacity-10 blur-3xl" />

				<svg className="w-full h-full -rotate-90 relative z-10 transition-transform duration-[4000ms] ease-linear group-hover:rotate-4">
					{/* Background track */}
					<circle
						cx="80"
						cy="80"
						r={radius}
						stroke="rgba(255,255,255,0.08)"
						strokeWidth="12"
						fill="none"
					/>

					{/* Movies arc */}
					<circle
						cx="80"
						cy="80"
						r={radius}
						stroke="#FF414E"
						strokeWidth="12"
						fill="none"
						strokeDasharray={circumference}
						strokeDashoffset={movieOffset}
						strokeLinecap="round"
						className="transition-all duration-1000 ease-out"
					/>

					{/* TV arc */}
					<circle
						cx="80"
						cy="80"
						r={radius}
						stroke="#3b82f6"
						strokeWidth="12"
						fill="none"
						strokeDasharray={circumference}
						strokeDashoffset={tvOffset}
						strokeLinecap="round"
						transform={`rotate(${animatedMovie * 3.6} 80 80)`}
						className="transition-all duration-1000 ease-out"
					/>
				</svg>

				{/* Center text */}
				<div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
					<span className="text-3xl font-semibold text-white">
						{countHours}h
					</span>
					<span className="text-xs text-muted mt-1">Watch Time</span>
				</div>
			</div>
		</div>
	);
}
