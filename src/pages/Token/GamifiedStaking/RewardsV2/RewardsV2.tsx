import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import StakingSteps from './components/StakingSteps/StakingSteps';
import StakingOverview from './components/StakingOverview/StakingOverview';
import PointsBreakdown from './components/PointsBreakdown/PointsBreakdown';
import BaseRewards from './components/BaseRewards/BaseRewards';
import ClaimRewards from './components/ClaimRewards/ClaimRewards';
import { BoldedText, HighlightText } from './components/StakingSteps/styled-components';
import useStakingOverviewQuery, { OverviewData } from 'queries/token/useStakingOverviewQuery';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';

const RewardsV2: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const [stakingData, setStakingData] = useState<OverviewData | null>(null);

    const query = useStakingOverviewQuery(walletAddress, networkId, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (query.data && query.isSuccess) {
            setStakingData(query.data);
        }
    }, [query.data]);

    return (
        <Wrapper>
            <Header>
                <Div>
                    <Text>
                        <Trans
                            i18nKey="thales-token.gamified-staking.rewards.section-description"
                            components={{
                                bold: <BoldedText />,
                                highlight: <HighlightText />,
                            }}
                        />
                    </Text>
                    <Text>
                        <Trans
                            i18nKey="thales-token.gamified-staking.rewards.section-base-rewards"
                            components={{
                                bold: <BoldedText />,
                                highlight: <HighlightText />,
                            }}
                            values={{
                                fixedPeriodReward: stakingData?.fixedPeriodReward,
                            }}
                        />
                    </Text>
                    <Text>
                        <Trans
                            i18nKey="thales-token.gamified-staking.rewards.section-bonus-rewards"
                            components={{
                                bold: <BoldedText />,
                                highlight: <HighlightText />,
                            }}
                            values={{
                                bonusRewards: stakingData?.bonusRewards,
                            }}
                        />
                    </Text>
                </Div>
                <Div>
                    <ClaimRewards />
                </Div>
            </Header>
            <StakingSteps />
            <StakingOverview />
            <PointsBreakdown />
            <BaseRewards />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
`;

const Header = styled.div`
    display: flex;
    justify-content: center;
    gap: 16px;
`;

const Div = styled.div`
    flex: 1;
`;

const Text = styled.p`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 13px;
    font-weight: 400;
    line-height: 110%;
    margin-top: 16px;
`;

export default RewardsV2;
