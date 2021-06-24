import React from 'react';
import { FlexDivColumn, Image, Text, CardsAbs, FlexDiv } from 'theme/common';
import coins from 'assets/images/coins-thales.png';
import scale from 'assets/images/weight-scale-gradient.svg';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Cards: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Wrapper>
            <Card className="first">
                <Image src={coins} style={{ height: 200, width: 200, margin: 'auto' }}></Image>
                <TextWrapper>
                    <Text className="pale-grey text-l">{t('landing-page.markets.title')}</Text>.
                    <Text className="pale-grey text-s lh24" style={{ marginBottom: 30 }}>
                        {t('landing-page.markets.option1')}
                    </Text>
                    <Text className="pale-grey text-s lh24" style={{ marginBottom: 30 }}>
                        {t('landing-page.markets.option2')}
                    </Text>
                    <Text className="pale-grey texts lh24">{t('landing-page.markets.option3')}</Text>
                </TextWrapper>
            </Card>
            <Card className="second">
                <Image src={scale} style={{ height: 200, width: 200, margin: 'auto' }}></Image>
                <TextWrapper>
                    <Text className="pale-grey text-l">{t('landing-page.options.title')}</Text>.
                    <Text className="pale-grey text-s lh24" style={{ marginBottom: 30 }}>
                        {t('landing-page.options.option1')}
                    </Text>
                    <Text className="pale-grey text-s lh24" style={{ marginBottom: 30 }}>
                        {t('landing-page.options.option2')}
                    </Text>
                    <Text className="pale-grey texts lh24">{t('landing-page.options.option3')}</Text>
                </TextWrapper>
            </Card>
        </Wrapper>
    );
};

const Wrapper = styled(FlexDiv)`
    padding: 70px 120px;
    .first {
        margin-right: 50px;
    }
    .second {
        margin-left: 50px;
    }
    @media (max-width: 1280px) {
        flex-direction: column;
        padding: 50px;
        margin-bottom: 50px;
        .first,
        .second {
            margin: 0;
        }
        .first {
            margin-bottom: 70px;
        }
    }
    @media (max-width: 568px) {
        padding: 20px;
    }
`;

const TextWrapper = styled(FlexDivColumn)`
    padding-left: 70px;
    padding-right: 24px;
    @media (max-width: 620px) {
        padding-left: 30px;
    }
`;

const Card = styled(CardsAbs)`
    min-height: 600px;
    min-width: 550px;
    max-width: 550px;
    @media (max-width: 620px) {
        min-width: unset;
    }
`;

export default Cards;
