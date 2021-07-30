import React, { useState } from 'react';
import styled from 'styled-components';
import { FlexDiv } from 'theme/common';
import dropDown from 'assets/images/drop-down-white.svg';
import ExpirationDropdownBody from './ExpirationDropdownBody';
import OutsideClickHandler from 'react-outside-click-handler';
import { ExpirationOptions } from 'types/options';
import { OrderPeriod } from 'constants/options';

type ExpirationDropdownProps = {
    value?: string;
    onChange: (option: string) => void;
    customValue: number | string;
    onCustomChange: (value: string | number) => void;
    expirationOptions: ExpirationOptions;
    disabled?: boolean;
};

export const ExpirationDropdown: React.FC<ExpirationDropdownProps> = ({
    value,
    onChange,
    customValue,
    onCustomChange,
    expirationOptions,
    disabled,
}: ExpirationDropdownProps) => {
    const [expirationDropdownIsOpen, setExpirationDropdownIsOpen] = useState(false);
    const setDropdownIsOpen = (isOpen: boolean) => {
        if (!isOpen && !expirationDropdownIsOpen) {
            return;
        }
        setExpirationDropdownIsOpen(isOpen);
    };

    const selectedOption = value ? expirationOptions.find((option) => option.value === value) : undefined;

    const valueLabel = selectedOption
        ? selectedOption.label
        : value === OrderPeriod.CUSTOM
        ? Number(customValue) > 0
            ? `${customValue} hours`
            : customValue
        : '';

    return (
        <OutsideClickHandler onOutsideClick={() => setDropdownIsOpen(false)}>
            <Select
                onClick={() => {
                    disabled ? null : setDropdownIsOpen(!expirationDropdownIsOpen);
                }}
                className={disabled ? 'disabled' : ''}
                expirationDropdownIsOpen={expirationDropdownIsOpen}
            >
                <Text>{valueLabel}</Text>
            </Select>
            {expirationDropdownIsOpen && (
                <ExpirationDropdownBody
                    value={value}
                    onChange={onChange}
                    customValue={customValue}
                    onCustomChange={onCustomChange}
                    expirationOptions={expirationOptions}
                    setDropdownIsOpen={setDropdownIsOpen}
                />
            )}
        </OutsideClickHandler>
    );
};

const Select = styled(FlexDiv)<{ expirationDropdownIsOpen: boolean }>`
    position: relative;
    display: block;
    height: 64px;
    padding-left: 6px;
    padding-right: 30px;
    background: #0a2e66;
    border: 2px solid ${(props) => (props.expirationDropdownIsOpen ? '#00f9ff' : '#0a2e66')};
    border-radius: 12px;
    color: #f6f6fe !important;
    &:after {
        content: url(${dropDown});
        position: absolute;
        right: 8px;
        top: 20px;
    }
    &:hover {
        cursor: pointer;
    }
    &.disabled {
        opacity: 0.4;
        cursor: default;
    }
`;

const Text = styled.div`
    padding: 29px 0px 0 14px;
    outline: 0;
    font-size: 16px;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: #f6f6fe;
    width: 100%;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 60px;
`;

export default ExpirationDropdown;
