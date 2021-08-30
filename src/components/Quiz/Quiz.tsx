import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import { ButtonContainer } from 'pages/Options/Earn/components';
import React, { useEffect, useState } from 'react';
import { Button } from 'theme/common';
import './media.scss';
import { QuizQuestion } from './QuizQuestion';
import { QuizQuestionForm } from './QuizQuestionForm';

type QuizProps = {
    quizData: QuizQuestion[];
    openQuiz: any;
    setOpenQuiz: (data: any) => void;
};

export const Quiz: React.FC<QuizProps> = ({ quizData, openQuiz, setOpenQuiz }: QuizProps) => {
    const [answeredQuestions, setAnsweredQuestions] = useState(0);
    const [isEveryQuestionAnswered, setIsEveryQuestionAnswered] = useState(false);

    useEffect(() => {
        quizData.length === answeredQuestions ? setIsEveryQuestionAnswered(true) : setIsEveryQuestionAnswered(false);
    }, [answeredQuestions]);

    const handleDialogClosing = () => {
        setOpenQuiz(false);
    };

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>, correctAnswer: number) => {
        const selectedAnswer = Number((event.target as HTMLInputElement).value);
        if (selectedAnswer === correctAnswer) {
            setAnsweredQuestions(answeredQuestions + 1);
        } else {
            answeredQuestions !== 0 ? setAnsweredQuestions(answeredQuestions - 1) : '';
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem('quizCompleted', 'true');
        handleDialogClosing();
    };

    return (
        <>
            <Dialog
                maxWidth="md"
                fullWidth={true}
                open={openQuiz}
                onClose={handleDialogClosing}
                className="quiz__modal-dialog"
                PaperProps={{
                    style: {
                        backgroundColor: '#04045a',
                        boxShadow: 'none',
                    },
                }}
            >
                <DialogTitle className="quiz__modal-dialog__title">Quiz</DialogTitle>
                <DialogContent className="quiz__modal-dialog__content">
                    <form onSubmit={handleSubmit} style={{ overflow: 'hidden' }}>
                        {quizData.map((quizQuestion, index) => {
                            return (
                                <QuizQuestionForm
                                    key={index}
                                    question={quizQuestion}
                                    handleRadioChange={handleRadioChange}
                                ></QuizQuestionForm>
                            );
                        })}
                        <ButtonContainer>
                            <Button type="submit" disabled={!isEveryQuestionAnswered}>
                                Submit answers
                            </Button>
                        </ButtonContainer>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Quiz;
