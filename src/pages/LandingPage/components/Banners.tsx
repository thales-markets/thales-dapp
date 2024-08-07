import Banner from 'components/Banner';
import ROUTES from 'constants/routes';
import { Network } from 'enums/network';
import React from 'react';
import { Trans } from 'react-i18next';
import { SUPPORTED_NETWORK_IDS_MAP } from 'utils/network';
import { buildHref, navigateTo } from 'utils/routes';
import { Info } from './styled-components';

const INFORMATION_BANNER_ACTIVE = false;

const Banners: React.FC = () => {
    return (
        <>
            <Banner isLandingPage />
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

export default Banners;
