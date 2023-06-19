import { ScreenSizeBreakpoint } from 'enums/ui';
import { PieChart } from 'recharts';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivRow } from 'styles/common';

export const Container = styled(FlexDivRow)`
    width: 100%;
`;

const PieChartContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
    }
`;

export const VotedIn = styled(FlexDivColumnCentered)`
    margin: 0 15px 15px 15px;
`;

export const VotedInLabel = styled.span`
    font-weight: 500;
    font-size: 25px;
    line-height: 30px;
    color: ${(props) => props.theme.textColor.primary};
    text-align: center;
    margin-top: 5px;
`;

export const VoteNote = styled.span`
    font-weight: 300;
    font-size: 12px;
    line-height: 24px;
    text-align: center;
    color: ${(props) => props.theme.textColor.quaternary};
    text-transform: uppercase;
`;

export const Votes = styled.span`
    font-weight: 500;
    font-size: 20px;
    line-height: 48px;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
`;

export const StyledPieChartContainer = styled(PieChartContainer)`
    margin: 0 15px 15px 0;
`;

export const StyledPieChart = styled(PieChart)``;

export const ChartInnerText = styled(FlexDivColumnCentered)<{ isInProgress: boolean }>`
    position: absolute;
    bottom: 36%;
    left: 50%;
    transform: translate(-50%, 0);
    font-weight: ${(props) => (props.isInProgress ? 300 : 500)};
    font-size: 14px;
    line-height: ${(props) => (props.isInProgress ? 30 : 34)}px;
    color: ${(props) => props.theme.textColor.primary};
    text-transform: uppercase;
    text-align: center;
    width: 95px;
`;
