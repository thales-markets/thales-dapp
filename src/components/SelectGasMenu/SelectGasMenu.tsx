import React, { useState } from 'react';
import styled from 'styled-components';
import { FlexDiv } from 'theme/common';
import { formatCurrency } from 'utils/formatters/number';
import dropDown from 'assets/images/drop-down.svg';
import SelectGasMenuBody from './SelectGasMenuBody';
import OutsideClickHandler from 'react-outside-click-handler';

type SelectGasMenuProps = {
    gasPrice: number | null;
    disabled?: boolean;
};

export const SelectGasMenu: React.FC<SelectGasMenuProps> = ({ gasPrice, disabled }: SelectGasMenuProps) => {
    const [gasDropdownIsOpen, setGasDropdownIsOpen] = useState(false);
    const setDropdownIsOpen = (isOpen: boolean) => {
        if (!isOpen && !gasDropdownIsOpen) {
            return;
        }
        setGasDropdownIsOpen(isOpen);
    };

    return (
        <OutsideClickHandler onOutsideClick={() => setDropdownIsOpen(false)}>
            <Select
                onClick={() => {
                    disabled ? null : setDropdownIsOpen(!gasDropdownIsOpen);
                }}
                className={disabled ? 'disabled' : ''}
            >
                <Text>{formatCurrency(gasPrice || 0) || 0}</Text>
            </Select>
            {gasDropdownIsOpen && <SelectGasMenuBody setDropdownIsOpen={setDropdownIsOpen} />}
        </OutsideClickHandler>
    );
};

const Select = styled(FlexDiv)`
    position: relative;
    display: block;
    height: 24px;
    padding-left: 6px;
    padding-right: 30px;
    background: #0a2e66;
    border: 2px solid #0a2e66;
    border-radius: 5px;
    color: #f6f6fe !important;
    &:after {
        content: url(${dropDown});
        position: absolute;
        right: 0;
        top: -2px;
        height: 24px;
    }
    &:hover {
        cursor: pointer;
    }
    &.disabled {
        opacity: 0.4;
        cursor: default;
    }
`;

const Text = styled.p`
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.25px;
    margin-top: 1px !important;
    @media screen and (max-width: 375px) {
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
        text-align: center;
        letter-spacing: 0.25px;
    }
`;

export default SelectGasMenu;
