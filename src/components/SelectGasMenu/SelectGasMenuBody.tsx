import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Message } from 'semantic-ui-react';
import { setGasSpeed, setCustomGasPrice } from 'redux/modules/wallet';
import useEthGasPriceQuery, { GasSpeed } from 'queries/network/useEthGasPriceQuery';
import styled from 'styled-components';

const MAX_GAS_MULTIPLE = 1.5;

type GasMenuProps = {
    setDropdownIsOpen: (isOpen: boolean) => void;
};

const DropDown = styled.ul`
    position: absolute;
    background: #f6f6fe;
    border-radius: 5px;
    list-style: none;
    width: 70px;
    padding: 3px;
    margin: 2px 0;
`;

const Option = styled.li`
    background: #f6f6fe;
    border: 0.5px solid #04045a;
    box-sizing: border-box;
    border-radius: 5px;
    font-size: 10px;
    font-weight: bold;
    color: #04045a;
    width: 64px;
    margin: 1px;
    text-align: center;
    margin: 2px 0;
    cursor: pointer;
    &:first-child,
    &:last-child {
        margin: 0;
    }
`;

const Input = styled.input`
    display: block;
    height: 22px;
    width: 55px;
    margin: 2px;
    border: none !important;
    outline: none !important;
    font-size: 10px;
    font-weight: bold;
`;

const SelectGasMenuBody: React.FC<GasMenuProps> = ({ setDropdownIsOpen }) => {
    const ethGasPriceQuery = useEthGasPriceQuery();
    const gasPriceAverage = useMemo(() => (ethGasPriceQuery.data != null ? ethGasPriceQuery.data['average'] : 0), [
        ethGasPriceQuery.data,
    ]);
    const gasPriceFast = useMemo(() => (ethGasPriceQuery.data != null ? ethGasPriceQuery.data['fast'] : 0), [
        ethGasPriceQuery.data,
    ]);
    const gasPriceFastest = useMemo(() => (ethGasPriceQuery.data != null ? ethGasPriceQuery.data['fastest'] : 0), [
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
        <div style={{ position: 'relative' }}>
            {errorMessage && <Message negative>{errorMessage}</Message>}
            <DropDown>
                <Option>
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
                </Option>
                <Option onClick={() => setGasSpeedAndCloseDropdown('average')}>
                    {t('modals.gwei.table.average')} {gasPriceAverage}
                </Option>
                <Option onClick={() => setGasSpeedAndCloseDropdown('fast')}>
                    {t('modals.gwei.table.fast')} {gasPriceFast}
                </Option>
                <Option onClick={() => setGasSpeedAndCloseDropdown('fastest')}>
                    {t('modals.gwei.table.fastest')} {gasPriceFastest}
                </Option>
            </DropDown>
        </div>
    );
};

export default SelectGasMenuBody;
