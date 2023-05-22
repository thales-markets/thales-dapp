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
    font-weight: 400;
    margin-bottom: 5px;
    text-transform: uppercase;
    color: ${(_props) => (_props?.color ? _props.color : 'var(--input-border-color)')};
    font-size: ${(_props) => (_props?.fontSize ? _props.fontSize : '14px')};
`;

// @ts-ignore
const ValueContainer: StyledComponent<'div', any> & ValueContainerChildren = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
`;

const Value = styled.input<{ color?: string; fontSize?: string }>`
    font-weight: 600;
    color: ${(_props) => (_props?.color ? _props.color : _props.theme.textColor.primary)};
    font-size: ${(_props) => (_props?.fontSize ? _props.fontSize : '20px')};
    background: transparent;
    border: none;
    padding: 0;
    width: 80%;
    &:focus {
        border: none;
        outline: none;
    }
`;

const SubValue = styled.span<{ color?: string; fontSize?: string }>`
    font-weight: 600;
    color: ${(_props) => (_props?.color ? _props.color : _props.theme.textColor.primary)};
    font-size: ${(_props) => (_props?.fontSize ? _props.fontSize : '20px')};
`;

// @ts-ignore
const Container: StyledComponent<
    'div',
    any,
    {
        borderColor?: string;
        borderStyle?: string;
        disabled?: boolean;
        width?: string;
        margin?: string;
        height?: string;
        padding?: string;
        shadow?: string;
        background?: string;
    }
> &
    ContainerChildren = styled.div<{
    borderColor?: string;
    borderStyle?: string;
    disabled?: boolean;
    width?: string;
    margin?: string;
    height?: string;
    padding?: string;
    shadow?: string;
    background?: string;
}>`
    width: ${(_props) => (_props?.width ? _props.width : '100%')};
    margin: ${(_props) => (_props?.margin ? _props.margin : '')};
    ${(_props) => (_props?.height ? `height: ${_props.height}` : '')};
    display: flex;
    flex-direction: column;
    border: 0.8px solid ${(_props) => (_props?.borderColor ? _props.borderColor : 'var(--card-border-color)')};
    border-style: ${(_props) => (_props?.borderStyle ? _props.borderStyle : 'solid')};
    border-radius: 10px;
    justify-content: center;
    padding: ${(_props) => (_props?.padding ? _props.padding : '5px 10px')};
    box-sizing: border-box;
    margin-bottom: 8px;
    position: relative;
    opacity: ${(_props) => (_props?.disabled ? '0.5 !important' : '1')};
    ${(_props) => (_props?.shadow ? `box-shadow: ${_props.shadow}` : '')};
    background: ${(_props) => (_props?.background ? _props.background : 'transparent')};
`;

ValueContainer.Value = Value;
ValueContainer.SubValue = SubValue;

Container.ValueContainer = ValueContainer;
Container.Title = Title;

export default Container;
