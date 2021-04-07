import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from 'semantic-ui-react';
import { formatCurrency } from 'utils/formatters/number';
import SelectGasMenuBody from './SelectGasMenuBody';

type SelectGasMenuProps = {
    gasPrice: number | null;
};

export const SelectGasMenu: React.FC<SelectGasMenuProps> = ({ gasPrice }: SelectGasMenuProps) => {
    const { t } = useTranslation();

    const [gasDropdownIsOpen, setGasDropdownIsOpen] = useState(false);
    const setDropdownIsOpen = (isOpen: boolean) => {
        if (!isOpen && !gasDropdownIsOpen) {
            return;
        }
        setGasDropdownIsOpen(isOpen);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div
                    onClick={() => setDropdownIsOpen(!gasDropdownIsOpen)}
                    style={{ display: 'flex', justifyContent: 'center' }}
                >
                    <div>{formatCurrency(gasPrice || 0) || 0}</div>
                    <Label size="tiny" style={{ textTransform: 'uppercase' }}>
                        {t('common.actions.edit')}
                    </Label>
                </div>
            </div>
            {gasDropdownIsOpen && <SelectGasMenuBody setDropdownIsOpen={setDropdownIsOpen} />}
        </div>
    );
};

export default SelectGasMenu;
