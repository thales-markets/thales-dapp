import React, { CSSProperties, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { FlexDivCentered, FlexDivColumnCentered } from 'theme/common';
import styled, { useTheme } from 'styled-components';
import { formatCurrencyWithKey, formatCurrencyWithSign } from 'utils/formatters/number';
import { THALES_CURRENCY, USD_SIGN } from 'constants/currency';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ArrowHyperlinkIcon } from 'assets/images/arrow-hyperlink.svg';
import { TokenInfo } from 'types/token';
import { getIsAppReady } from 'redux/modules/app';
import { EMPTY_VALUE } from 'constants/placeholder';
import useTokenInfoQuery from 'queries/token/useTokenInfoQuery';
import { getNetworkId } from 'redux/modules/wallet';
import thalesContract from 'utils/contracts/thalesContract';
import { getEtherscanTokenLink } from 'utils/etherscan';
import { getIsOVM, Network, NetworkId } from 'utils/network';
import Lottie from 'lottie-react';
import thalesBurnedAnimation from 'assets/lotties/thales-burned.json';
import Tooltip from 'components/TooltipV2/Tooltip';
import { ThemeInterface } from 'types/ui';
import { ScreenSizeBreakpoint } from 'constants/ui';

const TokentOverview: React.FC = () => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();
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
        <Container>
            <ItemContainer>
                <FlexDivCentered>
                    <CustomIcon className={`sidebar-icon icon--token`} />
                    <Tooltip overlay={t('options.earn.overview.token-tooltip')}>
                        <StyledLink
                            href={getEtherscanTokenLink(networkId, thalesContract.addresses[networkId])}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <CryptoName>{THALES_CURRENCY}</CryptoName>
                            <ArrowIcon style={{ marginLeft: 4 }} width="10" height="10" />
                        </StyledLink>
                    </Tooltip>
                </FlexDivCentered>
            </ItemContainer>
            <ItemContainer>
                <Title>{t('options.earn.overview.price-label')}</Title>
                <Content>
                    {tokenInfo && tokenInfo.price ? (
                        <Tooltip overlay={t(getTitleForPrice(networkId))}>
                            <StyledLink href={getUrlForSwap(networkId)} target="_blank" rel="noreferrer">
                                {formatCurrencyWithSign(USD_SIGN, tokenInfo.price)}
                                <ArrowIcon style={{ marginLeft: 4 }} width="10" height="10" />
                            </StyledLink>
                        </Tooltip>
                    ) : (
                        <>{EMPTY_VALUE}</>
                    )}
                </Content>
            </ItemContainer>
            <ItemContainer>
                <Title>{t('options.earn.overview.market-cap-label')}</Title>
                <Content>
                    {tokenInfo && tokenInfo.marketCap
                        ? formatCurrencyWithSign(USD_SIGN, Math.round(tokenInfo.marketCap), 0, true)
                        : EMPTY_VALUE}
                </Content>
            </ItemContainer>
            <ItemContainer>
                <Title>{t('options.earn.overview.circulating-supply-label')}</Title>
                <Content>
                    {tokenInfo
                        ? formatCurrencyWithKey(THALES_CURRENCY, Math.round(tokenInfo.circulatingSupply), 0, true)
                        : EMPTY_VALUE}
                </Content>
            </ItemContainer>
            <ItemContainer>
                <ThalesBurnedWrapper>
                    <Title color={theme.error.textColor.primary} noWrap={true}>
                        {t('options.earn.overview.total-burned-label')}
                    </Title>
                    <Lottie animationData={thalesBurnedAnimation} style={thalesBurnedStyle} />
                </ThalesBurnedWrapper>
                <Content color={theme.error.textColor.primary}>
                    {tokenInfo
                        ? formatCurrencyWithKey(THALES_CURRENCY, Math.round(tokenInfo.thalesBurned), 0, true)
                        : EMPTY_VALUE}
                </Content>
            </ItemContainer>
            <ItemContainer>
                <Title>{t('options.earn.overview.total-supply-label')}</Title>
                <Content>
                    {tokenInfo
                        ? formatCurrencyWithKey(
                              THALES_CURRENCY,
                              Math.round(tokenInfo.totalSupply - tokenInfo.thalesBurned),
                              0,
                              true
                          )
                        : EMPTY_VALUE}
                </Content>
            </ItemContainer>
            <ItemContainer>
                <FlexDivCentered>
                    <Tooltip overlay={t('options.earn.overview.celer-bridge-tooltip')}>
                        <StyledLink
                            href={
                                isL2
                                    ? 'https://cbridge.celer.network/1/10/THALES'
                                    : 'https://cbridge.celer.network/10/42161/THALES'
                            }
                            target="_blank"
                            rel="noreferrer"
                        >
                            <CryptoName>{t('options.earn.overview.celer-bridge')}</CryptoName>
                            <ArrowIcon style={{ marginLeft: 4, marginRight: 10 }} width="10" height="10" />
                        </StyledLink>
                    </Tooltip>
                </FlexDivCentered>
            </ItemContainer>
        </Container>
    );
};

