"use client";

import { Icon } from "@iconify/react";

type Variant =
	| "pill" // big red full-width button
	| "icon" // white outlined circle with tooltip
	| "card" // small round button on MovieCard
	| "card-checked"; // green checked state (auto)

type Props = {
	onClick: () => void;
	isAdded?: boolean;
	variant?: Variant;
	disabled?: boolean;
};

export default function AddToDiaryButton({
	onClick,
	isAdded = false,
	variant = "card",
	disabled,
}: Props) {
	/* ---------- ICON ---------- */
	const icon = isAdded
		? "material-symbols:check-rounded"
		: "material-symbols:add-2-rounded";

	/* ---------- VARIANTS ---------- */
	if (variant === "pill") {
		return (
			<button
				onClick={(e) => {
					e.stopPropagation();
					onClick();
				}}
				disabled={isAdded || disabled}
				className={`w-full rounded-full py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition
					${isAdded ? "bg-green-600 cursor-default" : "bg-[#FF414E] hover:bg-[#e63946]"}
				`} 
			>
				<Icon icon={icon} className="w-4 h-4" />
				<span>{isAdded ? "In diary" : "Add to diary"}</span>
			</button>
		);
	}

	if (variant === "icon") {
		return (
			<button
				onClick={(e) => {
					e.stopPropagation();
					onClick();
				}}
				disabled={isAdded || disabled}
				className={`relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border transition group
					${
						isAdded
							? "bg-green-600 border-green-600 text-white"
							: "border-white text-white hover:bg-white"
					}
				`}
			>
				<Icon
					icon={icon}
					className={`w-6 h-6 transition
						${!isAdded && "group-hover:text-black"}
					`}
				/>

				<span className="hidden md:block absolute left-full ml-2 px-3 py-1 text-xs text-white bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
					{isAdded ? "Already in diary" : "Add to diary"}
				</span>
			</button>
		);
	}

	/* ---------- DEFAULT: CARD BUTTON ---------- */
	return (
		<button
			onClick={(e) => {
				e.stopPropagation();
				onClick();
                
			}}
			disabled={isAdded || disabled}
			title={isAdded ? "Already in diary" : "Add to diary"}
			className={`p-1.5 rounded-full text-white transition
				${isAdded ? "bg-green-600 cursor-default" : "bg-[#FF414E] hover:bg-[#e63946]"}
			`}
		>
			<Icon icon={icon} className="w-5 h-5" />
		</button>
	);
}
