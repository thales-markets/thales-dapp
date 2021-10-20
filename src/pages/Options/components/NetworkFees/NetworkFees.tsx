import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { formatCurrencyWithSign, formatCurrency, formatCurrencyWithPrecision } from 'utils/formatters/number';
import { SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import { getIsAppReady } from 'redux/modules/app';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';
import { get } from 'lodash';
import { RootState } from 'redux/rootReducer';
import { getIsOVM, getTransactionPrice } from 'utils/network';
import { SummaryContent, SummaryItem, SummaryLabel } from 'pages/Options/Market/components';
import styled from 'styled-components';
import useEthGasPriceEip1559Query from 'queries/network/useEthGasPriceEip1559Query';
import WarningMessage from 'components/WarningMessage';
import { getNetworkId } from 'redux/modules/wallet';

export type GasLimit = {
    gasLimit: number;
    label: string;
};

type NetworkFeesProps = {
    gasLimit: number | GasLimit[] | null;
    disabled?: boolean;
};

const NetworkFees: React.FC<NetworkFeesProps> = ({ gasLimit }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const ethGasPriceEip1559Query = useEthGasPriceEip1559Query(networkId, { enabled: isAppReady });
    const gasPrice = ethGasPriceEip1559Query.isSuccess ? ethGasPriceEip1559Query.data.proposeGasPrice ?? null : null;

    const exchangeRatesQuery = useExchangeRatesQuery({ enabled: isAppReady });
    const exchangeRates = exchangeRatesQuery.isSuccess ? exchangeRatesQuery.data ?? null : null;
    const ethRate = get(exchangeRates, SYNTHS_MAP.sETH, null);

    const { t } = useTranslation();
    const isL2 = getIsOVM(networkId);

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
                <NetworkFeeSummaryContent>
                    {isL2 ? formatCurrencyWithPrecision(gasPrice ?? 0, true) : formatCurrency(gasPrice ?? 0, 0)}
                </NetworkFeeSummaryContent>
            </NetworkFeeSummaryItem>
            <WarningMessage hideIcon message={t('common.gas-fee-info')} />
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
