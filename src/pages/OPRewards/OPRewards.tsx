import React, { useMemo, useState } from 'react';
import {
    BoldText,
    Description,
    SummaryWrapper,
    SummaryInfo,
    Wrapper,
    AddressLink,
    SummaryRow,
    SummaryItem,
    SummaryLabel,
    SummarySubItem,
    MyRewardsContainer,
    MyRewardsTotal,
    MyRewardsList,
    MyRewards,
} from './styled-components';
import SelectInput from 'components/SelectInput';
import Table from 'components/TableV2';
import SearchField from 'components/SearchInput';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { Trans, useTranslation } from 'react-i18next';
import useUsersAmmBuyVolumeQuery from 'queries/user/useUsersAmmBuyVolumeQuery';
import { truncateAddress } from 'utils/formatters/string';
import Tooltip from 'components/TooltipV2';
import TimeRemaining from 'components/TimeRemaining';
import { CRYPTO_CURRENCY_MAP, THALES_CURRENCY, USD_SIGN } from 'constants/currency';
import { formatCurrency, formatCurrencyWithKey, formatCurrencyWithSign } from 'utils/formatters/number';
import { getEtherscanAddressLink } from 'utils/etherscan';
import ElectionsBanner from 'components/ElectionsBanner';
import { Colors } from 'theme/common';
import { isMobile } from 'utils/device';
import { Rewards, emptyRewards } from 'types/rewards';

const THALES_REWARDS = [
    2000, // period 1
    2000, // period 2
    4000, // period 3
    10000, // period 4
    4000, // period 5
    4000, // period 6
    4000, // period 7
    4000, // period 8
    4000, // period 9
    4000, // period 10
    4000, // period 11
    4000, // period 12
    4000, // period 13
    4000, // period 14
    4000, // period 15
    4000, // period 16
    4000, // period 17
    4000, // period 18
    4000, // period 19
    4000, // period 20
];
const OP_REWARDS = [
    2000, // period 1
    2000, // period 2
    4000, // period 3
    10000, // period 4
    4000, // period 5
    4000, // period 6
    4000, // period 7
    4000, // period 8
    4000, // period 9
    4000, // period 10
    4000, // period 11
    4000, // period 12
    4000, // period 13
    4000, // period 14
    4000, // period 15
    4000, // period 16
    4000, // period 17
    4000, // period 18
    4000, // period 19
    4000, // period 20
];

