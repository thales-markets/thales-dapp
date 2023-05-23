import styled from 'styled-components';
import { Link } from 'react-router-dom';
import logo from 'assets/images/logo.svg';
import xSign from 'assets/images/x-sign.svg';

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

export const IconLink = styled.a``;

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
    BLUE_LIGHT: '#36D1DC',
    BLUE_DARK: '#5B86E5',
    BLUE_MIDNIGHT: '#050838',

    RED: '#DE496D',
    RED_LIGHT: '#E29587',
    RED_DARK: '#D66D75',

    ORANGE: '#F7B91A',

    YELLOW: '#FFCC00',
};
