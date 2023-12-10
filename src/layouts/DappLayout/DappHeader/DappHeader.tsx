import React from 'react';
import styled from 'styled-components';
import UserWallet from '../components/UserWallet';
import Notifications from '../components/Notifications';
import { ScreenSizeBreakpoint } from 'enums/ui';
import Logo from '../components/Logo';
import { FlexDivRow, FlexDivRowCentered } from '../../../styles/common';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import { getIsMobile } from '../../../redux/modules/ui';

const DappHeader: React.FC = () => {
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    return (
        <Container>
            <LeftContainer>
                <FlexDivRow>
                    {isMobile && <Icon className="sidebar-icon icon--nav-menu" onClick={sidebarMenuClickHandler} />}
                    <Logo />
                </FlexDivRow>
                {isMobile && <Notifications />}
            </LeftContainer>
            <RightContainer>
                <UserWallet />
                {!isMobile && <Notifications />}
            </RightContainer>
        </Container>
    );
};

const sidebarMenuClickHandler = () => {
    const root = document.getElementById('root');
    const content = document.getElementById('main-content');
    const sidebar = document.getElementById('sidebar');
    if (root?.classList.contains('collapse')) {
        sidebar?.classList.remove('collapse');
        content?.classList.remove('collapse');
        root?.classList.remove('collapse');
    } else {
        root?.classList.add('collapse');
        content?.classList.add('collapse');
        sidebar?.classList.add('collapse');
    }
};

const Container = styled(FlexDivRowCentered)`
    width: 100%;
    max-width: 1080px;
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

const RightContainer = styled(FlexDivRowCentered)`
    @media (max-width: 500px) {
        width: 100%;
    }
`;

const Icon = styled.i`
    margin-right: 13px;
    font-size: 26px;
`;

export default DappHeader;
