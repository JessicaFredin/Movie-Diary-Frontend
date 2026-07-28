"use client";

import { Star, X, Check } from "lucide-react";
import {
	useCallback,
	useEffect,
	useMemo,
	useState,
	type MouseEvent,
	type TouchEvent,
} from "react";
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

type StarFill = "empty" | "half" | "full";

const stars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function clampRating(value: number): number {
	const rounded = Math.round(value * 2) / 2;
	return Math.min(10, Math.max(0.5, rounded));
}

function getStarFill(starNumber: number, rating: number): StarFill {
	if (rating >= starNumber) return "full";
	if (rating >= starNumber - 0.5) return "half";
	return "empty";
}

function getRatingFromPointer(
	clientX: number,
	element: HTMLButtonElement,
	starIndex: number,
): number {
	const rect = element.getBoundingClientRect();
	const x = clientX - rect.left;
	const isLeftHalf = x < rect.width / 2;

	return clampRating(starIndex + (isLeftHalf ? 0.5 : 1));
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
	const [hasRated, setHasRated] = useState(false);
	const [hoverRating, setHoverRating] = useState<number | null>(null);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");

	const previewRating = hoverRating ?? rating;

	const loadMyRating = useCallback(async (): Promise<void> => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			setHasRated(false);
			return;
		}

		const { data, error } = await supabase
			.from("user_ratings")
			.select("rating")
			.eq("user_id", user.id)
			.eq("media_id", String(mediaId))
			.eq("media_type", mediaType)
			.maybeSingle();

		if (error) {
			console.error("Failed to load my rating:", error.message);
			setHasRated(false);
			return;
		}

		const row = data as UserRatingRow | null;

		if (typeof row?.rating === "number") {
			setRating(clampRating(row.rating));
			setHasRated(true);
		} else {
			setHasRated(false);
		}
	}, [mediaId, mediaType, supabase]);

	useEffect(() => {
		void loadMyRating();
	}, [loadMyRating]);

	useEffect(() => {
		if (!open) return;

		void loadMyRating();
	}, [open, loadMyRating]);

	async function saveRating(): Promise<void> {
		setMessage("");

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			setMessage("You need to log in first to rate this.");
			return;
		}

		setSaving(true);

		const finalRating = clampRating(rating);

		const { error } = await supabase.from("user_ratings").upsert(
			{
				user_id: user.id,
				media_id: String(mediaId),
				media_type: mediaType,
				rating: finalRating,
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

		setRating(finalRating);
		setHasRated(true);
		onRated?.();
		setOpen(false);
	}

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className={`flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
					hasRated
						? "border-yellow-400/40 bg-yellow-400/10 text-white hover:border-yellow-400"
						: "border-surface-neutral hover:border-accent"
				}`}
			>
				<Star
					className={`h-4 w-4 ${
						hasRated
							? "fill-yellow-400 text-yellow-400"
							: "text-white"
					}`}
				/>
				<span>{hasRated ? "Rated" : "Rate"}</span>
			</button>

			{open && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
					<div className="w-full max-w-[560px] rounded-3xl border border-white/10 bg-[#15151a] px-5 py-6 shadow-2xl sm:p-7">
						<div className="flex items-start justify-between gap-4">
							<div>
								<h2 className="text-xl font-bold text-white sm:text-2xl">
									Rate this title
								</h2>

								<p className="mt-1 line-clamp-1 text-xs text-muted sm:text-sm">
									{title}
								</p>
							</div>

							<button
								type="button"
								onClick={() => setOpen(false)}
								disabled={saving}
								className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-white disabled:opacity-50 sm:h-9 sm:w-9"
								aria-label="Close rating modal"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						<div className="mt-7 sm:mt-8">
							<div
								className="flex w-full items-center justify-center gap-1 sm:gap-1.5"
								onMouseLeave={() => setHoverRating(null)}
							>
								{stars.map((starNumber, index) => {
									const fill = getStarFill(
										starNumber,
										previewRating,
									);

									return (
										<button
											key={starNumber}
											type="button"
											onMouseMove={(
												event: MouseEvent<HTMLButtonElement>,
											) => {
												setHoverRating(
													getRatingFromPointer(
														event.clientX,
														event.currentTarget,
														index,
													),
												);
											}}
											onClick={(
												event: MouseEvent<HTMLButtonElement>,
											) => {
												setRating(
													getRatingFromPointer(
														event.clientX,
														event.currentTarget,
														index,
													),
												);
											}}
											onTouchStart={(
												event: TouchEvent<HTMLButtonElement>,
											) => {
												const touch =
													event.touches.item(0);

												if (!touch) return;

												setRating(
													getRatingFromPointer(
														touch.clientX,
														event.currentTarget,
														index,
													),
												);
											}}
											className="relative flex h-6 w-6 shrink-0 items-center justify-center transition hover:scale-110 sm:h-10 sm:w-10"
											aria-label={`Rate ${starNumber} out of 10`}
										>
											<Star className="absolute h-6 w-6 text-white/25 sm:h-10 sm:w-10" />

											<span
												className={`absolute left-0 top-0 h-6 overflow-hidden sm:h-10 ${
													fill === "full"
														? "w-full"
														: fill === "half"
															? "w-1/2"
															: "w-0"
												}`}
											>
												<Star className="h-6 w-6 fill-yellow-400 text-yellow-400 sm:h-10 sm:w-10" />
											</span>
										</button>
									);
								})}
							</div>

							<div className="mt-4 text-center">
								<span className="text-3xl font-black text-white sm:text-4xl">
									{previewRating.toFixed(1)}
								</span>

								<span className="ml-1 text-sm font-semibold text-muted sm:text-base">
									/ 10
								</span>
							</div>
						</div>

						{message && (
							<p className="mt-5 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
								{message}
							</p>
						)}

						<div className="mt-7 flex items-center justify-end gap-3 sm:mt-8">
							<button
								type="button"
								onClick={() => setOpen(false)}
								disabled={saving}
								className="flex h-11 items-center justify-center rounded-full px-4 text-xs font-semibold text-muted transition hover:text-white disabled:opacity-50 sm:h-12 sm:px-6 sm:text-sm"
							>
								Cancel
							</button>

							<button
								type="button"
								onClick={saveRating}
								disabled={saving}
								className="flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 text-xs font-bold text-white transition hover:bg-accent-hover disabled:opacity-50 sm:h-12 sm:px-7 sm:text-sm"
							>
								<Check className="h-4 w-4" />
								{saving
									? "Saving..."
									: hasRated
										? "Update rating"
										: "Save rating"}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
