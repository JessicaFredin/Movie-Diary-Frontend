export function getPosterUrl(
	path: string | null,
	size: "w200" | "w500" | "original" = "w500",
) {
	return path
		? `https://image.tmdb.org/t/p/${size}${path}`
		: "/placeholder.png";
}
