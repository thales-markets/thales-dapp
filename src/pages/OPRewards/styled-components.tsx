import { ScreenSizeBreakpoint } from 'enums/ui';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivRow, FlexDivColumnCentered } from 'theme/common';

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const Description = styled.div`
    font-size: 16px;
    line-height: 18px;
    color: ${(props) => props.theme.textColor.primary};
    margin-bottom: 10px;
    p {
        margin-bottom: 10px;
    }
    ul {
        list-style: initial;
        margin-left: 50px;
        margin-bottom: 15px;
    }
    li {
        margin-bottom: 8px;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 13px;
        line-height: 15px;
    }
`;

export const SummaryWrapper = styled(FlexDivColumnCentered)`
    color: ${(props) => props.theme.textColor.primary};
    align-items: center;
    margin-bottom: 10px;
`;

export const SummaryRow = styled(FlexDivRow)`
    width: 100%;
    white-space: nowrap;
    height: 44px;
    margin-bottom: 10px;
    gap: 10px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
        align-items: center;
        height: initial;
    }
`;

export const SummaryItem = styled(FlexDivCentered)<{ width?: string; mobileDirection?: string }>`
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 8px;
    padding: 0px 15px;
    width: ${(props) => props.width || '100%'};
    line-height: 28px;
    font-size: 18px;
    font-weight: bold;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 100%;
        font-size: 15px;
        flex-direction: ${(props) => props.mobileDirection || 'row'};
        align-items: center;
    }
`;

export const SummarySubItem = styled(FlexDivCentered)`
    :last-child {
        border-left: 2px solid ${(props) => props.theme.borderColor.primary};
    }
    width: 100%;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        :last-child {
            border-left: none;
        }
    }
`;

export const SummaryLabel = styled.label`
    color: ${(props) => props.theme.textColor.secondary};
    text-transform: uppercase;
`;

export const SummaryInfo = styled.span`
    margin-left: 6px;
`;

export const MyRewardsContainer = styled(FlexDivCentered)`
    width: 100%;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        :not(:first-child) {
            margin-bottom: 4px;
        }
    }
`;

export const MyRewardsTotal = styled.span`
    color: ${(props) => props.theme.textColor.quaternary};
    border-right: 2px solid ${(props) => props.theme.borderColor.primary};
    padding-right: 6px;
    margin-right: 6px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 50%;
        text-align: end;
    }
`;

export const MyRewardsList = styled(FlexDivColumnCentered)``;

export const MyRewards = styled.span`
    font-size: 13px;
    line-height: 15px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 50%;
    }
`;

export const BoldText = styled.span`
    font-weight: 900;
`;

export const StyledLink = styled.a`
    color: ${(props) => props.theme.link.textColor.secondary};
    &:hover {
        text-decoration: underline;
    }
`;

export const LoaderContainer = styled(FlexDivCentered)`
    position: relative;
    min-height: 220px;
    width: 100%;
`;
