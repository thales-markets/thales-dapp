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

export type GasLimit = {
    gasLimit: number;
    label: string;
};

type NetworkFeesProps = {
    gasLimit: number | GasLimit[] | null;
    disabled?: boolean;
};

const NetworkFees: React.FC<NetworkFeesProps> = ({ gasLimit, disabled }) => {
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
            {Array.isArray(gasLimit) ? (
                <>
                    {gasLimit.map((gas) => (
                        <div key={gas.label}>
                            <NetworkFeeSummaryItem key={gas.label}>
                                <NetworkFeeSummaryLabel>{`${t('common.network-fee-gas')} - ${
                                    gas.label
                                }`}</NetworkFeeSummaryLabel>
                                <NetworkFeeSummaryContent>
                                    {formatCurrencyWithSign(
                                        USD_SIGN,
                                        getTransactionPrice(gasPrice, gas.gasLimit, ethRate)
                                    )}
                                </NetworkFeeSummaryContent>
                            </NetworkFeeSummaryItem>
                        </div>
                    ))}
                </>
            ) : (
                <>
                    <NetworkFeeSummaryItem>
                        <NetworkFeeSummaryLabel>{t('common.network-fee-gas')}</NetworkFeeSummaryLabel>
                        <NetworkFeeSummaryContent>
                            {formatCurrencyWithSign(
                                USD_SIGN,
                                getTransactionPrice(gasPrice, gasLimit as number, ethRate)
                            )}
                        </NetworkFeeSummaryContent>
                    </NetworkFeeSummaryItem>
                </>
            )}
            <NetworkFeeSummaryItem key="Gas Price">
                <NetworkFeeSummaryLabel key={0}>{t('common.gas-price-gwei')}</NetworkFeeSummaryLabel>
                <SelectGasMenu key={1} gasPrice={gasPrice} disabled={disabled} />
            </NetworkFeeSummaryItem>
        </>
    );
};

const NetworkFeeSummaryItem = styled(SummaryItem)`
    margin-bottom: 10px;
`;

const NetworkFeeSummaryLabel = styled(SummaryLabel)`
    font-size: 13px;
    line-height: 24px;
    @media screen and (max-width: 1024px) {
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.25px;
    }
    @media screen and (max-width: 767px) {
        width: 50%;
        font-size: 14px;
    }
`;

const NetworkFeeSummaryContent = styled(SummaryContent)`
    font-size: 13px;
    line-height: 24px;
    flex: 1;
    @media screen and (max-width: 1024px) {
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.25px;
    }
    @media screen and (max-width: 767px) {
        text-align: right;
        font-size: 14px;
    }
`;

export default NetworkFees;
