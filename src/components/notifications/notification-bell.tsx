"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function NotificationBell() {
	const supabase = useMemo(() => createClient(), []);
	const [count, setCount] = useState(0);

	const loadCount = useCallback(async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			setCount(0);
			return;
		}

		const { count: pendingCount, error } = await supabase
			.from("diary_access_requests")
			.select("id", { count: "exact", head: true })
			.eq("owner_id", user.id)
			.eq("status", "pending");

		if (error) {
			console.error("Failed to load notifications:", error.message);
			setCount(0);
			return;
		}

		setCount(pendingCount ?? 0);
	}, [supabase]);

	useEffect(() => {
		loadCount();

		const onFocus = () => loadCount();
		window.addEventListener("focus", onFocus);

		return () => {
			window.removeEventListener("focus", onFocus);
		};
	}, [loadCount]);

	return (
		<Link
			href="/notifications"
			className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-white/10"
			title="Notifications"
		>
			<Bell className="h-5 w-5 text-white" />

			{count > 0 && (
				<span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-white">
					{count > 9 ? "9+" : count}
				</span>
			)}
		</Link>
	);
}
