"use client";

import { Camera } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type Props = {
	src?: string | null;
	editable?: boolean;
	onChange: (value: string) => void | Promise<void>;
};

export default function ProfileBanner({
	src,
	editable = false,
	onChange,
}: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const supabase = useMemo(() => createClient(), []);

	const [previewSrc, setPreviewSrc] = useState(
		src || "/images/profile-banner.jpg",
	);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		setPreviewSrc(src || "/images/profile-banner.jpg");
	}, [src]);

	async function handleFile(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) return;

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			alert("You need to be logged in to upload a banner.");
			return;
		}

		try {
			setUploading(true);

			const fileExt = file.name.split(".").pop() || "jpg";
			const filePath = `${user.id}/banner.${fileExt}`;

			const { error: uploadError } = await supabase.storage
				.from("banners")
				.upload(filePath, file, {
					upsert: true,
				});

			if (uploadError) {
				alert(uploadError.message);
				return;
			}

			const { data } = supabase.storage
				.from("banners")
				.getPublicUrl(filePath);

			const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

			setPreviewSrc(publicUrl);
			await onChange(publicUrl);
		} finally {
			setUploading(false);

			if (inputRef.current) {
				inputRef.current.value = "";
			}
		}
	}

	return (
		<div className="group/banner relative h-[430px] w-full overflow-hidden">
			<Image
				src={previewSrc}
				alt="Profile banner"
				className="object-cover"
				fill
				priority
			/>

			<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />

			{editable && (
				<>
					<button
						type="button"
						onClick={() => inputRef.current?.click()}
						disabled={uploading}
						className="
							absolute inset-0
							flex items-center justify-center
							bg-black/0 text-white
							opacity-0 transition
							hover:bg-black/45 hover:opacity-100
							disabled:cursor-not-allowed disabled:opacity-50
						"
						aria-label="Change cover photo"
					>
						<div className="flex flex-col items-center gap-3 rounded-2xl bg-black/50 px-6 py-5 backdrop-blur-md">
							<Camera className="h-9 w-9" />

							<span className="text-sm font-bold">
								{uploading
									? "Uploading..."
									: "Change cover photo"}
							</span>
						</div>
					</button>

					<input
						ref={inputRef}
						type="file"
						accept="image/*"
						onChange={handleFile}
						className="hidden"
					/>
				</>
			)}
		</div>
	);
}
