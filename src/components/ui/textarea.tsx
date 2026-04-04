"use client";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	label: string;
};

export default function Textarea({ label, ...props }: TextareaProps) {
	return (
		<div className="flex flex-col gap-1 w-full mb-4">
			{label && (
				<label className="text-sm font-medium text-muted">
					{label}
				</label>
			)}

			<textarea
				{...props}
				className="px-4 py-3 rounded-xl bg-surface-muted text-white border border-border-strong 
                   focus:border-accent focus:ring-1 focus:ring-accent outline-none"
			/>
		</div>
	);
}
