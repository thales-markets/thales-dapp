import styled from 'styled-components';
import { FlexDivColumnCentered } from 'theme/common';

export const GridContainer = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: auto min-content;
    grid-gap: 1px;
    padding: 0;
    background: rgba(100, 217, 254, 0.6);
    border-radius: 15px;
    border: 1px solid rgba(100, 217, 254, 0.6);
    z-index: 0;
    width: 100%;
    overflow: hidden;
`;

export const StakeInfoItem = styled(FlexDivColumnCentered)`
    text-align: center;
    padding: 10px;
    grid-column: span 6;
    background: #04045a;
`;

export const StakingRewardsItem = styled(StakeInfoItem)<{
    orderOnMobile?: number;
}>`
    grid-column: span 4;
    @media (max-width: 767px) {
        grid-column: span 12 !important;
        order: ${(props) => props.orderOnMobile ?? 10};
    }
`;

export const StakingRewardsLabel = styled.span<{ color: string }>`
    height: 30px;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    color: #04045a;
    background: ${(props) => props.color};
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
    color: #f6f6fe;
`;

export const GridAction = styled(FlexDivColumnCentered)`
    grid-column: span 12;
    background: #04045a;
    padding: 20px 100px;
    @media (max-width: 767px) {
        padding: 20px 20px;
        order: 10;
    }
`;
