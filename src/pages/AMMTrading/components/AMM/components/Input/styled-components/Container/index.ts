import styled, { StyledComponent } from 'styled-components';

type ValueContainerChildren = {
    Value: StyledComponent<'input', any, { color?: string; fontSize?: string }>;
    SubValue: StyledComponent<'span', any, { color?: string; fontSize?: string }>;
};

type ContainerChildren = {
    Title: StyledComponent<'div', any, { color?: string; fontSize?: string }>;
    ValueContainer: StyledComponent<'div', any> & ValueContainerChildren;
};

const Title = styled.div<{ color?: string; fontSize?: string }>`
    font-family: Titillium Regular !important;
    font-weight: 400;
    margin-bottom: 5px;
    color: ${(_props) => (_props?.color ? _props.color : 'var(--input-border-color)')};
    font-size: ${(_props) => (_props?.fontSize ? _props.fontSize : '20px')};
`;

// @ts-ignore
const ValueContainer: StyledComponent<'div', any> & ValueContainerChildren = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
`;

const Value = styled.input<{ color?: string; fontSize?: string }>`
    font-family: Titillium Regular !important;
    font-weight: 600;
    color: ${(_props) => (_props?.color ? _props.color : 'var(--primary-color)')};
    font-size: ${(_props) => (_props?.fontSize ? _props.fontSize : '20px')};
    background: transparent;
    border: none;
    padding: 0;
    &:focus {
        border: none;
        outline: none;
    }
`;

const SubValue = styled.span<{ color?: string; fontSize?: string }>`
    font-family: Titillium Regular !important;
    font-weight: 600;
    color: ${(_props) => (_props?.color ? _props.color : 'var(--primary-color)')};
    font-size: ${(_props) => (_props?.fontSize ? _props.fontSize : '20px')};
`;

// @ts-ignore
const Container: StyledComponent<'div', any> & ContainerChildren = styled.div`
    display: flex;
    flex-direction: column;
    border: 0.8px solid var(--input-border-color);
    border-radius: 10px;
    padding: 5px 14px;
`;

ValueContainer.Value = Value;
ValueContainer.SubValue = SubValue;

Container.ValueContainer = ValueContainer;
Container.Title = Title;

export default Container;
