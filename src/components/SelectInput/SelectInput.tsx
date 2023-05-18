import React from 'react';
import Select from 'react-select';

type SelectOptions = Array<{ value: number | string; label: string }>;

type SelectInputProps = {
    options: SelectOptions;
    handleChange: (value: number | undefined | null) => void;
    defaultValue?: number;
    width?: number;
    isDisabled?: boolean;
};

const SelectInput: React.FC<SelectInputProps> = ({ options, handleChange, defaultValue, width, isDisabled }) => {
    const defaultOption = options[defaultValue ? defaultValue : 0];

    const customStyled = {
        menu: (provided: any, state: any) => ({
            ...provided,
            width: '100%',
            color: state.selectProps.menuColor,
            backgroundColor: '#181A20',
            border: '1px solid #848e9c',
            marginTop: 5,
            borderRadius: 15,
            overflow: 'auto',
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            color: '#FFFFFF',
            backgroundColor: state?.isFocused || state.isSelected ? '#2B3139' : 'transparent',
            opacity: state.isSelected && !state?.isFocused ? 0.8 : 1,
            cursor: 'pointer',
        }),
        control: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: '#181A20',
            borderColor: '#848e9c',
            color: '#848e9c',
            borderRadius: '15px',
            width: width,
            cursor: 'pointer',
            boxShadow: 'none',
            '&:hover': {
                border: '1px solid #03DAC5',
                boxShadow: 'none',
            },
            opacity: state.isDisabled ? 0.4 : 1,
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: '#FFFFFF',
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: '#FFFFFF',
        }),
        dropdownIndicator: (provided: any) => ({
            ...provided,
            color: '#FFFFFF',
            [':hover']: {
                ...provided[':hover'],
                color: '#FFFFFF',
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
