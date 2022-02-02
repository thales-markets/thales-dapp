import React from 'react';
import { EarnSection, SectionHeader } from '../../components';
import { useTranslation } from 'react-i18next';
import { StakingRewardsLabel } from '../../gridComponents';
import { FlexDivCentered } from '../../../../../theme/common';
import styled from 'styled-components';
import NetworkFees from '../../../components/NetworkFees';

type Properties = {
    rewards: number;
};

const Rewards: React.FC<Properties> = ({ rewards }) => {
    const { t } = useTranslation();

    return (
        <EarnSection
            spanOnTablet={5}
            orderOnMobile={4}
            orderOnTablet={4}
            style={{ gridColumn: 'span 5', gridRow: 'span 2', padding: 0, border: '0', background: 'transparent' }}
        >
            <SectionHeader>{t('options.earn.lp-staking.rewards.title')}</SectionHeader>
            <EarnSection
                spanOnTablet={5}
                orderOnMobile={4}
                orderOnTablet={4}
                style={{
                    gridColumn: 'span 5',
                    gridRow: 'span 2',
                }}
            >
                <StakingRewardsLabel color="#FA8A6B">
                    {t('options.earn.lp-staking.rewards.lp-staking')}
                </StakingRewardsLabel>
                <Amount>{Math.round(rewards * 100) / 100} THALES</Amount>
                <NetworkFees gasLimit={0} l1Fee={0} />
            </EarnSection>
        </EarnSection>
    );
};

const Amount = styled(FlexDivCentered)`
    font-family: Titillium Web;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 32px;
    letter-spacing: 0.5px;
    color: #ffffff;
    border-bottom: 1px solid rgba(100, 217, 254, 0.6);
`;

export default Rewards;
