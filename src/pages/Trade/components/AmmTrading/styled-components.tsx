import { ScreenSizeBreakpoint } from 'constants/ui';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRow, FlexDivRowCentered } from 'theme/common';

export const Container = styled(FlexDivRow)<{ isDetailsPage?: boolean }>`
    height: ${(props) => (props.isDetailsPage ? 'auto' : '78px')};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        min-width: initial;
        height: 100%;
        flex-direction: column;
    }
`;

export const TradingDetailsContainer = styled(FlexDivRowCentered)`
    position: relative;
    width: 600px;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 8px;
    padding: 10px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        width: 100%;
        margin-bottom: 10px;
    }
`;

export const FinalizeTrade = styled(FlexDivCentered)<{ isDetailsPage?: boolean }>`
    width: ${(props) => (props.isDetailsPage ? '100%' : '350px')};
    color: ${(props) => props.theme.textColor.primary};
    font-size: 13px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}) {
        width: 100%;
    }
`;

export const DetailsIcon = styled.i<{ disabled: boolean }>`
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 16px;
    color: ${(props) => props.theme.textColor.secondary};
    cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
    opacity: ${(props) => (props.disabled ? '0.5' : '1')};
`;

export const DetailsRow = styled(FlexDivRowCentered)<{ margin?: string; padding?: string }>`
    margin: ${(props) => props.margin || '0'};
    padding: ${(props) => props.padding || '2px 0'};
`;

export const Text = styled.span`
    font-weight: 700;
    font-size: 13px;
    line-height: 15px;
`;

export const TextLabel = styled(Text)`
    color: ${(props) => props.theme.textColor.secondary};
`;
export const TextValue = styled(Text)<{ isProfit?: boolean; uppercase?: boolean }>`
    color: ${(props) => (props.isProfit ? props.theme.textColor.quaternary : props.theme.textColor.primary)};
    text-transform: ${(props) => (props.uppercase ? 'uppercase;' : 'initial')};
`;

export const ColumnSpaceBetween = styled(FlexDivColumn)`
    width: 100%;
    height: 100%;
    justify-content: space-between;
`;
