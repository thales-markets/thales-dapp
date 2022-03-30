import styled, { StyledComponent } from 'styled-components';

type SlippageInputChildren = {
    InputField: StyledComponent<'input', any>;
    Percentage: StyledComponent<'span', any>;
};

type ValueChildren = {
    Fixed: StyledComponent<'div', any, { active?: boolean }>;
    SlippageInput: StyledComponent<'div', any> & SlippageInputChildren;
};

type ContainerChildren = {
    Title: StyledComponent<'span', any>;
    ValueContainer: StyledComponent<'div', any> & ValueChildren;
};

const InputField = styled.input`
    display: block;
    width: 65px;
    border: 1px solid var(--input-border-color);
    color: var(--primary-color);
    background: transparent;
    padding: 5px 17px 5px 14px;
    border-radius: 30px;
    font-size: 12px;
    font-family: Roboto !important;
    &:active {
        box-shadow: var(--shadow);
    }
    &:focus {
        box-shadow: var(--shadow);
    }
`;

const Percentage = styled.span`
    color: var(--primary-color);
    position: absolute;
    display: block;
    right: 10px;
    font-size: 12px;
    font-family: Roboto !important;
`;

// @ts-ignore
const SlippageInput: StyledComponent<'div', any> & SlippageInputChildren = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const Title = styled.span`
    color: var(--primary-color);
    font-family: Roboto !important;
    font-size: 14px;
    margin-bottom: 9px;
    text-transform: uppercase;
`;

// @ts-ignore
const ValueContainer: StyledComponent<'div', any> & ValueChildren = styled.div`
    display: flex;
    flex-direction: row;
`;

export const Fixed = styled.div<{ active?: boolean; margin?: string }>`
    display: flex;
    border-radius: 60%;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    width: 32px;
    height: 32px;
    margin: ${(_props) => (_props?.margin ? _props?.margin : '0 11px 0 0')};
    cursor: pointer;
    font-family: Roboto !important;
    border: 1px solid var(--input-border-color);
    background-color: ${(_props) => (_props?.active ? 'var(--button-bg-active)' : 'var(--button-bg-inactive)')};
    color: ${(_props) => (_props?.active ? 'var(--button-text-active)' : 'var(--button-text-inactive)')};
`;

SlippageInput.InputField = InputField;
SlippageInput.Percentage = Percentage;

ValueContainer.SlippageInput = SlippageInput;
ValueContainer.Fixed = Fixed;

// @ts-ignore
const Container: StyledComponent<'div', any> & ContainerChildren = styled.div`
    display: flex;
    flex-direction: column;
    margin: 12px 0px;
`;

Container.Title = Title;
Container.ValueContainer = ValueContainer;

export default Container;
