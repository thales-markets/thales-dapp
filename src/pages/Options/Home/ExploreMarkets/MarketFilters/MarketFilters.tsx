import React from 'react';
import { FlexDivCentered } from 'theme/common';
import myBids from 'assets/images/my-bids.svg';
import myMarkets from 'assets/images/my-markets.svg';
import myWatchlist from 'assets/images/my-watchlist.svg';
import recentlyAdded from 'assets/images/recently-added.svg';
import styled from 'styled-components';

const FiltersWrapper = styled.div`
    background: #04045a;
    border-radius: 20px;
    width: 192px;
    height: 240px;
    padding: 36px 40px;
    margin: 24px;
    cursor: pointer;
`;

const FiltersIconWrapper = styled.div`
    width: 112px;
    height: 112px;
    border-radius: 50%;
    background: ${(props) => props.color};
`;

const FiltersIcon = styled.img`
    display: block;
    position: relative;
    margin: auto;
    top: 42px;
    width: 28px;
    height: 28px;
`;

const FiltersText = styled.p`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #f6f6fe;
    margin-top: 20px;
`;

const MarketsFilters: React.FC = () => {
    return (
        <>
            <FlexDivCentered>
                <FiltersWrapper>
                    <FiltersIconWrapper color="linear-gradient(144.68deg, #86E1A0 9.9%, #4FBF67 84.58%)">
                        <FiltersIcon src={myBids}></FiltersIcon>
                    </FiltersIconWrapper>
                    <FiltersText>My bids</FiltersText>
                </FiltersWrapper>
                <FiltersWrapper>
                    <FiltersIconWrapper color="linear-gradient(135deg, #FFA051 0%, #FF6628 100%)">
                        <FiltersIcon src={myMarkets}></FiltersIcon>
                    </FiltersIconWrapper>
                    <FiltersText>My markets</FiltersText>
                </FiltersWrapper>
                <FiltersWrapper>
                    <FiltersIconWrapper color="linear-gradient(135deg, #FF8FD8 0%, #4E47E2 100%)">
                        <FiltersIcon src={myWatchlist}></FiltersIcon>
                    </FiltersIconWrapper>
                    <FiltersText>My watchlist</FiltersText>
                </FiltersWrapper>
                <FiltersWrapper>
                    <FiltersIconWrapper color="linear-gradient(146.29deg, #B2DEEF 14.84%, #3EDDDD 92.53%)">
                        <FiltersIcon src={recentlyAdded}></FiltersIcon>
                    </FiltersIconWrapper>
                    <FiltersText>Recently added</FiltersText>
                </FiltersWrapper>
            </FlexDivCentered>
        </>
    );
};

export default MarketsFilters;
