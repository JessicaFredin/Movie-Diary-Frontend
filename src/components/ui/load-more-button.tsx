import { ChevronDown, Loader2 } from "lucide-react";

type Props = {
	onClick: () => void;
	loading?: boolean;
	disabled?: boolean;
	hasMore?: boolean;
	endText?: string;
};

export default function LoadMoreButton({
	onClick,
	loading = false,
	disabled = false,
	hasMore = true,
	endText = "You reached the end.",
}: Props) {
	if (!hasMore) {
		return (
			<div className="flex justify-center py-10">
				<p className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-muted">
					{endText}
				</p>
			</div>
		);
	}

	return (
		<div className="flex justify-center py-10">
			<button
				type="button"
				onClick={onClick}
				disabled={disabled || loading}
				className="group flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-7 text-sm font-bold text-white transition hover:border-accent/60 hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-60"
			>
				{loading ? (
					<>
						<Loader2 className="h-4 w-4 animate-spin" />
						Loading more...
					</>
				) : (
					<>
						Show more titles
						<ChevronDown className="h-4 w-4 transition group-hover:translate-y-0.5" />
					</>
				)}
			</button>
		</div>
	);
}
