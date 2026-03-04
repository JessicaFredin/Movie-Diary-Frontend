"use client";

interface FriendActivity {
	id: number;
	name: string;
	avatar: string;
}

interface Props {
	friends: FriendActivity[];
}

export default function MediaFriends({ friends }: Props) {
	if (!friends.length) return null;

	return (
		<div className="flex items-center gap-3">
			<div className="flex -space-x-3">
				{friends.slice(0, 5).map((friend) => (
					<div
						key={friend.id}
						className="w-8 h-8 rounded-full border-2 border-black overflow-hidden"
					>
						<img
							src={friend.avatar}
							alt={friend.name}
							className="w-full h-full object-cover"
						/>
					</div>
				))}
			</div>

			<p className="text-sm whitespace-nowrap">
				<span className="font-medium text-white">
					{friends.length} friends
				</span>{" "}
				<span className="text-muted">have watched this</span>
			</p>
		</div>
	);
}
