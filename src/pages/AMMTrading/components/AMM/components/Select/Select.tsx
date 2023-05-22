import React, { useState } from 'react';
import styled from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';
import { useTranslation } from 'react-i18next';

import { InputContainer } from 'theme/common';
import dropDown from 'assets/images/drop-down-white.svg';
import { withStyles } from '@material-ui/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { OrderPeriod } from 'constants/options';

import { TooltipType } from 'types/options';
import { TooltipStyles } from 'constants/ui';

type SelectPropsType = {
    title?: {
        text?: string;
        fontSize?: string;
        color?: string;
    };
    value?: {
        text?: string;
        fontSize?: string;
        color?: string;
    };
    tooltip?: {
        show?: boolean;
        type?: TooltipType;
        text?: string;
    };
    container?: {
        borderColor?: string;
        margin?: string;
        iconColor?: string;
    };
    options: {
        onChange?: (value: string) => void;
        onCustomChange?: (value: string | number) => void;
        showCustomInput?: boolean;
        customValue?: string | number;
        list: Array<any>;
        activeItem?: {
            backgroundColor?: string;
            color?: string;
        };
        inactiveItem?: {
            backgroundColor?: string;
            color?: string;
        };
        margin?: string;
        padding?: string;
    };
};

const Select: React.FC<SelectPropsType> = ({ title, value, tooltip, container, options }) => {
    const { t } = useTranslation();
    const [showDropdown, setDropdownState] = useState<boolean>(false);

    const selectedOption = value?.text ? options?.list.find((option: any) => option.value === value?.text) : undefined;

    const valueLabel = selectedOption
        ? selectedOption.label
        : value?.text === OrderPeriod.CUSTOM
        ? Number(options?.customValue) > 0
            ? Number(options?.customValue) > 1
                ? `${options?.customValue} ${t('options.common.time-remaining.hours')}`
                : `${options?.customValue} ${t('options.common.time-remaining.hour')}`
            : options?.customValue
        : '';

    const CustomTooltip = withStyles(() => ({
        tooltip: {
            minWidth: '100%',
            width: '100%',
            margin: '0',
            backgroundColor: TooltipStyles.error.backgroundColor,
            color: TooltipStyles.error.color,
            fontSize: TooltipStyles.error.fontSize,
        },
    }))(Tooltip);

    return (
        <>
            <OutsideClickHandler onOutsideClick={() => setDropdownState(false)}>
                <CustomTooltip open={tooltip?.show ? true : false} title={tooltip?.text ? tooltip.text : ''}>
                    <Wrapper
                        borderColor={container?.borderColor}
                        margin={container?.margin}
                        onClick={() => setDropdownState(!showDropdown)}
                    >
                        <Title color={title?.color} fontSize={title?.fontSize}>
                            {title?.text}
                        </Title>
                        <ValueContainer>
                            <Value value={valueLabel} color={value?.color} fontSize={value?.fontSize} readOnly />
                            <Arrow color={container?.iconColor} />
                        </ValueContainer>
                    </Wrapper>
                </CustomTooltip>
                <DropdownContainer>
                    <Dropdown show={showDropdown}>
                        {options?.showCustomInput && (
                            <CustomInputContainer>
                                <CustomInput
                                    value={options?.customValue}
                                    onChange={(e) => {
                                        if (options?.onChange && options?.onCustomChange) {
                                            options.onChange(OrderPeriod.CUSTOM);
                                            options.onCustomChange(e.target.value);
                                        }
                                    }}
                                    placeholder={t('modals.gwei.placeholder')}
                                />
                                <CustomInputLabel>
                                    {options?.customValue
                                        ? Number(options.customValue) > 1
                                            ? t('options.common.time-remaining.hours')
                                            : t('options.common.time-remaining.hour')
                                        : t('options.common.time-remaining.hour')}
                                </CustomInputLabel>
                            </CustomInputContainer>
                        )}
                        <ItemContainer>
                            {options?.list.map((option: any) => (
                                <Item
                                    onClick={() => {
                                        if (options?.onChange) {
                                            options.onChange(option.value);
                                        }
                                        setDropdownState(false);
                                    }}
                                    active={option?.value == value?.text ? true : false}
                                    key={option.value}
                                >
                                    {option.label}
                                </Item>
                            ))}
                        </ItemContainer>
                    </Dropdown>
                </DropdownContainer>
            </OutsideClickHandler>
        </>
    );
};

