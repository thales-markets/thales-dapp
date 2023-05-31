import { Positions } from 'constants/options';
import { ScreenSizeBreakpoint } from 'constants/ui';
import styled from 'styled-components';
import { ThemeInterface } from 'types/ui';

export const Content = styled.div`
    display: content;
`;

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 15px;
    position: relative;
    min-height: 200px;
`;

export const MiddleContrainer = styled.div`
    display: flex;
    width: 100%;
    margin-top: 10px;
    min-width: 180px;
`;

export const TableText = styled.span`
    font-weight: bold;
    font-size: 15px;
    line-height: 285%;
    text-align: right;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.primary};
`;

export const CardWrapper = styled.div<{ background?: boolean }>`
    background: ${(props) => (props.background ? props.theme.background.quaternary : 'transparent')};
    margin-bottom: 15px;
    border-radius: 15px;
    padding: 2px;
    border: ${(props) => (props.background ? 'none' : `2px solid ${props.theme.borderColor.primary}`)};
    &:hover {
        transform: scale(1.02);
        border: ${(props) => (props.background ? 'none' : `2px solid ${props.theme.borderColor.secondary}`)};
    }
`;

export const Card = styled.div`
    background: ${(props) => props.theme.background.primary};
    box-sizing: border-box;
    border-radius: 15px;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    @media (max-width: 380px) {
        padding: 16px 10px;
    }
`;
export const CardColumn = styled.div<{ ranged?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    height: 100%;
    flex: ${(props) => (props.ranged ? 'none' : '2')};
`;

export const CardRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    & > svg {
        width: 36px !important;
        height: 36px !important;
    }

    @media (max-width: 500px) {
        & > svg {
            width: 26px !important;
            height: 26px !important;
            margin-bottom: 4px;
        }
    }
`;

const CardText = styled.span`
    display: block;
    color: ${(props) => props.theme.textColor.primary};
    line-height: 100%;
    white-space: pre;
`;

export const CardSection = styled.div`
    display: block;
    &:not(:last-child) {
        margin-bottom: 10px;
    }
    @media (max-width: 500px) {
        & > svg {
            width: 32px !important;
            height: 32px !important;
            margin-bottom: 4px;
        }
    }
`;

export const CardRowTitle = styled(CardText)`
    font-size: 14px;
    font-weight: 400;
    text-transform: capitalize;
    margin-bottom: 4px;
    @media (max-width: 500px) {
        font-size: 8px;
    }
`;

export const CardRowSubtitle = styled(CardText)`
    font-size: 23px;
    span {
        font-size: 23px !important;
        white-space: pre;
    }
    font-weight: 700;
    @media (max-width: 500px) {
        font-size: 14px;
        span {
            font-size: 14px !important;
        }
    }

    @media (max-width: 400px) {
        font-size: 12px;
        span {
            font-size: 12px !important;
        }
    }
`;

export const PriceDifferenceInfo = styled.span<{ priceDiff: boolean }>`
    color: ${(props) => (props.priceDiff ? props.theme.textColor.quaternary : props.theme.textColor.tertiary)};
`;

export const getColor = (data: any, theme: ThemeInterface) => {
    if (data.range) {
        return data.balances.type === Positions.IN ? theme.positionColor.in : theme.positionColor.out;
    }
    return data.balances.type === Positions.UP ? theme.positionColor.up : theme.positionColor.down;
};

export const Icon = styled.i<{ margin?: string; color?: string }>`
    ${(props) => (props.margin ? `margin: ${props.margin};` : '')}
    ${(props) => (props.color ? `color: ${props.color} !important` : '')};
    @media (max-width: 568px) {
        font-size: 16px;
        line-height: 100%;
    }
`;

export const NoDataText = styled.span`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 24px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 15px;
    }
`;

export const NoDataContainer = styled.div`
    display: block;
    width: 100%;
    text-align: center;
    margin-top: 50px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-top: 10px;
    }
`;
