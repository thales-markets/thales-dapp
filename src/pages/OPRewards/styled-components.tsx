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
`;

export const RoundWrapper = styled(FlexDivStart)`
    font-size: 20px;
    color: var(--primary-color);
    align-items: center;
`;

export const RoundEndWrapper = styled(FlexDivStart)`
    margin-left: 15px;
    color: var(--primary-color);
`;

export const RoundEndLabel = styled.span`
    margin-right: 6px;
    color: var(--primary-color);
`;

export const SummaryWrapper = styled(FlexDivStart)`
    font-size: 18px;
    font-weight: bold;
    color: var(--primary-color);
    align-items: center;
    margin-bottom: 10px;
`;

export const SummaryInfo = styled(FlexDivStart)`
    :not(:last-child) {
        margin-right: 40px;
    }
`;

export const Description = styled.p`
    font-size: 16px;
    color: var(--primary-color);
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
