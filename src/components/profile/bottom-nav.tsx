import { Home, Search, User, Compass } from "lucide-react";
import Link from "next/link";

export default function BottomNav() {
	return (
		<div className="fixed bottom-0 w-full bg-[#070707] border-t border-gray-800 flex justify-around py-3 md:hidden">
			<Link
				href="/"
				className="flex flex-col items-center text-gray-400 hover:text-white"
			>
				<Home size={20} />
				<span className="text-xs">Home</span>
			</Link>
			<Link
				href="/diary"
				className="flex flex-col items-center text-gray-400 hover:text-white"
			>
				<Compass size={20} />
				<span className="text-xs">Diary</span>
			</Link>
			<Link
				href="/search"
				className="flex flex-col items-center text-gray-400 hover:text-white"
			>
				<Search size={20} />
				<span className="text-xs">Search</span>
			</Link>
			<Link
				href="/profile"
				className="flex flex-col items-center text-[#FF414E]"
			>
				<User size={20} />
				<span className="text-xs">Profile</span>
			</Link>
		</div>
	);
}