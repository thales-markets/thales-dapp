import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivRowCentered } from 'theme/common';
import Input from '../Input';
import { countDecimals } from 'utils/formatters/number';

type SlippageProps = {
    fixed: Array<number>;
    defaultValue?: number;
    onChangeHandler?: (value: number) => void;
};

const MIN_VALUE = 0.01;
const MAX_VALUE = 100;

export const isSlippageValid = (value: number) => {
    return value >= MIN_VALUE && value <= MAX_VALUE;
};

const Slippage: React.FC<SlippageProps> = ({ fixed, defaultValue, onChangeHandler }) => {
    const { t } = useTranslation();

    const [slippage, setSlippage] = useState<number | string>(defaultValue || '');

    useEffect(() => {
        onChangeHandler && onChangeHandler(Number(slippage));
    }, [slippage, onChangeHandler]);

    const onInputValueChange = (value: number | string) => {
        const numValue = Number(value);
        if (countDecimals(numValue) > 2) {
            return;
        }

        if (numValue >= 0 && numValue <= MAX_VALUE) {
            setSlippage(value);
        } else if (numValue < MIN_VALUE) {
            setSlippage(MIN_VALUE);
        } else if (numValue > MAX_VALUE) {
            setSlippage(MAX_VALUE);
        }
    };

    return (
        <Container>
            <Text>{t('options.trade.amm-trading.slippage.label')}</Text>
            <Row>
                {fixed.length && (
                    <FlexDivRowCentered>
                        {fixed.map((value, index) => (
                            <Value key={index} isSelected={value === slippage} onClick={() => setSlippage(value)}>
                                <Text>{value}%</Text>
                            </Value>
                        ))}
                    </FlexDivRowCentered>
                )}
                <Input
                    value={slippage}
                    valueType={'number'}
                    placeholder={t('options.trade.amm-trading.slippage.enter-value')}
                    valueChange={(value) => onInputValueChange(value)}
                    valueFontSize={'13px'}
                    subValue={'%'}
                    subValueFontSize={'13px'}
                    container={inputFieldProps}
                    showError={slippage !== '' && !isSlippageValid(Number(slippage))}
                    errorMessage={t('options.trade.amm-trading.slippage.invalid-value')}
                />
            </Row>
        </Container>
    );
};

const HEIGHT = '35px';

const inputFieldProps = { width: '100px', height: HEIGHT, margin: '0px' };

const Container = styled(FlexDivColumnCentered)``;

const Row = styled(FlexDivRowCentered)`
    width: 100%;
    margin-top: 5px;
`;

const Value = styled(FlexDivColumnCentered)<{ isSelected: boolean }>`
    width: 35px;
    height: ${HEIGHT};
    background: ${(props) => (props.isSelected ? props.theme.background.secondary : 'transparent')};
    border: 1px solid ${(props) => props.theme.borderColor.tertiary};
    border-radius: 8px;
    align-items: center;
    margin-right: 10px;
    cursor: pointer;
`;

const Text = styled.span`
    font-family: ${(props) => props.theme.fontFamily.primary};
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 15px;
    text-transform: capitalize;
    color: ${(props) => props.theme.textColor.secondary};
`;

export default Slippage;
