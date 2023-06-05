import { ScreenSizeBreakpoint } from 'enums/ui';
import styled from 'styled-components';
import { FlexDivColumnCentered } from 'styles/common';

export const GridContainer = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: auto min-content;
    grid-gap: 1px;
    padding: 0;
    background: ${(props) => props.theme.borderColor.secondary};
    border-radius: 8px;
    border: 1px solid ${(props) => props.theme.borderColor.secondary};
    z-index: 0;
    width: 100%;
    overflow: hidden;
`;

const StakeInfoItem = styled(FlexDivColumnCentered)`
    text-align: center;
    padding: 10px;
    grid-column: span 6;
    background: ${(props) => props.theme.background.primary};
`;

export const StakingRewardsItem = styled(StakeInfoItem)<{
    orderOnMobile?: number;
}>`
    grid-column: span 4;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        grid-column: span 12 !important;
        order: ${(props) => props.orderOnMobile ?? 10};
    }
`;

export const StakingRewardsLabel = styled.span`
    height: 30px;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    color: ${(props) => props.theme.textColor.secondary};
    background: ${(props) => props.theme.background.secondary};
    border-radius: 5px;
    width: fit-content;
    padding: 3px 8px;
    align-self: center;
    margin: 6px 0;
`;

export const StakingRewardsContent = styled.span`
    font-weight: bold;
    font-size: 20px;
    line-height: 32px;
    letter-spacing: 0.5px;
    color: ${(props) => props.theme.textColor.primary};
`;

export const GridAction = styled(FlexDivColumnCentered)`
    grid-column: span 12;
    background: ${(props) => props.theme.background.primary};
    padding: 20px 100px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 20px 20px;
        order: 10;
    }
`;
