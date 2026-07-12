"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

type Props = {
	src?: string | null;
	displayName?: string;
	editable?: boolean;
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

export default function ProfileAvatar({
	src,
	displayName = "User",
	editable = false,
	onChange,
}: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const supabase = useMemo(() => createClient(), []);

	const [previewSrc, setPreviewSrc] = useState<string | null>(src ?? null);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		setPreviewSrc(src ?? null);
	}, [src]);

	async function handleFile(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
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
		<div className="group/avatar relative h-36 w-36 shrink-0 overflow-hidden rounded-full border-4 border-accent bg-slate-500 shadow-[0_0_24px_#FF414E] md:h-44 md:w-44">
			{previewSrc ? (
				<Image
					src={previewSrc}
					alt={displayName}
					width={176}
					height={176}
					className="h-full w-full object-cover"
				/>
			) : (
				<div className="flex h-full w-full items-center justify-center text-6xl text-white">
					{getInitials(displayName)}
				</div>
			)}

			{editable && (
				<>
					<button
						type="button"
						onClick={() => inputRef.current?.click()}
						disabled={uploading}
						className="absolute inset-0 flex items-center justify-center bg-black/45 text-white opacity-0 transition group-hover/avatar:opacity-100 disabled:opacity-50"
						aria-label="Change profile picture"
					>
						<Camera className="h-8 w-8" />
					</button>

					<input
						type="file"
						accept="image/*"
						ref={inputRef}
						onChange={handleFile}
						className="hidden"
					/>
				</>
			)}
		</div>
	);
}
