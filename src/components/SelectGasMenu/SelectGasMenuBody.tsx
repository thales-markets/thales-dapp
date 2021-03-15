import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getGasInfo, setGasPrice } from 'redux/modules/transaction';
import { RootState } from 'redux/rootReducer';
import { Message, Input } from 'semantic-ui-react';

const MAX_GAS_MULTIPLE = 1.5;

type GasMenuProps = {
    setDropdownIsOpen: (isOpen: boolean) => void;
};

const SelectGasMenuBody: React.FC<GasMenuProps> = ({ setDropdownIsOpen }) => {
    const { gasSpeed /*, gasPrice */ } = useSelector((state: RootState) => getGasInfo(state));
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [customGasPrice, setCustomGasPrice] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    const setGasPriceAndCloseDropdown = (updateGasPrice: number) => {
        dispatch(setGasPrice(updateGasPrice));
        setDropdownIsOpen(false);
    };

    const gasPriceLimit = useMemo(() => Math.floor(gasSpeed.fastestAllowed * MAX_GAS_MULTIPLE), [
        gasSpeed.fastestAllowed,
    ]);

    useEffect(() => {
        if (customGasPrice) {
            const customGasPriceNum = Number(customGasPrice);
            const exceedsGasLimit = customGasPriceNum > gasPriceLimit;
            dispatch(setGasPrice(exceedsGasLimit ? gasPriceLimit : Math.max(0, customGasPriceNum)));
            setErrorMessage(
                exceedsGasLimit ? t('common.errors.gas-exceeds-limit', { gasPrice: gasPriceLimit }) : undefined
            );
        }
    }, [setGasPrice, customGasPrice, gasPriceLimit, t]);

    return (
        <div>
            <Input
                value={customGasPrice}
                onChange={(e) => {
                    setCustomGasPrice(e.target.value);
                }}
                placeholder={t('modals.gwei.placeholder')}
                type="number"
                step="0.1"
                min="0"
            />
            {errorMessage && <Message negative>{errorMessage}</Message>}
            <div
                onClick={() => setGasPriceAndCloseDropdown(gasSpeed.slowAllowed)}
                style={{ display: 'flex', justifyContent: 'space-between' }}
            >
                <div>{t('modals.gwei.table.safe')}</div>
                <div>{gasSpeed.slowAllowed}</div>
            </div>
            <div
                onClick={() => setGasPriceAndCloseDropdown(gasSpeed.averageAllowed)}
                style={{ display: 'flex', justifyContent: 'space-between' }}
            >
                <div>{t('modals.gwei.table.standard')}</div>
                <div>{gasSpeed.averageAllowed}</div>
            </div>
            <div
                onClick={() => setGasPriceAndCloseDropdown(gasSpeed.fastestAllowed)}
                style={{ display: 'flex', justifyContent: 'space-between' }}
            >
                <div>{t('modals.gwei.table.fast')}</div>
                <div>{gasSpeed.fastestAllowed}</div>
            </div>
        </div>
    );
};

export default SelectGasMenuBody;
