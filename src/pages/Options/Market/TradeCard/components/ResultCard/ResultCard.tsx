import React from 'react';
import styled, { css } from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRow } from 'theme/common';
import { OptionSide } from 'types/options';
import OptionResult from '../OptionResult';

type ResultCardProps = {
    title: React.ReactNode;
    subTitle: React.ReactNode;
    longAmount: number;
    shortAmount: number;
    result?: OptionSide;
    exercised?: boolean;
};

const ResultCard: React.FC<ResultCardProps> = ({ title, subTitle, longAmount, shortAmount, result, exercised }) => (
    <Container>
        <Title>{title}</Title>
        <SubTitle>
            <span>{subTitle}</span>
        </SubTitle>
        <OptionResults result={result} exercised={exercised}>
            <OptionResult side="long" amount={longAmount} />
            <OptionResult side="short" amount={shortAmount} />
        </OptionResults>
    </Container>
);

const Container = styled(FlexDivColumn)``;

const Title = styled(FlexDivCentered)`
    font-style: normal;
    font-weight: 600;
    font-size: 25px;
    line-height: 48px;
    color: #f6f6fe;
`;

const SubTitle = styled(Title)`
    font-size: 20px;
    line-height: 40px;
    letter-spacing: 0.15px;
    margin-top: 20px;
    margin-bottom: 30px;
`;

const OptionResults = styled(FlexDivRow)<{ result?: OptionSide; exercised?: boolean }>`
    ${(props) =>
        props.result &&
        css`
            .long {
                opacity: ${props.result === 'long' ? 1 : 0.5};
            }
            .short {
                opacity: ${props.result === 'short' ? 1 : 0.5};
            }
        `}
    ${(props) =>
        props.exercised &&
        css`
            .long,
            .short {
                opacity: 0.5;
            }
        `}
`;

export default ResultCard;
