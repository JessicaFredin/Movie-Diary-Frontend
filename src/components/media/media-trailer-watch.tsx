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

export default function MediaTrailerWatch({
	trailer,
	providers,
}: MediaTrailerWatchProps) {
	return (
		<section className="px-6 md:px-24 mt-10 pb-16">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
				{/* ===== TRAILER ===== */}
				<div className="md:col-span-2">
					<h2 className="mb-3 text-xl font-semibold">Trailer</h2>

					{trailer ? (
						<div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-800 shadow-lg">
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
									className="w-full flex items-center justify-between rounded-2xl bg-gray-900 border border-gray-800 px-5 py-4 text-sm hover:bg-gray-800 transition-all duration-300"
								>
									<div className="flex items-center gap-4">
										<Image
											src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
											alt={provider.provider_name}
											width={36}
											height={36}
											className="rounded-md"
										/>
										<span className="text-gray-200 font-medium">
											{provider.provider_name}
										</span>
									</div>

									<ChevronRight className="w-4 h-4 text-gray-400" />
								</button>
							))}
						</div>
					) : (
						<p className="text-sm text-gray-400">
							No streaming providers available in your region.
						</p>
					)}
				</div>
			</div>
		</section>
	);
}