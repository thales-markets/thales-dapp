import React from 'react';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { THALES_CURRENCY } from 'constants/currency';
import useStakingThalesQuery from 'queries/staking/useStakingThalesQuery';
import useEscrowThalesQuery from 'queries/staking/useEscrowThalesQuery';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ClaimMessage, ClaimTitle, EarnSection, SectionHeader } from '../../components';
import { GridContainer, StakeInfoItem, StakeInfoLabel, StakeInfoContent } from '../../gridComponents';
import { FlexDivRowCentered } from 'theme/common';

const MyStake: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const stakingThalesQuery = useStakingThalesQuery(walletAddress, networkId, {
        enabled: isAppReady,
    });

    const escrowThalesQuery = useEscrowThalesQuery(walletAddress, networkId, {
        enabled: isAppReady,
    });

    const thalesStaked =
        stakingThalesQuery.isSuccess && stakingThalesQuery.data ? Number(stakingThalesQuery.data.thalesStaked) : 0;
    const unstakingAmount =
        stakingThalesQuery.isSuccess && stakingThalesQuery.data ? Number(stakingThalesQuery.data.unstakingAmount) : 0;
    const escrowedBalance =
        escrowThalesQuery.isSuccess && escrowThalesQuery.data ? Number(escrowThalesQuery.data.escrowedBalance) : 0;

    const notEligibleForStakingRewards = thalesStaked === 0 && escrowedBalance > 0;

    return (
        <EarnSection
            spanOnTablet={10}
            orderOnMobile={1}
            orderOnTablet={1}
            style={{ gridColumn: 'span 5', gridRow: 'span 2', padding: 0, border: '0', background: 'transparent' }}
        >
            <MyStakeHeader>
                {t('options.earn.thales-staking.my-stake.my-stake')}
                <DummyDiv></DummyDiv>
            </MyStakeHeader>
            <GridContainer>
                <StakeInfoItem>
                    <StakeInfoLabel>{t('options.earn.thales-staking.my-stake.staked-in-contract')}</StakeInfoLabel>
                    <StakeInfoContent style={notEligibleForStakingRewards ? { color: '#ffcc00' } : {}}>
                        {formatCurrencyWithKey(THALES_CURRENCY, thalesStaked)}
                    </StakeInfoContent>
                    {unstakingAmount > 0 && (
                        <StyledClaimTitle>
                            <UnstakingConatiner>
                                <UnstakingTitle>{`${t(
                                    'options.earn.thales-staking.unstake.unstaking'
                                )} ${formatCurrencyWithKey(THALES_CURRENCY, unstakingAmount)}`}</UnstakingTitle>
                            </UnstakingConatiner>
                        </StyledClaimTitle>
                    )}
                </StakeInfoItem>
                <StakeInfoItem>
                    <StakeInfoLabel>{t('options.earn.thales-staking.my-stake.locked-in-escrow')}</StakeInfoLabel>
                    <StakeInfoContent>{formatCurrencyWithKey(THALES_CURRENCY, escrowedBalance)}</StakeInfoContent>
                </StakeInfoItem>
                <StakeInfoItem style={{ gridColumn: 'span 12' }}>
                    <StakeInfoLabel>{t('options.earn.thales-staking.my-stake.total-staked')}</StakeInfoLabel>
                    <StakeInfoContent style={{ fontSize: '25px' }}>
                        {formatCurrencyWithKey(THALES_CURRENCY, escrowedBalance + thalesStaked)}
                    </StakeInfoContent>
                    {notEligibleForStakingRewards && (
                        <ClaimMessage>{t('options.earn.thales-staking.my-stake.not-eligible-message')}</ClaimMessage>
                    )}
                </StakeInfoItem>
            </GridContainer>
        </EarnSection>
    );
};

const UnstakingConatiner = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
`;

const UnstakingTitle = styled.div`
    background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
    border-radius: 5px;
    padding: 0 5px;
    border: 1px solid #00d1ff;
    font-size: 12px;
    line-height: 24px;
    letter-spacing: 0.4px;
    color: #f6f6fe;
`;

const StyledClaimTitle = styled(ClaimTitle)`
    position: relative;
    padding-bottom: 10px;
    font-size: 17px;
`;

const MyStakeHeader = styled(SectionHeader)`
    flex-direction: column;
    align-items: start;
`;

const DummyDiv = styled(FlexDivRowCentered)`
    min-height: 24px;
    margin-bottom: 2px;
    @media (max-width: 767px) {
        min-height: 0px;
        margin-bottom: 0px;
    }
`;

export default MyStake;
