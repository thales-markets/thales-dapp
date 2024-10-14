import { VAULT_MAP } from 'constants/vault';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { LiquidityPool } from '../../../../types/liquidityPool';
import { getLiquidityPools } from '../../../../utils/liquidityPool';
import ProfileSection from '../ProfileSection/ProfileSection';
import UserLiquidityPool from './components/UserLiquidityPool';
import UserVault from './components/UserVault';
import UserVaultsAndLpTransactionsTable from './components/UserVaultsAndLpTransactionsTable';

const UserVaultsLp: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector(getNetworkId);
    const liquidityPools = getLiquidityPools(networkId);

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
                {liquidityPools.map((item: LiquidityPool) => (
                    <UserLiquidityPool key={item.address} lp={item} />
                ))}
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
