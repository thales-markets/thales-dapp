import React from 'react';
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
            <Banners />
            <GridLayout />
            <Integrations />
            <Blog />
            <FAQ />
            <Footer />
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

const Info = styled.div`
    width: 100%;
    color: ${(props) => props.theme.landingPage.textColor.primary};
    text-align: center;
    padding: 10px;
    font-size: 16px;
    background-color: ${(props) => props.theme.landingPage.background.secondary};
    box-shadow: 0px 0px 20px rgb(0 0 0 / 40%);
    z-index: 2;
    position: absolute;
    strong {
        font-weight: bold;
        cursor: pointer;
        margin-left: 0.2em;
        color: ${(props) => props.theme.landingPage.textColor.secondary};
    }
    a {
        display: contents;
        font-weight: bold;
        cursor: pointer;
        color: ${(props) => props.theme.landingPage.textColor.secondary};
    }
`;
