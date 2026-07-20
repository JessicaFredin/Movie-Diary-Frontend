// import Image from "next/image";
// import { ChevronRight } from "lucide-react";

// interface Trailer {
// 	key: string;
// }

// interface Provider {
// 	provider_id: number;
// 	provider_name: string;
// 	logo_path: string;
// }

// interface MediaTrailerWatchProps {
// 	trailer: Trailer | null;
// 	providers: Provider[];
// }

// export default function MediaTrailerWatch({
// 	trailer,
// 	providers,
// }: MediaTrailerWatchProps) {
// 	return (
// 		<section className="px-6 md:px-24 mt-10 pb-16">
// 			<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
// 				{/* ===== TRAILER ===== */}
// 				<div className="md:col-span-2">
// 					<h2 className="mb-3 text-xl font-semibold">Trailer</h2>

// 					{trailer ? (
// 						<div className="relative aspect-video rounded-2xl overflow-hidden bg-surface-elevated shadow-lg">
// 							<iframe
// 								src={`https://www.youtube.com/embed/${trailer.key}`}
// 								title="Trailer"
// 								className="absolute inset-0 h-full w-full"
// 								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
// 								allowFullScreen
// 							/>
// 						</div>
// 					) : (
// 						<p className="text-sm text-muted">
// 							Trailer not available.
// 						</p>
// 					)}
// 				</div>

// 				{/* ===== WHERE TO WATCH ===== */}
// 				<div>
// 					<h2 className="mb-4 text-xl font-semibold">
// 						Where to Watch
// 					</h2>

// 					{providers.length > 0 ? (
// 						<div className="space-y-4">
// 							{providers.map((provider) => (
// 								<button
// 									key={provider.provider_id}
// 									className="w-full flex items-center justify-between rounded-2xl bg-surface-dark border border-surface-elevated px-5 py-4 text-sm hover:bg-surface-elevated transition-all duration-300"
// 								>
// 									<div className="flex items-center gap-4">
// 										<Image
// 											src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
// 											alt={provider.provider_name}
// 											width={36}
// 											height={36}
// 											className="rounded-md"
// 										/>
// 										<span className="text-muted font-medium">
// 											{provider.provider_name}
// 										</span>
// 									</div>

// 									<ChevronRight className="w-4 h-4 text-muted" />
// 								</button>
// 							))}
// 						</div>
// 					) : (
// 						<p className="text-sm text-muted">
// 							No streaming providers available in your region.
// 						</p>
// 					)}
// 				</div>
// 			</div>
// 		</section>
// 	);
// }

"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface Trailer {
	key: string;
}

interface Provider {
	provider_id: number;
	provider_name: string;
	logo_path: string;
}

interface MediaTrailerWatchProps {
	trailer: Trailer | null;
	providers: Provider[];
}

const providerUrlsById: Record<number, string> = {
	// Main streaming services
	8: "https://www.netflix.com/login",
	9: "https://www.primevideo.com/",
	15: "https://www.hulu.com/login",
	337: "https://www.disneyplus.com/login",
	350: "https://tv.apple.com/",
	531: "https://www.paramountplus.com/account/signin/",
	386: "https://www.peacocktv.com/signin",
	384: "https://www.max.com/sign-in",
	1899: "https://www.max.com/sign-in",

	// YouTube / Google
	188: "https://tv.youtube.com/",
	192: "https://www.youtube.com/feed/storefront",
	3: "https://play.google.com/store/movies",

	// Rent / buy
	2: "https://tv.apple.com/",
	10: "https://www.amazon.com/gp/video/storefront",
	68: "https://www.microsoft.com/store/movies-and-tv",
};

function getProviderUrl(provider: Provider) {
	const urlById = providerUrlsById[provider.provider_id];

	if (urlById) return urlById;

	const name = provider.provider_name.toLowerCase();

	if (name.includes("hulu")) return "https://www.hulu.com/login";

	if (
		name.includes("hbo max") ||
		name.includes("max") ||
		name.includes("hbo")
	) {
		return "https://www.max.com/sign-in";
	}

	if (name.includes("amazon") || name.includes("prime")) {
		return "https://www.primevideo.com/";
	}

	if (name.includes("youtube tv")) {
		return "https://tv.youtube.com/";
	}

	if (name.includes("youtube")) {
		return "https://www.youtube.com/feed/storefront";
	}

	if (name.includes("netflix")) {
		return "https://www.netflix.com/login";
	}

	if (name.includes("disney")) {
		return "https://www.disneyplus.com/login";
	}

	if (name.includes("apple")) {
		return "https://tv.apple.com/";
	}

	const searchQuery = encodeURIComponent(`${provider.provider_name} login`);
	return `https://www.google.com/search?q=${searchQuery}`;
}

export default function MediaTrailerWatch({
	trailer,
	providers,
}: MediaTrailerWatchProps) {
	function openProvider(provider: Provider) {
		const url = getProviderUrl(provider);

		window.open(url, "_blank", "noopener,noreferrer");
	}

	return (
		<section className="px-6 md:px-24 mt-10 pb-16">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
				{/* ===== TRAILER ===== */}
				<div className="md:col-span-2">
					<h2 className="mb-3 text-xl font-semibold">Trailer</h2>

					{trailer ? (
						<div className="relative aspect-video rounded-2xl overflow-hidden bg-surface-elevated shadow-lg">
							<iframe
								src={`https://www.youtube.com/embed/${trailer.key}`}
								title="Trailer"
								className="absolute inset-0 h-full w-full"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							/>
						</div>
					) : (
						<p className="text-sm text-muted">
							Trailer not available.
						</p>
					)}
				</div>

				{/* ===== WHERE TO WATCH ===== */}
				<div>
					<h2 className="mb-4 text-xl font-semibold">
						Where to Watch
					</h2>

					{providers.length > 0 ? (
						<div className="space-y-4">
							{providers.map((provider) => (
								<button
									key={provider.provider_id}
									type="button"
									onClick={() => openProvider(provider)}
									className="w-full flex items-center justify-between rounded-2xl bg-surface-dark border border-surface-elevated px-5 py-4 text-sm hover:bg-surface-elevated hover:border-white/60 transition-all duration-300"
								>
									<div className="flex items-center gap-4">
										<Image
											src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
											alt={provider.provider_name}
											width={36}
											height={36}
											className="rounded-md"
										/>

										<span className="text-muted font-medium">
											{provider.provider_name}
										</span>
									</div>

									<ChevronRight className="w-4 h-4 text-muted" />
								</button>
							))}
						</div>
					) : (
						<p className="text-sm text-muted">
							No streaming providers available in your region.
						</p>
					)}
				</div>
			</div>
		</section>
	);
}