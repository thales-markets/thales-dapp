import React from 'react';
import { Modal } from 'semantic-ui-react';

type MarketInfoModalProps = {
    onClose: () => void;
};

const MarketInfoModal: React.FC<MarketInfoModalProps> = ({ onClose }) => {
    return (
        <>
            <Modal closeIcon size="mini" centered={false} closeOnDimmerClick={false} open={true} onClose={onClose}>
                <Modal.Content>
                    <h1>Market Info Modal</h1>
                </Modal.Content>
            </Modal>
        </>
    );
};

export default MarketInfoModal;
