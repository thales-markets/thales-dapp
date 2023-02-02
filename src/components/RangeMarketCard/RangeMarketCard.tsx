import { currencyKeyToDataFeedSourceMap } from 'constants/currency';
import RangeIllustration from 'components/RangeIllustration';
import React from 'react';
import { RangedMarketData, RangedMarketUI } from 'types/options';

import PhaseComponent from '../Phase/Phase';
import { CardFooter, CardHeader, HeaderContainer, MiddleContrainer, Wrapper } from './styled-components';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import Tooltip from 'components/Tooltip';
import { useTranslation } from 'react-i18next';
import { formatShortDate } from 'utils/formatters/date';
import { UI_COLORS } from 'constants/ui';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import styled from 'styled-components';

type RangeMarketCardProps = {
    data: RangedMarketData | RangedMarketUI;
    exchangeRates: Rates | null;
    marketCardStyle?: {
        maxWidth?: string;
        wrapperMargin?: string;
    };
};

const RangeMarketCard: React.FC<RangeMarketCardProps> = ({ data, exchangeRates, marketCardStyle }) => {
    const currentAssetPrice = exchangeRates?.[data?.currencyKey] || 0;
    const { t } = useTranslation();
    return (
        <Wrapper
            maxWidth={marketCardStyle?.maxWidth ? marketCardStyle.maxWidth : undefined}
            margin={marketCardStyle?.wrapperMargin ? marketCardStyle.wrapperMargin : undefined}
        >
            <CardHeader>
                <AssetContainer>
                    <CurrencyIcon iconType={3} currencyKey={data?.currencyKey} width="50px" height="50px" />
                    <AssetNameContainer>
                        <CurrencyKey>
                            {data.asset}
                            {currencyKeyToDataFeedSourceMap[data.currencyKey]?.source == 'TWAP' && (
                                <Tooltip
                                    message={t('options.home.markets-table.twap-tooltip')}
                                    link={currencyKeyToDataFeedSourceMap[data.currencyKey]?.link}
                                    type={'info'}
                                    iconColor={'var(--primary-color)'}
                                    container={{ width: '15px' }}
                                    interactive={true}
                                />
                            )}
                        </CurrencyKey>
                    </AssetNameContainer>
                </AssetContainer>
                <MarketStatus>
                    <PhaseComponent phase={'trading'}></PhaseComponent>
                </MarketStatus>
            </CardHeader>
            <MiddleContrainer>
                <RangeIllustration
                    priceData={{
                        left: data?.leftPrice,
                        right: data.rightPrice,
                        current: currentAssetPrice,
                    }}
                    fontSize={12}
                    maxWidth={65}
                />
            </MiddleContrainer>
            <CardFooter>
                <HeaderContainer>
                    <LightHeaderText>{t('options.home.market-card.end-date')}</LightHeaderText>
                    <StrongHeaderText>{formatShortDate(data.maturityDate)}</StrongHeaderText>
                </HeaderContainer>
                <HeaderContainer>
                    <LightHeaderText>{'Strike Range'}</LightHeaderText>
                    <StrongHeaderText color={UI_COLORS.GREEN}>{' ( A | B ) '}</StrongHeaderText>
                </HeaderContainer>
            </CardFooter>
        </Wrapper>
    );
};

const AssetContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: start;
`;

const AssetNameContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: left;
    font-size: 15px;
    color: var(--primary-color) !important;
`;

const CurrencyKey = styled.span<{ alignSelf?: string }>`
    display: flex;
    flex-direction: row;
    ${(_props) => (_props?.alignSelf ? `align-self: ${_props?.alignSelf}` : '')};
    font-family: Roboto !important;
    font-style: normal;
    font-size: 20px;
    text-transform: uppercase;
    font-weight: 700;
`;

const MarketStatus = styled.span`
    font-family: Roboto !important;
    font-style: normal;
    font-size: 10px;
    display: block;
    line-height: 18px;
`;

const LightHeaderText = styled.span`
    display: flex;
    flex-direction: row;
    color: var(--primary-color);
    font-family: Roboto !important;
    font-style: normal;
    line-height: 110%;
    font-size: 14px;
`;

const StrongHeaderText = styled(LightHeaderText)<{ color?: string }>`
    ${(_props) => (_props?.color ? `color: ${_props.color};` : '')}
    font-size: 25px;
    font-weight: 700;
`;

export default RangeMarketCard;
