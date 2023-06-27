import React from 'react';
import styled from 'styled-components';
import ROUTES from 'constants/routes';
import logoIcon from 'assets/images/logo-light.svg';
import SPAAnchor from 'components/SPAAnchor';
import { buildHref } from 'utils/routes';

const Logo: React.FC = () => (
    <Container>
        <SPAAnchor href={buildHref(ROUTES.Options.Home)}>
            <LogoIcon height="26" src={logoIcon} />
        </SPAAnchor>
    </Container>
);

const Container = styled.div``;

const LogoIcon = styled.img`
    margin-bottom: -8px;
`;

export default Logo;
