import React, { useEffect, useState } from 'react';
import { EarnSection, FullRow, SectionContent, SectionHeader } from '../../components';
import { formatCurrencyWithKey } from '../../../../../utils/formatters/number';
import { THALES_CURRENCY } from '../../../../../constants/currency';
import useStakingThalesQuery from '../../../../../queries/staking/useStakingThalesQuery';
import useEscrowThalesQuery from '../../../../../queries/staking/useEscrowThalesQuery';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/rootReducer';
import { getIsAppReady } from '../../../../../redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from '../../../../../redux/modules/wallet';
import { useTranslation } from 'react-i18next';

type Properties = {
    thalesStaked: number;
    setThalesStaked: (staked: number) => void;
};

const MyStake: React.FC<Properties> = ({ thalesStaked, setThalesStaked }) => {
    const { t } = useTranslation();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const stakingThalesQuery = useStakingThalesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const escrowThalesQuery = useEscrowThalesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const [escrowedBalance, setEscrowedBalance] = useState(0);

    useEffect(() => {
        if (stakingThalesQuery.isSuccess && stakingThalesQuery.data) {
            setThalesStaked(stakingThalesQuery.data.thalesStaked);
        }
        if (escrowThalesQuery.isSuccess && escrowThalesQuery.data) {
            setEscrowedBalance(escrowThalesQuery.data.escrowedBalance);
        }
    }, [stakingThalesQuery.isSuccess, escrowThalesQuery.isSuccess]);

    return (
        <EarnSection style={{ gridColumn: 'span 4' }}>
            <SectionHeader>My Stake</SectionHeader>
            <SectionContent style={{ paddingTop: '15px', height: '100%' }}>
                <FullRow>
                    <div>
                        {t('options.earn.thales-staking.my-stake.staked-in-contract')}:{' '}
                        {formatCurrencyWithKey(THALES_CURRENCY, thalesStaked)}
                    </div>
                </FullRow>
                <FullRow>
                    <div>
                        {t('options.earn.thales-staking.my-stake.locked-in-escrow')}:{' '}
                        {formatCurrencyWithKey(THALES_CURRENCY, escrowedBalance)}
                    </div>
                </FullRow>
                <FullRow>
                    <div>
                        {t('options.earn.thales-staking.my-stake.total-staked')}:{' '}
                        {formatCurrencyWithKey(THALES_CURRENCY, escrowedBalance + thalesStaked)}
                    </div>
                </FullRow>
            </SectionContent>
        </EarnSection>
    );
};

export default MyStake;
