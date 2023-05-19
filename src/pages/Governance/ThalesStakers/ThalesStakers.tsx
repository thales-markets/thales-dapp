import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { FlexDivRowCentered, FlexDivColumn, FlexDivColumnCentered, FlexDiv } from 'theme/common';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import useDebouncedMemo from 'hooks/useDebouncedMemo';
import { DEFAULT_SEARCH_DEBOUNCE_MS } from 'constants/defaults';
import useThalesStakersQuery from 'queries/governance/useThalesStakersQuery';
import { EnsNames, Staker, Stakers } from 'types/governance';
import SearchStakers from '../components/SearchStakers';
import snxJSConnector from 'utils/snxJSConnector';
import { Network } from 'utils/network';
import { ArrowIconMedium, Blockie, StyledLink } from '../components';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { LightMediumTooltip } from 'components/OldVersion/old-components';
import { PaginationWrapper } from 'components/OldVersion/styled-components';
import Pagination from '../components/Pagination/Pagination';
import Table from 'components/Table/Table';
import { THALES_CURRENCY } from 'constants/currency';
import { truncateAddress } from 'utils/formatters/string';
import { CellProps } from 'react-table';
import makeBlockie from 'ethereum-blockies-base64';
import { getEtherscanAddressLink } from 'utils/etherscan';

const ThalesStakers: React.FC = () => {
    const { t } = useTranslation();
    const [isMobile, setIsMobile] = useState(false);
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [addressSearch, setAddressSearch] = useState<string>('');
    const [ensNames, setEnsNames] = useState<EnsNames | undefined>(undefined);

    const stakersQuery = useThalesStakersQuery({
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

        if (networkId === Network.Mainnet) {
            getEnsNames(stakers);
        }
    }, [stakers]);

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
                ? stakers.filter((staker: Staker) => {
                      return staker.id.toLowerCase().includes(addressSearch.toLowerCase()) || findByEnsName(staker.id);
                  })
                : stakers;
        },
        [stakers, addressSearch],
        DEFAULT_SEARCH_DEBOUNCE_MS
    );

    const [page, setPage] = useState(0);
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const [rowsPerPage, setRowsPerPage] = useState(20);
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(Number(event.target.value));
        setPage(0);
    };

    const numberOfPages = Math.ceil(searchFilteredStakers.length / rowsPerPage) || 1;
    const memoizedPage = useMemo(() => {
        if (page > numberOfPages - 1) {
            return numberOfPages - 1;
        }
        return page;
    }, [page, numberOfPages]);

    const handleResize = () => {
        if (window.innerWidth <= 767) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => setPage(0), [addressSearch]);

    return (
        <Container>
            <HeaderContainer>
                <Info>
                    {`${t('governance.stakers.number-of-stakers')}: ${stakersQuery.isLoading ? '-' : stakers.length}`}
                </Info>
                <SearchStakers assetSearch={addressSearch} setAssetSearch={setAddressSearch} />
            </HeaderContainer>
            <TabelContainer>
                <Table
                    columns={[
                        {
                            Header: <>{t('governance.stakers.staker-col')}</>,
                            accessor: 'id',
                            Cell: (cellProps: CellProps<Staker, Staker['id']>) => (
                                <StyledLink
                                    href={getEtherscanAddressLink(Network.Mainnet, cellProps.cell.value)}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <FlexDiv style={{ textAlign: 'left' }}>
                                        <Blockie src={makeBlockie(cellProps.cell.value)} style={{ marginBottom: 2 }} />
                                        <StakerCell staker={cellProps.cell.row.original} />
                                        <ArrowIconMedium />
                                    </FlexDiv>
                                </StyledLink>
                            ),
                            width: 150,
                            sortable: true,
                        },
                        {
                            Header: <>{t('governance.stakers.total-staked-col')}</>,
                            accessor: 'totalStakedAmount',
                            Cell: (cellProps: CellProps<Staker, Staker['totalStakedAmount']>) => {
                                const amountTooltip = `${formatCurrencyWithKey(
                                    THALES_CURRENCY,
                                    cellProps.cell.row.original.stakedAmount
                                )} (${t('governance.stakers.tooltip-staked-directly')}) + ${formatCurrencyWithKey(
                                    THALES_CURRENCY,
                                    cellProps.cell.row.original.escrowedAmount
                                )} (${t('governance.stakers.tooltip-escrowed-amount')})`;

                                return (
                                    <LightMediumTooltip title={amountTooltip}>
                                        <Amount>{formatCurrencyWithKey(THALES_CURRENCY, cellProps.cell.value)}</Amount>
                                    </LightMediumTooltip>
                                );
                            },
                            width: 150,
                            sortable: true,
                        },
                    ]}
                    data={addressSearch ? searchFilteredStakers : stakers}
                    isLoading={stakersQuery.isLoading}
                    noResultsMessage={t('governance.stakers.no-stakers-found')}
                    tableRowHeadStyles={{ width: '100%' }}
                    onSortByChanged={() => setPage(0)}
                    currentPage={page}
                    rowsPerPage={rowsPerPage}
                    initialState={{
                        sortBy: [
                            {
                                id: 'totalStakedAmount',
                                desc: true,
                            },
                        ],
                    }}
                />

                {stakers.length !== 0 && (
                    <PaginationWrapper
                        rowsPerPageOptions={[10, 20, 30, 50]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage={t(`common.pagination.rows-per-page`)}
                        count={stakers.length ? stakers.length : 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        ActionsComponent={() => (
                            <Pagination page={memoizedPage} numberOfPages={numberOfPages} setPage={setPage} />
                        )}
                        style={isMobile ? { padding: '0 5px 0 10px' } : { padding: '0 20px 0 30px' }}
                    />
                )}
            </TabelContainer>
        </Container>
    );
};

type StakerCellProps = {
    staker: Staker;
};

const StakerCell: React.FC<StakerCellProps> = ({ staker }) => {
    const [stakerEns, setStakerEns] = useState<string | null>(null);
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    useEffect(() => {
        const fetchStakerEns = async () => {
            const stakerEns = await (snxJSConnector as any).provider.lookupAddress(staker.id);
            setStakerEns(stakerEns);
        };
        if (networkId === Network.Mainnet) {
            fetchStakerEns();
        }
    }, [staker]);

    return <Address>{stakerEns != null ? stakerEns : truncateAddress(staker.id)}</Address>;
};

const Container = styled(FlexDivColumnCentered)`
    padding-top: 30px;
    @media (max-width: 767px) {
        padding-top: 10px;
    }
`;

const HeaderContainer = styled(FlexDivRowCentered)`
    @media (max-width: 767px) {
        flex-direction: column;
    }
`;

const TabelContainer = styled(FlexDivColumn)`
    position: relative;
    align-items: center;
    padding: 0 30px;
    width: 100%;
    @media (max-width: 767px) {
        padding: 0;
    }
`;

const Info = styled.div`
    font-weight: bold;
    font-size: 18px;
    line-height: 24px;
    color: ${(props) => props.theme.textColor.primary};
    margin-left: 30px;
    @media (max-width: 767px) {
        margin-left: 0;
    }
`;
const Address = styled.span`
    font-weight: bold;
    font-size: 14px;
    line-height: 22px;
    @media (max-width: 767px) {
        font-size: 12px;
    }
`;

const Amount = styled.span`
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    color: ${(props) => props.theme.textColor.primary};
    @media (max-width: 767px) {
        font-size: 12px;
    }
`;

export default ThalesStakers;
