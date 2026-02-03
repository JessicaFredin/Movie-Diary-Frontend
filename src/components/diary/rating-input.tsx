type Props = {
	value: number | null;
	onChange: (v: number | null) => void;
};

export default function RatingInput({ value, onChange }: Props) {
	return (
		<div>
			<p className="mb-2 text-sm text-gray-400">Your rating (optional)</p>
			<input
				type="number"
				min={1}
				max={10}
				step={0.5}
				placeholder="1–10"
				value={value ?? ""}
				onChange={(e) =>
					onChange(
						e.target.value === "" ? null : Number(e.target.value),
					)
				}
				className="w-full rounded-lg bg-gray-800 px-3 py-2 text-sm"
			/>
		</div>
	);
}
