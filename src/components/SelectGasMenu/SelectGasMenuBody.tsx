import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setGasSpeed, setCustomGasPrice, getGasSpeed, getCustomGasPrice } from 'redux/modules/wallet';
import useEthGasPriceQuery, { GasSpeed } from 'queries/network/useEthGasPriceQuery';
import styled from 'styled-components';
import { RootState } from 'redux/rootReducer';

type GasMenuProps = {
    setDropdownIsOpen: (isOpen: boolean) => void;
};

const SelectGasMenuBody: React.FC<GasMenuProps> = ({ setDropdownIsOpen }) => {
    const gasSpeed = useSelector((state: RootState) => getGasSpeed(state));
    const customGasPrice = useSelector((state: RootState) => getCustomGasPrice(state));

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
        <Container>
            <DropDown>
                <Option>
                    <Input
                        value={localCustomGasPrice}
                        onChange={(e) => {
                            setLocalCustomGasPrice(e.target.value);
                        }}
                        placeholder={t('modals.gwei.placeholder')}
                        type="number"
                        step="1"
                        min="0"
                    />
                </Option>
                <Option
                    onClick={() => setGasSpeedAndCloseDropdown('average')}
                    className={customGasPrice == null && gasSpeed === 'average' ? 'selected' : ''}
                >
                    <span>{t('modals.gwei.table.average')} </span>
                    <span>{gasPriceAverage}</span>
                </Option>
                <Option
                    onClick={() => setGasSpeedAndCloseDropdown('fast')}
                    className={customGasPrice == null && gasSpeed === 'fast' ? 'selected' : ''}
                >
                    <span>{t('modals.gwei.table.fast')}</span>
                    <span>{gasPriceFast}</span>
                </Option>
                <Option
                    onClick={() => setGasSpeedAndCloseDropdown('fastest')}
                    className={customGasPrice == null && gasSpeed === 'fastest' ? 'selected' : ''}
                >
                    <span>{t('modals.gwei.table.fastest')}</span>
                    <span>{gasPriceFastest}</span>
                </Option>
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
    width: 132px;
    height: 133px;
    z-index: 1;
    padding: 3px;
    margin: 2px 0;
    background: #0a2e66;
    border-radius: 10px;
    list-style: none;
`;

const Option = styled.li`
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    font-weight: bold;
    border: 1px solid #0a2e66;
    color: #f6f6fe;
    cursor: pointer;
    &:not(:first-child) {
        padding: 8px 6px;
        &:hover {
            background: rgba(45, 131, 210, 0.3);
            border-radius: 7px;
            color: #b8c6e5;
        }
    }
    &.selected {
        background: #0a2e66;
        border: 1px solid #00f9ff;
        border-radius: 7px;
    }
`;

const Input = styled.input`
    background: #0a2e66;
    border: 1px solid rgba(45, 131, 210, 0.5);
    border-radius: 7px;
    display: block;
    height: 30px;
    margin-bottom: 2px;
    padding: 0 6px;
    outline: none !important;
    font-size: 13px;
    font-weight: bold;
    width: 100%;
    color: #f6f6fe;
    &::selection {
        color: var(--color-primary);
        background: #f6f6fe;
    }
    &:focus {
        border: 1px solid #00f9ff;
    }
`;

export default SelectGasMenuBody;
