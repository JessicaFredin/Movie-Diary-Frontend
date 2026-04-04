"use client";

import { List } from "@/types/list";

import ModalWrapper from "@/components/ui/modal-wrapper";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import ColorPicker from "@/components/ui/color-picker";
import ToggleSwitch from "@/components/ui/toggle-switch";

type Props = {
	list: List;
	close: () => void;
};

export default function EditListModal({ list, close }: Props) {
	return (
		<ModalWrapper close={close}>
			<h2 className="text-xl font-semibold mb-6">Edit List</h2>

			<Input label="Title" defaultValue={list.title} />

			<Textarea label="Description" defaultValue={list.description} />

			<ColorPicker />

			<ToggleSwitch />

			<div className="flex justify-end gap-4 mt-8">
				<button onClick={close} className="text-muted">
					Cancel
				</button>

				<button className="bg-accent px-4 py-2 rounded-lg text-black">
					Save Changes
				</button>
			</div>
		</ModalWrapper>
	);
}
