import styled from 'styled-components';

export const Title = styled.div<{ color?: string; fontSize?: string }>`
    font-family: Titillium Regular !important;
    font-weight: 400;
    margin-bottom: 5px;
    text-transform: uppercase;
    color: ${(props) => (props?.color ? props.color : props.theme.input.borderColor.primary)};
    font-size: ${(props) => (props?.fontSize ? props.fontSize : '14px')};
`;

export const ValueContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
`;

export const Value = styled.input<{ color?: string; fontSize?: string; disabled: boolean }>`
    font-family: Titillium Regular !important;
    font-weight: 400;
    color: ${(props) => (props?.color ? props.color : props.theme.input.textColor.primary)};
    font-size: ${(props) => (props?.fontSize ? props.fontSize : '18px')};
    text-transform: capitalize;
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'initial')};
    background: transparent;
    border: none;
    padding: 0;
    width: 80%;
    &:focus {
        border: none;
        outline: none;
    }
    ::placeholder {
        color: ${(props) => props.theme.input.textColor.secondary};
    }
`;

export const Container = styled.div<{
    disabled?: boolean;
    width?: string;
    height?: string;
    margin?: string;
    padding?: string;
    zIndex?: number;
    isFocused?: boolean;
    isError?: boolean;
}>`
    width: ${(props) => (props?.width ? props.width : '100%')};
    ${(props) => (props?.margin ? `margin: ${props.margin};` : '')}
    ${(props) => (props?.height ? `height: ${props.height};` : '')}
    display: flex;
    flex-direction: column;
    border: 1px solid
        ${(props) =>
            props.isError
                ? props.theme.input.borderColor.error.primary
                : props.isFocused
                ? props.theme.input.borderColor.focus.primary
                : props.theme.input.borderColor.primary};
    border-radius: 10px;
    justify-content: center;
    padding: ${(props) => (props?.padding ? props.padding : '5px 10px')};
    box-sizing: border-box;
    margin-bottom: 8px;
    position: relative;
    opacity: ${(props) => (props?.disabled ? '0.5 !important' : '1')};
    background: transparent;
    ${(props) => (props?.zIndex ? `z-index: ${props.zIndex};` : '')}
`;
