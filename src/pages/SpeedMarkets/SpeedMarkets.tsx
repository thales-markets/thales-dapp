import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import UnsupportedNetwork from 'components/UnsupportedNetwork';
import { CRYPTO_CURRENCY_MAP } from 'constants/currency';
import { CONNECTION_TIMEOUT_MS } from 'constants/pyth';
import { Network } from 'enums/network';
import { Positions } from 'enums/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import useInterval from 'hooks/useInterval';
import AssetDropdown from 'pages/Trade/components/AssetDropdown';
import BannerCarousel from 'pages/Trade/components/BannerCarousel';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivStart } from 'styles/common';
import { getCurrencyPriority } from 'utils/currency';
import { getCurrentPrice, getPriceId, getPriceServiceEndpoint } from 'utils/pyth';
import SelectBuyin from './components/SelectBuyin/SelectBuyin';
import SelectPosition from './components/SelectPosition';
import SelectTime from './components/SelectTime/SelectTime';
import SpeedAMMTrading from './components/SpeedAMMTrading/SpeedAMMTrading';

const SUPPORTED_NETWORKS = [Network.OptimismMainnet, Network.OptimismGoerli];
const supportedAssets = [CRYPTO_CURRENCY_MAP.BTC, CRYPTO_CURRENCY_MAP.ETH].sort(
    (a, b) => getCurrencyPriority(a) - getCurrencyPriority(b)
);

const SpeedMarkets: React.FC = () => {
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const [currentPrice, setCurrentPrice] = useState(0);
    const [currencyKey, setCurrencyKey] = useState(supportedAssets[0]);
    const [positionType, setPositionType] = useState<Positions.UP | Positions.DOWN | undefined>(undefined);
    const [deltaTimeSec, setDeltaTimeSec] = useState(0);
    const [strikeTime, setStrikeTime] = useState(0);
    const [buyinAmount, setBuyinAmount] = useState(0);

    const priceConnection = useMemo(() => {
        return new EvmPriceServiceConnection(getPriceServiceEndpoint(networkId), { timeout: CONNECTION_TIMEOUT_MS });
    }, [networkId]);

    // Set initial current price
    useEffect(() => {
        const fetchCurrentPrice = async () => {
            const price = await getCurrentPrice(priceConnection, getPriceId(networkId, currencyKey));
            setCurrentPrice(price || 0);
        };

        fetchCurrentPrice();
    }, [networkId, currencyKey]);

    // Update current price latest on every minute
    useInterval(async () => {
        const price = await getCurrentPrice(priceConnection, getPriceId(networkId, currencyKey));
        setCurrentPrice(price || 0);
    }, 60 * 1000);

    // Reset inputs
    useEffect(() => {
        if (!isWalletConnected) {
            setCurrencyKey(supportedAssets[0]);
            setPositionType(undefined);
            setDeltaTimeSec(0);
            setStrikeTime(0);
            setBuyinAmount(0);
        }
    }, [isWalletConnected]);

    const getStepLabel = (sn: number, name: string) => {
        return (
            <Step>
                <StepNumber>{sn}</StepNumber>
                <StepName>{name}</StepName>
            </Step>
        );
    };

    return (
        <>
            {SUPPORTED_NETWORKS.includes(networkId) ? (
                <Container>
                    <BannerCarousel />
                    <ContentWrapper>
                        <LeftSide>
                            <span style={{ color: 'white' }}>{`Current ${currencyKey} price: ${currentPrice}`}</span>
                        </LeftSide>
                        <RightSide>
                            {getStepLabel(1, t('speed-markets.steps.choose-asset'))}
                            <AssetDropdown
                                asset={currencyKey}
                                setAsset={setCurrencyKey}
                                allAssets={supportedAssets}
                                showAssetIcon={true}
                            />
                            {getStepLabel(2, t('speed-markets.steps.choose-direction'))}
                            <SelectPosition selected={positionType} onChange={setPositionType} />
                            {getStepLabel(3, t('speed-markets.steps.choose-time'))}
                            <SelectTime
                                selectedDeltaSec={deltaTimeSec}
                                selectedTime={strikeTime}
                                onDeltaChange={setDeltaTimeSec}
                                onTimeChange={setStrikeTime}
                            />
                            {getStepLabel(4, t('common.enter-buyin'))}
                            <SelectBuyin value={buyinAmount} onChange={setBuyinAmount} />
                        </RightSide>
                    </ContentWrapper>

                    <SpeedAMMTrading
                        currencyKey={currencyKey}
                        positionType={positionType}
                        strikeTime={strikeTime}
                        deltaTimeSec={deltaTimeSec}
                        buyinAmount={buyinAmount}
                        setBuyinAmount={setBuyinAmount}
                    />
                </Container>
            ) : (
                <UnsupportedNetworkWrapper>
                    <UnsupportedNetwork supportedNetworks={SUPPORTED_NETWORKS} />
                </UnsupportedNetworkWrapper>
            )}
        </>
    );
};

const Container = styled.div`
    width: 100%;
    max-width: 974px;
`;

const ContentWrapper = styled.div`
    width: 100%;
    display: flex;
    gap: 20px;
    margin-top: 20px;
    justify-content: space-between;
    height: 400px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
        gap: 10px;
    }
`;

const LeftSide = styled.div`
    height: 100%;
    width: 100%;
    max-width: 600px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        max-width: initial;
        height: 60px;
    }
`;
const RightSide = styled.div`
    width: 100%;
    height: 100%;
    max-width: 350px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        max-width: initial;
    }
`;

const Step = styled(FlexDivStart)`
    align-items: center;
    :not(:first-child) {
        margin-top: 15px;
    }
    margin-bottom: 11px;
`;
const StepNumber = styled(FlexDivCentered)`
    width: 36px;
    height: 36px;
    border: 3px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 50%;
    color: ${(props) => props.theme.textColor.primary};
    font-weight: 700;
    font-size: 18px;
    line-height: 100%;
`;
const StepName = styled.span`
    font-weight: 400;
    font-size: 18px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.primary};
    margin-left: 8px;
    text-transform: capitalize;
`;

const UnsupportedNetworkWrapper = styled.div`
    margin: 90px 0;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin: 0;
    }
`;

export default SpeedMarkets;
