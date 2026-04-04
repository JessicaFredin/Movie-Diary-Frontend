"use client";

export default function ToggleSwitch() {
	return (
		<div className="flex items-center justify-between bg-surface-muted rounded-xl p-4 mt-4">
			<div>
				<p>Public List</p>
				<p className="text-sm text-muted">Anyone can see this list</p>
			</div>

			<div className="w-12 h-6 bg-accent rounded-full relative">
				<div className="w-5 h-5 bg-black rounded-full absolute right-1 top-0.5"></div>
			</div>
		</div>
	);
}
