import React, { useEffect, useState } from 'react';
import Header from 'components/Header';
import { Button, FlexDiv, FlexDivColumn, Section, Side, Text, Image } from 'theme/common';
import { useTranslation } from 'react-i18next';
import Footer from './Footer/Footer';
import { navigateTo } from 'utils/routes';
import ROUTES from 'constants/routes';
import styled from 'styled-components';
import market from 'assets/images/market.png';
import thalesTheWhite from 'assets/images/who-is-thales.svg';
import coins from 'assets/images/coins-thales.png';
import scale from 'assets/images/weight-scale-gradient.png';
import first from 'assets/images/1.svg';
import second from 'assets/images/2.svg';
import third from 'assets/images/3.svg';
import eclipse from 'assets/images/eclipse.svg';
import eclipseSelected from 'assets/images/eclipse-selected.svg';
import { removeThreeJS, setupThreeJS } from './Three';
import synthetix from 'assets/images/synthetix.svg';
import zeroX from 'assets/images/0x.svg';
import chainlink from 'assets/images/chainlink.svg';
import plus from 'assets/images/plus.svg';
import minus from 'assets/images/minus.svg';
import faq from 'assets/images/faq.svg';
import { SyntetixLogo } from './Footer/components';

enum CAROUSEL_SELECTED {
    'NONE',
    'FIRST',
    'SECOND',
    'LAST',
}

