import Tooltip from 'components/Tooltip';
import React from 'react';
import styled from 'styled-components';
import { FieldContainer, FieldLabel, Input } from '../common';
import MuiTooltip from '@material-ui/core/Tooltip';
import { FlexDivCentered } from 'styles/common';

type TextInputProps = {
    value: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    onChange?: any;
    showValidation?: boolean;
    validationMessage?: string;
    tooltip?: string;
    inputPadding?: string;
    margin?: string;
    inputFontSize?: string;
    width?: string;
    height?: string;
    iconClass?: string;
    onIconClick?: () => void;
};

const TextInput: React.FC<TextInputProps> = ({
    value,
    label,
    placeholder,
    disabled,
    onChange,
    showValidation,
    validationMessage,
    tooltip,
    inputPadding,
    margin,
    inputFontSize,
    width,
    height,
    iconClass,
    onIconClick,
    ...rest
}) => {
    return (
        <ValidationTooltip open={showValidation} title={validationMessage || ''} placement="bottom">
            <FieldContainer margin={margin}>
                {label && (
                    <FieldLabel>
                        {label}
                        {tooltip && <Tooltip overlay={tooltip} />}:
                    </FieldLabel>
                )}
                <StyledInput
                    {...rest}
                    value={value}
                    type="text"
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={showValidation ? 'error' : ''}
                    title=""
                    padding={inputPadding}
                    fontSize={inputFontSize}
                    width={width}
                    height={height}
                />
                <RightContainer>
                    {onIconClick && (
                        <Icon
                            className={
                                disabled
                                    ? `${iconClass || 'icon icon--search'} disabled`
                                    : iconClass || 'icon icon--search'
                            }
                            onClick={onIconClick}
                        />
                    )}
                </RightContainer>
            </FieldContainer>
        </ValidationTooltip>
    );
};

const StyledInput = styled(Input)<{ padding?: string }>`
    padding: ${(props) => props.padding || '5px 10px 5px 10px'};
`;

const RightContainer = styled(FlexDivCentered)`
    position: absolute;
    right: 0;
    bottom: 10px;
`;

const Icon = styled.i`
    font-size: 15px;
    color: ${(props) => props.theme.borderColor.secondary};
    padding-right: 10px;
    cursor: pointer;
    &.disabled {
        opacity: 0.4;
        cursor: default;
    }
`;

const ValidationTooltip = styled((props) => <MuiTooltip classes={{ popper: props.className }} {...props} />)`
    & .MuiTooltip-tooltip {
        margin: -10px 0 0 0;
        padding: 2px 4px;
        font-weight: 600;
        font-size: 13px;
        line-height: 15px;
        color: ${(props) => props.theme.input.textColor.quaternary};
        background-color: ${(props) => props.theme.background.primary};
        text-align: center;
        max-width: 320px;
    }
`;

export default TextInput;
