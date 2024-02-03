export type Interview = {
	id: string;
	createdAt: Date | null;
	slug: string;
	position: string;
	description: string;
	questions: {
		id: string;
		slug: string;
		interviewId: string;
		question: string;
	}[];
};
