type Props = {
	onClick: () => void;
	disabled?: boolean;
};

export default function LoadMoreButton({ onClick, disabled }: Props) {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className="text-sm text-white hover:text-[#FF414E] disabled:text-gray-500"
		>
			Load More ......
		</button>
	);
}
