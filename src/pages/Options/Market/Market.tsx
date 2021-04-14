import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ROUTES from 'constants/routes';
import { USD_SIGN } from 'constants/currency';
import { formatCurrency, formatCurrencyWithSign } from 'utils/formatters/number';
import { formatShortDate } from 'utils/formatters/date';
import { MarketProvider } from './contexts/MarketContext';
import { useBOMContractContext } from './contexts/BOMContractContext';
import { Button, Grid, Icon, Label, Loader, Segment, Sidebar } from 'semantic-ui-react';
import { AccountMarketInfo, OptionsMarketInfo } from 'types/options';
import { Link } from 'react-router-dom';
import TransactionsCard from './TransactionsCard';
import MarketInfoModal from './MarketInfoModal';
import ChartCard from './ChartCard';
import MarketSentiment from '../components/MarketSentiment';
import useBinaryOptionsMarketQuery from 'queries/options/useBinaryOptionsMarketQuery';
import TradeOptions from './TradeOptions';
import { getIsAppReady } from 'redux/modules/app';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import './temp.css';
import useBinaryOptionsAccountMarketInfoQuery from 'queries/options/useBinaryOptionsAccountMarketInfoQuery';
import { getIsWalletConnected, getWalletAddress } from 'redux/modules/wallet';
import BiddingPhaseCard from './TradeCard/BiddingPhaseCard';
import TradingPhaseCard from './TradeCard/TradingPhaseCard';
import MaturityPhaseCard from './TradeCard/MaturityPhaseCard';
import OptionSideIcon from './components/OptionSideIcon';
import { Tooltip } from '@material-ui/core';

type MarketProps = {
    marketAddress: string;
};

const Market: React.FC<MarketProps> = ({ marketAddress }) => {
    const { t } = useTranslation();
    const [marketInfoModalVisible, setMarketInfoModalVisible] = useState<boolean>(false);
    const BOMContract = useBOMContractContext();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);

    const marketQuery = useBinaryOptionsMarketQuery(marketAddress, BOMContract, {
        enabled: isAppReady,
    });

    const handleViewMarketDetails = useCallback(() => {
        setMarketInfoModalVisible(true);
    }, []);

    const optionsMarket: OptionsMarketInfo | null = marketQuery.isSuccess && marketQuery.data ? marketQuery.data : null;

    const marketHeading = optionsMarket
        ? `${optionsMarket.asset} > ${formatCurrencyWithSign(USD_SIGN, optionsMarket.strikePrice)} @ ${formatShortDate(
              optionsMarket.maturityDate
          )}`
        : null;

    const accountMarketInfoQuery = useBinaryOptionsAccountMarketInfoQuery(marketAddress, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    const accountMarketInfo = {
        balances: {
            long: 0,
            short: 0,
        },
        claimable: {
            long: 0,
            short: 0,
        },
        bids: {
            long: 0,
            short: 0,
        },
    };

    if (isWalletConnected && accountMarketInfoQuery.isSuccess && accountMarketInfoQuery.data) {
        const { balances, claimable, bids } = accountMarketInfoQuery.data as AccountMarketInfo;

        accountMarketInfo.balances = balances;
        accountMarketInfo.claimable = claimable;
        accountMarketInfo.bids = bids;
    }

    const longAmount = accountMarketInfo.balances.long + accountMarketInfo.claimable.long;
    const shortAmount = accountMarketInfo.balances.short + accountMarketInfo.claimable.short;
    const exerciseAvailable = !!longAmount || !!shortAmount;
    const claimAvailable = !!accountMarketInfo.bids.short || !!accountMarketInfo.bids.long;
    const userActionAvailable =
        optionsMarket &&
        ((optionsMarket.phase === 'trading' && claimAvailable) ||
            (optionsMarket.phase === 'maturity' && exerciseAvailable));

    const optionsAmountLabel = () => (
        <Label onClick={() => setSidebarVisible(!sidebarVisible)} className="button-label">
            <div>
                <OptionSideIcon side="long" />{' '}
                {t(`options.common.amount-long`, {
                    amount: formatCurrency(longAmount),
                })}
            </div>
            <br />
            <div>
                <OptionSideIcon side="short" />{' '}
                {t(`options.common.amount-short`, {
                    amount: formatCurrency(shortAmount),
                })}
            </div>
            {userActionAvailable && <Label circular color="red" empty floating style={{ top: 18 }} />}
        </Label>
    );

    return optionsMarket ? (
        <MarketProvider optionsMarket={optionsMarket}>
            <Sidebar.Pushable as={Segment}>
                <Sidebar animation="slide along" visible={sidebarVisible} width="very wide" direction="right">
                    {optionsMarket.phase === 'trading' && (
                        <TradingPhaseCard optionsMarket={optionsMarket} accountMarketInfo={accountMarketInfo} />
                    )}
                    {optionsMarket.phase === 'maturity' && (
                        <MaturityPhaseCard optionsMarket={optionsMarket} accountMarketInfo={accountMarketInfo} />
                    )}
                </Sidebar>

                <Sidebar.Pusher>
                    <Grid columns={1} style={{ marginLeft: 10, marginRight: 10 }}>
                        <Grid.Column>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <span style={{ textTransform: 'uppercase' }}>
                                        <Link to={ROUTES.Options.Home} className="item">
                                            <Icon name="long arrow alternate left"></Icon>
                                            {t('options.market.heading.all-markets')}
                                        </Link>{' '}
                                        | {marketHeading}
                                        <Button
                                            size="mini"
                                            onClick={handleViewMarketDetails}
                                            style={{ marginLeft: 10, marginRight: 10 }}
                                        >
                                            {t('options.market.heading.market-details')}
                                            {'  '}
                                            <Icon name="info circle"></Icon>
                                        </Button>
                                    </span>
                                    <span style={{ textTransform: 'uppercase' }}>
                                        {t('options.market.heading.market-sentiment')}
                                        <MarketSentiment
                                            long={optionsMarket.longPrice}
                                            short={optionsMarket.shortPrice}
                                            display="col"
                                        />
                                    </span>
                                </div>
                                {(optionsMarket.phase === 'trading' || optionsMarket.phase === 'maturity') && (
                                    <div style={{ marginTop: 10 }}>
                                        {userActionAvailable ? (
                                            <Tooltip
                                                title={
                                                    <span style={{ fontSize: 12 }}>
                                                        {t(
                                                            optionsMarket.phase === 'trading'
                                                                ? 'options.market.heading.options-to-claim-tooltip'
                                                                : 'options.market.heading.options-to-exercise-tooltip'
                                                        )}
                                                    </span>
                                                }
                                                placement="top"
                                                arrow={true}
                                            >
                                                {optionsAmountLabel()}
                                            </Tooltip>
                                        ) : (
                                            optionsAmountLabel()
                                        )}
                                    </div>
                                )}
                            </div>
                            {optionsMarket.phase === 'bidding' && (
                                <BiddingPhaseCard optionsMarket={optionsMarket} accountMarketInfo={accountMarketInfo} />
                            )}
                            {optionsMarket.phase === 'trading' && <TradeOptions />}
                            <ChartCard />
                            <TransactionsCard />
                        </Grid.Column>
                    </Grid>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
            {marketInfoModalVisible && (
                <MarketInfoModal
                    marketHeading={marketHeading}
                    optionMarket={optionsMarket}
                    onClose={() => setMarketInfoModalVisible(false)}
                />
            )}
        </MarketProvider>
    ) : (
        <Loader active />
    );
};

export default Market;
