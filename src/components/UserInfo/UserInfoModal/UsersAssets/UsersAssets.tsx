import Currency from 'components/Currency';
import { USD_SIGN } from 'constants/currency';
import useAssetsBalanceQuery from 'queries/user/useUserAssetsBalanceQuery';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { FlexDiv, Text, LightTooltip, Image } from 'theme/common';
import { OptionsMarkets } from 'types/options';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrency, formatCurrencyWithSign } from 'utils/formatters/number';
import { navigateToOptionsMarket } from 'utils/routes';
import { MarketRow } from '../UserInfoModal';
import exerciseOptionIcon from '../../../../assets/images/exercise-option.svg';

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
                    const hasFundsToExercise =
                        asset.market.phase === 'maturity' &&
                        asset.market.result &&
                        !!asset.balances[asset.market.result];
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
                            <LightTooltip placement="top" arrow={true} title="Strike price">
                                <Text style={{ margin: '0 8px', flex: 1, textAlign: 'center' }}>
                                    {formatCurrencyWithSign(USD_SIGN, asset.market.strikePrice)}
                                </Text>
                            </LightTooltip>
                            <LightTooltip placement="top" arrow={true} title="Maturity date">
                                <Text style={{ flex: 2, textAlign: 'center' }}>
                                    {formatShortDate(asset.market.maturityDate)}
                                </Text>
                            </LightTooltip>
                            <LightTooltip placement="top" arrow={true} title="Amount of long options">
                                <Text style={{ flex: 1, textAlign: 'center', color: 'rgb(61, 186, 162)' }}>
                                    {formatCurrency(asset.balances.long)}
                                </Text>
                            </LightTooltip>
                            <LightTooltip placement="top" arrow={true} title="Amount of short options">
                                <Text style={{ flex: 1, textAlign: 'center', color: 'rgb(255, 122, 104)' }}>
                                    {formatCurrency(asset.balances.short)}
                                </Text>
                            </LightTooltip>
                            <LightTooltip placement="top" arrow={true} title="Has options to exercise">
                                <FlexDiv style={{ width: 15, height: 15 }}>
                                    {hasFundsToExercise && (
                                        <Image src={exerciseOptionIcon} style={{ width: 15, height: 15 }} />
                                    )}
                                </FlexDiv>
                            </LightTooltip>
                        </MarketRow>
                    );
                }
            })}
        </>
    );
};

export default UsersAssets;
