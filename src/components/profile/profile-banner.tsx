// import Image from "next/image";

// export default function ProfileBanner({ src }: { src: string }) {
// 	return (
// 		<div className="relative w-full h-40 md:h-72 lg:h-80">
// 			<Image
// 				src={src}
// 				alt="Profile banner"
// 				fill
// 				className="object-cover"
// 				priority
// 			/>
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

export default function ProfileBanner({ src, onChange }: Props) {
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
		<div className="relative w-full h-40 md:h-72 lg:h-80">
			<Image
				src={src}
				alt="Profile banner"
				fill
				className="object-cover"
				priority
			/>

			{/* Edit Icon */}
			<button
				onClick={() => inputRef.current?.click()}
				className="absolute bottom-4 right-4 bg-foreground p-2 rounded-full flex items-center justify-center shadow-lg border border-accent"
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
	);
}