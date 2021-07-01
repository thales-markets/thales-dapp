import React from 'react';
import { Image } from 'theme/common';
import coin from 'assets/images/thales-coin.gif';
import styled from 'styled-components';

const Loader: React.FC = () => {
    return (
        <Gif>
            <Image src={coin}></Image>
        </Gif>
    );
};

const Gif = styled.div`
    position: fixed;
    height: 100%;
    width: 100%;
    background: #04045a;
`;

export default Loader;
