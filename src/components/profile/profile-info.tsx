// "use client";

// import { useState } from "react";
// import { Pencil } from "lucide-react";
// import StreamingServices from "./streaming-services";

// type Props = {
// 	bio: string;
// 	onChange: (value: string) => void;
// };

// export default function ProfileInfo({ bio, onChange }: Props) {
// 	const [editing, setEditing] = useState(false);
// 	const [draft, setDraft] = useState(bio);

// 	function save() {
// 		onChange(draft);
// 		setEditing(false);
// 	}

// 	return (
// 		<div className="mt-16 px-6 md:px-24 relative">
// 			<h2 className="text-2xl font-bold">Jane Doe</h2>
// 			<StreamingServices />

// 			{!editing ? (
// 				<div className="relative mt-4 max-w-lg">
// 					<p className="text-muted text-sm pr-4">
// 						{bio}
// 					</p>

// 					<button
// 						onClick={() => setEditing(true)}
// 						className="absolute bottom-0 -right-2 w-6 h-6 bg-foreground rounded-full flex items-center justify-center shadow-lg border border-accent"
// 					>
// 						<Pencil className="w-4 h-4 text-surface-muted" />
// 					</button>
// 				</div>
// 			) : (
// 				<div className="mt-4 space-y-2">
// 					<textarea
// 						value={draft}
// 						onChange={(e) => setDraft(e.target.value)}
// 						className="w-full p-2 rounded bg-surface-elevated text-sm"
// 						rows={4}
// 					/>

// 					<div className="flex gap-2">
// 						<button
// 							onClick={save}
// 							className="bg-accent hover:bg-accent-hover px-4 py-1 rounded-full text-sm"
// 						>
// 							Save
// 						</button>
// 						<button
// 							onClick={() => setEditing(false)}
// 							className="bg-surface-neutral hover:bg-surface-elevated px-4 py-1 rounded-full text-sm"
// 						>
// 							Cancel
// 						</button>
// 					</div>
// 				</div>
// 			)}
// 		</div>
// 	);
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import StreamingServices from "./streaming-services";

type Props = {
	bio: string;
	onChange: (value: string) => void | Promise<void>;
};

export default function ProfileInfo({ bio, onChange }: Props) {
	const supabase = useMemo(() => createClient(), []);

	const [displayName, setDisplayName] = useState("User");
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(bio);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		setDraft(bio);
	}, [bio]);

	useEffect(() => {
		async function loadProfileName() {
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

		loadProfileName();
	}, [supabase]);

	async function save() {
		setSaving(true);
		await onChange(draft);
		setSaving(false);
		setEditing(false);
	}

	return (
		<div className="mt-16 px-6 md:px-24 relative">
			<h2 className="text-2xl font-bold">{displayName}</h2>

			<StreamingServices />

			{!editing ? (
				<div className="relative mt-4 max-w-lg">
					<p className="text-muted text-sm pr-4">
						{bio || "You haven’t added a bio yet."}
					</p>

					<button
						type="button"
						onClick={() => setEditing(true)}
						className="absolute bottom-0 -right-2 w-6 h-6 bg-foreground rounded-full flex items-center justify-center shadow-lg border border-accent"
					>
						<Pencil className="w-4 h-4 text-surface-muted" />
					</button>
				</div>
			) : (
				<div className="mt-4 space-y-2 max-w-lg">
					<textarea
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						className="w-full p-2 rounded bg-surface-elevated text-sm"
						rows={4}
					/>

					<div className="flex gap-2">
						<button
							type="button"
							onClick={save}
							disabled={saving}
							className="bg-accent hover:bg-accent-hover px-4 py-1 rounded-full text-sm disabled:opacity-50"
						>
							{saving ? "Saving..." : "Save"}
						</button>

						<button
							type="button"
							onClick={() => {
								setDraft(bio);
								setEditing(false);
							}}
							className="bg-surface-neutral hover:bg-surface-elevated px-4 py-1 rounded-full text-sm"
						>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	);
}