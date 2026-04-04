export interface List {
	id: number;
	title: string;
	description?: string;
	color: string;
	isPublic: boolean;
	items: Item[];
}

export interface Item {
	id: number;
	title: string;
	year: number;
	rating: number;
	emoji: string;
}
