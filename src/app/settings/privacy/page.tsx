"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	BookOpen,
	Check,
	Eye,
	Globe,
	Lock,
	UserCheck,
	UserPlus,
	Users,
	X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import {
	getOrCreateUserSettings,
	saveUserSettings,
	type UserSettings,
} from "@/utils/settings-storage";
import {
	getAllowedFriendIds,
	getFriendOptions,
	getPendingDiaryRequests,
	respondToDiaryRequest,
	saveAllowedFriends,
	type DiaryAccessRequest,
	type DiaryVisibility,
	type FriendOption,
} from "@/utils/diary-privacy-storage";

type PrivacyState = {
	public_profile: boolean;
	public_watchlist: boolean;
	show_online_status: boolean;
	allow_friend_requests: boolean;
	diary_visibility: DiaryVisibility;
};

const diaryVisibilityOptions: {
	value: DiaryVisibility;
	title: string;
	description: string;
	icon: typeof Globe;
}[] = [
	{
		value: "public",
		title: "Public diary",
		description: "Everyone can see your diary at all times.",
		icon: Globe,
	},
	{
		value: "private_request",
		title: "Private with requests",
		description:
			"Users must request access and you approve or reject them.",
		icon: Lock,
	},
	{
		value: "friends",
		title: "Friends only",
		description: "Only your friends can see your diary.",
		icon: Users,
	},
	{
		value: "selected_friends",
		title: "Selected friends",
		description: "Only friends you choose can see your diary.",
		icon: UserCheck,
	},
];

const privacyOptions: {
	key: keyof Omit<PrivacyState, "diary_visibility">;
	label: string;
	description: string;
	icon: typeof Users;
}[] = [
	{
		key: "public_profile",
		label: "Public Profile",
		description: "Anyone can view your profile.",
		icon: Users,
	},
	{
		key: "public_watchlist",
		label: "Public Watchlist",
		description: "Let others see what you plan to watch.",
		icon: Eye,
	},
	{
		key: "show_online_status",
		label: "Online Status",
		description: "Show when you're active.",
		icon: Globe,
	},
	{
		key: "allow_friend_requests",
		label: "Friend Requests",
		description: "Allow others to send friend requests.",
		icon: UserPlus,
	},
];

