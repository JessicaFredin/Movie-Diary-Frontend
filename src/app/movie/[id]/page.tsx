import Image from "next/image";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import {
	fetchMovieDetails,
	fetchMovieTrailer,
	fetchMovieWatchProviders,
} from "@/services/tmdb-services";
import { getPosterUrl } from "@/utils/tmdb-image";
import ExpandableText from "@/components/details/expandable-text";
import { ChevronRight, Clock, Star } from "lucide-react";
import MovieDiaryActions from "@/components/details/movie-diary-actions";

type PageProps = {
	params: {
		id: string;
	};
};

export default async function MovieDetailsPage({ params }: PageProps) {
	const movieId = Number(params.id);

	if (!movieId || Number.isNaN(movieId)) {
		notFound();
	}

	const headersList = await headers();
	const country = headersList.get("x-vercel-ip-country") ?? "US";

	const movie = await fetchMovieDetails(movieId);
	const trailer = await fetchMovieTrailer(movieId);
	const providers = await fetchMovieWatchProviders(movieId, country);

	if (!movie) {
		notFound();
	}

	const genres = movie.genres ?? [];

	const year = movie.release_date
		? new Date(movie.release_date).getFullYear()
		: "—";

	const runtime = movie.runtime
		? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min`
		: "—";

	return (
		<main className="bg-black text-white">
			{/* ===== HERO / POSTER ===== */}
			<div className="relative md:static">
				{/* Mobile banner */}
				<div className="relative h-[70vh] md:hidden">
					<Image
						src={getPosterUrl(movie.poster_path)}
						alt={movie.title}
						fill
						priority
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
				</div>

				{/* Content wrapper */}
				<div className="relative px-6 md:px-24 md:py-16">
					<div className="md:grid md:grid-cols-[300px_1fr] md:gap-10">
						{/* Desktop poster */}
						<div className="hidden md:block">
							<Image
								src={getPosterUrl(movie.poster_path)}
								alt={movie.title}
								width={300}
								height={450}
								className="rounded-xl shadow-lg"
								priority
							/>
						</div>

						{/* ===== DETAILS ===== */}
						<div className="-mt-24 md:mt-0 flex flex-col gap-4 md:gap-6">
							<div className="flex items-center gap-1 text-xs">
								<Star className="w-4 h-4 text-yellow-300 fill-current" />
								<span>{movie.vote_average.toFixed(1)}</span>
							</div>
							<h1 className="text-2xl md:text-4xl font-bold">
								{movie.title}
							</h1>

							{/* Genres */}
							{genres.length > 0 && (
								<div className="flex flex-wrap gap-2 text-xs md:text-sm">
									{genres.map((genre) => (
										<span
											key={genre.id}
											className="bg-gray-800 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-gray-300"
										>
											{genre.name}
										</span>
									))}
								</div>
							)}

							{/* Meta */}
							<div className="text-sm text-gray-400">
								{year} · {runtime}
							</div>

							{/* Overview */}
							<div className="text-sm md:text-base text-gray-300 leading-relaxed line-clamp-3 md:line-clamp-none">
								<ExpandableText text={movie.overview} />
							</div>

							{/* ===== ACTION BUTTONS ===== */}
							<div className="max-w-sm space-y-3 ">
								<MovieDiaryActions
									id={movie.id}
									title={movie.title}
									poster={getPosterUrl(movie.poster_path)}
									backdrop={getPosterUrl(movie.backdrop_path)}
								/>

								{/* Bottom: two half-width buttons */}
								<div className="grid grid-cols-2 gap-3">
									<button className="flex items-center justify-center gap-2 rounded-full bg-gray-800 px-4 py-2 text-sm">
										<Clock className="w-4 h-4" />
										<span>Watch later</span>
									</button>

									<button className="flex items-center justify-center gap-2 rounded-full bg-gray-800 px-4 py-2 text-sm">
										<Star className="w-4 h-4" />
										<span>Rate</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* ===== TRAILER ===== */}
			<section className="px-6 md:px-24 mt-10">
				<h2 className="mb-3 text-lg font-semibold">Trailer</h2>

				{trailer ? (
					<div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800">
						<iframe
							src={`https://www.youtube.com/embed/${trailer.key}`}
							title="Trailer"
							className="absolute inset-0 h-full w-full"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						/>
					</div>
				) : (
					<p className="text-sm text-gray-400">
						Trailer not available.
					</p>
				)}
			</section>

			{/* ===== WHERE TO WATCH ===== */}
			<section className="px-6 md:px-24 mt-10 space-y-3 pb-16">
				<h2 className="text-lg font-semibold mb-2">
					Where to watch {movie.title}
				</h2>
				{providers.length > 0 ? (
					<div className="flex flex-wrap gap-3">
						{providers.map((provider) => (
							<button
								key={provider.provider_id}
								className="flex items-center justify-between rounded-xl bg-gray-900 px-4 py-4 w-full md:w-sm text-sm"
							>
								{/* Left side */}
								<div className="flex items-center gap-3">
									<Image
										src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
										alt={provider.provider_name}
										width={36}
										height={36}
										className="rounded"
									/>
									<span>
										Watch on {provider.provider_name}
									</span>
								</div>

								{/* Right arrow */}
								<ChevronRight className="w-4 h-4 text-gray-400" />
							</button>
						))}
					</div>
				) : (
					<p className="text-sm text-gray-400">
						No streaming providers available in your region.
					</p>
				)}
			</section>
		</main>
	);
}
