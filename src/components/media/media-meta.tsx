"use client";

import { Calendar, Clock } from "lucide-react";

interface Props {
	year: string | number;
	runtimeLabel: string;
}

export default function MediaMeta({ year, runtimeLabel }: Props) {
	return (
		<div className="flex flex-wrap items-center gap-6 text-sm text-muted">
			<div className="flex items-center gap-2">
				<Calendar className="w-4 h-4" />
				<span>{year}</span>
			</div>

			<div className="flex items-center gap-2">
				<Clock className="w-4 h-4" />
				<span>{runtimeLabel}</span>
			</div>
		</div>
	);
}
