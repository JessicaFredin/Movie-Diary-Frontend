"use client";

import { ArrowLeft, Globe, Lock, X } from "lucide-react";
import { List } from "@/types/list";
import AddToListModal from "@/components/lists/add-list-modal";
import { useRouter } from "next/navigation";

type Props = {
	list: List;
	goBack: () => void;
	showAdd: boolean;
	setShowAdd: (value: boolean) => void;
};

export default function ListDetails({
	list,
	goBack,
	showAdd,
	setShowAdd,
}: Props) {
	const router = useRouter();

	return (
		<div className="max-w-3xl mx-auto p-8 space-y-8">
			<button
				onClick={() => router.push("/lists")}
				className="flex items-center gap-2 text-muted hover:text-white"
			>
				<ArrowLeft size={18} />
				Back
			</button>

			<div>
				<h1 className="text-2xl font-semibold">{list.title}</h1>

				<p className="text-muted text-sm flex items-center gap-2">
					{list.isPublic ? <Globe size={14} /> : <Lock size={14} />}
					{list.isPublic ? "Public" : "Private"} • {list.items.length}{" "}
					titles
				</p>
			</div>

			{list.description && (
				<p className="text-muted">{list.description}</p>
			)}

			<button
				onClick={() => setShowAdd(true)}
				className="w-full bg-accent text-black font-medium py-3 rounded-xl hover:bg-accent-hover transition"
			>
				+ Add Movie or TV Show
			</button>

			<div className="space-y-4">
				{list.items.map((item) => (
					<div
						key={item.id}
						className="bg-surface rounded-2xl p-5 flex items-center justify-between shadow-lg"
					>
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 bg-muted/20 rounded-full flex items-center justify-center text-xl">
								{item.emoji}
							</div>

							<div>
								<p className="font-medium">{item.title}</p>

								<p className="text-sm text-muted">
									{item.year} • ⭐ {item.rating}
								</p>
							</div>
						</div>

						<button className="text-muted hover:text-white">
							<X size={18} />
						</button>
					</div>
				))}
			</div>

			{showAdd && <AddToListModal close={() => setShowAdd(false)} />}
		</div>
	);
}
