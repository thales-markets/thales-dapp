import { Positions } from 'enums/options';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumnCentered, FlexDivRowCentered, FlexDivSpaceBetween } from 'styles/common';
import { AmmChainedSpeedMarketsLimits } from 'types/options';
import { roundNumberToDecimals } from 'utils/formatters/number';

export type SelectedPosition = Positions.UP | Positions.DOWN | undefined;

type SelectPositionProps = {
    selected: SelectedPosition[];
    onChange: React.Dispatch<SelectedPosition>;
    onChainedChange: React.Dispatch<SelectedPosition[]>;
    ammChainedSpeedMarketsLimits: AmmChainedSpeedMarketsLimits | null;
};

const SelectPosition: React.FC<SelectPositionProps> = ({
    selected,
    onChange,
    onChainedChange,
    ammChainedSpeedMarketsLimits,
}) => {
    const { t } = useTranslation();

    const roi = ammChainedSpeedMarketsLimits?.payoutMultiplier
        ? roundNumberToDecimals(ammChainedSpeedMarketsLimits?.payoutMultiplier ** selected.length)
        : 0;

    return (
        <Container>
            {selected.length === 1 ? (
                // Single
                <>
                    <PositionWrapper onClick={() => onChange(Positions.UP)}>
                        <LabelUp isSelected={selected[0] !== undefined ? selected[0] === Positions.UP : undefined}>
                            {Positions.UP}
                        </LabelUp>
                        <PositionSymbolUp
                            isSelected={selected[0] !== undefined ? selected[0] === Positions.UP : undefined}
                        >
                            <Icon className="icon icon--caret-up" />
                        </PositionSymbolUp>
                    </PositionWrapper>
                    <Separator />
                    <PositionWrapper onClick={() => onChange(Positions.DOWN)}>
                        <PositionSymbolDown
                            isSelected={selected[0] !== undefined ? selected[0] === Positions.DOWN : undefined}
                        >
                            <Icon className="icon icon--caret-down" />
                        </PositionSymbolDown>
                        <LabelDown isSelected={selected[0] !== undefined ? selected[0] === Positions.DOWN : undefined}>
                            {Positions.DOWN}
                        </LabelDown>
                    </PositionWrapper>
                </>
            ) : (
                // Chained
                <FlexDivColumnCentered>
                    <ChainedHeader>
                        <Roi>{t('speed-markets.chained.roi', { value: roi })}</Roi>
                        <ClearAll
                            onClick={() =>
                                onChainedChange(Array(ammChainedSpeedMarketsLimits?.minChainedMarkets).fill(undefined))
                            }
                        >
                            {t('speed-markets.chained.clear-all')}
                            <IconWrong className="icon icon--wrong" />
                        </ClearAll>
                    </ChainedHeader>
                    <ChainedPositions>
                        {selected.map((position, index) => {
                            const isUpSelected = position !== undefined ? position === Positions.UP : undefined;
                            const isDownSelected = position !== undefined ? position === Positions.DOWN : undefined;
                            return (
                                <PositionsContainer key={index}>
                                    {index !== 0 && (
                                        <Chain isSelectedUp={isUpSelected}>
                                            <Icon className="icon icon--chain" />
                                        </Chain>
                                    )}
                                    <PositionsWrapper isSelected={position !== undefined}>
                                        <PositionWrapper
                                            isColumn
                                            onClick={() =>
                                                onChainedChange(
                                                    selected.map((pos, i) => (i === index ? Positions.UP : pos))
                                                )
                                            }
                                        >
                                            <LabelUp
                                                isColumn
                                                isSelected={isUpSelected}
                                                isSmaller={isUpSelected === false}
                                            >
                                                {Positions.UP}
                                            </LabelUp>
                                            <PositionSymbolUp
                                                isSelected={isUpSelected}
                                                isSmaller={isUpSelected === false}
                                            >
                                                <Icon
                                                    isSmaller={isUpSelected === false}
                                                    className="icon icon--caret-up"
                                                />
                                            </PositionSymbolUp>
                                        </PositionWrapper>
                                        <PositionWrapper
                                            isColumn
                                            onClick={() =>
                                                onChainedChange(
                                                    selected.map((pos, i) => (i === index ? Positions.DOWN : pos))
                                                )
                                            }
                                        >
                                            <PositionSymbolDown
                                                isSelected={isDownSelected}
                                                isSmaller={isDownSelected === false}
                                            >
                                                <Icon
                                                    isSmaller={isDownSelected === false}
                                                    className="icon icon--caret-down"
                                                />
                                            </PositionSymbolDown>
                                            <LabelDown
                                                isColumn
                                                isSelected={isDownSelected}
                                                isSmaller={isDownSelected === false}
                                            >
                                                {Positions.DOWN}
                                            </LabelDown>
                                        </PositionWrapper>
                                    </PositionsWrapper>
                                </PositionsContainer>
                            );
                        })}
                    </ChainedPositions>
                </FlexDivColumnCentered>
            )}
        </Container>
    );
};

