import { Modal } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivRowCentered } from 'theme/common';

type TradingDetailsModalProps = {
    onClose: () => void;
};

const TradingDetailsModal: React.FC<TradingDetailsModalProps> = ({ onClose }) => {
    const { t } = useTranslation();

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
                    <div>{t('Confirm UP Order')}</div>
                    <CloseIcon className="icon icon--x-sign" onClick={onClose} />
                </Header>
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
    font-weight: 600;
    font-size: 20px;
    letter-spacing: 0.15px;
    color: #f6f6fe;
    padding: 0px 2px 50px 2px;
`;

const CloseIcon = styled.i`
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 16px;
    line-height: 16px;
    cursor: pointer;
    color: ${(props) => props.theme.textColor.secondary};
`;

export default TradingDetailsModal;
