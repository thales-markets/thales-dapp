import Tooltip from 'components/TooltipV2';
import React from 'react';
import styled from 'styled-components';
import { FieldContainer, FieldLabel, Input } from '../common';
import MuiTooltip from '@material-ui/core/Tooltip';

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
    ...rest
}) => {
    return (
        <ValidationTooltip open={showValidation} title={validationMessage || ''} placement="bottom">
            <FieldContainer margin={margin}>
                {label && (
                    <FieldLabel>
                        {label}
                        {tooltip && <Tooltip overlay={tooltip} />}
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
                />
            </FieldContainer>
        </ValidationTooltip>
    );
};

const StyledInput = styled(Input)<{ padding?: string }>`
    padding: ${(props) => props.padding || '5px 10px 5px 10px'};
`;

const ValidationTooltip = styled((props) => <MuiTooltip classes={{ popper: props.className }} {...props} />)`
    & .MuiTooltip-tooltip {
        margin: -10px 0 0 0;
        padding: 2px 8px;
        font-weight: 600;
        font-size: 13px;
        line-height: 15px;
        color: ${(props) => props.theme.input.textColor.quaternary};
        background-color: ${(props) => props.theme.background.primary};
        text-align: center;
    }
`;

export default TextInput;
