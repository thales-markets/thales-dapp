import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setGasSpeed, setCustomGasPrice } from 'redux/modules/wallet';
import useEthGasPriceQuery, { GasSpeed } from 'queries/network/useEthGasPriceQuery';
import styled from 'styled-components';

const MAX_GAS_MULTIPLE = 1.5;

type GasMenuProps = {
    setDropdownIsOpen: (isOpen: boolean) => void;
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
    &.error {
        border: 1px solid #c62937;
        color: #c62937;
    }
`;

const ErrorMaxInput = styled.span`
    position: absolute;
    top: 34px;
    left: 10px;
    font-weight: normal;
    font-size: 10px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: #c62937;
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
            <DropDown>
                <Option>
                    <Input
                        value={localCustomGasPrice}
                        onChange={(e) => {
                            setLocalCustomGasPrice(e.target.value);
                        }}
                        placeholder={t('modals.gwei.placeholder')}
                        className={errorMessage ? 'error' : ''}
                        type="number"
                        step="0.1"
                        min="0"
                    />
                    {errorMessage && <ErrorMaxInput>{errorMessage}</ErrorMaxInput>}
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

export default SelectGasMenuBody;
