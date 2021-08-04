import { OrderPeriod } from 'constants/options';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ExpirationOptions } from 'types/options';

type ExpirationDropdownBodyProps = {
    setDropdownIsOpen: (isOpen: boolean) => void;
    value?: string;
    onChange: (option: string) => void;
    customValue: number | string;
    onCustomChange: (value: string | number) => void;
    expirationOptions: ExpirationOptions;
};

const ExpirationDropdownBody: React.FC<ExpirationDropdownBodyProps> = ({
    setDropdownIsOpen,
    value,
    onChange,
    onCustomChange,
    expirationOptions,
}) => {
    const { t } = useTranslation();
    const [localCustomValue, setLocalCustomValue] = useState<string>('');

    useEffect(() => {
        if (localCustomValue) {
            onCustomChange(localCustomValue);
        }
    }, [localCustomValue]);

    return (
        <Container>
            <DropDown>
                <Option>
                    <InputContainer>
                        <Input
                            value={localCustomValue}
                            onChange={(e) => {
                                onChange(OrderPeriod.CUSTOM);
                                setLocalCustomValue(e.target.value);
                            }}
                            placeholder={t('modals.gwei.placeholder')}
                            type="number"
                            step="any"
                            min="0"
                            max="any"
                        />
                        <HoursLabel>hours</HoursLabel>
                    </InputContainer>
                </Option>
                {expirationOptions.map((option: any) => (
                    <Option
                        onClick={() => {
                            onChange(option.value);
                            setDropdownIsOpen(false);
                        }}
                        className={option.value == value ? 'selected' : ''}
                        key={option.value}
                    >
                        <span>{option.label}</span>
                    </Option>
                ))}
            </DropDown>
        </Container>
    );
};

const Container = styled.div`
    position: relative;
`;

const DropDown = styled.ul`
    position: absolute;
    right: 0;
    width: 100%;
    height: 262px;
    z-index: 1;
    padding: 4px;
    margin: 2px 0;
    background: #0a2e66;
    border-radius: 12px;
    list-style: none;
`;

const Option = styled.li`
    font-weight: bold;
    font-size: 13px;
    line-height: 24px;
    letter-spacing: 0.4px;
    color: #f6f6fe;
    border: 1px solid #0a2e66;
    cursor: pointer;
    &:not(:first-child) {
        padding: 8px 14px;
        &:hover {
            background: rgba(45, 131, 210, 0.3);
            border-radius: 10px;
            color: #b8c6e5;
        }
    }
    &.selected {
        background: #0a2e66;
        border: 1px solid #00f9ff;
        border-radius: 10px;
    }
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

const Input = styled.input`
    background: #0a2e66;
    border: 1px solid rgba(45, 131, 210, 0.5);
    border-radius: 7px;
    display: block;
    height: 40px;
    margin: 0px 0px 2px 0px;
    padding: 0 60px 0 16px;
    text-overflow: ellipsis;
    outline: none !important;
    font-size: 14px;
    letter-spacing: 0.25px;
    font-weight: bold;
    width: 100%;
    color: #f6f6fe;
    &::selection {
        color: #04045a;
        background: #f6f6fe;
    }
    &:focus {
        border: 1px solid #00f9ff;
    }
`;

export const HoursLabel = styled.label`
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: #f6f6fe;
    pointer-events: none;
    position: absolute;
    padding: 12px 16px 17px 0;
    right: 0;
    &.disabled {
        opacity: 0.4;
        cursor: default;
    }
`;

export const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
`;

export default ExpirationDropdownBody;
