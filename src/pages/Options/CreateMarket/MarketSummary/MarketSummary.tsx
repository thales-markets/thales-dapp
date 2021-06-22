import { ValueType } from 'react-select';
import { CurrencyKeyOptionType, MarketFees } from '../CreateMarket';
import React from 'react';
import { FlexDiv, FlexDivColumn, Text } from 'theme/common';
import styled from 'styled-components';
import Currency from 'components/Currency';
import { FIAT_CURRENCY_MAP, USD_SIGN } from 'constants/currency';
import { useTranslation } from 'react-i18next';
import { formatPercentage } from 'utils/formatters/number';

type MarketSummaryProps = {
    currencyKey?: ValueType<CurrencyKeyOptionType, false>;
    strikingPrice?: number | string;
    maturityDate?: string;
    initialFundingAmount?: number | string;
    timeLeftToExercise?: string;
    marketFees: MarketFees | null;
};

const MarketSummary: React.FC<MarketSummaryProps> = (props) => {
    const { t } = useTranslation();
    return (
        <FlexDivColumn
            style={{ borderLeft: '0.5px solid #00F9FF', marginLeft: '40px', maxWidth: '460px', paddingLeft: 55 }}
        >
            <SummaryHeader>
                <Text className="text-s pale-grey uppercase bold">Market Summary</Text>
            </SummaryHeader>
            <StrikeBy>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <Text className="text-xxs dusty bold">Strike price:</Text>
                    <Text className="text-s dark bold">
                        {`${USD_SIGN}  ${
                            props.strikingPrice !== ''
                                ? props.strikingPrice?.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                                : 0
                        } ${FIAT_CURRENCY_MAP.USD}`}
                    </Text>
                </div>
                <div
                    className="text-s dark"
                    style={{ flex: 1, display: 'flex', justifyContent: 'center', alignSelf: 'flex-start' }}
                >
                    {props.currencyKey && (
                        <Currency.Name
                            currencyKey={props.currencyKey.value}
                            showIcon={true}
                            iconProps={{ type: 'asset' }}
                        />
                    )}
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <Text className="text-xxs dusty bold">By:</Text>
                    <Text className="text-s dark bold">{props.maturityDate}</Text>
                </div>
            </StrikeBy>
            <MarketInfo>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text className="text-xxs dark lh24">{t('options.create-market.summary.dates.maturity-date')}</Text>
                    <Text className="text-xxs dark bold lh24">{props.maturityDate}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text className="text-xxs dark lh24">
                        {t('options.create-market.summary.dates.time-to-exercise')}
                    </Text>
                    <Text className="text-xxs dark bold lh24">{props.timeLeftToExercise}</Text>
                </div>
                <div style={{ padding: '10px 0 0 0', borderTop: '1.5px solid rgb(116, 139, 198)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text className="text-xxs dark lh24">{t('options.create-market.summary.fees.minting')}</Text>
                        <Text className="text-xxs dark bold lh24">
                            {formatPercentage(props.marketFees ? props.marketFees.creator + props.marketFees.pool : 0)}
                        </Text>
                    </div>
                    <div style={{ paddingLeft: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text className="text-xxs dark lh24">
                                {t('options.create-market.summary.fees.creator')}
                            </Text>
                            <Text className="text-xxs dark bold lh24">
                                {formatPercentage(props.marketFees ? props.marketFees.creator : 0)}
                            </Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text className="text-xxs dark lh24">{t('options.create-market.summary.fees.pool')}</Text>
                            <Text className="text-xxs dark bold lh24">
                                {formatPercentage(props.marketFees ? props.marketFees.pool : 0)}
                            </Text>
                        </div>
                    </div>
                </div>
            </MarketInfo>
            <Footer>{props.children}</Footer>
        </FlexDivColumn>
    );
};

const SummaryHeader = styled.div`
    background: #04045a;
    white-space: pre;
    padding: 20px 160px;
    border-radius: 20px 20px 0 0;
    width: 100%;
    border-bottom: 1px solid #748bc6;
    text-align: center;
`;

const StrikeBy = styled(FlexDiv)`
    background: #f6f6fe;
    border-top: 1.5px solid #748bc6;
    border-bottom: 1.5px solid #748bc6;
    padding: 10px 35px;
    height: 82px;
    align-items: flex-end;
`;

const MarketInfo = styled(FlexDivColumn)`
    background: #f6f6fe;
    border-top: 1.5px solid #748bc6;
    border-bottom: 1.5px solid #748bc6;
    padding: 20px 38px;
    font-size: 12px;
`;

// const LongShortWrapper = styled.div`
//     border-top: 1.5px solid #748bc6;
//     border-bottom: 1.5px solid #748bc6;
//     padding-top: 10px;
// `;

const Footer = styled(FlexDivColumn)`
    background: #b8c6e5;
    padding: 20px 38px;
`;

export default MarketSummary;
