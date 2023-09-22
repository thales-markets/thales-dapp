import ROUTES from 'constants/routes';
import React from 'react';
import { Trans } from 'react-i18next';
import { SUPPORTED_NETWORK_IDS_MAP } from 'utils/network';
import { navigateTo, buildHref } from 'utils/routes';
import { Network } from 'enums/network';
import ElectionsBanner from 'components/ElectionsBanner';
import OpRewardsBanner from 'components/OpRewardsBanner';
import styled from 'styled-components';

const INFORMATION_BANNER_ACTIVE = false;

const Banners: React.FC = () => {
    return (
        <>
            <OpRewardsBanner isLandingPage={true} />
            <ElectionsBanner isLandingPage={true} />
            {INFORMATION_BANNER_ACTIVE && (
                <Info>
                    <Trans
                        i18nKey="landing-page.polygon-trading-competition-1"
                        components={{
                            bold: (
                                <strong
                                    onClick={() => {
                                        SUPPORTED_NETWORK_IDS_MAP[Network.PolygonMainnet].changeNetwork(
                                            Network.PolygonMainnet,
                                            () => {
                                                navigateTo(buildHref(ROUTES.Options.Home));
                                            }
                                        );
                                    }}
                                />
                            ),
                        }}
                    />
                    ,
                    <Trans
                        i18nKey="landing-page.polygon-trading-competition-2"
                        components={{
                            bold: (
                                <a
                                    href="https://docs.thalesmarket.io/competitions-and-events/thales-polygon-trading-competition"
                                    rel="noreferrer"
                                    target="_blank"
                                >
                                    <strong />
                                </a>
                            ),
                        }}
                    />
                </Info>
            )}
        </>
    );
};

const Info = styled.div`
    width: 100%;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    text-align: center;
    padding: 10px;
    font-size: 16px;
    background-color: ${(props) => props.theme.landingPage.background.secondary};
    box-shadow: 0px 0px 20px rgb(0 0 0 / 40%);
    z-index: 2;
    position: absolute;
    strong {
        font-weight: bold;
        cursor: pointer;
        margin-left: 0.2em;
        color: ${(props) => props.theme.landingPage.textColor.secondary};
    }
    a {
        display: contents;
        font-weight: bold;
        cursor: pointer;
        color: ${(props) => props.theme.landingPage.textColor.secondary};
    }
`;

export default Banners;
