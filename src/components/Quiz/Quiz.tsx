import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import close from 'assets/images/close.svg';
import { LightTooltip } from 'pages/Options/Market/components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'theme/common';
import './media.scss';
import { QuizQuestion } from './QuizQuestion';
import { QuizQuestionForm } from './QuizQuestionForm';
import discord from 'assets/images/discord.svg';
import styled from 'styled-components';
import { ButtonContainer } from 'pages/Options/Earn/components';

type QuizProps = {
    quizData: QuizQuestion[];
    openQuiz: any;
    setOpenQuiz: (data: any) => void;
};

export const Quiz: React.FC<QuizProps> = ({ quizData, openQuiz, setOpenQuiz }: QuizProps) => {
    const { t } = useTranslation();
    const [answeredQuestionsTotal, setAnsweredQuestionsTotal] = useState([] as any);
    const [answeredQuestionsPerPage, setAnsweredQuestionsPerPage] = useState([] as any);
    const [pageNumber, setPageNumber] = useState(0);
    const [everyQuestionOnPageAnswered, setEveryQuestionOnPageAnswered] = useState(false);
    const [isEveryQuestionAnswered, setIsEveryQuestionAnswered] = useState(false);

    useEffect(() => {
        quizData.length === answeredQuestionsTotal.length
            ? setIsEveryQuestionAnswered(true)
            : setIsEveryQuestionAnswered(false);
    }, [answeredQuestionsTotal]);

    useEffect(() => {
        const lastPageDifference = quizData.length - answeredQuestionsTotal.length;
        const isLastPage = quizData.length / 6 < pageNumber;
        answeredQuestionsPerPage.length === 6 ||
        (lastPageDifference < 6 && lastPageDifference === answeredQuestionsPerPage.length && isLastPage)
            ? setEveryQuestionOnPageAnswered(true)
            : setEveryQuestionOnPageAnswered(false);
    }, [answeredQuestionsTotal]);

    const handleDialogClosing = () => {
        setOpenQuiz(false);
    };

    const numberOfPages = () => Math.ceil(quizData.length / 6) || 1;

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>, question: QuizQuestion) => {
        const selectedAnswer = Number((event.target as HTMLInputElement).value);
        if (selectedAnswer === question.correctAnswer) {
            const questionTexts = answeredQuestionsTotal.map((q: { question: string; answer: number }) => q.question);
            if (questionTexts.filter((text: string) => text === question.questionText).length === 0) {
                setAnsweredQuestionsTotal([
                    ...answeredQuestionsTotal,
                    { question: question.questionText, answer: question.correctAnswer },
                ]);
            }

            if (answeredQuestionsPerPage.length < 6) {
                const questionTextsPage = answeredQuestionsPerPage.map(
                    (q: { question: string; answer: number }) => q.question
                );
                if (questionTextsPage.filter((text: string) => text === question.questionText).length === 0) {
                    setAnsweredQuestionsPerPage([
                        ...answeredQuestionsPerPage,
                        { question: question.questionText, answer: question.correctAnswer },
                    ]);
                }
            }
        }
    };

    const moveToTheNextPage = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setAnsweredQuestionsPerPage([]);
        setPageNumber(pageNumber + 1);
        setEveryQuestionOnPageAnswered(false);
        const dialog = document.getElementById('retro-airdrop-quiz');
        dialog ? (dialog.scrollTop = 0) : '';
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
                <DialogTitle className="quiz__modal-dialog__title pale-grey">
                    <span className="quiz__modal-dialog__title__text">
                        {t('options.quiz.title')}{' '}
                        <div style={{ float: 'right' }}>
                            <LightTooltip title={t('options.quiz.discord-tip')}>
                                <a
                                    className="quiz__modal-dialog__title__link"
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://discord.gg/cFGv5zyVEj"
                                    style={{ marginRight: '30px' }}
                                >
                                    {t('options.quiz.discord-link')}
                                </a>
                            </LightTooltip>
                            <LightTooltip title={t('options.quiz.docs-tip')}>
                                <a
                                    className="quiz__modal-dialog__title__link"
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://docs.thales.market/"
                                    style={{ marginRight: '10px' }}
                                >
                                    {t('options.quiz.docs-link')}
                                </a>
                            </LightTooltip>

                            <Button
                                style={{ backgroundColor: 'transparent', float: 'right', marginTop: '8px' }}
                                onClick={handleDialogClosing}
                            >
                                <img src={close} />
                            </Button>
                        </div>
                    </span>
                </DialogTitle>
                <DialogContent className="quiz__modal-dialog__content" id="retro-airdrop-quiz">
                    <form onSubmit={handleSubmit} style={{ overflow: 'hidden' }}>
                        {quizData.map((quizQuestion, index) => {
                            return quizData.length <= 6 ? (
                                <QuizQuestionForm
                                    key={index}
                                    question={quizQuestion}
                                    handleRadioChange={handleRadioChange}
                                    answeredQuestionsPerPage={answeredQuestionsPerPage}
                                ></QuizQuestionForm>
                            ) : index < 6 && pageNumber === 0 ? (
                                <QuizQuestionForm
                                    key={index}
                                    question={quizQuestion}
                                    handleRadioChange={handleRadioChange}
                                    answeredQuestionsPerPage={answeredQuestionsPerPage}
                                ></QuizQuestionForm>
                            ) : (
                                pageNumber >= 1 &&
                                index >= 6 * pageNumber &&
                                index < 6 * (pageNumber + 1) && (
                                    <QuizQuestionForm
                                        key={index}
                                        question={quizQuestion}
                                        handleRadioChange={handleRadioChange}
                                        answeredQuestionsPerPage={answeredQuestionsPerPage}
                                    ></QuizQuestionForm>
                                )
                            );
                        })}
                        <ButtonContainer
                            style={{
                                display: 'block',
                                float: 'left',
                                marginBottom: '10px',
                                marginLeft: window.innerWidth > 767 ? '20px' : '0px',
                            }}
                        >
                            <Button
                                style={{
                                    background:
                                        'linear-gradient(90deg, #3936C7 -8.53%, #2D83D2 52.71%, #23A5DD 105.69%, #35DADB 127.72%)',
                                    height: '40px',
                                }}
                            >
                                <LinkImage
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://discord.gg/cFGv5zyVEj"
                                    style={{ color: 'white', verticalAlign: 'top' }}
                                >
                                    {window.innerWidth > 767 ? t('options.quiz.discord-button') : 'Discord'}
                                </LinkImage>
                            </Button>
                        </ButtonContainer>

                        <ButtonContainer
                            style={{
                                display: 'block',
                                float: 'right',
                                marginBottom: '10px',
                                marginRight: window.innerWidth > 767 ? '25px' : '0px',
                            }}
                        >
                            {quizData.length === answeredQuestionsTotal.length || pageNumber + 1 === numberOfPages() ? (
                                <Button
                                    type="submit"
                                    disabled={!isEveryQuestionAnswered}
                                    style={{
                                        background: '#3936C7',
                                    }}
                                >
                                    {window.innerWidth > 900 ? t('options.quiz.submit-answers') : 'Submit'}
                                </Button>
                            ) : (
                                <Button
                                    onClick={(e) => moveToTheNextPage(e)}
                                    disabled={!everyQuestionOnPageAnswered}
                                    style={{
                                        background: '#3936C7',
                                    }}
                                >
                                    {t('options.quiz.next-page')}
                                </Button>
                            )}
                        </ButtonContainer>
                        {quizData.length > 6 && (
                            <div className="pale-grey quiz__modal-dialog__content__page-number">
                                {pageNumber + 1 + ' of ' + numberOfPages()}
                            </div>
                        )}
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Quiz;

export const LinkImage = styled.a`
    &:after {
        content: url(${discord});
        margin-left: 10px;
        vertical-align: top;
    }
`;
