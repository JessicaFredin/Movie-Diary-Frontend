// "use client";

// import { Camera } from "lucide-react";
// import { useMemo, useRef, useState } from "react";
// import type { ChangeEvent } from "react";
// import { createClient } from "@/lib/supabase/client";
// import Image from "next/image";

// type Props = {
// 	src?: string | null;
// 	onChange: (value: string) => void | Promise<void>;
// };

// export default function ProfileBanner({ src, onChange }: Props) {
// 	const inputRef = useRef<HTMLInputElement>(null);
// 	const supabase = useMemo(() => createClient(), []);
// 	const [previewSrc, setPreviewSrc] = useState(
// 		src || "/images/profile-banner.jpg",
// 	);
// 	const [uploading, setUploading] = useState(false);

// 	async function handleFile(e: ChangeEvent<HTMLInputElement>) {
// 		const file = e.target.files?.[0];
// 		if (!file) return;

// 		const {
// 			data: { user },
// 		} = await supabase.auth.getUser();

// 		if (!user) {
// 			alert("You need to be logged in to upload a banner.");
// 			return;
// 		}

// 		setUploading(true);

// 		const fileExt = file.name.split(".").pop();
// 		const filePath = `${user.id}/banner.${fileExt}`;

// 		const { error: uploadError } = await supabase.storage
// 			.from("banners")
// 			.upload(filePath, file, {
// 				upsert: true,
// 			});

// 		if (uploadError) {
// 			setUploading(false);
// 			alert(uploadError.message);
// 			return;
// 		}

// 		const { data } = supabase.storage
// 			.from("banners")
// 			.getPublicUrl(filePath);

// 		const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

// 		setPreviewSrc(publicUrl);
// 		await onChange(publicUrl);

// 		setUploading(false);
// 	}

// 	return (
// 		<div className="relative w-full h-40 md:h-72 lg:h-80">
// 			<Image
// 				src={previewSrc}
// 				alt="Profile banner"
// 				className="w-full h-full object-cover"
// 				fill
// 			/>

// 			<button
// 				type="button"
// 				onClick={() => inputRef.current?.click()}
// 				disabled={uploading}
// 				className="absolute bottom-4 right-4 bg-foreground p-2 rounded-full flex items-center justify-center shadow-lg border border-accent disabled:opacity-50"
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
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

type Props = {
	src?: string | null;
	onChange: (value: string) => void | Promise<void>;
};

const DEFAULT_BANNER = "/images/profile-banner.jpg";

export default function ProfileBanner({ src, onChange }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const supabase = useMemo(() => createClient(), []);

	const [previewSrc, setPreviewSrc] = useState(src || DEFAULT_BANNER);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		setPreviewSrc(src || DEFAULT_BANNER);
	}, [src]);

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
		<div className="relative h-52 w-full overflow-hidden md:h-72 lg:h-[330px]">
			<Image
				src={previewSrc}
				alt="Profile banner"
				fill
				priority
				className="object-cover"
			/>

			<div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />

			<button
				type="button"
				onClick={() => inputRef.current?.click()}
				disabled={uploading}
				className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-black disabled:opacity-50"
			>
				<Camera className="h-4 w-4" />
				<span>{uploading ? "Uploading..." : "Change cover"}</span>
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