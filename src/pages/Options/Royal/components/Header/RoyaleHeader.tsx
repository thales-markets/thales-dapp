import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import Cookies from 'universal-cookie';
import { truncateAddress } from 'utils/formatters/string';
import onboardConnector from 'utils/onboardConnector';
import useEthBalanceQuery from '../../Queries/useEthBalanceQuery';
import { Theme } from '../../ThalesRoyal';
import UserInfoRoyaleDialog from '../UserInfoRoyaleDialog/UserInfoRoyaleDialog';
import { LanguageSelectorRoyale } from './LanguageSelectorRoyale/LanguageSelectorRoyale';
import './media.scss';

type RoyaleHeaderInput = {
    theme: Theme;
    setTheme: (data: any) => void;
};

enum BurgerState {
    Init,
    Show,
    Hide,
}

const cookies = new Cookies();

const RoyaleHeader: React.FC<RoyaleHeaderInput> = ({ theme, setTheme }) => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const [openUserInfo, setOpenUserInfo] = useState(false);
    const balanceQuery = useEthBalanceQuery(walletAddress ?? '', { enabled: walletAddress !== null });
    const balance = balanceQuery.isSuccess ? balanceQuery.data : '';

    const [showBurgerMenu, setShowBurgerMenu] = useState<BurgerState>(BurgerState.Init);

    return (
        <>
            <Header>
                <ThalesLogo className="icon icon--logo" />
                <InfoWrapper>
                    <UtilWrapper>
                        <RoyaleLogo className="icon icon--royale-logo" />
                        <MeatballsIcon
                            position="initial"
                            className="icon icon--three-dots"
                            onClick={() =>
                                setShowBurgerMenu(
                                    showBurgerMenu === BurgerState.Show ? BurgerState.Hide : BurgerState.Show
                                )
                            }
                        />
                    </UtilWrapper>
                    <BurgerMenu style={{ visibility: showBurgerMenu === BurgerState.Show ? 'visible' : 'hidden' }}>
                        <RoyaleLogo className="icon icon--royale-logo" />
                        <MeatballsIcon
                            position="absolute"
                            className="icon icon--three-dots"
                            onClick={() =>
                                setShowBurgerMenu(
                                    showBurgerMenu === BurgerState.Show ? BurgerState.Hide : BurgerState.Show
                                )
                            }
                        />
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
                        <BorderedWrapper
                            style={{
                                flexDirection: theme === Theme.Light ? 'row' : 'row-reverse',
                                cursor: 'pointer',
                                maxWidth: 70,
                            }}
                            onClick={() => {
                                cookies.set('theme', theme === Theme.Light ? Theme.Dark : Theme.Light);
                                setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light);
                            }}
                        >
                            <ThemeSelector>
                                {theme === Theme.Light ? (
                                    <ThemeIcon className="icon icon--b-theme" />
                                ) : (
                                    <ThemeIcon className="icon icon--g-theme" />
                                )}
                            </ThemeSelector>
                            <ThemeText>{t('options.royale.header.theme')}</ThemeText>
                        </BorderedWrapper>
                        <LanguageSelectorRoyale />
                    </BurgerMenu>
                    {showBurgerMenu === BurgerState.Show && (
                        <Overlay onClick={() => setShowBurgerMenu(BurgerState.Hide)} />
                    )}
                </InfoWrapper>
                <UserInfoRoyaleDialog
                    walletAddress={walletAddress}
                    network={'Optimism Kovan'}
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
    @media (max-width: 1024px) {
        justify-content: center;
    }
`;

const ThemeSelector = styled.div``;

const ThemeText = styled.p`
    font-family: sans-serif !important;
    font-size: 10px;
    color: var(--color);
    text-transform: uppercase;
    letter-spacing: -0.4px;
    font-weight: 300;
`;

const ThemeIcon = styled.i`
    &.icon--b-theme {
        margin-left: -2px;
    }

    &.icon--g-theme {
        margin-right: -2px;
    }
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
    @media (max-width: 1024px) {
        display: none;
    }
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
    padding-bottom: 10px;
    padding-right: 20px;
    @media (max-width: 1024px) {
        line-height: 140px;
        font-size: 164px;
        padding-bottom: 0;
        padding-right: 0;
    }
`;

const MeatballsIcon = styled.i<{ position: string }>`
    z-index: 5;
    line-height: 25px;
    font-size: 25px;
    cursor: pointer;
    position: ${(props) => props.position};
    top: 15px;
    right: 15px;
    @media (max-width: 1024px) {
        position: absolute;
    }
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
    margin-bottom: 10px;
`;

const BurgerMenu = styled.div`
    border: 5px solid var(--color);
    box-sizing: border-box;
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    position: absolute;
    top: 23px;
    right: -20px;
    background: var(--color-background);
    padding: 15px;
    z-index: 5;
    @media (max-width: 1024px) {
        left: 0;
        right: 0;
    }
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 4;
`;

export default RoyaleHeader;
