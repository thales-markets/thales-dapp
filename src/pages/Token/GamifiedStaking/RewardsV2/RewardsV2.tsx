import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import StakingSteps from './components/StakingSteps/StakingSteps';
import StakingOverview from './components/StakingOverview/StakingOverview';
import PointsBreakdown from './components/PointsBreakdown/PointsBreakdown';
import BaseRewards from './components/BaseRewards/BaseRewards';
import ClaimRewards from './components/ClaimRewards/ClaimRewards';

const RewardsV2: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Wrapper>
            <Header>
                <Div>
                    <Text>{t('thales-token.gamified-staking.rewards.section-description')}</Text>
                    <Text>{t('thales-token.gamified-staking.rewards.section-base-rewards')}</Text>
                    <Text>{t('thales-token.gamified-staking.rewards.section-bonus-rewards')}</Text>
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
    font-size: 13;
    font-weight: 400;
    line-height: 110%;
    margin-top: 16px;
`;

export default RewardsV2;
