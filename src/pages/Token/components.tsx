import React from 'react';
import styled from 'styled-components';
import { FlexDiv, FlexDivColumn, FlexDivColumnCentered, FlexDivRowCentered } from 'theme/common';
import { LINKS } from 'constants/links';
import balanceIcon from 'assets/images/token/balance-icon.svg';

export const EarnSection = styled.section<{
    orderOnMobile?: number;
    orderOnTablet?: number;
    paddingOnMobile?: number;
    spanOnTablet?: number;
}>`
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: 15px;
    color: white;
    padding: 15px 15px 10px 15px;
    max-width: 100%;
    @media screen and (max-width: 1024px) {
        grid-column: span ${(props) => props.spanOnTablet ?? 10} !important;
        order: ${(props) => props.orderOnTablet ?? 10};
    }
    @media (max-width: 767px) {
        grid-column: span 10 !important;
        order: ${(props) => props.orderOnMobile ?? 10};
        padding: ${(props) => props.paddingOnMobile ?? 2}px;
    }
`;

export const SectionHeader = styled(FlexDivRowCentered)`
    font-weight: 700;
    font-size: 20px;
    line-height: 20px;
    letter-spacing: 0.035em;
    color: #f6f6fe;
    text-transform: uppercase;
    min-height: 30px;
    padding: 0 20px;
    @media (max-width: 767px) {
        font-size: 16px;
        padding: 0px 5px;
        min-height: 25px;
        margin-bottom: 10px;
        flex-direction: column;
        align-items: start;
    }
`;

export const SectionContentContainer = styled(FlexDivColumn)`
    height: 100%;
    @media (max-width: 767px) {
        padding: 0 5px 0 5px;
    }
`;

export const ButtonContainer = styled(FlexDivColumnCentered)`
    margin-top: 20px;
    margin-bottom: 10px;
    align-items: center;
    @media (max-width: 768px) {
        margin-top: 10px;
    }
`;

export const ClaimMessage = styled.div<{ invisible?: boolean; color?: string; above?: boolean }>`
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: ${(props) => (props.color ? props.color : '#ffcc00')};
    ${(props) => (props.above ? 'margin-bottom: 10px;' : 'margin-top: 10px;')}
    visibility: ${(props) => (props.invisible ? 'hidden' : 'visible')};
    min-height: 16px;
    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

export const PieChartContainer = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    @media (max-width: 767px) {
        flex-direction: column;
    }
`;

export const PieChartCenterDiv = styled.div`
    position: absolute;
    top: 44%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
`;

export const PieChartCenterText = styled.span<{ disabled?: boolean }>`
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.25px;
    max-width: 200px;
    white-space: break-spaces;
    text-align: center;
    margin-bottom: 5px;
    color: ${(props) => (props.disabled ? '#B8C6E5' : 'white')};
`;

export const FullRow = styled(FlexDiv)`
    flex-basis: 100%;
    display: flex;
    font-size: 20px;
    justify-content: center;
    margin-bottom: 10px;
`;

export const TooltipLink = styled.a`
    color: #00f9ff;
    &:hover {
        color: rgb(116, 139, 198);
    }
`;

export const DescriptionLink = styled.a`
    color: var(--color-highlight);
    text-decoration: underline;
    &:hover {
        color: rgb(116, 139, 198);
    }
`;

export const BalanceIcon = styled.span`
    content: url(${balanceIcon});
    margin: 0 4px 2px 0;
`;

export const Line = styled.hr<{ margin?: string }>`
    height: 1px;
    color: var(--color-white);
    ${(props) => (props.margin ? `margin: ${props.margin}` : '')};
`;

export const DashedLine = styled.hr<{ gridRow: number; widthPer: number }>`
    border: none;
    border-bottom: 2px dashed var(--color-highlight) 80;
    grid-row: ${(props) => props.gridRow};
    grid-column: 1 / 13;
    width: ${(props) => props.widthPer}%;
    @media (max-width: 768px) {
        display: none;
    }
`;

