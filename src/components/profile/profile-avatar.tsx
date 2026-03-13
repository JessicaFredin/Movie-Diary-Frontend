// import Image from "next/image";

// export default function ProfileAvatar({ src }: { src: string }) {
// 	return (
// 		<div className="relative px-6 md:px-24">
// 			{/* Avatar */}
// 			<div className="absolute">
// 				<div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center">
// 					<Image
// 						src={src}
// 						alt="Profile avatar"
// 						fill
// 						className="object-cover rounded-full border-2 border-accent shadow-[0_0_15px_#FF414E]"
// 					/>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

"use client";

import Image from "next/image";
import { Camera } from "lucide-react";
import { useRef } from "react";

type Props = {
	src: string;
	onChange: (value: string) => void;
};

export default function ProfileAvatar({ src, onChange }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);

	function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			onChange(reader.result as string);
		};
		reader.readAsDataURL(file);
	}

	return (
		<div className="relative px-6 md:px-24">
			<div className="absolute">
				{/* OUTER wrapper (NO overflow hidden) */}
				<div className="relative w-24 h-24 rounded-full shadow-[0_0_15px_#FF414E]">
					{/* INNER wrapper (handles clipping only) */}
					<div className="w-full h-full rounded-full overflow-hidden">
						<Image
							src={src}
							alt="Profile avatar"
							fill
							className="object-cover rounded-full border-2 border-accent"
						/>
					</div>

					<button
						onClick={() => inputRef.current?.click()}
						className="absolute bottom-0 right-1 w-6 h-6 bg-foreground rounded-full flex items-center justify-center shadow-lg border border-accent"
					>
						<Camera className="w-4 h-4 text-surface-muted" />
					</button>

					<input
						type="file"
						accept="image/*"
						ref={inputRef}
						onChange={handleFile}
						className="hidden"
					/>
				</div>
			</div>
		</div>
	);
}
