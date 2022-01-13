import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from 'components/LanguageSelector/V2';
import styled from 'styled-components';
import { Theme } from '../Home';
import Cookies from 'universal-cookie';
import { navigateTo } from 'utils/routes';
import ROUTES from 'constants/routes';

type HeaderInput = {
    theme: Theme;
    setTheme: (data: any) => void;
};

const cookies = new Cookies();

const Header: React.FC<HeaderInput> = ({ theme, setTheme }) => {
    const { t } = useTranslation();
    return (
        <>
            <Logo className="icon-home icon-home--thales" />
            <Links>
                <Link target="_blank" rel="noreferrer" href="https://docs.thales.market/">
                    {t('header.links.docs')}
                </Link>
                <Link
                    target="_blank"
                    rel="noreferrer"
                    href="https://thalesmarket.medium.com/thales-tokenomics-introducing-thales-token-3aab321174e7"
                >
                    {t('header.links.tokenomics')}
                </Link>
                <Link target="_blank" rel="noreferrer">
                    {t('header.links.partners')}
                </Link>
                <Link target="_blank" rel="noreferrer" href="https://discord.com/invite/rB3AWKwACM">
                    {t('header.links.community')}
                </Link>

                <Link target="_blank" rel="noreferrer" href="https://thalesmarket.medium.com/">
                    {t('header.links.blog')}
                </Link>
            </Links>
            <ToggleContainer
                onClick={() => {
                    console.log('clicked');
                    cookies.set('home-theme', theme === Theme.Light ? Theme.Dark : Theme.Light);
                    setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light);
                }}
            >
                <ToggleIcon
                    className={`icon-home ${
                        theme === Theme.Light ? 'icon-home--toggle-white' : 'icon-home--toggle-dark'
                    }`}
                />
            </ToggleContainer>
            <LanguageContainer>
                <LanguageSelector isLandingPage />
            </LanguageContainer>
            <ButtonContainer>
                <Link
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => navigateTo(ROUTES.Options.Home, false, false, 'show')}
                >
                    {t('landing-page.use-app')}
                </Link>
                <i className="icon-home icon-home--right" />
            </ButtonContainer>
        </>
    );
};

const Logo = styled.i`
    grid-column-start: 4;
    grid-column-end: 9;
    grid-row-start: 3;
    grid-row-end: 4;
    font-size: 8.3em;
    line-height: 34px;
    color: var(--color);
    z-index: 2;
`;

const CenteredDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
`;

const Links = styled(CenteredDiv)`
    grid-column-start: 14;
    grid-column-end: 39;
    grid-row-start: 3;
    grid-row-end: 4;
    justify-content: space-between;
    z-index: 2;
`;

const ToggleContainer = styled(CenteredDiv)`
    grid-column-start: 40;
    grid-column-end: 43;
    grid-row-start: 3;
    grid-row-end: 4;
    z-index: 2;
    cursor: pointer;
`;

const LanguageContainer = styled(CenteredDiv)`
    grid-column-start: 44;
    grid-column-end: 46;
    grid-row-start: 3;
    grid-row-end: 4;
    z-index: 1000;
`;

const ButtonContainer = styled(CenteredDiv)`
    grid-column-start: 47;
    grid-column-end: 50;
    grid-row-start: 3;
    grid-row-end: 4;
    color: var(--color);
    z-index: 2;
`;

const Link = styled.a`
    font-family: Nunito !important;
    font-style: normal;
    font-weight: 300;
    font-size: 1em;
    line-height: 91.91%;
    z-index: 2;
    text-align: center;
    text-transform: uppercase;
    color: var(--color);
`;

const ToggleIcon = styled.i`
    font-size: 3.4em;
    line-height: 26px;
    z-index: 2;
    color: var(--color);
`;

export default Header;
