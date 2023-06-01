import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Trans } from 'react-i18next';
import InfoBanner from 'components/InfoBanner';
import { FlexDiv } from 'theme/common';
import { buildHref } from 'utils/routes';
import ROUTES from 'constants/routes';
import SPAAnchor from 'components/SPAAnchor';
import { SpaceKey, VOTING_COUNCIL_PROPOSAL_ID } from 'constants/governance';

type ElectionsBannerProps = {
    isLandingPage?: boolean;
    width?: number;
};

const SHOW_BANNER = false;

const ElectionsBanner: React.FC<ElectionsBannerProps> = ({ isLandingPage, width }) => {
    const textLink = useMemo(() => {
        return (
            <Trans
                i18nKey="options.home.elections-banner-message"
                components={{
                    bold: (
                        <SPAAnchor
                            href={buildHref(
                                `${ROUTES.Governance.Home}/${SpaceKey.COUNCIL}/${VOTING_COUNCIL_PROPOSAL_ID}`
                            )}
                        />
                    ),
                }}
            />
        );
    }, []);

    return SHOW_BANNER ? (
        isLandingPage ? (
            <Info>{textLink}</Info>
        ) : (
            <BannerContainer width={width}>
                <InfoBanner>{textLink}</InfoBanner>
            </BannerContainer>
        )
    ) : null;
};

const BannerContainer = styled(FlexDiv)<{ width?: number }>`
    width: ${(props) => props.width || 100}%;
    padding-bottom: 10px;
    strong {
        font-weight: bold;
        cursor: pointer;
        margin-left: 0.2em;
        color: ${(props) => props.theme.button.textColor.primary};
    }
    a {
        display: contents;
        font-weight: bold;
        cursor: pointer;
        color: ${(props) => props.theme.button.textColor.primary};
    }
    @media (max-width: 1192px) {
        padding-bottom: 20px;
    }
`;

const Info = styled.div`
    width: 100%;
    color: ${(props) => props.theme.textColor.primary};
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
        color: #91bced;
    }
    a {
        display: contents;
        font-weight: bold;
        cursor: pointer;
        color: #91bced;
    }
`;

export default ElectionsBanner;
