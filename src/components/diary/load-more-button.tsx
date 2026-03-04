type Props = {
	onClick: () => void;
	disabled?: boolean;
};

export default function LoadMoreButton({ onClick, disabled }: Props) {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className="text-sm text-white hover:text-accent disabled:text-muted-2"
		>
			Load More ......
		</button>
	);
}
