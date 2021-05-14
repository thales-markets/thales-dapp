import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setGasSpeed, setCustomGasPrice } from 'redux/modules/wallet';
import useEthGasPriceQuery, { GasSpeed } from 'queries/network/useEthGasPriceQuery';
import styled from 'styled-components';

type GasMenuProps = {
    setDropdownIsOpen: (isOpen: boolean) => void;
};

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

    const setGasSpeedAndCloseDropdown = (gasSpeed: GasSpeed) => {
        dispatch(setGasSpeed(gasSpeed));
        dispatch(setCustomGasPrice(null));
        setDropdownIsOpen(false);
    };

    useEffect(() => {
        if (localCustomGasPrice) {
            dispatch(setCustomGasPrice(Math.max(0, Number(localCustomGasPrice))));
        }
    }, [setCustomGasPrice, localCustomGasPrice, t]);

    return (
        <div style={{ position: 'relative' }}>
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
                    <span>{t('modals.gwei.table.average')} </span>
                    <span>{gasPriceAverage}</span>
                </Option>
                <Option onClick={() => setGasSpeedAndCloseDropdown('fast')}>
                    <span> {t('modals.gwei.table.fast')}</span>
                    <span> {gasPriceFast}</span>
                </Option>
                <Option onClick={() => setGasSpeedAndCloseDropdown('fastest')}>
                    <span> {t('modals.gwei.table.fastest')}</span>
                    <span> {gasPriceFastest}</span>
                </Option>
            </DropDown>
        </div>
    );
};

const DropDown = styled.ul`
    position: absolute;
    right: 0;
    width: 132px;
    height: 140px;
    padding: 3px;
    margin: 2px 0;
    background: #f6f6fe;
    border-radius: 10px;
    list-style: none;
`;

const Option = styled.li`
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    font-weight: bold;
    color: #04045a;

    cursor: pointer;
    &:not(:first-child) {
        padding: 8px 6px;
        &:hover {
            background: lightgray;
        }
    }

    &:first-child {
        margin: 0 0 14px 0;
    }
`;

const Input = styled.input`
    display: block;
    height: 28px;
    margin: 2px 4px;
    padding: 0 6px;
    border: 1px solid #04045a;
    border-radius: 5px;
    outline: none !important;
    font-size: 13px;
    font-weight: bold;
    width: 100%;
`;

export default SelectGasMenuBody;
