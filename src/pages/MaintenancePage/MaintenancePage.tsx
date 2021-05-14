import { FooterIcon, PoweredBy, SyntetixLogo, VerticalWrapper } from 'pages/Home/Footer/components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import github from 'assets/images/github.svg';
import twitter from 'assets/images/twitter.svg';
import discord from 'assets/images/discord.svg';
import synthetix from 'assets/images/synthetix.svg';
import logo from 'assets/images/logo.svg';
import { FlexDiv, FlexDivColumn, FlexDivColumnCentered, Image, MainWrapper, Section, Text } from 'theme/common';

const MaintenancePage: React.FC = () => {
    const { t } = useTranslation();
    const HeroSection = styled(FlexDiv)`
        @media (max-width: 768px) {
            flex-direction: column;
            width: 100%;
        }
    `;

    const Background = styled.section`
        background-size: cover !important;
        background-image: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
    `;

    const Logo = styled(Image)`
        width: 60px;
        margin: 0 auto;
        padding-bottom: 20px;
    `;

    return (
        <>
            <Section>
                <FlexDivColumn>
                    <HeroSection>
                        <FlexDivColumnCentered style={{ paddingTop: '130px', paddingBottom: '130px' }}>
                            <Logo src={logo}></Logo>
                            <Text className="title" style={{ textAlign: 'center' }}>
                                {t('maintenance-page.title')}
                            </Text>
                        </FlexDivColumnCentered>
                    </HeroSection>
                </FlexDivColumn>
            </Section>
            <Background>
                <MainWrapper>
                    <VerticalWrapper>
                        <FlexDiv>
                            <FooterIcon src={github}></FooterIcon>
                            <FooterIcon src={twitter}></FooterIcon>
                            <FooterIcon src={discord}></FooterIcon>
                        </FlexDiv>
                        <PoweredBy>
                            Powered by
                            <SyntetixLogo src={synthetix}></SyntetixLogo>
                        </PoweredBy>
                    </VerticalWrapper>
                </MainWrapper>
            </Background>
        </>
    );
};

export default MaintenancePage;
