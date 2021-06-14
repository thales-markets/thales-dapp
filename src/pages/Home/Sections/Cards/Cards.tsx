import React from 'react';
import { Button, FlexDivColumn, Image, Text, CardsAbs, FlexDiv } from 'theme/common';
import coins from 'assets/images/coins-thales.png';
import scale from 'assets/images/weight-scale-gradient.png';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Cards: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Wrapper>
            <Card className="first">
                <Image src={coins} style={{ height: 200, width: 200, margin: '10px auto' }}></Image>
                <FlexDivColumn style={{ paddingLeft: 70, paddingRight: 24 }}>
                    <Text className="pale-grey text-l">{t('landing-page.markets.title')}</Text>.
                    <Text className="pale-grey text-s lh24" style={{ marginBottom: 30 }}>
                        {t('landing-page.markets.option1')}
                    </Text>
                    <Text className="pale-grey text-s lh24" style={{ marginBottom: 30 }}>
                        {t('landing-page.markets.option2')}
                    </Text>
                    <Text className="pale-grey texts lh24">{t('landing-page.markets.option3')}</Text>
                </FlexDivColumn>
                <Button className="primary" style={{ margin: '50px auto' }}>
                    {t('landing-page.markets.view-markets')}
                </Button>
            </Card>
            <Card className="second">
                <Image src={scale} style={{ height: 200, width: 200, margin: 'auto' }}></Image>
                <FlexDivColumn style={{ paddingLeft: 70, paddingRight: 24 }}>
                    <Text className="pale-grey text-l">{t('landing-page.options.title')}</Text>.
                    <Text className="pale-grey text-s lh24" style={{ marginBottom: 30 }}>
                        {t('landing-page.options.option1')}
                    </Text>
                    <Text className="pale-grey text-s lh24" style={{ marginBottom: 30 }}>
                        {t('landing-page.options.option2')}
                    </Text>
                    <Text className="pale-grey texts lh24">{t('landing-page.options.option3')}</Text>
                </FlexDivColumn>
                <Button className="primary" style={{ margin: 'auto', marginBottom: '50px' }}>
                    {t('landing-page.options.view-markets')}
                </Button>
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
        .first,
        .second {
            margin: 0;
        }
        .first {
            margin-bottom: 70px;
        }
    }
`;

const Card = styled(CardsAbs)`
    min-height: 600px;
    min-width: 550px;
    max-width: 550px;
`;

export default Cards;
