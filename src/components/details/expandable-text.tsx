"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
	text: string;
	color?: string;
};

export default function ExpandableText({ text, color }: Props) {
	const [expanded, setExpanded] = useState(false);
	const [showButton, setShowButton] = useState(false);
	const textRef = useRef<HTMLParagraphElement>(null);

	const textColor = color || "text-muted";

	useLayoutEffect(() => {
		const checkOverflow = () => {
			const el = textRef.current;
			if (!el) return;

			// Force clamp for measurement
			el.classList.add("line-clamp-3");

			const isOverflowing = el.scrollHeight > el.clientHeight;
			setShowButton(isOverflowing);

			// Restore state
			if (expanded) {
				el.classList.remove("line-clamp-3");
			}
		};

		// Run after paint
		requestAnimationFrame(checkOverflow);

		window.addEventListener("resize", checkOverflow);
		return () => window.removeEventListener("resize", checkOverflow);
	}, [text, expanded]);

	if (!text) {
		return (
			<p className={`text-sm md:text-base ${textColor}`}>
				No description available.
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-1">
			<p
				ref={textRef}
				className={`text-sm md:text-base ${textColor} leading-relaxed ${
					expanded ? "" : "line-clamp-3"
				}`}
			>
				{text}
			</p>

			{showButton && (
				<button
					type="button"
					onClick={() => setExpanded((v) => !v)}
					className="flex items-center gap-1 text-sm font-medium text-accent"
				>
					<span>{expanded ? "See less" : "See more"}</span>
					{expanded ? (
						<ChevronUp className="w-4 h-4" />
					) : (
						<ChevronDown className="w-4 h-4" />
					)}
				</button>
			)}
		</div>
	);
}
