// import Image from "next/image";

// type Props = {
// 	title: string;
// 	poster: string;
// 	type: "movie" | "tv";
// };

// export default function MovieCard({ title, poster, type }: Props) {
// 	return (
// 		<div className="relative cursor-pointer transition-transform hover:scale-105">
// 			{/* Poster */}
// 			<Image
// 				src={poster}
// 				alt={title}
// 				width={180}
// 				height={260}
// 				className="rounded-xl shadow-xl object-cover"
// 			/>

// 			{/* ✅ Hover Overlay */}
// 			<div
// 				className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/80 via-black/20 to-transparent 
// 				opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3"
// 			>
// 				<p className="max-w-[160px] text-sm md:text-base font-semibold text-white truncate">
// 					{title}
// 				</p>
// 				<p className="text-xs text-gray-300">
// 					{type === "movie" ? "Movie" : "TV Show"}
// 				</p>
// 			</div>
// 		</div>
// 	);
// }
