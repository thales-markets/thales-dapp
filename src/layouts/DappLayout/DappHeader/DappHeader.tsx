import Button from 'components/Button';
import ROUTES from 'constants/routes';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { RootState } from 'types/ui';
import { getIsMobile, setShowTour } from '../../../redux/modules/ui';
import { FlexDivRow, FlexDivRowCentered } from '../../../styles/common';
import Logo from '../components/Logo';
import Notifications from '../components/Notifications';
import UserWallet from '../components/UserWallet';

const DappHeader: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();

    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    return (
        <Container maxWidth={getMaxWidth()}>
            <LeftContainer>
                <FlexDivRow>
                    {isMobile && <Icon className="sidebar-icon icon--nav-menu" onClick={sidebarMenuClickHandler} />}
                    <Logo />
                    {(location.pathname == ROUTES.Options.Home || location.pathname == ROUTES.Home) && !isMobile && (
                        <Button
                            height="25px"
                            padding="0 7px"
                            margin="0 0 0 10px"
                            fontSize="13px"
                            onClick={() => dispatch(setShowTour(true))}
                        >
                            <ButtonIcon className="icon icon--tour" />
                            {t('common.header.tutorial')}
                        </Button>
                    )}
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

const getMaxWidth = () => {
    const splittedPathname = location.pathname.split('/');
    if (
        `/${splittedPathname[1]}` === ROUTES.Options.Home ||
        `/${splittedPathname[1]}` === ROUTES.Home ||
        [ROUTES.Options.Profile].includes(location.pathname)
    )
        return '974px';
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

const Icon = styled.i`
    margin-right: 13px;
    font-size: 26px;
`;

const ButtonIcon = styled.i`
    font-size: 21px;
    color: ${(props) => props.theme.button.textColor.primary};
    margin-right: 5px;
`;

export default DappHeader;
