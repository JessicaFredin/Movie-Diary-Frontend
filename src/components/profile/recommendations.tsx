import Image from "next/image";

const recommendations = [
	{
		title: "The Notebook",
		poster: "https://image.tmdb.org/t/p/original/sYLiOOhcjnUdRt1MFgq56ZSMzzs.jpg",
	},
	{
		title: "Red Notice",
		poster: "https://image.tmdb.org/t/p/original/q2d56YvJ3s9W73lqrk16Nzcc7xD.jpg",
	},
	{
		title: "The OC",
		poster: "https://image.tmdb.org/t/p/original/xDc6BMGDaeyalpSZ9KKk7RCBCz5.jpg",
	},
	{
		title: "Joker",
		poster: "https://image.tmdb.org/t/p/original/mZuAPY4ETMQPHhCXIcJ90kd6RaS.jpg",
	},
	{
		title: "Wednesday",
		poster: "https://image.tmdb.org/t/p/original/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
	},
	{
		title: "Euphoria",
		poster: "https://image.tmdb.org/t/p/original/3Q0hd3heuWwDWpwcDkhQOA6TYWI.jpg",
	},
	{
		title: "True Blood",
		poster: "https://image.tmdb.org/t/p/original/e856vroLbzi79IktJeOi0R9kx41.jpg",
	},
	{
		title: "This Is Us",
		poster: "https://image.tmdb.org/t/p/original/rDjZVtIT2RzcdkA4X7YnAdUsLu5.jpg",
	},
];

export default function Recommendations() {
	return (
		<div className="mt-10 px-6 md:px-24">
			<h3 className="font-semibold text-lg mb-4 text-white">
				Recommendations
			</h3>

			<div
				className="flex gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory 
				scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
			>
				{recommendations.map((rec, i) => (
					<div
						key={i}
						className="relative min-w-[150px] md:min-w-[180px] snap-start cursor-pointer transition-transform hover:scale-105"
					>
						<Image
							src={rec.poster}
							alt={rec.title}
							width={180}
							height={260}
							className="rounded-xl shadow-xl"
						/>
					</div>
				))}
			</div>
		</div>
	);
}
