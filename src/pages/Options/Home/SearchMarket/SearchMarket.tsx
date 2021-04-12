import React from 'react';
import img3 from 'assets/images/img3.svg';
import { Wrapper, SearchWrapper, SearchTitle, SerachInput, ImageWrapper, SearchImage } from './components';

const SearchMarket: React.FC = () => (
    <>
        <Wrapper>
            <SearchWrapper>
                <SearchTitle>Search by asset name or ticker symbol</SearchTitle>
                <SerachInput placeholder="Try ETH" />
            </SearchWrapper>
            <ImageWrapper>
                <SearchImage src={img3}></SearchImage>
            </ImageWrapper>
        </Wrapper>
    </>
);

export default SearchMarket;
