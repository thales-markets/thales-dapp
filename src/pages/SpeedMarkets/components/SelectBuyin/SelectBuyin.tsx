import { USD_SIGN } from 'constants/currency';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivRow } from 'styles/common';
import { AmmChainedSpeedMarketsLimits, AmmSpeedMarketsLimits } from 'types/options';
import { SelectedPosition } from '../SelectPosition/SelectPosition';
import { roundNumberToDecimals } from 'thales-utils';

type SelectBuyinProps = {
    value: number;
    onChange: React.Dispatch<number>;
    isChained: boolean;
    chainedPositions: SelectedPosition[];
    ammSpeedMarketsLimits: AmmSpeedMarketsLimits | null;
    ammChainedSpeedMarketsLimits: AmmChainedSpeedMarketsLimits | null;
};

const roundMaxBuyin = (maxBuyin: number) => Math.floor(maxBuyin / 10) * 10;

const SelectBuyin: React.FC<SelectBuyinProps> = ({
    value,
    onChange,
    isChained,
    chainedPositions,
    ammSpeedMarketsLimits,
    ammChainedSpeedMarketsLimits,
}) => {
    const [buyinAmount, setBuyinAmount] = useState(0);

    const payoutMultiplier = useMemo(
        () =>
            ammChainedSpeedMarketsLimits
                ? ammChainedSpeedMarketsLimits.payoutMultipliers[
                      chainedPositions.length - ammChainedSpeedMarketsLimits.minChainedMarkets
                  ]
                : 0,
        [chainedPositions.length, ammChainedSpeedMarketsLimits]
    );

    const buyinAmounts = useMemo(() => {
        const chainedQuote = isChained ? roundNumberToDecimals(payoutMultiplier ** chainedPositions.length) : 0;

        const first =
            (isChained ? ammChainedSpeedMarketsLimits?.minBuyinAmount : ammSpeedMarketsLimits?.minBuyinAmount) || 0;
        const fifth = isChained
            ? roundMaxBuyin((ammChainedSpeedMarketsLimits?.maxProfitPerIndividualMarket || 0) / chainedQuote)
            : ammSpeedMarketsLimits?.maxBuyinAmount || 0;

        let second;
        let third;
        let fourth;
        const range = fifth - first + 1;
        if (range >= 150) {
            second = first * 2;
            third = second * 5;
            fourth = fifth / 2;
        } else if (range >= 50) {
            second = first * 2;
            third = second * 2;
            fourth = roundMaxBuyin(fifth / 2);
        } else if (range >= 25) {
            second = first * 2;
            third = second + (second - first);
            fourth = third + (second - first);
        } else if (range >= 10) {
            const step = 4;
            second = first + step;
            third = second + step;
            fourth = third + step;
        } else {
            const step = 1;
            second = first + step;
            third = second + step;
            fourth = third + step;
        }

        return [first, second, third, fourth, fifth];
    }, [
        isChained,
        ammSpeedMarketsLimits?.minBuyinAmount,
        ammSpeedMarketsLimits?.maxBuyinAmount,
        ammChainedSpeedMarketsLimits?.minBuyinAmount,
        ammChainedSpeedMarketsLimits?.maxProfitPerIndividualMarket,
        payoutMultiplier,
        chainedPositions.length,
    ]);

    useEffect(() => {
        setBuyinAmount(value);
    }, [value]);

    return (
        <Container>
            {buyinAmounts.map((amount, index) => {
                return (
                    <Amount
                        key={index}
                        isSelected={buyinAmount === amount || (value > 0 && value === amount)}
                        onClick={() => {
                            onChange(amount);
                            setBuyinAmount(amount);
                        }}
                    >
                        <DollarSign>{USD_SIGN}</DollarSign>
                        {amount}
                    </Amount>
                );
            })}
        </Container>
    );
};

const Container = styled(FlexDivRow)``;

const Amount = styled(FlexDivCentered)<{ isSelected: boolean }>`
    width: 70px;
    height: 31px;
    border-radius: 8px;
    background: ${(props) =>
        props.isSelected ? props.theme.button.background.primary : props.theme.button.background.tertiary};
    color: ${(props) =>
        props.isSelected ? props.theme.button.textColor.primary : props.theme.button.textColor.secondary};
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    line-height: 90%;
    padding-left: 1px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 60px;
    }
`;

const DollarSign = styled.span`
    padding-right: 2px;
`;

export default SelectBuyin;
