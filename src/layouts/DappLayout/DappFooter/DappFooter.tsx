import { ScreenSizeBreakpoint } from 'enums/ui';
import React from 'react';
import styled from 'styled-components';
import { FlexDivCentered } from 'styles/common';

const DappFooter: React.FC = () => {
    const year = new Date().getFullYear();

    return (
        <Wrapper>
            <LogoContainer>
                <Logo className="icon icon--thales-markets" />
                <LogoText>© {year} OVERTIME All Rights Reserved</LogoText>
            </LogoContainer>
            <FooterIconsWrapper>
                <IconLink target="_blank" rel="noreferrer" href="https://twitter.com/thales_io">
                    <FooterIcon className="icon-home icon-home--twitter-x" />
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

const Wrapper = styled(FlexDivCentered)`
    margin-top: auto;
    padding-top: 20px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: grid;
        justify-items: center;
    }
`;

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        order: 2;
    }
`;

const Logo = styled.i`
    font-size: 52px;
    height: 52px;
`;

const LogoText = styled.p`
    width: 110px;
    height: 20px;
    font-size: 10px;
    font-weight: 400;
    line-height: 11px;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
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
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
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

export default DappFooter;
