import React, { lazy, Suspense } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ROUTES from 'constants/routes';

const UserCard = lazy(() => import(/* webpackChunkName: "UserCard" */ './UserCard'));
const Sidebar = lazy(() => import(/* webpackChunkName: "Sidebar" */ './Sidebar'));

const DappHeader: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Container>
            <PageTitle>{getTitle(t)}</PageTitle>
            <Suspense fallback={<></>}>
                <UserCard />
            </Suspense>
            <Suspense fallback={<></>}>
                <Sidebar />
            </Suspense>
        </Container>
    );
};

const getTitle = (t: any) => {
    if (location.pathname === ROUTES.Options.Home) return t('common.sidebar.markets');
    if (location.pathname === ROUTES.Options.RangeMarkets) return t('common.sidebar.ranged-markets');
    if (location.pathname.includes(ROUTES.Governance.Home)) return t('common.sidebar.governance-label');
    if (location.pathname === ROUTES.Options.Token) return t('common.sidebar.earn-label');
    if (location.pathname === ROUTES.Options.Profile) return t('options.trading-profile.title');
    if (location.pathname === ROUTES.Options.Leaderboard) return t('options.leaderboard.trading-comp-title');
    if (location.pathname === ROUTES.Options.Leaderboard) return t('options.leaderboard.trading-comp-title');
    if (location.pathname === ROUTES.Options.OPRewards) return t('op-rewards.title');
    if (location.pathname === ROUTES.Options.Wizard) return t('wizard-page.title');
    if (location.pathname === ROUTES.Options.Vaults) return 'Vaults';
};

const Container = styled.div`
    height: 80px;
    width: 100%;
    max-width: 1440px;
    flex: unset;
    position: relative;
    margin-left: auto;
    margin-right: auto;
    padding: 40px 20px 0px 92px;
`;

const PageTitle = styled.p`
    font-family: Roboto !important;
    font-style: normal;
    font-weight: 600;
    font-size: 35px;
    color: var(--primary-color);

    @media (max-width: 1024px) {
        margin-top: 20px;
        font-size: 32px;
    }

    @media (max-width: 568px) {
        display: none;
    }
`;

export default DappHeader;
