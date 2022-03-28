import styled, { StyledComponent } from 'styled-components';

type ContainerChildren = {
    Slider: StyledComponent<'input', any>;
};

export const Wrapper = styled.div<{ disabled?: boolean; margin?: string; padding?: string }>`
    width: 100%;
    display: flex;
    flex-direction: column;
    opacity: ${(_props) => (_props?.disabled ? '0.5 !important' : '')};
    ${(_props) => (_props?.margin ? `margin: ${_props.margin}` : '')};
    ${(_props) => (_props?.padding ? `padding: ${_props.padding}` : '')};
`;

// @ts-ignore
const Container: StyledComponent<'div', any> & ContainerChildren = styled.div`
    width: 100%;
    border: 1px solid var(--input-border-color);
    border-radius: 30px;
    display: flex;
    align-items: center;
    height: 30px;
    &:active {
        box-shadow: 0px 1px 30px rgba(100, 217, 254, 0.7);
    }
`;

const Slider = styled.input`
    -webkit-appearance: none;
    width: 100%;
    height: 2px;
    background-color: rgba(100, 217, 254, 0.5);
    outline: none;
    margin: 0px 6px;
    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 21px;
        height: 21px;
        background: var(--primary-color);
        border-radius: 50%;
        cursor: pointer;
    }
    &::-moz-range-thumb {
        width: 21px;
        height: 21px;
        background: var(--primary-color);
        border-radius: 50%;
        cursor: pointer;
    }
`;

Container.Slider = Slider;

export default Container;
