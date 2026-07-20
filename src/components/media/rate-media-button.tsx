"use client";

import { Star, X, Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type MediaType = "movie" | "tv";

type Props = {
	mediaId: number;
	mediaType: MediaType;
	title: string;
	onRated?: () => void;
};

type UserRatingRow = {
	rating: number;
};

const stars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function clampRating(value: number) {
	const rounded = Math.round(value * 2) / 2;
	return Math.min(10, Math.max(0.5, rounded));
}

function getStarFill(starNumber: number, rating: number) {
	if (rating >= starNumber) return "100%";
	if (rating >= starNumber - 0.5) return "50%";
	return "0%";
}

export default function RateMediaButton({
	mediaId,
	mediaType,
	title,
	onRated,
}: Props) {
	const supabase = useMemo(() => createClient(), []);

	const [open, setOpen] = useState(false);
	const [rating, setRating] = useState(8);
	const [hoverRating, setHoverRating] = useState<number | null>(null);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");

	const previewRating = hoverRating ?? rating;

	useEffect(() => {
		if (!open) return;

		async function loadMyRating() {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) return;

			const { data, error } = await supabase
				.from("user_ratings")
				.select("rating")
				.eq("user_id", user.id)
				.eq("media_id", String(mediaId))
				.eq("media_type", mediaType)
				.maybeSingle();

			if (error) {
				console.error("Failed to load my rating:", error.message);
				return;
			}

			const row = data as UserRatingRow | null;

			if (typeof row?.rating === "number") {
				setRating(clampRating(row.rating));
			}
		}

		loadMyRating();
	}, [open, mediaId, mediaType, supabase]);

	async function saveRating() {
		setMessage("");

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			setMessage("You need to log in first to rate this.");
			return;
		}

		setSaving(true);

		const { error } = await supabase.from("user_ratings").upsert(
			{
				user_id: user.id,
				media_id: String(mediaId),
				media_type: mediaType,
				rating,
				updated_at: new Date().toISOString(),
			},
			{
				onConflict: "user_id,media_id,media_type",
			},
		);

		setSaving(false);

		if (error) {
			setMessage(error.message);
			return;
		}

		onRated?.();
		setOpen(false);
	}

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="flex items-center justify-center gap-2 rounded-full border border-surface-neutral px-4 py-2 text-sm transition hover:border-accent"
			>
				<Star className="h-4 w-4" />
				<span>Rate</span>
			</button>

			{open && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
					<div className="w-full max-w-[560px] rounded-3xl border border-white/10 bg-[#15151a] p-7 shadow-2xl">
						<div className="flex items-start justify-between gap-4">
							<div>
								<h2 className="text-2xl font-bold text-white">
									Rate this title
								</h2>

								<p className="mt-1 line-clamp-1 text-sm text-muted">
									{title}
								</p>
							</div>

							<button
								type="button"
								onClick={() => setOpen(false)}
								disabled={saving}
								className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-white disabled:opacity-50"
								aria-label="Close rating modal"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<div className="mt-8">
							<div
								className="flex justify-center gap-1.5"
								onMouseLeave={() => setHoverRating(null)}
							>
								{stars.map((starNumber) => {
									const leftValue = starNumber - 0.5;
									const rightValue = starNumber;
									const fillWidth = getStarFill(
										starNumber,
										previewRating,
									);

									return (
										<div
											key={starNumber}
											className="relative h-10 w-10"
										>
											<Star className="absolute inset-0 h-10 w-10 fill-transparent text-white/20" />

											<div
												className="absolute inset-0 overflow-hidden"
												style={{ width: fillWidth }}
											>
												<Star className="h-10 w-10 fill-yellow-400 text-yellow-400" />
											</div>

											<button
												type="button"
												onMouseEnter={() =>
													setHoverRating(leftValue)
												}
												onFocus={() =>
													setHoverRating(leftValue)
												}
												onClick={() =>
													setRating(leftValue)
												}
												className="absolute left-0 top-0 z-10 h-full w-1/2 cursor-pointer"
												aria-label={`Rate ${leftValue} out of 10`}
											/>

											<button
												type="button"
												onMouseEnter={() =>
													setHoverRating(rightValue)
												}
												onFocus={() =>
													setHoverRating(rightValue)
												}
												onBlur={() =>
													setHoverRating(null)
												}
												onClick={() =>
													setRating(rightValue)
												}
												className="absolute right-0 top-0 z-10 h-full w-1/2 cursor-pointer"
												aria-label={`Rate ${rightValue} out of 10`}
											/>
										</div>
									);
								})}
							</div>

							<div className="mt-4 text-center">
								<span className="text-3xl font-black text-white">
									{previewRating.toFixed(1)}
								</span>

								<span className="ml-1 text-base font-semibold text-muted">
									/ 10
								</span>
							</div>
						</div>

						{message && (
							<p className="mt-5 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
								{message}
							</p>
						)}

						<div className="mt-8 flex justify-end gap-3">
							<button
								type="button"
								onClick={() => setOpen(false)}
								disabled={saving}
								className="flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-muted transition hover:text-white disabled:opacity-50"
							>
								Cancel
							</button>

							<button
								type="button"
								onClick={saveRating}
								disabled={saving}
								className="flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
							>
								<Check className="h-4 w-4" />
								{saving ? "Saving..." : "Save rating"}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
