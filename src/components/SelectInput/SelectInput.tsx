import React from 'react';
import Select from 'react-select';
import { Colors } from 'theme/common';

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
    const defaultOption = options[defaultValue ? defaultValue : 0];

    const customStyled = {
        menu: (provided: any, state: any) => ({
            ...provided,
            width: '100%',
            color: state.selectProps.menuColor,
            backgroundColor: Colors.GRAY_DARK,
            border: `1px solid ${Colors.GRAY_LIGHT}`,
            marginTop: 5,
            borderRadius: 15,
            overflow: 'auto',
            fontSize: fontSize || 16,
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            color: Colors.WHITE,
            backgroundColor: state?.isFocused || state.isSelected ? Colors.GRAY : 'transparent',
            opacity: state.isSelected && !state?.isFocused ? 0.7 : 1,
            cursor: 'pointer',
        }),
        control: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: Colors.GRAY_DARK,
            borderColor: Colors.GRAY_LIGHT,
            color: Colors.GRAY_LIGHT,
            borderRadius: '15px',
            width: width,
            minHeight: height || 38,
            cursor: 'pointer',
            boxShadow: 'none',
            '&:hover': {
                border: `1px solid ${Colors.GREEN}`,
                boxShadow: 'none',
            },
            opacity: state.isDisabled ? 0.4 : 1,
            fontSize: fontSize || 16,
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: Colors.WHITE,
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: Colors.WHITE,
        }),
        dropdownIndicator: (provided: any) => ({
            ...provided,
            color: Colors.WHITE,
            [':hover']: {
                ...provided[':hover'],
                color: Colors.WHITE,
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
