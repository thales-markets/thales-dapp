import React, { Suspense } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ROUTES from 'constants/routes';
import SPAAnchor from 'components/SPAAnchor';
import { buildHref } from 'utils/routes';
import UserWallet from '../components/UserWallet';
import Notifications from '../components/Notifications';
import { FlexDivRow } from 'styles/common';
import { ScreenSizeBreakpoint } from 'enums/ui';

const DappHeader: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Container>
            <PageTitle>{getTitle(t)}</PageTitle>
            <FlexDivRow>
                <Suspense fallback={<></>}>
                    <UserWallet />
                </Suspense>
                <Notifications />
            </FlexDivRow>
        </Container>
    );
};

const getTitle = (t: any) => {
    const splittedPathname = location.pathname.split('/');

    if (location.pathname === ROUTES.Options.Home) return t('options.trade.title');
    if (location.pathname.includes(ROUTES.Governance.Home)) return t('governance.title');
    if (location.pathname === ROUTES.Options.Token) return t('options.earn.title');
    if (location.pathname === ROUTES.Options.Profile) return t('options.trading-profile.title');
    if (location.pathname === ROUTES.Options.OPRewards) return t('op-rewards.title');
    if (location.pathname === ROUTES.Options.Wizard) return t('wizard-page.title');
    if (location.pathname === ROUTES.Options.Vaults) return t('vaults.title');
    if (location.pathname === ROUTES.Options.LiquidityPool) return t('liquidity-pool.title');
    if (location.pathname === ROUTES.Options.Referral) return t('referral-page.title');
    if (location.pathname === ROUTES.Options.Game) return t('game.title');
    if (`/${splittedPathname[1]}` === ROUTES.Options.Vaults && splittedPathname[2] !== undefined)
        if (splittedPathname[2] === '') {
            return t('vaults.title');
        } else {
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
        }
    if (`/${splittedPathname[1]}` === ROUTES.Options.Home && splittedPathname[2] !== undefined)
        if (splittedPathname[2] !== '') {
            return t('common.market');
        }
};

const Container = styled(FlexDivRow)`
    width: 100%;
    max-width: 1440px;
    padding-top: 40px;
    padding-bottom: 20px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding-top: 20px;
        justify-content: end;
    }
`;

const PageTitle = styled.p`
    font-weight: 600;
    font-size: 26px;
    color: ${(props) => props.theme.textColor.primary};
    @media (max-width: 1024px) {
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
    font-size: 36px;
    margin-left: 8px;
    top: -2px;
    position: relative;
`;

export default DappHeader;
