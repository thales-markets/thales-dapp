import { ScreenSizeBreakpoint } from 'enums/ui';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FlexDivCentered } from 'styles/common';
import { getSynthAsset, getSynthName } from 'utils/currency';

type SelectAssetProps = {
    selectedAsset: string;
    allAssets: string[];
    onChange: React.Dispatch<string>;
};

const SelectAsset: React.FC<SelectAssetProps> = ({ selectedAsset, allAssets, onChange }) => {
    const [asset, setAsset] = useState(selectedAsset);

    useEffect(() => {
        setAsset(selectedAsset);
    }, [selectedAsset]);

    return (
        <Container>
            {allAssets.map((currentAsset, index) => (
                <Asset
                    key={index}
                    isSelected={asset === currentAsset || selectedAsset === currentAsset}
                    onClick={() => {
                        onChange(currentAsset);
                        setAsset(currentAsset);
                    }}
                >
                    <IconWrapper>
                        <AssetIcon className={`currency-icon currency-icon--${currentAsset.toLowerCase()}`} />
                    </IconWrapper>
                    <AssetName>{getSynthAsset(currentAsset)}</AssetName>
                    <AssetFullName>{getSynthName(currentAsset)}</AssetFullName>
                </Asset>
            ))}
        </Container>
    );
};

const Container = styled(FlexDivCentered)`
    gap: 15px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        gap: 10px;
    }
`;

const Asset = styled(FlexDivCentered)<{ isSelected: boolean }>`
    width: 190px;
    height: 36px;
    border-radius: 8px;
    background: ${(props) =>
        props.isSelected ? props.theme.button.background.primary : props.theme.button.background.tertiary};
    color: ${(props) =>
        props.isSelected ? props.theme.button.textColor.primary : props.theme.button.textColor.secondary};
    cursor: pointer;
    font-size: 18px;
    line-height: 90%;
    padding-left: 1px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 160px;
        font-size: 16px;
    }
`;

const IconWrapper = styled.div`
    background: radial-gradient(${(props) => props.theme.background.primary} 60%, transparent 40%);
    border-radius: 50%;
    margin-right: 12px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-right: 8px;
    }
`;

const AssetIcon = styled.i`
    font-size: 28px;
    line-height: 100%;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 24px;
    }
`;

const AssetName = styled.p`
    font-weight: 700;
    text-transform: uppercase;
`;

const AssetFullName = styled.p`
    font-weight: 400;
    margin-left: 4px;
    text-transform: uppercase;
`;

export default SelectAsset;
