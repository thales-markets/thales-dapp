import { USD_SIGN } from 'constants/currency';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivRow } from 'styles/common';
import { AmmSpeedMarketsLimits } from 'types/options';
import { ScreenSizeBreakpoint } from 'enums/ui';

type SelectBuyinProps = {
    value: number;
    onChange: React.Dispatch<number>;
    ammSpeedMarketsLimits: AmmSpeedMarketsLimits | null;
};

const SelectBuyin: React.FC<SelectBuyinProps> = ({ value, onChange, ammSpeedMarketsLimits }) => {
    const [buyinAmount, setBuyinAmount] = useState(0);

    const buyinAmounts = useMemo(() => {
        const first = ammSpeedMarketsLimits?.minBuyinAmount || 0;
        const fifth = ammSpeedMarketsLimits?.maxBuyinAmount || 0;

        const second = first === 1 ? first * 5 : first * 2;
        const third = fifth > 100 ? second * 5 : second * 2;
        const fourth = fifth / 2;

        return [first, second, third, fourth, fifth];
    }, [ammSpeedMarketsLimits?.minBuyinAmount, ammSpeedMarketsLimits?.maxBuyinAmount]);

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
