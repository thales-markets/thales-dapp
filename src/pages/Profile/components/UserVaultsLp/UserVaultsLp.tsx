import { VAULT_MAP } from 'constants/vault';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'types/ui';
import UserLiquidityPool from './components/UserLiquidityPool';
import UserVault from './components/UserVault';
import ProfileSection from '../ProfileSection/ProfileSection';
import { useTranslation } from 'react-i18next';
import UserVaultsAndLpTransactionsTable from './components/UserVaultsAndLpTransactionsTable';

const UserVaultsLp: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const vaults = useMemo(() => {
        const arr = [];
        for (const key in VAULT_MAP) {
            arr.push({ key, vaultAddress: VAULT_MAP[key].addresses[networkId] });
        }
        return arr;
    }, [networkId]);

    return (
        <>
            <ProfileSection title={t('profile.vaults-lp.lp-title')} maxHeight="100%">
                <UserLiquidityPool />
            </ProfileSection>
            <ProfileSection title={t('profile.vaults-lp.vaults-title')} maxHeight="100%">
                {vaults.map((obj) => {
                    if (obj.vaultAddress)
                        return <UserVault key={obj.key} vaultName={obj.key} vaultAddress={obj.vaultAddress} />;
                })}
            </ProfileSection>
            <ProfileSection title={t('profile.vaults-lp.history-title')} maxHeight="100%">
                <UserVaultsAndLpTransactionsTable />
            </ProfileSection>
        </>
    );
};

export default UserVaultsLp;
