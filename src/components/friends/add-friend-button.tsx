"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Clock, UserCheck, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type FriendStatus =
	| "loading"
	| "self"
	| "none"
	| "pending_sent"
	| "pending_received"
	| "friends";

type Variant = "default" | "icon";

type Props = {
	profileId: string;
	variant?: Variant;
	onChanged?: () => void | Promise<void>;
};

type FriendRequestRow = {
	id: number;
	status: "pending" | "accepted" | "declined";
};

export default function AddFriendButton({
	profileId,
	variant = "default",
	onChanged,
}: Props) {
	const supabase = useMemo(() => createClient(), []);

	const [status, setStatus] = useState<FriendStatus>("loading");
	const [loading, setLoading] = useState(false);

	const loadStatus = useCallback(async () => {
		setStatus("loading");

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			setStatus("none");
			return;
		}

		if (user.id === profileId) {
			setStatus("self");
			return;
		}

		const { data: friendship } = await supabase
			.from("friendships")
			.select("id")
			.eq("user_id", user.id)
			.eq("friend_id", profileId)
			.maybeSingle();

		if (friendship) {
			setStatus("friends");
			return;
		}

		const { data: sentRequest } = await supabase
			.from("friend_requests")
			.select("id, status")
			.eq("sender_id", user.id)
			.eq("receiver_id", profileId)
			.eq("status", "pending")
			.maybeSingle();

		if (sentRequest) {
			setStatus("pending_sent");
			return;
		}

		const { data: receivedRequest } = await supabase
			.from("friend_requests")
			.select("id, status")
			.eq("sender_id", profileId)
			.eq("receiver_id", user.id)
			.eq("status", "pending")
			.maybeSingle();

		if (receivedRequest) {
			setStatus("pending_received");
			return;
		}

		setStatus("none");
	}, [profileId, supabase]);

	useEffect(() => {
		loadStatus();
	}, [loadStatus]);

	async function sendFriendRequest() {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			alert("You need to log in first.");
			return;
		}

		setLoading(true);

		const { error } = await supabase.from("friend_requests").upsert(
			{
				sender_id: user.id,
				receiver_id: profileId,
				status: "pending",
				updated_at: new Date().toISOString(),
			},
			{
				onConflict: "sender_id,receiver_id",
			},
		);

		if (error) {
			alert(error.message);
			setLoading(false);
			return;
		}

		setStatus("pending_sent");
		await onChanged?.();
		setLoading(false);
	}

	async function acceptFriendRequest() {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			alert("You need to log in first.");
			return;
		}

		setLoading(true);

		const { data: requestData, error: requestError } = await supabase
			.from("friend_requests")
			.select("id, status")
			.eq("sender_id", profileId)
			.eq("receiver_id", user.id)
			.eq("status", "pending")
			.maybeSingle();

		if (requestError) {
			alert(requestError.message);
			setLoading(false);
			return;
		}

		const request = requestData as FriendRequestRow | null;

		if (!request) {
			await loadStatus();
			setLoading(false);
			return;
		}

		const { error: updateError } = await supabase
			.from("friend_requests")
			.update({
				status: "accepted",
				updated_at: new Date().toISOString(),
			})
			.eq("id", request.id);

		if (updateError) {
			alert(updateError.message);
			setLoading(false);
			return;
		}

		const { error: friendshipError } = await supabase
			.from("friendships")
			.upsert(
				[
					{
						user_id: user.id,
						friend_id: profileId,
					},
					{
						user_id: profileId,
						friend_id: user.id,
					},
				],
				{
					onConflict: "user_id,friend_id",
				},
			);

		if (friendshipError) {
			alert(friendshipError.message);
			setLoading(false);
			return;
		}

		setStatus("friends");
		await onChanged?.();
		setLoading(false);
	}

	async function handleClick() {
		if (loading) return;

		if (status === "none") {
			await sendFriendRequest();
			return;
		}

		if (status === "pending_received") {
			await acceptFriendRequest();
		}
	}

	if (status === "self") return null;

	const disabled =
		loading ||
		status === "loading" ||
		status === "pending_sent" ||
		status === "friends";

	const icon =
		status === "friends" ? (
			<UserCheck className="h-4 w-4" />
		) : status === "pending_sent" ? (
			<Clock className="h-4 w-4" />
		) : status === "pending_received" ? (
			<Check className="h-4 w-4" />
		) : (
			<UserPlus className="h-4 w-4" />
		);

	const label =
		status === "loading"
			? "Loading"
			: status === "friends"
				? "Friends"
				: status === "pending_sent"
					? "Pending"
					: status === "pending_received"
						? "Accept"
						: "Add Friend";

	if (variant === "icon") {
		return (
			<button
				type="button"
				onClick={handleClick}
				disabled={disabled}
				title={label}
				aria-label={label}
				className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent p-0 text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
			>
				{icon}
			</button>
		);
	}

	return (
		<button
			type="button"
			onClick={handleClick}
			disabled={disabled}
			className="flex h-14 w-36 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
		>
			{icon}
			{label}
		</button>
	);
}
