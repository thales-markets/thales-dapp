import Currency from 'components/Currency';
import { USD_SIGN } from 'constants/currency';
import useAssetsBalanceQuery from 'queries/user/useUserAssetsBalanceQuery';
import React, { useMemo } from 'react';
import { FlexDiv, Text } from 'theme/common';
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

                            <Text style={{ margin: '0 8px', flex: 2, textAlign: 'center' }}>
                                {asset.market.strikePrice.toFixed(2) + USD_SIGN}
                            </Text>
                            <Text style={{ flex: 2, textAlign: 'right' }}>
                                {' '}
                                by {formatShortDate(asset.market.maturityDate)}
                            </Text>
                            <Text
                                className="text-s"
                                style={{ flex: 1, textAlign: 'right', color: 'rgb(61, 186, 162)' }}
                            >
                                {asset.balances.long}
                            </Text>
                            <Text
                                className="text-s"
                                style={{ flex: 1, textAlign: 'right', color: 'rgb(255, 122, 104)' }}
                            >
                                {asset.balances.short}
                            </Text>
                        </MarketRow>
                    );
                }
            })}
        </>
    );
};

export default UsersAssets;
