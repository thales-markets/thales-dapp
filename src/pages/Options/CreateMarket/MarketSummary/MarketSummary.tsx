import { ValueType } from 'react-select';
import { CurrencyKeyOptionType, MarketFees } from '../CreateMarket';
import React from 'react';
import { FlexDiv, FlexDivCentered, FlexDivColumn, Text } from 'theme/common';
import styled from 'styled-components';
import Currency from 'components/Currency';
import { FIAT_CURRENCY_MAP, USD_SIGN } from 'constants/currency';
import { useTranslation } from 'react-i18next';
import { formatPercentage } from 'utils/formatters/number';
import { get } from 'lodash';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';

type MarketSummaryProps = {
    currencyKey?: ValueType<CurrencyKeyOptionType, false>;
    strikingPrice?: number | string;
    maturityDate?: string;
    initialFundingAmount?: number | string;
    timeLeftToExercise?: string;
    marketFees: MarketFees | null;
};

const MarketSummary: React.FC<MarketSummaryProps> = (props) => {
    const exchangeRatesQuery = useExchangeRatesQuery();
    const exchangeRates = exchangeRatesQuery.isSuccess ? exchangeRatesQuery.data ?? null : null;
    const { t } = useTranslation();
    return (
        <FlexDivColumn
            style={{ borderLeft: '0.5px solid #00F9FF', marginLeft: '40px', maxWidth: '500px', paddingLeft: 55 }}
        >
            <SummaryHeader>
                <Text className="text-m ls5 pale-grey uppercase bold">Market Summary</Text>
            </SummaryHeader>
            <Text style={{ textAlign: 'center', marginBottom: 40 }} className="text-s ls25 pale-grey ">
                {t('options.create-market.summary.subtitle')}
            </Text>
            <StrikeBy>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <Text className="text-xs dusty bold">{t('options.create-market.summary.strikePrice')}</Text>
                    <Text className="text-s pale-grey bold">
                        {`${USD_SIGN}  ${props.strikingPrice ? props.strikingPrice.toString() : 0} ${
                            FIAT_CURRENCY_MAP.USD
                        }`}
                    </Text>
                </div>
                <div
                    className="text-m pale-grey bold uppercase ls5"
                    style={{ flex: 1, display: 'flex', justifyContent: 'center', alignSelf: 'flex-start' }}
                >
                    {props.currencyKey && (
                        <FlexDivCentered>
                            <Currency.Icon currencyKey={props.currencyKey.value} />
                            {props.currencyKey.label}
                        </FlexDivCentered>
                    )}
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <Text className="text-xs dusty bold">{t('options.create-market.summary.current')}</Text>
                    <Text className="text-s pale-grey bold">
                        {`${USD_SIGN}   ${
                            props.currencyKey
                                ? get(exchangeRates, props.currencyKey.value, null)?.toFixed(4).toString()
                                : ''
                        } ${FIAT_CURRENCY_MAP.USD}`}
                    </Text>
                </div>
            </StrikeBy>
            <MarketInfo>
                <PrettyWrapper>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            borderBottom: '0.5px solid #748BC6',
                            paddingBottom: 4,
                        }}
                    >
                        <Text className="text-xs pale-grey lh24">
                            {t('options.create-market.summary.dates.maturity-date')}
                        </Text>
                        <Text className="text-xs pale-grey bold lh24">{props.maturityDate}</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4 }}>
                        <Text className="text-xs pale-grey lh24">
                            {t('options.create-market.summary.dates.time-to-exercise')}
                        </Text>
                        <Text className="text-xs pale-grey bold lh24">{props.timeLeftToExercise}</Text>
                    </div>
                </PrettyWrapper>
                <PrettyWrapper>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text className="text-xs pale-grey lh24">
                            {t('options.create-market.summary.fees.minting')}
                        </Text>
                        <Text className="text-xs pale-grey bold lh24">
                            {formatPercentage(props.marketFees ? props.marketFees.creator + props.marketFees.pool : 0)}
                        </Text>
                    </div>
                    <div style={{ paddingLeft: 20 }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderBottom: '0.5px dashed #748BC6',
                            }}
                        >
                            <Text className="text-xs pale-grey lh24">
                                {t('options.create-market.summary.fees.creator')}
                            </Text>
                            <Text className="text-xs pale-grey bold lh24">
                                {formatPercentage(props.marketFees ? props.marketFees.creator : 0)}
                            </Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text className="text-xs pale-grey lh24">
                                {t('options.create-market.summary.fees.pool')}
                            </Text>
                            <Text className="text-xs pale-grey bold lh24">
                                {formatPercentage(props.marketFees ? props.marketFees.pool : 0)}
                            </Text>
                        </div>
                    </div>
                </PrettyWrapper>
            </MarketInfo>
            <Footer>{props.children}</Footer>
        </FlexDivColumn>
    );
};

const PrettyWrapper = styled.div`
    background: linear-gradient(148.33deg, rgba(255, 255, 255, 0.03) -2.8%, rgba(255, 255, 255, 0.01) 106.83%);
    box-shadow: 0px 25px 30px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(4px);
    border-radius: 23px;
    border-left: 2px solid #8c72b833;
    border-top: 2px solid #8c72b833;
    border-right: 2px solid #6ac1d533;
    border-bottom: 2px solid #6ac1d533;
    padding: 15px 24px;
    margin-bottom: 24px;
`;

const SummaryHeader = styled.div`
    white-space: pre;
    padding: 10px 0px;
    margin-bottom: 20px;
    width: 100%;
    border-bottom: 0.5px solid #748bc6;
    text-align: center;
`;

const StrikeBy = styled(FlexDiv)`
    padding: 0px 35px 10px 35px;
    height: 100px;
    align-items: flex-end;
`;

const MarketInfo = styled(FlexDivColumn)`
    padding: 20px 38px;
    font-size: 12px;
`;

const Footer = styled(FlexDivColumn)`
    padding: 20px 38px;
`;

export default MarketSummary;
