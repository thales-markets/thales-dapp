import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CardsAbs, FlexDiv, FlexDivColumn, Image, Text } from 'theme/common';
import first from 'assets/images/1.svg';
import second from 'assets/images/2.svg';
import third from 'assets/images/3.svg';
import eclipse from 'assets/images/eclipse.svg';
import eclipseSelected from 'assets/images/eclipse-selected.svg';
import image1 from 'assets/images/how-it-works1.svg';
import image2 from 'assets/images/how-it-works2.svg';
import image3 from 'assets/images/how-it-works3.svg';
import { useTranslation } from 'react-i18next';

enum CAROUSEL_SELECTED {
    'NONE',
    'FIRST',
    'SECOND',
    'LAST',
}

const GetStarted: React.FC = () => {
    const { t } = useTranslation();
    const [carousel, setCarousel] = useState(CAROUSEL_SELECTED.NONE);

    const scrollListener = () => {
        if (carousel === CAROUSEL_SELECTED.LAST) {
            return;
        }
        const currentPosition = window.innerHeight + scrollY;

        const parent = document.getElementById('get-started')?.offsetTop;

        const first = document.getElementById('first-eclipse')?.offsetTop;
        const second = document.getElementById('second-eclipse')?.offsetTop;
        const third = document.getElementById('third-eclipse')?.offsetTop;
        if (parent !== undefined && first !== undefined && second !== undefined && third !== undefined) {
            if (currentPosition > parent + third + 600) {
                setCarousel(CAROUSEL_SELECTED.LAST);
                window.removeEventListener('scroll', scrollListener);
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
        window.addEventListener('scroll', scrollListener);
        return () => {
            window.removeEventListener('scroll', scrollListener);
        };
    }, []);

    return (
        <GetStartedWrapper>
            <Title className="pale-grey text-l">{t('landing-page.get-started.title')}</Title>
            <Wrapper className={carousel !== CAROUSEL_SELECTED.NONE ? 'animate' : ''}>
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
                    <Image src={first} style={{ width: 33, height: 92, marginRight: 32 }}></Image>
                    <Text className="pale-grey text-s lh24 ls25">{t('landing-page.get-started.first')}</Text>
                </CardsSmall>
                <Image className="animate-r" src={image1} style={{ width: 250, height: 200 }}></Image>
            </Wrapper>
            <Wrapper
                className={
                    carousel === CAROUSEL_SELECTED.SECOND || carousel === CAROUSEL_SELECTED.LAST ? 'animate' : ''
                }
            >
                <Image className="animate-l" src={image2} style={{ width: 250, height: 200 }}></Image>
                <CardsSmall className="animate-r">
                    <Image src={second} style={{ width: 30, height: 92, marginRight: 32 }}></Image>
                    <Text className="pale-grey text-s lh24 ls25">{t('landing-page.get-started.second')}</Text>
                </CardsSmall>
            </Wrapper>
            <Wrapper className={carousel === CAROUSEL_SELECTED.LAST ? 'animate' : ''}>
                <CardsSmall className="animate-l">
                    <Image src={third} style={{ width: 30, height: 92, marginRight: 32 }}></Image>
                    <Text className="pale-grey text-s lh24 ls25">{t('landing-page.get-started.third')}</Text>
                </CardsSmall>
                <Image className="animate-r" src={image3} style={{ width: 250, height: 200 }}></Image>
            </Wrapper>
        </GetStartedWrapper>
    );
};

const GetStartedWrapper = styled(FlexDivColumn)`
    padding: 70px 140px;
    max-width: 1200px;
    @media (max-width: 1100px) {
        padding: 50px;
        max-width: 980px;
    }
`;

const Title = styled(Text)`
    margin: auto;
    margin-bottom: 35px !important;
`;

const Wrapper = styled(FlexDiv)`
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

    img.animate-r {
        margin-right: 50px;
    }

    img.animate-l {
        margin-left: 50px;
    }

    @media (max-width: 890px) {
        & > img {
            display: none !important;
        }
    }
`;

const CardsSmall = styled(CardsAbs)`
    height: 134px;
    padding: 20px 35px;
    flex-direction: row;
    max-width: 350px;
    align-items: center;
    @media (max-width: 890px) {
        margin: auto !important;
    }
`;

const Carousel = styled(FlexDivColumn)`
    @media (max-width: 890px) {
        display: none;
    }
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

export default GetStarted;
