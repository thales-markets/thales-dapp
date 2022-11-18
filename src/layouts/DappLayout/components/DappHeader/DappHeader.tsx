import React, { lazy, Suspense } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ROUTES from 'constants/routes';
import SPAAnchor from 'components/SPAAnchor';
import { buildHref } from 'utils/routes';

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
    const splittedPathname = location.pathname.split('/');

    if (location.pathname === ROUTES.Options.Home) return t('common.sidebar.markets');
    if (location.pathname === ROUTES.Options.RangeMarkets) return t('common.sidebar.ranged-markets');
    if (location.pathname.includes(ROUTES.Governance.Home)) return t('common.sidebar.governance-label');
    if (location.pathname === ROUTES.Options.Token) return t('common.sidebar.earn-label');
    if (location.pathname === ROUTES.Options.Profile) return t('options.trading-profile.title');
    if (location.pathname === ROUTES.Options.Leaderboard) return t('options.leaderboard.trading-comp-title');
    if (location.pathname === ROUTES.Options.Leaderboard) return t('options.leaderboard.trading-comp-title');
    if (location.pathname === ROUTES.Options.OPRewards) return t('op-rewards.title');
    if (location.pathname === ROUTES.Options.Wizard) return t('wizard-page.title');
    if (location.pathname === ROUTES.Options.Vaults) return t('vaults.title');
    if (`/${splittedPathname[1]}` === ROUTES.Options.Vaults && splittedPathname[2] !== undefined)
        return (
            <>
                <SPAAnchor href={buildHref(ROUTES.Options.Vaults)}>
                    <BackLinkContainer>
                        <BackIcon className={`icon icon--left`} />
                        {t('vaults.title')}
                    </BackLinkContainer>
                </SPAAnchor>{' '}
                / {t(`vault.${splittedPathname[2]}.title`)}
                <TitleVaultIcon className={`sidebar-icon icon--${splittedPathname[2]}`} />
            </>
        );
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

export const BackLinkContainer = styled.span`
    :hover {
        text-decoration: underline;
    }
`;

export const BackIcon = styled.i`
    font-weight: 400;
    font-size: 28px;
    margin-right: 6px;
    top: -2px;
    position: relative;
`;

export const TitleVaultIcon = styled.i`
    font-weight: 400;
    font-size: 38px;
    margin-left: 8px;
    top: -2px;
    position: relative;
`;

export default DappHeader;
