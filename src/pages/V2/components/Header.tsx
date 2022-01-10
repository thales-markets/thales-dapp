import React from 'react';
import styled from 'styled-components';
import logo from 'assets/images/logo.svg';
import { useTranslation } from 'react-i18next';
import LanguageSelector from 'components/LanguageSelector';

const Header: React.FC = () => {
    const { t } = useTranslation();
    return (
        <>
            <Logo src={logo} />
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
            <ToggleContainer>
                <ToggleWrapper />
            </ToggleContainer>
            <LanguageContainer>
                <LanguageSelector isLandingPage />
            </LanguageContainer>
            <ButtonContainer>
                <Link target="_blank" rel="noreferrer" href="https://thalesmarket.io/markets">
                    {t('landing-page.use-app')}
                </Link>
                <i className="icon icon--right" />
            </ButtonContainer>
        </>
    );
};

const Logo = styled.img`
    grid-column-start: 4;
    grid-column-end: 9;
    grid-row-start: 3;
    grid-row-end: 4;
`;

const CenteredDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Links = styled(CenteredDiv)`
    grid-column-start: 14;
    grid-column-end: 39;
    grid-row-start: 3;
    grid-row-end: 4;
    justify-content: space-between;
`;

const ToggleContainer = styled(CenteredDiv)`
    grid-column-start: 40;
    grid-column-end: 43;
    grid-row-start: 3;
    grid-row-end: 4;
`;

const LanguageContainer = styled(CenteredDiv)`
    grid-column-start: 44;
    grid-column-end: 46;
    grid-row-start: 3;
    grid-row-end: 4;
`;

const ButtonContainer = styled(CenteredDiv)`
    grid-column-start: 46;
    grid-column-end: 49;
    grid-row-start: 3;
    grid-row-end: 4;
    color: #f7f7f7;
`;

const Link = styled.a`
    font-family: Nunito !important;
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 91.91%;

    text-align: center;
    text-transform: uppercase;

    color: #f7f7f7;
`;

const ToggleWrapper = styled.div`
    border: 1.5px solid #f7f7f7;
    box-sizing: border-box;
    border-radius: 30px;
    width: 63px;
    height: 26px;
`;

export default Header;
