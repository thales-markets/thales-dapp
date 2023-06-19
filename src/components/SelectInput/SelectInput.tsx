import React from 'react';
import Select from 'react-select';
import { ThemeInterface } from 'types/ui';
import { useTheme } from 'styled-components';

type SelectOptions = Array<{ value: number | string; label: string }>;

type SelectInputProps = {
    options: SelectOptions;
    handleChange: (value: number | undefined | null) => void;
    defaultValue?: number;
    width?: number;
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
        menu: (provided: any, state: any) => ({
            ...provided,
            width: '100%',
            color: state.selectProps.menuColor,
            backgroundColor: theme.background.primary,
            border: `1px solid ${theme.borderColor.secondary}`,
            marginTop: 5,
            borderRadius: 15,
            overflow: 'auto',
            fontSize: fontSize || 16,
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            color: theme.textColor.primary,
            backgroundColor: state?.isFocused || state.isSelected ? theme.background.secondary : 'transparent',
            opacity: state.isSelected && !state?.isFocused ? 0.7 : 1,
            cursor: 'pointer',
        }),
        control: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: theme.background.primary,
            borderColor: theme.borderColor.secondary,
            color: theme.textColor.secondary,
            borderRadius: '15px',
            width: width,
            minHeight: height || 38,
            cursor: 'pointer',
            boxShadow: 'none',
            '&:hover': {
                border: `1px solid ${theme.borderColor.quaternary}`,
                boxShadow: 'none',
            },
            opacity: state.isDisabled ? 0.4 : 1,
            fontSize: fontSize || 16,
            lineHeight: 20,
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: theme.textColor.primary,
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: theme.textColor.primary,
        }),
        dropdownIndicator: (provided: any) => ({
            ...provided,
            color: theme.textColor.primary,
            [':hover']: {
                ...provided[':hover'],
                color: theme.textColor.primary,
            },
        }),
    };

    return (
        <Select
            value={defaultOption}
            options={options}
            styles={customStyled}
            onChange={(props) => {
                handleChange(Number(props?.value));
            }}
            defaultValue={defaultOption}
            isSearchable={false}
            isDisabled={isDisabled}
        />
    );
};

export default SelectInput;
