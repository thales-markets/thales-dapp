import React, { useEffect } from 'react';
import Header from 'components/Header';
import { FlexDivColumn, Section } from 'theme/common';
import Footer from './Footer/Footer';

import { removeThreeJS, setupThreeJS } from './Three';

import Cards from './Sections/Cards';
import HeroSection from './Sections/HeroSection';
import Partners from './Sections/Partners';
import Thales from './Sections/ThalesSection';

const Home: React.FC = () => {
    useEffect(() => {
        setupThreeJS();
        return () => {
            removeThreeJS();
        };
    }, []);

    return (
        <>
            <Section id="landing-hero" class="hero">
                <FlexDivColumn>
                    <Header />
                    <HeroSection />
                </FlexDivColumn>
            </Section>
            <Section id="cards">
                <Cards />
            </Section>
            <Section id="partners">
                <Partners />
            </Section>
            <Section id="get-started"></Section>
            <Section id="thales">
                <Thales />
            </Section>
            <Section id="faq"></Section>
            <Footer></Footer>
        </>
    );
};

export default Home;
