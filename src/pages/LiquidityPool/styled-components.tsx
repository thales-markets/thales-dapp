import { Slider } from '@material-ui/core';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React from 'react';
import styled from 'styled-components';
import {
    FlexDiv,
    FlexDivCentered,
    FlexDivColumn,
    FlexDivColumnCentered,
    FlexDivRow,
    FlexDivStart,
} from 'styles/common';

export const Wrapper = styled(FlexDivColumn)`
    width: 100%;
    align-items: center;
    color: ${(props) => props.theme.textColor.primary};
`;

export const Container = styled(FlexDivRow)`
    width: 70%;
    position: relative;
    align-items: center;
    margin-top: 10px;
    padding: 0 20px;
    @media (max-width: 1199px) {
        width: 80%;
    }
    @media (max-width: 991px) {
        width: 100%;
        padding: 0;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
    }
`;

export const ContentContainer = styled(FlexDivColumn)`
    width: 100%;
    flex: initial;
    align-items: center;
    position: relative;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    padding: 10px 20px 10px 20px;
    p {
        margin-bottom: 5px;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 10px 5px 10px 5px;
    }
`;

export const MainContainer = styled(Container)`
    width: 100%;
    border: 2px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 10px;
    padding: 0 10px;
`;

export const RoundEndContainer = styled(FlexDivColumn)`
    align-items: center;
    text-align: center;
    font-size: 20px;
    line-height: 20px;
    span {
        font-size: 30px;
        font-weight: 600;
        color: ${(props) => props.theme.textColor.quaternary};
        line-height: 34px;
    }
    @media (max-width: 1199px) {
        font-size: 18px;
        line-height: 18px;
        span {
            font-size: 26px;
            line-height: 26px;
        }
    }
`;

export const RoundEndLabel = styled.p``;

export const RoundEnd = styled.p`
    font-weight: 600;
    font-size: 25px;
    color: ${(props) => props.theme.textColor.quaternary};
    line-height: 25px;
`;

export const RoundInfoContainer = styled(FlexDivColumn)`
    align-items: center;
    text-align: center;
`;

export const RoundInfoLabel = styled.p``;

export const RoundInfo = styled.p`
    font-size: 20px;
    font-weight: 600;
    color: ${(props) => props.theme.textColor.quaternary};
    line-height: 20px;
`;

export const CopyContainer = styled(Container)`
    align-items: start;
    width: 80%;
    @media (max-width: 1199px) {
        width: 90%;
    }
    @media (max-width: 991px) {
        width: 100%;
        padding: 0;
    }
`;

export const Description = styled.div`
    font-size: 14px;
    line-height: 16px;
    text-align: justify;
    padding: 0 10px;
    width: 50%;
    :first-child {
        width: 90%;
    }
    :last-child {
        width: 30%;
    }
    h1 {
        font-size: 15px;
        font-weight: 600;
        margin-bottom: 10px;
    }
    p {
        margin-bottom: 10px;
    }
    ul {
        list-style: initial;
        margin-left: 20px;
    }
    li {
        margin-bottom: 4px;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 0 5px;
        width: 100%;
        :first-child {
            width: 100%;
        }
        :last-child {
            width: 100%;
        }
    }
`;

export const ContentInfoContainer = styled.div``;

export const ContentInfo = styled.p`
    text-align: center;
`;

export const WarningContentInfo = styled(ContentInfo)`
    color: ${(props) => props.theme.warning.textColor.primary};
    i {
        color: ${(props) => props.theme.warning.textColor.primary};
    }
`;

export const BoldContent = styled.span`
    font-weight: 600;
`;

export const Title = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 25px;
    line-height: 100%;
    margin-bottom: 10px;
    margin-top: 20px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-top: 10px;
        margin-bottom: 0;
    }
`;

export const LiquidityPoolFilledText = styled(FlexDivRow)`
    margin-top: 10px;
    margin-bottom: 20px;
    width: 100%;
`;

export const LiquidityPoolFilledGraphicContainer = styled(FlexDivStart)`
    position: relative;
    width: 100%;
    height: 14px;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 9px;
    margin-top: 10px;
