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
    color: ${(props) => (props?.color ? props.color : 'var(--input-border-color)')};
    font-size: ${(props) => (props?.fontSize ? props.fontSize : '14px')};
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
    color: ${(props) => (props?.color ? props.color : props.theme.textColor.primary)};
    font-size: ${(props) => (props?.fontSize ? props.fontSize : '20px')};
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
    color: ${(props) => (props?.color ? props.color : props.theme.textColor.primary)};
    font-size: ${(props) => (props?.fontSize ? props.fontSize : '20px')};
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
    width: ${(props) => (props?.width ? props.width : '100%')};
    margin: ${(props) => (props?.margin ? props.margin : '')};
    ${(props) => (props?.height ? `height: ${props.height}` : '')};
    display: flex;
    flex-direction: column;
    border: 0.8px solid ${(props) => (props?.borderColor ? props.borderColor : 'var(--card-border-color)')};
    border-style: ${(props) => (props?.borderStyle ? props.borderStyle : 'solid')};
    border-radius: 10px;
    justify-content: center;
    padding: ${(props) => (props?.padding ? props.padding : '5px 10px')};
    box-sizing: border-box;
    margin-bottom: 8px;
    position: relative;
    opacity: ${(props) => (props?.disabled ? '0.5 !important' : '1')};
    ${(props) => (props?.shadow ? `box-shadow: ${props.shadow}` : '')};
    background: ${(props) => (props?.background ? props.background : 'transparent')};
`;

ValueContainer.Value = Value;
ValueContainer.SubValue = SubValue;

Container.ValueContainer = ValueContainer;
Container.Title = Title;

export default Container;
