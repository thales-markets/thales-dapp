import styled from 'styled-components';
import ROUTES from 'constants/routes';
import React from 'react';
import { FlexDiv, FlexDivColumnCentered, Logo, Section } from 'theme/common';
import github from 'assets/images/github.svg';
import twitter from 'assets/images/twitter.svg';
import discord from 'assets/images/discord.svg';
import synthetix from 'assets/images/synthetix.svg';

const FooterIcon = styled.img`
    width: 30px;
    height: 30px;
    margin: 60px;
`;

const PoweredBy = styled.div`
    align-self: start;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    color: #f6f6fe;
    white-space: nowrap;
    margin: 60px;
`;

const SyntetixLogo = styled.img`
    width: 220px;
    height: 16px;
    position: relative;
    top: 2px;
`;

const VerticalWrapper = styled(FlexDivColumnCentered)`
    align-items: center;
    width: min(100%, 1440px);
    margin: auto;
`;

const Footer: React.FC = () => (
    <Section>
        <VerticalWrapper>
            <FlexDiv>
                <FooterIcon src={github}></FooterIcon>
                <FooterIcon src={twitter}></FooterIcon>
                <FooterIcon src={discord}></FooterIcon>
            </FlexDiv>
            <FlexDiv>
                <Logo to={ROUTES.Home}>Thales</Logo>
            </FlexDiv>
            <PoweredBy>
                Powered by
                <SyntetixLogo src={synthetix}></SyntetixLogo>
            </PoweredBy>
        </VerticalWrapper>
    </Section>
);

export default Footer;
