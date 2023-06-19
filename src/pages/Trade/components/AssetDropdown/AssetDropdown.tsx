import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import styled from 'styled-components';
import { getSynthAsset, getSynthName } from 'utils/currency';

type AssetDropdownProps = {
    asset: string;
    setAsset: React.Dispatch<React.SetStateAction<string>>;
    allAssets: string[];
};

const AssetDropdown: React.FC<AssetDropdownProps> = ({ asset, setAsset, allAssets }) => {
    const [open, setOpen] = useState(false);

    return (
        <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
            <Wrapper onClick={() => setOpen(!open)}>
                <Asset open={open} asset={asset} setAsset={setAsset} showDropDownIcon={true} selectedAsset={true} />
                {open && (
                    <AssetContainer>
                        {allAssets.map((_asset, index) => (
                            <Asset key={index} asset={_asset} setAsset={setAsset} />
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
    selectedAsset?: boolean;
};

const Asset: React.FC<AssetProps> = ({ asset, setAsset, open, showDropDownIcon = false, selectedAsset = false }) => {
    return (
        <Container onClick={() => setAsset(asset)} isSelected={selectedAsset}>
            <AssetWrapper>
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

const Container = styled.div<{ isSelected?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: ${(props) => (props.isSelected ? '5px 15px' : '5px 10px')};
    max-height: 23px;
    border-radius: 8px;
    background: ${(props) => props.theme.background.secondary};
    cursor: pointer;
    &:hover {
        ${(props) => (!props.isSelected ? `background: ${props.theme.background.primary};` : '')};
    }
`;
const AssetWrapper = styled.div`
    display: flex;
    flex: 2;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
`;
const CurrencyName = styled.p`
    font-weight: 700;
    font-size: 13px;
    line-height: 100%;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.primary};
`;
const CurrencyFullName = styled.p`
    font-weight: 400;
    font-size: 13px;
    line-height: 100%;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.primary};
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
