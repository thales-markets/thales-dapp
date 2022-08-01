import React from 'react';
import styled from 'styled-components';
import { Trans } from 'react-i18next';
import InfoBanner from 'components/InfoBanner';
import { FlexDiv } from 'theme/common';
import { buildHref } from 'utils/routes';
import ROUTES from 'constants/routes';
import SPAAnchor from 'components/SPAAnchor';

type OpRewardsBannerProps = {
    width?: number;
};

const OpRewardsBanner: React.FC<OpRewardsBannerProps> = ({ width }) => {
    return (
        <BannerContainer width={width}>
            <InfoBanner>
                <Trans
                    i18nKey="options.home.op-rewards-banner-message"
                    components={{
                        bold: <SPAAnchor href={buildHref(ROUTES.Options.OPRewards)} />,
                    }}
                />
            </InfoBanner>
        </BannerContainer>
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
`;

export default OpRewardsBanner;
