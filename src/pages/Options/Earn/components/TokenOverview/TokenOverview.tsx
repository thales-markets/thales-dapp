import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { FlexDiv, FlexDivCentered, FlexDivColumnCentered, Image } from 'theme/common';
import styled from 'styled-components';
import { formatCurrencyWithKey, formatCurrencyWithSign } from 'utils/formatters/number';
import { THALES_CURRENCY, USD_SIGN } from 'constants/currency';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ArrowHyperlinkIcon } from 'assets/images/arrow-hyperlink.svg';
import { TokenInfo } from 'types/token';
import { getIsAppReady } from 'redux/modules/app';
import { EMPTY_VALUE } from 'constants/placeholder';
import useTokenInfoQuery from 'queries/token/useTokenInfoQuery';
import thalesTokenIcon from 'assets/images/sidebar/thales-token-white.svg';
import { LightTooltip } from 'pages/Options/Market/components';
import { LINKS } from 'constants/links';
import { getNetworkId } from 'redux/modules/wallet';
import thalesContract from 'utils/contracts/thalesContract';
import { getEtherscanTokenLink } from 'utils/etherscan';
import { ReactComponent as InfoIcon } from 'assets/images/question-mark-circle.svg';
import { getIsOVM } from 'utils/network';

export const TokentOverview: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [tokenInfo, setTokenInfo] = useState<TokenInfo | undefined>(undefined);
    const isL2 = getIsOVM(networkId);

    const tokenInfoQuery = useTokenInfoQuery(networkId, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (tokenInfoQuery.isSuccess && tokenInfoQuery.data) {
            setTokenInfo(tokenInfoQuery.data);
        }
    }, [tokenInfoQuery.isSuccess, tokenInfoQuery.data]);

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
                        {tokenInfo && tokenInfo.price ? (
                            <LightTooltip title={t(`options.earn.overview.price-tooltip${isL2 ? '-l2' : ''}`)}>
                                <StyledLink
                                    href={isL2 ? LINKS.Token.CoinGecko : LINKS.Token.DodoPool}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {formatCurrencyWithSign(USD_SIGN, tokenInfo.price)}
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
                        {tokenInfo && tokenInfo.marketCap
                            ? formatCurrencyWithSign(USD_SIGN, tokenInfo.marketCap)
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
                {!isL2 && (
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
                                    href="https://docs.thalesmarket.io/thales-token/thales-lp-rewards-on-dodo-guide"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <StyledInfoIcon />
                                </StyledLink>
                            </LightTooltip>
                        </FlexDivCentered>
                    </ItemContainer>
                )}
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
    flex-wrap: wrap;
    @media (max-width: 1024px) {
        padding-left: 10px;
        padding-right: 10px;
    }
    @media (max-width: 767px) {
        border-radius: 23px;
        margin-top: 20px;
        padding-left: 0;
        padding-right: 0;
        > * {
            padding: 10px;
            border: none !important;
            &:nth-child(1) {
                flex-basis: 100%;
                order: 1;
                border-bottom: 1px solid rgba(1, 38, 81, 0.8) !important;
            }
            &:nth-child(2) {
                flex-basis: 40%;
                order: 2;
                justify-content: flex-start;
            }
            &:nth-child(3) {
                flex-basis: 40%;
                order: 4;
                justify-content: flex-start;
            }
            &:nth-child(4) {
                flex-basis: 60%;
                order: 3;
                justify-content: flex-end;
                text-align: right;
            }
            &:nth-child(5) {
                flex-basis: 60%;
                order: 5;
                justify-content: flex-end;
                text-align: right;
            }
            &:nth-child(6) {
                flex-basis: 100%;
                order: 6;
                border-top: 1px solid rgba(1, 38, 81, 0.8) !important;
            }
            &:nth-child(6) span {
                font-size: 14px;
                line-height: 16px;
            }
        }
    }
`;

const InnerItemContainer = styled(FlexDivCentered)`
    flex: 1;
    min-height: 76px;
    &:not(:last-child) {
        border-right: 2px solid rgba(1, 38, 81, 0.5);
    }
    color: #b8c6e5;
    @media (max-width: 1024px) {
        flex-basis: 33%;
    }
    @media (max-width: 767px) {
        min-height: 50px;
    }
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
    @media (max-width: 767px) {
        font-size: 12px;
        line-height: 16px;
    }
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
    @media (max-width: 767px) {
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
    }
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

const ArrowIcon = styled(ArrowHyperlinkIcon)`
    @media (max-width: 767px) {
        display: none;
    }
`;

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
    @media (max-width: 767px) {
        display: none;
    }
`;

export default TokentOverview;
