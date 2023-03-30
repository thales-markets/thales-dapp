import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Trans } from 'react-i18next';
import InfoBanner from 'components/InfoBanner';
import { FlexDiv } from 'theme/common';
import { buildHref } from 'utils/routes';
import ROUTES from 'constants/routes';
import SPAAnchor from 'components/SPAAnchor';
import { getIsPolygon } from 'utils/network';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { useSelector } from 'react-redux';

type OpRewardsBannerProps = {
    isLandingPage?: boolean;
    width?: number;
};

const SHOW_BANNER = false;

const OpRewardsBanner: React.FC<OpRewardsBannerProps> = ({ isLandingPage, width }) => {
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isPolygon = getIsPolygon(networkId);

    const textLink = useMemo(() => {
        return (
            <Trans
                i18nKey="options.home.op-rewards-banner-message"
                components={{
                    bold: <SPAAnchor href={buildHref(ROUTES.Options.OPRewards)} />,
                }}
            />
        );
    }, []);

    return SHOW_BANNER ? (
        isPolygon ? null : isLandingPage ? (
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

const Info = styled.div`
    width: 100%;
    color: var(--color-white);
    text-align: center;
    padding: 10px;
    font-size: 16px;
    background-color: var(--background);
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

export default OpRewardsBanner;