export const DashedLineVertical = styled.hr<{
    gridRow: number;
    columnStart: number;
    marginTop: number;
    heightPer: number;
    marginLeft?: number;
    mobileLong?: boolean;
}>`
    border: none;
    border-left: 2px dashed var(--color-highlight) 80;
    grid-row: ${(props) => props.gridRow};
    grid-column-start: ${(props) => props.columnStart};
    margin-top: ${(props) => props.marginTop}px;
    height: ${(props) => props.heightPer}%;
    ${(props) => (props.marginLeft ? `margin-left: ${props.marginLeft}px;` : '')}
    @media (max-width: 768px) {
        ${(props) => (props.mobileLong ? 'position: absolute;' : '')}
        height: ${(props) => (props.mobileLong ? '153px' : '20px')};
        margin-top: -10px;
        margin-bottom: -10px;
        ${(props) => (props.marginLeft ? `margin-left: ${props.marginLeft}px;` : '')}
    }
`;

export const LearnMore = styled.span<{ top: string }>`
    position: absolute;
    bottom: 18%;
    left: 50%;
    transform: translate(-50%, 0);
    color: #f6f6fe;
    font-size: 14px;
    line-height: 24px;
    cursor: pointer;
    z-index: 101;
    height: 20px;
    @media (max-width: 767px) {
        top: ${(props) => props.top};
    }
`;

export const Tip66Link: React.FC = () => {
    return (
        <TooltipLink target="_blank" rel="noreferrer" href={LINKS.Token.TIP66}>
            TIP-66
        </TooltipLink>
    );
};

export const Tip17Link: React.FC = () => {
    return (
        <TooltipLink target="_blank" rel="noreferrer" href={LINKS.Token.TIP17}>
            TIP-17
        </TooltipLink>
    );
};

export const Tip20Link: React.FC = () => {
    return (
        <TooltipLink target="_blank" rel="noreferrer" href={LINKS.Token.TIP20}>
            TIP-20
        </TooltipLink>
    );
};

export const Tip23Link: React.FC = () => {
    return (
        <TooltipLink target="_blank" rel="noreferrer" href={LINKS.Token.TIP23}>
            TIP-23
        </TooltipLink>
    );
};

export const Tip37Link: React.FC = () => {
    return (
        <TooltipLink target="_blank" rel="noreferrer" href={LINKS.Token.TIP37}>
            TIP-37
        </TooltipLink>
    );
};

export const Tip48Link: React.FC = () => {
    return (
        <DescriptionLink target="_blank" rel="noreferrer" href={LINKS.Token.TIP48}>
            TIP-48
        </DescriptionLink>
    );
};

export const Tip125Link: React.FC = () => {
    return (
        <TooltipLink target="_blank" rel="noreferrer" href={LINKS.Token.TIP125}>
            TIP-125
        </TooltipLink>
    );
};

export const Tip49Link: React.FC = () => {
    return (
        <TooltipLink target="_blank" rel="noreferrer" href={LINKS.Token.TIP49}>
            TIP-49
        </TooltipLink>
    );
};

export const ClaimOnBehalfGuideLink: React.FC = () => {
    return (
        <TooltipLink target="_blank" rel="noreferrer" href={LINKS.Token.ClaimOnBehalfGuide}>
            Guide
        </TooltipLink>
    );
};

export const UniswapExchangeLink: React.FC = (props) => {
    return (
        <DescriptionLink target="_blank" rel="noreferrer" href={LINKS.Token.UniswapWrapEth}>
            {props.children}
        </DescriptionLink>
    );
};

export const ProvideLiquidityLink: React.FC = (props) => {
    return (
        <DescriptionLink target="_blank" rel="noreferrer" href={LINKS.Token.Liquidity}>
            {props.children}
        </DescriptionLink>
    );
};
