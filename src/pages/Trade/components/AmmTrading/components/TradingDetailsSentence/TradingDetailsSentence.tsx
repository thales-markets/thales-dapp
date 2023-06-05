import { USD_SIGN } from 'constants/currency';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered } from 'theme/common';
import { MarketInfo, RangedMarketPerPosition } from 'types/options';
import { getStableCoinForNetwork } from 'utils/currency';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { formatCurrencyWithKey, formatCurrencyWithSign } from 'utils/formatters/number';
import { ColumnSpaceBetween, Text, TextLabel, TextValue } from '../../styled-components';
import { Positions } from 'enums/options';

type TradingDetailsSentenceProps = {
    currencyKey: string;
    maturityDate: number;
    market: MarketInfo | RangedMarketPerPosition;
    isRangedMarket: boolean;
    isFetchingQuote: boolean;
    priceProfit: number | string;
    paidAmount: number | string;
    breakFirstLine: boolean;
};

const TradingDetailsSentence: React.FC<TradingDetailsSentenceProps> = ({
    currencyKey,
    maturityDate,
    market,
    isRangedMarket,
    isFetchingQuote,
    priceProfit,
    paidAmount,
    breakFirstLine,
}) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const potentialWinFormatted = isFetchingQuote
        ? '...'
        : `${formatCurrencyWithKey(
              getStableCoinForNetwork(networkId),
              Number(priceProfit) * Number(paidAmount) + Number(paidAmount)
          )}`;

    const positionTypeFormatted =
        market.positionType === Positions.UP
            ? t('options.common.above')
            : market.positionType === Positions.DOWN
            ? t('options.common.below')
            : market.positionType === Positions.IN
            ? t('options.common.between')
            : t('options.common.not-between');

    return (
        <ColumnSpaceBetween>
            <FlexDivCentered>
                <Text>
                    <TextLabel>{t('options.trade.amm-trading.asset-price', { asset: currencyKey })}</TextLabel>
                    {market.address ? (
                        <>
                            <SentanceTextValue uppercase={true}>{positionTypeFormatted}</SentanceTextValue>
                            {isRangedMarket ? (
                                !breakFirstLine && (
                                    <>
                                        <SentanceTextValue>
                                            {formatCurrencyWithSign(
                                                USD_SIGN,
                                                (market as RangedMarketPerPosition).leftPrice
                                            )}
                                        </SentanceTextValue>
                                        <Text>
                                            <TextLabel>{' ' + t('options.common.and')}</TextLabel>
                                        </Text>
                                        <SentanceTextValue>
                                            {formatCurrencyWithSign(
                                                USD_SIGN,
                                                (market as RangedMarketPerPosition).rightPrice
                                            )}
                                        </SentanceTextValue>
                                    </>
                                )
                            ) : (
                                <SentanceTextValue>
                                    {formatCurrencyWithSign(USD_SIGN, (market as MarketInfo).strikePrice)}
                                </SentanceTextValue>
                            )}
                        </>
                    ) : (
                        <SentanceTextValue>{'( ' + t('options.trade.amm-trading.pick-price') + ' )'}</SentanceTextValue>
                    )}
                </Text>
            </FlexDivCentered>
            {breakFirstLine && isRangedMarket && market.address && (
                <FlexDivCentered>
                    <Text>
                        <SentanceTextValue>
                            {formatCurrencyWithSign(USD_SIGN, (market as RangedMarketPerPosition).leftPrice)}
                        </SentanceTextValue>
                        <Text>
                            <TextLabel>{' ' + t('options.common.and')}</TextLabel>
                        </Text>
                        <SentanceTextValue>
                            {formatCurrencyWithSign(USD_SIGN, (market as RangedMarketPerPosition).rightPrice)}
                        </SentanceTextValue>
                    </Text>
                </FlexDivCentered>
            )}
            <FlexDivCentered>
                <Text>
                    <TextLabel>{t('options.common.on')}</TextLabel>
                    <SentanceTextValue>{formatShortDateWithTime(maturityDate)}</SentanceTextValue>
                </Text>
            </FlexDivCentered>
            <FlexDivCentered>
                <Text>
                    <TextLabel>{t('options.trade.amm-trading.you-win')}</TextLabel>
                    <SentanceTextValue isProfit={true}>
                        {Number(priceProfit) > 0 && Number(paidAmount) > 0
                            ? potentialWinFormatted
                            : '( ' + t('options.trade.amm-trading.based-amount') + ' )'}
                    </SentanceTextValue>
                </Text>
            </FlexDivCentered>
        </ColumnSpaceBetween>
    );
};

const SentanceTextValue = styled(TextValue)`
    padding-left: 5px;
`;

export default TradingDetailsSentence;
