import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import ClaimRewards from '../ClaimRewards/ClaimRewards';
import StakingOverview from '../StakingOverview';
import PointsBreakdown from '../PointsBreakdown/PointsBreakdown';
import StakingStepsMobile from '../StakingSteps/StakingStepsMobile';
import BaseRewards from '../BaseRewards';

const MobileRewardsView: React.FC = () => {
    const { t } = useTranslation();

    const [learnMoreActive, setLearnMoreActive] = useState<boolean>(false);

    return (
        <Wrapper>
            <Container>
                <Header>{'Thales Staking Rewards'}</Header>
                <LearnMoreLabel onClick={() => setLearnMoreActive(!learnMoreActive)}>
                    {t('landing-page.learn-more')}
                </LearnMoreLabel>
            </Container>
            <ClaimRewards />
            <SecondaryHeader>{t('thales-token.gamified-staking.rewards.claim.gamified-rewards')}</SecondaryHeader>
            <StakingOverview />
            <PointsBreakdown />
            {learnMoreActive && <StakingStepsMobile onClose={() => setLearnMoreActive(false)} />}
            <BaseRewards />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
`;

const Header = styled.h1`
    color: ${(_props) => _props.theme.textColor.primary};
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    text-transform: capitalize;
`;

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-radius: 8px;
    border: 1px solid ${(_props) => _props.theme.borderColor.primary};
    padding: 18px;
    margin-bottom: 10px;
`;

const LearnMoreLabel = styled.span`
    color: ${(_props) => _props.theme.link.textColor.primary};
    font-size: 13px;
    font-weight: 400;
    text-transform: capitalize;
`;

const SecondaryHeader = styled(Header)`
    font-weight: 400;
    margin: 20px 0 10px 0;
`;

export default MobileRewardsView;
