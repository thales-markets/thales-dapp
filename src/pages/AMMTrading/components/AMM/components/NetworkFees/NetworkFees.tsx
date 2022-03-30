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
import useEthGasPriceEip1559Query from 'queries/network/useEthGasPriceEip1559Query';
import { getNetworkId } from 'redux/modules/wallet';
import GasInfo from '../../styled-components/GasInfo';

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

    const ethGasPriceEip1559Query = useEthGasPriceEip1559Query(networkId, { enabled: isAppReady });
    const gasPrice = ethGasPriceEip1559Query.isSuccess ? ethGasPriceEip1559Query.data.proposeGasPrice ?? null : null;

    const exchangeRatesQuery = useExchangeRatesQuery(networkId, { enabled: isAppReady });
    const exchangeRates = exchangeRatesQuery.isSuccess ? exchangeRatesQuery.data ?? null : null;
    const ethRate = get(exchangeRates, SYNTHS_MAP.sETH, null);

    const { t } = useTranslation();
    const isL2 = getIsOVM(networkId);

    return (
        <GasInfo>
            {Array.isArray(gasLimit) ? (
                <>
                    {gasLimit.map((gas, index: number) => (
                        <div key={gas.label}>
                            <GasInfo.Row key={gas.label}>
                                <GasInfo.Row.Label>{`${t('common.network-fee-gas')} - ${gas.label}`}</GasInfo.Row.Label>
                                <GasInfo.Row.Value>
                                    {formatCurrencyWithSign(
                                        USD_SIGN,
                                        getTransactionPrice(
                                            gasPrice,
                                            gas.gasLimit,
                                            ethRate,
                                            l1Fee && l1Fee !== null ? (l1Fee as number[])[index] : l1Fee
                                        )
                                    )}
                                </GasInfo.Row.Value>
                            </GasInfo.Row>
                        </div>
                    ))}
                </>
            ) : (
                <>
                    <GasInfo.Row>
                        <GasInfo.Row.Label>{t('common.network-fee-gas')}</GasInfo.Row.Label>
                        <GasInfo.Row.Value>
                            {formatCurrencyWithSign(
                                USD_SIGN,
                                getTransactionPrice(
                                    gasPrice,
                                    gasLimit as number,
                                    ethRate,
                                    l1Fee && l1Fee !== null ? (l1Fee as number) : l1Fee
                                )
                            )}
                        </GasInfo.Row.Value>
                    </GasInfo.Row>
                </>
            )}
            <GasInfo.Row key="Gas Price">
                <GasInfo.Row.Label key={0}>{t('common.gas-price-gwei')}</GasInfo.Row.Label>
                <GasInfo.Row.Value>
                    {isL2 ? formatCurrencyWithPrecision(gasPrice ?? 0, true) : formatCurrency(gasPrice ?? 0, 0)}
                </GasInfo.Row.Value>
            </GasInfo.Row>
        </GasInfo>
    );
};

export default NetworkFees;
