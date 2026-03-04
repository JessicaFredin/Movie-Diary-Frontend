import Image from "next/image";

export interface CastMember {
	id: number;
	name: string;
	character: string;
	image: string;
}

interface MediaCastProps {
	cast: CastMember[];
	title?: string; // optional override if needed
}

export default function MediaCast({ cast, title = "Cast" }: MediaCastProps) {
	if (!cast || cast.length === 0) return null;

	return (
		<section className="px-6 md:px-24 ">
			<h2 className="text-2xl font-semibold mb-8">{title}</h2>

			<div className="flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-6 overflow-x-auto md:overflow-visible pb-2">
				{cast.map((actor) => (
					<div
						key={actor.id}
						className="group min-w-[180px] md:min-w-0 bg-surface-dark border border-surface-elevated rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:bg-surface-elevated"
					>
						{/* Avatar */}
						<div className="relative w-16 h-16 rounded-full overflow-hidden mb-4 ring-1 ring-surface-elevated transition-all duration-300 group-hover:ring-2 group-hover:ring-accent/70">
							<Image
								src={actor.image}
								alt={actor.name}
								fill
								className="object-cover"
							/>
						</div>

						{/* Name */}
						<p className="text-sm font-semibold text-white">
							{actor.name}
						</p>

						{/* Character */}
						<p className="text-xs text-muted mt-1">
							{actor.character}
						</p>
					</div>
				))}
			</div>
		</section>
	);
}
