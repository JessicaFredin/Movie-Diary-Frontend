"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

type Props = {
	src?: string | null;
	name: string;
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

	return clean.slice(0, 2).toUpperCase() || "U";
}

export default function ProfileAvatar({ src, name, onChange }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const supabase = createClient();

	const [previewSrc, setPreviewSrc] = useState<string | null>(src ?? null);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		setPreviewSrc(src ?? null);
	}, [src]);

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
		<div className="group relative h-32 w-32 shrink-0 rounded-full shadow-[0_0_22px_#FF414E] md:h-40 md:w-40">
			<div className="h-full w-full overflow-hidden rounded-full border-4 border-accent bg-slate-600">
				{previewSrc ? (
					<Image
						src={previewSrc}
						alt="Profile avatar"
						width={180}
						height={180}
						className="h-full w-full object-cover"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-slate-500 text-5xl font-bold text-white md:text-6xl">
						{getInitials(name)}
					</div>
				)}
			</div>

			<button
				type="button"
				onClick={() => inputRef.current?.click()}
				disabled={uploading}
				className="absolute inset-0 flex items-center justify-center rounded-full bg-black/35 text-white opacity-0 transition group-hover:opacity-100 disabled:opacity-60"
				title="Change profile picture"
			>
				<div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/70 ring-1 ring-white/20">
					<Camera className="h-5 w-5" />
				</div>
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
