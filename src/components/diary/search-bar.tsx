import { FiSearch } from "react-icons/fi";

type Props = {
	query: string;
	onChange: (val: string) => void;
};

export default function SearchBar({ query, onChange }: Props) {
	return (
		<div className="relative flex items-center">
			<FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
			<input
				type="text"
				placeholder="Search for movies & TV shows"
				value={query}
				onChange={(e) => onChange(e.target.value)}
				className="w-[300px] bg-transparent border-b border-[#FF414E] pl-10 py-1 text-white focus:outline-none"
			/>
		</div>
	);
}
