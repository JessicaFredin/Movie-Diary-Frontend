export interface Comment {
	id: string;
	author: string;
	avatar?: string;
	initials: string;
	date: string;
	text: string;
	likes: number;
	liked: boolean;
	replies?: Comment[];
}
