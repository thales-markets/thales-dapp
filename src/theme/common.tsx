import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logo from 'assets/images/logo.svg';
import xSign from 'assets/images/x-sign.svg';
import React from 'react';
import background from 'assets/images/background-dark.png';
import { Tooltip, withStyles } from '@material-ui/core';

export const FlexDiv = styled.div`
    display: flex;
    outline: none !important;
`;

export const FlexDivCentered = styled(FlexDiv)`
    align-items: center;
    justify-content: center;
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

    &.hero {
        @media (min-height: 1000px) and (min-width: 1200px) {
            min-height: 800px;
        }
        background-image: url(${background}) !important;
    }

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

export const LightTooltip = withStyles(() => ({
    tooltip: {
        fontSize: '12px',
        backgroundColor: '#748BC6',
        border: '1px solid #748BC6',
        padding: 6,
    },
}))(Tooltip);

export const Text = styled.p`
    @media (max-width: 468px) {
        margin: 0 0 0.5em;
    }
`;
export const Li = styled.li``;

export const Logo = styled(Link)`
    flex: 1;
    content: ' ';
    background-image: url(${logo});
    height: 52px;
    width: 214px;
    margin-right: 20px;
    background-repeat: no-repeat;
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
    width: 110px;
    height: 40px;
    margin: 24px 10px;
    background: transparent;
    border: 1px solid #04045a;
    border-radius: 32px;
    font-weight: bold;
    font-size: 13px;
    line-height: 13px;
    letter-spacing: 0.4px;
    text-transform: capitalize !important;
    color: #f6f6fe;
    &.selected {
        background: #44e1e2;
    }
`;
