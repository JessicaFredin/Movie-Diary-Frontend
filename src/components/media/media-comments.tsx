"use client";

import Link from "next/link";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	AlertTriangle,
	Check,
	Edit3,
	Eye,
	Flag,
	MoreHorizontal,
	Reply,
	Send,
	ThumbsUp,
	Trash2,
	X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type MediaType = "movie" | "tv";

type ReportReason =
	| "spam"
	| "harassment"
	| "hate"
	| "spoiler"
	| "offensive"
	| "other";

type ToastType = "success" | "error";

type ToastMessage = {
	type: ToastType;
	text: string;
};

type MediaCommentsProps = {
	mediaId: number;
	mediaType: MediaType;
};

type CommentRow = {
	id: string;
	user_id: string;
	parent_comment_id: string | null;
	content: string;
	is_spoiler: boolean | null;
	created_at: string;
	updated_at: string;
};

type ProfileRow = {
	id: string;
	display_name: string | null;
	avatar_url: string | null;
};

type LikeRow = {
	comment_id: string;
	user_id: string;
};

type SpoilerViewRow = {
	comment_id: string;
};

type CurrentProfile = {
	name: string;
	avatarUrl: string | null;
	initials: string;
};

type CommentItemData = {
	id: string;
	userId: string;
	author: string;
	avatar?: string;
	initials: string;
	date: string;
	text: string;
	isSpoiler: boolean;
	likes: number;
	liked: boolean;
	createdAt: string;
	updatedAt: string;
	replies: CommentItemData[];
};

type ReportReasonOption = {
	value: ReportReason;
	label: string;
	description: string;
};

type ReportSubmitResult = {
	success: boolean;
	message?: string;
};

const REPORT_REASONS: ReportReasonOption[] = [
	{
		value: "spam",
		label: "Spam",
		description: "Fake, repetitive, or promotional content.",
	},
	{
		value: "harassment",
		label: "Harassment",
		description: "Targeted abuse, bullying, or threats.",
	},
	{
		value: "hate",
		label: "Hate speech",
		description: "Attacks against protected groups.",
	},
	{
		value: "spoiler",
		label: "Spoiler",
		description: "Unmarked spoilers or plot reveals.",
	},
	{
		value: "offensive",
		label: "Offensive content",
		description: "Sexual, violent, or inappropriate content.",
	},
	{
		value: "other",
		label: "Something else",
		description: "Another reason not listed here.",
	},
];

function getInitials(name: string): string {
	const clean = name.trim();

	if (!clean) return "U";

	const parts = clean.split(" ").filter(Boolean);

	if (parts.length >= 2) {
		return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
	}

	return clean.slice(0, 2).toUpperCase();
}

function formatDate(date: string): string {
	const created = new Date(date).getTime();
	const now = Date.now();
	const diff = Math.max(0, now - created);

	const minute = 60 * 1000;
	const hour = 60 * minute;
	const day = 24 * hour;

	if (diff < minute) return "now";
	if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
	if (diff < day) return `${Math.floor(diff / hour)}h ago`;

	const days = Math.floor(diff / day);

	if (days === 1) return "1 day ago";
	if (days < 7) return `${days} days ago`;

	return new Intl.DateTimeFormat("en-CA", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date(date));
}

function wasEdited(createdAt: string, updatedAt: string): boolean {
	return new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 5000;
}

function countComments(comments: CommentItemData[]): number {
	return comments.reduce((total, comment) => {
		return total + 1 + countComments(comment.replies);
	}, 0);
}

function Avatar({ avatar, initials }: { avatar?: string; initials: string }) {
	if (avatar) {
		return (
			<img
				src={avatar}
				alt={initials}
				className="h-8 w-8 shrink-0 rounded-full border border-surface-neutral object-cover sm:h-9 sm:w-9"
			/>
		);
	}

	return (
		<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-surface-neutral bg-surface-elevated text-[10px] font-semibold text-white sm:h-9 sm:w-9 sm:text-xs">
			{initials}
		</div>
	);
}

