import React from 'react';
import { formatCurrencyPair } from 'utils/formatters/string';
import CurrencyIcon from './CurrencyIcon';
import { FlexDivCentered } from 'theme/common';
import styled from 'styled-components';

type CurrencyPairProps = {
    baseCurrencyKey: string;
    baseCurrencyAsset?: string;
    quoteCurrencyKey: string;
    showIcon?: boolean;
    iconProps?: any;
};

const CurrencyPair: React.FC<CurrencyPairProps> = ({
    baseCurrencyKey,
    baseCurrencyAsset,
    quoteCurrencyKey,
    showIcon = true,
    iconProps = {},
}) => (
    <Container>
        {showIcon && <CurrencyIcon currencyKey={baseCurrencyKey} {...iconProps} />}
        {formatCurrencyPair(baseCurrencyAsset || baseCurrencyKey, quoteCurrencyKey)}
    </Container>
);

const Container = styled(FlexDivCentered)``;

export default CurrencyPair;
