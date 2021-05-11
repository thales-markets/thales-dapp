import React from 'react';
import styled from 'styled-components';
import { FlexDiv } from 'theme/common';
import searchIcon from 'assets/images/search-icon.svg';

const Wrapper = styled(FlexDiv)`
    align-items: center;
    position: relative;
    &:before {
        content: url(${searchIcon});
        position: absolute;
        height: 28px;
        left: 4px;
        transform: scale(0.8);
    }
`;

const SearchInput = styled.input`
    height: 40px;
    border-radius: 16px;
    border: none !important;
    outline: none !important;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    padding: 0 10px;
    letter-spacing: 0.15px;
    background: #3936c7;
    color: #f6f6f6;
    padding-left: 40px;
    &::placeholder {
        font-size: 14px;
        color: #f6f6f6;
        opacity: 0.7;
    }
`;

type SearchMarketProp = {
    assetSearch: string;
    setAssetSearch: (param: string) => void;
};

const SearchMarket: React.FC<SearchMarketProp> = ({ assetSearch, setAssetSearch }) => (
    <Wrapper>
        <SearchInput onChange={(e) => setAssetSearch(e.target.value)} value={assetSearch} placeholder="Search" />
    </Wrapper>
);

export default SearchMarket;
