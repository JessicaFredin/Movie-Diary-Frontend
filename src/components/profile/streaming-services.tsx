"use client";

import { SiNetflix, SiHbo, SiApple } from "react-icons/si";

export default function StreamingServices() {
	return (
		<div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded-xl w-fit mt-4">
			<SiNetflix size={16} className="text-white" /> |
			<SiHbo size={16} className="text-white" /> |
			<SiApple size={16} className="text-white" /> |
			<span className="text-sm text-white">+2</span>
			<button className="ml-2 bg-[#FF414E] text-white text-xs px-3 py-1 rounded-full hover:bg-[#e63946] transition">
				Add
			</button>
		</div>
	);
}
