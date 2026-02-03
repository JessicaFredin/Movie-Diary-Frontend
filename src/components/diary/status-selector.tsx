type Props = {
	value: "watching" | "completed" | "planned";
	onChange: (v: Props["value"]) => void;
};

const options: Props["value"][] = ["watching", "completed", "planned"];

export default function StatusSelector({ value, onChange }: Props) {
	return (
		<div>
			<p className="mb-2 text-sm text-gray-400">Status</p>
			<div className="flex gap-2">
				{options.map((opt) => (
					<button
						key={opt}
						onClick={() => onChange(opt)}
						className={`flex-1 rounded-full py-2 text-sm capitalize transition ${
							value === opt
								? "bg-white text-black"
								: "bg-gray-800 text-gray-300"
						}`}
					>
						{opt}
					</button>
				))}
			</div>
		</div>
	);
}
