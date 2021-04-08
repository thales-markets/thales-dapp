import React from 'react';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, Image } from 'theme/common';
import img3 from 'assets/images/img3.svg';

const Wrapper = styled(FlexDivCentered)`
    position: absolute;
    bottom: -135px;
    background: radial-gradient(60.71% 77.54% at 27.56% 12.79%, #415fff 0%, #867ccd 100%);
    border-radius: 24px;
    width: 1100px;
    height: 270px;
    align-self: center;
`;

const SearchWrapper = styled(FlexDivColumn)`
    flex: 1;
    padding: 38px 0 46px 50px;
`;

const SearchTitle = styled.p`
    width: 400px;
    font-weight: 600;
    font-size: 31px;
    line-height: 48px;
    letter-spacing: 0.25px;
    color: #f6f6fe;
`;
const SerachInput = styled.input`
    height: 65px;
    border-radius: 16px;
    border: none !important;
    outline: none !important;
    font-weight: 600;
    font-size: 20px;
    line-height: 40px;
    padding: 0 20px;
    letter-spacing: 0.15px;

    /* dusty lavander */

    color: #748bc6;
`;

const ImageWrapper = styled.div`
    position: relative;
    flex: 1;
`;

const SearchImage = styled(Image)`
    height: 300px;
    position: absolute;
    right: -120px;
    top: -84px;
`;

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
