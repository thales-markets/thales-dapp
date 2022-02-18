import React, { useMemo } from 'react';
import TileTable from '../../../../components/TileTable';
import useBinaryOptionsAllTradesQuery from '../../../../queries/options/useBinaryOptionsAllTradesQuery';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/rootReducer';
import { getNetworkId, getWalletAddress } from '../../../../redux/modules/wallet';
import { getIsAppReady } from '../../../../redux/modules/app';

// const rows = [
//     'December 18, 2021',
//     {
//         color: '#50CE99',
//         asset: { currencyKey: 'BTC', assetNameFontSize: '12px', currencyKeyFontSize: '12px' },
//         cells: [
//             { title: 'buy', value: '7.24 pm', flexDirection: 'row' },
//             { title: 'strike', value: '$ 7,500.00' },
//             { title: 'price', value: '$ 0.35' },
//             { title: 'amount', value: '1352 long' },
//             { title: 'paid', value: '$ 1000.00' },
//             { title: 'expired @', value: '17.50 21.07.2022' },
//             { title: 'market', value: 'down' },
//         ],
//     },
//     'December 19, 2021',
//     {
//         asset: { currencyKey: 'BTC', assetNameFontSize: '12px', currencyKeyFontSize: '12px' },
//         cells: [
//             { title: 'test', value: 'test' },
//             { title: 'test2', value: 'test2' },
//             { title: 'test3', value: 'test3' },
//             { title: 'test4', value: 'test4' },
//             { title: 'test', value: 'test' },
//             { title: 'test2', value: 'test2' },
//             { title: 'test3', value: 'test3' },
//         ],
//     },
//     {
//         color: '#C3244A',
//         asset: { currencyKey: 'BTC', assetNameFontSize: '12px', currencyKeyFontSize: '12px' },
//         cells: [
//             { title: 'test', value: 'test' },
//             { title: 'test2', value: 'test2' },
//             { title: 'test3', value: 'test3' },
//             { title: 'test4', value: 'test4' },
//             { title: 'test', value: 'test' },
//             { title: 'test2', value: 'test2' },
//             { title: 'test3', value: 'test3' },
//         ],
//     },
//     {
//         asset: { currencyKey: 'BTC', assetNameFontSize: '12px', currencyKeyFontSize: '12px' },
//         cells: [
//             { title: 'test', value: 'test' },
//             { title: 'test2', value: 'test2' },
//             { title: 'test3', value: 'test3' },
//             { title: 'test4', value: 'test4' },
//             { title: 'test', value: 'test' },
//             { title: 'test2', value: 'test2' },
//             { title: 'test3', value: 'test3' },
//         ],
//     },
//     {
//         asset: { currencyKey: 'BTC', assetNameFontSize: '12px', currencyKeyFontSize: '12px' },
//         cells: [
//             { title: 'test', value: 'test' },
//             { title: 'test2', value: 'test2' },
//             { title: 'test3', value: 'test3' },
//             { title: 'test4', value: 'test4' },
//             { title: 'test', value: 'test' },
//             { title: 'test2', value: 'test2' },
//             { title: 'test3', value: 'test3' },
//         ],
//     },
// ];

const History: React.FC = () => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const query = useBinaryOptionsAllTradesQuery(networkId, { enabled: isAppReady });

    const rows = useMemo(() => {
        if (query.isSuccess) {
            return [
                'January 13',
                ...query.data
                    .filter(
                        (d) =>
                            d.maker.toLowerCase() == walletAddress?.toLowerCase() ||
                            d.taker.toLowerCase() == walletAddress?.toLowerCase()
                    )
                    .map((d, i) => ({
                        // color: '#50CE99',
                        disabled: !!(i % 2),
                        asset: {
                            currencyKey: d.marketItem.currencyKey,
                            assetNameFontSize: '12px',
                            currencyKeyFontSize: '12px',
                        },
                        cells: [
                            { title: d.orderSide, value: new Date(d.timestamp).toDateString() },
                            { title: 'strike', value: d.marketItem.strikePrice },
                            {
                                title: 'price',
                                value: (d.orderSide == 'sell'
                                    ? d.takerAmount / d.makerAmount
                                    : d.makerAmount / d.takerAmount
                                ).toFixed(2),
                            },
                            {
                                title: 'amount',
                                value: `${d.orderSide == 'sell' ? d.takerAmount : d.makerAmount} ${d.optionSide}`,
                            },
                            {
                                title: 'paid',
                                value: (d.orderSide == 'sell' ? d.makerAmount : d.takerAmount).toFixed(2),
                            },
                            { title: 'expired @', value: '17.50 21.07.2022' }, // todo
                        ],
                    })),
            ];
        }
        return [];
    }, [query.isSuccess, query.data, walletAddress]);

    return (
        <TileTable
            // firstColumnRenderer={() => {
            //     return <div style={{ width: '31px' }} />;
            // }}
            rows={rows}
        />
    );
};

export default History;
