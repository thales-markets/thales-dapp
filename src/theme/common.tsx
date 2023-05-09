import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logo from 'assets/images/logo.svg';
import xSign from 'assets/images/x-sign.svg';
import React from 'react';

export const FlexDiv = styled.div`
    display: flex;
    outline: none !important;
`;

export const FlexDivCentered = styled(FlexDiv)`
    align-items: center;
    justify-content: center;
`;

export const FlexDivSpaceBetween = styled(FlexDiv)`
    align-items: center;
    justify-content: space-between;
`;

export const FlexDivEnd = styled(FlexDiv)`
    justify-content: end;
`;

export const FlexDivStart = styled(FlexDiv)`
    justify-content: start;
`;

export const FlexDivRow = styled(FlexDiv)`
    justify-content: space-between;
`;

export const FlexDivRowCentered = styled(FlexDivRow)`
    align-items: center;
`;

export const FlexDivColumn = styled(FlexDiv)`
    flex: 1;
    flex-direction: column;
`;

export const FlexDivColumnCentered = styled(FlexDivColumn)`
    justify-content: center;
`;

export const GridDiv = styled.div`
    display: grid;
`;

export const GridDivCentered = styled(GridDiv)`
    align-items: center;
`;

export const GridDivRow = styled(GridDiv)`
    grid-auto-flow: row;
`;

export const GridDivCenteredRow = styled(GridDivCentered)`
    grid-auto-flow: row;
`;

export const GridDivCol = styled(GridDiv)`
    grid-auto-flow: column;
`;

export const GridDivCenteredCol = styled(GridDivCentered)`
    grid-auto-flow: column;
`;

export const Background = styled.section`
    @media (min-width: 1440px) {
        background-size: cover !important;
    }

    &#landing-hero {
        min-height: 900px;
        @media (max-width: 767px) {
            min-height: 600px;
        }
        position: relative;
        z-index: 2;
        &.hide-background {
            background: transparent;
        }

        & ~ section {
            position: relative;
            z-index: 2;
            &:not(:last-of-type):after {
                content: '';
                display: block;
                width: min(620px, 30%);
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
                height: 2px;
                filter: blur(2px);
                background-color: rgb(0, 249, 255);
            }
            &#faq:after {
                width: 100%;
            }
            &:last-of-type {
                backdrop-filter: blur(20px);
            }
            &.hide-background {
                background: transparent;
            }
        }
    }

    &.hero {
        @media (min-height: 1000px) and (min-width: 1200px) {
            min-height: 800px;
        }
    }

    &:nth-child(even) {
        @media (max-width: 767px) {
            & > div {
                flex-flow: column-reverse;
            }
        }
    }
    background-color: #111221;
    --background: #111221;
    --icon-color: #f7f7f7;
    --shadow: 0px 0px 40px var(--color-highlight);
    --primary-color: #f7f7f7;
    --input-border-color: var(--color-highlight);
    --table-border-color: rgba(100, 217, 254, 0.5);
    --table-header-text-color: var(--color-highlight);
    --disabled-item: #8181ac;
    --enabled-item: #f7f7f7;
    --primary-filter-menu-active: var(--color-highlight);
    --hotmarket-arrow-enabled: var(--color-highlight);
    --hotmarket-arrow-disable: rgba(100, 217, 254, 0.5);
`;

export const MainWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: min(100%, 1440px);
    margin: auto;
    @media (max-width: 767px) {
        flex-direction: column;
        width: 100%;
    }
`;

export const Wrapper = styled(FlexDivColumn)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin: auto;
    max-width: 1440px;
    min-height: 100vh;
    padding-left: 120px;
    padding-right: 30px;
    padding-bottom: 50px;
    @media (max-width: 1024px) {
        padding-left: 30px;
    }
    @media (max-width: 512px) {
        padding: 0 10px !important;
    }
`;

export const NewWrapper = styled(FlexDivColumn)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    @media (min-width: 1000px) {
        padding: 40px 100px 40px 100px;
    }
    min-height: 100vh;
`;

type SectionProps = {
    class?: string;
    id?: string;
};
export const Section: React.FC<SectionProps> = (props) => (
    <Background id={props.id} className={props.class}>
        <MainWrapper>{props.children}</MainWrapper>
    </Background>
);

export const Side = styled(FlexDivColumnCentered)`
    flex: 1;
    padding: 120px 100px;
    @media (max-width: 767px) {
        padding: 40px !important;
        width: 100%;
    }
    @media (max-width: 468px) {
        padding: 30px !important;
    }
