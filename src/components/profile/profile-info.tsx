import StreamingServices from "./streaming-services";

export default function ProfileInfo() {
	return (
		<div className="mt-16 px-6 md:px-24">
			<h2 className="text-2xl font-bold">Jane Doe</h2>
			<StreamingServices />
			<p className="mt-4 text-gray-300 text-sm max-w-lg">
				My name is Jane and I have a terrible memory, so this helps me
				keep all my TV shows and movies saved in one place.
			</p>
		</div>
	);
}
