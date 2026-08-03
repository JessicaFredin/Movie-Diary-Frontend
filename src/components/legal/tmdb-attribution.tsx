import Image from "next/image";

export default function TmdbAttribution() {
	return (
		<div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
			<div className="flex flex-col gap-5 sm:flex-row sm:items-center">
				<div className="flex h-14 w-32 items-center justify-center rounded-2xl border border-white/10 bg-white p-3">
					<Image
						src="/images/tmdb-logo.svg"
						alt="TMDB logo"
						width={110}
						height={40}
						className="h-auto w-full object-contain"
					/>
				</div>

				<div>
					<h2 className="text-xl font-black">Movie and TV data</h2>

					<p className="mt-3 leading-8 text-white/60">
						This product uses the TMDB API but is not endorsed or
						certified by TMDB. Movie Diary does not own the movie,
						TV show, poster, backdrop, cast, rating or metadata
						shown from TMDB or other third-party sources.
					</p>
				</div>
			</div>
		</div>
	);
}
