import Currency from 'components/Currency';
import { USD_SIGN } from 'constants/currency';
import useAssetsBalanceQuery from 'queries/user/useUserAssetsBalanceQuery';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { FlexDiv, Text, LightTooltip } from 'theme/common';
import { OptionsMarkets } from 'types/options';
import { formatShortDate } from 'utils/formatters/date';
import { navigateToOptionsMarket } from 'utils/routes';
import { MarketRow } from '../UserInfoModal';

type UsersAssetsProps = {
    optionsMarkets: OptionsMarkets;
    walletAddress: string;
    onClose: () => void;
};

const UsersAssets: React.FC<UsersAssetsProps> = ({ optionsMarkets, walletAddress, onClose }) => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const userAssetsQuery = useAssetsBalanceQuery(networkId, optionsMarkets, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    const assets = useMemo(
        () => (userAssetsQuery.isSuccess && Array.isArray(userAssetsQuery.data) ? userAssetsQuery.data : []),
        [userAssetsQuery]
    );

    return (
        <>
            {assets.map((asset, index) => {
                if (asset.balances.long || asset.balances.short) {
                    return (
                        <MarketRow
                            className="text-xs"
                            key={index}
                            onClick={() => {
                                if (asset.market.phase !== 'expiry') {
                                    navigateToOptionsMarket(asset.market.address);
                                    onClose();
                                }
                            }}
                        >
                            <FlexDiv style={{ flex: 2, justifyContent: 'flex-start' }}>
                                <Currency.Name
                                    currencyKey={asset.market.currencyKey}
                                    showIcon={true}
                                    synthIconStyle={{ width: 24, height: 24 }}
                                    iconProps={{ type: 'asset' }}
                                />
                            </FlexDiv>
                            <LightTooltip title="Strike price">
                                <Text style={{ margin: '0 8px', flex: 1, textAlign: 'center' }}>
                                    {USD_SIGN + asset.market.strikePrice.toFixed(2)}
                                </Text>
                            </LightTooltip>
                            <LightTooltip title="Maturity date">
                                <Text style={{ flex: 2, textAlign: 'center' }}>
                                    {formatShortDate(asset.market.maturityDate)}
                                </Text>
                            </LightTooltip>
                            <LightTooltip title="Amount of long options">
                                <Text style={{ flex: 1, textAlign: 'center', color: 'rgb(61, 186, 162)' }}>
                                    {asset.balances.long.toFixed(2)}
                                </Text>
                            </LightTooltip>
                            <LightTooltip title="Amount of short options">
                                <Text style={{ flex: 1, textAlign: 'center', color: 'rgb(255, 122, 104)' }}>
                                    {asset.balances.short.toFixed(2)}
                                </Text>
                            </LightTooltip>
                        </MarketRow>
                    );
                }
            })}
        </>
    );
};

export default UsersAssets;
