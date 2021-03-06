import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WalletTypeSelector from './WalletTypeSelector';
import WalletAddressSelector from './WalletAddressSelector';
import { Modal } from 'semantic-ui-react';
import { getIsWalletConnected } from 'redux/modules/wallet/walletDetails';
import { toggleWalletPopup, walletPopupIsVisible } from 'redux/modules/ui';
import { RootState } from 'redux/rootReducer';

type DisplayContent = 'wallet-address-selector' | 'wallet-type-selector';

const WalletPopup: React.FC = () => {
    const [displayContent, setContentDisplay] = useState<DisplayContent>('wallet-type-selector');
    const popupIsVisible = useSelector((state: RootState) => walletPopupIsVisible(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const dispatch = useDispatch();

    useEffect(() => {
        if (popupIsVisible) {
            setContentDisplay(isWalletConnected ? 'wallet-address-selector' : 'wallet-type-selector');
        }
    }, [popupIsVisible, isWalletConnected]);

    const sharedProps = {
        goBack: () => setContentDisplay('wallet-type-selector'),
        selectAddressScreen: () => setContentDisplay('wallet-address-selector'),
    };

    return (
        <>
            <Modal
                closeIcon
                size="mini"
                centered={false}
                closeOnDimmerClick={false}
                open={popupIsVisible}
                onClose={() => dispatch(toggleWalletPopup(false))}
            >
                <Modal.Content>
                    {displayContent === 'wallet-address-selector' && <WalletAddressSelector />}
                    {displayContent === 'wallet-type-selector' && <WalletTypeSelector {...sharedProps} />}
                </Modal.Content>
            </Modal>
        </>
    );
};

export default WalletPopup;