const Home: React.FC = () => {
    const { t } = useTranslation();
    const [carousel, setCarousel] = useState(CAROUSEL_SELECTED.NONE);
    const [q1open, setQ1open] = useState(false);
    const [q2open, setQ2open] = useState(false);
    const [q3open, setQ3open] = useState(false);

    const scrollListener = () => {
        const currentPosition = window.innerHeight + scrollY;

        const parent = document.getElementById('get-started')?.offsetTop;

        const first = document.getElementById('first-eclipse')?.offsetTop;
        const second = document.getElementById('second-eclipse')?.offsetTop;
        const third = document.getElementById('third-eclipse')?.offsetTop;
        if (parent !== undefined && first !== undefined && second !== undefined && third !== undefined) {
            if (currentPosition > parent + third + 600) {
                setCarousel(CAROUSEL_SELECTED.LAST);
            } else if (currentPosition > parent + second + 500 && currentPosition <= parent + third + 600) {
                setCarousel(CAROUSEL_SELECTED.SECOND);
            } else if (currentPosition <= parent + second + 500 && currentPosition > parent + first + 400) {
                setCarousel(CAROUSEL_SELECTED.FIRST);
            } else {
                setCarousel(CAROUSEL_SELECTED.NONE);
            }
        }
    };

    useEffect(() => {
        setupThreeJS();
        window.addEventListener('scroll', scrollListener);
        return () => {
            window.removeEventListener('scroll', scrollListener);
            removeThreeJS();
        };
    }, []);

    return (
        <>
            <Section id="landing-hero" class="hero">
                <FlexDivColumn>
                    <Header />
                    <HeroSection className="landing-hero">
                        <Text className="title">{t('landing-page.title')}</Text>
                        <Text className="text-m pale-grey" style={{ marginBottom: 120, marginTop: 50 }}>
                            {t('landing-page.description')}
                        </Text>
                        <FlexDiv>
                            <Button
                                id="use-app"
                                className="secondary"
                                style={{ marginRight: '20px' }}
                                onClick={() => navigateTo(ROUTES.Options.Home)}
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
                    </HeroSection>
                </FlexDivColumn>
            </Section>
            <Section id="cards">
                <Cards>
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
                </Cards>
                <Cards>
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
                </Cards>
            </Section>
            <Section id="partners">
                <FlexDivColumn style={{ alignItems: 'center', marginTop: 50 }}>
                    <Text className="text-l pale-grey">{t('landing-page.partners.seed')}</Text>
                    <Partners style={{ width: 480, padding: '50px 30px' }}>
                        <SyntetixLogo style={{ width: 'auto', height: 30 }} src={synthetix}></SyntetixLogo>
                    </Partners>
                    <Text className="text-l pale-grey" style={{ marginTop: 40, marginBottom: 70 }}>
                        {t('landing-page.partners.technical')}
                    </Text>
                    <FlexDiv>
                        <Partners style={{ maxWidth: 265, marginTop: 0, marginBottom: 90 }}>
                            <Image style={{ width: 'auto', height: 50 }} src={zeroX}></Image>
                        </Partners>
                        <Partners style={{ maxWidth: 265, marginTop: 0, marginBottom: 90 }}>
                            <Image style={{ width: 'auto', height: 50 }} src={chainlink}></Image>
                        </Partners>
                    </FlexDiv>
                </FlexDivColumn>
            </Section>
            <Section id="get-started">
                <FlexDivColumn>
                    <Text className="pale-grey text-l" style={{ marginBottom: 35, marginLeft: -30 }}>
                        {t('landing-page.get-started.title')}
                    </Text>
                    <GetStarted className={carousel !== CAROUSEL_SELECTED.NONE ? 'animate' : ''}>
                        <Carousel>
                            <Eclipse
                                id="first-eclipse"
                                src={carousel !== CAROUSEL_SELECTED.NONE ? eclipseSelected : eclipse}
                                style={{ width: 20, height: 20 }}
                            ></Eclipse>
                            <Eclipse
                                id="second-eclipse"
                                src={
                                    carousel === CAROUSEL_SELECTED.SECOND || carousel === CAROUSEL_SELECTED.LAST
                                        ? eclipseSelected
                                        : eclipse
                                }
                                style={{ width: 20, height: 20 }}
                            ></Eclipse>
                            <Eclipse
                                id="third-eclipse"
                                src={carousel === CAROUSEL_SELECTED.LAST ? eclipseSelected : eclipse}
                                style={{ width: 20, height: 20 }}
                            ></Eclipse>
                        </Carousel>
                        <CardsSmall className="animate-l">
                            <Image src={first} style={{ width: 30, margin: 20 }}></Image>
                            <Text className="pale-grey text-s lh24 ls25">{t('landing-page.get-started.first')}</Text>
                        </CardsSmall>
                        <Image className="animate-r" src={market} style={{ width: 250, height: 200 }}></Image>
                    </GetStarted>
                    <GetStarted
                        className={
                            carousel === CAROUSEL_SELECTED.SECOND || carousel === CAROUSEL_SELECTED.LAST
                                ? 'animate'
                                : ''
                        }
                    >
                        <Image className="animate-l" src={market} style={{ width: 250, height: 200 }}></Image>
                        <CardsSmall className="animate-r">
                            <Image src={second} style={{ width: 30, margin: 20 }}></Image>
                            <Text className="pale-grey text-s lh24 ls25">{t('landing-page.get-started.second')}</Text>
                        </CardsSmall>
                    </GetStarted>
                    <GetStarted className={carousel === CAROUSEL_SELECTED.LAST ? 'animate' : ''}>
                        <CardsSmall className="animate-l">
                            <Image src={third} style={{ width: 30, margin: 20 }}></Image>
                            <Text className="pale-grey text-s lh24 ls25">{t('landing-page.get-started.third')}</Text>
                        </CardsSmall>
                        <Image className="animate-r" src={market} style={{ width: 250, height: 200 }}></Image>
                    </GetStarted>
                </FlexDivColumn>
            </Section>
            <Section id="thales">
                <Side>
                    <ThalesTheWhite src={thalesTheWhite} />
                </Side>
                <Side>
                    <CardThales>
                        <Text className="text-xxl pale-grey" style={{ marginBottom: 50 }}>
                            {t('landing-page.who-is-thales')}
                        </Text>
                        <Text style={{ backdropFilter: 'blur(10px)' }} className="text-s pale-grey lh24">
                            {t('landing-page.thales-is')}
                        </Text>
                    </CardThales>
                </Side>
            </Section>
            <Section id="faq">
                <CardFaq>
                    <Text className="text-xxl pale-grey">{t('landing-page.faq.title')}</Text>
                    <DropDownWrapper className={q1open ? 'open' : ''}>
                        <Question>
                            <Text className="text-m pale-grey">{t('landing-page.faq.firstQ')}</Text>
                            <Image src={q1open ? minus : plus} onClick={() => setQ1open(!q1open)}></Image>
                        </Question>
                        <Answer className="text-s pale-grey lh24 ls25">{t('landing-page.faq.firstA')}</Answer>
                    </DropDownWrapper>
                    <DropDownWrapper className={q2open ? 'open' : ''}>
                        <Question>
                            <Text className="text-m pale-grey">{t('landing-page.faq.secondQ')}</Text>
                            <Image src={q2open ? minus : plus} onClick={() => setQ2open(!q2open)}></Image>
                        </Question>
                        <Answer className="text-s pale-grey lh24 ls25">{t('landing-page.faq.secondA')}</Answer>
                    </DropDownWrapper>
                    <DropDownWrapper className={q3open ? 'open' : ''}>
                        <Question>
                            <Text className="text-m pale-grey lh24 ls25">{t('landing-page.faq.thirdQ')}</Text>
                            <Image src={q3open ? minus : plus} onClick={() => setQ3open(!q3open)}></Image>
                        </Question>
                        <Answer className="text-s pale-grey lh24 ls25">{t('landing-page.faq.thirdA')}</Answer>
                    </DropDownWrapper>
                </CardFaq>
                <FaqImg src={faq} />
            </Section>
            <Footer></Footer>
        </>
    );
};

