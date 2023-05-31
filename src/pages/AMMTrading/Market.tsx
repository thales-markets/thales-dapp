import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsAppReady } from 'redux/modules/app';
import TabContainer from './components/TabContainer';
import AMM from './components/AMM';
import Maturity from './components/Maturity';
import RangedMarketAMM from './components/RangedMarketAMM';
import { MarketProvider } from './contexts/MarketContext';
import useBinaryOptionsMarketQuery from 'queries/options/useBinaryOptionsMarketQuery';
import useRangedMarketQuery from 'queries/options/rangedMarkets/useRangedMarketQuery';
import { OptionsMarketInfo, OrderSide, RangedMarketData } from 'types/options';
import Loader from 'components/Loader';
import { getNetworkId } from 'redux/modules/wallet';
import { RangedMarketProvider } from './contexts/RangedMarketContext';
import { navigateTo } from 'utils/routes';
import ROUTES from 'constants/routes';
import { FlexDivColumn } from 'theme/common';
import AmmTrading from 'pages/Trade/components/AmmTrading/AmmTrading';
import { Positions } from 'constants/options';
import BannerCarousel from 'pages/Trade/components/BannerCarousel/BannerCarousel';
import WalletBalance from './components/AMM/components/WalletBalance/WalletBalance';
import SwitchInput from 'components/SwitchInput/SwitchInput';
import { useTranslation } from 'react-i18next';
import RadioButtons from 'pages/Trade/components/RadioButtons/RadioButtons';
import { setIsBuy } from 'redux/modules/marketWidgets';

type MarketProps = {
    marketAddress: string;
    isRangedMarket: boolean;
};

const Market: React.FC<MarketProps> = ({ marketAddress, isRangedMarket }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const [optionMarket, setOptionMarket] = useState<OptionsMarketInfo | null>(null);
    const [rangedMarket, setRangedMarket] = useState<RangedMarketData | null>(null);
    const [inMaturityPhase, setMaturityPhase] = useState<boolean>(false);
    const [networkSwitched, setNetworkSwitched] = useState(false);
    const [orderSide, setOrderSide] = useState<OrderSide>('buy');
    const [positionType, setPositionType] = useState(isRangedMarket ? Positions.IN : Positions.UP);

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

    return optionMarket || rangedMarket ? (
        <>
            <BannerCarousel />
            <MainContainer>
                {!isRangedMarket && (
                    <MarketProvider optionsMarket={optionMarket}>
                        <Container>
                            {optionMarket && !inMaturityPhase && (
                                <>
                                    <WalletBalance isRangedMarket={false} positionType={positionType} />
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
                                                onChange={setPositionType}
                                                selected={positionType}
                                                options={[Positions.UP, Positions.DOWN]}
                                            />
                                        </DirectionContainer>
                                        <AmmTrading
                                            currencyKey={optionMarket.currencyKey}
                                            maturityDate={optionMarket.maturityDate}
                                            market={{
                                                currencyKey: optionMarket.currencyKey,
                                                address: optionMarket.address,
                                                liquidity: 0,
                                                price: 0,
                                                strikePrice: optionMarket.strikePrice,
                                                leftPrice: 0,
                                                rightPrice: 0,
                                                discount: 0,
                                                positionType: positionType,
                                            }}
                                            isDetailsPage={true}
                                        />
                                    </AmmTradingContainer>
                                </>
                            )}
                            {inMaturityPhase ? <Maturity isRangedMarket={false} /> : <AMM />}
                        </Container>
                        <TabContainer isRangedMarket={false} />
                    </MarketProvider>
                )}
                {isRangedMarket && (
                    <RangedMarketProvider rangedMarket={rangedMarket}>
                        <Container>
                            {rangedMarket && !inMaturityPhase && (
                                <>
                                    <WalletBalance isRangedMarket={true} positionType={positionType} />
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
                                                onChange={setPositionType}
                                                selected={positionType}
                                                options={[Positions.IN, Positions.OUT]}
                                            />
                                        </DirectionContainer>
                                        <AmmTrading
                                            currencyKey={rangedMarket.currencyKey}
                                            maturityDate={rangedMarket.maturityDate}
                                            market={{
                                                currencyKey: rangedMarket.currencyKey,
                                                address: rangedMarket.address,
                                                liquidity: 0,
                                                price: 0,
                                                strikePrice: 0,
                                                leftPrice: rangedMarket.leftPrice,
                                                rightPrice: rangedMarket.rightPrice,
                                                discount: 0,
                                                positionType: positionType,
                                            }}
                                            isDetailsPage={true}
                                        />
                                    </AmmTradingContainer>
                                </>
                            )}
                            {inMaturityPhase ? <Maturity isRangedMarket={true} /> : <RangedMarketAMM />}
                        </Container>
                        <TabContainer isRangedMarket={true} />
                    </RangedMarketProvider>
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
