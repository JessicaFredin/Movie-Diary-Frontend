"use client";

import { useState } from "react";
import AddToDiaryButton from "@/components/diary/add-to-diary-button";
import AddToDiaryModal from "@/components/diary/add-to-diary-modal";
import { isInDiary } from "@/utils/is-in-diary";

type Props = {
	id: number;
	title: string;
	poster: string;
	backdrop: string;
};

export default function MovieDiaryActions({
	id,
	title,
	poster,
	backdrop,
}: Props) {
	const [open, setOpen] = useState(false);

	const alreadyAdded = isInDiary(id, "movie");
    

	return (
		<>
			{/* MAIN ADD BUTTON */}
			<AddToDiaryButton
				variant="pill"
				isAdded={alreadyAdded}
				onClick={() => {
					if (!alreadyAdded) {
						setOpen(true);
					}
				}}
			/>

			{/* MODAL */}
			{open && (
				<AddToDiaryModal
					open={open}
					onClose={() => setOpen(false)}
					content={{
						id,
						type: "movie",
						title,
						poster,
						backdrop,
					}}
				/>
			)}
		</>
	);
}
