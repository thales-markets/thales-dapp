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
export const ClearAll = styled(FlexDivCentered)`
    color: ${(props) => props.theme.textColor.tertiary};
    font-size: 13px;
    font-weight: 500;
    line-height: 13px;
    text-transform: capitalize;
    cursor: pointer;
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
    padding-top: 10px;
    padding-bottom: 20px;
`;

export const PositionsContainer = styled(FlexDivSpaceBetween)`
    position: relative;
    height: 124px;
`;

export const PositionsWrapper = styled(FlexDivColumnCentered)<{ isSelected?: boolean }>`
    width: 52px;
    gap: ${(props) => (props.isSelected ? '5' : '10')}px;
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

export const PositionSymbolUp = styled(PositionSymbol)<{ isSelected?: boolean; isSmaller?: boolean }>`
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

    ${(props) => (props.isSmaller ? 'width: 20px;' : '')};
    ${(props) => (props.isSmaller ? 'height: 20px;' : '')};
    ${(props) => (props.isSmaller ? 'padding-bottom: 2px;' : '')};
`;

export const PositionSymbolDown = styled(PositionSymbol)<{ isSelected?: boolean; isSmaller?: boolean }>`
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

    ${(props) => (props.isSmaller ? 'width: 20px;' : '')};
    ${(props) => (props.isSmaller ? 'height: 20px;' : '')};
`;

export const Icon = styled.i<{ isSmaller?: boolean; size?: number; color?: string }>`
    font-size: ${(props) => (props.size ? props.size : props.isSmaller ? '10' : '18')}px;
    line-height: 100%;
    color: ${(props) => (props.color ? props.color : 'inherit')};
`;

const Label = styled.span`
    font-size: 18px;
    font-weight: 700;
    line-height: 100%;
    text-transform: capitalize;
`;

export const LabelUp = styled(Label)<{ isSelected?: boolean; isColumn?: boolean; isSmaller?: boolean }>`
    color: ${(props) =>
        props.isSelected === undefined
            ? props.theme.textColor.primary
            : props.isSelected
            ? props.theme.positionColor.up
            : props.theme.borderColor.primary};
    ${(props) => (props.isColumn ? 'margin-bottom: 2px;' : 'margin-right: 7px;')}
    ${(props) => (props.isSmaller ? 'font-size: 13px;' : '')};
    ${(props) => (props.isColumn && props.isSelected ? 'padding-top: 20px;' : '')};
`;

export const LabelDown = styled(Label)<{ isSelected?: boolean; isColumn?: boolean; isSmaller?: boolean }>`
    color: ${(props) =>
        props.isSelected === undefined
            ? props.theme.textColor.primary
            : props.isSelected
            ? props.theme.positionColor.down
            : props.theme.borderColor.primary};
    ${(props) => (props.isColumn ? 'margin-top: 2px;' : 'margin-left: 7px;')}
    ${(props) => (props.isSmaller ? 'font-size: 13px;' : '')};
    ${(props) => (props.isColumn && props.isSelected ? 'padding-bottom: 20px;' : '')};
`;

export const Separator = styled.div`
    position: relative;
    background: ${(props) => props.theme.borderColor.primary};
    width: 3px;
    height: 36px;
    border-radius: 6px;
    margin: 0 14px;
`;

export const Bonus = styled.div`
    position: absolute;
    bottom: -21px;
    color: ${(props) => props.theme.textColor.quaternary};
    background: ${(props) => props.theme.background.primary};
    border-radius: 50%;
    font-size: 13px;
    font-weight: 700;
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