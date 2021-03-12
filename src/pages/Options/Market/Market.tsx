import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import snxJSConnector from 'utils/snxJSConnector';
import ROUTES from 'constants/routes';
import { USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSign, formatShortDate, bigNumberFormatter, parseBytes32String } from 'utils/formatters';
import QUERY_KEYS from 'constants/queryKeys';
import { MarketProvider } from './contexts/MarketContext';
import { useBOMContractContext } from './contexts/BOMContractContext';
import { Button, Grid, Icon, Loader } from 'semantic-ui-react';
import { RootState } from 'redux/rootReducer';
import { getAvailableSynthsMap } from 'redux/modules/synths';
import { OptionsMarketInfo } from 'types/options';
import { getPhaseAndEndDate } from 'utils/options';
import { SIDE } from 'constants/options';
import { Link } from 'react-router-dom';
import MarketSentiment from '../components/MarketSentiment';
import ChartCard from './components/ChartCard';
import TransactionsCard from './components/TransactionsCard';
import MarketInfoModal from './components/MarketInfoModal';
import TradeCard from './components/TradeCard';

type MarketProps = {
    marketAddress: string;
};

const Market: React.FC<MarketProps> = ({ marketAddress }) => {
    const { t } = useTranslation();
    const synthsMap = useSelector((state: RootState) => getAvailableSynthsMap(state));
    const [marketInfoModalVisible, setMarketInfoModalVisible] = useState<boolean>(false);
    const BOMContract = useBOMContractContext();

    const marketQuery = useQuery<OptionsMarketInfo, any>(QUERY_KEYS.BinaryOptions.Market(marketAddress), async () => {
        let withdrawalsEnabled = true;
        try {
            withdrawalsEnabled = await BOMContract.refundsEnabled();
        } catch (e) {}
        const [marketData, marketParameters] = await Promise.all([
            (snxJSConnector as any).binaryOptionsMarketDataContract.getMarketData(marketAddress),
            (snxJSConnector as any).binaryOptionsMarketDataContract.getMarketParameters(marketAddress),
        ]);

        const { times, oracleDetails, creator, options, fees, creatorLimits } = marketParameters;
        const {
            totalBids,
            totalClaimableSupplies,
            totalSupplies,
            deposits,
            prices,
            oraclePriceAndTimestamp,
            resolution,
        } = marketData;

        const biddingEndDate = Number(times.biddingEnd) * 1000;
        const maturityDate = Number(times.maturity) * 1000;
        const expiryDate = Number(times.expiry) * 1000;

        const { phase, timeRemaining } = getPhaseAndEndDate(biddingEndDate, maturityDate, expiryDate);

        const currencyKey = parseBytes32String(oracleDetails.key);

        return {
            isResolved: resolution.resolved,
            address: marketAddress,
            currencyKey,
            priceUpdatedAt: Number(oraclePriceAndTimestamp.updatedAt) * 1000,
            currentPrice: bigNumberFormatter(oraclePriceAndTimestamp.price),
            finalPrice: bigNumberFormatter(oracleDetails.finalPrice),
            asset: synthsMap[currencyKey]?.asset || currencyKey,
            strikePrice: bigNumberFormatter(oracleDetails.strikePrice),
            biddingEndDate,
            maturityDate,
            expiryDate,
            longPrice: bigNumberFormatter(prices.long),
            shortPrice: bigNumberFormatter(prices.short),
            result: SIDE[marketData.result],
            totalBids: {
                long: bigNumberFormatter(totalBids.long),
                short: bigNumberFormatter(totalBids.short),
            },
            totalClaimableSupplies: {
                long: bigNumberFormatter(totalClaimableSupplies.long),
                short: bigNumberFormatter(totalClaimableSupplies.short),
            },
            totalSupplies: {
                long: bigNumberFormatter(totalSupplies.long),
                short: bigNumberFormatter(totalSupplies.short),
            },
            deposits: {
                deposited: bigNumberFormatter(deposits.deposited),
                exercisableDeposits: bigNumberFormatter(deposits.exercisableDeposits),
            },
            phase,
            timeRemaining,
            creator,
            options: {
                long: bigNumberFormatter(options.long),
                short: bigNumberFormatter(options.short),
            },
            fees: {
                creatorFee: bigNumberFormatter(fees.creatorFee),
                poolFee: bigNumberFormatter(fees.poolFee),
                refundFee: bigNumberFormatter(fees.refundFee),
            },
            creatorLimits: {
                capitalRequirement: bigNumberFormatter(creatorLimits.capitalRequirement),
                skewLimit: bigNumberFormatter(creatorLimits.skewLimit),
            },
            BN: {
                totalLongBN: totalBids.long,
                totalShortBN: totalBids.short,
                depositedBN: deposits.deposited,
                feeBN: fees.creatorFee.add(fees.poolFee),
                refundFeeBN: fees.refundFee,
            },
            withdrawalsEnabled,
        } as OptionsMarketInfo;
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

    return optionsMarket ? (
        <MarketProvider optionsMarket={optionsMarket}>
            <Grid>
                <Grid.Column width={11}>
                    <Grid.Row>
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
                    </Grid.Row>
                    <ChartCard />
                    <TransactionsCard />
                </Grid.Column>
                <Grid.Column width={5} style={{ paddingRight: 40 }}>
                    <TradeCard />
                </Grid.Column>
            </Grid>
            {/* <StyledCenteredPageLayout>
                <LeftCol>
                    <Heading>
                        <HeadingItem>
                            <AllMarketsLink to={ROUTES.Options.Home}>
                                <ArrowBackIcon />
                                {t('options.market.heading.all-markets')}
                            </AllMarketsLink>
                            |<HeadingTitle>{marketHeading}</HeadingTitle>
                        </HeadingItem>
                        <HeadingItem>
                            <MarketDetailsTextButton onClick={handleViewMarketDetails}>
                                {t('options.market.heading.market-details')} <InfoRoundedIcon />
                            </MarketDetailsTextButton>
                        </HeadingItem>
                        <StyledHeadingItem>
                            <HeadingTitle>{t('options.market.heading.market-sentiment')}</HeadingTitle>
                            <StyledMarketSentiment
                                short={optionsMarket.shortPrice}
                                long={optionsMarket.longPrice}
                                display="col"
                            />
                        </StyledHeadingItem>
                    </Heading>
                    <ChartCard />
                    <TransactionsCard />
                </LeftCol>
                <RightCol>
                    <Phases>
                        {PHASES_CARDS.map((phase, idx: number) => (
                            <PhaseItem key={phase} isActive={phase === optionsMarket!.phase} itemIndex={idx}>
                                {t(`options.phases.${phase}`)}
                            </PhaseItem>
                        ))}
                    </Phases>
                    <TradeCard />
                </RightCol>
            </StyledCenteredPageLayout> */}
            {marketInfoModalVisible && (
                <MarketInfoModal
                    // marketHeading={marketHeading}
                    // optionMarket={optionsMarket}
                    onClose={() => setMarketInfoModalVisible(false)}
                />
            )}
        </MarketProvider>
    ) : (
        <Loader active />
    );
};

export default Market;
