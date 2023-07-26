import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import styled from 'styled-components';
import { getSynthAsset, getSynthName } from 'utils/currency';

type AssetDropdownType = 'center' | 'left';

type AssetDropdownProps = {
    asset: string;
    setAsset: React.Dispatch<React.SetStateAction<string>>;
    allAssets: string[];
    showAssetIcon?: boolean;
    type?: AssetDropdownType;
};

const AssetDropdown: React.FC<AssetDropdownProps> = ({ asset, setAsset, allAssets, showAssetIcon, type }) => {
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
                    type={type}
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
                                type={type}
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
    type?: AssetDropdownType;
};

const Asset: React.FC<AssetProps> = ({
    asset,
    setAsset,
    open,
    showDropDownIcon = false,
    isClickable = false,
    selectedAsset = false,
    showIcon = false,
    type,
}) => {
    return (
        <Container
            onClick={() => setAsset(asset)}
            isSelected={selectedAsset}
            isClickable={isClickable}
            showIcon={showIcon}
            type={type}
        >
            <AssetWrapper showIcon={showIcon} type={type}>
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
    position: absolute;
    right: 15px;
    font-size: 12px;
    color: ${(props) => props.theme.textColor.primary};
`;

const Container = styled.div<{
    isSelected?: boolean;
    isClickable?: boolean;
    showIcon?: boolean;
    type?: AssetDropdownType;
}>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: ${(props) =>
        props.isSelected ? (props.showIcon ? '5px' : '5px 15px') : props.type === 'center' ? '5px 0' : '5px 10px'};
    max-height: ${(props) => (props.showIcon ? '36px' : '23px')};
    border-radius: 8px;
    background: ${(props) => props.theme.background.secondary};
    cursor: ${(props) => (props.isClickable ? 'pointer' : 'default')};
    &:hover {
        ${(props) => (!props.isSelected ? `background: ${props.theme.background.primary};` : '')};
    }
`;
const AssetWrapper = styled.div<{ showIcon?: boolean; type?: AssetDropdownType }>`
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
    ${(props) => (props.type === 'center' ? 'padding-left: 25%;' : '')}
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
