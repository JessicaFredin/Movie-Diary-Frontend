import { Icon } from "@iconify/react";

export default function ProfileStats() {
	return (
		<div className="flex flex-col items-end gap-4  text-sm pr-6">
			{/* Movies */}
			<div className="flex flex-col items-center">
				<Icon icon="fa-solid:user-friends" className="w-6 h-6" />
				<span className="mt-1">783</span>
			</div>

			{/* Reviews */}
			<div className="flex flex-col items-center">
				<Icon
					icon="pepicons-pop:clapperboard"
					className="text-white w-6 h-6"
				/>
				<span className="mt-1">120</span>
			</div>
		</div>
	);
}
