"use client";

import ModalWrapper from "@/components/ui/modal-wrapper";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import ColorPicker from "@/components/ui/color-picker";
import ToggleSwitch from "@/components/ui/toggle-switch";

type Props = {
	close: () => void;
};

export default function CreateListModal({ close }: Props) {
	return (
		<ModalWrapper close={close}>
			<h2 className="text-xl font-semibold mb-6">Create New List</h2>

			<Input label="Title" placeholder="e.g. Best Horror Movies" />

			<Textarea
				label="Description"
				placeholder="What's this list about?"
			/>

			<ColorPicker />

			<ToggleSwitch />

			<div className="flex justify-end gap-4 mt-8">
				<button onClick={close} className="text-muted">
					Cancel
				</button>

				<button className="bg-accent px-4 py-2 rounded-lg text-black">
					Create List
				</button>
			</div>
		</ModalWrapper>
	);
}
