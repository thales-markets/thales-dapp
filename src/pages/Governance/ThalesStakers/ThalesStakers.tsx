import React, { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { FlexDivRowCentered, FlexDivColumn, FlexDivColumnCentered, Text, Button } from 'theme/common';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import useDebouncedMemo from 'hooks/useDebouncedMemo';
import { DEFAULT_SEARCH_DEBOUNCE_MS } from 'constants/defaults';
import useThalesStakersQuery from 'queries/governance/useThalesStakersQuery';
import { EnsNames, Staker, Stakers } from 'types/governance';
import ThalesStakersTable from './ThalesStakersTable';
import SearchStakers from '../components/SearchStakers';
import snxJSConnector from 'utils/snxJSConnector';

enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

const DEFAULT_ORDER_BY = 2;

const ThalesStakers: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);
    const [orderDirection, setOrderDirection] = useState(OrderDirection.DESC);
    const [addressSearch, setAddressSearch] = useState<string>('');
    const [ensNames, setEnsNames] = useState<EnsNames | undefined>(undefined);

    const stakersQuery = useThalesStakersQuery(networkId, {
        enabled: isAppReady,
    });
    const stakers: Staker[] = stakersQuery.isSuccess && stakersQuery.data ? stakersQuery.data : [];

    useEffect(() => {
        const getEnsNames = async (stakers: Stakers) => {
            const records: EnsNames = {};
            const names = await Promise.all(
                stakers.map((staker: Staker) => (snxJSConnector as any).provider.lookupAddress(staker.id))
            );
            for (let index = 0; index < stakers.length; index++) {
                records[stakers[index].id] = names[index];
            }
            setEnsNames(records);
        };

        getEnsNames(stakers);
    }, [stakers]);

    const filteredStakers = useMemo(() => {
        return stakers.sort((a, b) => {
            switch (orderBy) {
                case 1:
                    return sortByField(a, b, orderDirection, 'id');
                case 2:
                    return sortByField(a, b, orderDirection, 'totalStakedAmount');
                default:
                    return 0;
            }
        });
    }, [stakers, orderBy, orderDirection]);

    const findByEnsName = (address: string) => {
        if (ensNames && ensNames[address]) {
            const ensName = ensNames[address];
            return ensName !== null && ensName.toLowerCase().includes(addressSearch.toLowerCase());
        }
        return false;
    };

    const searchFilteredStakers = useDebouncedMemo(
        () => {
            return addressSearch
                ? filteredStakers.filter((staker: Staker) => {
                      return staker.id.toLowerCase().includes(addressSearch.toLowerCase()) || findByEnsName(staker.id);
                  })
                : filteredStakers;
        },
        [filteredStakers, addressSearch, orderBy, orderDirection],
        DEFAULT_SEARCH_DEBOUNCE_MS
    );

    const resetFilters = () => {
        setAddressSearch('');
    };

    return (
        <FlexDivColumnCentered style={{ paddingTop: '30px' }}>
            <FlexDivRowCentered>
                <Info>
                    {`${t('governance.stakers.number-of-stakers')}: ${stakersQuery.isLoading ? '-' : stakers.length}`}
                </Info>
                <SearchStakers assetSearch={addressSearch} setAssetSearch={setAddressSearch} />
            </FlexDivRowCentered>
            <ThalesStakersTable
                stakers={addressSearch ? searchFilteredStakers : filteredStakers}
                isLoading={stakersQuery.isLoading}
                orderBy={orderBy}
                orderDirection={orderDirection}
                setOrderBy={setOrderBy}
                setOrderDirection={setOrderDirection}
            >
                <NoStakers>
                    <>
                        <Text className="text-l bold pale-grey">{t('governance.stakers.no-stakers-found')}</Text>
                        <Button className="primary" onClick={resetFilters}>
                            {t('governance.stakers.view-all-stakers')}
                        </Button>
                    </>
                </NoStakers>
            </ThalesStakersTable>
        </FlexDivColumnCentered>
    );
};

const sortByField = (a: Staker, b: Staker, direction: OrderDirection, field: keyof Staker) => {
    if (direction === OrderDirection.ASC) {
        return (a[field] as any) > (b[field] as any) ? 1 : -1;
    }
    if (direction === OrderDirection.DESC) {
        return (a[field] as any) > (b[field] as any) ? -1 : 1;
    }

    return 0;
};

const NoStakers = styled(FlexDivColumn)`
    min-height: 300px;
    background: #04045a;
    justify-content: space-evenly;
    align-items: center;
    align-self: center;
    border-radius: 5px;
`;

const Info = styled.div`
    font-weight: bold;
    font-size: 18px;
    line-height: 24px;
    color: #f6f6fe;
    margin-left: 30px;
`;

export default ThalesStakers;
