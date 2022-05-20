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
    if (location.pathname === ROUTES.Options.RangeMarkets) {
        return (
            <>
                {t('common.sidebar.ranged-markets')}
                <FloatingBetaTag>{'Beta'}</FloatingBetaTag>
            </>
        );
    }
    if (location.pathname.includes(ROUTES.Governance.Home)) return t('common.sidebar.governance-label');
    if (location.pathname === ROUTES.Options.Token) return t('common.sidebar.earn-label');
    if (location.pathname === ROUTES.Options.Profile) return t('options.trading-profile.title');
    if (location.pathname === ROUTES.Options.Leaderboard) return t('options.leaderboard.trading-comp-title');
};

const Container = styled.div`
    height: 80px;
    width: 100%;
    flex: unset;
    position: relative;
`;

const FloatingBetaTag = styled.div`
    display: inline;
    position: absolute;
    background-color: rgb(60, 181, 91);
    border-radius: 5px;
    color: rgb(246, 246, 254);
    font-size: 14px;
    padding: 4px 6px;
    margin-left: 0;
    margin-top: -3px;
    z-index: 1;
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
