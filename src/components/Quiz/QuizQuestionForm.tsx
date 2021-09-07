import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, RadioProps, withStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import './media.scss';
import { QuizQuestion } from './QuizQuestion';
import check from 'assets/images/check.svg';
import thales from 'assets/images/red-thales.png';
import { useTranslation } from 'react-i18next';

type QuizQuestionProps = {
    question: QuizQuestion;
    handleRadioChange: (event: any, answer: any) => void;
    answeredQuestionsPerPage: any[];
};

export const QuizQuestionForm: React.FC<QuizQuestionProps> = ({
    question,
    handleRadioChange,
    answeredQuestionsPerPage,
}: QuizQuestionProps) => {
    const { t } = useTranslation();
    const [selectedAnswer, setSelectedAnswer] = useState(0);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(true);
    const [answerIndex, setAnswerIndex] = useState(0);
    const [showOverlay, setShowOverlay] = useState(false);
    const onClick = () => (showOverlay ? setShowOverlay(false) : setShowOverlay(true));

    useEffect(() => {
        if (selectedAnswer) {
            question.correctAnswer === selectedAnswer
                ? (setIsAnswerCorrect(true),
                  setShowOverlay(true),
                  setTimeout(() => {
                      setShowOverlay(false);
                  }, 2000))
                : (setIsAnswerCorrect(false),
                  setShowOverlay(true),
                  setTimeout(() => {
                      setShowOverlay(false);
                  }, 2000));
        }
    }, [selectedAnswer]);

    const preserveSelectedAnswers = (question: any) => {
        const questionTexts = answeredQuestionsPerPage.map((q: { question: string; answer: number }) => q.question);
        return questionTexts.filter((text: string) => text === question.questionText).length === 0 ? false : true;
    };
    return (
        <>
            <div
                className="quiz__modal-dialog__content__radio-form pale-grey"
                style={{
                    border:
                        (isAnswerCorrect && question.correctAnswer === selectedAnswer) ||
                        preserveSelectedAnswers(question)
                            ? '2px solid #4fbf67'
                            : '',
                }}
            >
                <FormControl component="fieldset" style={{ width: '100%' }}>
                    <FormLabel component="legend" className="quiz__modal-dialog__content__radio-form__text pale-grey">
                        {question.questionText}
                    </FormLabel>
                    <RadioGroup
                        onChange={(e) => handleRadioChange(e, question)}
                        className="quiz__modal-dialog__content__radio-form__group"
                    >
                        {question.answers.map((answer, index) => {
                            return (
                                <>
                                    <FormControlLabel
                                        key={index + '' + answer.index}
                                        value={answer.index}
                                        disabled={preserveSelectedAnswers(question)}
                                        checked={
                                            selectedAnswer === answer.index ||
                                            (preserveSelectedAnswers(question) &&
                                                answer.index === question.correctAnswer)
                                        }
                                        control={<RadioButton />}
                                        label={answer.index + '. ' + answer.answerText}
                                        labelPlacement="start"
                                        className="quiz__modal-dialog__content__radio-form__group__answer no-select"
                                        onClick={(e) => {
                                            setAnswerIndex(answer.index);
                                            setSelectedAnswer(Number((e.target as HTMLInputElement).value));
                                        }}
                                    />
                                </>
                            );
                        })}
                    </RadioGroup>
                </FormControl>
                {selectedAnswer === answerIndex && isAnswerCorrect && showOverlay ? (
                    <MessageOverlay
                        onClick={onClick}
                        className={`quiz__modal-dialog__content__radio-form__group__overlay quiz__modal-dialog__content__radio-form__group__overlay--true ${
                            showOverlay ? 'alert-shown' : 'alert-hidden'
                        }`}
                    >
                        <span>{t('options.quiz.question.correct-answer')}</span>
                        <img
                            className="quiz__modal-dialog__content__radio-form__group__overlay__image "
                            src={check}
                            style={{ marginTop: '-45px' }}
                        ></img>
                    </MessageOverlay>
                ) : selectedAnswer === answerIndex && !isAnswerCorrect && showOverlay ? (
                    <MessageOverlay
                        onClick={onClick}
                        className={`quiz__modal-dialog__content__radio-form__group__overlay quiz__modal-dialog__content__radio-form__group__overlay--false ${
                            showOverlay ? 'alert-shown' : 'alert-hidden'
                        }`}
                    >
                        <span>{t('options.quiz.question.wrong-answer')}</span>
                        <img
                            className="quiz__modal-dialog__content__radio-form__group__overlay__image"
                            src={thales}
                            style={{ height: '180px', marginTop: '-85px' }}
                        ></img>
                    </MessageOverlay>
                ) : null}
            </div>
        </>
    );
};

const RadioButton = withStyles({
    root: {
        color: '#f6f6fe !important',
        '&$checked': {
            color: '#00f9ff !important',
        },
        '& svg': {
            width: '16px',
            height: '16px',
        },
    },
    checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);

const MessageOverlay = styled.div``;
