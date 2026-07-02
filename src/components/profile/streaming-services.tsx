// "use client";

// import { useEffect, useState } from "react";
// import StreamingServicesModal from "./streaming-services-modal";
// import { WatchProvider } from "@/types";

// export default function StreamingServices() {
// 	const [providers, setProviders] = useState<WatchProvider[]>([]);
// 	const [connected, setConnected] = useState<WatchProvider[]>([]);
// 	const [open, setOpen] = useState(false);

// 	useEffect(() => {
// 		async function load() {
// 			const res = await fetch("/api/tmdb/streaming-providers");
// 			const data: WatchProvider[] = await res.json();
// 			setProviders(data);
// 		}

// 		load();
// 	}, []);

// 	const toggleProvider = (provider: WatchProvider) => {
// 		setConnected((prev) =>
// 			prev.find((p) => p.provider_id === provider.provider_id)
// 				? prev.filter((p) => p.provider_id !== provider.provider_id)
// 				: [...prev, provider],
// 		);
// 	};

// 	return (
// 		<>
// 			{connected.length === 0 ? (
// 				<div className="mt-4 flex items-center gap-4">
// 					<p className="text-sm text-muted">
// 						You haven’t added any services yet.
// 					</p>

// 					<button
// 						onClick={() => setOpen(true)}
// 						className="bg-accent text-white text-xs px-4 py-1.5 rounded-full hover:bg-accent-hover transition"
// 					>
// 						Add
// 					</button>
// 				</div>
// 			) : (
// 				<div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded-xl w-fit mt-4">
// 					{connected.slice(0, 3).map((provider, index) => (
// 						<div
// 							key={provider.provider_id}
// 							className="flex items-center gap-2"
// 						>
// 							<img
// 								src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
// 								className="w-5 h-5 rounded"
// 								alt={provider.provider_name}
// 							/>

// 							{index < Math.min(connected.length, 3) - 1 && (
// 								<span className="text-white text-sm">|</span>
// 							)}
// 						</div>
// 					))}

// 					{connected.length > 3 && (
// 						<>
// 							<span className="text-white text-sm">|</span>
// 							<span className="text-sm text-white">
// 								+{connected.length - 3}
// 							</span>
// 						</>
// 					)}

// 					<button
// 						onClick={() => setOpen(true)}
// 						className="ml-2 bg-accent text-white text-xs px-3 py-1 rounded-full hover:bg-accent-hover transition"
// 					>
// 						Add
// 					</button>
// 				</div>
// 			)}

// 			{open && (
// 				<StreamingServicesModal
// 					providers={providers}
// 					connected={connected}
// 					onToggle={toggleProvider}
// 					onClose={() => setOpen(false)}
// 				/>
// 			)}
// 		</>
// 	);
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import StreamingServicesModal from "./streaming-services-modal";
import { WatchProvider } from "@/types";
import { createClient } from "@/lib/supabase/client";

type SavedStreamingService = {
	provider_id: number;
	provider_name: string;
	logo_path: string | null;
};

export default function StreamingServices() {
	const supabase = useMemo(() => createClient(), []);

	const [providers, setProviders] = useState<WatchProvider[]>([]);
	const [connected, setConnected] = useState<WatchProvider[]>([]);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function load() {
			setLoading(true);

			const {
				data: { user },
			} = await supabase.auth.getUser();

			const res = await fetch("/api/tmdb/streaming-providers");
			const providerData: WatchProvider[] = await res.json();
			setProviders(providerData);

			if (!user) {
				setConnected([]);
				setLoading(false);
				return;
			}

			const { data, error } = await supabase
				.from("user_streaming_services")
				.select("provider_id, provider_name, logo_path")
				.eq("user_id", user.id)
				.order("created_at", { ascending: true });

			if (error) {
				console.error(error.message);
				setLoading(false);
				return;
			}

			const savedServices: WatchProvider[] = (
				(data || []) as SavedStreamingService[]
			).map((service) => ({
				provider_id: service.provider_id,
				provider_name: service.provider_name,
				logo_path: service.logo_path ?? "",
			}));

			setConnected(savedServices);
			setLoading(false);
		}

		load();
	}, [supabase]);

	const toggleProvider = async (provider: WatchProvider) => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			alert("You need to be logged in to save streaming services.");
			return;
		}

		const alreadyConnected = connected.some(
			(p) => p.provider_id === provider.provider_id,
		);

		if (alreadyConnected) {
			const { error } = await supabase
				.from("user_streaming_services")
				.delete()
				.eq("user_id", user.id)
				.eq("provider_id", provider.provider_id);

			if (error) {
				alert(error.message);
				return;
			}

			setConnected((prev) =>
				prev.filter((p) => p.provider_id !== provider.provider_id),
			);

			return;
		}

		const { error } = await supabase
			.from("user_streaming_services")
			.insert({
				user_id: user.id,
				provider_id: provider.provider_id,
				provider_name: provider.provider_name,
				logo_path: provider.logo_path || null,
			});

		if (error) {
			alert(error.message);
			return;
		}

		setConnected((prev) => [...prev, provider]);
	};

	if (loading) {
		return (
			<div className="mt-4">
				<p className="text-sm text-muted">Loading services...</p>
			</div>
		);
	}

	return (
		<>
			{connected.length === 0 ? (
				<div className="mt-4 flex items-center gap-4">
					<p className="text-sm text-muted">
						You haven’t added any services yet.
					</p>

					<button
						type="button"
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
							{provider.logo_path && (
								<Image
									src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
									width={20}
									height={20}
									className="rounded"
									alt={provider.provider_name}
								/>
							)}

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
						type="button"
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