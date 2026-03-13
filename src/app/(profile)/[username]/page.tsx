"use client";

import {
	Heart,
	UserPlus,
	MessageCircle,
	Lock,
	Trophy,
	Users,
	Film,
} from "lucide-react";

export default function UserProfilePage() {
	const isFriend = false;

	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* ================= BANNER ================= */}
			<div className="relative h-[300px] w-full overflow-hidden">
				<img
					src="/images/profile-banner.jpg"
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-black/40" />
			</div>

			{/* ================= PROFILE SECTION ================= */}
			<div className="relative bg-background">
				{/* Avatar overlapping banner */}
				<div className="max-w-6xl mx-auto px-6 relative">
					<div className="absolute -top-20 left-6">
						<img
							src="/images/avatar.jpg"
							className="w-36 h-36 rounded-2xl object-cover border-4 border-background shadow-2xl"
						/>
					</div>
				</div>

				{/* Content Section */}
				<div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
					<div className="grid md:grid-cols-[1fr_auto] gap-12">
						{/* LEFT SIDE */}
						<div className="space-y-5">
							<h1 className="text-3xl font-semibold">Jane Doe</h1>

							<p className="text-muted text-sm max-w-xl leading-relaxed">
								My name is Jane and I have a terrible memory, so
								I help me a lot to have all my films and movies
								saved in one place, in this beautiful diary.
							</p>

							<div className="flex items-center gap-6 text-sm text-muted">
								<div className="flex items-center gap-2">
									<Users size={14} />4 mutual friends
								</div>

								<div className="flex items-center gap-2">
									<Heart size={14} className="text-accent" />
									78% match
								</div>
							</div>

							<div>
								<div className="inline-flex bg-surface-elevated border border-border rounded-full px-4 py-1.5 text-xs">
									Early Adopter
								</div>
							</div>
						</div>

						{/* RIGHT SIDE */}
						<div className="flex flex-col items-end gap-8">
							{/* Stats */}
							<div className="grid grid-cols-3 gap-12 text-center">
								<div>
									<p className="text-xl font-semibold">198</p>
									<p className="text-xs text-muted">MOVIES</p>
								</div>
								<div>
									<p className="text-xl font-semibold">34</p>
									<p className="text-xs text-muted">SHOWS</p>
								</div>
								<div>
									<p className="text-xl font-semibold">87</p>
									<p className="text-xs text-muted">
										REVIEWS
									</p>
								</div>
							</div>

							{/* Buttons */}
							<div className="flex gap-4">
								<button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm transition">
									<UserPlus size={16} />
									Add Friend
								</button>

								<button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border text-muted hover:border-accent hover:text-accent hover:bg-accent/10 transition">
									<MessageCircle size={16} />
									Message
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* ================= ACHIEVEMENTS ================= */}
			<div className="max-w-6xl mx-auto px-6 mb-20">
				<h2 className="text-lg font-semibold mb-6">Achievements</h2>

				<div className="grid md:grid-cols-2 gap-6">
					<div className="bg-surface border border-border rounded-2xl p-6 flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Trophy className="text-muted" />
							<div>
								<p className="font-medium">First Review</p>
								<p className="text-muted text-sm">
									Write your first review
								</p>
							</div>
						</div>
						<p className="text-xs text-muted">Jan 2023</p>
					</div>

					<div className="bg-surface border border-accent/30 rounded-2xl p-6 flex items-center justify-between bg-gradient-to-r from-accent/10 to-transparent">
						<div className="flex items-center gap-4">
							<Film className="text-accent" />
							<div>
								<p className="font-medium">Century Club</p>
								<p className="text-muted text-sm">
									Watch 100 movies
								</p>
							</div>
						</div>
						<p className="text-xs text-muted">Apr 2023</p>
					</div>
				</div>
			</div>

			{/* ================= RECENT DIARY ================= */}
			<div className="max-w-6xl mx-auto px-6 mb-28">
				<h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
					Recent Diary
					<Lock size={14} className="text-muted" />
				</h2>

				<div className="relative bg-surface border border-border rounded-2xl p-12 overflow-hidden">
					{/* Blur overlay */}
					<div className="absolute inset-0 backdrop-blur-md bg-background/70 flex flex-col items-center justify-center gap-4">
						<Lock className="text-muted" />
						<p className="text-muted text-sm text-center max-w-sm">
							Jane keeps their diary private. Send a request to
							view it.
						</p>
						<button className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-sm transition">
							Request Access
						</button>
					</div>

					{/* Fake blurred content */}
					<div className="opacity-30 space-y-3">
						<p>Dune: Part Two</p>
						<p>Aftersun</p>
						<p>The Holdovers</p>
					</div>
				</div>
			</div>
		</div>
	);
}