export default function PrivacyPage() {
	const router = useRouter();
	const supabase = useMemo(() => createClient(), []);

	const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
	const [settings, setSettings] = useState<PrivacyState | null>(null);
	const [friends, setFriends] = useState<FriendOption[]>([]);
	const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
	const [pendingRequests, setPendingRequests] = useState<
		DiaryAccessRequest[]
	>([]);

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		async function loadSettings(): Promise<void> {
			setLoading(true);
			setMessage("");

			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				setSettings(null);
				setUserSettings(null);
				setLoading(false);
				return;
			}

			const savedSettings = await getOrCreateUserSettings(
				supabase,
				user.id,
			);

			const { data: profileData } = await supabase
				.from("profiles")
				.select(
					"is_public, diary_visibility, is_private_diary, allow_friend_requests, show_online_status",
				)
				.eq("id", user.id)
				.maybeSingle();

			const profile = profileData as {
				is_public: boolean | null;
				diary_visibility: DiaryVisibility | null;
				is_private_diary: boolean | null;
				allow_friend_requests: boolean | null;
				show_online_status: boolean | null;
			} | null;

			const loadedFriends = await getFriendOptions(supabase, user.id);
			const allowedIds = await getAllowedFriendIds(supabase, user.id);
			const requests = await getPendingDiaryRequests(supabase, user.id);

			setUserSettings(savedSettings);
			setFriends(loadedFriends);
			setSelectedFriendIds(allowedIds);
			setPendingRequests(requests);

			setSettings({
				public_profile: profile?.is_public ?? true,
				public_watchlist: savedSettings.public_watchlist,
				show_online_status: profile?.show_online_status ?? false,
				allow_friend_requests: profile?.allow_friend_requests ?? true,
				diary_visibility:
					profile?.diary_visibility ??
					(profile?.is_private_diary === false
						? "public"
						: "private_request"),
			});

			setLoading(false);
		}

		void loadSettings();
	}, [supabase]);

	function toggle(key: keyof Omit<PrivacyState, "diary_visibility">): void {
		setSettings((current) =>
			current
				? {
						...current,
						[key]: !current[key],
					}
				: current,
		);
	}

	function toggleAllowedFriend(friendId: string): void {
		setSelectedFriendIds((current) => {
			if (current.includes(friendId)) {
				return current.filter((id) => id !== friendId);
			}

			return [...current, friendId];
		});
	}

	async function handleRequestResponse(
		requestId: string,
		status: "approved" | "rejected",
	): Promise<void> {
		try {
			await respondToDiaryRequest(supabase, requestId, status);

			setPendingRequests((current) =>
				current.filter((request) => request.id !== requestId),
			);
		} catch (error) {
			setMessage(
				error instanceof Error
					? error.message
					: "Could not update request.",
			);
		}
	}

	async function handleSave(): Promise<void> {
		if (!settings || !userSettings) return;

		setSaving(true);
		setMessage("");

		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) {
				setMessage("You need to be logged in.");
				return;
			}

			await saveUserSettings(supabase, {
				...userSettings,
				public_watchlist: settings.public_watchlist,
			});

			const isPublicDiary = settings.diary_visibility === "public";

			const { error } = await supabase
				.from("profiles")
				.update({
					is_public: settings.public_profile,
					diary_visibility: settings.diary_visibility,
					is_private_diary: !isPublicDiary,
					allow_friend_requests: settings.allow_friend_requests,
					show_online_status: settings.show_online_status,
					updated_at: new Date().toISOString(),
				})
				.eq("id", user.id);

			if (error) throw error;

			if (settings.diary_visibility === "selected_friends") {
				await saveAllowedFriends(supabase, user.id, selectedFriendIds);
			}

			setMessage("Privacy settings saved.");
		} catch (error) {
			setMessage(
				error instanceof Error
					? error.message
					: "Could not save privacy settings.",
			);
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="mx-auto max-w-3xl space-y-8 px-6 py-10">
			<div className="flex items-center gap-4 border-b border-border pb-4">
				<button
					type="button"
					onClick={() => router.back()}
					className="text-muted transition hover:text-white"
					aria-label="Go back"
				>
					<ArrowLeft size={20} />
				</button>

				<h1 className="text-xl font-semibold">Privacy</h1>
			</div>

			<div className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
				<div className="mb-5 flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-muted">
						<BookOpen size={18} className="text-muted" />
					</div>

					<div>
						<h2 className="font-semibold">Diary visibility</h2>
						<p className="text-sm text-muted">
							Choose who can see your diary.
						</p>
					</div>
				</div>

				<div className="grid gap-3">
					{diaryVisibilityOptions.map((option) => {
						const Icon = option.icon;
						const active =
							settings?.diary_visibility === option.value;

						return (
							<button
								type="button"
								key={option.value}
								disabled={loading || !settings}
								onClick={() =>
									setSettings((current) =>
										current
											? {
													...current,
													diary_visibility:
														option.value,
												}
											: current,
									)
								}
								className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition disabled:opacity-50 ${
									active
										? "border-accent bg-accent/10"
										: "border-border bg-surface-muted hover:bg-white/5"
								}`}
							>
								<div
									className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
										active
											? "bg-accent text-white"
											: "bg-black/20 text-muted"
									}`}
								>
									<Icon size={18} />
								</div>

								<div className="flex-1">
									<p className="font-semibold">
										{option.title}
									</p>
									<p className="mt-1 text-sm text-muted">
										{option.description}
									</p>
								</div>

								{active && (
									<Check className="mt-1 h-5 w-5 text-accent" />
								)}
							</button>
						);
					})}
				</div>

				{settings?.diary_visibility === "selected_friends" && (
					<div className="mt-6 rounded-2xl border border-border bg-black/20 p-4">
						<h3 className="font-semibold">
							Choose allowed friends
						</h3>

						{friends.length === 0 ? (
							<p className="mt-2 text-sm text-muted">
								You do not have any friends to select yet.
							</p>
						) : (
							<div className="mt-4 space-y-3">
								{friends.map((friend) => {
									const selected = selectedFriendIds.includes(
										friend.id,
									);

									return (
										<button
											type="button"
											key={friend.id}
											onClick={() =>
												toggleAllowedFriend(friend.id)
											}
											className="flex w-full items-center justify-between rounded-xl bg-surface-muted px-4 py-3 text-left transition hover:bg-white/5"
										>
											<div className="flex items-center gap-3">
												<div className="relative h-9 w-9 overflow-hidden rounded-full bg-accent">
													{friend.avatar_url ? (
														<Image
															src={
																friend.avatar_url
															}
															alt={
																friend.display_name
															}
															fill
															className="object-cover"
														/>
													) : (
														<div className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
															{friend.display_name
																.charAt(0)
																.toUpperCase()}
														</div>
													)}
												</div>

												<span className="font-medium">
													{friend.display_name}
												</span>
											</div>

											<div
												className={`flex h-6 w-6 items-center justify-center rounded-full border ${
													selected
														? "border-accent bg-accent text-white"
														: "border-border"
												}`}
											>
												{selected && (
													<Check className="h-4 w-4" />
												)}
											</div>
										</button>
									);
								})}
							</div>
						)}
					</div>
				)}
			</div>

			{pendingRequests.length > 0 && (
				<div className="rounded-3xl border border-border bg-surface p-6 shadow-lg">
					<h2 className="font-semibold">Diary access requests</h2>

					<div className="mt-4 space-y-3">
						{pendingRequests.map((request) => (
							<div
								key={request.id}
								className="flex items-center justify-between gap-4 rounded-2xl bg-surface-muted px-4 py-3"
							>
								<div className="flex items-center gap-3">
									<div className="relative h-10 w-10 overflow-hidden rounded-full bg-accent">
										{request.requester?.avatar_url ? (
											<Image
												src={
													request.requester.avatar_url
												}
												alt={
													request.requester
														.display_name
												}
												fill
												className="object-cover"
											/>
										) : (
											<div className="flex h-full w-full items-center justify-center font-bold text-white">
												{request.requester?.display_name
													?.charAt(0)
													.toUpperCase() ?? "U"}
											</div>
										)}
									</div>

									<div>
										<p className="font-medium">
											{request.requester?.display_name ??
												"User"}
										</p>
										<p className="text-sm text-muted">
											Wants to see your diary.
										</p>
									</div>
								</div>

								<div className="flex gap-2">
									<button
										type="button"
										onClick={() =>
											handleRequestResponse(
												request.id,
												"approved",
											)
										}
										className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/15 text-green-300 transition hover:bg-green-500 hover:text-white"
										aria-label="Approve"
									>
										<Check className="h-4 w-4" />
									</button>

									<button
										type="button"
										onClick={() =>
											handleRequestResponse(
												request.id,
												"rejected",
											)
										}
										className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/15 text-red-300 transition hover:bg-red-500 hover:text-white"
										aria-label="Reject"
									>
										<X className="h-4 w-4" />
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			<div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-lg">
				{privacyOptions.map((option) => {
					const Icon = option.icon;

					return (
						<div
							key={option.key}
							className="flex items-center justify-between border-b border-border px-6 py-5 last:border-none"
						>
							<div className="flex items-center gap-4">
								<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-muted">
									<Icon size={18} className="text-muted" />
								</div>

								<div>
									<p className="font-medium">
										{option.label}
									</p>
									<p className="text-sm text-muted">
										{option.description}
									</p>
								</div>
							</div>

							<Toggle
								enabled={Boolean(settings?.[option.key])}
								disabled={loading || !settings}
								onClick={() => toggle(option.key)}
							/>
						</div>
					);
				})}
			</div>

			{message && (
				<p className="rounded-xl bg-white/5 px-4 py-3 text-sm text-muted">
					{message}
				</p>
			)}

			<button
				type="button"
				onClick={handleSave}
				disabled={saving || loading || !settings}
				className="w-full rounded-xl bg-accent py-4 font-semibold disabled:opacity-50"
			>
				{saving ? "Saving..." : "Save Privacy Settings"}
			</button>
		</div>
	);
}

function Toggle({
	enabled,
	disabled,
	onClick,
}: {
	enabled: boolean;
	disabled?: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`relative h-6 w-12 rounded-full transition disabled:opacity-50 ${
				enabled ? "bg-accent" : "bg-surface-muted"
			}`}
		>
			<span
				className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
					enabled ? "right-1" : "left-1"
				}`}
			/>
		</button>
	);
}
