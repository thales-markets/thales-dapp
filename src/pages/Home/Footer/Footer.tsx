import ROUTES from 'constants/routes';
import React from 'react';
import { FlexDiv, Logo, Section } from 'theme/common';
import github from 'assets/images/github.svg';
import twitter from 'assets/images/twitter.svg';
import discord from 'assets/images/discord.svg';
import synthetix from 'assets/images/synthetix.svg';
import { FooterIcon, PoweredBy, SyntetixLogo, VerticalWrapper } from './components';

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
