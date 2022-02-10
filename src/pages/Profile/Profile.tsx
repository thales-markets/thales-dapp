import React from 'react';
import TileTable from '../../components/TileTable';

const rows = [
    {
        color: 'linear-gradient(90deg, #50CE99 0%, #00C2C2 100%)',
        asset: { currencyKey: 'BTC', assetNameFontSize: '12px', currencyKeyFontSize: '12px' },
        cells: [
            { title: 'buy', value: '7.24 pm', flexDirection: 'row' },
            { title: 'strike', value: '$ 7,500.00' },
            { title: 'price', value: '$ 0.35' },
            { title: 'amount', value: '1352 long' },
            { title: 'paid', value: '$ 1000.00' },
            { title: 'expired @', value: '17.50 21.07.2022' },
            { title: 'market', value: 'down' },
        ],
    },
    {
        asset: { currencyKey: 'BTC', assetNameFontSize: '12px', currencyKeyFontSize: '12px' },
        cells: [
            { title: 'test', value: 'test' },
            { title: 'test2', value: 'test2' },
            { title: 'test3', value: 'test3' },
            { title: 'test4', value: 'test4' },
            { title: 'test', value: 'test' },
            { title: 'test2', value: 'test2' },
            { title: 'test3', value: 'test3' },
        ],
    },
    {
        asset: { currencyKey: 'BTC', assetNameFontSize: '12px', currencyKeyFontSize: '12px' },
        cells: [
            { title: 'test', value: 'test' },
            { title: 'test2', value: 'test2' },
            { title: 'test3', value: 'test3' },
            { title: 'test4', value: 'test4' },
            { title: 'test', value: 'test' },
            { title: 'test2', value: 'test2' },
            { title: 'test3', value: 'test3' },
        ],
    },
    {
        asset: { currencyKey: 'BTC', assetNameFontSize: '12px', currencyKeyFontSize: '12px' },
        cells: [
            { title: 'test', value: 'test' },
            { title: 'test2', value: 'test2' },
            { title: 'test3', value: 'test3' },
            { title: 'test4', value: 'test4' },
            { title: 'test', value: 'test' },
            { title: 'test2', value: 'test2' },
            { title: 'test3', value: 'test3' },
        ],
    },
    {
        asset: { currencyKey: 'BTC', assetNameFontSize: '12px', currencyKeyFontSize: '12px' },
        cells: [
            { title: 'test', value: 'test' },
            { title: 'test2', value: 'test2' },
            { title: 'test3', value: 'test3' },
            { title: 'test4', value: 'test4' },
            { title: 'test', value: 'test' },
            { title: 'test2', value: 'test2' },
            { title: 'test3', value: 'test3' },
        ],
    },
];

const Profile: React.FC = () => {
    return <TileTable rows={rows} />;
};

export default Profile;
