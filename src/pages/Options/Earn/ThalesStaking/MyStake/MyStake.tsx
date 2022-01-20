import React, { useEffect, useMemo, useState } from 'react';
import { formatCurrencyWithKey } from '../../../../../utils/formatters/number';
import { THALES_CURRENCY } from '../../../../../constants/currency';
import useStakingThalesQuery from '../../../../../queries/staking/useStakingThalesQuery';
import useEscrowThalesQuery from '../../../../../queries/staking/useEscrowThalesQuery';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/rootReducer';
import { getIsAppReady } from '../../../../../redux/modules/app';
import { getNetworkId, getWalletAddress } from '../../../../../redux/modules/wallet';
import { useTranslation } from 'react-i18next';
import { FlexDivColumnCentered, FlexDivRow } from '../../../../../theme/common';
import styled from 'styled-components';
import { ClaimMessage, ClaimTitle, EarnSection, SectionHeader } from '../../components';

type MyStakeProps = {
    thalesStaked: string;
    setThalesStaked: (staked: string) => void;
    escrowedBalance: number;
    setEscrowedBalance: (escrowed: number) => void;
};

const MyStake: React.FC<MyStakeProps> = ({ thalesStaked, setThalesStaked, escrowedBalance, setEscrowedBalance }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [unstakingAmount, setUnstakingAmount] = useState<string>('0');

    const stakingThalesQuery = useStakingThalesQuery(walletAddress, networkId, {
        enabled: isAppReady,
    });

    const escrowThalesQuery = useEscrowThalesQuery(walletAddress, networkId, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (stakingThalesQuery.isSuccess && stakingThalesQuery.data) {
            const { thalesStaked, unstakingAmount } = stakingThalesQuery.data;
            setThalesStaked(thalesStaked);
            setUnstakingAmount(unstakingAmount);
        }
        if (escrowThalesQuery.isSuccess && escrowThalesQuery.data) {
            const { escrowedBalance } = escrowThalesQuery.data;
            setEscrowedBalance(escrowedBalance);
        }
    }, [stakingThalesQuery.isSuccess, escrowThalesQuery.isSuccess, stakingThalesQuery.data, escrowThalesQuery.data]);

    const notEligibleForStakingRewards = useMemo(() => {
        return !+thalesStaked && !!+escrowedBalance;
    }, [thalesStaked, escrowedBalance]);

    return (
        <EarnSection
            spanOnTablet={5}
            orderOnMobile={1}
            orderOnTablet={1}
            style={{ gridColumn: 'span 5', gridRow: 'span 2', padding: 0, border: '0', background: 'transparent' }}
        >
            <SectionHeader>{t('options.earn.thales-staking.my-stake.my-stake')}</SectionHeader>
            <Container>
                <TopRow>
                    <StakeItem>
                        <StakeLabel>{t('options.earn.thales-staking.my-stake.staked-in-contract')}</StakeLabel>
                        <StakeInfo style={notEligibleForStakingRewards ? { color: '#ffcc00' } : {}}>
                            {formatCurrencyWithKey(THALES_CURRENCY, thalesStaked)}
                        </StakeInfo>
                        {Number(unstakingAmount) > 0 && (
                            <StyledClaimTitle>
                                <UnstakingConatiner>
                                    <UnstakingTitle>{`${t(
                                        'options.earn.thales-staking.unstake.unstaking'
                                    )} ${formatCurrencyWithKey(THALES_CURRENCY, unstakingAmount)}`}</UnstakingTitle>
                                </UnstakingConatiner>
                            </StyledClaimTitle>
                        )}
                    </StakeItem>
                    <StakeItem>
                        <StakeLabel>{t('options.earn.thales-staking.my-stake.locked-in-escrow')}</StakeLabel>
                        <StakeInfo>{formatCurrencyWithKey(THALES_CURRENCY, escrowedBalance)}</StakeInfo>
                    </StakeItem>
                </TopRow>
                <StakeItem>
                    <StakeLabel>{t('options.earn.thales-staking.my-stake.total-staked')}</StakeLabel>
                    <StakeInfo style={{ fontSize: '25px' }}>
                        {formatCurrencyWithKey(THALES_CURRENCY, Number(escrowedBalance) + Number(thalesStaked))}
                    </StakeInfo>
                    {notEligibleForStakingRewards && (
                        <ClaimMessage>{t('options.earn.thales-staking.my-stake.not-eligible-message')}</ClaimMessage>
                    )}
                </StakeItem>
            </Container>
        </EarnSection>
    );
};

const Container = styled(FlexDivColumnCentered)`
    background: #04045a;
    border-radius: 15px;
    border: 1px solid rgba(100, 217, 254, 0.6);
`;

const TopRow = styled(FlexDivRow)`
    border-bottom: 1px solid rgba(100, 217, 254, 0.6);
`;

const StakeItem = styled(FlexDivColumnCentered)`
    justify-content: center;
    text-align: center;
    padding: 10px;
    &:first-child {
        border-right: 1px solid rgba(100, 217, 254, 0.6);
    }
`;

const StakeLabel = styled.span`
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    color: #b8c6e5;
`;

const StakeInfo = styled.span`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    color: #f6f6fe;
`;

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

export default MyStake;
