import React from 'react';
import styled from 'styled-components';
import Checkbox from 'components/Checkbox';
import AssetInfo from 'components/AssetInfo/AssetInfo';
import { FlexDiv } from 'theme/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { useTranslation } from 'react-i18next';
import { sortCurrencies } from 'utils/currency';

type AssetsDropdownProps = {
    localStorageKey: string;
    assets: string[];
    selectedAssets: string[];
    setSelectedAssets: (assets: string[]) => void;
};

export const AssetsDropdown: React.FC<AssetsDropdownProps> = ({
    assets,
    selectedAssets,
    setSelectedAssets,
    localStorageKey,
}) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    return (
        <Container>
            <StyledFlexDiv key={'select-all'}>
                <SelectAllRow>
                    {t('common.select')}{' '}
                    <Selection
                        onClick={() => {
                            const newSelectedAssets = [...assets];
                            setSelectedAssets(newSelectedAssets);
                            localStorage.setItem(localStorageKey + networkId, JSON.stringify(newSelectedAssets));
                        }}
                    >
                        {t('common.all')}
                    </Selection>
                    {' / '}
                    <Selection
                        onClick={() => {
                            const newSelectedAssets = [] as string[];
                            setSelectedAssets(newSelectedAssets);
                            localStorage.setItem(localStorageKey + networkId, JSON.stringify(newSelectedAssets));
                        }}
                    >
                        {t('common.none')}
                    </Selection>
                </SelectAllRow>
            </StyledFlexDiv>
            <AssetsContainer>
                {assets.map((asset) => (
                    <StyledFlexDiv key={asset}>
                        <Checkbox
                            checked={selectedAssets.includes(asset)}
                            value={''}
                            onChange={(e: any) => {
                                const checked = e.target.checked;
                                if (checked) {
                                    const newSelectedAssets = [...selectedAssets, asset].sort(sortCurrencies);
                                    setSelectedAssets(newSelectedAssets);
                                    localStorage.setItem(
                                        localStorageKey + networkId,
                                        JSON.stringify(newSelectedAssets)
                                    );
                                } else {
                                    const newSelectedAssets = selectedAssets
                                        .filter((a) => a !== asset)
                                        .sort(sortCurrencies);
                                    setSelectedAssets(newSelectedAssets);
                                    localStorage.setItem(
                                        localStorageKey + networkId,
                                        JSON.stringify(newSelectedAssets)
                                    );
                                }
                            }}
                        />
                        <AssetInfo
                            currencyKeyFontSize={'15px'}
                            currencyKey={asset}
                            displayInRow={true}
                            hideFullName={true}
                            logoSize={'40px'}
                            displayInRowMobile={true}
                        />
                    </StyledFlexDiv>
                ))}
            </AssetsContainer>
        </Container>
    );
};

const Container = styled.div`
    position: absolute;
    background: var(--color-primary);
    border: 2px solid var(--color-highlight);
    box-shadow: 0px 25px 30px 20px rgba(0, 0, 0, 0.25);
    border-radius: 15px;
    z-index: 2;
    padding: 20px;
    color: var(--color-white) !important;
    width: 200px;
    @media (max-width: 768px) {
        top: 0;
        right: 0;
    }
`;

const StyledFlexDiv = styled(FlexDiv)`
    align-items: center;
    & > label {
        height: 15px;
    }
`;

const SelectAllRow = styled.span`
    width: 100%;
    text-transform: uppercase;
    font-size: 15px;
    padding-bottom: 10px;
`;

const Selection = styled.span`
    color: var(--color-highlight);
    cursor: pointer;
`;

const AssetsContainer = styled.div`
    height: 250px;
    overflow: auto;
`;

export default AssetsDropdown;