const Wrapper = styled(InputContainer)<{ borderColor?: string; margin?: string }>`
    ${(_props) => (_props?.borderColor ? `border-color: ${_props.borderColor};` : '')};
    ${(_props) => (_props?.margin ? `margin: ${_props.margin};` : '')};
    display: flex;
    flex-direction: column;
    padding: 5px 14px;
    width: 100%;
    &:active {
        box-shadow: 0px 1px 30px rgba(100, 217, 254, 0.7);
    }
    cursor: pointer;
`;

const DropdownContainer = styled.div`
    position: relative;
`;

const Dropdown = styled.div<{ show?: boolean }>`
    display: ${(_props) => (_props?.show ? 'flex' : 'none')};
    position: absolute;
    z-index: 1;
    width: 100%;
    background-color: var(--background);
    border: 0.8px solid ${(_props) => (_props?.show ? 'var(--input-border-color)' : 'var(--card-border-color)')};
    border-radius: 15px;
    ${(_props) => (_props?.show ? 'flex-direction: column' : '')};
`;

const ItemContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    padding: 0px 20px;
    margin-top: 10px;
    margin-bottom: 20px;
`;

const Item = styled.span<{ active?: boolean }>`
    cursor: pointer;
    padding: 6px 22px;
    font-weight: 500;
    font-size: 12px;
    border-radius: 30px;
    margin-top: 10px;
    margin-right: 10px;
    margin-left: 10px;
    text-transform: uppercase;
    border: 1px solid var(--input-border-color);
    background-color: ${(_props) => (_props?.active ? 'var(--button-bg-active)' : 'var(--button-bg-inactive)')};
    color: ${(_props) => (_props?.active ? 'var(--button-text-active)' : 'var(--button-text-inactive)')};
    ${(_props) => (_props?.active ? `box-shadow: var(--shadow)` : '')};
`;

const CustomInputContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 6px;
    padding: 5px 10px;
    border: 0.8px solid var(--card-border-color);
    border-radius: 10px;
`;

const CustomInput = styled.input`
    font-weight: 600;
    color: ${(props) => props.theme.textColor.primary};
    font-size: 15px;
    background: transparent;
    border: none;
    padding: 0;
    width: 80%;
    &:focus {
        border: none;
        outline: none;
    }
    &:-webkit-input-placeholder {
        color: ${(props) => props.theme.textColor.primary};
        opacity: 0.7;
    }
    &:-ms-input-placeholder {
        color: ${(props) => props.theme.textColor.primary};
        opacity: 0.7;
    }
    &::placeholder {
        color: ${(props) => props.theme.textColor.primary};
        opacity: 0.7;
    }
`;

const CustomInputLabel = styled.span`
    font-weight: 600;
    color: ${(props) => props.theme.textColor.primary};
    font-size: 15px;
`;

const Title = styled.div<{ color?: string; fontSize?: string }>`
    font-weight: 400;
    margin-bottom: 5px;
    text-transform: uppercase;
    color: ${(_props) => (_props?.color ? _props.color : 'var(--input-border-color)')};
    font-size: ${(_props) => (_props?.fontSize ? _props.fontSize : '14px')};
`;

const ValueContainer = styled.div`
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
    width: 90%;
    &:focus {
        border: none;
        outline: none;
    }
`;

const Arrow = styled.i<{ color?: string }>`
    content: url(${dropDown});
    color: ${(_props) => (_props?.color ? _props.color : _props.theme.textColor.primary)};
    font-size: 18px;
`;

export default Select;
