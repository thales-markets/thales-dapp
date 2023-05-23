import React from 'react';
import styled from 'styled-components';
import errorIcon from 'assets/images/errorIcon.svg';
import { FlexDiv, FlexDivCentered, FlexDivColumn, FlexDivColumnCentered, FlexDivRow } from 'theme/common';
import Select from 'pages/CreateMarket/components/Select';

export const Container = styled(FlexDiv)`
    padding: 50px 0;
    @media (max-width: 767px) {
        flex-direction: column;
    }
`;

export const Row = styled(FlexDivRow)`
    @media (max-width: 767px) {
        flex-direction: column;
    }
`;
export const DatePickerRow = styled(FlexDivRow)`
    width: 50%;
    margin-right: 10px;
    @media (max-width: 767px) {
        width: 100%;
    }
`;

export const Text = styled.p`
    strong {
        font-weight: bold;
    }
`;

export const Title = styled.p`
    font-size: 38px;
    line-height: 48px;
    color: ${(props) => props.theme.textColor.primary};
    margin: 0;
    height: 100%;
    padding-top: 50px;
    align-self: flex-start;
`;

export const Description = styled.p`
    font-size: 16px;
    line-height: 24px;
    color: ${(props) => props.theme.textColor.primary};
    margin-bottom: 10px;
`;

export const Error = styled(Text)`
    color: ${(props) => props.theme.textColor.tertiary};
    font-size: 13px;
    position: absolute;
    bottom: -14px;
    left: 8px;
    strong {
        font-weight: bold;
    }
`;

export const InputsWrapper = styled(FlexDivColumn)`
    padding: 20px;
    border-radius: 12px;
    background: var(--color-primary); ;
`;

export const NoteText = styled.p`
    margin: 4px 0px 6px 6px;
    line-height: 16px;
    position: absolute;
    bottom: -40px;
    font-size: 10px;
    color: ${(props) => props.theme.textColor.secondary};
`;

export const ButtonContainer = styled(FlexDivColumnCentered)`
    margin-top: 50px;
    margin-bottom: 120px;
`;

export const ShortInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    margin-bottom: 20px;
    width: 50%;
    &:first-child {
        margin-right: 10px;
    }
    @media (max-width: 767px) {
        width: 100%;
    }
`;

export const InputLabel = styled.label`
    font-weight: bold;
    font-size: 9px;
    line-height: 16px;
    letter-spacing: 1px;
    color: ${(props) => props.theme.textColor.primary};
    padding: 8px 0 0 22px;
    pointer-events: none;
    z-index: 3;
    position: absolute;
    text-transform: uppercase;
`;

export const ReactSelect = styled(Select)<{ isUppercase?: boolean }>`
    text-transform: ${(prop) => (prop.isUppercase ? 'uppercase' : 'none')};
    caret-color: transparent;
    > div:first-of-type {
        height: 64px;
        background: #2b3139;
        > div:first-of-type div {
            font-weight: bold;
            font-size: 13px;
            line-height: 24px;
            letter-spacing: 0.4px;
            color: #ffffff !important;
            padding: 15px 0px 0 11px;
        }
    }
    > div {
        font-weight: bold;
        font-size: 13px;
        line-height: 24px;
        letter-spacing: 0.4px;
        color: #ffffff !important;
        background: #2b3139;
        border: none;
        border-radius: 12px;
        box-shadow: none;
        overflow: hidden;
    }
    & + label {
        z-index: 100;
    }

    svg {
        fill: #f6f6fe;
    }
    .react-select__option--is-selected {
        border: 1px solid #03dac5;
        box-sizing: border-box;
        border-radius: 10px;
        background: #2b3139;
    }
    .react-select__option--is-focused {
        background: #181a20;
        border-radius: 10px;
        color: #ffffff;
        cursor: pointer;
    }

    .react-select__value-container {
        height: 100%;
    }
    .react-select__menu {
        font-size: 13px;
        padding: 0px 4px;
    }
    .react-select__control:hover {
        border-color: #2b3139;
        cursor: pointer;
    }
    .react-select__control {
        border: 2px solid #2b3139;
        box-sizing: border-box;
    }
    .react-select__control--is-focused,
    .react-select__control--menu-is-open,
    .react-select__control--is-focused:hover,
    .react-select__control--menu-is-open:hover {
        border: 2px solid #03dac5;
        box-sizing: border-box;
        cursor: pointer;
    }
    &.error .react-select__control {
        border: 2px solid #de496d;
    }
    &.disabled {
        opacity: 0.4;
        cursor: default;
    }
`;

const Wrapper = styled(FlexDivCentered)`
    background: #e9bcbc;
    justify-content: flex-start;
    white-space: pre;
    padding-right: 4px;
    border-radius: 5px;
    position: absolute;
    bottom: -30px;

    &.hide {
        display: none;
    }

    &:after {
        content: '';
        position: absolute;
        top: -12px;
        left: 30px;
        border-width: 6px;
        border-style: solid;
        border-color: transparent transparent #e9bcbc transparent;
    }
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
`;

export const ErrorMessage: React.FC<{ text: string; show: boolean }> = ({ text, show }) => {
    return (
        <Wrapper className={show ? '' : 'hide'} style={{ background: '#E9BCBC', borderRadius: 5, zIndex: 3 }}>
            <Image style={{ width: 12, height: 12, margin: 6 }} src={errorIcon}></Image>
            <Text style={{ color: '#DE496D', fontSize: 13 }}>{text}</Text>
        </Wrapper>
    );
};
