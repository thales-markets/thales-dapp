import Tooltip from 'components/Tooltip';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FieldContainer, FieldLabel, Input } from '../common';
import MuiTooltip from '@material-ui/core/Tooltip';
import { FlexDivCentered } from 'styles/common';
import { ReactComponent as BalanceIcon } from 'assets/images/token/balance-icon.svg';
import InlineLoader from 'components/InlineLoader';

type TimeInputProps = {
    value: string | number;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    step?: string;
    min?: string;
    max?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>, value: string) => void;
    showValidation?: boolean;
    validationMessage?: string;
    currencyComponent?: any;
    currencyLabel?: string;
    tooltip?: string;
    onMaxButton?: any;
    balance?: string;
    isBalanceLoading?: boolean;
    info?: string;
    inputPadding?: string;
    margin?: string;
    inputFontSize?: string;
    width?: string;
    height?: string;
    enableCurrencyComponentOnly?: boolean;
    validationMargin?: string;
};

const INVALID_CHARS = ['-', '+', 'e', '.'];

const TimeInput: React.FC<TimeInputProps> = ({
    value,
    label,
    placeholder,
    disabled,
    step,
    min,
    max,
    onChange,
    showValidation,
    validationMessage,
    currencyComponent,
    currencyLabel,
    tooltip,
    onMaxButton,
    balance,
    isBalanceLoading,
    info,
    inputPadding,
    margin,
    inputFontSize,
    width,
    height,
    enableCurrencyComponentOnly,
    validationMargin,
    ...rest
}) => {
    const { t } = useTranslation();

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>, min?: string, max?: string) => {
        const { value } = e.target;
        let trimmedValue = value;

        if (value.length > 2) {
            trimmedValue = value.substring(1, 3);
        } else if (value.length < 2) {
            trimmedValue = value.padStart(2, '0');
        }
        if (min && Number(trimmedValue) < Number(min)) {
            trimmedValue = min.padStart(2, '0');
        }
        if (max && Number(trimmedValue) > Number(max)) {
            trimmedValue = max.padStart(2, '0');
        }

        onChange(e, trimmedValue);
    };

    return (
        <ValidationTooltip
            open={showValidation}
            title={validationMessage || ''}
            placement="bottom"
            margin={validationMargin}
        >
            <FieldContainer margin={margin}>
                {label && (
                    <FieldLabel>
                        {label}
                        {tooltip && <Tooltip overlay={tooltip} />}:
                    </FieldLabel>
                )}
                {balance && (
                    <BalanceContainer>
                        <StyledBalanceIcon />
                        {isBalanceLoading ? <InlineLoader /> : balance}
                    </BalanceContainer>
                )}
                {info && (
                    <InfoWrapper>
                        <InfoText>{info}</InfoText>
                    </InfoWrapper>
                )}
                <StyledInput
                    {...rest}
                    value={value}
                    type="number"
                    onChange={(e) => handleOnChange(e, min, max)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={showValidation ? 'error' : ''}
                    onKeyDown={(e) => {
                        if (INVALID_CHARS.includes(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    min={min || '0'}
                    max={max || 'any'}
                    step={step || 'any'}
                    title=""
                    padding={inputPadding}
                    fontSize={inputFontSize}
                    width={width}
                    height={height}
                />
                <RightContainer>
                    {onMaxButton && (
                        <MaxButton disabled={disabled} onClick={onMaxButton}>
                            {t('common.max')}
                        </MaxButton>
                    )}
                    {currencyLabel && (
                        <CurrencyLabel
                            className={disabled ? 'currency-label disabled' : 'currency-label'}
                            hasSeparator={onMaxButton}
                        >
                            {currencyLabel}
                        </CurrencyLabel>
                    )}
                    {currencyComponent && (
                        <CurrencyComponentContainer
                            className={disabled && !enableCurrencyComponentOnly ? 'disabled' : ''}
                            hasSeparator={onMaxButton}
                        >
                            {currencyComponent}
                        </CurrencyComponentContainer>
                    )}
                </RightContainer>
            </FieldContainer>
        </ValidationTooltip>
    );
};

const StyledInput = styled(Input)<{ padding?: string }>`
    padding: ${(props) => props.padding || '5px 120px 5px 10px'};
    text-align: center;
`;

const RightContainer = styled(FlexDivCentered)`
    position: absolute;
    right: 0;
    bottom: 6px;
`;

const CurrencyLabel = styled.label<{ hasSeparator?: boolean }>`
    border-left: ${(props) => (props.hasSeparator ? `2px solid ${props.theme.input.borderColor.primary}` : 'none')};
    font-weight: bold;
    font-size: 13px;
    line-height: 20px;
    color: ${(props) => props.theme.input.textColor.primary};
    padding-left: 8px;
    padding-right: 12px;
    pointer-events: none;
    &.disabled {
        opacity: 0.4;
        cursor: default;
    }
`;

const MaxButton = styled.button`
    background: transparent;
    border: none;
    font-weight: 700;
    font-size: 13px;
    line-height: 20px;
    color: ${(props) => props.theme.button.textColor.quaternary};
    text-transform: uppercase;
    cursor: pointer;
    padding-right: 8px;
    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
`;

const ValidationTooltip = styled((props) => <MuiTooltip classes={{ popper: props.className }} {...props} />)<{
    margin?: string;
}>`
    & .MuiTooltip-tooltip {
        margin: ${(props) => (props.margin ? props.margin : '-10px 0 0 0')};
        padding: 2px 0;
        font-weight: 600;
        font-size: 13px;
        line-height: 15px;
        color: ${(props) => props.theme.input.textColor.quaternary};
        background-color: ${(props) => props.theme.background.primary};
        text-align: center;
        max-width: 320px;
    }
`;

const BalanceContainer = styled(FlexDivCentered)`
    position: absolute;
    right: 0;
    bottom: 40px;
    font-weight: normal;
    font-size: 13px;
    line-height: 15px;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.quaternary};
`;

const StyledBalanceIcon = styled(BalanceIcon)`
    height: 13px;
    margin: 0 2px 1px 0;
    path {
        fill: ${(props) => props.theme.textColor.quaternary};
    }
`;

const CurrencyComponentContainer = styled(FlexDivCentered)<{ hasSeparator?: boolean }>`
    ${(props) => (props.hasSeparator ? `border-left: 2px solid ${props.theme.input.borderColor.primary};` : '')}
    line-height: 15px;
    padding-right: 2px;
    &.disabled {
        opacity: 0.4;
        cursor: default;
    }
`;

const InfoWrapper = styled.div`
    position: absolute;
    top: -8px;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    width: fit-content;
    background: ${(props) => props.theme.background.primary};
    padding: 0 5px;
    z-index: 1;
`;

const InfoText = styled.span`
    font-size: 13px;
    line-height: 16px;
    color: ${(props) => props.theme.textColor.secondary};
    text-transform: uppercase;
`;

export default TimeInput;
