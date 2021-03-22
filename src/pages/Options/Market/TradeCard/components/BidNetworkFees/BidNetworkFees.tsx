import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import { formatCurrencyWithSign, formatPercentage } from 'utils/formatters/number';
import { SYNTHS_MAP, USD_SIGN } from 'constants/currency';
import { ReactComponent as QuestionMark } from 'assets/images/question-mark.svg';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';
import { get } from 'lodash';
import { getTransactionPrice } from 'utils/network';
import SelectGasMenu from 'components/SelectGasMenu';
import { OptionsTransaction } from 'types/options';
import { Divider } from 'semantic-ui-react';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import { getCustomGasPrice, getGasSpeed } from 'redux/modules/wallet';

type BidNetworkFeesProps = {
    gasLimit: number | null;
    type?: OptionsTransaction['type'];
    fees: Record<string, number> | null;
    amount: string | number;
};

const BidNetworkFees: React.FC<BidNetworkFeesProps> = ({ gasLimit, fees, type, amount }) => {
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

    const networkFee = getTransactionPrice(gasPrice, gasLimit, ethRate);
    const bidOrRefundFee = fees ? (type === 'bid' ? fees.creatorFee + fees.poolFee : fees.refundFee) : 0;

    const totalCost = networkFee + bidOrRefundFee * Number(amount);

    const getTooltipBody = () => (
        <div style={{ width: 150, fontSize: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'start' }}>
                    <div style={{ marginRight: 5 }}>{t(`options.market.trade-card.bidding.common.${type}-fee`)}</div>
                    <div>{`(${formatPercentage(bidOrRefundFee, 0)})`}</div>
                </div>
                <div>{formatCurrencyWithSign(USD_SIGN, bidOrRefundFee * Number(amount))}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>{t('options.market.trade-card.bidding.common.network-info-tooltip.network-fee')}</div>
                <div>{formatCurrencyWithSign(USD_SIGN, networkFee)}</div>
            </div>
        </div>
    );

    return (
        <div>
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between', textTransform: 'uppercase' }}>
                <div>
                    {t(`options.market.trade-card.bidding.common.${type}-fee`)}
                    <Tooltip title={getTooltipBody()} placement="bottom" arrow={true}>
                        <QuestionMark width="12" height="12" />
                    </Tooltip>
                </div>
                <div>{formatCurrencyWithSign(USD_SIGN, totalCost)}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', textTransform: 'uppercase' }}>
                <div>{t('common.gas-price-gwei')}</div>
                <SelectGasMenu gasPrice={gasPrice} />
            </div>
        </div>
    );
};

export default BidNetworkFees;
