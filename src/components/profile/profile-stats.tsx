import { Film, Users } from "lucide-react";

type Props = {
	friendsCount?: number;
	loggedCount?: number;
};

export default function ProfileStats({
	friendsCount = 0,
	loggedCount = 0,
}: Props) {
	return (
		<div className="flex items-center gap-6 text-sm">
			<div className="flex flex-col items-center">
				<div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
					<Users className="h-5 w-5 text-white" />
				</div>

				<span className="text-lg font-bold text-white">
					{friendsCount}
				</span>

				<span className="text-xs uppercase tracking-wide text-muted">
					Friends
				</span>
			</div>

			<div className="flex flex-col items-center">
				<div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
					<Film className="h-5 w-5 text-white" />
				</div>

				<span className="text-lg font-bold text-white">
					{loggedCount}
				</span>

				<span className="text-xs uppercase tracking-wide text-muted">
					Logged
				</span>
			</div>
		</div>
	);
}
