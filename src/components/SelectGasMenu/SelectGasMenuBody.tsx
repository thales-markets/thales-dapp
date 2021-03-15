import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Message, Input } from 'semantic-ui-react';
import { setGasSpeed, setCustomGasPrice } from 'redux/modules/wallet';
import useEthGasPriceQuery, { GasSpeed } from 'queries/network/useEthGasPriceQuery';

const MAX_GAS_MULTIPLE = 1.5;

type GasMenuProps = {
    setDropdownIsOpen: (isOpen: boolean) => void;
};

const SelectGasMenuBody: React.FC<GasMenuProps> = ({ setDropdownIsOpen }) => {
    const ethGasPriceQuery = useEthGasPriceQuery();
    const gasPriceSlow = useMemo(() => (ethGasPriceQuery.data != null ? ethGasPriceQuery.data['slow'] : 0), [
        ethGasPriceQuery.data,
    ]);
    const gasPriceAverage = useMemo(() => (ethGasPriceQuery.data != null ? ethGasPriceQuery.data['average'] : 0), [
        ethGasPriceQuery.data,
    ]);
    const gasPriceFast = useMemo(() => (ethGasPriceQuery.data != null ? ethGasPriceQuery.data['fast'] : 0), [
        ethGasPriceQuery.data,
    ]);

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [localCustomGasPrice, setLocalCustomGasPrice] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    const setGasSpeedAndCloseDropdown = (gasSpeed: GasSpeed) => {
        dispatch(setGasSpeed(gasSpeed));
        dispatch(setCustomGasPrice(null));
        setDropdownIsOpen(false);
    };

    const gasPriceLimit = useMemo(
        () => Math.floor(ethGasPriceQuery.data != null ? ethGasPriceQuery.data.fast * MAX_GAS_MULTIPLE : 0),
        [ethGasPriceQuery]
    );

    useEffect(() => {
        if (localCustomGasPrice) {
            const customGasPriceNum = Number(localCustomGasPrice);
            const exceedsGasLimit = customGasPriceNum > gasPriceLimit;
            dispatch(setCustomGasPrice(exceedsGasLimit ? gasPriceLimit : Math.max(0, customGasPriceNum)));
            setErrorMessage(
                exceedsGasLimit ? t('common.errors.gas-exceeds-limit', { gasPrice: gasPriceLimit }) : undefined
            );
        }
    }, [setCustomGasPrice, localCustomGasPrice, gasPriceLimit, t]);

    return (
        <div>
            <Input
                value={localCustomGasPrice}
                onChange={(e) => {
                    setLocalCustomGasPrice(e.target.value);
                }}
                placeholder={t('modals.gwei.placeholder')}
                type="number"
                step="0.1"
                min="0"
            />
            {errorMessage && <Message negative>{errorMessage}</Message>}
            <div
                onClick={() => setGasSpeedAndCloseDropdown('slow')}
                style={{ display: 'flex', justifyContent: 'space-between' }}
            >
                <div>{t('modals.gwei.table.safe')}</div>
                <div>{gasPriceSlow}</div>
            </div>
            <div
                onClick={() => setGasSpeedAndCloseDropdown('average')}
                style={{ display: 'flex', justifyContent: 'space-between' }}
            >
                <div>{t('modals.gwei.table.standard')}</div>
                <div>{gasPriceAverage}</div>
            </div>
            <div
                onClick={() => setGasSpeedAndCloseDropdown('fast')}
                style={{ display: 'flex', justifyContent: 'space-between' }}
            >
                <div>{t('modals.gwei.table.fast')}</div>
                <div>{gasPriceFast}</div>
            </div>
        </div>
    );
};

export default SelectGasMenuBody;
