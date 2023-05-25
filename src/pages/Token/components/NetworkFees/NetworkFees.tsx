import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { formatCurrencyWithSign, formatCurrency, formatCurrencyWithPrecision } from 'utils/formatters/number';
import { CRYPTO_CURRENCY_MAP, SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import { getIsAppReady } from 'redux/modules/app';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';
import { get } from 'lodash';
import { RootState } from 'redux/rootReducer';
import { getIsOVM, getIsPolygon, getTransactionPrice } from 'utils/network';
import styled from 'styled-components';
import useEthGasPriceEip1559Query from 'queries/network/useEthGasPriceEip1559Query';
import { getNetworkId } from 'redux/modules/wallet';
import { FlexDivRow } from 'theme/common';

export type GasLimit = {
    gasLimit: number;
    label: string;
};

type NetworkFeesProps = {
    gasLimit: number | GasLimit[] | null;
    disabled?: boolean;
    l1Fee?: number | number[] | null;
};

const NetworkFees: React.FC<NetworkFeesProps> = ({ gasLimit, l1Fee }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isPolygon = getIsPolygon(networkId);

    const ethGasPriceEip1559Query = useEthGasPriceEip1559Query(networkId, { enabled: isAppReady });
    const gasPrice = ethGasPriceEip1559Query.isSuccess ? ethGasPriceEip1559Query.data.proposeGasPrice ?? null : null;

    const exchangeRatesQuery = useExchangeRatesQuery({ enabled: isAppReady });
    const exchangeRates = exchangeRatesQuery.isSuccess ? exchangeRatesQuery.data ?? null : null;
    const ethRate = get(exchangeRates, isPolygon ? CRYPTO_CURRENCY_MAP.MATIC : SYNTHS_MAP.sETH, null);

    const { t } = useTranslation();
    const isL2 = getIsOVM(networkId);

    return (
        <>
            {Array.isArray(gasLimit) ? (
                <>
                    {gasLimit.map((gas, index: number) => (
                        <div key={gas.label}>
                            <NetworkFeeSummaryItem key={gas.label}>
                                <NetworkFeeSummaryLabel>{`${t('common.network-fee-gas')} - ${
                                    gas.label
                                }`}</NetworkFeeSummaryLabel>
                                <NetworkFeeSummaryContent>
                                    {formatCurrencyWithSign(
                                        USD_SIGN,
                                        getTransactionPrice(
                                            gasPrice,
                                            gas.gasLimit,
                                            ethRate,
                                            l1Fee && l1Fee !== null ? (l1Fee as number[])[index] : l1Fee
                                        )
                                    )}
                                </NetworkFeeSummaryContent>
                            </NetworkFeeSummaryItem>
                        </div>
                    ))}
                </>
            ) : (
                <NetworkFeeSummaryItem>
                    <NetworkFeeSummaryLabel>{t('common.network-fee-gas')}</NetworkFeeSummaryLabel>
                    <NetworkFeeSummaryContent>
                        {formatCurrencyWithSign(
                            USD_SIGN,
                            getTransactionPrice(
                                gasPrice,
                                gasLimit as number,
                                ethRate,
                                l1Fee && l1Fee !== null ? (l1Fee as number) : l1Fee
                            )
                        )}
                    </NetworkFeeSummaryContent>
                </NetworkFeeSummaryItem>
            )}
            <NetworkFeeSummaryItem key="Gas Price">
                <NetworkFeeSummaryLabel key={0}>{t('common.gas-price-gwei')}</NetworkFeeSummaryLabel>
                <NetworkFeeSummaryContent>
                    {isL2 ? formatCurrencyWithPrecision(gasPrice ?? 0, true) : formatCurrency(gasPrice ?? 0, 0)}
                </NetworkFeeSummaryContent>
            </NetworkFeeSummaryItem>
        </>
    );
};

const SummaryItem = styled(FlexDivRow)`
    margin-bottom: 20px;
`;

const SummaryLabel = styled.div<{ color?: string }>`
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.5px;
    color: ${(props) => props.color ?? props.theme.textColor.primary};
`;

const SummaryContent = styled.div<{ color?: string }>`
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 200px;
    text-align: end;
    color: ${(props) => props.color ?? props.theme.textColor.primary};
    @media (max-width: 768px) {
        width: 100px;
    }
`;

const NetworkFeeSummaryItem = styled(SummaryItem)`
    margin-bottom: 0;
`;

const NetworkFeeSummaryLabel = styled(SummaryLabel)`
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    text-transform: uppercase;
    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

const NetworkFeeSummaryContent = styled(SummaryContent)`
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    text-transform: uppercase;
    flex: 1;
    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

export default NetworkFees;
