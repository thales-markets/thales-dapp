import ROUTES from 'constants/routes';
import React from 'react';
import { FlexDiv, Logo, MainWrapper } from 'theme/common';
import github from 'assets/images/github.svg';
import twitter from 'assets/images/twitter.svg';
import discord from 'assets/images/discord.svg';
import synthetix from 'assets/images/synthetix.svg';
import { FooterIcon, PoweredBy, SyntetixLogo, VerticalWrapper } from './components';
import styled from 'styled-components';

export const Background = styled.section`
    position: relative;
    z-index: 2;
    background: transparent;
`;

const Footer: React.FC = () => (
    <Background>
        <MainWrapper>
            <VerticalWrapper>
                <FlexDiv>
                    <FooterIcon src={github}></FooterIcon>
                    <FooterIcon src={twitter}></FooterIcon>
                    <FooterIcon src={discord}></FooterIcon>
                </FlexDiv>
                <FlexDiv>
                    <Logo to={ROUTES.Home} />
                </FlexDiv>
                <PoweredBy>
                    Powered by
                    <SyntetixLogo src={synthetix}></SyntetixLogo>
                </PoweredBy>
            </VerticalWrapper>
        </MainWrapper>
    </Background>
);

export default Footer;
