// "use client";

// import Image from "next/image";
// import { Camera } from "lucide-react";
// import { useRef } from "react";

// type Props = {
// 	src: string;
// 	onChange: (value: string) => void;
// };

// export default function ProfileBanner({ src, onChange }: Props) {
// 	const inputRef = useRef<HTMLInputElement>(null);

// 	function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
// 		const file = e.target.files?.[0];
// 		if (!file) return;

// 		const reader = new FileReader();
// 		reader.onload = () => {
// 			onChange(reader.result as string);
// 		};
// 		reader.readAsDataURL(file);
// 	}

// 	return (
// 		<div className="relative w-full h-40 md:h-72 lg:h-80">
// 			<Image
// 				src={src}
// 				alt="Profile banner"
// 				fill
// 				className="object-cover"
// 				priority
// 			/>

// 			{/* Edit Icon */}
// 			<button
// 				onClick={() => inputRef.current?.click()}
// 				className="absolute bottom-4 right-4 bg-foreground p-2 rounded-full flex items-center justify-center shadow-lg border border-accent"
// 			>
// 				<Camera className="w-4 h-4 text-surface-muted" />
// 			</button>

// 			<input
// 				type="file"
// 				accept="image/*"
// 				ref={inputRef}
// 				onChange={handleFile}
// 				className="hidden"
// 			/>
// 		</div>
// 	);
// }

"use client";

import { Camera } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

type Props = {
	src?: string | null;
	onChange: (value: string) => void | Promise<void>;
};

export default function ProfileBanner({ src, onChange }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const supabase = useMemo(() => createClient(), []);
	const [previewSrc, setPreviewSrc] = useState(
		src || "/images/profile-banner.jpg",
	);
	const [uploading, setUploading] = useState(false);

	async function handleFile(e: ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			alert("You need to be logged in to upload a banner.");
			return;
		}

		setUploading(true);

		const fileExt = file.name.split(".").pop();
		const filePath = `${user.id}/banner.${fileExt}`;

		const { error: uploadError } = await supabase.storage
			.from("banners")
			.upload(filePath, file, {
				upsert: true,
			});

		if (uploadError) {
			setUploading(false);
			alert(uploadError.message);
			return;
		}

		const { data } = supabase.storage
			.from("banners")
			.getPublicUrl(filePath);

		const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

		setPreviewSrc(publicUrl);
		await onChange(publicUrl);

		setUploading(false);
	}

	return (
		<div className="relative w-full h-40 md:h-72 lg:h-80">
			<Image
				src={previewSrc}
				alt="Profile banner"
				className="w-full h-full object-cover"
				fill
			/>

			<button
				type="button"
				onClick={() => inputRef.current?.click()}
				disabled={uploading}
				className="absolute bottom-4 right-4 bg-foreground p-2 rounded-full flex items-center justify-center shadow-lg border border-accent disabled:opacity-50"
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