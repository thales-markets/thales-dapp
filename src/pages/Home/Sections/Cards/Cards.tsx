import React from 'react';
import { Button, FlexDivColumn, Image, Text, CardsAbs } from 'theme/common';
import coins from 'assets/images/coins-thales.png';
import scale from 'assets/images/weight-scale-gradient.png';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Cards: React.FC = () => {
    const { t } = useTranslation();
    return (
        <>
            <Card>
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
            <Card>
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
        </>
    );
};

const Card = styled(CardsAbs)`
    min-height: 600px;
    min-width: 550px;
    max-width: 550px;
    &:first-child {
        margin: 50px 50px 90px 120px;
    }
    &:nth-child(2) {
        margin: 50px 120px 90px 50px;
    }
`;

export default Cards;
