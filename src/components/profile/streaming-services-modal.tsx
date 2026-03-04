"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { WatchProvider } from "@/types";
import { Search } from "lucide-react";

interface Props {
	providers: WatchProvider[];
	connected: WatchProvider[];
	onToggle: (provider: WatchProvider) => void;
	onClose: () => void;
}

type Tab = "all" | "connected";

export default function StreamingServicesModal({
	providers,
	connected,
	onToggle,
	onClose,
}: Props) {
	const [search, setSearch] = useState("");
	const [activeTab, setActiveTab] = useState<Tab>("all");
	const [visible, setVisible] = useState(false);
	const modalRef = useRef<HTMLDivElement>(null);

	/* Animate in */
	useEffect(() => {
		setVisible(true);
	}, []);

	/* ESC key close */
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				handleClose();
			}
		};

		document.addEventListener("keydown", handleEsc);
		return () => document.removeEventListener("keydown", handleEsc);
	}, []);

	/* Prevent background scroll */
	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "auto";
		};
	}, []);

	const handleClose = () => {
		setVisible(false);
		setTimeout(onClose, 200);
	};

	/* Click outside */
	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
			handleClose();
		}
	};

	const filteredProviders = useMemo(() => {
		let list =
			activeTab === "connected"
				? providers.filter((p) =>
						connected.some((c) => c.provider_id === p.provider_id),
					)
				: providers;

		if (search.trim()) {
			list = list.filter((p) =>
				p.provider_name.toLowerCase().includes(search.toLowerCase()),
			);
		}

		return list;
	}, [providers, connected, search, activeTab]);

	return (
		<div
			onMouseDown={handleBackdropClick}
			className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
				visible
					? "bg-black/70 backdrop-blur-sm opacity-100"
					: "bg-black/0 opacity-0"
			}`}
		>
			<div
				ref={modalRef}
				className={`w-full max-w-md rounded-2xl bg-[#111111] shadow-2xl border border-white/5 overflow-hidden transform transition-all duration-200 ${
					visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
				}`}
			>
				{/* Header */}
				<div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
					<h2 className="text-base font-semibold text-white">
						Streaming Services
					</h2>

					<button
						onClick={handleClose}
						className="text-muted hover:text-white transition text-lg"
					>
						✕
					</button>
				</div>

				{/* Tabs + Search */}
				<div className="px-6 pt-4 pb-3 space-y-3 border-b border-white/5">
					{/* Tabs */}
					<div className="flex gap-2">
						<button
							onClick={() => setActiveTab("all")}
							className={`px-3 py-1 text-xs rounded-full transition ${
								activeTab === "all"
									? "bg-accent text-white"
									: "bg-[#1c1c1c] text-muted hover:bg-[#262626]"
							}`}
						>
							All
						</button>

						<button
							onClick={() => setActiveTab("connected")}
							className={`px-3 py-1 text-xs rounded-full transition ${
								activeTab === "connected"
									? "bg-accent text-white"
									: "bg-[#1c1c1c] text-muted hover:bg-[#262626]"
							}`}
						>
							Connected ({connected.length})
						</button>
					</div>

					{/* Search */}
					<div className="relative">
						<Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-2" />
						<input
							type="text"
							placeholder="Search..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full bg-[#1c1c1c] text-white text-sm pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent placeholder-muted-2"
						/>
					</div>
				</div>

				{/* List */}
				<div className="max-h-[320px] overflow-y-auto px-5 py-4 space-y-2 custom-scrollbar">
					{filteredProviders.length === 0 && (
						<div className="text-center text-muted-2 text-xs py-10">
							No services found.
						</div>
					)}

					{filteredProviders.map((provider) => {
						const isConnected = connected.some(
							(c) => c.provider_id === provider.provider_id,
						);

						return (
							<div
								key={provider.provider_id}
								className="flex items-center justify-between p-3 rounded-xl bg-[#1a1a1a] hover:bg-[#202020] transition"
							>
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
										<img
											src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
											alt={provider.provider_name}
											className="object-contain w-6 h-6"
										/>
									</div>

									<span className="text-white text-sm">
										{provider.provider_name}
									</span>
								</div>

								<button
									onClick={() => onToggle(provider)}
									className={`px-3 py-1 text-xs rounded-full font-medium transition ${
										isConnected
											? "bg-green-600 text-white"
											: "bg-accent text-white hover:bg-accent-hover"
									}`}
								>
									{isConnected ? "✓" : "Connect"}
								</button>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
