import React from 'react';
import styled from 'styled-components';
import { FlexDiv } from 'styles/common';

const ASSET_ICON_KEYS = [
    'btc-icon',
    'eth-icon',
    'snx-icon',
    'link-icon',
    'sol-icon',
    'op-icon',
    'bnb-icon',
    'crv-icon',
    'arb-icon',
    'xrp-icon',
    'tron-icon',
    'ltc-icon',
    'xag-icon',
    'xau-icon',
];

const AssetList: React.FC = () => {
    return (
        <Wrapper>
            {ASSET_ICON_KEYS.map((item, index) => {
                return <Icon className={`landing-icon ${item}`} key={`asset-${index}`} />;
            })}
        </Wrapper>
    );
};

const Wrapper = styled(FlexDiv)`
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
`;

const Icon = styled.i`
    font-family: 'LandingIcons' !important;
    font-size: 40px;
    margin: 15px 15px 0 0;
    color: ${(props) => props.theme.landingPage.button.background.primary};
`;

export default AssetList;
