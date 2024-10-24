import SPAAnchor from 'components/SPAAnchor/SPAAnchor';
import useLiquidityPoolDataQuery from 'queries/liquidityPool/useLiquidityPoolDataQuery';
import useLiquidityPoolUserDataQuery from 'queries/liquidityPool/useLiquidityPoolUserDataQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsMobile } from 'redux/modules/ui';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { LiquidityPool, LiquidityPoolData, UserLiquidityPoolData } from 'types/liquidityPool';
import { RootState } from 'types/ui';
import { buildHref } from 'utils/routes';
import { SYNTHS_MAP } from '../../../../../../constants/currency';
import ROUTES from '../../../../../../constants/routes';
import VaultLpDetails from '../VaultLpDetails';

type UserLiquidityPoolProps = {
    lp: LiquidityPool;
};

const UserLiquidityPool: React.FC<UserLiquidityPoolProps> = ({ lp }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));
    const [lastValidLiquidityPoolData, setLastValidLiquidityPoolData] = useState<LiquidityPoolData | undefined>(
        undefined
    );
    const [lastValidUserLiquidityPoolData, setLastValidUserLiquidityPoolData] = useState<
        UserLiquidityPoolData | undefined
    >(undefined);

    const liquidityPoolDataQuery = useLiquidityPoolDataQuery(lp.address, lp.collateral, networkId, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (liquidityPoolDataQuery.isSuccess && liquidityPoolDataQuery.data) {
            setLastValidLiquidityPoolData(liquidityPoolDataQuery.data);
        }
    }, [liquidityPoolDataQuery.isSuccess, liquidityPoolDataQuery.data]);

    const liquidityPoolData: LiquidityPoolData | undefined = useMemo(() => {
        if (liquidityPoolDataQuery.isSuccess && liquidityPoolDataQuery.data) {
            return liquidityPoolDataQuery.data;
        }
        return lastValidLiquidityPoolData;
    }, [liquidityPoolDataQuery.isSuccess, liquidityPoolDataQuery.data, lastValidLiquidityPoolData]);

    const userLiquidityPoolDataQuery = useLiquidityPoolUserDataQuery(
        lp.address,
        lp.collateral,
        walletAddress,
        networkId,
        {
            enabled: isAppReady && isWalletConnected,
        }
    );

    useEffect(() => {
        if (userLiquidityPoolDataQuery.isSuccess && userLiquidityPoolDataQuery.data) {
            setLastValidUserLiquidityPoolData(userLiquidityPoolDataQuery.data);
        }
    }, [userLiquidityPoolDataQuery.isSuccess, userLiquidityPoolDataQuery.data]);

    const userLiquidityPoolData: UserLiquidityPoolData | undefined = useMemo(() => {
        if (userLiquidityPoolDataQuery.isSuccess && userLiquidityPoolDataQuery.data) {
            return userLiquidityPoolDataQuery.data;
        }
        return lastValidUserLiquidityPoolData;
    }, [userLiquidityPoolDataQuery.isSuccess, userLiquidityPoolDataQuery.data, lastValidUserLiquidityPoolData]);

    return isMobile ? (
        <SPAAnchor href={`${buildHref(ROUTES.Options.LiquidityPool)}?collateral=${lp.collateral.toLowerCase()}`}>
            <VaultLpDetails
                icon={'liquidity-pool'}
                title={t(`profile.vaults-lp.thales-lp-title`, { collateral: lp.collateral })}
                position={userLiquidityPoolData?.balanceTotal || 0}
                pnl={liquidityPoolData?.lifetimePnl || 0}
                round={liquidityPoolData?.round || 0}
                roundEndTime={liquidityPoolData?.roundEndTime || 0}
                isRoundEnded={!!liquidityPoolData?.isRoundEnded}
                link={`${buildHref(ROUTES.Options.LiquidityPool)}?collateral=${lp.collateral.toLowerCase()}`}
                isLoading={liquidityPoolDataQuery.isLoading || userLiquidityPoolDataQuery.isLoading}
                isDeprecated={lp.collateral === SYNTHS_MAP.sUSD}
            />
        </SPAAnchor>
    ) : (
        <VaultLpDetails
            icon={'liquidity-pool'}
            title={t(`profile.vaults-lp.thales-lp-title`, { collateral: lp.collateral })}
            position={userLiquidityPoolData?.balanceTotal || 0}
            pnl={liquidityPoolData?.lifetimePnl || 0}
            round={liquidityPoolData?.round || 0}
            roundEndTime={liquidityPoolData?.roundEndTime || 0}
            isRoundEnded={!!liquidityPoolData?.isRoundEnded}
            link={`${buildHref(ROUTES.Options.LiquidityPool)}?collateral=${lp.collateral.toLowerCase()}`}
            isLoading={liquidityPoolDataQuery.isLoading || userLiquidityPoolDataQuery.isLoading}
            isDeprecated={lp.collateral === SYNTHS_MAP.sUSD}
        />
    );
};

export default UserLiquidityPool;
