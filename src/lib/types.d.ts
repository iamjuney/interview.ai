export type Interview = {
	id: string;
	createdAt: Date;
	slug: string;
	position: string;
	description: string;
	questions?: Question[];
};

export type Question = {
	id: string;
	slug: string;
	interviewId: string;
	question: string;
};
