import React from 'react';
import styled from 'styled-components';
import { FlexDiv } from 'theme/common';
import searchIcon from 'assets/images/search-icon.svg';

const Wrapper = styled(FlexDiv)`
    align-items: center;
    position: relative;
    background: linear-gradient(rgba(140, 114, 184, 0.6), rgba(106, 193, 213, 0.6));
    border-radius: 23px;
    margin: 22px;
    &:before {
        content: url(${searchIcon});
        position: absolute;
        right: 16px;
        transform: scale(0.9);
    }
`;

const SearchInput = styled.input`
    height: 40px;
    width: 204px;
    border-radius: 23px;
    border: none !important;
    outline: none !important;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    padding: 0 10px;
    letter-spacing: 0.15px;
    background: #04045a;
    color: #f6f6fe;
    padding-left: 20px;
    margin: 2px;
    &::placeholder {
        font-size: 16px;
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
        <SearchInput onChange={(e) => setAssetSearch(e.target.value)} value={assetSearch} placeholder="Try ETH" />
    </Wrapper>
);

export default SearchMarket;
