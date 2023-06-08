import { VAULT_MAP } from 'constants/vault';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered } from 'styles/common';
import UserVaultAndLpTransactionsTable from './components/TransactionsTable/UserVaultAndLpTransactionsTable';
import UserLiquidityPool from './components/UserLiquidityPool';
import UserVault from './components/UserVault';
import ProfileSection from '../ProfileSection/ProfileSection';

const UserVaults: React.FC = () => {
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
            <ProfileSection title={'Vaults'} fullHeight>
                {vaults.map((obj) => {
                    if (obj.vaultAddress)
                        return <UserVault key={obj.key} vaultName={obj.key} vaultAddress={obj.vaultAddress} />;
                })}
            </ProfileSection>
            <ProfileSection title={'Liquidity Pool'} fullHeight>
                <UserLiquidityPool />
            </ProfileSection>
            <ProfileSection title={'Vaults'}>
                <UserVaultAndLpTransactionsTable />
            </ProfileSection>
        </>
    );
};

export default UserVaults;
