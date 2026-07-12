"use client";

import { useEffect, useState } from "react";
import { Lock, Save } from "lucide-react";

type Props = {
	displayName: string;
	bio: string;
	isPrivateDiary: boolean;
	onSave: (value: {
		displayName: string;
		bio: string;
		isPrivateDiary: boolean;
	}) => void | Promise<void>;
};

export default function ProfileInfo({
	displayName,
	bio,
	isPrivateDiary,
	onSave,
}: Props) {
	const [draftName, setDraftName] = useState(displayName);
	const [draftBio, setDraftBio] = useState(bio);
	const [draftPrivate, setDraftPrivate] = useState(isPrivateDiary);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		setDraftName(displayName);
	}, [displayName]);

	useEffect(() => {
		setDraftBio(bio);
	}, [bio]);

	useEffect(() => {
		setDraftPrivate(isPrivateDiary);
	}, [isPrivateDiary]);

	async function save() {
		setSaving(true);

		await onSave({
			displayName: draftName.trim() || displayName,
			bio: draftBio,
			isPrivateDiary: draftPrivate,
		});

		setSaving(false);
	}

	return (
		<div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
			<div className="grid gap-5 md:grid-cols-2">
				<div>
					<label className="text-xs uppercase tracking-wide text-muted">
						Display name
					</label>

					<input
						value={draftName}
						onChange={(e) => setDraftName(e.target.value)}
						className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none focus:border-accent"
					/>
				</div>
			</div>

			<div className="mt-5">
				<label className="text-xs uppercase tracking-wide text-muted">
					Bio
				</label>

				<textarea
					value={draftBio}
					onChange={(e) => setDraftBio(e.target.value)}
					maxLength={280}
					placeholder="A little about you and your taste in movies..."
					className="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm leading-6 text-white outline-none placeholder:text-muted focus:border-accent"
				/>

				<p className="mt-2 text-right text-xs text-muted">
					{draftBio.length}/280
				</p>
			</div>

			<div className="mt-5 flex items-center justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
				<div className="flex gap-3">
					<Lock className="mt-1 h-5 w-5 text-white" />

					<div>
						<h3 className="font-bold text-white">Private diary</h3>
						<p className="text-sm text-muted">
							Only friends you approve can see what you have been
							watching.
						</p>
					</div>
				</div>

				<button
					type="button"
					onClick={() => setDraftPrivate((value) => !value)}
					className={`relative h-9 w-16 shrink-0 rounded-full transition ${
						draftPrivate ? "bg-accent" : "bg-white/20"
					}`}
					aria-label="Toggle private diary"
				>
					<span
						className={`absolute top-1 h-7 w-7 rounded-full bg-white transition ${
							draftPrivate ? "left-8" : "left-1"
						}`}
					/>
				</button>
			</div>

			<button
				type="button"
				onClick={save}
				disabled={saving}
				className="mt-5 flex items-center gap-3 rounded-full bg-accent px-7 py-3 font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover disabled:opacity-50"
			>
				<Save className="h-5 w-5" />
				{saving ? "Saving..." : "Save changes"}
			</button>
		</div>
	);
}
