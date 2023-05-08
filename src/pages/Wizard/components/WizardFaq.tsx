import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import arrowDown from 'assets/images/wizard/arrow-down.svg';
import arrowUp from 'assets/images/wizard/arrow-up.svg';
import SPAAnchor from 'components/SPAAnchor';

const WizardFaq: React.FC = () => {
    const [questionOpenedIndex, setQuestionOpenedIndex] = useState(-1);

    const data = [
        {
            question: 'wizard-page.question1',
            answer: 'wizard-page.answer1',
        },
        {
            question: 'wizard-page.question2',
            answer: 'wizard-page.answer2',
        },
        {
            question: 'wizard-page.question3',
            answer: 'wizard-page.answer3',
        },
        {
            question: 'wizard-page.question4',
            answer: 'wizard-page.answer4',
        },
        {
            question: 'wizard-page.question5',
            answer: 'wizard-page.answer5',
        },
        {
            question: 'wizard-page.question6',
            answer: 'wizard-page.answer6',
        },
        {
            question: 'wizard-page.question7',
            answer: 'wizard-page.answer7',
        },
        {
            question: 'wizard-page.question8',
            answer: 'wizard-page.answer8',
        },
        {
            question: 'wizard-page.question9',
            answer: 'wizard-page.answer9',
        },
        {
            question: 'wizard-page.question10',
            answer: 'wizard-page.answer10',
        },
        {
            question: 'wizard-page.question11',
            answer: 'wizard-page.answer11',
        },
        {
            question: 'wizard-page.question12',
            answer: 'wizard-page.answer12',
        },
        {
            question: 'wizard-page.question13',
            answer: 'wizard-page.answer13',
            linkUrl: 'https://www.youtube.com/watch?v=sWiOiW5VTdE&t=63s',
            linkText: 'wizard-page.question13-link-text',
        },
        {
            question: 'wizard-page.question14',
            answer: 'wizard-page.answer14',
            linkUrl: 'https://www.youtube.com/watch?v=8oIgCT8GTd0&t=401s',
            linkText: 'wizard-page.question14-link-text',
        },
        {
            question: 'wizard-page.question15',
            answer: 'wizard-page.answer15',
        },
        {
            question: 'wizard-page.question16',
            answer: 'wizard-page.answer16',
        },
    ];

    return (
        <>
            <FaqHeader>{'FAQ'}</FaqHeader>
            {data.map((qa, index) => {
                return (
                    <React.Fragment key={index}>
                        <QuestionGroup
                            key={'qg' + index}
                            questionOpened={questionOpenedIndex === index}
                            onClick={() => {
                                setQuestionOpenedIndex(questionOpenedIndex !== index ? index : -1);
                            }}
                        >
                            <Question key={'q' + index}>
                                <Trans
                                    i18nKey={qa.question}
                                    components={{
                                        b: <strong />,
                                    }}
                                />
                                {!!qa.linkUrl && (
                                    <SPAAnchor href={qa.linkUrl}>
                                        {' ('}
                                        <Trans i18nKey={qa.linkText} />
                                        {')'}
                                    </SPAAnchor>
                                )}
                            </Question>

                            {questionOpenedIndex === index && (
                                <Answer key={'a' + index} onClick={(e) => e.stopPropagation()}>
                                    <Trans
                                        i18nKey={qa.answer}
                                        components={{
                                            b: <strong />,
                                        }}
                                    />
                                </Answer>
                            )}
                            <ToggleQuestion key={'tq' + index} questionOpened={questionOpenedIndex === index} />
                        </QuestionGroup>
                        <LineUnderQuestion key={'luq' + index} />
                    </React.Fragment>
                );
            })}
        </>
    );
};

const FaqHeader = styled.p`
    font-family: ${(props) => props.theme.fontFamily};
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 33px;
    color: var(--color-white);
    margin-top: 30px;
    margin-bottom: 20px;
`;

const QuestionGroup = styled.div<{ questionOpened: boolean }>`
    width: 100%;
    display: ${(props) => (props.questionOpened ? '' : 'flex')};
    justify-content: space-between;
    cursor: pointer;
`;

const Question = styled.p`
    font-family: ${(props) => props.theme.fontFamily};
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 54px;
    color: var(--color-white);
    padding-left: 30px;
    span {
        text-transform: lowercase;
    }
`;

const ToggleQuestion = styled.div<{ questionOpened: boolean }>`
    content: url(${(props) => (props.questionOpened ? arrowUp : arrowDown)});
    padding-right: 20px;
    padding-bottom: ${(props) => (props.questionOpened ? '20px' : '')};
    padding-top: ${(props) => (props.questionOpened ? '10px' : '')};
    margin-left: ${(props) => (props.questionOpened ? 'auto' : '')};
    margin-right: ${(props) => (props.questionOpened ? '0' : '')};
`;

const Answer = styled.p`
    font-family: ${(props) => props.theme.fontFamily};
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    text-align: justify;
    color: var(--color-white);
    cursor: text;
`;

const LineUnderQuestion = styled.div`
    height: 4px;
    border-radius: 3px;
    background: rgba(100, 217, 254, 0.5);
    width: 100%;
`;

export default WizardFaq;
