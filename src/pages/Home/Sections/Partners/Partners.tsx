import { SyntetixLogo } from 'pages/Home/Footer/components';
import React from 'react';
import { CardsAbs, FlexDiv, FlexDivColumn, Image, Text, IconLink } from 'theme/common';
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
            <IconLink target="_blank" rel="noreferrer" href="https://synthetix.io/">
                <Partner>
                    <SyntetixLogo className="snx-logo" src={synthetix}></SyntetixLogo>
                </Partner>
            </IconLink>

            <Text className="text-l pale-grey" style={{ marginTop: 40, marginBottom: 70 }}>
                {t('landing-page.partners.technical')}
            </Text>
            <TechPartners>
                <IconLink target="_blank" rel="noreferrer" href="https://0x.org/">
                    <Partner style={{ maxWidth: 265, marginTop: 0, marginBottom: 90 }}>
                        <Image style={{ width: 'auto', height: 50 }} src={zeroX}></Image>
                    </Partner>
                </IconLink>
                <IconLink target="_blank" rel="noreferrer" href="https://chain.link/">
                    <Partner style={{ maxWidth: 265, marginTop: 0, marginBottom: 90 }}>
                        <Image style={{ width: 'auto', height: 50 }} src={chainlink}></Image>
                    </Partner>
                </IconLink>
            </TechPartners>
        </FlexDivColumn>
    );
};

const Partner = styled(CardsAbs)`
    padding: 30px;
    margin: 50px;
    min-width: 220px;
    align-items: center;
    .snx-logo {
        height: 30px;
        width: auto;
        padding: 20px 0;
        box-sizing: content-box;
        @media (max-width: 520px) {
            height: 24px;
            padding: 6px 0;
        }
        @media (max-width: 420px) {
            height: 20px;
            padding: 0;
        }
    }
`;

const TechPartners = styled(FlexDiv)`
    @media (max-width: 620px) {
        flex-direction: column;
    }
`;

export default Partners;
