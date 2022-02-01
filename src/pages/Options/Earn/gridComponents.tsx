import styled from 'styled-components';
import { FlexDiv, FlexDivColumnCentered, FlexDivRowCentered } from 'theme/common';

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

export const StakeInfoLabel = styled.span`
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    color: #b8c6e5;
`;

export const StakeInfoContent = styled.span`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    color: #f6f6fe;
`;

export const StakingRewardsItem = styled(StakeInfoItem)<{
    orderOnMobile?: number;
}>`
    grid-column: span 3;
    @media (max-width: 767px) {
        grid-column: span 12 !important;
        order: ${(props) => props.orderOnMobile ?? 10};
    }
`;

export const StakingRewardsHeaderLabel = styled(StakeInfoLabel)``;
export const StakingRewardsHeaderContent = styled(StakeInfoContent)``;

export const StakingRewardsNotice = styled(StakeInfoLabel)`
    font-size: 12px;
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

export const BonusRewardButton = styled.a`
    background: linear-gradient(190.01deg, #516aff -17.89%, #8208fc 90.41%);
    border: none;
    border-radius: 15px;
    min-height: 24px;
    text-transform: uppercase;
    padding: 1px;
    color: #f6f6fe;
    &:hover:not(:disabled) {
        cursor: pointer;
        background: #00f9ff;
        color: #00f9ff;
    }
    pointer-events: auto;
    width: fit-content;
    align-self: center;
    margin-top: 15px;
`;

export const BonusRewardInnerButton = styled(FlexDivRowCentered)`
    font-weight: 500;
    font-size: 10px;
    line-height: 24px;
    font-variant: small-caps;
    text-transform: uppercase;
    background: #04045a;
    border-radius: 15px;
    text-align: center;
    padding-left: 12px;
    padding-right: 12px;
`;

export const BonusInfo = styled(FlexDiv)`
    border-top: 1px solid #b8c6e5;
    margin-top: 6px;
    padding-top: 10px;
`;

export const BonusCurrent = styled(FlexDivColumnCentered)`
    margin-right: 15px;
    justify-content: start;
`;

export const BonusCurrentLabel = styled.span`
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    color: #b8c6e5;
`;

export const BonusCurrentContent = styled.span`
    font-weight: 500;
    font-size: 16px;
    line-height: 32px;
    color: #f6f6fe;
`;

export const BonusNeeded = styled(FlexDivColumnCentered)`
    text-align: start;
`;

export const BonusNeededLabel = styled.span`
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    color: #f6f6fe;
`;

export const BonusNeededContent = styled.span`
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    color: #50ce99;
`;

export const MaxBonusNotice = styled.span`
    margin-top: 15px;
    height: 24px;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    color: #64d9fe;
    text-shadow: -2px -2px 10px rgba(100, 217, 254, 0.4), 2px 2px 10px rgba(100, 217, 254, 0.4);
    text-transform: uppercase;
`;
