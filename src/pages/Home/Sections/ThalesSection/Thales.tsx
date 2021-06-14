import React from 'react';
import styled from 'styled-components';
import { CardsAbs, FlexDiv, Image, Text } from 'theme/common';
import thalesTheWhite from 'assets/images/who-is-thales.svg';
import { useTranslation } from 'react-i18next';

const Thales: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Wrapper>
            <ThalesTheWhite src={thalesTheWhite} />
            <CardThales>
                <Text className="text-xxl pale-grey" style={{ marginBottom: 50 }}>
                    {t('landing-page.who-is-thales')}
                </Text>
                <Text style={{ backdropFilter: 'blur(10px)' }} className="text-s pale-grey lh24">
                    {t('landing-page.thales-is')}
                </Text>
            </CardThales>
        </Wrapper>
    );
};

const Wrapper = styled(FlexDiv)`
    padding: 70px 140px;
    justify-content: center;
    @media (max-width: 1280px) {
        flex-direction: column;
        padding: 50px;
        img {
            margin: auto;
            margin-bottom: 50px;
        }
    }
`;

const ThalesTheWhite = styled(Image)`
    object-fit: contain;
    width: 515px;
    height: 515px;
    margin-right: 50px;
`;

const CardThales = styled(CardsAbs)`
    padding: 45px 35px 75px 70px;
    min-width: 500px;
`;

export default Thales;
