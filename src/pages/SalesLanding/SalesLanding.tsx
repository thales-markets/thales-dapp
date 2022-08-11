import Header from 'pages/LandingPage/components/Header/Header';
import { Theme } from 'pages/LandingPage/Home';
import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import { Background, Wrapper } from './styled-components';

const cookies = new Cookies();

const SalesLanding: React.FC = () => {
    const [theme, setTheme] = useState(Number(cookies.get('home-theme')) === 0 ? Theme.Light : Theme.Dark);

    return (
        <Background className={theme === Theme.Light ? 'light' : 'dark'}>
            <Wrapper>
                <Header theme={theme} setTheme={setTheme} />
            </Wrapper>
        </Background>
    );
};

export default SalesLanding;