const Container = styled(FlexDivCentered)``;

const ChainedHeader = styled(FlexDivRowCentered)``;

const Roi = styled.span`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 18px;
    font-weight: 600;
    line-height: 20px;
`;
const ClearAll = styled(FlexDivCentered)`
    color: ${(props) => props.theme.textColor.tertiary};
    font-size: 13px;
    font-weight: 500;
    line-height: 13px;
    text-transform: capitalize;
    cursor: pointer;
`;

const IconWrong = styled(FlexDivCentered)`
    width: 21px;
    height: 21px;
    color: ${(props) => props.theme.textColor.tertiary};
    border: 2px solid ${(props) => props.theme.textColor.tertiary};
    border-radius: 50%;
    font-size: 13px;
    line-height: 13px;
    margin-left: 5px;
`;

const ChainedPositions = styled(FlexDivCentered)`
    padding-top: 10px;
    padding-bottom: 20px;
`;

const PositionsContainer = styled(FlexDivSpaceBetween)`
    position: relative;
    height: 124px;
`;

const PositionsWrapper = styled(FlexDivColumnCentered)<{ isSelected?: boolean }>`
    width: 52px;
    gap: ${(props) => (props.isSelected ? '5' : '10')}px;
`;

const PositionWrapper = styled(FlexDivCentered)<{ isColumn?: boolean }>`
    cursor: pointer;
    ${(props) => (props.isColumn ? 'flex-direction: column;' : '')}
`;

const PositionSymbol = styled(FlexDivCentered)`
    width: 36px;
    height: 36px;
    border-radius: 50%;
`;

const PositionSymbolUp = styled(PositionSymbol)<{ isSelected?: boolean; isSmaller?: boolean }>`
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

const PositionSymbolDown = styled(PositionSymbol)<{ isSelected?: boolean; isSmaller?: boolean }>`
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

const Icon = styled.i<{ isSmaller?: boolean }>`
    font-size: ${(props) => (props.isSmaller ? '10' : '18')}px;
    line-height: 100%;
    color: inherit;
`;

const Label = styled.span`
    font-size: 18px;
    font-weight: 700;
    line-height: 100%;
    text-transform: capitalize;
`;

const LabelUp = styled(Label)<{ isSelected?: boolean; isColumn?: boolean; isSmaller?: boolean }>`
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

const LabelDown = styled(Label)<{ isSelected?: boolean; isColumn?: boolean; isSmaller?: boolean }>`
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

const Separator = styled.div`
    background: ${(props) => props.theme.borderColor.primary};
    width: 3px;
    height: 36px;
    border-radius: 6px;
    margin: 0 14px;
`;

const Chain = styled(FlexDivCentered)<{ isSelectedUp?: boolean }>`
    width: 16px;
    color: ${(props) =>
        props.isSelectedUp === undefined
            ? props.theme.textColor.primary
            : props.isSelectedUp
            ? props.theme.positionColor.up
            : props.theme.positionColor.down};
`;

export default SelectPosition;
