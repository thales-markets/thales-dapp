import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { navigateTo } from 'utils/routes';
import ROUTES from 'constants/routes';
import BurgerContainer from './BurgerContainer';
import { HashLink } from 'react-router-hash-link';

const Header: React.FC = () => {
    const { t } = useTranslation();
    const [openBurger, setBurgerState] = useState(false);

    return (
        <Wrapper>
            <Logo
                onClick={() => navigateTo(ROUTES.Home, false, false, 'show')}
                className="icon-home icon-home--thales"
            />
            <Links>
                <PositionedContainer>
                    <Link target="_blank" rel="noreferrer" href="https://docs.thalesmarket.io/">
                        {t('landing-page.header.links.learn.title')}
                    </Link>
                    <DropDownContainer>
                        <Link target="_blank" rel="noreferrer" href="https://docs.thalesmarket.io/">
                            {t('landing-page.header.links.learn.docs')}
                        </Link>
                        <Link
                            target="_blank"
                            rel="noreferrer"
                            href="https://docs.thalesmarket.io/using-thales/why-use-thales"
                        >
                            {t('landing-page.header.links.learn.guides')}
                        </Link>
                        <Link
                            rel="noreferrer"
                            onClick={() => navigateTo(ROUTES.Article.Whitepaper, false, false, 'show')}
                        >
                            {t('landing-page.header.links.learn.whitepaper')}
                        </Link>

                        <HashLink to="/#faq-section">{t('landing-page.header.links.faq')}</HashLink>
                    </DropDownContainer>
                </PositionedContainer>
                <Link target="_blank" rel="noreferrer" href="https://discord.com/invite/rB3AWKwACM">
                    {t('landing-page.header.links.community')}
                </Link>
                <Link target="_blank" rel="noreferrer" href="https://thalesmarket.medium.com/">
                    {t('landing-page.header.links.blog')}
                </Link>
                <Link rel="noreferrer" onClick={() => navigateTo(ROUTES.Article.Governance, false, false, 'show')}>
                    {t('landing-page.header.links.governance')}
                </Link>
                <Link rel="noreferrer" onClick={() => navigateTo(ROUTES.Article.Token, false, false, 'show')}>
                    {t('landing-page.header.links.token')}
                </Link>
            </Links>
            <DotsContainer
                onClick={() => {
                    setBurgerState(!openBurger);
                }}
            >
                <DotsIcon className="icon icon--three-dots" />
            </DotsContainer>
            <ButtonContainer>
                <Link rel="noreferrer" onClick={() => navigateTo(ROUTES.Options.Home, false, false, 'show')}>
                    {t('landing-page.use-app')}
                </Link>
                <i className="icon-home icon-home--right" />
            </ButtonContainer>
            <BurgerContainer burgerState={openBurger} setBurgerState={setBurgerState} />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: contents;
    @media (max-width: 1024px) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        top: 20px;
        width: 100vw;
        padding: 0 40px;
        z-index: 10;
        margin-top: 50px;
    }
`;

const PositionedContainer = styled.div`
    position: relative;
    display: block;
    top: 50px;
    padding-bottom: 100px;
    &:hover {
        div {
            display: flex;
        }
    }
`;

const DropDownContainer = styled.div`
    position: absolute;
    top: 2em;
    left: 0;
    background: ${(props) => props.theme.landingPage.background.secondary};
    box-shadow: 0px 20px 30px rgba(0, 0, 0, 0.1);
    border-radius: 7px;
    display: none;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    padding: 10px;
    @media (max-width: 600px) {
        background: transparent;
        position: relative;
        top: -45px;
        left: 0;
        display: none;
        &.open {
            display: flex;
        }
        box-shadow: none;
        border-radius: 0;
        & > a {
            margin-bottom: 0;
        }
    }
    & > a {
        width: 100%;
        font-family: Nunito !important;
        font-style: normal;
        font-weight: 300;
        font-size: 1em;
        line-height: 1.6em;
        text-align: left;
        text-transform: uppercase;
        color: ${(props) => props.theme.landingPage.textColor.primary};
        padding: 10px;
        border-radius: 7px;
        &:hover {
            background: rgba(196, 196, 196, 0.1);
        }
    }
`;

const Logo = styled.i`
    grid-column-start: 4;
    grid-column-end: 9;
    grid-row-start: 3;
    grid-row-end: 4;
    font-size: 8.3em;
    line-height: 34px;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    z-index: 2;
    flex: 1;
    cursor: pointer;
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
    z-index: 10;
    @media (max-width: 1024px) {
        display: none;
    }
`;

const DotsContainer = styled(CenteredDiv)`
    display: none;
    grid-column-start: 45;
    grid-column-end: 47;
    grid-row-start: 3;
    grid-row-end: 4;
    z-index: 2;
    cursor: pointer;
    @media (max-width: 1024px) {
        display: block;
        margin-left: 20px;
    }
`;

const ButtonContainer = styled(CenteredDiv)`
    grid-column-start: 47;
    grid-column-end: 50;
    grid-row-start: 3;
    grid-row-end: 4;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    z-index: 2;
    @media (max-width: 1024px) {
        display: none;
    }
`;

const Link = styled.a`
    position: relative;
    font-family: Nunito !important;
    font-style: normal;
    font-weight: 300;
    font-size: 1em;
    line-height: 91.91%;
    z-index: 2;
    text-align: center;
    text-transform: uppercase;
    cursor: pointer;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    @media (max-width: 1024px) {
        margin-bottom: 60px;
    }
    &.dropdown-icon {
        :after {
            content: '';
            display: block;
            position: absolute;
            top: -4px;
            right: -32px;
            width: 10px;
            height: 10px;
            border-top: 2px solid ${(props) => props.theme.landingPage.textColor.primary};
            border-right: 2px solid ${(props) => props.theme.landingPage.textColor.primary};
            transform: rotate(135deg);
        }
        &.open:after {
            top: 2px;
            transform: rotate(-45deg);
        }
    }
`;

const DotsIcon = styled.i`
    font-size: 3em;
    line-height: 24px;
    z-index: 2;
    color: ${(props) => props.theme.landingPage.textColor.primary};
`;

export default Header;
