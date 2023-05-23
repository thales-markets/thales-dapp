import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ReactComponent as ArrowDown } from 'assets/images/wizard/arrow-down.svg';
import { ReactComponent as ArrowUp } from 'assets/images/wizard/arrow-up.svg';
import SPAAnchor from 'components/SPAAnchor';

const WizardFaq: React.FC = () => {
    const { t } = useTranslation();
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
                                    <SPAAnchor href={qa.linkUrl}>{`(${t(qa.linkText) as string})`}</SPAAnchor>
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
                            {questionOpenedIndex === index ? (
                                <StyledArrowUp key={'tq' + index} />
                            ) : (
                                <StyledArrowDown key={'tq' + index} />
                            )}
                        </QuestionGroup>
                    </React.Fragment>
                );
            })}
        </>
    );
};

const FaqHeader = styled.p`
    font-weight: 700;
    font-size: 22px;
    line-height: 33px;
    color: ${(props) => props.theme.textColor.primary};
    margin-top: 30px;
    margin-bottom: 20px;
`;

const QuestionGroup = styled.div<{ questionOpened: boolean }>`
    width: 100%;
    display: ${(props) => (props.questionOpened ? '' : 'flex')};
    justify-content: space-between;
    cursor: pointer;
    border: 2px solid ${(props) => props.theme.borderColor.tertiary};
    border-radius: 15px;
    position: relative;
    margin-bottom: 10px;
`;

const Question = styled.p`
    font-weight: 700;
    font-size: 18px;
    line-height: 16px;
    color: ${(props) => props.theme.textColor.quaternary};
    padding: 20px 60px 20px 30px;
    span {
        text-transform: lowercase;
    }
    @media (max-width: 767px) {
        padding: 15px 60px 15px 15px;
        font-size: 13px;
        line-height: 22px;
    }
    a {
        margin-left: 6px;
        display: initial;
        color: ${(props) => props.theme.link.textColor.secondary};
        &:hover {
            text-decoration: underline;
        }
    }
`;

const StyledArrowUp = styled(ArrowUp)`
    position: absolute;
    top: 20px;
    right: 30px;
    path {
        fill: ${(props) => props.theme.textColor.quaternary};
        fill-opacity: 1;
    }
    @media (max-width: 767px) {
        right: 15px;
        height: 12px;
    }
`;

const StyledArrowDown = styled(ArrowDown)`
    position: absolute;
    top: 20px;
    right: 30px;
    path {
        fill: ${(props) => props.theme.textColor.quaternary};
        fill-opacity: 1;
    }
    @media (max-width: 767px) {
        right: 15px;
        height: 12px;
    }
`;

const Answer = styled.p`
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
    text-align: justify;
    color: ${(props) => props.theme.textColor.primary};
    cursor: text;
    padding: 0 30px 20px 30px;
    @media (max-width: 767px) {
        padding: 0px 15px 15px 15px;
    }
`;

export default WizardFaq;
