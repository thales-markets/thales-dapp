import React, { ChangeEvent, CSSProperties } from 'react';
import styled from 'styled-components';

type CheckboxPropsType = {
    checked?: boolean;
    container?: {
        size?: string;
        margin?: string;
    };
    wrapperStyle?: CSSProperties;
    checkbox?: {
        margin?: string;
    };
    label?: {
        text?: string;
        fontSize?: string;
        color?: string;
    };
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
};

const Checkbox: React.FC<CheckboxPropsType> = ({
    checked,
    container,
    wrapperStyle,
    checkbox,
    label,
    onChange,
    disabled,
}) => {
    return (
        <Wrapper style={wrapperStyle}>
            {label?.text && (
                <Label fontSize={label?.fontSize} color={label?.color}>
                    {label?.text ? label.text : ''}
                </Label>
            )}
            <CheckboxContainer checked={checked} inputSize={container?.size} margin={container?.margin}>
                <HiddenCheckbox checked={checked} disabled={disabled} onChange={onChange} />
                <StyledCheckbox checked={checked} size={container?.size} margin={checkbox?.margin}>
                    <Icon checked={checked} viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                    </Icon>
                </StyledCheckbox>
            </CheckboxContainer>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const Label = styled.span<{ fontSize?: string; color?: string }>`
    color: ${(props) => (props?.color ? props?.color : 'var(--color-white)')};
    font-size: ${(props) => (props?.fontSize ? props?.fontSize : '24px')};
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })<{ size?: string }>`
    border: 0;
    opacity: 0;
    height: ${(props) => (props?.size ? props.size : '32px')};
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: ${(props) => (props?.size ? props.size : '32px')};
`;

const CheckboxContainer = styled.div<{ checked?: boolean; inputSize?: string; margin?: string }>`
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: ${(props) => (props?.checked ? '1 !important' : '0.5 !important')};
    ${(props) => (props?.margin ? `margin: ${props.margin}` : '')};
    ${HiddenCheckbox} {
        width: ${(props) => (props?.inputSize ? props.inputSize : '32px')};
        height: ${(props) => (props?.inputSize ? props.inputSize : '32px')};
    }
`;

const Icon = styled.svg<{ checked?: boolean }>`
    stroke: ${(props) => (props?.checked ? 'var(--input-border-color)' : 'var(--card-border-color)')};
    fill: none;
    stroke-width: 2px;
`;

const StyledCheckbox = styled.div<{ checked?: boolean; size?: string; margin?: string }>`
    cursor: pointer;
    display: inline-block;
    width: ${(props) => (props?.size ? props?.size : '32px')};
    height: ${(props) => (props?.size ? props?.size : '32px')};
    background: transparent;
    margin: ${(props) => (props?.margin ? props.margin : '')};
    border-radius: 3px;
    transition: all 150ms;
    border: 1px solid ${(props) => (props?.checked ? 'var(--input-border-color)' : 'var(--card-border-color)')};
    ${HiddenCheckbox}:focus + & {
        box-shadow: 0 0 0 2px rgba(4, 4, 90, 0.4);
    }
    ${Icon} {
        visibility: ${(props) => (props?.checked ? 'visible' : 'hidden')};
    }
`;

export default Checkbox;
