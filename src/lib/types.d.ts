export enum Difficulty {
	Basic = 'Basic',
	Intermediate = 'Intermediate',
	Advanced = 'Advanced'
}

export type DetailResult = {
	word: string;
	errorType: string;
};

export type PronunciationAssessmentResult = {
	accuracyScore: number;
	pronunciationScore: number;
	fluencyScore: number;
	prosodyScore: number;
	data: DetailResult[];
};

export type UserInterview = {
	status: 'completed' | 'in-progress';
	id: string;
	createdAt: Date;
	userId: string;
	interviewId: string;
	interview?: Interview;
};

export type Interview = {
	id: string;
	createdAt: Date;
	interviewSlug: string;
	position: string;
	difficulty: string;
	duration: number;
	description: string;
	questions: Question[];
};

export type Question = {
	id: string;
	slug: string;
	interviewId: string;
	question: string;
	answers?: Answer[];
	videoUrl?: string;
};

export type Answer = {
	id: string;
	createdAt: Date;
	userId: string;
	answer: string;
	questionId: string;
	duration: number;
	videoUrl: string;
	assessment?: Assessment;
};

export type Assessment = {
	id: string;
	data: DetailResult[];
	answerId: string;
	feedback: string;
	accuracy_score: number;
	pronunciation_score: number;
	fluency_score: number;
	prosody_score: number;
};
