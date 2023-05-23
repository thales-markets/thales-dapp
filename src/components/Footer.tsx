import React from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';

const Footer: React.FC = () => {
    const year = new Date().getFullYear();

    return (
        <Wrapper>
            <ThalesLogoContainer>
                <ThalesLogo className="icon icon--logo" />
                <ThalesLogoText>© {year} THALES DAO All Rights Reserved</ThalesLogoText>
            </ThalesLogoContainer>
            <FooterIconsWrapper>
                <TextLink target="_blank" rel="noreferrer" href="https://thalesmarket.io/article/token">
                    <Trans i18nKey="footer.discover" />
                </TextLink>
                <TextLink target="_blank" rel="noreferrer" href="https://thalesmarket.io/article/governance">
                    <Trans i18nKey="footer.about" />
                </TextLink>
                <TextLink target="_blank" rel="noreferrer" href="https://docs.thalesmarket.io/">
                    <Trans i18nKey="footer.resources" />
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
    margin-top: 20px;
    display: flex;
    align-items: center;
    @media (max-width: 768px) {
        display: grid;
        justify-items: center;
    }
`;

const ThalesLogoContainer = styled.div`
    display: flex;
    align-items: center;
    @media (max-width: 768px) {
        order: 2;
    }
`;

const ThalesLogo = styled.i`
    font-size: 88px;
    height: 83px;
    @media (max-width: 768px) {
        font-size: 80px;
    }
`;

const ThalesLogoText = styled.p`
    width: 84px;
    height: 16px;
    font-size: 8px;
    font-weight: 400;
    line-height: 8px;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
    @media (max-width: 768px) {
        height: 24px;
    }
`;

const FlexDiv = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    color: ${(props) => props.theme.textColor.primary};
    flex-wrap: wrap;
`;

const FooterIconsWrapper = styled(FlexDiv)`
    position: relative;
    display: flex;
    justify-content: center;
    gap: 6em;
    &:last-child {
        margin: 25px 0 25px 50px;
        font-style: normal;
        font-weight: 300;
        font-size: 7px;
        line-height: 25px;
    }
    @media (max-width: 900px) {
        gap: 4em;
    }
    @media (max-width: 768px) {
        order: 1;
        &:last-child {
            margin-left: 0;
            margin-bottom: 0;
            font-size: 6px;
        }
    }
    @media (max-width: 450px) {
        gap: 3em;
    }
`;

const IconLink = styled.a``;

const TextLink = styled.a`
    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
    color: ${(props) => props.theme.link.textColor.secondary};
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
    color: ${(props) => props.theme.textColor.primary};
`;

export default Footer;
