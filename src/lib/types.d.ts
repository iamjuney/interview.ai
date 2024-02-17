export type DetailResult = {
	word: string;
	errorType?: string;
};

export type PronunciationAssessmentResult = {
	accuracyScore: number;
	pronunciationScore: number;
	fluencyScore: number;
	prosodyScore: number;
	data: DetailResult[];
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
	assessment: Assessment;
};

export type Assessment = {
	id: string;
	data: unknown;
	answerId: string;
	feedback: string;
	accuracy_score: number;
	pronunciation_score: number;
	fluency_score: number;
	prosody_score: number;
};
