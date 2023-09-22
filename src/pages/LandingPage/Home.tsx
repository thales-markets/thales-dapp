import Loader from 'components/Loader';
import React, { Suspense } from 'react';
import styled from 'styled-components';

const Banners = React.lazy(() => import('./components/Banners'));
const GridLayout = React.lazy(() => import('./components/GridLayout'));
const Integrations = React.lazy(() => import('./components/Integrations'));
const Blog = React.lazy(() => import('./components/Blog'));
const FAQ = React.lazy(() => import('./components/FAQ'));
const Footer = React.lazy(() => import('./components/Footer'));

const Home: React.FC = () => {
    return (
        <Background>
            <Suspense fallback={<Loader />}>
                <Banners />
            </Suspense>
            <Suspense fallback={<Loader />}>
                <GridLayout />
            </Suspense>
            <Suspense fallback={<Loader />}>
                <Integrations />
            </Suspense>
            <Suspense fallback={<Loader />}>
                <Blog />
            </Suspense>
            <Suspense fallback={<Loader />}>
                <FAQ />
            </Suspense>
            <Suspense fallback={<Loader />}>
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
