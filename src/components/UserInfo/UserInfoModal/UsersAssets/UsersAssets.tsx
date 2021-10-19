import Currency from 'components/Currency';
import { USD_SIGN } from 'constants/currency';
import { countryToCountryCode, eventToIcon } from 'pages/Options/Home/MarketsTable/MarketsTable';
import useAssetsBalanceQuery from 'queries/user/useUserAssetsBalanceQuery';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { FlexDiv, Image, Text } from 'theme/common';
import { OptionsMarkets } from 'types/options';
import { formatShortDate } from 'utils/formatters/date';
import { formatCurrency, formatCurrencyWithSign } from 'utils/formatters/number';
import { navigateToOptionsMarket } from 'utils/routes';
import { MarketRow, Row } from '../UserInfoModal';
import ReactCountryFlag from 'react-country-flag';
import { LightTooltip } from '../../../../pages/Options/Market/components';
import exerciseOptionIcon from '../../../../assets/images/exercise-option.svg';
import { useTranslation } from 'react-i18next';

type UsersAssetsProps = {
    optionsMarkets: OptionsMarkets;
    walletAddress: string;
    onClose: () => void;
};

const UsersAssets: React.FC<UsersAssetsProps> = ({ optionsMarkets, walletAddress, onClose }) => {
    const { t } = useTranslation();
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
            <Row>
                <Text className="bold" style={{ flex: 2 }}>
                    {t(`user-info.table.asset-col`)}
                </Text>
                <Text className="bold" style={{ flex: 2, textAlign: 'center', paddingLeft: 14 }}>
                    {t(`user-info.table.strike-price-col`)}
                </Text>
                <Text className="bold" style={{ flex: 2, paddingLeft: 20 }}>
                    {t(`user-info.table.maturity-date-col`)}
                </Text>
                <Text className="bold" style={{ flex: 1, textAlign: 'center', paddingRight: 18 }}>
                    {t(`user-info.table.long-col`)}
                </Text>
                <Text className="bold" style={{ flex: 1 }}>
                    {t(`user-info.table.short-col`)}
                </Text>
            </Row>
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
                            <FlexDiv style={{ flex: 2, justifyContent: 'flex-start', alignItems: 'center' }}>
                                {asset.market.customMarket ? (
                                    <>
                                        <ReactCountryFlag
                                            countryCode={countryToCountryCode(asset.market.country as any)}
                                            style={{ width: 24, height: 24, marginRight: 10 }}
                                            svg
                                        />
                                        {asset.market.country}
                                    </>
                                ) : (
                                    <Currency.Name
                                        currencyKey={asset.market.currencyKey}
                                        showIcon={true}
                                        synthIconStyle={{ width: 24, height: 24 }}
                                        iconProps={{ type: 'asset' }}
                                    />
                                )}
                            </FlexDiv>

                            <Text style={{ margin: '0 8px', flex: 1, textAlign: 'center' }}>
                                {asset.market.customMarket ? (
                                    <Image
                                        style={{ width: 32, height: 32 }}
                                        src={eventToIcon(asset.market.eventName as any)}
                                    ></Image>
                                ) : (
                                    formatCurrencyWithSign(USD_SIGN, asset.market.strikePrice)
                                )}
                            </Text>

                            <Text style={{ flex: 2, textAlign: 'center' }}>
                                {formatShortDate(asset.market.maturityDate)}
                            </Text>

                            <Text style={{ flex: 1, textAlign: 'center', color: 'rgb(61, 186, 162)' }}>
                                {formatCurrency(asset.balances.long)}
                            </Text>

                            <Text style={{ flex: 1, textAlign: 'center', color: 'rgb(255, 122, 104)' }}>
                                {formatCurrency(asset.balances.short)}
                            </Text>

                            <LightTooltip disableHoverListener={!hasFundsToExercise} title="Has options to exercise">
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
