"use client";

import { Bell } from "lucide-react";

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

export default function NotificationDropdown({ onClose }: Props) {
	return (
		<div className="absolute right-0 mt-3 w-[380px] max-h-[500px] bg-surface-elevated border border-border rounded-2xl shadow-2xl overflow-hidden z-50">
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-3 border-b border-border">
				<h3 className="font-semibold">Notifications</h3>
				<button
					onClick={onClose}
					className="text-xs text-muted hover:text-foreground"
				>
					Close
				</button>
			</div>

			{/* List */}
			<div className="max-h-[420px] overflow-y-auto custom-scrollbar">
				{mockNotifications.map((n) => (
					<div
						key={n.id}
						className={`px-4 py-3 border-b border-border hover:bg-surface-neutral transition ${
							n.unread ? "bg-accent/5" : ""
						}`}
					>
						<div className="flex items-start gap-3">
							<div className="w-9 h-9 rounded-full bg-surface-neutral flex items-center justify-center">
								<Bell size={16} className="text-accent" />
							</div>

							<div className="flex-1 text-sm">
								<p>
									<span className="font-medium">
										{n.user}
									</span>{" "}
									<span className="text-muted">
										{n.message}
									</span>
								</p>
								<p className="text-xs text-muted mt-1">
									{n.time}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Footer */}
			<div className="px-4 py-3 border-t border-border text-center">
				<button className="text-sm text-accent hover:underline">
					View all notifications
				</button>
			</div>
		</div>
	);
}
