import Button from 'components/Button';
import Modal from 'components/Modal';
import { Positions } from 'enums/options';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivRowCentered } from 'styles/common';
import MarketDetails from '../MarketDetails';
import SkewSlippageDetails from '../SkewSlippageDetails';
import { isSlippageValid } from '../Slippage/Slippage';
import TradingDetails from '../TradingDetails';

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
            title={t('markets.amm-trading.details-modal.confirm-order', { position: positionType })}
            customStyle={{ overlay: { zIndex: 201 } }}
        >
            <Container>
                <MarketDetails
                    currencyKey={currencyKey}
                    maturityDate={maturityDate}
                    strikePrice={strikePrice}
                    leftStrikePrice={leftStrikePrice}
                    rightStrikePrice={rightStrikePrice}
                    positionType={positionType}
                />
                <TradingDetails
                    positionType={positionType}
                    positionPrice={positionPrice}
                    positionBonus={positionBonus}
                    positionAmount={positionAmount}
                    paidAmount={paidAmount}
                    selectedStable={selectedStable}
                    profit={profit}
                    isBuy={true}
                />
                <SkewSlippageDetails skew={skew} slippage={slippage} setSlippage={setSlippageTolerance} />
                <TradingDetailsSentence>{tradingDetailsSentence}</TradingDetailsSentence>
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

const TradingDetailsSentence = styled(FlexDivRowCentered)`
    margin-bottom: 15px;
`;

export default TradingDetailsModal;
