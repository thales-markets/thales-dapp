import useUserVaultDataQuery from 'queries/vault/useUserVaultDataQuery';
import useVaultDataQuery from 'queries/vault/useVaultDataQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { UserVaultData, VaultData } from 'types/vault';
import { buildVaultLink } from 'utils/routes';
import VaultLpDetails from '../VaultLpDetails/VaultLpDetails';

const UserVault: React.FC<{ vaultName: string; vaultAddress: string }> = ({ vaultName, vaultAddress }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [lastValidVaultData, setLastValidVaultData] = useState<VaultData | undefined>(undefined);
    const [lastValidUserVaultData, setLastValidUserVaultData] = useState<UserVaultData | undefined>(undefined);

    const vaultDataQuery = useVaultDataQuery(vaultAddress, networkId, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (vaultDataQuery.isSuccess && vaultDataQuery.data) {
            setLastValidVaultData(vaultDataQuery.data);
        }
    }, [vaultDataQuery.isSuccess, vaultDataQuery.data]);

    const vaultData: VaultData | undefined = useMemo(() => {
        if (vaultDataQuery.isSuccess && vaultDataQuery.data) {
            return vaultDataQuery.data;
        }
        return lastValidVaultData;
    }, [vaultDataQuery.isSuccess, vaultDataQuery.data, lastValidVaultData]);

    const userVaultDataQuery = useUserVaultDataQuery(vaultAddress, walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && !!vaultAddress,
    });

    useEffect(() => {
        if (userVaultDataQuery.isSuccess && userVaultDataQuery.data) {
            setLastValidUserVaultData(userVaultDataQuery.data);
        }
    }, [userVaultDataQuery.isSuccess, userVaultDataQuery.data]);

    const userVaultData: UserVaultData | undefined = useMemo(() => {
        if (userVaultDataQuery.isSuccess && userVaultDataQuery.data) {
            return userVaultDataQuery.data;
        }
        return lastValidUserVaultData;
    }, [userVaultDataQuery.isSuccess, userVaultDataQuery.data, lastValidUserVaultData]);

    return (
        <VaultLpDetails
            icon={vaultName}
            title={t(`vault.${vaultName}.title`)}
            position={userVaultData?.balanceTotal || 0}
            pnl={vaultData?.lifetimePnl || 0}
            round={vaultData?.round || 0}
            roundEndTime={vaultData?.roundEndTime || 0}
            isRoundEnded={!!vaultData?.isRoundEnded}
            link={buildVaultLink(vaultName)}
            isLoading={vaultDataQuery.isLoading || userVaultDataQuery.isLoading}
        />
    );
};

export default UserVault;
