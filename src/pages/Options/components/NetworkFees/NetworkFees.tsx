import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import { getIsAppReady } from 'redux/modules/app';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';
import { get } from 'lodash';
import { RootState } from 'redux/rootReducer';
import { getTransactionPrice } from 'utils/network';
import SelectGasMenu from 'components/SelectGasMenu';
import { getCustomGasPrice, getGasSpeed } from 'redux/modules/wallet';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import { SummaryContent, SummaryItem, SummaryLabel } from 'pages/Options/Market/components';
import styled from 'styled-components';

type NetworkFeesProps = {
    gasLimit: number | null;
    labelColor?: string;
    priceColor?: string;
};

const NetworkFees: React.FC<NetworkFeesProps> = ({ gasLimit }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const gasSpeed = useSelector((state: RootState) => getGasSpeed(state));
    const customGasPrice = useSelector((state: RootState) => getCustomGasPrice(state));
    const ethGasPriceQuery = useEthGasPriceQuery();
    const gasPrice = useMemo(
        () =>
            customGasPrice !== null
                ? customGasPrice
                : ethGasPriceQuery.data != null
                ? ethGasPriceQuery.data[gasSpeed]
                : null,
        [customGasPrice, ethGasPriceQuery.data, gasSpeed]
    );
    const exchangeRatesQuery = useExchangeRatesQuery({ enabled: isAppReady });
    const exchangeRates = exchangeRatesQuery.isSuccess ? exchangeRatesQuery.data ?? null : null;
    const ethRate = get(exchangeRates, SYNTHS_MAP.sETH, null);

    const { t } = useTranslation();

    return (
        <>
            <NetworkFeeSummaryItem>
                <NetworkFeeSummaryLabel>{t('common.network-fee-gas')}</NetworkFeeSummaryLabel>
                <NetworkFeeSummaryContent>
                    {formatCurrencyWithSign(USD_SIGN, getTransactionPrice(gasPrice, gasLimit, ethRate))}
                </NetworkFeeSummaryContent>
            </NetworkFeeSummaryItem>
            <NetworkFeeSummaryItem>
                <NetworkFeeSummaryLabel>{t('common.gas-price-gwei')}</NetworkFeeSummaryLabel>
                <SelectGasMenu gasPrice={gasPrice} />
            </NetworkFeeSummaryItem>
        </>
    );
};

const NetworkFeeSummaryItem = styled(SummaryItem)`
    margin-bottom: 10px;
    &:last-child {
        margin-top: 10px;
    }
`;

const NetworkFeeSummaryLabel = styled(SummaryLabel)`
    font-size: 13px;
    line-height: 24px;
`;

const NetworkFeeSummaryContent = styled(SummaryContent)`
    font-size: 13px;
    line-height: 24px;
`;

export default NetworkFees;
