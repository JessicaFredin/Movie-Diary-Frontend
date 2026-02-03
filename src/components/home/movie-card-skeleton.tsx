export default function MovieCardSkeleton() {
	return (
		<div className="w-[160px] md:w-[200px] flex-shrink-0">
			<div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-700">
				<div className="absolute inset-0 shimmer" />
			</div>
		</div>
	);
}
