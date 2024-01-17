import React, { useEffect, useMemo, useState } from 'react';
import ccipAnimation from 'assets/lotties/ccip.json';
import Lottie from 'lottie-react';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { getIsAppReady } from 'redux/modules/app';
import styled from 'styled-components';
import useStakingDataQuery from 'queries/token/useStakingDataQuery';
import { StakingData } from 'types/token';
import { useTranslation } from 'react-i18next';

const CCIPAnimation: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [lastValidStakingData, setLastValidStakingData] = useState<StakingData | undefined>(undefined);

    const stakingDataQuery = useStakingDataQuery(networkId, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (stakingDataQuery.isSuccess && stakingDataQuery.data) {
            setLastValidStakingData(stakingDataQuery.data);
        }
    }, [stakingDataQuery.isSuccess, stakingDataQuery.data]);

    const stakingData: StakingData | undefined = useMemo(() => {
        if (stakingDataQuery.isSuccess && stakingDataQuery.data) {
            return stakingDataQuery.data;
        }
        return lastValidStakingData;
    }, [stakingDataQuery.isSuccess, stakingDataQuery.data, lastValidStakingData]);

    return stakingData?.closingPeriodInProgress ? (
        <LottieContainer>
            <Lottie animationData={ccipAnimation} style={CCIPAnimationStyle} />
            <TextContainer>
                <CCIPMessage>{t('thales-token.gamified-staking.ccip-msg')}</CCIPMessage>
                <DotFlashing />
            </TextContainer>
        </LottieContainer>
    ) : (
        <></>
    );
};

const LottieContainer = styled.div`
    height: 150px;
    position: relative;
    width: 100%;
`;

const CCIPAnimationStyle: React.CSSProperties = {
    position: 'absolute',
    top: -130,
    height: 350,
    width: '100%',
    margin: 'auto',
};

const TextContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 100px;
`;

const CCIPMessage = styled.span`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 28px;
    @media (max-width: 512px) {
        font-size: 22px;
    }
`;

const DotFlashing = styled.div`
    position: relative;
    width: 8px;
    height: 8px;
    border-radius: 5px;
    background-color: ${(props) => props.theme.textColor.primary};
    color: ${(props) => props.theme.textColor.primary};
    animation: dot-flashing 1s infinite linear alternate;
    animation-delay: 0.5s;
    margin-top: 12px;
    margin-left: 20px;

    &::before,
    &::after {
        content: '';
        display: inline-block;
        position: absolute;
        top: 0;
    }
    &::before {
        left: -15px;
        width: 8px;
        height: 8px;
        border-radius: 5px;
        background-color: ${(props) => props.theme.textColor.primary};
        color: ${(props) => props.theme.textColor.primary};
        animation: dot-flashing 1s infinite alternate;
        animation-delay: 0s;
    }
    &::after {
        left: 15px;
        width: 8px;
        height: 8px;
        border-radius: 5px;
        background-color: ${(props) => props.theme.textColor.primary};
        color: ${(props) => props.theme.textColor.primary};
        animation: dot-flashing 1s infinite alternate;
        animation-delay: 1s;
    }

    @keyframes dot-flashing {
        0% {
            background-color: ${(props) => props.theme.textColor.primary};
        }
        50%,
        100% {
            background-color: ${(props) => props.theme.textColor.secondary};
        }
    }
`;

export default CCIPAnimation;
