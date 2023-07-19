import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import styled from 'styled-components';
import { getSynthAsset, getSynthName } from 'utils/currency';

type AssetDropdownProps = {
    asset: string;
    setAsset: React.Dispatch<React.SetStateAction<string>>;
    allAssets: string[];
    showAssetIcon?: boolean;
};

const AssetDropdown: React.FC<AssetDropdownProps> = ({ asset, setAsset, allAssets, showAssetIcon }) => {
    const [open, setOpen] = useState(false);

    return (
        <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
            <Wrapper onClick={() => setOpen(!open)}>
                <Asset
                    open={open}
                    asset={asset}
                    setAsset={setAsset}
                    showDropDownIcon={allAssets.length > 1}
                    isClickable={allAssets.length > 1}
                    selectedAsset={true}
                    showIcon={showAssetIcon}
                />
                {open && allAssets.length > 1 && (
                    <AssetContainer>
                        {allAssets.map((_asset, index) => (
                            <Asset
                                key={index}
                                asset={_asset}
                                setAsset={setAsset}
                                showIcon={showAssetIcon}
                                isClickable={true}
                            />
                        ))}
                    </AssetContainer>
                )}
            </Wrapper>
        </OutsideClickHandler>
    );
};

type AssetProps = {
    asset: string;
    setAsset: React.Dispatch<React.SetStateAction<string>>;
    open?: boolean;
    showDropDownIcon?: boolean;
    isClickable?: boolean;
    selectedAsset?: boolean;
    showIcon?: boolean;
};

const Asset: React.FC<AssetProps> = ({
    asset,
    setAsset,
    open,
    showDropDownIcon = false,
    isClickable = false,
    selectedAsset = false,
    showIcon = false,
}) => {
    return (
        <Container
            onClick={() => setAsset(asset)}
            isSelected={selectedAsset}
            isClickable={isClickable}
            showIcon={showIcon}
        >
            <AssetWrapper showIcon={showIcon}>
                {showIcon && <CurrenyIcon className={`currency-icon currency-icon--${asset.toLowerCase()}`} />}
                <CurrencyName>{getSynthAsset(asset)}</CurrencyName>
                <CurrencyFullName>{getSynthName(asset)}</CurrencyFullName>
            </AssetWrapper>
            {showDropDownIcon && <Icon className={open ? `icon icon--caret-up` : `icon icon--caret-down`} />}
        </Container>
    );
};

const Wrapper = styled.div`
    position: relative;
    z-index: 100;
    border-radius: 8px;
`;

const Icon = styled.i`
    font-size: 12px;
    color: ${(props) => props.theme.textColor.primary};
`;

const Container = styled.div<{ isSelected?: boolean; isClickable?: boolean; showIcon?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: ${(props) => (props.isSelected ? (props.showIcon ? '4px 15px 4px 4px' : '5px 15px') : '5px 10px')};
    max-height: ${(props) => (props.showIcon ? '36px' : '23px')};
    border-radius: 8px;
    background: ${(props) => props.theme.background.secondary};
    cursor: ${(props) => (props.isClickable ? 'pointer' : 'default')};
    &:hover {
        ${(props) => (!props.isSelected ? `background: ${props.theme.background.primary};` : '')};
    }
`;
const AssetWrapper = styled.div<{ showIcon?: boolean }>`
    display: flex;
    flex: 2;
    align-items: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    font-size: ${(props) => (props.showIcon ? '18px' : '13px')};
    line-height: 100%;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.primary};
`;
const CurrenyIcon = styled.i`
    font-size: 28px;
    line-height: 100%;
    margin-right: 12px;
`;
const CurrencyName = styled.p`
    font-weight: 700;
`;
const CurrencyFullName = styled.p`
    font-weight: 400;
    margin-left: 4px;
`;
const AssetContainer = styled.div`
    position: absolute;
    margin-top: 5px;
    padding: 5px;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 8px;
    width: 100%;
`;

export default AssetDropdown;