function Toast({ toast }: { toast: ToastMessage | null }) {
	if (!toast) return null;

	return (
		<div className="fixed right-5 top-24 z-[200]">
			<div
				className={`flex max-w-sm items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-md ${
					toast.type === "success"
						? "border-green-500/30 bg-green-500/15 text-green-200"
						: "border-red-500/30 bg-red-500/15 text-red-200"
				}`}
			>
				<div
					className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
						toast.type === "success"
							? "bg-green-500 text-white"
							: "bg-red-500 text-white"
					}`}
				>
					{toast.type === "success" ? (
						<Check className="h-4 w-4" />
					) : (
						<X className="h-4 w-4" />
					)}
				</div>

				<p className="text-sm font-semibold">{toast.text}</p>
			</div>
		</div>
	);
}

function SpoilerToggle({
	active,
	onChange,
	disabled = false,
}: {
	active: boolean;
	onChange: (value: boolean) => void;
	disabled?: boolean;
}) {
	return (
		<button
			type="button"
			onClick={() => onChange(!active)}
			disabled={disabled}
			className={`flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
				active
					? "border-accent bg-accent/15 text-white"
					: "border-white/10 bg-white/[0.03] text-muted hover:text-white"
			}`}
		>
			<AlertTriangle className="h-3.5 w-3.5" />
			Contains spoiler
		</button>
	);
}

function updateCommentLike(
	comments: CommentItemData[],
	commentId: string,
	liked: boolean,
): CommentItemData[] {
	return comments.map((comment): CommentItemData => {
		if (comment.id === commentId) {
			const likeChange = liked ? 1 : -1;

			return {
				...comment,
				liked,
				likes: Math.max(0, comment.likes + likeChange),
			};
		}

		return {
			...comment,
			replies: updateCommentLike(comment.replies, commentId, liked),
		};
	});
}

function DeleteCommentModal({
	comment,
	deleting,
	onClose,
	onConfirm,
}: {
	comment: CommentItemData | null;
	deleting: boolean;
	onClose: () => void;
	onConfirm: () => void;
}) {
	if (!comment) return null;

	return (
		<div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
			<div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#15151a] p-6 shadow-2xl">
				<div className="flex items-start justify-between gap-4">
					<div>
						<h3 className="text-xl font-bold text-white">
							Delete comment?
						</h3>

						<p className="mt-2 text-sm leading-6 text-muted">
							This will permanently delete your comment. If this
							comment has replies, they may also be removed.
						</p>
					</div>

					<button
						type="button"
						onClick={onClose}
						disabled={deleting}
						className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-white disabled:opacity-50"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
					<p className="line-clamp-3 text-sm text-muted">
						{comment.text}
					</p>
				</div>

				<div className="mt-6 flex justify-end gap-3">
					<button
						type="button"
						onClick={onClose}
						disabled={deleting}
						className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
					>
						Cancel
					</button>

					<button
						type="button"
						onClick={onConfirm}
						disabled={deleting}
						className="flex items-center gap-2 rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
					>
						<Trash2 className="h-4 w-4" />
						{deleting ? "Deleting..." : "Delete"}
					</button>
				</div>
			</div>
		</div>
	);
}

function ReportCommentModal({
	comment,
	reporting,
	onClose,
	onConfirm,
}: {
	comment: CommentItemData | null;
	reporting: boolean;
	onClose: () => void;
	onConfirm: (
		reason: ReportReason,
		details: string,
	) => Promise<ReportSubmitResult>;
}) {
	const [reason, setReason] = useState<ReportReason>("spam");
	const [details, setDetails] = useState("");
	const [submitError, setSubmitError] = useState("");

	useEffect(() => {
		if (comment) {
			setReason("spam");
			setDetails("");
			setSubmitError("");
		}
	}, [comment]);

	if (!comment) return null;

	async function handleSubmit(): Promise<void> {
		setSubmitError("");

		const result = await onConfirm(reason, details);

		if (!result.success) {
			setSubmitError(
				result.message || "Something went wrong. Please try again.",
			);
		}
	}

	return (
		<div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
			<div className="flex max-h-[min(720px,calc(100vh-4rem))] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#15151a] shadow-2xl">
				<div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
					<div>
						<h3 className="text-xl font-bold text-white">
							Report comment
						</h3>

						<p className="mt-2 text-sm leading-6 text-muted">
							Tell us what is wrong with this comment. Reports are
							private.
						</p>
					</div>

					<button
						type="button"
						onClick={onClose}
						disabled={reporting}
						className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-white disabled:opacity-50"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<div className="overflow-y-auto px-6 py-5 [scrollbar-color:#050505_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/80 [&::-webkit-scrollbar-thumb:hover]:bg-black">
					<div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
						<p className="line-clamp-3 text-sm text-muted">
							{comment.text}
						</p>
					</div>

					<div className="mt-5 space-y-2">
						{REPORT_REASONS.map((option) => {
							const active = reason === option.value;

							return (
								<button
									key={option.value}
									type="button"
									onClick={() => setReason(option.value)}
									disabled={reporting}
									className={`w-full rounded-2xl border px-4 py-3 text-left transition disabled:opacity-50 ${
										active
											? "border-accent bg-accent/10"
											: "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
									}`}
								>
									<div className="flex items-center justify-between gap-3">
										<div>
											<p className="text-sm font-bold text-white">
												{option.label}
											</p>

											<p className="mt-1 text-xs text-muted">
												{option.description}
											</p>
										</div>

										<span
											className={`h-4 w-4 rounded-full border ${
												active
													? "border-accent bg-accent"
													: "border-white/30"
											}`}
										/>
									</div>
								</button>
							);
						})}
					</div>

					<div className="mt-5">
						<label className="mb-2 block text-xs uppercase tracking-wide text-muted">
							Extra details optional
						</label>

						<textarea
							value={details}
							onChange={(event) => setDetails(event.target.value)}
							disabled={reporting}
							maxLength={500}
							rows={3}
							placeholder="Add more details..."
							className="w-full resize-none rounded-2xl border border-white/10 bg-[#101014] px-4 py-3 text-sm text-muted outline-none transition focus:border-accent disabled:opacity-50"
						/>
					</div>

					{submitError && (
						<p className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
							{submitError}
						</p>
					)}
				</div>

				<div className="flex justify-end gap-3 border-t border-white/10 bg-[#15151a] px-6 py-4">
					<button
						type="button"
						onClick={onClose}
						disabled={reporting}
						className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
					>
						Cancel
					</button>

					<button
						type="button"
						onClick={handleSubmit}
						disabled={reporting}
						className="flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50"
					>
						<Flag className="h-4 w-4" />
						{reporting ? "Reporting..." : "Submit report"}
					</button>
				</div>
			</div>
		</div>
	);
}

function CommentItem({
	comment,
	currentUserId,
	openMenuId,
	setOpenMenuId,
	visibleSpoilerIds,
	isReply = false,
	onReply,
	onLike,
	onEdit,
	onRequestDelete,
	onRequestReport,
	onRevealSpoiler,
}: {
	comment: CommentItemData;
	currentUserId: string | null;
	openMenuId: string | null;
	setOpenMenuId: (id: string | null) => void;
	visibleSpoilerIds: string[];
	isReply?: boolean;
	onReply: (
		parentId: string,
		content: string,
		isSpoiler: boolean,
	) => Promise<boolean>;
	onLike: (commentId: string, liked: boolean) => Promise<void>;
	onEdit: (
		commentId: string,
		content: string,
		isSpoiler: boolean,
	) => Promise<boolean>;
	onRequestDelete: (comment: CommentItemData) => void;
	onRequestReport: (comment: CommentItemData) => void;
	onRevealSpoiler: (commentId: string) => void;
}) {
	const isOwner = currentUserId === comment.userId;
	const menuOpen = openMenuId === comment.id;
	const spoilerVisible = visibleSpoilerIds.includes(comment.id);

	const [showReplyInput, setShowReplyInput] = useState(false);
	const [replyText, setReplyText] = useState("");
	const [replyIsSpoiler, setReplyIsSpoiler] = useState(false);
	const [replying, setReplying] = useState(false);

	const [editing, setEditing] = useState(false);
	const [editText, setEditText] = useState(comment.text);
	const [editIsSpoiler, setEditIsSpoiler] = useState(comment.isSpoiler);
	const [savingEdit, setSavingEdit] = useState(false);

	async function handleReplySubmit(): Promise<void> {
		const cleanText = replyText.trim();

		if (!cleanText) return;

		setReplying(true);

		const success = await onReply(comment.id, cleanText, replyIsSpoiler);

		setReplying(false);

		if (success) {
			setReplyText("");
			setReplyIsSpoiler(false);
			setShowReplyInput(false);
		}
	}

	async function handleEditSubmit(): Promise<void> {
		const cleanText = editText.trim();

		if (!cleanText) return;

		setSavingEdit(true);

		const success = await onEdit(comment.id, cleanText, editIsSpoiler);

		setSavingEdit(false);

		if (success) {
			setEditing(false);
			setOpenMenuId(null);
		}
	}

	function renderCommentText(): ReactNode {
		if (comment.isSpoiler && !spoilerVisible && !editing) {
			return (
				<div className="mt-2 rounded-2xl border border-accent/30 bg-accent/10 p-4">
					<div className="flex items-start gap-3">
						<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />

						<div className="min-w-0 flex-1">
							<p className="text-sm font-semibold text-white">
								This comment may contain spoilers
							</p>

							<p className="mt-1 text-xs leading-5 text-muted">
								The author marked this comment as a spoiler.
							</p>

							<button
								type="button"
								onClick={() => onRevealSpoiler(comment.id)}
								className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-accent-hover"
							>
								<Eye className="h-3.5 w-3.5" />
								View anyway
							</button>
						</div>
					</div>
				</div>
			);
		}

		return (
			<p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted">
				{comment.text}
			</p>
		);
	}

	return (
		<div className={`flex gap-3 ${isReply ? "ml-8 mt-4 sm:ml-14" : ""}`}>
			<Link
				href={`/users/${comment.userId}`}
				className="h-fit shrink-0 rounded-full"
			>
				<Avatar avatar={comment.avatar} initials={comment.initials} />
			</Link>

			<div className="min-w-0 flex-1">
				<div className="flex flex-wrap items-center gap-2">
					<Link
						href={`/users/${comment.userId}`}
						className="text-sm font-semibold text-white transition hover:text-accent"
					>
						{comment.author}
					</Link>

					<span className="text-xs text-muted-2">{comment.date}</span>

					{comment.isSpoiler && (
						<span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
							Spoiler
						</span>
					)}

					{wasEdited(comment.createdAt, comment.updatedAt) && (
						<span className="text-xs text-muted-2">edited</span>
					)}
				</div>

				{editing ? (
					<div className="mt-2 space-y-3">
						<textarea
							value={editText}
							onChange={(event) =>
								setEditText(event.target.value)
							}
							onKeyDown={(event) => {
								if (
									event.key === "Enter" &&
									!event.shiftKey &&
									!event.nativeEvent.isComposing
								) {
									event.preventDefault();

									if (!savingEdit && editText.trim()) {
										void handleEditSubmit();
									}
								}
							}}
							className="w-full resize-none rounded-lg border border-surface-elevated bg-surface-dark px-3 py-2 text-sm text-muted focus:outline-none focus:ring-1 focus:ring-accent"
							rows={3}
							maxLength={1000}
						/>

						<SpoilerToggle
							active={editIsSpoiler}
							onChange={setEditIsSpoiler}
							disabled={savingEdit}
						/>

						<div className="flex justify-end gap-2">
							<button
								type="button"
								onClick={() => {
									setEditText(comment.text);
									setEditIsSpoiler(comment.isSpoiler);
									setEditing(false);
									setOpenMenuId(null);
								}}
								disabled={savingEdit}
								className="flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted transition hover:text-white disabled:opacity-50"
							>
								<X className="h-3.5 w-3.5" />
								Cancel
							</button>

							<button
								type="button"
								onClick={handleEditSubmit}
								disabled={savingEdit || !editText.trim()}
								className="flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
							>
								<Check className="h-3.5 w-3.5" />
								{savingEdit ? "Saving..." : "Save"}
							</button>
						</div>
					</div>
				) : (
					renderCommentText()
				)}

				<div className="mt-2 flex items-center gap-5 text-xs">
					<button
						type="button"
						onClick={() => onLike(comment.id, !comment.liked)}
						className={`flex items-center gap-1 transition ${
							comment.liked
								? "text-accent"
								: "text-muted-2 hover:text-white"
						}`}
					>
						<ThumbsUp
							className={`h-3 w-3 sm:h-4 sm:w-4 ${
								comment.liked ? "fill-accent" : ""
							}`}
						/>

						{comment.likes}
					</button>

					{!isReply && (
						<button
							type="button"
							onClick={() => setShowReplyInput((value) => !value)}
							className="flex items-center gap-1 text-muted-2 transition hover:text-white"
						>
							<Reply className="h-3 w-3 sm:h-4 sm:w-4" />
							Reply
						</button>
					)}

					{!editing && (
						<div
							className="relative ml-auto"
							data-comment-menu-root
						>
							<button
								type="button"
								onClick={() =>
									setOpenMenuId(menuOpen ? null : comment.id)
								}
								className="text-muted-2 transition hover:text-white"
							>
								<MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
							</button>

							{menuOpen && (
								<div className="absolute right-0 top-6 z-30 w-40 overflow-hidden rounded-xl border border-white/10 bg-[#17171c] shadow-xl">
									{isOwner ? (
										<>
											<button
												type="button"
												onClick={() => {
													setEditing(true);
													setOpenMenuId(null);
												}}
												className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs text-white transition hover:bg-white/10"
											>
												<Edit3 className="h-3.5 w-3.5" />
												Edit
											</button>

											<button
												type="button"
												onClick={() => {
													setOpenMenuId(null);
													onRequestDelete(comment);
												}}
												className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs text-red-300 transition hover:bg-red-500/10"
											>
												<Trash2 className="h-3.5 w-3.5" />
												Delete
											</button>
										</>
									) : (
										<button
											type="button"
											onClick={() => {
												setOpenMenuId(null);
												onRequestReport(comment);
											}}
											className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs text-white transition hover:bg-white/10"
										>
											<Flag className="h-3.5 w-3.5" />
											Report
										</button>
									)}
								</div>
							)}
						</div>
					)}
				</div>

				{showReplyInput && (
					<div className="mt-3 space-y-2">
						<div className="flex gap-2">
							<textarea
								value={replyText}
								onChange={(event) =>
									setReplyText(event.target.value)
								}
								onKeyDown={(event) => {
									if (
										event.key === "Enter" &&
										!event.shiftKey &&
										!event.nativeEvent.isComposing
									) {
										event.preventDefault();

										if (!replying && replyText.trim()) {
											void handleReplySubmit();
										}
									}
								}}
								className="flex-1 resize-none rounded-lg border border-surface-elevated bg-surface-dark px-3 py-2 text-sm text-muted focus:outline-none focus:ring-1 focus:ring-accent"
								placeholder="Write a reply..."
								rows={2}
								maxLength={1000}
							/>

							<button
								type="button"
								onClick={handleReplySubmit}
								disabled={replying || !replyText.trim()}
								className="flex items-center justify-center rounded-lg bg-accent px-3 py-2 transition hover:opacity-90 disabled:opacity-50"
							>
								<Send className="h-4 w-4 text-white" />
							</button>
						</div>

						<SpoilerToggle
							active={replyIsSpoiler}
							onChange={setReplyIsSpoiler}
							disabled={replying}
						/>
					</div>
				)}

				{comment.replies.map((reply) => (
					<CommentItem
						key={reply.id}
						comment={reply}
						currentUserId={currentUserId}
						openMenuId={openMenuId}
						setOpenMenuId={setOpenMenuId}
						visibleSpoilerIds={visibleSpoilerIds}
						isReply
						onReply={onReply}
						onLike={onLike}
						onEdit={onEdit}
						onRequestDelete={onRequestDelete}
						onRequestReport={onRequestReport}
						onRevealSpoiler={onRevealSpoiler}
					/>
				))}
			</div>
		</div>
	);
}

export default function MediaComments({
	mediaId,
	mediaType,
}: MediaCommentsProps) {
	const supabase = useMemo(() => createClient(), []);

	const [commentList, setCommentList] = useState<CommentItemData[]>([]);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);
	const [currentProfile, setCurrentProfile] = useState<CurrentProfile>({
		name: "You",
		avatarUrl: null,
		initials: "Y",
	});
	const [newComment, setNewComment] = useState("");
	const [newCommentIsSpoiler, setNewCommentIsSpoiler] = useState(false);
	const [visibleSpoilerIds, setVisibleSpoilerIds] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [posting, setPosting] = useState(false);
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);
	const [toast, setToast] = useState<ToastMessage | null>(null);

	const [deleteTarget, setDeleteTarget] = useState<CommentItemData | null>(
		null,
	);
	const [deleting, setDeleting] = useState(false);

	const [reportTarget, setReportTarget] = useState<CommentItemData | null>(
		null,
	);
	const [reporting, setReporting] = useState(false);

	function showToast(type: ToastType, text: string): void {
		setToast({ type, text });

		window.setTimeout(() => {
			setToast(null);
		}, 4000);
	}

	const totalCommentCount = useMemo((): number => {
		return countComments(commentList);
	}, [commentList]);

	const loadComments = useCallback(async (): Promise<void> => {
		setLoading(true);

		const {
			data: { user },
		} = await supabase.auth.getUser();

		setCurrentUserId(user?.id ?? null);

		if (user) {
			const { data: myProfile } = await supabase
				.from("profiles")
				.select("id, display_name, avatar_url")
				.eq("id", user.id)
				.maybeSingle();

			const profile = myProfile as ProfileRow | null;
			const name =
				profile?.display_name ||
				user.user_metadata?.full_name ||
				user.user_metadata?.name ||
				user.email ||
				"You";

			setCurrentProfile({
				name,
				avatarUrl: profile?.avatar_url ?? null,
				initials: getInitials(name),
			});
		} else {
			setCurrentProfile({
				name: "You",
				avatarUrl: null,
				initials: "Y",
			});
		}

		const { data: commentsData, error: commentsError } = await supabase
			.from("media_comments")
			.select(
				"id, user_id, parent_comment_id, content, is_spoiler, created_at, updated_at",
			)
			.eq("media_id", String(mediaId))
			.eq("media_type", mediaType)
			.order("created_at", { ascending: true });

		if (commentsError) {
			console.error("Failed to load comments:", commentsError.message);
			setCommentList([]);
			setLoading(false);
			return;
		}

		const comments = (commentsData ?? []) as CommentRow[];
		const commentIds = comments.map((comment) => comment.id);
		const userIds = Array.from(
			new Set(comments.map((comment) => comment.user_id)),
		);

		let profiles: ProfileRow[] = [];

		if (userIds.length > 0) {
			const { data: profilesData, error: profilesError } = await supabase
				.from("profiles")
				.select("id, display_name, avatar_url")
				.in("id", userIds);

			if (profilesError) {
				console.error(
					"Failed to load comment profiles:",
					profilesError.message,
				);
			}

			profiles = (profilesData ?? []) as ProfileRow[];
		}

		let likes: LikeRow[] = [];

		if (commentIds.length > 0) {
			const { data: likesData, error: likesError } = await supabase
				.from("media_comment_likes")
				.select("comment_id, user_id")
				.in("comment_id", commentIds);

			if (likesError) {
				console.error(
					"Failed to load comment likes:",
					likesError.message,
				);
			}

			likes = (likesData ?? []) as LikeRow[];
		}

		let spoilerViews: SpoilerViewRow[] = [];

		if (user && commentIds.length > 0) {
			const { data: spoilerViewData, error: spoilerViewError } =
				await supabase
					.from("media_comment_spoiler_views")
					.select("comment_id")
					.eq("user_id", user.id)
					.in("comment_id", commentIds);

			if (spoilerViewError) {
				console.error(
					"Failed to load spoiler views:",
					spoilerViewError.message,
				);
			}

			spoilerViews = (spoilerViewData ?? []) as SpoilerViewRow[];
		}

		const profileMap = new Map<string, ProfileRow>(
			profiles.map((profile) => [profile.id, profile]),
		);

		const likeCountMap = new Map<string, number>();
		const likedByCurrentUser = new Set<string>();

		for (const like of likes) {
			likeCountMap.set(
				like.comment_id,
				(likeCountMap.get(like.comment_id) ?? 0) + 1,
			);

			if (user && like.user_id === user.id) {
				likedByCurrentUser.add(like.comment_id);
			}
		}

		const visibleSpoilerIdSet = new Set<string>(
			spoilerViews.map((view) => view.comment_id),
		);

		setVisibleSpoilerIds((currentIds) => {
			const currentValidIds = currentIds.filter((id) =>
				commentIds.includes(id),
			);

			return Array.from(
				new Set([...currentValidIds, ...visibleSpoilerIdSet]),
			);
		});

		const commentMap = new Map<string, CommentItemData>();

		for (const comment of comments) {
			const profile = profileMap.get(comment.user_id);
			const author = profile?.display_name || "User";

			commentMap.set(comment.id, {
				id: comment.id,
				userId: comment.user_id,
				author,
				avatar: profile?.avatar_url ?? undefined,
				initials: getInitials(author),
				date: formatDate(comment.created_at),
				text: comment.content,
				isSpoiler: comment.is_spoiler ?? false,
				likes: likeCountMap.get(comment.id) ?? 0,
				liked: likedByCurrentUser.has(comment.id),
				createdAt: comment.created_at,
				updatedAt: comment.updated_at,
				replies: [],
			});
		}

		const topLevelComments: CommentItemData[] = [];

		for (const comment of comments) {
			const item = commentMap.get(comment.id);

			if (!item) continue;

			if (comment.parent_comment_id) {
				const parent = commentMap.get(comment.parent_comment_id);

				if (parent) {
					parent.replies.push(item);
				} else {
					topLevelComments.push(item);
				}
			} else {
				topLevelComments.push(item);
			}
		}

		topLevelComments.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() -
				new Date(a.createdAt).getTime(),
		);

		for (const comment of topLevelComments) {
			comment.replies.sort(
				(a, b) =>
					new Date(a.createdAt).getTime() -
					new Date(b.createdAt).getTime(),
			);
		}

		setCommentList(topLevelComments);
		setLoading(false);
	}, [mediaId, mediaType, supabase]);

	useEffect(() => {
		loadComments();
	}, [loadComments]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent): void {
			const target = event.target as HTMLElement | null;

			if (target?.closest("[data-comment-menu-root]")) {
				return;
			}

			setOpenMenuId(null);
		}

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	async function saveSpoilerReveal(commentId: string): Promise<void> {
		if (!currentUserId) {
			showToast(
				"error",
				"Log in to remember spoiler reveals on your account.",
			);
			return;
		}

		const { error } = await supabase
			.from("media_comment_spoiler_views")
			.upsert(
				{
					comment_id: commentId,
					user_id: currentUserId,
				},
				{
					onConflict: "comment_id,user_id",
				},
			);

		if (error) {
			showToast("error", error.message);
		}
	}

	function handleRevealSpoiler(commentId: string): void {
		setVisibleSpoilerIds((currentIds) => {
			if (currentIds.includes(commentId)) return currentIds;

			return [...currentIds, commentId];
		});

		void saveSpoilerReveal(commentId);
	}

	async function createComment(
		parentCommentId: string | null,
		content: string,
		isSpoiler: boolean,
	): Promise<boolean> {
		const cleanContent = content.trim();

		if (!cleanContent) return false;

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			showToast("error", "You need to log in first to comment.");
			return false;
		}

		const { error } = await supabase.from("media_comments").insert({
			user_id: user.id,
			media_id: String(mediaId),
			media_type: mediaType,
			parent_comment_id: parentCommentId,
			content: cleanContent,
			is_spoiler: isSpoiler,
		});

		if (error) {
			showToast("error", error.message);
			return false;
		}

		await loadComments();
		return true;
	}

	async function handlePostComment(): Promise<void> {
		setPosting(true);

		const success = await createComment(
			null,
			newComment,
			newCommentIsSpoiler,
		);

		setPosting(false);

		if (success) {
			setNewComment("");
			setNewCommentIsSpoiler(false);
			showToast("success", "Comment posted.");
		}
	}

	async function handleReply(
		parentId: string,
		content: string,
		isSpoiler: boolean,
	): Promise<boolean> {
		const success = await createComment(parentId, content, isSpoiler);

		if (success) {
			showToast("success", "Reply posted.");
		}

		return success;
	}

	async function handleLike(
		commentId: string,
		liked: boolean,
	): Promise<void> {
		if (!currentUserId) {
			showToast("error", "You need to log in first to like comments.");
			return;
		}

		setCommentList((current) =>
			updateCommentLike(current, commentId, liked),
		);

		if (liked) {
			const { error } = await supabase.from("media_comment_likes").upsert(
				{
					comment_id: commentId,
					user_id: currentUserId,
				},
				{
					onConflict: "comment_id,user_id",
				},
			);

			if (error) {
				console.error(error.message);
				await loadComments();
			}

			return;
		}

		const { error } = await supabase
			.from("media_comment_likes")
			.delete()
			.eq("comment_id", commentId)
			.eq("user_id", currentUserId);

		if (error) {
			console.error(error.message);
			await loadComments();
		}
	}

	async function handleEdit(
		commentId: string,
		content: string,
		isSpoiler: boolean,
	): Promise<boolean> {
		const cleanContent = content.trim();

		if (!cleanContent) return false;

		const { error } = await supabase
			.from("media_comments")
			.update({
				content: cleanContent,
				is_spoiler: isSpoiler,
				updated_at: new Date().toISOString(),
			})
			.eq("id", commentId);

		if (error) {
			showToast("error", error.message);
			await loadComments();
			return false;
		}

		await loadComments();
		showToast("success", "Comment updated.");
		return true;
	}

	async function handleDeleteConfirm(): Promise<void> {
		if (!deleteTarget) return;

		setDeleting(true);

		const { error } = await supabase
			.from("media_comments")
			.delete()
			.eq("id", deleteTarget.id);

		setDeleting(false);

		if (error) {
			showToast("error", error.message);
			await loadComments();
			return;
		}

		setDeleteTarget(null);
		await loadComments();
		showToast("success", "Comment deleted.");
	}

	async function handleReportConfirm(
		reason: ReportReason,
		details: string,
	): Promise<ReportSubmitResult> {
		if (!reportTarget) {
			return {
				success: false,
				message: "No comment selected.",
			};
		}

		if (!currentUserId) {
			return {
				success: false,
				message: "You need to log in first to report comments.",
			};
		}

		setReporting(true);

		const { error } = await supabase.from("media_comment_reports").insert({
			comment_id: reportTarget.id,
			reporter_id: currentUserId,
			reason,
			details: details.trim() || null,
			status: "pending",
		});

		setReporting(false);

		if (error) {
			if (error.code === "23505") {
				setReportTarget(null);
				showToast(
					"success",
					"You have reported this comment. It will be reviewed.",
				);

				return {
					success: true,
				};
			}

			return {
				success: false,
				message: error.message,
			};
		}

		setReportTarget(null);
		showToast("success", "Report submitted. Thanks — we’ll review it.");

		return {
			success: true,
		};
	}

	return (
		<section className="px-6 md:px-24 mt-20 pb-24">
			<Toast toast={toast} />

			<div className="max-w-4xl space-y-8">
				<h2 className="text-xl font-semibold text-white sm:text-2xl">
					Comments{" "}
					<span className="text-base text-muted-2 sm:text-lg">
						({totalCommentCount})
					</span>
				</h2>

				<div className="rounded-2xl border border-surface-elevated bg-surface-dark/70 p-4 backdrop-blur sm:p-6">
					<div className="flex gap-3">
						{currentProfile.avatarUrl ? (
							<img
								src={currentProfile.avatarUrl}
								alt={currentProfile.name}
								className="h-10 w-10 shrink-0 rounded-full border border-surface-neutral object-cover"
							/>
						) : (
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-surface-neutral bg-surface-elevated text-xs font-semibold text-white">
								{currentProfile.initials}
							</div>
						)}

						<div className="flex-1 space-y-3">
							<textarea
								value={newComment}
								onChange={(event) =>
									setNewComment(event.target.value)
								}
								onKeyDown={(event) => {
									if (
										event.key === "Enter" &&
										!event.shiftKey &&
										!event.nativeEvent.isComposing
									) {
										event.preventDefault();

										if (!posting && newComment.trim()) {
											void handlePostComment();
										}
									}
								}}
								placeholder="Share your thoughts..."
								className="w-full resize-none rounded-xl border border-surface-neutral bg-surface-elevated/80 px-4 py-3 text-sm text-muted focus:outline-none focus:ring-1 focus:ring-accent"
								rows={3}
								maxLength={1000}
							/>

							<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
								<SpoilerToggle
									active={newCommentIsSpoiler}
									onChange={setNewCommentIsSpoiler}
									disabled={posting}
								/>

								<button
									type="button"
									onClick={handlePostComment}
									disabled={posting || !newComment.trim()}
									className="flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
								>
									<Send className="h-4 w-4" />
									{posting ? "Posting..." : "Post"}
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className="space-y-8">
					{loading ? (
						<p className="text-sm text-muted">
							Loading comments...
						</p>
					) : commentList.length === 0 ? (
						<p className="text-sm text-muted">
							No comments yet. Be the first to comment.
						</p>
					) : (
						commentList.map((comment, index) => (
							<div key={comment.id}>
								<CommentItem
									comment={comment}
									currentUserId={currentUserId}
									openMenuId={openMenuId}
									setOpenMenuId={setOpenMenuId}
									visibleSpoilerIds={visibleSpoilerIds}
									onReply={handleReply}
									onLike={handleLike}
									onEdit={handleEdit}
									onRequestDelete={(target) =>
										setDeleteTarget(target)
									}
									onRequestReport={(target) =>
										setReportTarget(target)
									}
									onRevealSpoiler={handleRevealSpoiler}
								/>

								{index < commentList.length - 1 && (
									<div className="mt-8 border-t border-surface-elevated" />
								)}
							</div>
						))
					)}
				</div>
			</div>

			<DeleteCommentModal
				comment={deleteTarget}
				deleting={deleting}
				onClose={() => {
					if (!deleting) setDeleteTarget(null);
				}}
				onConfirm={handleDeleteConfirm}
			/>

			<ReportCommentModal
				comment={reportTarget}
				reporting={reporting}
				onClose={() => {
					if (!reporting) setReportTarget(null);
				}}
				onConfirm={handleReportConfirm}
			/>
		</section>
	);
}
