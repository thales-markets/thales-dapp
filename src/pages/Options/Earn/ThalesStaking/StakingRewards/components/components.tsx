import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivRowCentered } from 'theme/common';

export const Conatiner = styled(FlexDivColumnCentered)``;

export const Title = styled(FlexDivColumnCentered)`
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: #ffffff;
    text-align: start;
    margin-bottom: 15px;
`;

export const Description = styled(FlexDivColumnCentered)`
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: #f6f6fe;
    text-align: justify;
    margin-bottom: 20px;
`;

export const Formula = styled(FlexDivRowCentered)`
    width: fit-content;
    align-self: center;
`;

export const FormulaLeftSide = styled(FlexDivColumnCentered)`
    font-weight: 500;
    font-size: 15px;
    line-height: 16px;
    letter-spacing: 0.75px;
    align-self: center;
`;

export const FormulaAmount = styled(FlexDivColumnCentered)`
    padding-left: 2px;
    padding-right: 2px;
    border-bottom: 1.44px solid #f6f6fe;
    align-self: center;
`;

export const FormulaRequiredAmount = styled(FlexDivColumnCentered)`
    align-self: center;
    white-space: nowrap;
    padding-left: 2px;
    padding-right: 2px;
`;

export const FormulaSign = styled(FlexDivRowCentered)`
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0.25px;
    margin-left: 2px;
    margin-right: 2px;
`;

export const FormulaRightSide = styled(FlexDivColumnCentered)`
    font-weight: 500;
    font-size: 40px;
    line-height: 32px;
    letter-spacing: -2px;
`;

export const Link = styled.a`
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.25px;
    text-decoration-line: underline;
    color: #ffffff;
    text-align: center;
    margin-top: 40px;
    &:hover:not(:disabled) {
        cursor: pointer;
        color: #00f9ff;
    }
`;
