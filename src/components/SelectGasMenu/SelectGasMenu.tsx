import React, { useState } from 'react';
import styled from 'styled-components';
import { FlexDiv, Text } from 'theme/common';
import { formatCurrency } from 'utils/formatters/number';
import dropDown from 'assets/images/drop-down.svg';
import SelectGasMenuBody from './SelectGasMenuBody';

type SelectGasMenuProps = {
    gasPrice: number | null;
};

export const SelectGasMenu: React.FC<SelectGasMenuProps> = ({ gasPrice }: SelectGasMenuProps) => {
    const [gasDropdownIsOpen, setGasDropdownIsOpen] = useState(false);
    const setDropdownIsOpen = (isOpen: boolean) => {
        if (!isOpen && !gasDropdownIsOpen) {
            return;
        }
        setGasDropdownIsOpen(isOpen);
    };

    const Select = styled(FlexDiv)`
        position: relative;
        display: block;
        height: 24px;
        padding-left: 6px;
        padding-right: 30px;
        background: #f6f6fe;
        border-radius: 5px;

        &:after {
            content: url(${dropDown});
            position: absolute;
            right: 0;
            top: 0;
            height: 24px;
            background: #44e1e2;
            border-radius: 5px 0px 0px 5px;
        }
    `;

    return (
        <div>
            <Select onClick={() => setDropdownIsOpen(!gasDropdownIsOpen)}>
                <Text className="text-xs uppercase dark bold"> {formatCurrency(gasPrice || 0) || 0}</Text>
            </Select>
            {gasDropdownIsOpen && <SelectGasMenuBody setDropdownIsOpen={setDropdownIsOpen} />}
        </div>
    );
};

export default SelectGasMenu;
