// "use client";

// import { useState } from "react";
// import { ThumbsUp, Reply, MoreHorizontal, Send } from "lucide-react";

// interface Comment {
// 	id: string;
// 	author: string;
// 	avatar?: string;
// 	initials: string;
// 	date: string;
// 	text: string;
// 	likes: number;
// 	liked: boolean;
// 	replies?: Comment[];
// }

// const initialComments: Comment[] = [
// 	{
// 		id: "1",
// 		author: "Sarah Chen",
// 		avatar: "https://i.pravatar.cc/100?img=44",
// 		initials: "SC",
// 		date: "2 days ago",
// 		text: "This film redefined what sci-fi can be. The way it handles time and human emotion is unlike anything I've ever seen.",
// 		likes: 24,
// 		liked: false,
// 		replies: [
// 			{
// 				id: "1-1",
// 				author: "Marcus Webb",
// 				avatar: "https://i.pravatar.cc/100?img=69",
// 				initials: "MW",
// 				date: "1 day ago",
// 				text: "Couldn't agree more!",
// 				likes: 8,
// 				liked: false,
// 			},
// 		],
// 	},
// 	{
// 		id: "2",
// 		author: "Alex Rivera",
// 		avatar: "https://i.pravatar.cc/100?img=68",
// 		initials: "AR",
// 		date: "5 days ago",
// 		text: "Watched this for the third time and I keep finding new layers.",
// 		likes: 31,
// 		liked: true,
// 	},
// 	{
// 		id: "3",
// 		author: "Alex Rivera",
// 		avatar: "https://i.pravatar.cc/100?img=58",
// 		initials: "AR",
// 		date: "5 days ago",
// 		text: "Watched this for the third time and I keep finding new layers.",
// 		likes: 31,
// 		liked: true,
// 	},
// 	{
// 		id: "4",
// 		author: "Sarah Chen",
// 		avatar: "https://i.pravatar.cc/100?img=78",
// 		initials: "SC",
// 		date: "2 days ago",
// 		text: "This film redefined what sci-fi can be. The way it handles time and human emotion is unlike anything I've ever seen.",
// 		likes: 24,
// 		liked: false,
// 		replies: [
// 			{
// 				id: "4-1",
// 				author: "Marcus Webb",
// 				initials: "MW",
// 				date: "1 day ago",
// 				text: "Couldn't agree more!",
// 				likes: 8,
// 				liked: false,
// 			},
// 		],
// 	},
// ];

// function Avatar({ avatar, initials }: { avatar?: string; initials: string }) {
// 	if (avatar) {
// 		return (
// 			<img
// 				src={avatar}
// 				alt={initials}
// 				className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover shrink-0"
// 			/>
// 		);
// 	}

// 	return (
// 		<div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-800 flex items-center justify-center text-[10px] sm:text-xs font-semibold text-white shrink-0">
// 			{initials}
// 		</div>
// 	);
// }

// function CommentItem({
// 	comment,
// 	isReply = false,
// }: {
// 	comment: Comment;
// 	isReply?: boolean;
// }) {
// 	const [liked, setLiked] = useState(comment.liked);
// 	const [likes, setLikes] = useState(comment.likes);
// 	const [showReplyInput, setShowReplyInput] = useState(false);

// 	const handleLike = () => {
// 		setLiked(!liked);
// 		setLikes(liked ? likes - 1 : likes + 1);
// 	};

// 	return (
// 		<div className={`flex gap-3 ${isReply ? "ml-6 sm:ml-12 mt-3" : ""}`}>
// 			<Avatar avatar={comment.avatar} initials={comment.initials} />

// 			<div className="flex-1 min-w-0">
// 				<div className="flex items-center gap-2 flex-wrap">
// 					<span className="text-sm font-semibold text-white">
// 						{comment.author}
// 					</span>
// 					<span className="text-xs text-gray-500">
// 						{comment.date}
// 					</span>
// 				</div>

// 				<p className="mt-1 text-sm text-gray-300 leading-relaxed">
// 					{comment.text}
// 				</p>

// 				<div className="mt-2 flex items-center gap-4 text-xs">
// 					<button
// 						onClick={handleLike}
// 						className={`flex items-center gap-1 transition ${
// 							liked
// 								? "text-[#FF414E]"
// 								: "text-gray-500 hover:text-white"
// 						}`}
// 					>
// 						<ThumbsUp
// 							className={`h-3 w-3 sm:h-4 sm:w-4 ${
// 								liked ? "fill-[#FF414E]" : ""
// 							}`}
// 						/>
// 						{likes}
// 					</button>

