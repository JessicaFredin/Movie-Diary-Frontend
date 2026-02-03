import Image from "next/image";

export default function ProfileAvatar() {
	return (
		<div className="relative px-6 md:px-24">
			{/* Avatar */}
			<div className="absolute -top-12">
				<div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center">
					<Image
						src="/images/avatar.jpg"
						alt="Profile avatar"
						fill
						className="object-cover rounded-full border-2 border-[#FF414E] shadow-[0_0_15px_#FF414E]"
					/>
				</div>
			</div>
		</div>
	);
}