const HeroSection = styled(FlexDivColumn)`
    padding: 160px 100px;
`;

const CardsAbs = styled(FlexDivColumn)`
    background: linear-gradient(148.33deg, rgba(255, 255, 255, 0.03) -2.8%, rgba(255, 255, 255, 0.01) 106.83%);
    box-shadow: 0px 25px 30px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 23px;
    border: 2px solid rgb(106, 193, 213, 0.4);
    border-left: 2px solid rgba(202, 145, 220, 0.6);
    border-top: 2px solid rgba(202, 145, 220, 0.6);
    border-right: 2px solid rgba(106, 193, 213, 0.6);
    border-bottom: 2px solid rgba(106, 193, 213, 0.6);
`;

const Cards = styled(CardsAbs)`
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

const Partners = styled(CardsAbs)`
    padding: 30px;
    margin: 50px;
    min-width: 220px;
    align-items: center;
`;

const GetStarted = styled(FlexDiv)`
    position: relative;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
    .animate-l {
        transform: translateX(-200px);
        opacity: 0;
        transition: all 1s;
    }
    .animate-r {
        transform: translateX(200px);
        opacity: 0;
        transition: all 1s;
    }
    &.animate {
        .animate-l {
            transform: translateX(0);
            opacity: 1;
        }
        .animate-r {
            transform: translateX(0);
            opacity: 1;
        }
    }
    &:last-child {
        margin-bottom: 50px;
    }
`;

const CardsSmall = styled(CardsAbs)`
    height: 135px;
    padding: 4px;
    flex-direction: row;
    max-width: 350px;
    align-items: center;
`;

const CardThales = styled(CardsAbs)`
    padding: 45px 35px 75px 70px;
    min-width: 500px;
`;

const CardFaq = styled(CardsAbs)`
    margin: 65px 0 200px 70px;
    padding: 45px 30px 45px 75px;
    min-width: min(850px, 100%);
`;

const DropDownWrapper = styled(FlexDivColumn)`
    margin-top: 12px;
    padding: 20px 0;
    &:not(:last-child) {
        border-bottom: 1.5px dashed #00f9ff;
    }
    &.open {
        & > p {
            position: relative;
            opacity: 1;
            transition: opacity 1s;
        }
    }
`;

const Question = styled(FlexDiv)`
    justify-content: space-between;
    align-items: center;
    img {
        cursor: pointer;
        width: 20px;
        height: 20px;
    }
`;
const Answer = styled(Text)`
    opacity: 0;
    position: absolute;
    pointer-events: none;
    margin-top: 10px;
    white-space: break-spaces;
`;

const ThalesTheWhite = styled(Image)`
    object-fit: contain;
    max-height: 500px;
    min-height: 400px;
    min-width: 300px;
`;

const FaqImg = styled(Image)`
    height: 600px;
    margin-right: -80px;
    margin-bottom: 100px;
`;

const Carousel = styled(FlexDivColumn)`
    width: 5px;
    background-color: #b8c6e5;
    height: 480px;
    position: absolute;
    top: 120px;
    left: 0;
    right: 0;
    margin: auto;
    justify-content: space-between;
    align-items: center;
`;

const Eclipse = styled(Image)`
    width: 20px;
    height: 20px;
`;

export default Home;
