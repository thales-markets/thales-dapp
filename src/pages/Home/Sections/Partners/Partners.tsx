import { SyntetixLogo } from 'pages/Home/Footer/components';
import React from 'react';
import { CardsAbs, FlexDiv, FlexDivColumn, Image, Text } from 'theme/common';
import synthetix from 'assets/images/synthetix.svg';
import zeroX from 'assets/images/0x.svg';
import chainlink from 'assets/images/chainlink.svg';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Partners: React.FC = () => {
    const { t } = useTranslation();

    return (
        <FlexDivColumn style={{ alignItems: 'center', marginTop: 50 }}>
            <Text className="text-l pale-grey">{t('landing-page.partners.seed')}</Text>
            <Partner style={{ width: 480, padding: '50px 30px' }}>
                <SyntetixLogo style={{ width: 'auto', height: 30 }} src={synthetix}></SyntetixLogo>
            </Partner>
            <Text className="text-l pale-grey" style={{ marginTop: 40, marginBottom: 70 }}>
                {t('landing-page.partners.technical')}
            </Text>
            <FlexDiv>
                <Partner style={{ maxWidth: 265, marginTop: 0, marginBottom: 90 }}>
                    <Image style={{ width: 'auto', height: 50 }} src={zeroX}></Image>
                </Partner>
                <Partner style={{ maxWidth: 265, marginTop: 0, marginBottom: 90 }}>
                    <Image style={{ width: 'auto', height: 50 }} src={chainlink}></Image>
                </Partner>
            </FlexDiv>
        </FlexDivColumn>
    );
};

const Partner = styled(CardsAbs)`
    padding: 30px;
    margin: 50px;
    min-width: 220px;
    align-items: center;
`;

export default Partners;
