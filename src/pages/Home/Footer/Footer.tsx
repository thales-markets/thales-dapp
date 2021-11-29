import ROUTES from 'constants/routes';
import React from 'react';
import { FlexDiv, Logo, MainWrapper, IconLink } from 'theme/common';
import { VerticalWrapper, StyledGithubIcon, StyledTwitterIcon, StyledDiscordIcon } from './components';
import styled from 'styled-components';

export const Background = styled.section<{ isAnimationAvailable: boolean }>`
    position: relative;
    z-index: 2;
    background: ${(props) =>
        props.isAnimationAvailable ? 'transparent' : 'linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%)'};
`;

type FooterProps = {
    isAnimationAvailable: boolean;
};

const Footer: React.FC<FooterProps> = ({ isAnimationAvailable }) => (
    <Background isAnimationAvailable={isAnimationAvailable}>
        <MainWrapper>
            <VerticalWrapper>
                <FlexDiv>
                    <IconLink target="_blank" rel="noreferrer" href="https://github.com/thales-markets">
                        <StyledGithubIcon />
                    </IconLink>
                    <IconLink target="_blank" rel="noreferrer" href="https://twitter.com/ThalesMarket">
                        <StyledTwitterIcon />
                    </IconLink>
                    <IconLink target="_blank" rel="noreferrer" href="https://discord.com/invite/rB3AWKwACM">
                        <StyledDiscordIcon />
                    </IconLink>
                </FlexDiv>
                <FlexDiv style={{ marginBottom: 60 }}>
                    <Logo className="footer_logo" to={ROUTES.Home} />
                </FlexDiv>
            </VerticalWrapper>
        </MainWrapper>
    </Background>
);

export default Footer;
