import styled from 'styled-components';
import { FlexDivEnd } from 'theme/common';

export const Wrapper = styled.div<{ disabled?: boolean; margin?: string; padding?: string }>`
    width: 100%;
    display: flex;
    flex-direction: column;
    opacity: ${(props) => (props.disabled ? '0.5 !important' : '')};
    margin: ${(props) => props.margin || '0px'};
    padding: ${(props) => props.padding || '0px'};
`;

export const Container = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    height: 30px;
`;

export const Slider = styled.input`
    -webkit-appearance: none;
    width: 100%;
    height: 10px;
    background-color: ${(props) => props.theme.background.secondary};
    outline: none;
    border-radius: 30px;
    margin: 0px 5px;
    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        background: ${(props) => props.theme.textColor.quaternary};
        border-radius: 50%;
        cursor: pointer;
    }
    &::-moz-range-thumb {
        width: 20px;
        height: 20px;
        background: ${(props) => props.theme.textColor.quaternary};
        border-radius: 50%;
        cursor: pointer;
    }
`;

export const Footer = styled(FlexDivEnd)<{ justifyContent?: string }>`
    width: 100%;
    text-align: right;
    justify-content: ${(props) => props.justifyContent || 'end'};
    color: ${(props) => props.theme.textColor.secondary};
    font-size: 13px;
    padding: 0px 5px;
`;
