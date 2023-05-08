import React, { useState } from 'react';
import styled from 'styled-components';
import { getSynthAsset, getSynthName } from 'utils/currency';

type AssetDropdownProps = {
    asset: string;
    setAsset: React.Dispatch<React.SetStateAction<string>>;
    allAssets: string[];
};

const AssetDropdown: React.FC<AssetDropdownProps> = ({ asset, setAsset, allAssets }) => {
    const [open, setOpen] = useState(false);

    // const exchangeRatesMarketDataQuery = useExchangeRatesQuery();
    // const exchangeRates = exchangeRatesMarketDataQuery.isSuccess ? exchangeRatesMarketDataQuery.data ?? null : null;

    return (
        <Wrapper onClick={setOpen.bind(this, !open)}>
            <Asset asset={asset} setAsset={setAsset.bind(this, asset)} />
            {open && (
                <AssetContainer>
                    {allAssets.map((_asset, index) => {
                        if (_asset !== asset) {
                            return <Asset key={index} asset={_asset} setAsset={setAsset.bind(this, _asset)} />;
                        }
                    })}
                </AssetContainer>
            )}
        </Wrapper>
    );
};

type AssetProps = {
    asset: string;
    setAsset: React.Dispatch<React.SetStateAction<string>>;
    // exchangeRates: Rates | null;
};

const Asset: React.FC<AssetProps> = ({ asset, setAsset }) => {
    // const AssetIcon = getAssetIcon(asset);

    // const Icon = styled(AssetIcon)`
    //     width: 32px;
    //     height: 32px;
    //     margin-right: 8px;
    // `;

    // const priceData = usePriceDataQuery({ currencyKey: asset, currencyVs: '', days: 1 }, { refetchInterval: false });

    // const processedPriceData = useMemo(() => {
    //     if (priceData.isSuccess && priceData.data && priceData?.data?.prices) {
    //         if (priceData?.data?.prices?.length) {
    //             const processedPriceData = priceData.data.prices;
    //             return calculatePercentageChange(
    //                 processedPriceData[processedPriceData.length - 1][1],
    //                 processedPriceData[0][1]
    //             );
    //         }
    //     }

    //     return 0;
    // }, [priceData]);

    return (
        <Container onClick={setAsset.bind(this, asset)}>
            <AssetWrapper>
                {/* <Icon /> */}

                <CurrencyName>{getSynthAsset(asset)}</CurrencyName>
                <CurrencyFullName>{getSynthName(asset)}</CurrencyFullName>
            </AssetWrapper>
            {/* <PriceWrapper>
                <Price>{formatCurrencyWithSign(USD_SIGN, exchangeRates?.[asset] || 0)}</Price>
                <PriceChange uptrend={processedPriceData > 0}>
                    {formatPricePercentageGrowth(processedPriceData)}
                </PriceChange>
            </PriceWrapper> */}
        </Container>
    );
};

const Wrapper = styled.div`
    position: relative;
    z-index: 100;
    border-radius: 8px;
`;

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 245px;
    padding: 5px 15px;
    max-height: 23px;

    &:first-child {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }

    &:last-child {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }

    background: var(--color-secondary);

    &:hover {
        background: var(--color-secondary-hover);
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
    font-weight: 700;
    font-size: 13px;
    line-height: 100%;
    text-transform: uppercase;
    color: var(--color-text);
`;
const CurrencyFullName = styled.p`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 100%;
    text-transform: uppercase;
    color: var(--color-text);
    margin-left: 4px;
`;
const AssetContainer = styled.div`
    position: absolute;
    margin-top: 5px;
    background: var(--color-secondary);
    border-radius: 8px; ;
`;
// const PriceWrapper = styled.div`
//     flex: 1;
//     padding-left: 20px;
// `;
// const Price = styled.p`
//     font-family: 'Roboto';
//     font-style: normal;
//     font-weight: 400;
//     font-size: 12px;
//     line-height: 14px;
//     letter-spacing: 0.01em;

//     /* Neutral/4 */

//     color: #f4f4f4;
// `;
// const PriceChange = styled.p<{ uptrend?: boolean }>`
//     margin-top: 2px;
//     font-family: 'Roboto';
//     font-style: normal;
//     font-weight: 400;
//     font-size: 12px;
//     line-height: 14px;
//     letter-spacing: 0.01em;
//     color: ${(props: any) => (props.uptrend ? '#50C878' : '#EE5521')};
// `;

export default AssetDropdown;
