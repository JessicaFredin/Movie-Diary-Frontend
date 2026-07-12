"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Clock, UserPlus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type FriendRequestStatus = "pending" | "accepted" | "declined" | "cancelled";

type ButtonState =
	| "loading"
	| "signed_out"
	| "own_profile"
	| "none"
	| "pending_sent"
	| "pending_received"
	| "friends";

type FriendRequestRow = {
	id: number;
	requester_id: string;
	receiver_id: string;
	status: FriendRequestStatus;
};

type Props = {
	profileId: string;
	onChanged?: () => void | Promise<void>;
};

export default function AddFriendButton({ profileId, onChanged }: Props) {
	const supabase = useMemo(() => createClient(), []);

	const [currentUserId, setCurrentUserId] = useState<string | null>(null);
	const [buttonState, setButtonState] = useState<ButtonState>("loading");
	const [requestId, setRequestId] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);

	const loadFriendStatus = useCallback(async () => {
		setButtonState("loading");

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			setCurrentUserId(null);
			setButtonState("signed_out");
			return;
		}

		setCurrentUserId(user.id);

		if (user.id === profileId) {
			setButtonState("own_profile");
			return;
		}

		const { data: friendship } = await supabase
			.from("friendships")
			.select("id")
			.eq("user_id", user.id)
			.eq("friend_id", profileId)
			.maybeSingle();

		if (friendship) {
			setButtonState("friends");
			setRequestId(null);
			return;
		}

		const { data: outgoing } = await supabase
			.from("friend_requests")
			.select("id, requester_id, receiver_id, status")
			.eq("requester_id", user.id)
			.eq("receiver_id", profileId)
			.neq("status", "cancelled")
			.maybeSingle();

		const typedOutgoing = outgoing as FriendRequestRow | null;

		if (typedOutgoing?.status === "pending") {
			setButtonState("pending_sent");
			setRequestId(typedOutgoing.id);
			return;
		}

		if (typedOutgoing?.status === "accepted") {
			setButtonState("friends");
			setRequestId(typedOutgoing.id);
			return;
		}

		const { data: incoming } = await supabase
			.from("friend_requests")
			.select("id, requester_id, receiver_id, status")
			.eq("requester_id", profileId)
			.eq("receiver_id", user.id)
			.neq("status", "cancelled")
			.maybeSingle();

		const typedIncoming = incoming as FriendRequestRow | null;

		if (typedIncoming?.status === "pending") {
			setButtonState("pending_received");
			setRequestId(typedIncoming.id);
			return;
		}

		if (typedIncoming?.status === "accepted") {
			setButtonState("friends");
			setRequestId(typedIncoming.id);
			return;
		}

		setButtonState("none");
		setRequestId(null);
	}, [profileId, supabase]);

	useEffect(() => {
		loadFriendStatus();
	}, [loadFriendStatus]);

	async function sendFriendRequest() {
		if (!currentUserId) {
			alert("You need to log in first.");
			return;
		}

		try {
			setLoading(true);

			const { error } = await supabase.from("friend_requests").upsert(
				{
					requester_id: currentUserId,
					receiver_id: profileId,
					status: "pending",
					updated_at: new Date().toISOString(),
				},
				{
					onConflict: "requester_id,receiver_id",
				},
			);

			if (error) {
				alert(error.message);
				return;
			}

			await loadFriendStatus();
			await onChanged?.();
		} finally {
			setLoading(false);
		}
	}

	async function acceptFriendRequest() {
		if (!currentUserId || !requestId) return;

		try {
			setLoading(true);

			const { error: updateError } = await supabase
				.from("friend_requests")
				.update({
					status: "accepted",
					updated_at: new Date().toISOString(),
				})
				.eq("id", requestId)
				.eq("receiver_id", currentUserId);

			if (updateError) {
				alert(updateError.message);
				return;
			}

			const { error: friendshipError } = await supabase
				.from("friendships")
				.upsert(
					[
						{
							user_id: currentUserId,
							friend_id: profileId,
						},
						{
							user_id: profileId,
							friend_id: currentUserId,
						},
					],
					{
						onConflict: "user_id,friend_id",
					},
				);

			if (friendshipError) {
				alert(friendshipError.message);
				return;
			}

			await loadFriendStatus();
			await onChanged?.();
		} finally {
			setLoading(false);
		}
	}

	async function declineFriendRequest() {
		if (!currentUserId || !requestId) return;

		try {
			setLoading(true);

			const { error } = await supabase
				.from("friend_requests")
				.update({
					status: "declined",
					updated_at: new Date().toISOString(),
				})
				.eq("id", requestId)
				.eq("receiver_id", currentUserId);

			if (error) {
				alert(error.message);
				return;
			}

			await loadFriendStatus();
			await onChanged?.();
		} finally {
			setLoading(false);
		}
	}

	if (buttonState === "own_profile") return null;

	if (buttonState === "loading") {
		return (
			<button
				type="button"
				disabled
				className="flex h-14 w-[150px] items-center justify-center rounded-full bg-white/[0.08] text-sm font-bold text-white opacity-60"
			>
				Loading...
			</button>
		);
	}

	if (buttonState === "friends") {
		return (
			<button
				type="button"
				disabled
				className="flex h-14 w-[150px] items-center justify-center gap-2 rounded-full border border-green-500/40 bg-green-500/15 text-sm font-bold text-green-300"
			>
				<Check className="h-4 w-4" />
				Friends
			</button>
		);
	}

	if (buttonState === "pending_sent") {
		return (
			<button
				type="button"
				disabled
				className="flex h-14 w-[150px] items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] text-sm font-bold text-muted"
			>
				<Clock className="h-4 w-4" />
				Requested
			</button>
		);
	}

	if (buttonState === "pending_received") {
		return (
			<div className="flex gap-3">
				<button
					type="button"
					onClick={acceptFriendRequest}
					disabled={loading}
					className="flex h-14 w-[130px] items-center justify-center gap-2 rounded-full bg-accent text-sm font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover disabled:opacity-50"
				>
					<Check className="h-4 w-4" />
					Accept
				</button>

				<button
					type="button"
					onClick={declineFriendRequest}
					disabled={loading}
					className="flex h-14 w-[130px] items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] text-sm font-bold text-white transition hover:bg-white/[0.1] disabled:opacity-50"
				>
					<X className="h-4 w-4" />
					Decline
				</button>
			</div>
		);
	}

	return (
		<button
			type="button"
			onClick={sendFriendRequest}
			disabled={loading || buttonState === "signed_out"}
			className="flex h-14 w-[150px] items-center justify-center gap-2 rounded-full bg-accent text-sm font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover disabled:opacity-50"
		>
			<UserPlus className="h-4 w-4" />
			Add Friend
		</button>
	);
}
