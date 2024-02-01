import { ScreenSizeBreakpoint } from 'enums/ui';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumnCentered, FlexDivRowCentered, FlexDivSpaceBetween } from 'styles/common';

export const Container = styled(FlexDivCentered)``;

export const ChainedHeader = styled(FlexDivRowCentered)``;

export const Roi = styled.span`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 18px;
    font-weight: 600;
    line-height: 20px;
`;
export const ClearAll = styled(FlexDivCentered)<{ isDisabled?: boolean }>`
    color: ${(props) => props.theme.textColor.tertiary};
    font-size: 13px;
    font-weight: 500;
    line-height: 13px;
    text-transform: capitalize;
    cursor: ${(props) => (props.isDisabled ? 'default' : 'pointer')};
    opacity: ${(props) => (props.isDisabled ? '0.5' : '1')};
`;

export const IconWrong = styled(FlexDivCentered)`
    width: 21px;
    height: 21px;
    color: ${(props) => props.theme.textColor.tertiary};
    border: 2px solid ${(props) => props.theme.textColor.tertiary};
    border-radius: 50%;
    font-size: 13px;
    line-height: 13px;
    margin-left: 5px;
`;

export const ChainedPositions = styled(FlexDivCentered)`
    padding-top: 5px;
`;

export const PositionsContainer = styled(FlexDivSpaceBetween)`
    position: relative;
    height: 124px;
`;

export const PositionsWrapper = styled(FlexDivColumnCentered)`
    width: 52px;
    gap: 10px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 44px;
    }
`;

export const PositionWrapper = styled(FlexDivCentered)<{ isColumn?: boolean }>`
    cursor: pointer;
    ${(props) => (props.isColumn ? 'flex-direction: column;' : '')}
`;

const PositionSymbol = styled(FlexDivCentered)<{ size?: number }>`
    position: relative;
    width: ${(props) => (props.size ? props.size : '36')}px;
    height: ${(props) => (props.size ? props.size : '36')}px;
    border-radius: 50%;
`;

export const PositionSymbolUp = styled(PositionSymbol)<{ isSelected?: boolean }>`
    border: 3px solid
        ${(props) =>
            props.isSelected === undefined
                ? props.theme.borderColor.primary
                : props.isSelected
                ? props.theme.positionColor.up
                : props.theme.borderColor.primary};
    color: ${(props) =>
        props.isSelected === undefined || props.isSelected
            ? props.theme.positionColor.up
            : props.theme.borderColor.primary};
`;

export const PositionSymbolDown = styled(PositionSymbol)<{ isSelected?: boolean }>`
    border: 3px solid
        ${(props) =>
            props.isSelected === undefined
                ? props.theme.borderColor.primary
                : props.isSelected
                ? props.theme.positionColor.down
                : props.theme.borderColor.primary};
    color: ${(props) =>
        props.isSelected === undefined || props.isSelected
            ? props.theme.positionColor.down
            : props.theme.borderColor.primary};
`;

export const Icon = styled.i<{ size?: number; padding?: string; color?: string }>`
    font-size: ${(props) => (props.size ? props.size : '18')}px;
    line-height: 100%;
    color: ${(props) => (props.color ? props.color : 'inherit')};
    ${(props) => (props.padding ? `padding: ${props.padding};` : '')};
`;

export const AssetIcon = styled(Icon)`
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 28px;
        line-height: 100%;
        color: ${(props) => props.theme.textColor.primary};
    }
`;

const Label = styled.span`
    font-size: 18px;
    font-weight: 700;
    line-height: 100%;
    text-transform: capitalize;
`;

export const LabelUp = styled(Label)<{ isSelected?: boolean; isColumn?: boolean }>`
    color: ${(props) =>
        props.isSelected === undefined
            ? props.theme.textColor.primary
            : props.isSelected
            ? props.theme.positionColor.up
            : props.theme.borderColor.primary};
    ${(props) => (props.isColumn ? 'margin-bottom: 2px;' : 'margin-right: 7px;')}
`;

export const LabelDown = styled(Label)<{ isSelected?: boolean; isColumn?: boolean }>`
    color: ${(props) =>
        props.isSelected === undefined
            ? props.theme.textColor.primary
            : props.isSelected
            ? props.theme.positionColor.down
            : props.theme.borderColor.primary};
    ${(props) => (props.isColumn ? 'margin-top: 2px;' : 'margin-left: 7px;')}
`;

export const Separator = styled.div`
    position: relative;
    background: ${(props) => props.theme.borderColor.primary};
    width: 3px;
    height: 36px;
    border-radius: 6px;
    margin: 0 14px;
`;

export const Skew = styled.div<{ isDiscount?: boolean }>`
    position: absolute;
    ${(props) => (!props.isDiscount ? 'bottom: -21px;' : '')}
    color: ${(props) =>
        props.isDiscount === undefined
            ? props.theme.textColor.secondary
            : props.isDiscount
            ? props.theme.textColor.quaternary
            : props.theme.textColor.tertiary};
    font-size: 13px;
    font-weight: 700;
    white-space: nowrap;

    ${(props) =>
        props.isDiscount
            ? `
                top: -10px;
                right: -30px;
                background: ${props.theme.background.primary};
                bottom: 0;
                height: 17px;
                padding: 2px;
                border-radius: 50%;
    `
            : ''}

}
`;

export const TooltipWrapper = styled.div`
    position: absolute;
    bottom: -19px;
    right: -6px;
`;

export const Chain = styled(FlexDivCentered)<{ isSelectedUp?: boolean }>`
    width: 16px;
    color: ${(props) =>
        props.isSelectedUp === undefined
            ? props.theme.textColor.primary
            : props.isSelectedUp
            ? props.theme.positionColor.up
            : props.theme.positionColor.down};
`;
