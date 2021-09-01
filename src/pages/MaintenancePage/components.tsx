import styled from 'styled-components';
import image from 'assets/images/coming-soon-bg.png';
import { FlexDiv, FlexDivColumnCentered, MainWrapper } from 'theme/common';
import React from 'react';

export const HeroSection = styled(FlexDiv)`
    width: 50%;
    position: fixed;
    bottom: 10%;
    @media (max-width: 767px) {
        position: relative;
        width: 100%;
    }
`;

export const Background = styled.section`
    background-size: cover !important;
    background: url(${image}) no-repeat;
    min-height: 100vh;
`;

export const Section: React.FC = (props) => (
    <Background>
        <MainWrapper>{props.children}</MainWrapper>
    </Background>
);

export const Text = styled.p`
    font-family: 'Titillium Web' !important;
    @media (max-width: 995px) {
        font-size: 50px;
        line-height: 50px;
    }
`;

export const HeaderWrapper = styled.div`
    padding: 0 75px;
    width: 100%;
    display: flex;
    height: 100px;
    align-items: center;
    @media (max-width: 767px) {
        padding: 0 50px;
    }
    @media (max-width: 468px) {
        padding: 0 30px;
    }
`;

export const ThalesLogo = styled.img`
    height: 50px;
    position: relative;
    top: 2px;
    @media (max-width: 468px) {
        width: 160px;
        top: 4px;
        margin-left: 6px;
    }
`;

export const Logo = styled.img`
    height: 82px;
`;

export const Side = styled(FlexDivColumnCentered)`
    flex: 1;
    padding-bottom: 80px;
    padding-left: 120px;
    @media (max-width: 767px) {
        padding: 40px !important;
    }
    @media (max-width: 468px) {
        padding: 30px !important;
    }
`;
