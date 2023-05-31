import Modal from 'components/Modal';
import Button from 'components/ButtonV2';
import { USD_SIGN } from 'constants/currency';
import { Positions, SLIPPAGE_PERCENTAGE } from 'constants/options';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivRowCentered } from 'theme/common';
import { getStableCoinForNetwork, getSynthName } from 'utils/currency';
import { formatShortDateWithTime } from 'utils/formatters/date';
import {
    calculateAndFormatPercentage,
    formatCurrencyWithKey,
    formatCurrencyWithSign,
    formatPercentage,
} from 'utils/formatters/number';
import { getFormattedBonus } from 'utils/options';
import Slippage from '../Slippage';
import { isSlippageValid } from '../Slippage/Slippage';
import { EMPTY_VALUE } from 'constants/placeholder';

type TradingDetailsModalProps = {
    currencyKey: string;
    maturityDate: number;
    strikePrice: number;
    leftStrikePrice: number;
    rightStrikePrice: number;
    positionType: Positions;
    positionPrice: number;
    positionBonus: number;
    positionAmount: number;
    paidAmount: number;
    selectedStable: string;
    profit: number;
    skew: number;
    slippage: number;
    setSlippage: (value: number) => void;
    tradingDetailsSentence: JSX.Element;
    onClose: () => void;
};

const TradingDetailsModal: React.FC<TradingDetailsModalProps> = ({
    currencyKey,
    maturityDate,
    strikePrice,
    leftStrikePrice,
    rightStrikePrice,
    positionType,
    positionPrice,
    positionBonus,
    positionAmount,
    paidAmount,
    selectedStable,
    profit,
    skew,
    slippage,
    setSlippage,
    tradingDetailsSentence,
    onClose,
}) => {
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const [slippageTolerance, setSlippageTolerance] = useState<number | string>(slippage);

    const isButtonDisabled = !isSlippageValid(Number(slippageTolerance));

    const onSubmitHandler = () => {
        if (isButtonDisabled) {
            return;
        }
        setSlippage(Number(slippageTolerance));
        onClose();
    };

    return (
        <Modal
            shouldCloseOnOverlayClick={false}
            onClose={onClose}
            title={t('options.trade.amm-trading.details-modal.confirm-order', { position: positionType })}
            customStyle={{ overlay: { zIndex: 201 } }}
        >
            <Container>
                <MarketDetails>
                    <DetailsRow>
                        <TextLabel>{t('options.common.asset')}</TextLabel>
                        <TextValue>{getSynthName(currencyKey)}</TextValue>
                    </DetailsRow>
                    <DetailsRow>
                        <TextLabel>{t('options.common.direction')}</TextLabel>
                        <TextValue>{positionType}</TextValue>
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
                        <TextValue isProfit={true}>
                            {positionBonus ? getFormattedBonus(positionBonus) : EMPTY_VALUE}
                        </TextValue>
                    </DetailsRow>
                    <DetailsRow>
                        <TextLabel>{t('options.trade.amm-trading.details-modal.amount')}</TextLabel>
                        <TextValue>
                            {positionAmount ? formatCurrencyWithKey(positionType, positionAmount) : EMPTY_VALUE}
                        </TextValue>
                    </DetailsRow>
                    <DetailsRow>
                        <TextLabel>{t('options.trade.amm-trading.details-modal.total-pay')}</TextLabel>
                        <TextValue>
                            {paidAmount ? formatCurrencyWithKey(selectedStable, paidAmount) : EMPTY_VALUE}
                        </TextValue>
                    </DetailsRow>
                    <DetailsRow>
                        <TextLabel>{t('options.trade.amm-trading.details-modal.potential-profit')}</TextLabel>
                        <TextValue isProfit={true}>
                            {profit
                                ? `${formatCurrencyWithKey(
                                      getStableCoinForNetwork(networkId),
                                      profit
                                  )} (${formatPercentage(calculateAndFormatPercentage(paidAmount, positionAmount))})`
                                : EMPTY_VALUE}
                        </TextValue>
                    </DetailsRow>
                </TradingDetails>

                <DetailsRow padding="2px 11px">
                    <TextLabel>{t('options.trade.amm-trading.details-modal.skew')}</TextLabel>
                    <TextValue isProfit={true}>{formatPercentage(skew)}</TextValue>
                </DetailsRow>
                <DetailsRow padding="2px 11px" margin="0 0 15px 0">
                    <Slippage
                        fixed={SLIPPAGE_PERCENTAGE}
                        defaultValue={slippage}
                        onChangeHandler={(value) => setSlippageTolerance(value)}
                    />
                </DetailsRow>

                <TradingDetailsSentence height={leftStrikePrice ? '66px' : '49px'}>
                    {tradingDetailsSentence}
                </TradingDetailsSentence>

                <Button {...defaultButtonProps} disabled={isButtonDisabled} onClick={onSubmitHandler}>
                    {slippage !== slippageTolerance ? t(`common.save`) : t('common.close')}
                </Button>
            </Container>
        </Modal>
    );
};

const defaultButtonProps = {
    width: '100%',
    height: '34px',
    margin: '0 0 5px 0',
};

const Container = styled(FlexDivColumnCentered)`
    position: relative;
    width: 306px;
`;

const MarketDetails = styled(FlexDivColumnCentered)`
    background: ${(props) => props.theme.background.secondary};
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
`;

const DetailsRow = styled(FlexDivRowCentered)<{ margin?: string; padding?: string }>`
    ${(props) => (props.margin ? `margin: ${props.margin};` : '')}
    padding: ${(props) => (props.padding ? props.padding : '2px 0')};
`;

const TradingDetails = styled(FlexDivColumnCentered)`
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 15px;
`;

const TradingDetailsSentence = styled(FlexDivRowCentered)<{ height?: string }>`
    height: ${(props) => (props.height ? props.height : '100%')};
    margin-bottom: 15px;
`;

const Text = styled.span`
    font-weight: 700;
    font-size: 13px;
    line-height: 15px;
`;

const TextLabel = styled(Text)`
    color: ${(props) => props.theme.textColor.secondary};
`;
const TextValue = styled(Text)<{ isProfit?: boolean; uppercase?: boolean }>`
    color: ${(props) => (props.isProfit ? props.theme.textColor.quaternary : props.theme.textColor.primary)};
    text-transform: ${(props) => (props.uppercase ? 'uppercase;' : 'initial')};
`;

export default TradingDetailsModal;
