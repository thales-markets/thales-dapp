import React from 'react';
import { Wrapper, SearchTitle, SerachInput } from './components';

const SearchMarket: React.FC = () => (
    <>
        <Wrapper>
            <SearchTitle>Search by asset name or ticker symbol</SearchTitle>
            <SerachInput placeholder="Try ETH" />
        </Wrapper>
    </>
);

export default SearchMarket;
