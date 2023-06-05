import { SLIPPAGE_PERCENTAGE } from 'constants/options';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumnCentered } from 'styles/common';
import { formatPercentage } from 'utils/formatters/number';
import Slippage from '../Slippage';
import { DetailsRow, TextLabel, TextValue } from '../../styled-components';

type SkewSlippageDetailsProps = {
    skew: number;
    slippage: number;
    setSlippage: (value: number) => void;
    hideScew?: boolean;
};

const SkewSlippageDetails: React.FC<SkewSlippageDetailsProps> = ({ skew, slippage, setSlippage, hideScew }) => {
    const { t } = useTranslation();

    return (
        <Container>
            {!hideScew && (
                <DetailsRow>
                    <TextLabel>{t('options.trade.amm-trading.details-modal.skew')}</TextLabel>
                    <TextValue>{formatPercentage(skew)}</TextValue>
                </DetailsRow>
            )}
            <DetailsRow>
                <Slippage
                    fixed={SLIPPAGE_PERCENTAGE}
                    defaultValue={slippage}
                    onChangeHandler={(value) => setSlippage(value)}
                />
            </DetailsRow>
        </Container>
    );
};

const Container = styled(FlexDivColumnCentered)`
    margin: 0 11px 15px 11px;
`;

export default SkewSlippageDetails;
