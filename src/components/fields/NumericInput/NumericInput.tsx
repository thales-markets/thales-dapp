import Tooltip from 'components/TooltipV2';
import { DEFAULT_TOKEN_DECIMALS } from 'constants/defaults';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FieldContainer, FieldLabel, Input } from '../common';
import MuiTooltip from '@material-ui/core/Tooltip';
import { FlexDivCentered } from 'theme/common';
import { ReactComponent as balanceIcon } from 'assets/images/token/balance-icon.svg';
import SimpleLoader from 'pages/Token/components/SimpleLoader/SimpleLoader';

type NumericInputProps = {
    value: string | number;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    step?: string;
    max?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>, value: string) => void;
    showValidation?: boolean;
    validationMessage?: string;
    currencyLabel?: string;
    tooltip?: string;
    onMaxButton?: any;
    string?: number;
    balance?: string;
    isBalanceLoading?: boolean;
    inputPadding?: string;
    margin?: string;
    inputFontSize?: string;
};

const INVALID_CHARS = ['-', '+', 'e'];

const NumericInput: React.FC<NumericInputProps> = ({
    value,
    label,
    placeholder,
    disabled,
    step,
    max,
    onChange,
    showValidation,
    validationMessage,
    currencyLabel,
    tooltip,
    onMaxButton,
    balance,
    isBalanceLoading,
    inputPadding,
    margin,
    inputFontSize,
    ...rest
}) => {
    const { t } = useTranslation();

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        let trimmedValue = value;
        if (value.indexOf('.') > -1) {
            const numberOfDecimals = value.split('.')[1].length;
            if (numberOfDecimals > DEFAULT_TOKEN_DECIMALS) {
                trimmedValue = value.substring(0, value.length - 1);
            }
        }

        onChange(e, trimmedValue.replace(/,/g, '.').replace(/[e+-]/gi, ''));
    };

    return (
        <ValidationTooltip open={showValidation} title={validationMessage || ''} placement="bottom">
            <FieldContainer margin={margin}>
                {label && (
                    <FieldLabel>
                        {label}
                        {tooltip && <Tooltip overlay={tooltip} />}
                    </FieldLabel>
                )}
                {balance && (
                    <BalanceContainer>
                        <BalanceIcon />
                        {isBalanceLoading ? <SimpleLoader /> : balance}
                    </BalanceContainer>
                )}
                <StyledInput
                    {...rest}
                    value={value}
                    type="number"
                    onChange={handleOnChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={showValidation ? 'error' : ''}
                    onKeyDown={(e) => {
                        if (INVALID_CHARS.includes(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    min="0"
                    max={max || 'any'}
                    step={step || 'any'}
                    title=""
                    padding={inputPadding}
                    fontSize={inputFontSize}
                />
                <RightContainer>
                    {onMaxButton && (
                        <MaxButton disabled={disabled} onClick={onMaxButton}>
                            {t('common.max')}
                        </MaxButton>
                    )}
                    {currencyLabel && (
                        <CurrencyLabel className={disabled ? 'currency-label disabled' : 'currency-label'}>
                            {currencyLabel}
                        </CurrencyLabel>
                    )}
                </RightContainer>
            </FieldContainer>
        </ValidationTooltip>
    );
};

const StyledInput = styled(Input)<{ padding?: string }>`
    padding: ${(props) => props.padding || '5px 120px 5px 10px'};
`;

const RightContainer = styled(FlexDivCentered)`
    position: absolute;
    right: 0;
    bottom: 8px;
`;

const CurrencyLabel = styled.label`
    border-left: 2px solid ${(props) => props.theme.input.borderColor.primary};
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
    line-height: 15px;
    color: ${(props) => props.theme.button.textColor.quaternary};
    text-transform: uppercase;
    cursor: pointer;
    padding-right: 8px;
    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
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

const BalanceContainer = styled(FlexDivCentered)`
    position: absolute;
    right: 0;
    bottom: 40px;
    font-size: 15px;
    line-height: 18px;
    text-transform: uppercase;
    color: ${(props) => props.theme.input.textColor.primary};
`;

const BalanceIcon = styled(balanceIcon)`
    height: 15px;
    margin: 0 4px 2px 0;
`;

export default NumericInput;
