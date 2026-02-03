"use client";

import { useState } from "react";

type Props = {
	text: string;
	color?: string;
};

export default function ExpandableText({ text, color }: Props) {
	const [expanded, setExpanded] = useState(false);

	const textColor = color || "text-gray-300";


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
				className={`text-sm md:text-base ${textColor} leading-relaxed ${
					expanded ? "" : "line-clamp-3"
				}`}
			>
				{text}
			</p>

			<button
				type="button"
				onClick={() => setExpanded((v) => !v)}
				className="self-start text-sm font-medium text-white"
			>
				{expanded ? "See less" : "See more"}
			</button>
		</div>
	);
}
