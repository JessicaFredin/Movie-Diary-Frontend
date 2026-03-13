"use client";

import { X } from "lucide-react";

 type NotificationType =
	| "friend_request"
	| "friend_accept"
	| "like"
	| "comment"
	| "diary_request";

 interface Notification {
	id: number;
	type: NotificationType;
	user: string;
	message: string;
	time: string;
	unread: boolean;
}

 const mockNotifications: Notification[] = [
	{
		id: 1,
		type: "friend_request",
		user: "Emma Torres",
		message: "sent you a friend request",
		time: "2h ago",
		unread: true,
	},
	{
		id: 2,
		type: "like",
		user: "James Okoro",
		message: "liked your review of Dune: Part Two",
		time: "5h ago",
		unread: true,
	},
	{
		id: 3,
		type: "comment",
		user: "Mia Chen",
		message: "commented on your review",
		time: "1d ago",
		unread: false,
	},
];

interface Props {
	onClose: () => void;
}

export default function MobileNotifications({ onClose }: Props) {
	return (
		<div className="fixed inset-0 bg-background z-50 flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between px-6 py-4 border-b border-border">
				<h3 className="font-semibold text-lg">Notifications</h3>
				<button onClick={onClose}>
					<X />
				</button>
			</div>

			{/* List */}
			<div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
				{mockNotifications.map((n) => (
					<div
						key={n.id}
						className={`p-4 rounded-xl border border-border ${
							n.unread ? "bg-accent/5" : "bg-surface"
						}`}
					>
						<p className="text-sm">
							<span className="font-medium">{n.user}</span>{" "}
							<span className="text-muted">{n.message}</span>
						</p>
						<p className="text-xs text-muted mt-1">{n.time}</p>
					</div>
				))}
			</div>
		</div>
	);
}
