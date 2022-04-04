export interface QuizQuestion {
    questionText: string;
    answers: QuizAnswer[];
    correctAnswer: number;
}

export interface QuizAnswer {
    index: number;
    answerText: string;
}
