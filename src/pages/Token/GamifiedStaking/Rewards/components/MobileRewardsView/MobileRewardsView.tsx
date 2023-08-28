import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import ClaimRewards from '../../../RewardsV2/components/ClaimRewards';
import StakingOverview from '../../../RewardsV2/components/StakingOverview';
import PointsBreakdown from '../../../RewardsV2/components/PointsBreakdown';
import StakingStepsMobile from '../../../RewardsV2/components/StakingSteps/StakingStepsMobile';
import BaseRewards from '../../../RewardsV2/components/BaseRewards';
import { TransactionFilterEnum } from 'enums/token';
import TransactionsWithFilters from 'pages/Token/components/TransactionsWithFilters';
import { useSelector } from 'react-redux';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';

const MobileRewardsView: React.FC = () => {
    const { t } = useTranslation();
    const isWalletconnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const [learnMoreActive, setLearnMoreActive] = useState<boolean>(false);

    return (
        <Wrapper>
            <Container>
                <Header>{t('thales-token.gamified-staking.rewards.section-title-staking')}</Header>
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
            <TxWrapper>
                {isWalletconnected && (
                    <TransactionsWithFilters
                        filters={[TransactionFilterEnum.CLAIM_STAKING_REWARDS]}
                        hideFilters
                        hideTitle
                    />
                )}
            </TxWrapper>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
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

const TxWrapper = styled.div`
    max-width: calc(100vw - 30px);
    margin: auto;
`;

export default MobileRewardsView;
