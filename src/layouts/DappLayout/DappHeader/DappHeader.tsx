import Button from 'components/Button';
import ROUTES from 'constants/routes';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from 'types/ui';
import { getIsMobile } from '../../../redux/modules/ui';
import { FlexDivRow, FlexDivRowCentered } from '../../../styles/common';
import Logo from '../components/Logo';
import Notifications from '../components/Notifications';
import ReferralModal from '../components/ReferralModal';
import UserWallet from '../components/UserWallet';

const DappHeader: React.FC = () => {
    const { t } = useTranslation();

    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const [openReferralModal, setOpenReferralModal] = useState(false);

    return (
        <Container maxWidth={getMaxWidth()}>
            <LeftContainer>
                <FlexDivRow>
                    {isMobile && <Icon className="sidebar-icon icon--nav-menu" onClick={sidebarMenuClickHandler} />}
                    <Logo />
                    <Button
                        width="117px"
                        height="21px"
                        padding="0 15px"
                        margin="0 0 0 15px"
                        fontSize="13px"
                        onClick={() => setOpenReferralModal(true)}
                    >
                        {t('common.header.refer-earn')}
                    </Button>
                </FlexDivRow>
                {isMobile && <Notifications />}
            </LeftContainer>
            <RightContainer>
                <UserWallet />
                {!isMobile && <Notifications />}
            </RightContainer>
            {openReferralModal && <ReferralModal onClose={() => setOpenReferralModal(false)} />}
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
    if (`/${splittedPathname[1]}` === ROUTES.Options.Home || [ROUTES.Options.Profile].includes(location.pathname))
        return '974px';

    if (location.pathname === ROUTES.Options.Wizard) return '900px';
    if (location.pathname === ROUTES.Options.SpeedMarkets) return '1080px';
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

export default DappHeader;
