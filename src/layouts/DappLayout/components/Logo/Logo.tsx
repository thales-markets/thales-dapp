import logoIcon from 'assets/images/logo-light.svg';
import SPAAnchor from 'components/SPAAnchor';
import ROUTES from 'constants/routes';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React from 'react';
import styled from 'styled-components';
import { buildHref } from 'utils/routes';

const Logo: React.FC = () => (
    <Container>
        <SPAAnchor href={buildHref(ROUTES.Options.Home)}>
            <LogoIcon src={logoIcon} />
        </SPAAnchor>
    </Container>
);

const Container = styled.div``;

const LogoIcon = styled.img`
    margin-bottom: -8px;
    height: 26px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-top: 2px;
        margin-bottom: 0px;
        height: 24px;
    }
`;

export default Logo;
