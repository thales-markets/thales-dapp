import ROUTES from 'constants/routes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HashLink } from 'react-router-hash-link';
import styled from 'styled-components';
import { navigateTo } from 'utils/routes';

type BurgerInput = {
    burgerState: boolean;
    setBurgerState: (data: any) => void;
};

const BurgerContainer: React.FC<BurgerInput> = ({ burgerState, setBurgerState }) => {
    const { t } = useTranslation();
    const [openLinksLearn, setOpenLinks] = useState(false);

    return (
        <Wrapper className={burgerState ? '' : 'hide'}>
            <Link
                className={`dropdown-icon ${openLinksLearn ? 'open' : ''}`}
                onClick={(e) => {
                    e.preventDefault();
                    setOpenLinks(!openLinksLearn);
                }}
                target="_blank"
                rel="noreferrer"
            >
                {t('landing-page.header.links.learn.title')}
            </Link>
            <DropDownContainer className={`dropdown-icon ${openLinksLearn ? 'open' : ''}`}>
                <Link target="_blank" rel="noreferrer" href="https://docs.thalesmarket.io/">
                    {t('landing-page.header.links.learn.docs')}
                </Link>
                <Link target="_blank" rel="noreferrer" href="https://docs.thalesmarket.io/using-thales/why-use-thales">
                    {t('landing-page.header.links.learn.guides')}
                </Link>
                <Link rel="noreferrer" onClick={() => navigateTo(ROUTES.Article.Whitepaper, false, false, 'show')}>
                    {t('landing-page.header.links.learn.whitepaper')}
                </Link>
                <HashLink
                    to="/#faq-section"
                    onClick={() => {
                        setBurgerState(!burgerState);
                    }}
                >
                    {t('landing-page.header.links.faq')}
                </HashLink>
            </DropDownContainer>

            <Link target="_blank" rel="noreferrer" href="https://discord.com/invite/rB3AWKwACM">
                {t('landing-page.header.links.community')}
            </Link>
            <Link target="_blank" rel="noreferrer" href="https://thalesmarket.medium.com/">
                {t('landing-page.header.links.blog')}
            </Link>

            <HorizontalLine />

            <ThalesButton>
                <Logo
                    onClick={() => navigateTo(ROUTES.Options.Home, false, false, 'show')}
                    className="landing-icons thales-icon"
                />
            </ThalesButton>
            <Xicon
                onClick={() => {
                    setBurgerState(!burgerState);
                }}
                className="icon icon--x-sign"
            />
        </Wrapper>
    );
};

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
`;

const DropDownContainer = styled.div`
    display: none;
    @media (max-width: 1024px) {
        background: transparent;
        position: relative;
        top: -45px;
        left: 0;
        display: none;
        &.open {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-between;
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
        font-size: 1.15em;
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

const Link = styled.a`
    position: relative;
    font-family: Nunito !important;
    font-style: normal;
    font-weight: 300;
    font-size: 1.15em;
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

const Xicon = styled.i`
    font-size: 20px;
    font-weight: 100;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    position: absolute;
    top: 37px;
    right: 25px;
`;

const ThalesButton = styled.div`
    background: ${(props) => props.theme.landingPage.background.secondary};
    &,
    & * {
        color: ${(props) => props.theme.landingPage.textColor.primary} !important;
    }

    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.75em;
    padding: 20px 26px;
    height: 56px;
    align-self: center;
    margin-top: 40px;
`;

const Wrapper = styled.div`
    &.hide {
        display: none;
    }
    position: absolute;
    z-index: 10;
    top: -20px;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 100px 40px;
    width: 100%;
    background: ${(props) => props.theme.landingPage.background.primary};
    box-shadow: 0px 20px 30px rgba(0, 0, 0, 0.1);
`;

const HorizontalLine = styled.div`
    width: 100%;
    height: 2px;
    background: ${(props) => props.theme.landingPage.textColor.primary};
    position: relative;
    top: -30px;
`;

export default BurgerContainer;
