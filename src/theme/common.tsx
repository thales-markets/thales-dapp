import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logo from 'assets/images/logo.svg';
import xSign from 'assets/images/x-sign.svg';
import React from 'react';

export const FlexDiv = styled.div`
    display: flex;
    outline: none !important;
`;

export const FlexDivRow = styled(FlexDiv)`
    flex: 1;
    justify-content: center;
`;

export const FlexDivRowCentered = styled(FlexDivRow)`
    align-items: center;
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

export const Background = styled.section`
    background-size: cover !important;

    &:nth-child(odd) {
        background-image: linear-gradient(281.48deg, #04045a -16.58%, #141874 97.94%);
    }
    &:nth-child(even) {
        background: white;
        @media (max-width: 768px) {
            & > div {
                flex-flow: column-reverse;
            }
        }
    }
`;

export const MainWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: min(100%, 1440px);
    margin: auto;
    @media (max-width: 768px) {
        flex-direction: column;
        width: 100%;
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
        width: 100%;
    }
    @media (max-width: 468px) {
        padding: 30px !important;
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
    color: white;
    cursor: pointer;
    white-space: pre;
    &.primary {
        background: #3936c7;
    }
    &.secondary {
        background: linear-gradient(90deg, #3936c7 4.67%, #2d83d2 42.58%, #23a5dd 77.66%, #35dadb 95.67%);
    }
    &.tertiary {
        background: transparent;
        border: 1.5px solid #44e1e2;
        color: #44e1e2;
    }
    &:hover {
        color: white;
        background: #44e1e2;
    }
    &:disabled {
        background: #748bc6;
        color: #b5bbc9;
    }
    @media (max-width: 468px) {
        font-size: 16px;
        line-height: 24px;
        padding: 8px 16px !important;
    }
`;

export const Text = styled.p`
    @media (max-width: 468px) {
        margin: 0 0 0.5em;
    }
`;
export const Li = styled.li``;

export const Logo = styled(Link)`
    display: flex;
    align-items: center;
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
    @media (max-width: 768px) {
        font-size: 24px;
        line-height: 37px;
    }
`;

export const Image = styled.img`
    width: 100%;
    height: 100%;
`;

export const XButton = styled.img`
    width: 14px;
    height: 14px;
    cursor: pointer;
    padding: 8px;
    background-image: url(${xSign});
    background-size: cover;
`;

export const ProgressBar = styled.div`
    width: 100%;
    height: 15px;
    margin-top: 2px;
    &::before {
        content: '';
        position: relative;
        z-index: 2;
        width: ${(props) => props['aria-label']}%;
        border-radius: 20px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        height: 100%;
        display: block;
        background: #4fbf67;
    }
    &:after {
        content: '';
        position: relative;
        z-index: 1;
        top: -15px;
        background: #c62937;
        border-radius: 20px;
        height: 100%;
        display: block;
    }
    margin-bottom: 20px;
`;
