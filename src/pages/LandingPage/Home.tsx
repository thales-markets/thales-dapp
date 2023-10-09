import Loader from 'components/Loader';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import loadable from '@loadable/component';

const Banners = loadable(() => import('./components/Banners'));
const GridLayout = loadable(() => import('./components/GridLayout'));
const Integrations = loadable(() => import('./components/Integrations'));
const Blog = loadable(() => import('./components/Blog'));
const FAQ = loadable(() => import('./components/FAQ'));
const Footer = loadable(() => import('./components/Footer'));

const Home: React.FC = () => {
    return (
        <Background>
            <Suspense fallback={<Loader />}>
                <Banners />
                <GridLayout />
                <Integrations />
                <Blog />
                <FAQ />
                <Footer />
            </Suspense>
        </Background>
    );
};

export default Home;

export const Background = styled.div`
    width: 100%;
    font-size: 16px;

    @media (max-width: 1440px) {
        font-size: 14px;
    }

    background: ${(props) => props.theme.landingPage.background.primary};
`;
