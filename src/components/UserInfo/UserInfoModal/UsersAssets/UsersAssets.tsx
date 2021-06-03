import Currency from 'components/Currency';
import { USD_SIGN } from 'constants/currency';
import useAssetsBalanceQuery from 'queries/user/useUserAssetsBalanceQuery';
import React, { useMemo } from 'react';
import { FlexDiv, Text, LightTooltip } from 'theme/common';
import { OptionsMarkets } from 'types/options';
import { formatShortDate } from 'utils/formatters/date';
import { navigateToOptionsMarket } from 'utils/routes';
import { MarketRow } from '../UserInfoModal';

type UsersAssetsProps = {
    optionsMarkets: OptionsMarkets;
    walletAddress: string;
};

const UsersAssets: React.FC<UsersAssetsProps> = ({ optionsMarkets, walletAddress }) => {
    const userAssetsQuery = useAssetsBalanceQuery(optionsMarkets, walletAddress);

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
                                }
                            }}
                        >
                            <FlexDiv style={{ flex: 2, justifyContent: 'flex-start' }}>
                                <Currency.Name
                                    currencyKey={asset.market.currencyKey}
                                    showIcon={true}
                                    iconProps={{ width: '32px', height: '32px', type: 'asset' }}
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
                                    {asset.balances.long}
                                </Text>
                            </LightTooltip>
                            <LightTooltip title="Amount of short options">
                                <Text style={{ flex: 1, textAlign: 'center', color: 'rgb(255, 122, 104)' }}>
                                    {asset.balances.short}
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
