import ROUTES from 'constants/routes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { navigateTo } from 'utils/routes';
import LanguageSelector from 'components/LanguageSelector/V2';

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
                {t('header.links.learn.title')}
            </Link>
            <DropDownContainer className={`dropdown-icon ${openLinksLearn ? 'open' : ''}`}>
                <Link target="_blank" rel="noreferrer" href="https://docs.thalesmarket.io/">
                    {t('header.links.learn.docs')}
                </Link>
                <Link target="_blank" rel="noreferrer" href="https://docs.thalesmarket.io/using-thales/why-use-thales">
                    {t('header.links.learn.guides')}
                </Link>
                <Link rel="noreferrer" onClick={() => navigateTo(ROUTES.Article.Whitepaper, false, false, 'show')}>
                    {t('header.links.learn.whitepaper')}
                </Link>

                <Link
                    href="../#faq-section"
                    onClick={() => {
                        setBurgerState(!burgerState);
                    }}
                >
                    {t('header.links.faq')}
                </Link>
            </DropDownContainer>

            <Link target="_blank" rel="noreferrer" href="https://discord.com/invite/rB3AWKwACM">
                {t('header.links.community')}
            </Link>
            <Link target="_blank" rel="noreferrer" href="https://thalesmarket.medium.com/">
                {t('header.links.blog')}
            </Link>
            <Link rel="noreferrer" onClick={() => navigateTo(ROUTES.Article.Governance, false, false, 'show')}>
                {t('header.links.governance')}
            </Link>
            <Link rel="noreferrer" onClick={() => navigateTo(ROUTES.Article.Token, false, false, 'show')}>
                {t('header.links.token')}
            </Link>

            <HorizontalLine />

            <LanguageContainerInBurger>
                <Text>{t('landing-page.language')}</Text>
                <LanguageSelector isBurger={true} />
            </LanguageContainerInBurger>

            <ThalesButton>
                <Logo
                    onClick={() => navigateTo(ROUTES.Options.Home, false, false, 'show')}
                    className="icon icon--logo"
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
    color: var(--color);
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
        color: var(--color);
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
    color: var(--color);
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
            border-top: 2px solid var(--color);
            border-right: 2px solid var(--color);
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
    color: var(--color);
    position: absolute;
    top: 37px;
    right: 25px;
`;

const ThalesButton = styled.div`
    background: #1b314f;
    &,
    & * {
        color: #f7f7f7 !important;
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
    background: var(--main-background);
    box-shadow: 0px 20px 30px rgba(0, 0, 0, 0.1);
`;

const LanguageContainerInBurger = styled.div`
    width: 100%;
    display: block;
`;

const HorizontalLine = styled.div`
    width: 100%;
    height: 2px;
    background: var(--color);
    position: relative;
    top: -30px;
`;

const Text = styled.p`
    font-family: Nunito !important;
    font-style: normal;
    font-weight: 300;
    font-size: 1.15em;
    line-height: 91.91%;
    margin-top: 12px;
    z-index: 2;
    text-align: left;
    text-transform: uppercase;
    color: var(--color);
`;

export default BurgerContainer;
