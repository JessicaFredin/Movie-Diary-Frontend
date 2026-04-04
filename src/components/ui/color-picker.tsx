"use client";

export default function ColorPicker() {
	const colors = [
		"#ff414e",
		"#facc15",
		"#38bdf8",
		"#a855f7",
		"#22c55e",
		"#fb923c",
	];

	return (
		<div className="mb-4">
			<p className="text-sm text-muted mb-2">Cover Color</p>

			<div className="flex gap-3">
				{colors.map((c) => (
					<div
						key={c}
						className="w-8 h-8 rounded-full border-2 border-white"
						style={{ background: c }}
					/>
				))}
			</div>
		</div>
	);
}
