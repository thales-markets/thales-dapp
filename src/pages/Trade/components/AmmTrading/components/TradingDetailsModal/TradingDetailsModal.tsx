import { Modal } from '@material-ui/core';
import { USD_SIGN } from 'constants/currency';
import { Positions } from 'constants/options';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivRowCentered } from 'theme/common';
import { getStableCoinForNetwork, getSynthName } from 'utils/currency';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { formatCurrencyWithKey, formatCurrencyWithSign } from 'utils/formatters/number';
import { getFormattedBonus } from 'utils/options';

type TradingDetailsModalProps = {
    currencyKey: string;
    maturityDate: number;
    strikePrice: number;
    leftStrikePrice: number;
    rightStrikePrice: number;
    position: Positions;
    positionPrice: number;
    positionBonus: number;
    positionAmount: number;
    paidAmount: number;
    selectedStable: string;
    profit: number;
    onClose: () => void;
};

const TradingDetailsModal: React.FC<TradingDetailsModalProps> = ({
    currencyKey,
    maturityDate,
    strikePrice,
    leftStrikePrice,
    rightStrikePrice,
    position,
    positionPrice,
    positionBonus,
    positionAmount,
    paidAmount,
    selectedStable,
    profit,
    onClose,
}) => {
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));

    return (
        <Modal
            open={true}
            onClose={(_, reason) => {
                if (reason !== 'backdropClick') onClose();
            }}
            style={{ backdropFilter: 'blur(10px)' }}
        >
            <Container>
                <Header>
                    <TextHeader>{t('options.trade.amm-trading.details-modal.confirm-order', { position })}</TextHeader>
                    <CloseIcon className="icon icon--x-sign" onClick={onClose} />
                </Header>

                <MarketDetails>
                    <DetailsRow>
                        <TextLabel>{t('options.common.asset')}</TextLabel>
                        <TextValue>{getSynthName(currencyKey)}</TextValue>
                    </DetailsRow>
                    <DetailsRow>
                        <TextLabel>{t('options.common.direction')}</TextLabel>
                        <TextValue>{position}</TextValue>
                    </DetailsRow>
                    <DetailsRow>
                        <TextLabel>{t('options.common.strike-price')}</TextLabel>
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
                        <TextLabel>{t('options.common.end-date')}</TextLabel>
                        <TextValue>{formatShortDateWithTime(maturityDate)}</TextValue>
                    </DetailsRow>
                </MarketDetails>

                <TradingDetails>
                    <DetailsRow>
                        <TextLabel>{t('options.trade.amm-trading.details-modal.position-price')}</TextLabel>
                        <TextValue>{formatCurrencyWithSign(USD_SIGN, positionPrice)}</TextValue>
                    </DetailsRow>
                    <DetailsRow>
                        <TextLabel>{t('options.trade.amm-trading.details-modal.position-bonus')}</TextLabel>
                        <TextValue isProfit={true}>{positionBonus ? getFormattedBonus(positionBonus) : '-'}</TextValue>
                    </DetailsRow>
                    <DetailsRow>
                        <TextLabel>{t('options.trade.amm-trading.details-modal.amount')}</TextLabel>
                        <TextValue>{formatCurrencyWithKey(position, positionAmount)}</TextValue>
                    </DetailsRow>
                    <DetailsRow>
                        <TextLabel>{t('options.trade.amm-trading.details-modal.total-pay')}</TextLabel>
                        <TextValue>{formatCurrencyWithKey(selectedStable, paidAmount)}</TextValue>
                    </DetailsRow>
                    <DetailsRow>
                        <TextLabel>{t('options.trade.amm-trading.details-modal.potential-profit')}</TextLabel>
                        <TextValue isProfit={true}>
                            {formatCurrencyWithKey(getStableCoinForNetwork(networkId), profit)}
                        </TextValue>
                    </DetailsRow>
                </TradingDetails>
            </Container>
        </Modal>
    );
};

const Container = styled(FlexDivColumnCentered)`
    position: relative;
    width: 306px;
    height: fit-content;
    padding: 15px;
    margin: auto;
    top: calc(50% - 200px);
    background: ${(props) => props.theme.background.primary};
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 8px;
`;

const Header = styled(FlexDivRowCentered)`
    margin-bottom: 15px;
`;

const MarketDetails = styled(FlexDivColumnCentered)`
    background: ${(props) => props.theme.background.secondary};
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
`;

const DetailsRow = styled(FlexDivRowCentered)`
    padding: 2px 0;
`;

const TradingDetails = styled(FlexDivColumnCentered)`
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 15px;
`;

const CloseIcon = styled.i`
    font-size: 16px;
    line-height: 16px;
    cursor: pointer;
    color: ${(props) => props.theme.textColor.secondary};
`;

const Text = styled.span`
    font-family: ${(props) => props.theme.fontFamily.primary};
    font-style: normal;
    font-weight: 700;
    font-size: 13px;
    line-height: 15px;
    text-transform: capitalize;
`;

const TextHeader = styled(Text)`
    font-size: 18px;
    line-height: 110%;
    color: ${(props) => props.theme.textColor.secondary};
`;
const TextLabel = styled(Text)`
    color: ${(props) => props.theme.textColor.secondary};
`;
const TextValue = styled(Text)<{ isProfit?: boolean; uppercase?: boolean }>`
    color: ${(props) => (props.isProfit ? props.theme.textColor.quaternary : props.theme.textColor.primary)};
    text-transform: ${(props) => (props.uppercase ? 'uppercase;' : 'initial')};
`;

export default TradingDetailsModal;
