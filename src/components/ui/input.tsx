import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
}

export default function Input({ label, ...props }: InputProps) {
	return (
		<div className="flex flex-col gap-1 w-full">
			{label && (
				<label className="text-sm font-medium text-gray-200">
					{label}
				</label>
			)}
			<input
				{...props}
				className="px-3 py-2 rounded-md bg-[#0F0F0F] text-white border border-[#2C2C2C] 
                   focus:border-[#FF414E] focus:ring-1 focus:ring-[#FF414E] outline-none"
			/>
		</div>
	);
}
