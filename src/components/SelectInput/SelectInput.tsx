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
            border: '1px solid #64d9fe',
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            color: state?.isFocused || state.isSelected ? ' var(--color-primary)' : '#64d9fe',
            backgroundColor: state?.isFocused || state.isSelected ? '#64d9fe' : ' var(--color-primary)',
            opacity: state.isSelected ? 0.7 : 1,
            cursor: 'pointer',
        }),
        control: (provided: any) => ({
            ...provided,
            backgroundColor: ' var(--color-primary)',
            borderColor: '#64d9fe',
            color: '#64d9fe',
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
            color: '#64d9fe',
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: '#64d9fe',
        }),
        dropdownIndicator: (provided: any) => ({
            ...provided,
            color: '#64d9fe',
            [':hover']: {
                ...provided[':hover'],
                color: '#64d9fe',
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
