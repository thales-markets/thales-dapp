import React from 'react';
import styled from 'styled-components';
import ROUTES from 'constants/routes';
import UserWallet from '../components/UserWallet';
import Notifications from '../components/Notifications';
import { ScreenSizeBreakpoint } from 'enums/ui';
import Logo from '../components/Logo';
import { FlexDivRowCentered } from '../../../styles/common';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import { getIsMobile } from '../../../redux/modules/ui';

const DappHeader: React.FC = () => {
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    return (
        <Container maxWidth={getMaxWidth()}>
            <LeftContainer>
                <Logo />
                {isMobile && <Notifications />}
            </LeftContainer>
            <RightContainer>
                <UserWallet />
                {!isMobile && <Notifications />}
            </RightContainer>
        </Container>
    );
};

const getMaxWidth = () => {
    const splittedPathname = location.pathname.split('/');
    if (`/${splittedPathname[1]}` === ROUTES.Options.Home || location.pathname === ROUTES.Options.Profile)
        return '974px';

    if (location.pathname === ROUTES.Options.Wizard) return '900px';
    return '1440px';
};

const Container = styled(FlexDivRowCentered)<{ maxWidth: string }>`
    width: 100%;
    max-width: ${(props) => props.maxWidth};
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 25px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
    }
`;

const LeftContainer = styled(FlexDivRowCentered)`
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-bottom: 10px;
        width: 100%;
    }
`;

const RightContainer = styled(FlexDivRowCentered)``;

export default DappHeader;
