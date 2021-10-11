import React, { useEffect, useState } from 'react';
import { FlexDivRow, FlexDiv } from 'theme/common';
import styled from 'styled-components';
import { RootState } from 'redux/rootReducer';
import { getIsAppReady } from 'redux/modules/app';
import { useSelector } from 'react-redux';
import { COLORS } from 'constants/ui';
import { Flippening } from 'types/options';
import useFlippeningQuery from 'queries/options/useFlippeningQuery';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import Currency from 'components/Currency';

const ETHBTCFlippeningChartHeader: React.FC = () => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [flippening, setFlippening] = useState<Flippening | undefined>(undefined);

    const flippeningQuery = useFlippeningQuery({
        enabled: isAppReady,
    });

    useEffect(() => {
        if (flippeningQuery.isSuccess && flippeningQuery.data) {
            setFlippening(flippeningQuery.data);
        }
    }, [flippeningQuery.isSuccess, flippeningQuery.data]);

    return (
        <ChartHeader>
            <ChartTitle color={COLORS.LONG}>
                <Currency.Icon
                    synthIconStyle={{ width: 24, height: 24, marginTop: 4, marginRight: 4 }}
                    currencyKey="sETH"
                />
                ETH MC
                <Splitter>|</Splitter>{' '}
                {flippening ? formatCurrencyWithSign(USD_SIGN, flippening.ethMarketCap / 1000000000) : '-'}B
            </ChartTitle>
            <ChartTitle color={COLORS.SHORT}>
                <Currency.Icon
                    synthIconStyle={{ width: 24, height: 24, marginTop: 4, marginRight: 4 }}
                    currencyKey="sBTC"
                />
                BTC MC
                <Splitter>|</Splitter>{' '}
                {flippening ? formatCurrencyWithSign(USD_SIGN, flippening.btcMarketCap / 1000000000) : '-'}B
            </ChartTitle>
        </ChartHeader>
    );
};

const Splitter = styled.span`
    margin: 0px 5px;
`;

const ChartHeader = styled(FlexDivRow)``;

const ChartTitle = styled(FlexDiv)<{ color: COLORS }>`
    font-weight: bold;
    font-size: 16px;
    line-height: 32px;
    letter-spacing: 0.5px;
    color: #ffffff;
    padding: 10px 30px;
    @media (max-width: 512px) {
        padding: 10px;
        font-size: 12px;
    }
`;

export default ETHBTCFlippeningChartHeader;
