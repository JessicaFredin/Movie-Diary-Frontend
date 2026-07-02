// "use client";

// import Image from "next/image";
// import { Camera } from "lucide-react";
// import { useRef } from "react";

// type Props = {
// 	src: string;
// 	onChange: (value: string) => void;
// };

// export default function ProfileAvatar({ src, onChange }: Props) {
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
// 		<div className="relative px-6 md:px-24">
// 			<div className="absolute">
// 				{/* OUTER wrapper (NO overflow hidden) */}
// 				<div className="relative w-24 h-24 rounded-full shadow-[0_0_15px_#FF414E]">
// 					{/* INNER wrapper (handles clipping only) */}
// 					<div className="w-full h-full rounded-full overflow-hidden">
// 						<Image
// 							src={src}
// 							alt="Profile avatar"
// 							fill
// 							className="object-cover rounded-full border-2 border-accent"
// 						/>
// 					</div>

// 					<button
// 						onClick={() => inputRef.current?.click()}
// 						className="absolute bottom-0 right-1 w-6 h-6 bg-foreground rounded-full flex items-center justify-center shadow-lg border border-accent"
// 					>
// 						<Camera className="w-4 h-4 text-surface-muted" />
// 					</button>

// 					<input
// 						type="file"
// 						accept="image/*"
// 						ref={inputRef}
// 						onChange={handleFile}
// 						className="hidden"
// 					/>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Props = {
	src?: string | null;
	onChange: (value: string) => void | Promise<void>;
};

function getInitials(nameOrEmail: string) {
	const clean = nameOrEmail.trim();

	if (clean.includes("@")) {
		return clean[0]?.toUpperCase() ?? "U";
	}

	const parts = clean.split(" ").filter(Boolean);

	if (parts.length >= 2) {
		return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
	}

	return clean.slice(0, 2).toUpperCase();
}

export default function ProfileAvatar({ src, onChange }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const supabase = useMemo(() => createClient(), []);

	const [displayName, setDisplayName] = useState("User");
	const [previewSrc, setPreviewSrc] = useState<string | null>(src ?? null);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		setPreviewSrc(src ?? null);
	}, [src]);

	useEffect(() => {
		async function loadUserName() {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) return;

			const { data: profile } = await supabase
				.from("profiles")
				.select("display_name")
				.eq("id", user.id)
				.single();

			setDisplayName(
				profile?.display_name ||
					user.user_metadata?.full_name ||
					user.user_metadata?.name ||
					user.email ||
					"User",
			);
		}

		loadUserName();
	}, [supabase]);

	async function handleFile(e: ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			alert("You need to be logged in to upload an avatar.");
			return;
		}

		setUploading(true);

		const fileExt = file.name.split(".").pop();
		const filePath = `${user.id}/avatar.${fileExt}`;

		const { error: uploadError } = await supabase.storage
			.from("avatars")
			.upload(filePath, file, {
				upsert: true,
			});

		if (uploadError) {
			setUploading(false);
			alert(uploadError.message);
			return;
		}

		const { data } = supabase.storage
			.from("avatars")
			.getPublicUrl(filePath);

		const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

		setPreviewSrc(publicUrl);
		await onChange(publicUrl);

		window.dispatchEvent(
			new CustomEvent("profile-avatar-updated", {
				detail: { avatarUrl: publicUrl },
			}),
		);

		setUploading(false);
	}

	return (
		<div className="relative px-6 md:px-24">
			<div className="absolute">
				<div className="relative w-24 h-24 rounded-full shadow-[0_0_15px_#FF414E]">
					<div className="w-full h-full rounded-full overflow-hidden border-2 border-accent">
						{previewSrc ? (
							<img
								src={previewSrc}
								alt="Profile avatar"
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center bg-surface-elevated text-white font-bold text-xl">
								{getInitials(displayName)}
							</div>
						)}
					</div>

					<button
						type="button"
						onClick={() => inputRef.current?.click()}
						disabled={uploading}
						className="absolute bottom-0 right-1 w-6 h-6 bg-foreground rounded-full flex items-center justify-center shadow-lg border border-accent disabled:opacity-50"
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