import Tooltip from 'components/Tooltip';
import { Positions } from 'enums/options';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FlexDivColumnCentered } from 'styles/common';
import { formatPercentage, roundNumberToDecimals } from 'thales-utils';
import { AmmChainedSpeedMarketsLimits } from 'types/options';
import {
    Chain,
    ChainedHeader,
    ChainedPositions,
    ClearAll,
    Container,
    Icon,
    IconWrong,
    LabelDown,
    LabelUp,
    PositionSymbolDown,
    PositionSymbolUp,
    PositionWrapper,
    PositionsContainer,
    PositionsWrapper,
    Roi,
    Separator,
    Skew,
    TooltipWrapper,
} from './styled-components';

export type SelectedPosition = Positions.UP | Positions.DOWN | undefined;

type SelectPositionProps = {
    selected: SelectedPosition[];
    onChange: React.Dispatch<SelectedPosition>;
    onChainedChange: React.Dispatch<SelectedPosition[]>;
    ammChainedSpeedMarketsLimits: AmmChainedSpeedMarketsLimits | null;
    skew: { [Positions.UP]: number; [Positions.DOWN]: number };
};

const SelectPosition: React.FC<SelectPositionProps> = ({
    selected,
    onChange,
    onChainedChange,
    ammChainedSpeedMarketsLimits,
    skew,
}) => {
    const { t } = useTranslation();

    const payoutMultiplier =
        ammChainedSpeedMarketsLimits?.payoutMultipliers[
            selected.length - ammChainedSpeedMarketsLimits.minChainedMarkets
        ];
    const roi = payoutMultiplier ? roundNumberToDecimals(payoutMultiplier ** selected.length) : 0;

    const discount = skew[Positions.UP] > 0 ? skew[Positions.UP] / 2 : skew[Positions.DOWN] / 2;

    const isClearAllDisabled =
        selected.length === ammChainedSpeedMarketsLimits?.minChainedMarkets && selected.every((p) => p === undefined);

    return (
        <Container>
            {selected.length === 1 ? (
                // Single
                <>
                    <PositionWrapper onClick={() => onChange(selected[0] === Positions.UP ? undefined : Positions.UP)}>
                        <LabelUp isSelected={selected[0] !== undefined ? selected[0] === Positions.UP : undefined}>
                            {Positions.UP}
                        </LabelUp>
                        <PositionSymbolUp
                            isSelected={selected[0] !== undefined ? selected[0] === Positions.UP : undefined}
                        >
                            <Icon className="icon icon--caret-up" />
                            {discount > 0 && (
                                <Skew isDiscount={skew[Positions.UP] > 0 ? false : discount > 0 ? true : undefined}>
                                    {skew[Positions.UP] > 0 ? '-' : discount > 0 ? '+' : ''}
                                    {formatPercentage(skew[Positions.UP] || discount)}
                                </Skew>
                            )}
                        </PositionSymbolUp>
                    </PositionWrapper>
                    <Separator>
                        {discount > 0 && (
                            <TooltipWrapper>
                                <Tooltip
                                    overlay={
                                        <Trans
                                            i18nKey="speed-markets.tooltips.skew-info"
                                            components={{
                                                br: <br />,
                                            }}
                                            values={{
                                                skewDirection: skew[Positions.DOWN] > 0 ? Positions.DOWN : Positions.UP,
                                                skewPerc: formatPercentage(
                                                    skew[Positions.UP] > 0 ? skew[Positions.UP] : skew[Positions.DOWN]
                                                ),
                                                discountDirection:
                                                    skew[Positions.DOWN] > 0 ? Positions.UP : Positions.DOWN,
                                                discountPerc: formatPercentage(discount),
                                            }}
                                        />
                                    }
                                    marginLeft={0}
                                />
                            </TooltipWrapper>
                        )}
                    </Separator>
                    <PositionWrapper
                        onClick={() => onChange(selected[0] === Positions.DOWN ? undefined : Positions.DOWN)}
                    >
                        <PositionSymbolDown
                            isSelected={selected[0] !== undefined ? selected[0] === Positions.DOWN : undefined}
                        >
                            <Icon className="icon icon--caret-down" />
                            {discount > 0 && (
                                <Skew isDiscount={skew[Positions.DOWN] > 0 ? false : discount > 0 ? true : undefined}>
                                    {skew[Positions.DOWN] > 0 ? '-' : discount > 0 ? '+' : ''}
                                    {formatPercentage(skew[Positions.DOWN] || discount)}
                                </Skew>
                            )}
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
                        <Roi>{t('speed-markets.chained.roi', { value: roi })}x</Roi>
                        <ClearAll
                            isDisabled={isClearAllDisabled}
                            onClick={() =>
                                !isClearAllDisabled &&
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
                                    <PositionsWrapper>
                                        <PositionWrapper
                                            isColumn
                                            onClick={() =>
                                                onChainedChange(
                                                    selected.map((pos, i) =>
                                                        i === index
                                                            ? pos === Positions.UP
                                                                ? undefined
                                                                : Positions.UP
                                                            : pos
                                                    )
                                                )
                                            }
                                        >
                                            <LabelUp isColumn isSelected={isUpSelected}>
                                                {Positions.UP}
                                            </LabelUp>
                                            <PositionSymbolUp isSelected={isUpSelected}>
                                                <Icon className="icon icon--caret-up" />
                                            </PositionSymbolUp>
                                        </PositionWrapper>
                                        <PositionWrapper
                                            isColumn
                                            onClick={() =>
                                                onChainedChange(
                                                    selected.map((pos, i) =>
                                                        i === index
                                                            ? pos === Positions.DOWN
                                                                ? undefined
                                                                : Positions.DOWN
                                                            : pos
                                                    )
                                                )
                                            }
                                        >
                                            <PositionSymbolDown isSelected={isDownSelected}>
                                                <Icon className="icon icon--caret-down" />
                                            </PositionSymbolDown>
                                            <LabelDown isColumn isSelected={isDownSelected}>
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

export default SelectPosition;
