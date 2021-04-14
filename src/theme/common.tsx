import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logo from 'assets/images/logo.svg';
import React from 'react';

export const FlexDiv = styled.div`
    display: flex;
`;

export const FlexDivCentered = styled(FlexDiv)`
    align-items: center;
    justify-content: center;
`;

export const FlexDivColumn = styled(FlexDiv)`
    flex: 1;
    flex-direction: column;
`;

export const FlexDivColumnCentered = styled(FlexDivColumn)`
    justify-content: center;
`;

const Background = styled.section`
    &:nth-child(odd) {
        background: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
    }
    &:nth-child(even) {
        background: #f6f6fe;
    }
`;

const MainWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: min(100%, 1440px);
    margin: auto;
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

export const Section: React.FC = (props) => (
    <Background>
        <MainWrapper>{props.children}</MainWrapper>
    </Background>
);

export const Side = styled(FlexDivColumnCentered)`
    flex: 1;
    padding: 120px 140px 120px 60px;
    &:first-child {
        padding: 120px 60px 120px 140px;
    }
    @media (max-width: 768px) {
        padding: 40px !important;
    }
`;

export const Button = styled.button`
    padding: 8px 24px;
    border-radius: 40px;
    border: none;
    outline: none;
    align-self: flex-start;
    font-weight: bold;
    font-size: 20px;
    line-height: 32px;
    text-align: center;
    letter-spacing: 0.5px;
    text-transform: none !important;
    &:hover {
        background: #44e1e2;
        color: white;
    }
    cursor: pointer;
`;

export const Logo = styled(Link)`
    display: flex;
    flex: 1;
    &:before {
        content: ' ';
        background-image: url(${logo});
        height: 52px;
        width: 52px;
        margin-right: 20px;
    }

    font-weight: bold;
    font-size: 36px;
    line-height: 55px;
    color: white;
    &:hover {
        color: white;
    }
`;

export const Image = styled.img`
    width: 100%;
    height: 100%;
`;

export const SubTitle = styled.h2`
    font-weight: bold;
    font-size: 49px;
    line-height: 64px;
    letter-spacing: -1px;
    color: ${(props) => props.color};
`;
