import React, { useEffect, useState } from 'react';
import Header from 'components/Header';
import { FlexDivColumn, Section } from 'theme/common';
import Footer from './Footer/Footer';
import { removeThreeJS, setupThreeJS } from './Three';
import Cards from './Sections/Cards';
import HeroSection from './Sections/HeroSection';
import Partners from './Sections/Partners';
import Thales from './Sections/ThalesSection';
import GetStarted from './Sections/GetStarted';
import Faq from './Sections/Faq';
import { WebGLRenderer } from 'three';

const Home: React.FC = () => {
    const [isAnimationAvailable, setIsAnimationAvailable] = useState(true);

    useEffect(() => {
        let renderer: WebGLRenderer | null = null;
        try {
            renderer = new WebGLRenderer();
            if (renderer !== null) {
                setupThreeJS(renderer);
            }
        } catch {
            setIsAnimationAvailable(false);
            console.log('Animation not available');
        }

        return () => {
            if (renderer !== null) {
                removeThreeJS(renderer);
            }
        };
    }, []);

    return (
        <>
            <Section id="landing-hero" class={isAnimationAvailable ? 'hero hide-background' : 'hero'}>
                <FlexDivColumn>
                    <Header isAnimationAvailable={isAnimationAvailable} />
                    <HeroSection />
                </FlexDivColumn>
            </Section>
            <Section id="cards" class={isAnimationAvailable ? 'hide-background' : ''}>
                <Cards />
            </Section>
            <Section id="partners" class={isAnimationAvailable ? 'hide-background' : ''}>
                <Partners />
            </Section>
            <Section id="get-started" class={isAnimationAvailable ? 'hide-background' : ''}>
                <GetStarted />
            </Section>
            <Section id="thales" class={isAnimationAvailable ? 'hide-background' : ''}>
                <Thales />
            </Section>
            <Section id="faq" class={isAnimationAvailable ? 'hide-background' : ''}>
                <Faq />
            </Section>
            <Footer isAnimationAvailable={isAnimationAvailable}></Footer>
        </>
    );
};

export default Home;
