import React from 'react';
import { OptionsMarketInfo } from 'types/options';
import { FlexDiv, FlexDivCentered, FlexDivColumnCentered } from 'theme/common';
import styled from 'styled-components';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { FIAT_CURRENCY_MAP } from 'constants/currency';
import { PhaseLabel } from 'pages/Options/Home/MarketsTable/components';
import { useTranslation } from 'react-i18next';
import { formatShortDate } from 'utils/formatters/date';
import CurrencyIcon from 'components/Currency/CurrencyIcon';
// import { getSynthName } from 'utils/snxJSConnector';

type MarketOverviewProps = {
    optionsMarket: OptionsMarketInfo;
};

export const MarketOverview: React.FC<MarketOverviewProps> = ({ optionsMarket }) => {
    const { t } = useTranslation();
    const isLong = optionsMarket.currentPrice > optionsMarket.strikePrice;
    const iconProps = { width: '40px', height: '40px' };
    return (
        <>
            <Container>
                <ItemContainer>
                    <FlexDivCentered>
                        <CurrencyIcon currencyKey={optionsMarket.currencyKey} {...iconProps} />
                        <FlexDivColumnCentered>
                            {/* <CryptoName>{getSynthName(optionsMarket.currencyKey)}</CryptoName> */}
                            <CryptoKey>{optionsMarket.asset}</CryptoKey>
                        </FlexDivColumnCentered>
                    </FlexDivCentered>
                </ItemContainer>
                <ItemContainer>
                    <Title>{t(`options.market.overview.strike-price-label`)}</Title>
                    <Content>{formatCurrencyWithKey(FIAT_CURRENCY_MAP.USD, optionsMarket.strikePrice)}</Content>
                </ItemContainer>
                <ItemContainer>
                    <Title>{t(`options.market.overview.current-market-price`)}</Title>
                    <Content>{formatCurrencyWithKey(FIAT_CURRENCY_MAP.USD, optionsMarket.currentPrice)}</Content>
                </ItemContainer>
                <ItemContainer>
                    <Title>{t(`options.market.overview.maturity-label`)}</Title>
                    <Content>{formatShortDate(optionsMarket.maturityDate)}</Content>
                </ItemContainer>
                <ItemContainer>
                    <Title>{t(`options.market.overview.result-label`)}</Title>
                    <Result isLong={isLong}>{isLong ? t('options.common.long') : t('options.common.short')}</Result>
                </ItemContainer>
                <ItemContainer>
                    <Phase className={optionsMarket.phase}>{t(`options.phases.${optionsMarket.phase}`)}</Phase>
                </ItemContainer>
            </Container>
        </>
    );
};

const ItemContainer: React.FC = (props) => (
    <InnerItemContainer>
        <Item>{props.children}</Item>
    </InnerItemContainer>
);

const Container = styled(FlexDiv)`
    background: #04045a;
    border-radius: 16px;
    margin-bottom: 20px;
`;
const InnerItemContainer = styled(FlexDivCentered)`
    flex: 1;
    height: 112px;
    &:not(:last-child) {
        border-right: 2px solid rgba(1, 38, 81, 0.5);
    }
    color: #b8c6e5;
`;
const Item = styled(FlexDivColumnCentered)`
    flex: initial;
`;
const Title = styled.p`
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.5px;
    color: #b8c6e5;
`;
const Content = styled.p`
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 25px;
    letter-spacing: 0.15px;
    color: #f6f6fe;
`;
const Phase = styled(PhaseLabel)`
    cursor: default;
`;
const Result = styled(Content)<{ isLong: boolean }>`
    color: ${(props) => (props.isLong ? '#10BA97' : '#D94454')};
    text-transform: uppercase;
`;
// const CryptoName = styled.p`
//     font-style: normal;
//     font-weight: bold;
//     font-size: 20px;
//     line-height: 20px;
//     letter-spacing: 0.5px;
//     color: #f6f6fe;
// `;
const CryptoKey = styled.p`
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 20px;
    letter-spacing: 0.5px;
    color: #f6f6fe;
`;

export default MarketOverview;