const OPRewards: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [period, setPeriod] = useState<number>(1);
    const [periodRangeTimestamps, setPeriodRangeTimestamps] = useState<any>();

    const PERIOD_DURATION_IN_DAYS = 7;
    const START_DATE = new Date(Date.UTC(2023, 3, 26, 12, 23, 0));
    const NOW = new Date();

    let CALCULATED_START = new Date(START_DATE.getTime());
    let PERIOD_COUNTER = 1;

    const options = useMemo(() => {
        const options: Array<{ value: number; label: string }> = [];
        const periodRangeTimestampsLocal: any = [];
        while (true) {
            if (CALCULATED_START.getTime() < NOW.getTime()) {
                periodRangeTimestampsLocal.push({
                    minTimestamp: CALCULATED_START.getTime() / 1000,
                    maxTimestamp:
                        new Date(CALCULATED_START.getTime() + PERIOD_DURATION_IN_DAYS * 24 * 60 * 60 * 1000).getTime() /
                        1000,
                });
                CALCULATED_START = new Date(CALCULATED_START.getTime() + PERIOD_DURATION_IN_DAYS * 24 * 60 * 60 * 1000);

                options.push({
                    value: PERIOD_COUNTER,
                    label: `Round ${PERIOD_COUNTER}`,
                });

                PERIOD_COUNTER++;
            } else {
                break;
            }
        }

        setPeriodRangeTimestamps(periodRangeTimestampsLocal);
        setPeriod(PERIOD_COUNTER - 1);
        return options;
    }, []);

    const usersAmmBuyVolumeQuery = useUsersAmmBuyVolumeQuery(networkId, period, { enabled: isAppReady });

    const tableData = useMemo(() => {
        if (usersAmmBuyVolumeQuery.data && usersAmmBuyVolumeQuery.isSuccess) {
            let data: Array<Rewards> = usersAmmBuyVolumeQuery.data.rewards.map((reward) => ({
                ...reward,
                account: reward.address,
                sticky: walletAddress.toLowerCase() === reward.address.toLowerCase(),
            }));

            if (searchQuery !== '') {
                data = data.filter((entry) => {
                    return entry.account.toLowerCase().includes(searchQuery.toLowerCase());
                });
            }

            return data;
        }

        return [];
    }, [usersAmmBuyVolumeQuery.data, usersAmmBuyVolumeQuery.isSuccess, searchQuery, walletAddress]);

    const myData = useMemo(() => {
        if (usersAmmBuyVolumeQuery.data && usersAmmBuyVolumeQuery.isSuccess && isWalletConnected) {
            const myData = usersAmmBuyVolumeQuery.data.rewards.find(
                (reward) => walletAddress.toLowerCase() == reward.address.toLowerCase()
            );
            return myData || emptyRewards;
        }

        return emptyRewards;
    }, [usersAmmBuyVolumeQuery.data, usersAmmBuyVolumeQuery.isSuccess, walletAddress, isWalletConnected]);

    const summaryData = useMemo(() => {
        if (usersAmmBuyVolumeQuery.data && usersAmmBuyVolumeQuery.isSuccess) {
            const itmVolume = usersAmmBuyVolumeQuery.data.rewards.reduce((a, { itmInfo }) => a + itmInfo.volume, 0);
            const otmVolume = usersAmmBuyVolumeQuery.data.rewards.reduce((a, { otmInfo }) => a + otmInfo.volume, 0);

            const itmOpRewardsPerVolume = (OP_REWARDS[period - 1] / itmVolume) * 1000;
            const otmOpRewardsPerVolume = (OP_REWARDS[period - 1] / otmVolume) * 1000;

            const itmThalesRewardsPerVolume = (THALES_REWARDS[period - 1] / itmVolume) * 1000;
            const otmThalesRewardsPerVolume = (THALES_REWARDS[period - 1] / otmVolume) * 1000;

            return {
                itmVolume,
                otmVolume,
                itmOpRewardsPerVolume,
                otmOpRewardsPerVolume,
                itmThalesRewardsPerVolume,
                otmThalesRewardsPerVolume,
            };
        }
        return {
            itmVolume: 0,
            otmVolume: 0,
            itmOpRewardsPerVolume: 0,
            otmOpRewardsPerVolume: 0,
            itmThalesRewardsPerVolume: 0,
            otmThalesRewardsPerVolume: 0,
        };
    }, [usersAmmBuyVolumeQuery.data, usersAmmBuyVolumeQuery.isSuccess]);

    const isLoading = usersAmmBuyVolumeQuery.isLoading;

    const getColumns = () => {
        return [
            {
                Header: t('op-rewards.table.wallet-address'),
                accessor: 'account',
                Cell: (cellProps: any) => (
                    <p>
                        <AddressLink
                            href={getEtherscanAddressLink(networkId, cellProps.cell.value)}
                            target="_blank"
                            rel="noreferrer"
                            isHighlighted={walletAddress.toLowerCase() == cellProps.cell.value.toLowerCase()}
                        >
                            {walletAddress.toLowerCase() == cellProps.cell.value.toLowerCase()
                                ? t('op-rewards.table.my-rewards')
                                : truncateAddress(cellProps.cell.value)}
                        </AddressLink>
                    </p>
                ),
            },
            {
                Header: t('op-rewards.table.itm-info'),
                accessor: 'itmInfo',
                Cell: (cellProps: any) => (
                    <p>
                        <Trans
                            i18nKey={'op-rewards.table.reward-text'}
                            values={{
                                thales: Number(cellProps.cell.value.rewards.thales).toFixed(2),
                                op: Number(cellProps.cell.value.rewards.op).toFixed(2),
                            }}
                            components={[<br key="0" />]}
                        />
                        <Tooltip
                            overlay={t('op-rewards.table.info-text', {
                                volume: Number(cellProps.cell.value.volume).toFixed(2),
                                percentage: (Number(cellProps.cell.value.percentage) * 100).toFixed(2),
                            })}
                            iconColor={Colors.WHITE}
                            iconFontSize={12}
                        />
                    </p>
                ),
                sortable: true,
                sortType: itmRewardsSort(),
                sortDescFirst: true,
            },

            {
                Header: t('op-rewards.table.otm-info'),
                accessor: 'otmInfo',
                Cell: (cellProps: any) => (
                    <p>
                        <Trans
                            i18nKey={'op-rewards.table.reward-text'}
                            values={{
                                thales: Number(cellProps.cell.value.rewards.thales).toFixed(2),
                                op: Number(cellProps.cell.value.rewards.op).toFixed(2),
                            }}
                            components={[<br key="0" />]}
                        />
                        <Tooltip
                            overlay={t('op-rewards.table.info-text', {
                                volume: Number(cellProps.cell.value.volume).toFixed(2),
                                percentage: (Number(cellProps.cell.value.percentage) * 100).toFixed(2),
                            })}
                            iconColor={Colors.WHITE}
                            iconFontSize={12}
                        />
                    </p>
                ),
                sortable: true,
                sortType: otmRewardsSort(),
                sortDescFirst: true,
            },
            {
                Header: t('op-rewards.table.total-rewards'),
                accessor: 'totalRewards',
                Cell: (cellProps: any) => (
                    <p>
                        <Trans
                            i18nKey={'op-rewards.table.reward-text'}
                            values={{
                                op: Number(cellProps.cell.value.op).toFixed(2),
                                thales: Number(cellProps.cell.value.thales).toFixed(2),
                            }}
                            components={[<br key="0" />]}
                        />
                    </p>
                ),
                sortable: true,
                sortType: rewardsSort(),
                sortDescFirst: true,
            },
        ];
    };

    const isRoundedEnded =
        periodRangeTimestamps &&
        periodRangeTimestamps[period - 1]?.maxTimestamp &&
        NOW.getTime() > periodRangeTimestamps[period - 1].maxTimestamp * 1000;

    return (
        <Wrapper>
            <ElectionsBanner />
            <Description>
                <p>
                    <Trans i18nKey={'op-rewards.description'} components={{ bold: <BoldText /> }} />
                </p>
                <Trans
                    i18nKey={'op-rewards.description-1'}
                    values={{
                        thales: THALES_REWARDS[period - 1].toLocaleString(),
                        op: OP_REWARDS[period - 1].toLocaleString(),
                    }}
                    components={{
                        bold: <BoldText />,
                        p: <p />,
                        ul: <ul />,
                        li: <li />,
                    }}
                />
                <p>
                    <Trans i18nKey={'op-rewards.description-itm'} components={{ bold: <BoldText /> }} />
                </p>
                <p>
                    <Trans i18nKey={'op-rewards.description-otm'} components={{ bold: <BoldText /> }} />
                </p>
                <p>
                    <Trans i18nKey={'op-rewards.length-info'} components={{ bold: <BoldText /> }} />
                </p>
            </Description>
            <SummaryWrapper>
                <SummaryRow>
                    <SelectInput
                        options={options}
                        handleChange={(value) => setPeriod(Number(value))}
                        defaultValue={period - 1}
                        width={300}
                        height={44}
                        fontSize={18}
                    />
                    {periodRangeTimestamps && periodRangeTimestamps[period - 1]?.maxTimestamp && (
                        <SummaryItem width="33%">
                            <SummaryLabel>
                                {isRoundedEnded
                                    ? t('op-rewards.round-ended-label')
                                    : `${t('op-rewards.round-end-label')}:`}
                            </SummaryLabel>
                            {!isRoundedEnded && (
                                <SummaryInfo>
                                    <TimeRemaining
                                        end={periodRangeTimestamps[period - 1].maxTimestamp * 1000}
                                        fontSize={isMobile() ? 15 : 18}
                                        showFullCounter
                                        zIndex={0}
                                    />
                                </SummaryInfo>
                            )}
                        </SummaryItem>
                    )}
                    <SummaryItem width="66%" mobileDirection="column">
                        <SummarySubItem>
                            <SummaryLabel>{t('op-rewards.itm-volume-label')}:</SummaryLabel>
                            <SummaryInfo>{formatCurrencyWithSign(USD_SIGN, summaryData.itmVolume)}</SummaryInfo>
                        </SummarySubItem>
                        <SummarySubItem>
                            <SummaryLabel>{t('op-rewards.otm-volume-label')}:</SummaryLabel>
                            <SummaryInfo>{formatCurrencyWithSign(USD_SIGN, summaryData.otmVolume)}</SummaryInfo>
                        </SummarySubItem>
                    </SummaryItem>
                </SummaryRow>
                <SummaryRow>
                    {myData && (
                        <SummaryItem mobileDirection="column">
                            <MyRewardsContainer>
                                <SummaryLabel>{t('op-rewards.my-rewards-label')}:</SummaryLabel>
                            </MyRewardsContainer>
                            <MyRewardsContainer>
                                <MyRewardsTotal>
                                    {formatCurrencyWithKey(THALES_CURRENCY, myData.totalRewards.thales)}
                                </MyRewardsTotal>
                                <MyRewardsList>
                                    <MyRewards>{`${formatCurrency(myData.otmInfo.rewards.thales)} (ITM)`}</MyRewards>
                                    <MyRewards>{`${formatCurrency(myData.itmInfo.rewards.thales)} (OTM)`}</MyRewards>
                                </MyRewardsList>
                            </MyRewardsContainer>
                            <MyRewardsContainer>
                                <MyRewardsTotal>
                                    {formatCurrencyWithKey(CRYPTO_CURRENCY_MAP.OP, myData.totalRewards.op)}
                                </MyRewardsTotal>
                                <MyRewardsList>
                                    <MyRewards>{`${formatCurrency(myData.otmInfo.rewards.op)} (ITM)`}</MyRewards>
                                    <MyRewards>{`${formatCurrency(myData.itmInfo.rewards.op)} (OTM)`}</MyRewards>
                                </MyRewardsList>
                            </MyRewardsContainer>
                        </SummaryItem>
                    )}
                    <SearchField
                        text={searchQuery}
                        placeholder={t('op-rewards.search-placeholder')}
                        handleChange={(value) => setSearchQuery(value)}
                        width="320px"
                        height="44px"
                        iconTop="14px"
                    />
                </SummaryRow>
            </SummaryWrapper>
            <Table
                data={tableData}
                columns={getColumns()}
                isLoading={isLoading}
                searchQuery={searchQuery}
                hasStickyRow={true}
                initialState={{
                    sortBy: [
                        {
                            id: 'totalRewards',
                            desc: true,
                        },
                    ],
                }}
            />
        </Wrapper>
    );
};

const rewardsSort = () => (rowA: any, rowB: any) => {
    return rowA.original.totalRewards.op - rowB.original.totalRewards.op;
};

const itmRewardsSort = () => (rowA: any, rowB: any) => {
    return rowA.original.itmInfo.rewards.op - rowB.original.itmInfo.rewards.op;
};

const otmRewardsSort = () => (rowA: any, rowB: any) => {
    return rowA.original.otmInfo.rewards.op - rowB.original.otmInfo.rewards.op;
};

export default OPRewards;