// 					{!isReply && (
// 						<button
// 							onClick={() => setShowReplyInput(!showReplyInput)}
// 							className="flex items-center gap-1 text-gray-500 hover:text-white transition"
// 						>
// 							<Reply className="h-3 w-3 sm:h-4 sm:w-4" />
// 							Reply
// 						</button>
// 					)}

// 					<button className="ml-auto text-gray-500 hover:text-white transition">
// 						<MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
// 					</button>
// 				</div>

// 				{showReplyInput && (
// 					<div className="mt-3 flex gap-2">
// 						<textarea
// 							className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 resize-none focus:outline-none focus:ring-1 focus:ring-[#FF414E]"
// 							placeholder="Write a reply..."
// 						/>
// 						<button className="bg-[#FF414E] hover:opacity-90 transition px-3 py-2 rounded-lg flex items-center justify-center">
// 							<Send className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
// 						</button>
// 					</div>
// 				)}

// 				{comment.replies?.map((reply) => (
// 					<CommentItem key={reply.id} comment={reply} isReply />
// 				))}
// 			</div>
// 		</div>
// 	);
// }

// export default function MediaComments() {
// 	const [comments] = useState(initialComments);
// 	const [newComment, setNewComment] = useState("");

// 	return (
// 		<section className="mt-16 sm:mt-20 space-y-6 sm:space-y-8 px-4 sm:px-0">
// 			<h2 className="text-xl sm:text-2xl font-semibold text-white">
// 				Comments{" "}
// 				<span className="text-gray-500 text-base sm:text-lg">
// 					({comments.length})
// 				</span>
// 			</h2>

// 			{/* ===== New Comment ===== */}
// 			<div className="bg-gray-900/70 backdrop-blur border border-gray-800 rounded-2xl p-4 sm:p-6">
// 				<div className="flex gap-3">
// 					{/* Your Avatar */}
// 					<img
// 						src="/images/avatar.jpg"
// 						alt="You"
// 						className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-700"
// 					/>

// 					<div className="flex-1 space-y-3">
// 						<textarea
// 							value={newComment}
// 							onChange={(e) => setNewComment(e.target.value)}
// 							placeholder="Share your thoughts..."
// 							className="w-full bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 resize-none focus:outline-none focus:ring-1 focus:ring-[#FF414E] placeholder:text-gray-500"
// 						/>

// 						<div className="flex justify-end">
// 							<button
// 								disabled={!newComment.trim()}
// 								className="bg-[#FF414E] hover:opacity-90 transition px-5 py-2 rounded-full text-sm font-medium flex items-center gap-2 disabled:opacity-50"
// 							>
// 								<Send className="h-4 w-4" />
// 								Post
// 							</button>
// 						</div>
// 					</div>
// 				</div>
// 			</div>

// 			{/* ===== Comment List ===== */}
// 			<div className="space-y-6 sm:space-y-8">
// 				{comments.map((comment, i) => (
// 					<div key={comment.id}>
// 						<CommentItem comment={comment} />
// 						{i < comments.length - 1 && (
// 							<div className="mt-6 border-t border-gray-800" />
// 						)}
// 					</div>
// 				))}
// 			</div>
// 		</section>
// 	);
// }



"use client";

import { useState } from "react";
import { ThumbsUp, Reply, MoreHorizontal, Send } from "lucide-react";
import { Comment } from "@/types/comment";


/* ================= TYPES ================= */

// export interface MediaReply {
// 	id: string;
// 	author: string;
// 	avatar?: string;
// 	initials: string;
// 	date: string;
// 	text: string;
// 	likes: number;
// 	liked: boolean;
// }

// export interface MediaComment extends MediaReply {
// 	replies?: MediaReply[];
// }

interface MediaCommentsProps {
	comments: Comment[];
}

/* ================= AVATAR ================= */

function Avatar({ avatar, initials }: { avatar?: string; initials: string }) {
	if (avatar) {
		return (
			<img
				src={avatar}
				alt={initials}
				className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover shrink-0 border border-surface-neutral"
			/>
		);
	}

	return (
		<div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface-elevated flex items-center justify-center text-[10px] sm:text-xs font-semibold text-white shrink-0 border border-surface-neutral">
			{initials}
		</div>
	);
}

/* ================= COMMENT ITEM ================= */

