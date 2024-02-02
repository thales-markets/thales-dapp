import React from 'react';
import Select, {
    ControlProps,
    GroupTypeBase,
    IndicatorProps,
    MenuProps,
    OptionProps,
    OptionTypeBase,
    ValueType,
    components,
} from 'react-select';
import styled, { CSSObject, useTheme } from 'styled-components';
import { ThemeInterface } from 'types/ui';

type SelectOption = { value: number | string; label: string };

type SelectInputProps = {
    options: Array<SelectOption>;
    handleChange: (value: number | undefined | null) => void;
    defaultValue?: number;
    width?: number | string;
    height?: number;
    fontSize?: number;
    isDisabled?: boolean;
};

const SelectInput: React.FC<SelectInputProps> = ({
    options,
    handleChange,
    defaultValue,
    width,
    height,
    fontSize,
    isDisabled,
}) => {
    const theme: ThemeInterface = useTheme();
    const defaultOption = options[defaultValue ? defaultValue : 0];

    const customStyled = {
        container: (base: CSSObject) => ({ ...base, width: '100%' }),
        menu: (base: CSSObject, props: MenuProps<OptionTypeBase, boolean, GroupTypeBase<OptionTypeBase>>) => ({
            ...base,
            width: '100%',
            color: props.selectProps.menuColor,
            backgroundColor: theme.background.secondary,
            border: `1px solid ${theme.borderColor.primary}`,
            marginTop: 5,
            borderRadius: 8,
            overflow: 'auto',
            fontSize: fontSize || 16,
        }),
        menuList: (base: CSSObject) => ({
            ...base,
            padding: '4px',
        }),
        option: (base: CSSObject, props: OptionProps<OptionTypeBase, boolean, GroupTypeBase<OptionTypeBase>>) => ({
            ...base,
            color: theme.textColor.primary,
            backgroundColor: props?.isFocused ? theme.background.primary : 'transparent',
            cursor: 'pointer',
            borderRadius: 8,
        }),
        control: (base: CSSObject, props: ControlProps<OptionTypeBase, boolean, GroupTypeBase<OptionTypeBase>>) => ({
            ...base,
            backgroundColor: theme.background.secondary,
            borderColor: theme.borderColor.primary,
            color: theme.textColor.secondary,
            borderRadius: '8px',
            width: width,
            minHeight: height || 38,
            cursor: 'pointer',
            boxShadow: 'none',
            '&:hover': {
                border: `1px solid ${theme.borderColor.quaternary}`,
                boxShadow: 'none',
            },
            opacity: props.isDisabled ? 0.4 : 1,
            fontSize: fontSize || 16,
            lineHeight: 20,
        }),
        placeholder: (base: CSSObject) => ({
            ...base,
            color: theme.textColor.primary,
        }),
        singleValue: (base: CSSObject) => ({
            ...base,
            color: theme.textColor.primary,
        }),
        indicatorSeparator: () => ({
            display: 'none',
        }),
        dropdownIndicator: (base: CSSObject) => ({
            ...base,
            color: theme.textColor.quaternary,
            [':hover']: {
                ...base[':hover'],
                color: theme.textColor.quaternary,
            },
        }),
    };

    return (
        <Select
            components={{ DropdownIndicator }}
            value={defaultOption}
            options={options}
            styles={customStyled}
            onChange={(props: ValueType<OptionTypeBase, boolean>) =>
                handleChange(Number((props as SelectOption).value))
            }
            defaultValue={defaultOption}
            isSearchable={false}
            isDisabled={isDisabled}
        />
    );
};

const DropdownIndicator: React.FC<IndicatorProps<OptionTypeBase, boolean, GroupTypeBase<OptionTypeBase>>> = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            <Icon className={`icon ${props.selectProps.menuIsOpen ? 'icon--caret-up' : 'icon--caret-down'}`} />
        </components.DropdownIndicator>
    );
};

const Icon = styled.i`
    font-size: 12px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.quaternary};
`;

export default SelectInput;
