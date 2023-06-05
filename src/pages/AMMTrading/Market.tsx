import Loader from 'components/Loader';
import SwitchInput from 'components/SwitchInput';
import ROUTES from 'constants/routes';
import { Positions } from 'enums/options';
import AmmTrading from 'pages/Trade/components/AmmTrading';
import BannerCarousel from 'pages/Trade/components/BannerCarousel';
import RadioButtons from 'pages/Trade/components/RadioButtons';
import useRangedMarketQuery from 'queries/options/rangedMarkets/useRangedMarketQuery';
import useBinaryOptionsMarketQuery from 'queries/options/useBinaryOptionsMarketQuery';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getIsAppReady } from 'redux/modules/app';
import { setIsBuy } from 'redux/modules/marketWidgets';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumn } from 'theme/common';
import { OptionsMarketInfo, OrderSide, RangedMarketData } from 'types/options';
import { history, navigateTo } from 'utils/routes';
import Maturity from './components/Maturity';
import TabContainer from './components/TabContainer';
import WalletBalance from './components/WalletBalance';
import { MarketProvider } from './contexts/MarketContext';
import { RangedMarketProvider } from './contexts/RangedMarketContext';

type MarketProps = {
    marketAddress: string;
    isRangedMarket: boolean;
};

const Market: React.FC<MarketProps> = ({ marketAddress, isRangedMarket }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const [optionMarket, setOptionMarket] = useState<OptionsMarketInfo | null>(null);
    const [rangedMarket, setRangedMarket] = useState<RangedMarketData | null>(null);
    const [inMaturityPhase, setMaturityPhase] = useState<boolean>(false);
    const [networkSwitched, setNetworkSwitched] = useState(false);
    const [orderSide, setOrderSide] = useState<OrderSide>('buy');

    const queryParamPosition = queryString.parse(location.search).position;
    const [positionType, setPositionType] = useState(
        queryParamPosition &&
            ((!isRangedMarket && [Positions.UP, Positions.DOWN].includes(queryParamPosition.toUpperCase())) ||
                (isRangedMarket && [Positions.IN, Positions.OUT].includes(queryParamPosition.toUpperCase())))
            ? queryParamPosition.toUpperCase()
            : isRangedMarket
            ? Positions.IN
            : Positions.UP
    );

    const marketQuery = useBinaryOptionsMarketQuery(marketAddress, {
        enabled: isAppReady && !isRangedMarket,
    });

    const rangedMarketQuery = useRangedMarketQuery(marketAddress, {
        enabled: isAppReady && isRangedMarket,
    });

    useEffect(() => {
        dispatch(setIsBuy(orderSide === 'buy'));
    }, [orderSide]);

    useEffect(() => {
        if (networkSwitched) {
            navigateTo(ROUTES.Options.Home);
        }
        setNetworkSwitched(true);
    }, [networkId]);

    useEffect(() => {
        if (!isRangedMarket && marketQuery.isSuccess && marketQuery.data) {
            setOptionMarket(marketQuery.data);
        } else if (isRangedMarket && rangedMarketQuery.isSuccess && rangedMarketQuery.data) {
            setRangedMarket(rangedMarketQuery.data);
        }
    }, [marketQuery.isSuccess, marketQuery.data, rangedMarketQuery.isSuccess, rangedMarketQuery.data, marketAddress]);

    useEffect(() => {
        if (!isRangedMarket && optionMarket?.phase == 'maturity') {
            setMaturityPhase(true);
        } else if (isRangedMarket && rangedMarket?.phase == 'maturity') {
            setMaturityPhase(true);
        } else {
            setMaturityPhase(false);
        }
    }, [optionMarket?.phase, rangedMarket?.phase]);

    const market = isRangedMarket ? rangedMarket : optionMarket;

    const getAmmTradingMarket = (market: OptionsMarketInfo | RangedMarketData) => {
        return {
            currencyKey: market.currencyKey,
            address: market.address,
            liquidity: 0,
            price: 0,
            roi: 0,
            strikePrice: (market as OptionsMarketInfo).strikePrice,
            leftPrice: (market as RangedMarketData).leftPrice,
            rightPrice: (market as RangedMarketData).rightPrice,
            discount: 0,
            positionType: positionType,
        };
    };

    const getProviderContent = () => (
        <>
            <Container>
                {inMaturityPhase ? (
                    <Maturity isRangedMarket={isRangedMarket} />
                ) : (
                    <>
                        {market && (
                            <>
                                <WalletBalance isRangedMarket={isRangedMarket} positionType={positionType} />
                                <AmmTradingContainer>
                                    <SwitchInput
                                        active={orderSide === 'sell'}
                                        width="40px"
                                        height="16px"
                                        dotSize="10px"
                                        circlePosition="2px"
                                        label={{
                                            firstLabel: t(`common.buy`),
                                            secondLabel: t(`common.sell`),
                                            fontSize: '13px',
                                        }}
                                        handleClick={() => {
                                            setOrderSide(orderSide === 'buy' ? 'sell' : 'buy');
                                        }}
                                    />
                                    <DirectionContainer>
                                        <RadioButtons
                                            onChange={(position) => {
                                                history.push({
                                                    pathname: location.pathname,
                                                    search: queryString.stringify({
                                                        position: position.toLowerCase(),
                                                    }),
                                                });
                                                setPositionType(position);
                                            }}
                                            selected={positionType}
                                            options={
                                                isRangedMarket
                                                    ? [Positions.IN, Positions.OUT]
                                                    : [Positions.UP, Positions.DOWN]
                                            }
                                        />
                                    </DirectionContainer>
                                    <AmmTrading
                                        currencyKey={market.currencyKey}
                                        maturityDate={market.maturityDate}
                                        market={getAmmTradingMarket(market)}
                                        isDetailsPage={true}
                                    />
                                </AmmTradingContainer>
                            </>
                        )}
                    </>
                )}
            </Container>
            <TabContainer isRangedMarket={isRangedMarket} />
        </>
    );

    return market ? (
        <>
            <BannerCarousel />
            <MainContainer>
                {isRangedMarket ? (
                    <RangedMarketProvider rangedMarket={rangedMarket}>{getProviderContent()}</RangedMarketProvider>
                ) : (
                    <MarketProvider optionsMarket={optionMarket}>{getProviderContent()}</MarketProvider>
                )}
            </MainContainer>
        </>
    ) : (
        <Loader />
    );
};

const MainContainer = styled.div`
    margin-top: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    max-width: 974px;
    @media (max-width: 1024px) {
        flex-direction: column;
    }
`;

const Container = styled(FlexDivColumn)`
    margin-right: 10px;
    @media (max-width: 1024px) {
        margin-right: 0px;
        width: 100%;
    }
`;

const AmmTradingContainer = styled(FlexDivColumn)`
    padding: 15px 10px 25px 10px;
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 8px;
`;

const DirectionContainer = styled(FlexDivColumn)`
    margin: 15px 0px 15px 0px;
`;

export default Market;