function CommentItem({
	comment,
	isReply = false,
}: {
	comment: Comment;
	isReply?: boolean;
}) {
	const [liked, setLiked] = useState(comment.liked);
	const [likes, setLikes] = useState(comment.likes);
	const [showReplyInput, setShowReplyInput] = useState(false);

	const handleLike = () => {
		setLiked(!liked);
		setLikes(liked ? likes - 1 : likes + 1);
	};

	return (
		<div className={`flex gap-3 ${isReply ? "ml-8 sm:ml-14 mt-4" : ""}`}>
			<Avatar avatar={comment.avatar} initials={comment.initials} />

			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 flex-wrap">
					<span className="text-sm font-semibold text-white">
						{comment.author}
					</span>
					<span className="text-xs text-muted-2">{comment.date}</span>
				</div>

				<p className="mt-1 text-sm text-muted leading-relaxed">
					{comment.text}
				</p>

				<div className="mt-2 flex items-center gap-5 text-xs">
					<button
						onClick={handleLike}
						className={`flex items-center gap-1 transition ${
							liked
								? "text-accent"
								: "text-muted-2 hover:text-white"
						}`}
					>
						<ThumbsUp
							className={`h-3 w-3 sm:h-4 sm:w-4 ${
								liked ? "fill-accent" : ""
							}`}
						/>
						{likes}
					</button>

					{!isReply && (
						<button
							onClick={() => setShowReplyInput(!showReplyInput)}
							className="flex items-center gap-1 text-muted-2 hover:text-white transition"
						>
							<Reply className="h-3 w-3 sm:h-4 sm:w-4" />
							Reply
						</button>
					)}

					<button className="ml-auto text-muted-2 hover:text-white transition">
						<MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
					</button>
				</div>

				{/* Reply input */}
				{showReplyInput && (
					<div className="mt-3 flex gap-2">
						<textarea
							className="flex-1 bg-surface-dark border border-surface-elevated rounded-lg px-3 py-2 text-sm text-muted resize-none focus:outline-none focus:ring-1 focus:ring-accent"
							placeholder="Write a reply..."
						/>
						<button className="bg-accent hover:opacity-90 transition px-3 py-2 rounded-lg flex items-center justify-center">
							<Send className="h-4 w-4 text-white" />
						</button>
					</div>
				)}

				{/* Replies */}
				{/* {"replies" in comment &&
					comment.replies?.map((reply) => (
						<CommentItem key={reply.id} comment={reply} isReply />
					))} */}

				{comment.replies?.map((reply) => (
					<CommentItem key={reply.id} comment={reply} isReply />
				))}
			</div>
		</div>
	);
}

/* ================= MAIN COMPONENT ================= */

export default function MediaComments({ comments }: MediaCommentsProps) {
	const [commentList] = useState(comments);
	const [newComment, setNewComment] = useState("");

	return (
		<section className="px-6 md:px-24 mt-20 pb-24">
			<div className="max-w-4xl space-y-8">
				<h2 className="text-xl sm:text-2xl font-semibold text-white">
					Comments{" "}
					<span className="text-muted-2 text-base sm:text-lg">
						({commentList.length})
					</span>
				</h2>

				{/* ===== New Comment Box ===== */}
				<div className="bg-surface-dark/70 backdrop-blur border border-surface-elevated rounded-2xl p-4 sm:p-6">
					<div className="flex gap-3">
						<img
							src="/images/avatar.jpg"
							alt="You"
							className="w-10 h-10 rounded-full object-cover border border-surface-neutral shrink-0"
						/>

						<div className="flex-1 space-y-3">
							<textarea
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								placeholder="Share your thoughts..."
								className="w-full bg-surface-elevated/80 border border-surface-neutral rounded-xl px-4 py-3 text-sm text-muted resize-none focus:outline-none focus:ring-1 focus:ring-accent"
							/>

							<div className="flex justify-end">
								<button
									disabled={!newComment.trim()}
									className="bg-accent hover:opacity-90 transition px-5 py-2 rounded-full text-sm font-medium flex items-center gap-2 disabled:opacity-50"
								>
									<Send className="h-4 w-4" />
									Post
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* ===== Comments List ===== */}
				<div className="space-y-8">
					{commentList.map((comment, i) => (
						<div key={comment.id}>
							<CommentItem comment={comment} />
							{i < commentList.length - 1 && (
								<div className="mt-8 border-t border-surface-elevated" />
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
