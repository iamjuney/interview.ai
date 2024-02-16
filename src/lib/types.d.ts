export type PronunciationAssessmentResult = {
	mispronunciations: number;
	accuracyScore: number;
	pronunciationScore: number;
	fluencyScore: number;
	prosodyScore: number;
	detailResult: [];
};

export type Interview = {
	id: string;
	createdAt: Date;
	slug: string;
	position: string;
	company: string;
	company_url: string;
	description: string;
	questions: Question[];
};

export type Question = {
	id: string;
	slug: string;
	interviewId: string;
	question: string;
	answers?: Answer[];
};

export type Answer = {
	id: string;
	createdAt: Date;
	userId: string;
	answer: string;
	questionId: string;
	videoUrl: string | null;
};
