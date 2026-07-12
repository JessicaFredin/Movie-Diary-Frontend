export default function HeroCarouselSkeleton() {
	return (
		<section className="relative h-[60vh] w-full overflow-hidden bg-black md:h-[70vh]">
			{/* Fake background */}
			<div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#050505] via-[#141414] to-[#252525]" />

			{/* Dark overlay */}
			<div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/20" />
			<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

			{/* Left glass panel */}
			<div className="hidden md:block absolute inset-y-0 left-0 z-10 w-[34%] bg-black/55 backdrop-blur-[28px]" />

			{/* Text skeleton */}
			<div className="absolute z-20 flex h-full w-full flex-col justify-center px-5 md:w-[34%] md:px-12">
				<div className="space-y-5">
					<div className="flex items-center gap-3">
						<div className="h-4 w-12 animate-pulse rounded-full bg-white/20" />
						<div className="h-12 w-56 animate-pulse rounded-xl bg-white/20" />
					</div>

					<div className="space-y-3">
						<div className="h-4 w-full animate-pulse rounded-full bg-white/15" />
						<div className="h-4 w-[90%] animate-pulse rounded-full bg-white/15" />
						<div className="h-4 w-[70%] animate-pulse rounded-full bg-white/15" />
					</div>

					<div className="flex gap-2">
						<div className="h-8 w-20 animate-pulse rounded-full bg-white/15" />
						<div className="h-8 w-24 animate-pulse rounded-full bg-white/15" />
					</div>

					<div className="flex items-center gap-3 pt-2">
						<div className="h-11 w-32 animate-pulse rounded-full bg-accent/40" />
						<div className="h-11 w-11 animate-pulse rounded-full border border-white/20 bg-white/10" />
					</div>
				</div>
			</div>

			{/* Dots skeleton */}
			<div className="absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
				<div className="h-2.5 w-7 animate-pulse rounded-full bg-accent/60" />
				<div className="h-2.5 w-2.5 animate-pulse rounded-full bg-white/30" />
				<div className="h-2.5 w-2.5 animate-pulse rounded-full bg-white/30" />
				<div className="h-2.5 w-2.5 animate-pulse rounded-full bg-white/30" />
			</div>
		</section>
	);
}
