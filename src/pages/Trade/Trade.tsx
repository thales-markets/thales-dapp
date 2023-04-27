import { POSITIONS } from 'constants/options';
import Trading from './components/Trading/Trading';
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
    return (
        <>
            <Trading
                currencyKey={_currencyKey}
                maturityDate={new Date(new Date().setDate(new Date().getDate() + 10))}
                positionType={_positionType}
                strikePrice={20900}
                marketAddress="0x7eed10dfc2c636fd6e8100c38769813ed3771cbe"
            />
        </>
    );
};

export default TradePage;
