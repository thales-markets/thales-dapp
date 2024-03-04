import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import StakingSteps from './components/StakingSteps';
import StakingOverview from './components/StakingOverview/StakingOverview';
import PointsBreakdown from './components/PointsBreakdown/PointsBreakdown';
import BaseRewards from './components/BaseRewards/BaseRewards';
import ClaimRewards from './components/ClaimRewards/ClaimRewards';
import { BoldedText, HighlightText } from './components/StakingSteps/styled-components';
import { useSelector } from 'react-redux';
import { RootState } from 'types/ui';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import { formatCurrency } from 'thales-utils';
import TransactionsWithFilters from 'pages/Token/components/TransactionsWithFilters/TransactionsWithFilters';
import { TransactionFilterEnum } from 'enums/token';
import useGlobalStakingDataQuery from 'queries/token/useGlobalStakingDataQuery';
import { GlobalStakingData } from 'types/token';

const RewardsV2: React.FC = () => {
    const isWalletconnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const [stakingData, setStakingData] = useState<GlobalStakingData | null>(null);

    const query = useGlobalStakingDataQuery({
        enabled: isAppReady,
    });

    useEffect(() => {
        if (query.data && query.isSuccess) {
            setStakingData(query.data);
        }
    }, [query.data, query.isSuccess]);

    return (
        <Wrapper>
            <Header>
                <Div>
                    <Text>
                        <Trans
                            i18nKey="thales-token.gamified-staking.rewards.section-description-intro"
                            components={{
                                bold: <BoldedText />,
                                highlight: <HighlightText />,
                            }}
                        />
                    </Text>
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
                                fixedPeriodReward: formatCurrency(stakingData?.baseRewards ?? 0),
                                bonusRewards: formatCurrency(stakingData?.extraRewards ?? 0),
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
            {isWalletconnected && (
                <TransactionsWithFilters
                    filters={[TransactionFilterEnum.CLAIM_STAKING_REWARDS]}
                    hideFilters
                    hideTitle
                />
            )}
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
