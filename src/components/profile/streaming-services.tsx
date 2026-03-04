// "use client";

// import { SiNetflix, SiHbo, SiApple } from "react-icons/si";

// export default function StreamingServices() {
// 	return (
// 		<div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded-xl w-fit mt-4">
// 			<SiNetflix size={16} className="text-white" /> |
// 			<SiHbo size={16} className="text-white" /> |
// 			<SiApple size={16} className="text-white" /> |
// 			<span className="text-sm text-white">+2</span>
// 			<button className="ml-2 bg-[#FF414E] text-white text-xs px-3 py-1 rounded-full hover:bg-[#e63946] transition">
// 				Add
// 			</button>
// 		</div>
// 	);
// }

"use client";

import { useEffect, useState } from "react";
import StreamingServicesModal from "./streaming-services-modal";
import { WatchProvider } from "@/types";

export default function StreamingServices() {
	const [providers, setProviders] = useState<WatchProvider[]>([]);
	const [connected, setConnected] = useState<WatchProvider[]>([]);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		async function load() {
			const res = await fetch("/api/tmdb/streaming-providers");
			const data: WatchProvider[] = await res.json();
			setProviders(data);
		}

		load();
	}, []);

	const toggleProvider = (provider: WatchProvider) => {
		setConnected((prev) =>
			prev.find((p) => p.provider_id === provider.provider_id)
				? prev.filter((p) => p.provider_id !== provider.provider_id)
				: [...prev, provider],
		);
	};

	return (
		<>
			{connected.length === 0 ? (
				<div className="mt-4 flex items-center gap-4">
					<p className="text-sm text-muted">
						You haven’t added any services yet.
					</p>

					<button
						onClick={() => setOpen(true)}
						className="bg-accent text-white text-xs px-4 py-1.5 rounded-full hover:bg-accent-hover transition"
					>
						Add
					</button>
				</div>
			) : (
				<div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded-xl w-fit mt-4">
					{connected.slice(0, 3).map((provider, index) => (
						<div
							key={provider.provider_id}
							className="flex items-center gap-2"
						>
							<img
								src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
								className="w-5 h-5 rounded"
								alt={provider.provider_name}
							/>

							{index < Math.min(connected.length, 3) - 1 && (
								<span className="text-white text-sm">|</span>
							)}
						</div>
					))}

					{connected.length > 3 && (
						<>
							<span className="text-white text-sm">|</span>
							<span className="text-sm text-white">
								+{connected.length - 3}
							</span>
						</>
					)}

					<button
						onClick={() => setOpen(true)}
						className="ml-2 bg-accent text-white text-xs px-3 py-1 rounded-full hover:bg-accent-hover transition"
					>
						Add
					</button>
				</div>
			)}

			{open && (
				<StreamingServicesModal
					providers={providers}
					connected={connected}
					onToggle={toggleProvider}
					onClose={() => setOpen(false)}
				/>
			)}
		</>
	);
}