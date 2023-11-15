import Tooltip from 'components/Tooltip';
import { Positions } from 'enums/options';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FlexDivColumnCentered } from 'styles/common';
import { formatPercentage, roundNumberToDecimals } from 'thales-utils';
import { AmmChainedSpeedMarketsLimits } from 'types/options';
import {
    Bonus,
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
    TooltipWrapper,
} from './styled-components';
import { ThemeInterface } from 'types/ui';
import { useTheme } from 'styled-components';

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
    const theme: ThemeInterface = useTheme();

    const roi = ammChainedSpeedMarketsLimits?.payoutMultiplier
        ? roundNumberToDecimals(ammChainedSpeedMarketsLimits?.payoutMultiplier ** selected.length)
        : 0;

    const bonus = {
        [Positions.UP]: skew[Positions.DOWN] - skew[Positions.UP],
        [Positions.DOWN]: skew[Positions.UP] - skew[Positions.DOWN],
    };

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
                            {bonus[Positions.UP] > 0 && <Bonus>+{formatPercentage(bonus[Positions.UP])}</Bonus>}
                        </PositionSymbolUp>
                    </PositionWrapper>
                    <Separator>
                        <TooltipWrapper>
                            <Tooltip
                                overlay={
                                    <Trans
                                        i18nKey="speed-markets.tooltips.skew-info"
                                        components={{
                                            br: <br />,
                                        }}
                                        values={{
                                            skewUpPerc: formatPercentage(skew[Positions.UP]),
                                            skewDownPerc: formatPercentage(skew[Positions.DOWN]),
                                        }}
                                    />
                                }
                                marginLeft={0}
                                iconColor={theme.textColor.quaternary}
                            />
                        </TooltipWrapper>
                    </Separator>
                    <PositionWrapper onClick={() => onChange(Positions.DOWN)}>
                        <PositionSymbolDown
                            isSelected={selected[0] !== undefined ? selected[0] === Positions.DOWN : undefined}
                        >
                            <Icon className="icon icon--caret-down" />
                            {bonus[Positions.DOWN] > 0 && <Bonus>+{formatPercentage(bonus[Positions.DOWN])}</Bonus>}
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

export default SelectPosition;
