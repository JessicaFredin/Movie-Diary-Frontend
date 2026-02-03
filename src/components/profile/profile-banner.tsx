import Image from "next/image";

export default function ProfileBanner() {
	return (
		<div className="relative w-full h-40 md:h-72 lg:h-80">
			<Image
				src="/images/profile-banner.jpg"
				alt="Profile banner"
				fill
				className="object-cover"
				priority
			/>
		</div>
	);
}
