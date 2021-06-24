import React from 'react';
import styled from 'styled-components';
import { CardsAbs, FlexDiv, Image, Text } from 'theme/common';
import thalesTheWhite from 'assets/images/who-is-thales.svg';
import { Trans, useTranslation } from 'react-i18next';

const Thales: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Wrapper>
            <ThalesTheWhite src={thalesTheWhite} />
            <CardThales>
                <Text className="text-l pale-grey" style={{ marginBottom: 50 }}>
                    {t('landing-page.who-is-thales')}
                </Text>
                <Text className="text-s pale-grey lh24">
                    <Trans i18nKey="landing-page.thales-is" components={{ bold: <strong /> }}></Trans>
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
        margin-bottom: 50px;
    }
    @media (max-width: 568px) {
        padding: 20px;
    }
`;

const ThalesTheWhite = styled(Image)`
    object-fit: contain;
    max-width: 515px;
    max-height: 515px;
    margin-right: 50px;
`;

const CardThales = styled(CardsAbs)`
    padding: 45px 35px 75px 70px;
    min-width: 500px;
    @media (max-width: 568px) {
        min-width: unset;
        padding: 25px 10px 35px 30px;
    }
`;

export default Thales;
