import { currencyKeyToDataFeedSourceMap } from 'constants/currency';
import RangeIllustration from 'pages/AMMTrading/components/RangeIllustration';
import React from 'react';
import { RangedMarketData } from 'types/options';
import {
    AssetContainer,
    AssetNameContainer,
    CurrencyKey,
    LightHeaderText,
    MarketStatus,
    StrongHeaderText,
} from '../MarketsCard/MarketCard';
import PhaseComponent from '../Phase/Phase';
import { CardFooter, CardHeader, HeaderContainer, MiddleContrainer, Wrapper } from './styled-components';
import CurrencyIcon from 'components/Currency/v2/CurrencyIcon';
import Tooltip from 'components/Tooltip';
import { useTranslation } from 'react-i18next';
import { formatShortDate } from 'utils/formatters/date';
import { UI_COLORS } from 'constants/ui';
import { Rates } from 'queries/rates/useExchangeRatesQuery';
import { RangedMarketUI } from 'pages/RangeMarkets/RangeMarkets';

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
                    <CurrencyIcon currencyKey={data?.currencyKey} width="50px" height="50px" />
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
                    marketAddress={data?.address}
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

export default RangeMarketCard;
