import { useAccountModal } from '@rainbow-me/rainbowkit';
import ConnectWalletModal from 'components/ConnectWalletModal';
import NetworkSwitch from 'components/NetworkSwitch';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
    getIsWalletConnected,
    getWalletAddress,
    getWalletConnectModalVisibility,
    setWalletConnectModalVisibility,
} from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { truncateAddress } from 'thales-utils';
import UserSwap from '../UserSwap';

const TRUNCATE_ADDRESS_NUMBER_OF_CHARS = 5;

const UserWallet: React.FC = () => {
    const { t } = useTranslation();
    const { openAccountModal } = useAccountModal();
    const dispatch = useDispatch();

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const connectWalletModalVisibility = useSelector((state: RootState) => getWalletConnectModalVisibility(state));

    const [walletText, setWalletText] = useState('');

    console.log('USer wallet component');
    console.log('isWalletConnected ', isWalletConnected);
    return (
        <Container>
            <Wrapper>
                <UserSwap />
                <WalletContainer
                    connected={isWalletConnected}
                    onClick={
                        isWalletConnected
                            ? openAccountModal
                            : () => {
                                  dispatch(
                                      setWalletConnectModalVisibility({
                                          visibility: !connectWalletModalVisibility,
                                      })
                                  );
                              }
                    }
                    onMouseOver={() => setWalletText(t('common.wallet.wallet-options'))}
                    onMouseLeave={() => setWalletText('')}
                >
                    {walletAddress
                        ? walletText ||
                          truncateAddress(
                              walletAddress,
                              TRUNCATE_ADDRESS_NUMBER_OF_CHARS,
                              TRUNCATE_ADDRESS_NUMBER_OF_CHARS
                          )
                        : t('common.wallet.connect-your-wallet')}
                </WalletContainer>
                <NetworkSwitch />
            </Wrapper>
            <ConnectWalletModal
                isOpen={connectWalletModalVisibility}
                onClose={() => {
                    dispatch(
                        setWalletConnectModalVisibility({
                            visibility: !connectWalletModalVisibility,
                        })
                    );
                }}
            />
        </Container>
    );
};

const Container = styled.div`
    width: 400px;
    @media (max-width: 500px) {
        width: 100%;
    }
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid ${(props) => props.theme.borderColor.secondary};
    border-radius: 8px;
    @media (max-width: 500px) {
        height: 26px;
    }
`;

const WalletContainer = styled.div<{ connected: boolean }>`
    width: 100%;
    min-width: 120px;
    cursor: ${(props) => (props.connected ? 'text' : 'pointer')};
    padding: 4px 13px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-left: 2px solid ${(props) => props.theme.borderColor.secondary};
    border-right: 2px solid ${(props) => props.theme.borderColor.secondary};
    color: ${(props) => props.theme.textColor.primary};
    font-weight: normal;
    font-size: 13px;
    text-align: center;
    @media (max-width: 500px) {
        min-width: fit-content;
        max-width: ${(props) => (props.connected ? '100px' : '120px')};
        padding: 4px 7px;
    }
`;

export default UserWallet;
