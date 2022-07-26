import React from 'react';
import { LINKS } from 'constants/links';
import styled from 'styled-components';

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const HeaderWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
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

export const Tip56Link: React.FC = () => {
    return (
        <TooltipLink target="_blank" rel="noreferrer" href={LINKS.TradingIncentives.TIP56}>
            TIP-56
        </TooltipLink>
    );
};