`;

export const LoaderContainer = styled(GridDivCenteredRow)`
    grid-gap: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`;

export const Button = styled.button`
    padding: 8px 35px;
    border-radius: 40px;
    border: none;
    outline: none;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.5px;
    text-transform: none !important;
    color: #f6f6fe;
    cursor: pointer;
    white-space: break-spaces;
    &.primary {
        background: #3936c7;
        &:hover {
            background: #7119e1;
        }
        &:active {
            background: #5a14b4;
        }
    }
    &.secondary {
        background: linear-gradient(90deg, #3936c7 4.67%, #2d83d2 42.58%, #23a5dd 77.66%, #35dadb 95.67%);
        &:hover {
            background: #00f9ff;
            color: var(--color-primary);
        }
        &:active {
            background: #00ced3;
        }
    }
    &.tertiary {
        background: transparent;
        border-left: 1.5px solid rgba(202, 145, 220, 1);
        border-top: 1.5px solid rgba(202, 145, 220, 1);
        border-right: 1.5px solid rgba(106, 193, 213, 1);
        border-bottom: 1.5px solid rgba(106, 193, 213, 1);
        color: #f6f6fe;
        &:hover {
            border: 1.5px solid #00f9ff;
            color: #00f9ff;
        }
        &:active {
            border: 1.5px solid #00ced3;
            color: #00ced3;
        }
    }

    &:disabled {
        background: #748bc6 !important;
        color: #b5bbc9 !important;
        cursor: not-allowed;
    }
    @media (max-width: 468px) {
        font-size: 16px;
        line-height: 24px;
        padding: 8px 16px !important;
    }
`;

export const Text = styled.p`
    strong {
        font-weight: bold;
    }
`;
export const Li = styled.li``;

export const Logo = styled(Link)`
    flex: 1;
    content: ' ';
    background-image: url(${logo});
    height: 52px;
    @media (max-width: 468px) {
        height: 36px;
        &.footer_logo {
            margin-right: -50px;
        }
    }
    width: 214px;
    margin-right: 20px;
    margin-top: 6px;
    background-repeat: no-repeat;
`;

export const CardsAbs = styled(FlexDivColumn)`
    background: linear-gradient(148.33deg, rgba(255, 255, 255, 0.03) -2.8%, rgba(255, 255, 255, 0.01) 106.83%);
    box-shadow: 0px 25px 30px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 23px;
    border: 2px solid rgb(106, 193, 213, 0.4);
    border-left: 2px solid rgba(202, 145, 220, 0.6);
    border-top: 2px solid rgba(202, 145, 220, 0.6);
    border-right: 2px solid rgba(106, 193, 213, 0.6);
    border-bottom: 2px solid rgba(106, 193, 213, 0.6);
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

export const FilterButton = styled(Button)`
    min-width: 110px;
    height: 40px;
    margin: 24px 10px;
    background: transparent;
    border: 2px solid #0a2e66;
    border-radius: 32px;
    font-weight: bold;
    font-size: 13px;
    line-height: 13px;
    letter-spacing: 0.4px;
    text-transform: capitalize !important;
    color: #f6f6fe;
    padding: 8px 28px;
    &.selected {
        background: #0a2e66;
        border: 2px solid #00f9ff;
        border-radius: 32px;
        color: #00f9ff;
    }
    &:disabled {
        background: transparent !important;
        color: #f6f6fe !important;
        opacity: 0.4;
    }
    &.selected:disabled {
        background: #0a2e66 !important;
        color: #00f9ff !important;
        opacity: 0.4;
    }
`;

export const IconLink = styled.a``;

export const SyntetixLogo = styled.img`
    width: 220px;
    height: 16px;
    position: relative;
    top: 2px;
    @media (max-width: 468px) {
        width: 160px;
        top: 4px;
        margin-left: 6px;
    }
`;
export const GradientText = styled.span<{ gradient: string; fontSize: number; fontWeight: number }>`
    font-size: ${(props) => props.fontSize}px;
    font-weight: ${(props) => props.fontWeight};
    background: ${(props) => props.gradient};
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
`;

export const UserCardSectionHeader = styled.span`
    font-family: ${(props) => props.theme.fontFamily.primary};
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 20px;
    color: var(--color-highlight);
    text-transform: uppercase;
`;

export const MarketCardContainer = styled.div`
    border: 2px solid var(--card-border-color);
    :hover {
        transform: scale(1.02);
        border: 2px solid rgb(100, 217, 254, 1);
    }
    cursor: pointer;
`;

export const CardContainer = styled.div`
    border: 2px solid var(--card-border-color);
    border-radius: 15px;
`;

export const InputContainer = styled.div`
    border: 0.8px solid var(--card-border-color);
    border-radius: 10px;
`;

export const NoDataText = styled.span`
    color: var(--color-white);
    font-size: 24px;
    @media (max-width: 768px) {
        font-size: 15px;
    }
`;

export const NoDataContainer = styled.div`
    display: block;
    width: 100%;
    text-align: center;
    margin-top: 50px;
    @media (max-width: 768px) {
        margin-top: 10px;
    }
`;

// TODO: Update color names
export const Colors = {
    GRAY: '#2B3139',
    GRAY_LIGHT: '#848E9C',
    GRAY_DARK: '#181A20',

    WHITE: '#FFFFFF',

    GREEN: '#03DAC5',
    GREEN_LIGHT: '#93F9B9',
    GREEN_DARK: '#1D976C',

    BLACK: '#000000',
    BLACK_LIGHT: '#121212',

    BLUE: '#1043B4',
    BLUE_LIGHT: '#5B86E5',
    BLUE_DARK: '#36D1DC',
    BLUE_MIDNIGHT: '#050838',

    RED: '#DE496D',
    RED_LIGHT: '#E29587',
    RED_DARK: '#D66D75',

    ORANGE: '#F7B91A',
};
