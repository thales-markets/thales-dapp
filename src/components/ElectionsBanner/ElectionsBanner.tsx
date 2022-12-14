import React from 'react';
import styled from 'styled-components';
import { Trans } from 'react-i18next';
import InfoBanner from 'components/InfoBanner';
import { FlexDiv } from 'theme/common';
import { buildHref } from 'utils/routes';
import ROUTES from 'constants/routes';
import SPAAnchor from 'components/SPAAnchor';
import { SpaceKey, VOTING_COUNCIL_PROPOSAL_ID } from 'constants/governance';

type ElectionsBannerProps = {
    width?: number;
};

const SHOW_BANNER = true;

const ElectionsBanner: React.FC<ElectionsBannerProps> = ({ width }) => {
    return (
        SHOW_BANNER && (
            <BannerContainer width={width}>
                <InfoBanner>
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
                </InfoBanner>
            </BannerContainer>
        )
    );
};

const BannerContainer = styled(FlexDiv)<{ width?: number }>`
    width: ${(props) => props.width || 100}%;
    padding-bottom: 40px;
    strong {
        font-weight: bold;
        cursor: pointer;
        margin-left: 0.2em;
        color: var(--input-border-color);
    }
    a {
        display: contents;
        font-weight: bold;
        cursor: pointer;
        color: var(--input-border-color);
    }
    @media (max-width: 1192px) {
        padding-bottom: 20px;
    }
`;

export default ElectionsBanner;
