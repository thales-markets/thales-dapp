import ROUTES from 'constants/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, FlexDiv, FlexDivColumn, Text } from 'theme/common';
import { navigateTo } from 'utils/routes';

const HeroSection: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Hero className="landing-hero">
            <Text className="title">{t('landing-page.title')}</Text>
            <Text className="text-m pale-grey" style={{ marginBottom: 120, marginTop: 50 }}>
                {t('landing-page.description')}
            </Text>
            <FlexDiv>
                <Button
                    id="use-app"
                    className="secondary"
                    style={{ marginRight: '20px' }}
                    onClick={() => navigateTo(ROUTES.Options.Home, false, false, 'show')}
                >
                    {t('landing-page.launch')}
                </Button>
                <Button
                    onClick={() => {
                        document.getElementById('thales')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="tertiary"
                >
                    {t('landing-page.who-is-thales')}
                </Button>
            </FlexDiv>
        </Hero>
    );
};

const Hero = styled(FlexDivColumn)`
    padding: 160px 140px;
    @media (max-width: 767px) {
        padding: 50px;
    }
    @media (max-width: 568px) {
        padding: 20px;
    }
`;

export default HeroSection;
