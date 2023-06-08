import { ScreenSizeBreakpoint } from 'enums/ui';
import styled from 'styled-components';
import { FlexDiv, FlexDivCentered } from 'styles/common';

export const Container = styled.div`
    width: 100%;
`;

export const Tile = styled(FlexDiv)<{
    dotColor?: string;
    backgroundColor?: string;
    disabled?: boolean;
    lineHidden?: boolean;
    heightSmall?: boolean;
    defaultFlowColor?: string;
    lineSmall?: boolean;
    hideFlow?: boolean;
}>`
    position: relative;
    background: ${(props) => props.backgroundColor || 'transparent'};
    border: 2px solid ${(props) => (props.backgroundColor ? 'transparent' : props.theme.borderColor.primary)};
    box-sizing: border-box;
    border-radius: 15px;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    height: 50px;
    opacity: ${(props) => (props.disabled ? '0.5' : '1')};
    margin-left: ${(props) => (props.hideFlow ? '10px' : '40px')};
    gap: 4px;
    &:before {
        content: '';
        position: absolute;
        box-sizing: border-box;
        left: -30px;
        top: 50%;
        transform: translateY(-50%);
        width: 15px;
        height: 15px;
        border-radius: 50%;
        border: 4px solid ${(props) => props.theme.background.primary};
        background: ${(props) =>
            props.defaultFlowColor || props.dotColor || props.theme.background.secondary} !important;
        box-shadow: 0 0 0 3px ${(props) => props.defaultFlowColor || props.dotColor || props.theme.background.secondary} !important;
        opacity: ${(props) => (props.disabled ? '0.5' : '1')} !important;
        display: ${(props) => (props.hideFlow ? 'none' : 'block')} !important;
    }
    &:after {
        content: '';
        position: absolute;
        box-sizing: border-box;
        left: -24px;
        top: -31px;
        width: 2px;
        height: 44px;
        background: ${(props) => props.defaultFlowColor || props.theme.background.secondary};
        opacity: ${(props) => (props.disabled ? '0.5' : '1')} !important;
        display: ${(props) => (props.hideFlow || props.lineHidden ? 'none' : 'block')} !important;
        @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
            height: ${(props) => (props.heightSmall ? '44px' : props.lineSmall ? '70px' : '94px')};
            top: ${(props) => (props.heightSmall || props.lineSmall ? '-32px' : '-56px')};
        }
    }
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
        flex-wrap: wrap;
        min-height: ${(props) => (props.heightSmall ? '50px' : '100px')};
    }
`;

export const Title = styled(FlexDiv)<{
    lineHidden?: boolean;
    defaultFlowColor?: string;
}>`
    color: ${(props) => props.theme.textColor.primary} !important;
    font-weight: bold;
    height: 50px;
    position: relative;
    border: 2px solid transparent;
    margin-bottom: 15px;
    width: 100%;
    align-items: center;
    margin-left: 40px;
    &:before {
        content: '';
        position: absolute;
        box-sizing: border-box;
        left: -30px;
        top: 50%;
        transform: translateY(-50%);
        width: 15px;
        height: 15px;
        border-radius: 50%;
        border: 4px solid ${(props) => props.theme.background.primary};
        background: ${(props) => props.defaultFlowColor || props.theme.background.secondary} !important;
        box-shadow: 0 0 0 3px ${(props) => props.defaultFlowColor || props.theme.background.secondary} !important;
        opacity: 1 !important;
    }
    &:after {
        content: '';
        position: absolute;
        box-sizing: border-box;
        left: -24px;
        top: -31px;
        width: 2px;
        height: 44px;
        background: ${(props) => props.defaultFlowColor || props.theme.background.secondary};
        opacity: 1;
        display: ${(props) => (props.lineHidden ? 'none' : 'block')} !important;
        @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
            height: 69px;
            top: -56px;
        }
    }
`;

export const Cell = styled.div<{ direction?: string; color?: string; width?: string }>`
    display: flex;
    flex: 1;
    align-items: center;
    flex-direction: ${(props) => props.direction || 'column'};
    gap: ${(props) => (props.direction ? '3px' : '0')};
    color: ${(props) => props.theme.textColor.primary} !important;
    justify-content: center;
    max-width: ${(props) => props.width || ''};
`;

export const CellTitle = styled.div<{ fontSize?: number }>`
    font-size: ${(props) => props.fontSize || '12'}px;
    color: ${(props) => props.theme.textColor.secondary};
    text-transform: uppercase;
    line-height: 120%;
`;

export const CellValue = styled.div<{ fontSize?: number }>`
    white-space: pre;
    font-style: normal;
    font-weight: bold;
    font-size: ${(props) => props.fontSize || '12'}px;
    text-transform: uppercase;
`;

export const LoaderContainer = styled(FlexDivCentered)`
    position: relative;
    min-height: 220px;
    width: 100%;
`;

export const NoDataContainer = styled(FlexDivCentered)`
    color: ${(props) => props.theme.textColor.primary};
    justify-content: center;
    margin: 20px 0px;
    font-size: 15px;
    font-weight: bold;
    width: 100%;
    height: 20px;
    text-align: center;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 13px;
    }
  }
`;
