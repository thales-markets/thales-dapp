import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { truncateAddress } from 'utils/formatters/string';
import onboardConnector from 'utils/onboardConnector';
import { getEthBalance } from '../../getThalesRoyalData';
import { Theme } from '../../ThalesRoyal';
import UserInfoRoyaleDialog from '../UserInfoRoyaleDialog/UserInfoRoyaleDialog';
import './media.scss';

type RoyaleHeaderInput = {
    theme: Theme;
    setTheme: (data: any) => void;
};

const RoyaleHeader: React.FC<RoyaleHeaderInput> = ({ theme, setTheme }) => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const [balance, setBalance] = useState(0);
    const [openUserInfo, setOpenUserInfo] = useState(false);
    useEffect(() => {
        if (walletAddress) {
            getEthBalance(walletAddress).then((balance: any) => {
                console.log(balance);
                setBalance(balance);
            });
        }
        return undefined;
    }, [walletAddress]);

    return (
        <>
            <Header>
                <ThalesLogo className="icon icon--logo" />
                <InfoWrapper>
                    {!walletAddress && (
                        <HeaderButton onClick={onboardConnector.connectWallet}>
                            <WalletIcon className="icon icon--wallet" />
                            <InfoText>{t('common.wallet.connect-your-wallet')}</InfoText>
                        </HeaderButton>
                    )}
                    {walletAddress && (
                        <HeaderButton onClick={() => setOpenUserInfo(true)}>
                            <UserAvatar className="icon icon--user-avatar" />
                            <UserText>{truncateAddress(walletAddress as any, 5, 5)}</UserText>
                            <UserText> {balance} Eth </UserText>
                        </HeaderButton>
                    )}
                    <UtilWrapper>
                        <RoyaleLogo className="icon icon--royale-logo" />
                        <BorderedWrapper
                            style={{
                                flexDirection: theme === Theme.Light ? 'row' : 'row-reverse',
                                cursor: 'pointer',
                                maxWidth: 70,
                            }}
                            onClick={setTheme.bind(this, theme === Theme.Light ? Theme.Dark : Theme.Light)}
                        >
                            <ThemeSelector>
                                {' '}
                                {theme === Theme.Light ? (
                                    <ThemeIcon className="icon icon--b-theme" />
                                ) : (
                                    <ThemeIcon className="icon icon--g-theme" />
                                )}
                            </ThemeSelector>
                            <ThemeText>Theme</ThemeText>
                        </BorderedWrapper>
                    </UtilWrapper>
                </InfoWrapper>
                <UserInfoRoyaleDialog
                    walletAddress={walletAddress}
                    network={'Optimistic Kovan'}
                    open={openUserInfo}
                    handleClose={setOpenUserInfo.bind(this, false)}
                    theme={theme}
                />
            </Header>
        </>
    );
};

const Header = styled.div`
    position: relative;
    padding-top: 35px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
`;

const ThemeSelector = styled.div`
    background: var(--color);
    color: var(--color-wrapper);
    border-radius: 50%;
    font-size: 18px;
    line-height: 20px;
    font-weight: bold;
    width: 20px;
    height: 20px;
    text-align: center;
`;

const ThemeText = styled.p`
    font-family: SensationLight !important;
    font-size: 10px;
    color: var(--color);
    text-transform: uppercase;
    letter-spacing: -0.4px;
    font-weight: 300;
`;

const ThemeIcon = styled.i`
    background: var(--color-wrapper);
`;
const UtilWrapper = styled.div`
    display: flex;
    flex: 1;
    justify-content: space-around;
    align-items: flex-start;
    width: 100%;
    margin-top: 8px;
`;

const ThalesLogo = styled.i`
    font-size: 127px;
    line-height: 30px;
`;
const InfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
`;
const RoyaleLogo = styled.i`
    line-height: 36px;
    font-size: 78px;
`;
const BorderedWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--color);
    box-sizing: border-box;
    border-radius: 20px;
    height: 28px;
    padding: 4px 6px;
    flex: 1;
`;
const UserAvatar = styled.i`
    font-size: 20px;
`;

const UserText = styled.p`
    font-family: Sansation !important;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    color: var(--color);

    margin: 0 4px;

    &:last-child {
        border-left: 1px solid var(--color);
        padding-left: 8px;
    }
`;

const WalletIcon = styled.i`
    font-size: 17px;
`;

const InfoText = styled.p`
    font-family: Sansation !important;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    color: var(--color);

    margin: 0 4px;

    &:last-child {
        padding-left: 8px;
    }
`;

const HeaderButton = styled.button`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid var(--color);
    box-sizing: border-box;
    border-radius: 20px;
    height: 28px;
    padding: 4px 6px;
    flex: 1;
    background: transparent;
    cursor: pointer;
`;

export default RoyaleHeader;
