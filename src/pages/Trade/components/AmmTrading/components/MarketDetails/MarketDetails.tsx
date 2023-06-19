import { USD_SIGN } from 'constants/currency';
import { Positions } from 'enums/options';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumnCentered } from 'styles/common';
import { getSynthName } from 'utils/currency';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { DetailsRow, TextLabel, TextValue } from '../../styled-components';

type MarketDetailsProps = {
    currencyKey: string;
    maturityDate: number;
    strikePrice: number;
    leftStrikePrice: number;
    rightStrikePrice: number;
    positionType: Positions;
};

const MarketDetails: React.FC<MarketDetailsProps> = ({
    currencyKey,
    maturityDate,
    strikePrice,
    leftStrikePrice,
    rightStrikePrice,
    positionType,
}) => {
    const { t } = useTranslation();

    return (
        <Container>
            <DetailsRow>
                <TextLabel>{t('common.asset')}</TextLabel>
                <TextValue>{getSynthName(currencyKey)}</TextValue>
            </DetailsRow>
            <DetailsRow>
                <TextLabel>{t('common.direction')}</TextLabel>
                <TextValue>{positionType}</TextValue>
            </DetailsRow>
            <DetailsRow>
                <TextLabel>{t('common.strike-price')}</TextLabel>
                {strikePrice ? (
                    <TextValue>{formatCurrencyWithSign(USD_SIGN, strikePrice)}</TextValue>
                ) : (
                    <div>
                        <TextValue>{formatCurrencyWithSign(USD_SIGN, leftStrikePrice) + ' - '}</TextValue>
                        <TextValue>{formatCurrencyWithSign(USD_SIGN, rightStrikePrice)}</TextValue>
                    </div>
                )}
            </DetailsRow>
            <DetailsRow>
                <TextLabel>{t('common.end-date')}</TextLabel>
                <TextValue>{formatShortDateWithTime(maturityDate)}</TextValue>
            </DetailsRow>
        </Container>
    );
};

const Container = styled(FlexDivColumnCentered)`
    background: ${(props) => props.theme.background.secondary};
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
`;

export default MarketDetails;
