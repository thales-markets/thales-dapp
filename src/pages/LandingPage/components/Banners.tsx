import ROUTES from 'constants/routes';
import { Info } from 'pages/Vault/styled-components';
import React from 'react';
import { Trans } from 'react-i18next';
import { SUPPORTED_NETWORK_IDS_MAP } from 'utils/network';
import { navigateTo, buildHref } from 'utils/routes';
import { Network } from 'enums/network';
import ElectionsBanner from 'components/ElectionsBanner';
import OpRewardsBanner from 'components/OpRewardsBanner';

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

export default Banners;
