"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { List } from "@/types/list";
import { initialLists } from "@/constants/mock-list";
import CreateListModal from "@/components/lists/create-list-modal";
import EditListModal from "@/components/lists/edit-list-modal";
import ListCard from "@/components/lists/list-card";
import ListDetails from "@/components/lists/list-details";

export default function ListsPage() {
	const [lists, setLists] = useState(initialLists);
	const [activeList, setActiveList] = useState<List | null>(null);

	const [showCreate, setShowCreate] = useState(false);
	const [showEdit, setShowEdit] = useState<List | null>(null);
	const [showAdd, setShowAdd] = useState(false);

	const [menuOpen, setMenuOpen] = useState<number | null>(null);

	if (activeList) {
		return (
			<ListDetails
				list={activeList}
				goBack={() => setActiveList(null)}
				showAdd={showAdd}
				setShowAdd={setShowAdd}
			/>
		);
	}

	return (
		<div className="max-w-5xl mx-auto p-8">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-semibold">My Lists</h1>
					<p className="text-muted">{lists.length} collections</p>
				</div>

				<button
					onClick={() => setShowCreate(true)}
					className="bg-accent px-5 py-2 rounded-xl flex items-center gap-2 text-black font-medium hover:bg-accent-hover"
				>
					<Plus size={16} /> New List
				</button>
			</div>

			<div className="grid grid-cols-2 gap-6">
				{lists.map((list) => (
					<ListCard
						key={list.id}
						list={list}
						openList={setActiveList}
						menuOpen={menuOpen}
						setMenuOpen={setMenuOpen}
						openEdit={setShowEdit}
					/>
				))}
			</div>

			{showCreate && (
				<CreateListModal close={() => setShowCreate(false)} />
			)}
			{showEdit && (
				<EditListModal
					list={showEdit}
					close={() => setShowEdit(null)}
				/>
			)}
		</div>
	);
}
