import { USD_SIGN } from 'constants/currency';
import usePriceDataQuery from 'queries/price/usePriceDataQuery';
import useExchangeRatesQuery, { Rates } from 'queries/rates/useExchangeRatesQuery';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { getAssetIcon, getSynthAsset, getSynthName } from 'utils/currency';
import {
    calculatePercentageChange,
    formatCurrencyWithSign,
    formatPricePercentageGrowth,
} from 'utils/formatters/number';

type AssetDropdownProps = {
    asset: string;
    setAsset: React.Dispatch<React.SetStateAction<string>>;
    allAssets: string[];
};

const AssetDropdown: React.FC<AssetDropdownProps> = ({ asset, setAsset, allAssets }) => {
    const [open, setOpen] = useState(false);

    const exchangeRatesMarketDataQuery = useExchangeRatesQuery();
    const exchangeRates = exchangeRatesMarketDataQuery.isSuccess ? exchangeRatesMarketDataQuery.data ?? null : null;

    return (
        <Wrapper onClick={setOpen.bind(this, !open)}>
            <Asset asset={asset} setAsset={setAsset.bind(this, asset)} exchangeRates={exchangeRates} />
            {open &&
                allAssets.map((_asset) => {
                    if (_asset !== asset) {
                        return (
                            <Asset
                                asset={_asset}
                                setAsset={setAsset.bind(this, _asset)}
                                exchangeRates={exchangeRates}
                            />
                        );
                    }
                })}
        </Wrapper>
    );
};

type AssetProps = {
    asset: string;
    setAsset: React.Dispatch<React.SetStateAction<string>>;
    exchangeRates: Rates | null;
};

const Asset: React.FC<AssetProps> = ({ asset, setAsset, exchangeRates }) => {
    const AssetIcon = getAssetIcon(asset);

    const Icon = styled(AssetIcon)`
        width: 32px;
        height: 32px;
        margin-right: 8px;
    `;

    const priceData = usePriceDataQuery({ currencyKey: asset, currencyVs: '', days: 1 }, { refetchInterval: false });

    const processedPriceData = useMemo(() => {
        if (priceData.isSuccess && priceData.data && priceData?.data?.prices) {
            if (priceData?.data?.prices?.length) {
                const processedPriceData = priceData.data.prices;
                return calculatePercentageChange(
                    processedPriceData[processedPriceData.length - 1][1],
                    processedPriceData[0][1]
                );
            }
        }

        return 0;
    }, [priceData]);

    return (
        <Container onClick={setAsset.bind(this, asset)}>
            <AssetWrapper>
                <Icon />

                <div>
                    <CurrencyName>{getSynthAsset(asset)}</CurrencyName>
                    <CurrencyFullName>{getSynthName(asset)}</CurrencyFullName>
                </div>
            </AssetWrapper>
            <PriceWrapper>
                <Price>{formatCurrencyWithSign(USD_SIGN, exchangeRates?.[asset] || 0)}</Price>
                <PriceChange uptrend={processedPriceData > 0}>
                    {formatPricePercentageGrowth(processedPriceData)}
                </PriceChange>
            </PriceWrapper>
        </Container>
    );
};

const Wrapper = styled.div`
    max-height: 54px;
    position: relative;
    z-index: 100;
`;

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 245px;
    height: 54px;
    padding: 0 12px;

    &:first-child {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    &:last-child {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }

    background: #27283f;

    &:hover {
        background: #3b3c60;
    }
    cursor: pointer;
`;
const AssetWrapper = styled.div`
    display: flex;
    flex: 2;
`;
const CurrencyName = styled.p`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;

    color: var(--color-white);
`;
const CurrencyFullName = styled.p`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;

    color: rgba(255, 255, 255, 0.3);
`;
const PriceWrapper = styled.div`
    flex: 1;
    padding-left: 20px;
`;
const Price = styled.p`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    letter-spacing: 0.01em;

    /* Neutral/4 */

    color: #f4f4f4;
`;
const PriceChange = styled.p<{ uptrend?: boolean }>`
    margin-top: 2px;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    letter-spacing: 0.01em;
    color: ${(props: any) => (props.uptrend ? '#50C878' : '#EE5521')};
`;

export default AssetDropdown;
