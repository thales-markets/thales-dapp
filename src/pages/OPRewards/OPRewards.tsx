import React, { useMemo, useState } from 'react';

import { HeaderWrapper, Wrapper } from './styled-components';
import SelectInput from 'components/SelectInput';
import Table from 'components/TableV2';

import useOPProtocolRewardQuery from 'queries/token/useOPProtocolRewardQuery';

import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import Loader from 'components/Loader';
import { useTranslation } from 'react-i18next';

const OPRewards: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const { t } = useTranslation();

    const [period, setPeriod] = useState<number>(0);
    const PERIOD_DURATION_IN_DAYS = 1;
    const START_DATE = new Date(2022, 6, 14, 20, 0, 0);
    const NOW = new Date();

    let CALCULATED_START = new Date(START_DATE.getTime());
    let PERIOD_COUNTER = 0;

    const options = [];
    const periodRangeTimestamps = [];

    while (true) {
        if (CALCULATED_START.getTime() < NOW.getTime()) {
            periodRangeTimestamps.push({
                minTimestamp: CALCULATED_START.getTime() / 1000,
                maxTimestamp:
                    new Date(CALCULATED_START.getTime() + PERIOD_DURATION_IN_DAYS * 24 * 60 * 60 * 1000).getTime() /
                    1000,
            });
            CALCULATED_START = new Date(CALCULATED_START.getTime() + PERIOD_DURATION_IN_DAYS * 24 * 60 * 60 * 1000);
            options.push({
                value: PERIOD_COUNTER,
                label: `${PERIOD_COUNTER} period`,
            });
            PERIOD_COUNTER++;
        } else {
            break;
        }
    }

    const minTimestamp = periodRangeTimestamps[period]?.minTimestamp || undefined;
    const maxTimestamp = periodRangeTimestamps[period]?.maxTimestamp || undefined;

    const opProtocolRewardsQuery = useOPProtocolRewardQuery(networkId, minTimestamp, maxTimestamp, {
        enabled: isAppReady,
    });

    const tableData = useMemo(() => {
        if (opProtocolRewardsQuery?.data && opProtocolRewardsQuery?.isSuccess) {
            const transactions = opProtocolRewardsQuery?.data;

            const uniqueWalletAddresses = transactions
                .map((item) => item.account)
                .filter((value, index, self) => self.indexOf(value) === index);

            console.log('uniqueWalletAddresses ', uniqueWalletAddresses);

            const data: Array<{ account: string; calculatedProtocolBonusForPeriod: string }> = [];

            uniqueWalletAddresses.forEach((walletAddress) => {
                let sumOfRewards = 0;
                transactions.forEach((tx) => {
                    if (tx?.account == walletAddress) {
                        sumOfRewards += tx.protocolRewards;
                    }
                });
                data.push({
                    account: walletAddress,
                    calculatedProtocolBonusForPeriod: sumOfRewards.toFixed(2),
                });
            });

            return data;
        }

        return [];
    }, [minTimestamp, maxTimestamp, period, opProtocolRewardsQuery?.data]);

    const isLoading = opProtocolRewardsQuery.isLoading;
    console.log('opProtocolRewardsQuery.data ', opProtocolRewardsQuery?.data);
    console.log('isLoading ', isLoading);

    return (
        <Wrapper>
            <HeaderWrapper>
                <SelectInput
                    options={options}
                    handleChange={(value) => setPeriod(Number(value))}
                    defaultValue={0}
                    width={300}
                />
            </HeaderWrapper>
            {isLoading ? (
                <Loader />
            ) : (
                <Table
                    data={tableData}
                    columns={[
                        {
                            Header: t('op-rewards.table.wallet-address'),
                            accessor: 'account',
                        },
                        {
                            Header: t('op-rewards.table.protocol-reward'),
                            accessor: 'calculatedProtocolBonusForPeriod',
                        },
                    ]}
                />
            )}
        </Wrapper>
    );
};

export default OPRewards;
