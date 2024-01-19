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
import { ScreenSizeBreakpoint } from 'enums/ui';

const TRUNCATE_ADDRESS_NUMBER_OF_CHARS = 5;

const UserWallet: React.FC = () => {
    const { t } = useTranslation();
    const { openAccountModal } = useAccountModal();
    const dispatch = useDispatch();

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const connectWalletModalVisibility = useSelector((state: RootState) => getWalletConnectModalVisibility(state));

    const [walletText, setWalletText] = useState('');

    return (
        <Container>
            {isWalletConnected ? (
                <Wrapper>
                    <UserSwap />
                    <WalletContainer
                        connected={true}
                        onClick={openAccountModal}
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
            ) : (
                <ButtonWrapper>
                    <LoginButton
                        onClick={() => {
                            dispatch(
                                setWalletConnectModalVisibility({
                                    visibility: !connectWalletModalVisibility,
                                })
                            );
                        }}
                    >
                        {t('common.wallet.login')}
                    </LoginButton>
                    <JoinUs
                        onClick={() => {
                            dispatch(
                                setWalletConnectModalVisibility({
                                    origin: 'sign-up',
                                    visibility: !connectWalletModalVisibility,
                                })
                            );
                        }}
                    >
                        {t('common.wallet.join-us')}
                    </JoinUs>
                </ButtonWrapper>
            )}

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

const LoginButton = styled.button`
    width: 120px;
    padding: 4px;
    background-color: ${(props) => props.theme.background.primary};
    color: ${(props) => props.theme.textColor.secondary};
    border-radius: 5px;
    border: 1px solid ${(props) => props.theme.borderColor.secondary};
    cursor: pointer;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 100%; /* 13px */
    text-transform: capitalize;
`;

const JoinUs = styled.button`
    width: 120px;
    padding: 4px;
    background-color: ${(props) => props.theme.background.quaternary};
    color: ${(props) => props.theme.button.textColor.primary};
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 100%; /* 13px */
    text-transform: capitalize;
`;

const Container = styled.div`
    width: 400px;
    z-index: 1;
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

const ButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: flex-end;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        justify-content: flex-start;
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
