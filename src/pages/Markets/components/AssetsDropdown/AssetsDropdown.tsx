import React from 'react';
import styled from 'styled-components';
import Checkbox from '../../../../components/Checkbox';
import AssetInfo from '../../../../components/AssetInfo/AssetInfo';
import { FlexDiv } from '../../../../theme/common';
import Cookies from 'universal-cookie';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/rootReducer';
import { getNetworkId } from '../../../../redux/modules/wallet';
import { useTranslation } from 'react-i18next';

const cookies = new Cookies();

type AssetsDropdownProps = {
    cookieKey: string;
    assets: string[];
    selectedAssets: string[];
    setSelectedAssets: (assets: string[]) => void;
};

export const AssetsDropdown: React.FC<AssetsDropdownProps> = ({
    assets,
    selectedAssets,
    setSelectedAssets,
    cookieKey,
}) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    return (
        <Container>
            <StyledFlexDiv key={'select-all'}>
                <Checkbox
                    checked={assets.length === selectedAssets.length}
                    value={''}
                    onChange={(e: any) => {
                        const checked = e.target.checked;
                        if (checked) {
                            const newSelectedAssets = [...assets];
                            setSelectedAssets(newSelectedAssets);
                            cookies.set(cookieKey + networkId, newSelectedAssets);
                        } else {
                            const newSelectedAssets = [] as string[];
                            setSelectedAssets(newSelectedAssets);
                            cookies.set(cookieKey + networkId, newSelectedAssets);
                        }
                    }}
                />
                <SelectAllRow>{t('common.select-deselect-all')}</SelectAllRow>
            </StyledFlexDiv>
            {assets.map((asset) => (
                <StyledFlexDiv key={asset}>
                    <Checkbox
                        checked={selectedAssets.includes(asset)}
                        value={''}
                        onChange={(e: any) => {
                            const checked = e.target.checked;
                            if (checked) {
                                const newSelectedAssets = [...selectedAssets, asset];
                                setSelectedAssets(newSelectedAssets);
                                cookies.set(cookieKey + networkId, newSelectedAssets);
                            } else {
                                const newSelectedAssets = selectedAssets.filter((a) => a !== asset);
                                setSelectedAssets(newSelectedAssets);
                                cookies.set(cookieKey + networkId, newSelectedAssets);
                            }
                        }}
                    />
                    <AssetInfo
                        currencyKey={asset}
                        displayInRow={true}
                        hideFullName={true}
                        logoSize={'40px'}
                        displayInRowMobile={true}
                    />
                    {asset}
                </StyledFlexDiv>
            ))}
        </Container>
    );
};

const Container = styled.div`
    position: absolute;
    background: #04045a;
    border: 2px solid #64d9fe;
    box-shadow: 0px 25px 30px 20px rgba(0, 0, 0, 0.25);
    border-radius: 15px;
    z-index: 2;
    padding: 20px;
    color: var(--primary-color) !important;
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
    text-align: center;
    @media (max-width: 768px) {
        font-size: 15px;
    }
`;

export default AssetsDropdown;
