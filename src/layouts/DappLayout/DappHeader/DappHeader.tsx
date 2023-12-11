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
import { navigateTo } from 'utils/routes';
import ROUTES from 'constants/routes';
import { useTranslation } from 'react-i18next';

const DappHeader: React.FC = () => {
    const isMobile = useSelector((state: RootState) => getIsMobile(state));
    const { t } = useTranslation();

    return (
        <Container>
            <LeftContainer>
                <FlexDivRow>
                    {isMobile && <Icon className="sidebar-icon icon--nav-menu" onClick={sidebarMenuClickHandler} />}
                    <Logo />
                    <GetStartedButton onClick={() => navigateTo(ROUTES.Options.Wizard)}>
                        {t('get-started.get-started')}
                    </GetStartedButton>
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
        gap: 10px;
        align-items: flex-start;
        margin-bottom: 10px;
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

const GetStartedButton = styled.button`
    margin-left: 20px;
    width: 120px;
    padding: 4px;
    background-color: ${(props) => props.theme.background.primary};
    color: ${(props) => props.theme.textColor.primary};
    border-radius: 5px;
    border: 1px solid ${(props) => props.theme.borderColor.quaternary};
    cursor: pointer;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 100%; /* 13px */
    text-transform: capitalize;
`;

const Icon = styled.i`
    margin-right: 13px;
    font-size: 26px;
`;

export default DappHeader;
