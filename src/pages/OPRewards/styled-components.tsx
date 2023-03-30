import React from 'react';
import { LINKS } from 'constants/links';
import styled from 'styled-components';
import { FlexDivRow, FlexDivStart } from 'theme/common';

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const HeaderWrapper = styled(FlexDivRow)`
    margin: 10px 0 20px 0;
    align-items: center;
    @media screen and (max-width: 767px) {
        flex-direction: column;
        div {
            align-self: center;
        }
    }
`;

export const RoundWrapper = styled(FlexDivStart)`
    font-size: 20px;
    color: var(--color-white);
    align-items: center;
    @media screen and (max-width: 767px) {
        flex-direction: column;
    }
`;

export const RoundEndWrapper = styled(FlexDivStart)`
    margin-left: 15px;
    margin-right: 15px;
    color: var(--color-white);
    @media screen and (max-width: 767px) {
        margin-left: 0px;
        margin-right: 0px;
        margin-top: 6px;
        margin-bottom: 10px;
    }
`;

export const RoundEndLabel = styled.span`
    margin-right: 6px;
    color: var(--color-white);
`;

export const SummaryWrapper = styled(FlexDivStart)`
    font-size: 18px;
    font-weight: bold;
    color: var(--color-white);
    align-items: center;
    margin-bottom: 10px;
    @media screen and (max-width: 767px) {
        flex-direction: column;
    }
`;

export const SummaryInfo = styled(FlexDivStart)`
    :not(:last-child) {
        margin-right: 40px;
    }
    @media screen and (max-width: 767px) {
        :not(:last-child) {
            margin-right: 0px;
            margin-bottom: 4px;
        }
    }
`;

export const Description = styled.p`
    font-size: 16px;
    color: var(--color-white);
    margin-bottom: 10px;
`;

export const BoldText = styled.span`
    font-weight: 900;
`;

export const TooltipLink = styled.a`
    color: #00f9ff;
    &:hover {
        color: rgb(116, 139, 198);
    }
`;

export const AddressLink = styled.a`
    color: #f6f6fe;
    &:hover {
        color: #00f9ff;
    }
`;

export const Tip53Link: React.FC = () => {
    return (
        <TooltipLink target="_blank" rel="noreferrer" href={LINKS.TradingIncentives.TIP53}>
            TIP-53
        </TooltipLink>
    );
};

export const GuidelinesLink: React.FC = () => {
    return (
        <TooltipLink target="_blank" rel="noreferrer" href={LINKS.TradingIncentives.Guidelines}>
            our blog post
        </TooltipLink>
    );
};
