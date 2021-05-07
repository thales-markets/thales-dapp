import React from 'react';
import { OptionsMarketInfo } from 'types/options';
import { FlexDiv, FlexDivRowCentered, FlexDivColumnCentered, FlexDivCentered } from 'theme/common';
import styled from 'styled-components';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { FIAT_CURRENCY_MAP } from 'constants/currency';
import { PhaseLabel } from 'pages/Options/Home/MarketsTable/components';
import { useTranslation } from 'react-i18next';
import { formatShortDate } from 'utils/formatters/date';
import CurrencyIcon from 'components/Currency/CurrencyIcon';
import { getSynthName } from 'utils/snxJSConnector';

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
                            <CryptoName>{getSynthName(optionsMarket.currencyKey)}</CryptoName>
                            <CryptoKey>{optionsMarket.asset}</CryptoKey>
                        </FlexDivColumnCentered>
                    </FlexDivCentered>
                </ItemContainer>
                <ItemContainer>
                    <Title>Strike price</Title>
                    <Content>{formatCurrencyWithKey(FIAT_CURRENCY_MAP.USD, optionsMarket.strikePrice)}</Content>
                </ItemContainer>
                <ItemContainer>
                    <Title>Current market price</Title>
                    <Content>{formatCurrencyWithKey(FIAT_CURRENCY_MAP.USD, optionsMarket.currentPrice)}</Content>
                </ItemContainer>
                <ItemContainer>
                    <Title>Maturity</Title>
                    <Content>{formatShortDate(optionsMarket.maturityDate)}</Content>
                </ItemContainer>
                <ItemContainer>
                    <Title>Current result</Title>
                    <Result isLong={isLong}>{isLong ? 'LONG' : 'SHORT'}</Result>
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
`;
const InnerItemContainer = styled(FlexDivRowCentered)`
    height: 112px;
    &:not(:last-child) {
        border-right: 1px solid #748bc6;
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
`;
const Content = styled.p`
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 25px;
    letter-spacing: 0.15px;
`;
const Phase = styled(PhaseLabel)`
    cursor: default;
`;
const Result = styled(Content)<{ isLong: boolean }>`
    color: ${(props) => (props.isLong ? '#10BA97' : '#D94454')};
    text-transform: uppercase;
`;
const CryptoName = styled.p`
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 20px;
    letter-spacing: 0.5px;
    color: #f6f6fe;
`;
const CryptoKey = styled.p`
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.5px;
    color: #b8c6e5;
`;

export default MarketOverview;
