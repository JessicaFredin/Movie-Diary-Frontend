"use client";

export default function SettingsPage() {
	return (
		<main className="px-6 md:px-24 py-12 text-white">
			<h1 className="text-2xl font-semibold mb-8">Settings</h1>

			<div className="space-y-10 max-w-3xl">
				{/* PROFILE */}
				<section className="bg-white/5 rounded-xl p-6">
					<h2 className="text-lg font-medium mb-4">Profile</h2>

					<div className="space-y-4">
						<div>
							<label className="text-sm text-white/70">
								Display name
							</label>
							<input
								type="text"
								placeholder="Your name"
								className="mt-1 w-full rounded-md bg-black/30 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
							/>
						</div>

						<div>
							<label className="text-sm text-white/70">
								Email
							</label>
							<input
								type="email"
								placeholder="you@email.com"
								className="mt-1 w-full rounded-md bg-black/30 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
							/>
						</div>
					</div>
				</section>

				{/* PREFERENCES */}
				<section className="bg-white/5 rounded-xl p-6">
					<h2 className="text-lg font-medium mb-4">Preferences</h2>

					<div className="space-y-4">
						<label className="flex items-center justify-between">
							<span className="text-white/80">Dark mode</span>
							<input type="checkbox" className="accent-white" />
						</label>

						<label className="flex items-center justify-between">
							<span className="text-white/80">Show ratings</span>
							<input type="checkbox" className="accent-white" />
						</label>

						<label className="flex items-center justify-between">
							<span className="text-white/80">
								Autoplay trailers
							</span>
							<input type="checkbox" className="accent-white" />
						</label>
					</div>
				</section>

				{/* DIARY */}
				<section className="bg-white/5 rounded-xl p-6">
					<h2 className="text-lg font-medium mb-4">Diary</h2>

					<div className="space-y-4">
						<label className="flex items-center justify-between">
							<span className="text-white/80">
								Default status when adding
							</span>
							<select className="bg-black/30 border border-white/10 rounded-md px-3 py-2">
								<option>Watching</option>
								<option>Planned</option>
								<option>Completed</option>
							</select>
						</label>

						<label className="flex items-center justify-between">
							<span className="text-white/80">
								Enable diary reminders
							</span>
							<input type="checkbox" className="accent-white" />
						</label>
					</div>
				</section>

				{/* DANGER ZONE */}
				<section className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
					<h2 className="text-lg font-medium text-red-400 mb-4">
						Danger zone
					</h2>

					<div className="flex items-center justify-between">
						<span className="text-white/70">
							Clear all diary entries
						</span>
						<button className="px-4 py-2 rounded-md bg-red-500/20 text-red-300 hover:bg-red-500/30">
							Clear
						</button>
					</div>
				</section>

				{/* SAVE */}
				<div className="flex justify-end">
					<button className="px-6 py-2 rounded-md bg-white text-black hover:bg-white/90">
						Save changes
					</button>
				</div>
			</div>
		</main>
	);
}
