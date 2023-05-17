import React from 'react';
import Select from 'react-select';

type SelectOptions = Array<{ value: number | string; label: string }>;

type SelectInputProps = {
    options: SelectOptions;
    handleChange: (value: number | undefined | null) => void;
    defaultValue?: number;
    width?: number;
};

const SelectInput: React.FC<SelectInputProps> = ({ options, handleChange, defaultValue, width }) => {
    const defaultOption = options[defaultValue ? defaultValue : 0];

    const customStyled = {
        menu: (provided: any, state: any) => ({
            ...provided,
            width: '100%',
            color: state.selectProps.menuColor,
            backgroundColor: ' var(--color-primary)',
            border: '1px solid var(--color-highlight)',
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            color: state?.isFocused || state.isSelected ? ' var(--color-primary)' : 'var(--color-highlight)',
            backgroundColor: state?.isFocused || state.isSelected ? 'var(--color-highlight)' : ' var(--color-primary)',
            opacity: state.isSelected ? 0.7 : 1,
            cursor: 'pointer',
        }),
        control: (provided: any) => ({
            ...provided,
            backgroundColor: ' var(--color-primary)',
            borderColor: 'var(--color-highlight)',
            color: 'var(--color-highlight)',
            borderRadius: '15px',
            ':hover': {
                ...provided[':hover'],
                boxShadow: '0px 1px 15px rgba(100, 217, 254, 0.7)',
            },
            width: width,
            cursor: 'pointer',
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: 'var(--color-highlight)',
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: 'var(--color-highlight)',
        }),
        dropdownIndicator: (provided: any) => ({
            ...provided,
            color: 'var(--color-highlight)',
            [':hover']: {
                ...provided[':hover'],
                color: 'var(--color-highlight)',
            },
        }),
    };

    return (
        <Select
            options={options}
            styles={customStyled}
            onChange={(_props) => {
                handleChange(Number(_props?.value));
            }}
            defaultValue={defaultOption}
        />
    );
};

export default SelectInput;
