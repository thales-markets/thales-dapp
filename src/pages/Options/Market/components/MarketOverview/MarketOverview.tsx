import React, { useCallback, useState } from 'react';
import { OptionsMarketInfo } from 'types/options';
import { FlexDiv, FlexDivCentered, FlexDivColumnCentered } from 'theme/common';
import styled from 'styled-components';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { USD_SIGN } from 'constants/currency';
import { PhaseLabel } from 'pages/Options/Home/MarketsTable/components';
import { useTranslation } from 'react-i18next';
import { formatShortDate } from 'utils/formatters/date';
import CurrencyIcon from 'components/Currency/CurrencyIcon';
import { COLORS } from 'constants/ui';
import { LightTooltip, StyledInfoIcon } from '../../components';
import MarketInfoModal from '../../MarketInfoModal';
// import { getSynthName } from 'utils/snxJSConnector';

type MarketOverviewProps = {
    optionsMarket: OptionsMarketInfo;
};

export const MarketOverview: React.FC<MarketOverviewProps> = ({ optionsMarket }) => {
    const { t } = useTranslation();
    const [marketInfoModalVisible, setMarketInfoModalVisible] = useState<boolean>(false);
    const iconProps = { width: '40px', height: '40px' };

    const handleViewMarketDetails = useCallback(() => {
        setMarketInfoModalVisible(true);
    }, []);

    const marketHeading = `${optionsMarket.asset} > ${formatCurrencyWithSign(
        USD_SIGN,
        optionsMarket.strikePrice
    )} @ ${formatShortDate(optionsMarket.maturityDate)}`;

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
                        <LightTooltip title={t('options.market.overview.market-details-tooltip')}>
                            <StyledInfoIcon onClick={handleViewMarketDetails} />
                        </LightTooltip>
                    </FlexDivCentered>
                </ItemContainer>
                <ItemContainer>
                    <Title>{t(`options.market.overview.strike-price-label`)}</Title>
                    <Content>{formatCurrencyWithSign(USD_SIGN, optionsMarket.strikePrice)}</Content>
                </ItemContainer>
                <ItemContainer>
                    <Title>
                        {optionsMarket.isResolved
                            ? t('options.market.overview.final-price-label', {
                                  currencyKey: optionsMarket.asset,
                              })
                            : t('options.market.overview.current-price-label', {
                                  currencyKey: optionsMarket.asset,
                              })}
                    </Title>
                    <Content>
                        {formatCurrencyWithSign(
                            USD_SIGN,
                            optionsMarket.isResolved ? optionsMarket.finalPrice : optionsMarket.currentPrice
                        )}
                    </Content>
                </ItemContainer>
                <ItemContainer>
                    <Title>
                        {optionsMarket.isResolved
                            ? t('options.market.overview.maturity-label')
                            : t('options.market.overview.expiry-label')}
                    </Title>
                    <Content>
                        {optionsMarket.isResolved
                            ? formatShortDate(optionsMarket.maturityDate)
                            : formatShortDate(optionsMarket.expiryDate)}
                    </Content>
                </ItemContainer>
                <ItemContainer>
                    <Title>
                        {optionsMarket.isResolved
                            ? t('options.market.overview.final-result-label')
                            : t('options.market.overview.current-result-label')}
                    </Title>
                    <Result isLong={optionsMarket.result === 'long'}>{optionsMarket.result}</Result>
                </ItemContainer>
                <ItemContainer>
                    <Phase className={optionsMarket.phase}>{t(`options.phases.${optionsMarket.phase}`)}</Phase>
                </ItemContainer>
            </Container>
            {marketInfoModalVisible && (
                <MarketInfoModal
                    marketHeading={marketHeading}
                    optionMarket={optionsMarket}
                    onClose={() => setMarketInfoModalVisible(false)}
                />
            )}
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
    min-height: 76px;
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
    font-weight: 600;
    font-size: 13px;
    line-height: 18px;
    color: #b8c6e5;
`;
const Content = styled.p`
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 18px;
    color: #f6f6fe;
`;
const Phase = styled(PhaseLabel)`
    cursor: default;
`;
const Result = styled(Content)<{ isLong: boolean }>`
    color: ${(props) => (props.isLong ? COLORS.LONG : COLORS.SHORT)};
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
