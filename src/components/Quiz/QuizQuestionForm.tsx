import {
    FormControl,
    FormControlLabel,
    // FormHelperText,
    FormLabel,
    Radio,
    RadioGroup,
    RadioProps,
    withStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import './media.scss';
import { QuizQuestion } from './QuizQuestion';
import check from 'assets/images/check.svg';
import thales from 'assets/images/red-thales.png';

type QuizQuestionProps = {
    question: QuizQuestion;
    handleRadioChange: (event: any, answer: any) => void;
};

export const QuizQuestionForm: React.FC<QuizQuestionProps> = ({ question, handleRadioChange }: QuizQuestionProps) => {
    const [selectedAnswer, setSelectedAnswer] = useState(0);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(true);
    const [showOverlay, setShowOverlay] = useState(false);
    const onClick = () => (showOverlay ? setShowOverlay(false) : setShowOverlay(true));

    useEffect(() => {
        console.log('works, too');
        if (selectedAnswer) {
            question.correctAnswer === selectedAnswer
                ? (setIsAnswerCorrect(true), setShowOverlay(true))
                : (setIsAnswerCorrect(false), setShowOverlay(true));
        }
    }, [selectedAnswer]);

    return (
        <>
            <div
                className="quiz__modal-dialog__content__radio-form"
                style={{
                    border:
                        isAnswerCorrect && question.correctAnswer === selectedAnswer
                            ? '2px solid #00f9ff'
                            : !isAnswerCorrect && question.correctAnswer !== selectedAnswer
                            ? '2px solid #e53720'
                            : '',
                }}
            >
                <FormControl component="fieldset" style={{ width: '100%' }}>
                    <FormLabel component="legend" className="quiz__modal-dialog__content__radio-form__text">
                        {question.questionText}
                    </FormLabel>
                    <RadioGroup
                        onChange={(e) => handleRadioChange(e, question.correctAnswer)}
                        className="quiz__modal-dialog__content__radio-form__group"
                    >
                        {question.answers.map((answer) => {
                            return (
                                <>
                                    <FormControlLabel
                                        key={answer.index}
                                        value={answer.index}
                                        checked={selectedAnswer === answer.index}
                                        control={<RadioButton />}
                                        label={answer.index + '. ' + answer.answerText}
                                        labelPlacement="start"
                                        className="quiz__modal-dialog__content__radio-form__group__answer"
                                        onClick={(e) => {
                                            setSelectedAnswer(Number((e.target as HTMLInputElement).value));
                                        }}
                                    />
                                    {selectedAnswer === answer.index && isAnswerCorrect && showOverlay ? (
                                        <MessageOverlay
                                            onClick={onClick}
                                            className="quiz__modal-dialog__content__radio-form__group__overlay quiz__modal-dialog__content__radio-form__group__overlay--true"
                                        >
                                            <span>Your answer is correct!</span>{' '}
                                            <img
                                                className="quiz__modal-dialog__content__radio-form__group__overlay__image "
                                                src={check}
                                                style={{ marginTop: '-45px' }}
                                            ></img>
                                        </MessageOverlay>
                                    ) : selectedAnswer === answer.index && !isAnswerCorrect && showOverlay ? (
                                        <MessageOverlay
                                            onClick={onClick}
                                            className="quiz__modal-dialog__content__radio-form__group__overlay quiz__modal-dialog__content__radio-form__group__overlay--false"
                                        >
                                            <span>Ooops! Wrong answer!</span>
                                            <img
                                                className="quiz__modal-dialog__content__radio-form__group__overlay__image"
                                                src={thales}
                                                style={{ height: '180px', marginTop: '-85px' }}
                                            ></img>
                                        </MessageOverlay>
                                    ) : null}
                                </>
                            );
                        })}
                    </RadioGroup>
                </FormControl>
            </div>
        </>
    );
};

const RadioButton = withStyles({
    root: {
        color: '#00f9ff',
        '&$checked': {
            color: '#00f9ff',
        },
    },
    checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);

const MessageOverlay = styled.div``;