const getUrlForSwap = (networkId: NetworkId) => {
    switch (networkId) {
        case Network['Mainnet-Ovm']:
            return 'https://app.uniswap.org/#/swap?outputCurrency=0x217d47011b23bb961eb6d93ca9945b7501a5bb11';
        case Network.Arbitrum:
            return 'https://app.camelot.exchange';

        default:
            return 'https://app.uniswap.org/#/swap?outputCurrency=0x8947da500Eb47F82df21143D0C01A29862a8C3c5';
    }
};

const getTitleForPrice = (networkId: NetworkId) => {
    switch (networkId) {
        case Network['Mainnet-Ovm']:
            return 'options.earn.overview.price-tooltip-l2';
        case Network.Arbitrum:
            return 'options.earn.overview.price-tooltip-camelot';

        default:
            return 'options.earn.overview.price-tooltip-l2';
    }
};

const ItemContainer: React.FC<{ className?: string }> = (props) => (
    <InnerItemContainer className={props.className ?? ''}>
        <Item>{props.children}</Item>
    </InnerItemContainer>
);

const Container = styled(FlexDivCentered)`
    min-height: 76px;
    background: ${(props) => props.theme.background.primary};
    border-radius: 15px;
    border: 2px solid ${(props) => props.theme.borderColor.primary};
    margin-bottom: 10px;
    flex-wrap: wrap;
    @media (max-width: 1024px) {
        padding-left: 10px;
        padding-right: 10px;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        border-radius: 23px;
        margin-top: 20px;
        padding-left: 0;
        padding-right: 0;
        > * {
            padding: 10px;
            border: none !important;
            &:nth-child(1) {
                flex-basis: 50%;
                order: 1;
                border-bottom: 1px solid ${(props) => props.theme.borderColor.primary} !important;
                justify-content: flex-start;
            }
            &:nth-child(2) {
                flex-basis: 50%;
                order: 2;
                border-bottom: 1px solid ${(props) => props.theme.borderColor.primary} !important;
                justify-content: flex-start;
            }
            &:nth-child(3) {
                flex-basis: 50%;
                order: 3;
                justify-content: flex-start;
            }
            &:nth-child(4) {
                flex-basis: 50%;
                order: 4;
                justify-content: flex-start;
            }
            &:nth-child(5) {
                flex-basis: 50%;
                order: 5;
                justify-content: flex-start;
            }
            &:nth-child(6) {
                flex-basis: 50%;
                order: 6;
                justify-content: flex-start;
            }
            &:nth-child(7) {
                flex-basis: 100%;
                order: 7;
                border-top: 1px solid ${(props) => props.theme.borderColor.primary} !important;
            }
            &:nth-child(7) span {
                font-size: 14px;
                line-height: 16px;
            }
        }
    }
`;

const InnerItemContainer = styled(FlexDivCentered)`
    flex: 1;
    height: 50px;
    &:not(:last-child) {
        border-right: 2px solid ${(props) => props.theme.borderColor.primary};
    }
    @media (max-width: 1192px) {
        min-height: 60px;
    }
    @media (max-width: 1024px) {
        flex-basis: 33%;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        min-height: 50px;
    }
`;

const Item = styled(FlexDivColumnCentered)`
    flex: initial;
`;

const Title = styled.p<{ color?: string; noWrap?: boolean }>`
    font-weight: 400;
    font-size: 13px;
    line-height: 18px;
    color: ${(props) => props.color || props.theme.textColor.primary};
    ${(props) => (props.noWrap ? 'white-space: nowrap;' : '')};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 12px;
        line-height: 16px;
    }
`;

const Content = styled.div<{ fontSize?: number; color?: string }>`
    font-weight: bold;
    font-size: ${(props) => props.fontSize || 16}px;
    line-height: 18px;
    color: ${(props) => props.color || props.theme.textColor.primary};
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    @media (max-width: 1192px) {
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
    }
`;

const StyledLink = styled.a`
    color: ${(props) => props.theme.link.textColor.secondary};
    & path {
        fill: ${(props) => props.theme.link.textColor.secondary};
    }
    &:hover {
        text-decoration: underline;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        color: ${(props) => props.theme.link.textColor.secondary};
    }
`;

const ArrowIcon = styled(ArrowHyperlinkIcon)`
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        color: ${(props) => props.theme.link.textColor.secondary};
        & path {
            fill: ${(props) => props.theme.link.textColor.secondary};
        }
    }
`;

const CustomIcon = styled.i`
    margin-right: 10px;
`;

const CryptoName = styled.span`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
`;

const ThalesBurnedWrapper = styled.div`
    display: flex;
    position: relative;
    @media (min-width: 1024px) and (max-width: 1192px) {
        margin-right: 20px;
    }
`;

const thalesBurnedStyle: CSSProperties = {
    height: 48,
    width: 48,
    position: 'absolute',
    right: -35,
    top: -12,
};

export default TokentOverview;
