import React, { FC, memo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { CellProps, Row } from 'react-table';
import { SYNTHS_MAP, FIAT_CURRENCY_MAP, USD_SIGN } from 'constants/currency';
import { formatShortDate, formatCurrency } from 'utils/formatters';
import Table from 'components/Table';
import { CurrencyCol } from 'components/Table/common';
import { OptionsMarkets, HistoricalOptionsMarketInfo } from 'types/options';
import TimeRemaining from '../../components/TimeRemaining';
import Currency from 'components/Currency';
import { ethers } from 'ethers';
import snxJSConnector from '../../../../utils/snxJSConnector';
import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { LimitOrder, SignatureType } from '@0x/protocol-utils';
import { generatePseudoRandomSalt } from '@0x/order-utils';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/rootReducer';
import { getWalletAddress } from '../../../../redux/modules/wallet';
import dotenv from 'dotenv';
import { ContractWrappers } from '@0x/contract-wrappers';
import { navigateToOptionsMarket } from 'utils/routes';

dotenv.config();

type MarketsTableProps = {
    optionsMarkets: OptionsMarkets;
    noResultsMessage?: React.ReactNode;
    isLoading?: boolean;
};
let walletAddress = '';
const getPhaseBackgroundColor = (phase: string) => {
    walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    switch (phase) {
        case 'bidding':
            return '#fbe6b8';
        case 'trading':
            return '#9fe3d5';
        case 'maturity':
            return '#c5d5ff';
        case 'expiry':
            return '#f5607066';
        default:
            break;
    }
};

export const MarketsTable: FC<MarketsTableProps> = memo(({ optionsMarkets, noResultsMessage, isLoading }) => {
    const { t } = useTranslation();

    return (
        <Table
            columns={[
                {
                    Header: <>{t('options.home.markets-table.asset-col')}</>,
                    accessor: 'currencyKey',
                    Cell: (
                        cellProps: CellProps<HistoricalOptionsMarketInfo, HistoricalOptionsMarketInfo['currencyKey']>
                    ) => (
                        <Currency.Name
                            currencyKey={cellProps.cell.value}
                            name={cellProps.row.original.asset}
                            showIcon={true}
                            iconProps={{ width: '24px', height: '24px', type: 'asset' }}
                        />
                    ),
                    width: 150,
                    sortable: true,
                },
                {
                    Header: (
                        <>
                            {t('options.home.markets-table.strike-price-col', {
                                currencyKey: `${FIAT_CURRENCY_MAP.USD}`,
                            })}
                        </>
                    ),
                    accessor: 'strikePrice',
                    sortType: 'basic',
                    Cell: (
                        cellProps: CellProps<HistoricalOptionsMarketInfo, HistoricalOptionsMarketInfo['strikePrice']>
                    ) => <CurrencyCol sign={USD_SIGN} value={cellProps.cell.value} />,
                    width: 150,
                    sortable: true,
                },
                {
                    Header: <>{t('options.home.markets-table.maturity-date-col')}</>,
                    accessor: 'maturityDate',
                    Cell: (
                        cellProps: CellProps<HistoricalOptionsMarketInfo, HistoricalOptionsMarketInfo['maturityDate']>
                    ) => <span>{formatShortDate(cellProps.cell.value)}</span>,
                    width: 150,
                    sortable: true,
                },

                {
                    Header: <>{t('options.home.markets-table.long-short-col')}</>,
                    id: 'long-short',
                    Cell: (cellProps: CellProps<HistoricalOptionsMarketInfo>) => {
                        return (
                            <div>
                                <span style={{ color: '#10BA97' }}>
                                    {t('common.val-in-cents', {
                                        val: formatCurrency(cellProps.row.original.longPrice * 100),
                                    })}
                                </span>{' '}
                                /{' '}
                                <span style={{ color: '#D94454' }}>
                                    {t('common.val-in-cents', {
                                        val: formatCurrency(cellProps.row.original.shortPrice * 100),
                                    })}
                                </span>
                            </div>
                        );
                    },
                    width: 150,
                },
                {
                    Header: (
                        <Trans
                            i18nKey="options.home.markets-table.pool-size-col"
                            values={{ currencyKey: `${SYNTHS_MAP.sUSD}` }}
                            components={[<span key="pool" />]}
                        />
                    ),
                    accessor: 'poolSize',
                    sortType: 'basic',
                    Cell: (
                        cellProps: CellProps<HistoricalOptionsMarketInfo, HistoricalOptionsMarketInfo['poolSize']>
                    ) => <CurrencyCol sign={USD_SIGN} value={cellProps.cell.value} />,
                    width: 150,
                    sortable: true,
                },
                {
                    Header: <>{t('options.home.markets-table.phase-col')}</>,
                    accessor: 'phase',
                    Cell: (cellProps: CellProps<HistoricalOptionsMarketInfo, HistoricalOptionsMarketInfo['phase']>) => (
                        <span
                            style={{
                                backgroundColor: getPhaseBackgroundColor(cellProps.cell.value),
                                textTransform: 'uppercase',
                                padding: 5,
                            }}
                        >
                            {t(`options.phases.${cellProps.cell.value}`)}
                        </span>
                    ),
                    width: 150,
                },
                {
                    Header: <>{t('options.home.markets-table.time-remaining-col')}</>,
                    accessor: 'timeRemaining',
                    Cell: (
                        cellProps: CellProps<HistoricalOptionsMarketInfo, HistoricalOptionsMarketInfo['timeRemaining']>
                    ) => <TimeRemaining end={cellProps.cell.value} />,
                    width: 150,
                },
                {
                    Header: <>{t('options.home.markets-table.openorders')}</>,
                    accessor: 'openOrders',
                    Cell: (
                        cellProps: CellProps<HistoricalOptionsMarketInfo, HistoricalOptionsMarketInfo['openOrders']>
                    ) => (
                        <span
                            title={cellProps.row.original.orders ? JSON.stringify(cellProps.row.original.orders) : ''}
                        >
                            {cellProps.row.original.phase == 'trading' ? cellProps.cell.value : 'N/A'}
                            <button value={cellProps.row.original.orders} onClick={buyOrder}>
                                Buy order
                            </button>
                            <button value={cellProps.row.original.orders} onClick={cancelOrder}>
                                Cancel order
                            </button>
                            {cellProps.row.original.phase == 'trading' && (
                                <button value="0x57ab1e02fee23774580c119740129eac7081e9d3" onClick={approve}>
                                    Approve susd
                                </button>
                            )}
                        </span>
                    ),
                    width: 150,
                    sortable: true,
                },
                {
                    Header: <>{t('options.home.markets-table.actions')}</>,
                    accessor: 'longAddress',
                    Cell: (
                        cellProps: CellProps<HistoricalOptionsMarketInfo, HistoricalOptionsMarketInfo['longAddress']>
                    ) => (
                        <span>
                            {cellProps.row.original.phase == 'trading' ? '' : 'Not in trading'}
                            {cellProps.row.original.phase == 'trading' && (
                                <button value={cellProps.row.original.longAddress} onClick={submitOrder}>
                                    Submit long order
                                </button>
                            )}
                            {cellProps.row.original.phase == 'trading' && (
                                <button value={cellProps.row.original.shortAddress} onClick={submitOrder}>
                                    Submit short order
                                </button>
                            )}
                            {cellProps.row.original.phase == 'trading' && (
                                <button value={cellProps.row.original.shortAddress} onClick={approve}>
                                    Approve short
                                </button>
                            )}
                            {cellProps.row.original.phase == 'trading' && (
                                <button value={cellProps.row.original.longAddress} onClick={approve}>
                                    Approve long
                                </button>
                            )}
                        </span>
                    ),
                    width: 150,
                    sortable: false,
                },
            ]}
            data={optionsMarkets}
            onTableRowClick={(row: Row<HistoricalOptionsMarketInfo>) => {
                navigateToOptionsMarket(row.original.address);
            }}
            isLoading={isLoading}
            noResultsMessage={noResultsMessage}
        />
    );
});

declare const window: any;

export async function approve(ev: any): Promise<void> {
    ev.stopPropagation();
    const erc20Instance = new ethers.Contract(ev.currentTarget.value, erc20Abi, snxJSConnector.signer);
    const maxInt = `0x${'f'.repeat(64)}`;
    await erc20Instance.approve('0xDef1C0ded9bec7F1a1670819833240f027b25EfF', maxInt);
}

export async function buyOrder(ev: any): Promise<void> {
    ev.stopPropagation();
    const contractWrappers = new ContractWrappers(window.ethereum, { chainId: 1 });

    const targetOrder = ev.target.value.order;

    const PROTOCOL_FEE_MULTIPLIER = new BigNumber(70000);
    const calculateProtocolFee = (orders: Array<any>, gasPrice: BigNumber | number): BigNumber => {
        return new BigNumber(PROTOCOL_FEE_MULTIPLIER).times(gasPrice).times(orders.length);
    };

    const gasp = await window.web3.eth.getGasPrice();
    const valueP = calculateProtocolFee([targetOrder], gasp);

    await contractWrappers.exchangeProxy
        .fillLimitOrder(targetOrder, targetOrder.signature, Web3Wrapper.toBaseUnitAmount(new BigNumber(1), 18))
        .awaitTransactionSuccessAsync({ from: walletAddress, value: valueP });
}

export async function cancelOrder(ev: any): Promise<void> {
    ev.stopPropagation();
    const contractWrappers = new ContractWrappers(window.ethereum, { chainId: 1 });

    const targetOrder = ev.target.value.order;
    await contractWrappers.exchangeProxy
        .cancelLimitOrder(targetOrder)
        .awaitTransactionSuccessAsync({ from: walletAddress });
}

export async function submitOrder(ev: any): Promise<void> {
    ev.stopPropagation();
    const susdTokenAddress = '0x57ab1e02fee23774580c119740129eac7081e9d3';
    const makerToken = ev.currentTarget.value;

    const createSignedOrderV4Async = async () => {
        const order = new LimitOrder({
            makerToken: makerToken,
            takerToken: susdTokenAddress,
            makerAmount: Web3Wrapper.toBaseUnitAmount(new BigNumber(1), 18),
            takerAmount: Web3Wrapper.toBaseUnitAmount(new BigNumber(20), 18),
            maker: walletAddress,
            sender: '0x0000000000000000000000000000000000000000',
            expiry: getRandomFutureDateInSeconds(),
            salt: generatePseudoRandomSalt(),
            chainId: 1,
            verifyingContract: '0xDef1C0ded9bec7F1a1670819833240f027b25EfF',
        });

        const signature = await order.getSignatureWithProviderAsync(window.ethereum, SignatureType.EIP712);
        return { ...order, signature };
    };

    const order = await createSignedOrderV4Async();

    const url = `https://api.0x.org/sra/v4/order`;

    console.log(`Posting order to ${url}`);
    try {
        const response = await axios({
            method: 'POST',
            url,
            data: order,
        });
        console.log(JSON.stringify(response.data));
        console.log(response.status);
    } catch (err) {
        console.error('ERROR');
        //console.error(err);
        console.error(JSON.stringify(err.response.data));
        process.exit(1);
    }
}

export const ONE_SECOND_MS = 1000;
export const ONE_MINUTE_MS = ONE_SECOND_MS * 60;
export const TEN_MINUTES_MS = ONE_MINUTE_MS * 10;
export const getRandomFutureDateInSeconds = (): BigNumber => {
    return new BigNumber(Date.now() + TEN_MINUTES_MS).div(ONE_SECOND_MS).integerValue(BigNumber.ROUND_CEIL);
};

const erc20Abi = [
    {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [
            {
                name: '',
                type: 'string',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_spender',
                type: 'address',
            },
            {
                name: '_value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_from',
                type: 'address',
            },
            {
                name: '_to',
                type: 'address',
            },
            {
                name: '_value',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                name: '',
                type: 'uint8',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: '_owner',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                name: 'balance',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                name: '',
                type: 'string',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                name: '_to',
                type: 'address',
            },
            {
                name: '_value',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                name: '_owner',
                type: 'address',
            },
            {
                name: '_spender',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        payable: true,
        stateMutability: 'payable',
        type: 'fallback',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
];

export default MarketsTable;
