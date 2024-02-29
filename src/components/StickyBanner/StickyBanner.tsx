import ROUTES from 'constants/routes';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'types/ui';
import styled from 'styled-components';
import { FlexDiv } from 'styles/common';
import { getSupportedNetworksByRoute } from 'utils/network';
import { navigateTo } from 'utils/routes';

const StickyBanner: React.FC = () => {
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));

    return getSupportedNetworksByRoute(ROUTES.Options.SpeedMarkets).includes(networkId) ? (
        <Container onClick={() => navigateTo(ROUTES.Options.SpeedMarkets)}>
            <Label>{t('banner.speed-markets-banner')}</Label>
        </Container>
    ) : (
        <></>
    );
};

const Container = styled(FlexDiv)`
    position: absolute;
    top: 0;
    width: 100%;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme.button.textColor.primary};
    background-color: ${(props) => props.theme.borderColor.tertiary};
    min-height: 35px;
    z-index: 102;
    cursor: pointer;
    text-align: center;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

const Label = styled.span`
    color: ${(props) => props.theme.button.textColor.primary};
    font-size: 18px;
    padding: 9px 0px;
    font-style: normal;
    font-weight: 800;
    text-transform: uppercase;
`;

export default StickyBanner;
