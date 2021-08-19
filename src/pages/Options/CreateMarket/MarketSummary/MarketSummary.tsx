import { ValueType } from 'react-select';
import { CurrencyKeyOptionType, MarketFees } from '../CreateMarket';
import React, { useMemo } from 'react';
import { FlexDivCentered, FlexDivColumn, Image, Text } from 'theme/common';
import styled from 'styled-components';
import Currency from 'components/Currency';
import { useTranslation } from 'react-i18next';
import { formatCurrencyWithSign, formatPercentage } from 'utils/formatters/number';
import arrowUp from 'assets/images/green-arrow-up.svg';
import arrowDown from 'assets/images/red-arrow-down.svg';
import { USD_SIGN } from 'constants/currency';
import { LightTooltip } from 'pages/Options/Market/components';
import './media.scss';

type MarketSummaryProps = {
    currencyKey?: ValueType<CurrencyKeyOptionType, false>;
    strikingPrice?: number | string;
    currentPrice?: number | string;
    maturityDate?: string;
    initialFundingAmount?: number | string;
    timeLeftToExercise?: string;
    marketFees: MarketFees | null;
};

const MarketSummary: React.FC<MarketSummaryProps> = (props) => {
    const { t } = useTranslation();

    const difference = useMemo(() => {
        if (props.strikingPrice && props.currentPrice) {
            const percentage = (Number(props.strikingPrice) / Number(props.currentPrice) - 1) * 100;
            return { value: Math.abs(Math.round(percentage)), side: percentage > 0 };
        }
        return null;
    }, [props.strikingPrice, props.currentPrice]);

    return (
        <Wrapper>
            <SummaryHeader>
                <Text className="text-m ls5 pale-grey uppercase bold">Market Summary</Text>
            </SummaryHeader>
            <FlexDivColumn
                className="summary-market"
                style={{ justifyContent: 'space-around', flex: 0, minHeight: 160 }}
            >
                <FlexDivCentered
                    className="text-m pale-grey bold uppercase ls5 summary-market__currency"
                    style={{ height: 32 }}
                >
                    {props.currencyKey && (
                        <>
                            <Currency.Icon
                                synthIconStyle={{ width: 24, height: 24 }}
                                currencyKey={props.currencyKey.value}
                            />
                            {props.currencyKey?.label}
                        </>
                    )}
                </FlexDivCentered>
                <FlexDivCentered className="summary-market__price">
                    <div className="summary-market__price__left" style={{ flex: 2, textAlign: 'center' }}>
                        <Text className="text-xs dusty bold summary-market__price__left__label">
                            {t('options.create-market.summary.strikePrice')}
                        </Text>
                        <Text className="text-s pale-grey bold summary-market__price__left__strike-price">
                            {formatCurrencyWithSign(USD_SIGN, Number(props.strikingPrice))}
                        </Text>
                    </div>
                    <div className="summary-market__price__center" style={{ flex: 1, textAlign: 'center' }}>
                        <Text
                            className="text-xs dusty bold summary-market__price__center__tip"
                            style={{ display: 'none' }}
                        >
                            {t('options.create-market.summary.difference')}
                        </Text>
                        {difference && (
                            <LightTooltip title="Difference between strike and current price">
                                <FlexDivCentered style={{ alignItems: 'center' }}>
                                    <Image
                                        style={{ width: 15, height: 15, marginRight: 4 }}
                                        src={difference.side ? arrowUp : arrowDown}
                                    ></Image>
                                    <Text
                                        className={
                                            difference.side
                                                ? 'green text-s bold lh24 ls25'
                                                : 'red text-s bold lh24 ls25'
                                        }
                                    >
                                        {difference.value}%
                                    </Text>
                                </FlexDivCentered>
                            </LightTooltip>
                        )}
                    </div>
                    <div className="summary-market__price__right" style={{ flex: 2, textAlign: 'center' }}>
                        <Text className="text-xs dusty bold summary-market__price__right__label">
                            {t('options.create-market.summary.current')}
                        </Text>
                        <Text className="text-s pale-grey bold summary-market__price__right__current-price">
                            {formatCurrencyWithSign(USD_SIGN, Number(props.currentPrice))}
                        </Text>
                    </div>
                </FlexDivCentered>
            </FlexDivColumn>
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

                <Text className="text-xs bold pale-grey ls25" style={{ marginBottom: 12 }}>
                    {t('options.create-market.summary.note')}
                </Text>
                <ul style={{ listStyleType: 'disc', color: 'white', marginLeft: '20px' }}>
                    <li>
                        <Text className="text-xs pale-grey ls25 lh16" style={{ whiteSpace: 'pre-line' }}>
                            {t('options.create-market.summary.note1')}
                        </Text>
                    </li>
                    <li>
                        <Text className="text-xs pale-grey ls25 lh16" style={{ whiteSpace: 'pre-line' }}>
                            {t('options.create-market.summary.note2')}
                        </Text>
                    </li>
                    <li>
                        <Text className="text-xs pale-grey ls25 lh16" style={{ whiteSpace: 'pre-line' }}>
                            {t('options.create-market.summary.note3')}
                        </Text>
                    </li>
                </ul>
            </MarketInfo>
        </Wrapper>
    );
};

const Wrapper = styled(FlexDivColumn)`
    margin-left: 40px;
    padding-left: 55px;
    position: relative;
    &:before {
        content: '';
        position: absolute;
        height: 600px;
        width: 0.5px;
        left: 10px;
        background: #00f9ff;
        top: 60px;
        filter: blur(1px);
    }
    @media screen and (max-width: 900px) {
        margin-left: 0px;
        padding-left: 0px;
        margin-top: 50px;
        &:before {
            background: none;
        }
    }
`;

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
    @media screen and (max-width: 600px) {
        text-align: left;
        width: 100%;
        margin-bottom: 0px;
        text-indent: 5px;
    }
`;

// const StrikeBy = styled(FlexDiv)`
//     padding: 20px 35px 20px 35px;
//     height: 140px;
//     align-items: flex-end;
// `;

const MarketInfo = styled(FlexDivColumn)`
    padding: 20px 38px;
    font-size: 12px;
    @media screen and (max-width: 900px) {
        padding: 35px 38px;
    }
    @media screen and (max-width: 600px) {
        padding: 0px;
        width: 100%;
        margin-top: 45px;
    }
`;

export default MarketSummary;
