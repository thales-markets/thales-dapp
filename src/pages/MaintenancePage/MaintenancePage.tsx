import { PoweredBy, SyntetixLogo, VerticalWrapper } from 'pages/Home/Footer/components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import synthetix from 'assets/images/synthetix.svg';
import image from 'assets/images/coming-soon-bg.png';
import { FlexDiv, FlexDivColumn, MainWrapper, Side } from 'theme/common';

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
        background: url('${image}') no-repeat;
        height: 100vh;
    `;

    const Section: React.FC = (props) => (
        <Background>
            <MainWrapper>{props.children}</MainWrapper>
        </Background>
    );

    const Text = styled.p`
        @media (max-width: 468px) {
            margin: 0 0 0.5em;
        }

        @media only screen and (max-width: 992px) {
            font-size: 60px;
        }
    `;

    return (
        <>
            <Section>
                <FlexDivColumn>
                    <HeroSection style={{ width: '100%', position: 'fixed', bottom: '10%' }}>
                        <Side>
                            <Text className="title">{t('maintenance-page.title')}</Text>
                        </Side>
                        <Side></Side>
                    </HeroSection>
                </FlexDivColumn>
                <VerticalWrapper style={{ position: 'fixed', bottom: 0 }}>
                    <PoweredBy>
                        Powered by
                        <SyntetixLogo src={synthetix}></SyntetixLogo>
                    </PoweredBy>
                </VerticalWrapper>
            </Section>
        </>
    );
};

export default MaintenancePage;