`;

export const LiquidityPoolFilledGraphicPercentage = styled(FlexDivStart)<{ width: number }>`
    position: absolute;
    width: ${(props) => props.width}%;
    transition: width 1s linear;
    max-width: 100%;
    height: 10px;
    left: 2px;
    top: 2px;
    background: linear-gradient(269.97deg, #ff774c 16.18%, #b50a5e 77.77%);
    border-radius: 9px;
`;

export const ExternalButton = styled.a`
    background: ${(props) => props.theme.button.background.primary};
    margin-top: 5px;
    border-radius: 30px;
    font-size: 18px;
    font-weight: 700;
    line-height: 20px;
    color: ${(props) => props.theme.button.textColor.primary};
    width: 100%;
    border: none;
    padding: 3px;
    cursor: pointer;
    text-align: center;
    text-transform: uppercase;
    height: 26px;
`;

export const ButtonContainer = styled(FlexDivColumnCentered)`
    width: 100%;
    max-width: 310px;
`;

export const LoaderContainer = styled(FlexDivCentered)`
    position: relative;
    min-height: 240px;
    width: 100%;
`;

export const ToggleContainer = styled(FlexDiv)`
    font-weight: 600;
    width: 100%;
    margin-bottom: 10px;
    text-transform: uppercase;
`;

export const LiquidityPoolInfoTitle = styled.div`
    text-align: center;
    white-space: nowrap;
    font-weight: 400;
    font-size: 18px;
    line-height: 100%;
    margin-top: 10px;
    margin-bottom: 15px;
`;

export const LiquidityPoolInfoContainer = styled(FlexDivStart)`
    align-items: center;
    margin-bottom: 10px;
`;

export const LiquidityPoolInfoLabel = styled.span`
    white-space: nowrap;
    margin-right: 6px;
    width: 125px;
`;

export const LiquidityPoolInfoGraphic = styled(FlexDivStart)<{ background: string; widthPercentage: number }>`
    width: ${(props) => 170 * props.widthPercentage}px;
    height: 14px;
    background: ${(props) => props.background};
    border-radius: 9px;
    margin-right: ${(props) => (props.widthPercentage === 0 ? 0 : 6)}px;
    @media (max-width: 1199px) {
        width: ${(props) => 150 * props.widthPercentage}px;
    }
    @media (max-width: 991px) {
        width: ${(props) => 120 * props.widthPercentage}px;
    }
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: ${(props) => 200 * props.widthPercentage}px;
    }
    @media (max-width: 575px) {
        width: ${(props) => 120 * props.widthPercentage}px;
    }
`;

export const LiquidityPoolInfo = styled.span`
    white-space: nowrap;
`;

export const GetStakeThalesIcon = styled.i`
    font-size: 21px;
    margin-left: 4px;
    vertical-align: initial;
`;

export const TextLink = styled.a`
    color: ${(props) => props.theme.link.textColor.primary};
    &:hover {
        text-decoration: underline;
    }
`;

export const TipLink: React.FC<{ href: string }> = ({ children, href }) => {
    return (
        <TextLink target="_blank" rel="noreferrer" href={href}>
            {children}
        </TextLink>
    );
};

export const RadioButtonContainer = styled(FlexDivColumnCentered)`
    align-items: center;
    label {
        text-transform: uppercase;
    }
`;

export const SliderContainer = styled.div`
    position: relative;
    width: 100%;
    padding: 0 5px;
    margin-bottom: 10px;
`;

export const StyledSlider = styled((props) => (
    <Slider
        classes={{ root: props.className, thumb: props.className, track: props.className, rail: props.className }}
        {...props}
    />
))`
    &.MuiSlider-root {
        color: ${(props) => props.theme.textColor.quaternary};
        padding: 6px 0 10px 0;

        &.Mui-disabled {
            color: ${(props) => props.theme.textColor.quaternary};
            opacity: 0.5;
        }
    }

    &.MuiSlider-thumb {
        width: 14px;
        height: 14px;
        margin-top: -2px;
        background: ${(props) => props.theme.textColor.primary};
        box-shadow: none;

        &:focus,
        &:hover {
            box-shadow: none;
        }

        &.Mui-disabled {
            width: 14px;
            height: 14px;
            margin-top: -2px;
            margin-left: -6px;
            box-shadow: none;
            outline: 0;
        }
    }

    &.MuiSlider-track {
        height: 10px;
        border-radius: 10px;
    }

    &.MuiSlider-rail {
        height: 10px;
        border-radius: 10px;
    }
`;

export const SliderRange = styled.div`
    font-size: 13px;
    line-height: 13px;
    letter-spacing: 0.4px;
    color: ${(props) => props.theme.link.textColor.primary};
    &.disabled {
        opacity: 0.4;
        cursor: default;
    }
`;

export const defaultButtonProps = {
    width: '100%',
    fontSize: '15px',
    height: '30px;',
};

export const NavigationContainer = styled(FlexDivRow)`
    margin-top: 20px;
    margin-bottom: 20px;
    gap: 30px;
    font-size: 20px;
    font-weight: 600;
`;

export const NavigationItem = styled(FlexDivRow)`
    color: ${(props) => props.theme.textColor.secondary};
    &.selected {
        transition: 0.2s;
        color: ${(props) => props.theme.textColor.quaternary};
    }
    &:hover:not(.selected) {
        cursor: pointer;
        color: ${(props) => props.theme.textColor.primary};
    }
`;
