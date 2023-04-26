import { POSITIONS } from 'constants/options';
import useAvailableAssetsQuery from 'queries/options/useAvailableAssetsQuery';
import useMaturityDatesByAssetQueryQuery from 'queries/options/useMaturityDatesByAssetQuery';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';

const TradePage: React.FC = () => {
    // selectors
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    // states
    const [_currencyKey, _setCurrencyKey] = useState('ETH');
    const [_maturityDate, _setMaturityDate] = useState<Date | undefined>();
    const [_positionType, _setPositionType] = useState(POSITIONS.UP);

    // queries
    const assetsQuery = useAvailableAssetsQuery({
        enabled: isAppReady,
        refetchInterval: false,
    });

    const maturityQuery = useMaturityDatesByAssetQueryQuery(_currencyKey);

    // hooks
    const allAssets = useMemo(() => {
        if (assetsQuery.isSuccess) return assetsQuery.data;
        return [];
    }, [assetsQuery, networkId, maturityQuery]);

    console.log(allAssets);
    return <></>;
};

export default TradePage;
