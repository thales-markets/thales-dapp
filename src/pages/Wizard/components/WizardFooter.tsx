import React from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';

const WizardFooter: React.FC = () => {
    return (
        <Wrapper>
            <ThalesLogo className="icon icon--logo" />
            <ThalesLogoText>© 2022 THALES DAO All Rights Reserved</ThalesLogoText>
            <FooterIconsWrapper>
                <TextLink target="_blank" rel="noreferrer" href="https://thalesmarket.io">
                    <Trans i18nKey="wizard-page.discover" />
                </TextLink>
                <TextLink target="_blank" rel="noreferrer" href="https://thalesmarket.io/article/governance">
                    <Trans i18nKey="wizard-page.about" />
                </TextLink>
                <TextLink target="_blank" rel="noreferrer" href="https://thalesmarket.io">
                    <Trans i18nKey="wizard-page.resources" />
                </TextLink>
                <IconLink target="_blank" rel="noreferrer" href="https://twitter.com/ThalesMarket">
                    <FooterIcon className="icon-home icon-home--twitter" />
                </IconLink>
                <IconLink target="_blank" rel="noreferrer" href="https://thalesmarket.medium.com/">
                    <FooterIcon className="icon-home icon-home--medium" />
                </IconLink>
                <IconLink target="_blank" rel="noreferrer" href="https://discord.gg/thales">
                    <FooterIcon className="icon-home icon-home--discord" />
                </IconLink>
                <IconLink target="_blank" rel="noreferrer" href="https://docs.thalesmarket.io/">
                    <FooterIcon className="icon-home icon-home--docs" />
                </IconLink>
            </FooterIconsWrapper>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    margin-top: 20px;
    display: flex;
    align-items: center;
`;

const ThalesLogo = styled.i`
    color: var(--icon-color);
    font-size: 88px;
    height: 83px;
`;

const ThalesLogoText = styled.p`
    width: 84px;
    height: 16px;
    font-size: 8px;
    color: #ffffff;
    font-family: 'Inter' !important;
    font-style: normal;
    font-weight: 400;
    font-size: 8px;
    line-height: 8px;
    text-align: center;
    color: #ffffff;
`;

const FlexDiv = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    color: var(--color);
    flex-wrap: wrap;
`;

const FooterIconsWrapper = styled(FlexDiv)`
    position: relative;
    display: flex;
    justify-content: center;
    gap: 6em;
    &:last-child {
        margin: 25px 0 25px auto;
        font-style: normal;
        font-weight: 300;
        font-size: 7px;
        line-height: 25px;
    }
    @media (max-width: 900px) {
        gap: 4em;
    }
    @media (max-width: 600px) {
        gap: 4em;
    }
    @media (max-width: 450px) {
        gap: 3em;
    }
`;

const IconLink = styled.a``;

const TextLink = styled.a`
    font-family: 'Inter' !important;
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
    color: #ffffff;
`;

const FooterIcon = styled.i`
    transition: 0.2s;
    &:hover {
        transform: scale(1.2);
    }
    &:before {
        pointer-events: none;
    }
    font-size: 3em;
    color: var(--color);
`;

export default WizardFooter;
