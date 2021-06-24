import { PoweredBy, SyntetixLogo, VerticalWrapper } from 'pages/Home/Footer/components';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlexDivColumn } from 'theme/common';
import { HeroSection, Section, Text, HeaderWrapper, ThalesLogo, Logo, Side } from './components';
import synthetix from 'assets/images/synthetix.svg';
import bigLogo from 'assets/images/thales-logo.svg';
import smallLogo from 'assets/images/small-logo.svg';
import dotenv from 'dotenv';

dotenv.config();

const MaintenancePage: React.FC = () => {
    const { t } = useTranslation();

    // if (process.env.REACT_APP_MAINTENANCE_MODE === 'true') {
    //     require('theme/flashlight.css');
    // }

    useEffect(() => {
        document.addEventListener('mousemove', update);
        document.addEventListener('touchmove', update);
    });

    function update(e: any) {
        let x = e.clientX || (e.touches && e.touches[0].clientX);
        let y = e.clientY || (e.touches && e.touches[0].clientY);

        if (x === undefined) x = 0;
        if (y === undefined) y = 0;

        document.documentElement.style.setProperty('--cursorX', x + 'px');
        document.documentElement.style.setProperty('--cursorY', y + 'px');
    }

    return (
        <>
            <Section>
                <FlexDivColumn>
                    <HeaderWrapper>
                        <ThalesLogo src={bigLogo}></ThalesLogo>
                    </HeaderWrapper>
                    <HeroSection>
                        <Side>
                            <Logo src={smallLogo}></Logo>
                            <Text className="title">{t('maintenance-page.title')}</Text>
                        </Side>
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
