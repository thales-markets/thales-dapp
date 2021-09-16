import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { FlexDiv, FlexDivCentered, FlexDivColumnCentered, Image } from 'theme/common';
import styled from 'styled-components';
import { formatCurrencyWithKey, formatCurrencyWithSign } from 'utils/formatters/number';
import { SYNTHS_MAP, THALES_CURRENCY, USD_SIGN } from 'constants/currency';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ArrowHyperlinkIcon } from 'assets/images/arrow-hyperlink.svg';
import { TokenInfo } from 'types/token';
import { getIsAppReady } from 'redux/modules/app';
import { EMPTY_VALUE } from 'constants/placeholder';
import useTokenInfoQuery from 'queries/token/useTokenInfoQuery';
import thalesTokenIcon from 'assets/images/sidebar/thales-token-white.svg';
import { LightTooltip } from 'pages/Options/Market/components';
import { LINKS } from 'constants/links';
import useExchangeRatesQuery from 'queries/rates/useExchangeRatesQuery';
import { get } from 'lodash';
import { getNetworkId } from 'redux/modules/wallet';
import thalesContract from 'utils/contracts/thalesContract';
import { getEtherscanTokenLink } from 'utils/etherscan';
import { ReactComponent as InfoIcon } from 'assets/images/question-mark-circle.svg';

export const TokentOverview: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [tokenInfo, setTokenInfo] = useState<TokenInfo | undefined>(undefined);

    const tokenInfoQuery = useTokenInfoQuery(networkId, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (tokenInfoQuery.isSuccess && tokenInfoQuery.data) {
            setTokenInfo(tokenInfoQuery.data);
        }
    }, [tokenInfoQuery.isSuccess, tokenInfoQuery.data]);

    const exchangeRatesQuery = useExchangeRatesQuery({ enabled: isAppReady });
    const exchangeRates = exchangeRatesQuery.isSuccess ? exchangeRatesQuery.data ?? null : null;
    const ethRate = get(exchangeRates, SYNTHS_MAP.sETH, null);

    return (
        <>
            <Container>
                <ItemContainer>
                    <FlexDivCentered>
                        <CustomIcon src={thalesTokenIcon}></CustomIcon>
                        <LightTooltip title={t('options.earn.overview.token-tooltip')}>
                            <StyledLink
                                href={getEtherscanTokenLink(networkId, thalesContract.addresses[networkId])}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <CryptoName>{THALES_CURRENCY}</CryptoName>
                                <ArrowIcon style={{ marginLeft: 4 }} width="10" height="10" />
                            </StyledLink>
                        </LightTooltip>
                    </FlexDivCentered>
                </ItemContainer>
                <ItemContainer>
                    <Title>{t('options.earn.overview.price-label')}</Title>
                    <Content>
                        {tokenInfo && tokenInfo.price && ethRate !== null ? (
                            <LightTooltip title={t('options.earn.overview.price-tooltip')}>
                                <StyledLink href={LINKS.Token.DodoPool} target="_blank" rel="noreferrer">
                                    {formatCurrencyWithSign(USD_SIGN, tokenInfo.price * ethRate)}
                                    <ArrowIcon style={{ marginLeft: 4 }} width="10" height="10" />
                                </StyledLink>
                            </LightTooltip>
                        ) : (
                            <>{EMPTY_VALUE}</>
                        )}
                    </Content>
                </ItemContainer>
                <ItemContainer>
                    <Title>{t('options.earn.overview.market-cap-label')}</Title>
                    <Content>
                        {tokenInfo && tokenInfo.marketCap && ethRate !== null
                            ? formatCurrencyWithSign(USD_SIGN, tokenInfo.marketCap * ethRate)
                            : EMPTY_VALUE}
                    </Content>
                </ItemContainer>
                <ItemContainer>
                    <Title>{t('options.earn.overview.circulating-supply-label')}</Title>
                    <Content>
                        {tokenInfo
                            ? formatCurrencyWithKey(THALES_CURRENCY, tokenInfo.circulatingSupply, 0, true)
                            : EMPTY_VALUE}
                    </Content>
                </ItemContainer>
                <ItemContainer>
                    <Title>{t('options.earn.overview.total-supply-label')}</Title>
                    <Content>
                        {tokenInfo
                            ? formatCurrencyWithKey(THALES_CURRENCY, tokenInfo.totalSupply, 0, true)
                            : EMPTY_VALUE}
                    </Content>
                </ItemContainer>
                <ItemContainer>
                    <FlexDivCentered>
                        <LightTooltip title={t('options.earn.overview.earn-tooltip')}>
                            <StyledLink
                                href="https://app.dodoex.io/liquidity?poolAddress=0x031816fd297228e4fd537c1789d51509247d0b43"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <CryptoName>{t('options.earn.overview.earn-label')}</CryptoName>
                                <ArrowIcon style={{ marginLeft: 4, marginRight: 10 }} width="10" height="10" />
                            </StyledLink>
                        </LightTooltip>
                        <LightTooltip title={t('options.earn.overview.earn-info-tooltip')}>
                            <StyledLink
                                href="https://docs.thales.market/using-thales/thales+dodo-lp-rewards-guide"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <StyledInfoIcon />
                            </StyledLink>
                        </LightTooltip>
                    </FlexDivCentered>
                </ItemContainer>
            </Container>
        </>
    );
};

const ItemContainer: React.FC<{ className?: string }> = (props) => (
    <InnerItemContainer className={props.className ?? ''}>
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

const Content = styled.div<{ fontSize?: number }>`
    font-style: normal;
    font-weight: bold;
    font-size: ${(props) => props.fontSize || 16}px;
    line-height: 18px;
    color: #f6f6fe;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

const StyledLink = styled.a`
    color: #f6f6fe;
    &path {
        fill: #f6f6fe;
    }
    &:hover {
        color: #00f9ff;
        & path {
            fill: #00f9ff;
        }
    }
`;

const ArrowIcon = styled(ArrowHyperlinkIcon)``;

const CustomIcon = styled(Image)`
    margin-right: 10px;
    width: 40px;
    height: 40px;
`;

const CryptoName = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
`;

export const StyledInfoIcon = styled(InfoIcon)`
    min-width: 18px;
    min-height: 18px;
    margin-bottom: -2px;
`;

export default TokentOverview;
