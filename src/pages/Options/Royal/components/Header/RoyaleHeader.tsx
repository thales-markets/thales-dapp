import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
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
import { Text } from '../../../../../theme/common';
import Swap from 'pages/Options/Home/Swap';
import { Modal } from '@material-ui/core';
import { SYNTHS_MAP } from 'constants/currency';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import { getIsAppReady } from 'redux/modules/app';
import { getCurrencyKeyBalance } from 'utils/balances';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { MAX_L2_GAS_LIMIT } from 'constants/options';
import { BigNumber, ethers } from 'ethers';
import erc20Contract from 'utils/contracts/erc20Contract';
import snxJSConnector from 'utils/snxJSConnector';
import { OP_KOVAN_SUSD, OP_sUSD } from 'pages/Options/Home/Swap/tokens';
import { checkAllowance, getIsOVM } from 'utils/network';
import ApprovalModal from 'components/ApprovalModal';
import useRoyalePassQuery from '../../V2/components/queries/useRoyalePassQuery';
import { dispatchMarketNotification } from 'utils/options';

type RoyaleHeaderInput = {
    latestSeason: number;
    selectedSeason: number;
    setSelectedSeason: (season: number) => void;
    theme: Theme;
    setTheme: (data: any) => void;
};

enum BurgerState {
    Init,
    Show,
    Hide,
}

const cookies = new Cookies();

const RoyaleHeader: React.FC<RoyaleHeaderInput> = ({
    theme,
    setTheme,
    selectedSeason,
    setSelectedSeason,
    latestSeason,
}) => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isL2 = getIsOVM(networkId);
    const [openUserInfo, setOpenUserInfo] = useState(false);
    const [showSelectDropdown, setShowSelectDropdown] = useState(false);
    const [showSwap, setShowSwap] = useState(false);
    const [allowance, setAllowance] = useState(false);
    const [walletBalance, setWalletBalance] = useState('0');
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
    const balanceQuery = useEthBalanceQuery(walletAddress, { enabled: walletAddress !== null });
    const balance = balanceQuery.isSuccess ? balanceQuery.data : '';
    const royalePassQuery = useRoyalePassQuery(walletAddress, { enabled: isL2 && isWalletConnected && isAppReady });
    const royalePassData = royalePassQuery.isSuccess ? royalePassQuery.data : {};
    const buyInToken = isL2 ? (networkId === 10 ? OP_sUSD : OP_KOVAN_SUSD) : '';

    const synthsWalletBalancesQuery = useSynthsBalancesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const walletBalancesMap =
        synthsWalletBalancesQuery.isSuccess && synthsWalletBalancesQuery.data
            ? { synths: synthsWalletBalancesQuery.data }
            : null;
    const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;

    const [showBurgerMenu, setShowBurgerMenu] = useState<BurgerState>(BurgerState.Init);

    const allSeasons = useMemo(() => {
        const seasons = [];
        for (let j = 1; j <= Number(latestSeason); j++) {
            seasons.push(j);
        }
        return seasons;
    }, [latestSeason]);

    useEffect(() => {
        if (buyInToken && snxJSConnector.signer && (royalePassData as any).price && walletAddress)
            updateRoyalePassBalanceAndAllowance(buyInToken);
    }, [buyInToken, snxJSConnector.signer, (royalePassData as any).price, isAllowing, walletAddress]);

    const updateRoyalePassBalanceAndAllowance = async (token: any) => {
        if (token) {
            const erc20Instance = new ethers.Contract((token as any).address, erc20Contract.abi, snxJSConnector.signer);
            const { thalesRoyalePassContract } = snxJSConnector;
            if (thalesRoyalePassContract) {
                try {
                    const price = (royalePassData as any).price;
                    const allowance = await checkAllowance(
                        price,
                        erc20Instance,
                        walletAddress,
                        thalesRoyalePassContract.address
                    );
                    setAllowance(allowance);
                } catch (e) {
                    console.log(e);
                }

                try {
                    const balance = await erc20Instance.balanceOf(walletAddress);
                    setWalletBalance(ethers.utils.formatUnits(balance));
                } catch (e) {
                    console.log(e);
                }
            }
        }
    };

    const approveRoyalePassMinting = async (approveAmount: BigNumber) => {
        const erc20Instance = new ethers.Contract(
            (buyInToken as any).address,
            erc20Contract.abi,
            snxJSConnector.signer
        );
        try {
            setIsAllowing(true);
            const { thalesRoyalePassContract } = snxJSConnector;
            if (thalesRoyalePassContract) {
                const tx = await erc20Instance.approve(thalesRoyalePassContract.address, approveAmount, {
                    gasLimit: MAX_L2_GAS_LIMIT,
                });
                setOpenApprovalModal(false);
                await tx.wait();
            }
            setIsAllowing(false);
        } catch (e) {
            console.log('failed: ', e);
            setIsAllowing(false);
        }
    };

    const mintRoyalePass = async (walletAddress: string) => {
        const { thalesRoyalePassContract } = snxJSConnector;
        if (thalesRoyalePassContract) {
            const RoyalContract = thalesRoyalePassContract.connect((snxJSConnector as any).signer);
            try {
                const tx = await RoyalContract.mint(walletAddress);
                console.log(tx);
                await tx.wait();
                dispatchMarketNotification('Successfully Minted Royale Pass');
            } catch (e) {
                console.log(e);
            }
        }
    };

    return (
        <>
            <Header>
                <ThalesLogo className="icon icon--logo" />
                <InfoWrapper>
                    <UtilWrapper>
                        {walletAddress && (
                            <>
                                {allowance ? (
                                    <Button
                                        className={walletBalance < (royalePassData as any).price ? 'disabled' : ''}
                                        disabled={walletBalance < (royalePassData as any).price}
                                        onClick={() => {
                                            mintRoyalePass(walletAddress);
                                        }}
                                    >
                                        {t('options.royale.scoreboard.mint-royale-pass')}
                                    </Button>
                                ) : (
                                    <Button onClick={() => setOpenApprovalModal(true)}>
                                        {t('options.royale.scoreboard.approve-royale-pass')}
                                    </Button>
                                )}
                                <Button onClick={() => setShowSwap(true)}>{t('options.swap.button-text')}</Button>
                                <Balances>
                                    <span>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, sUSDBalance)}</span>{' '}
                                    <span>
                                        {(royalePassData as any).balance} {t('options.royale.scoreboard.royale-pass')}
                                    </span>
                                </Balances>
                            </>
                        )}
                        <Modal
                            open={showSwap}
                            onClose={(_, reason) => {
                                if (reason !== 'backdropClick') setShowSwap(false);
                            }}
                        >
                            <div style={{ height: 0 }}>
                                <Swap royaleTheme={true} handleClose={setShowSwap}></Swap>
                            </div>
                        </Modal>
                        <RoyaleLogo className="icon icon--royale-logo" />
                        {selectedSeason !== 0 && (
                            <SeasonSelector isOpen={showSelectDropdown}>
                                {selectedSeason !== 0 ? (
                                    <Text onClick={setShowSelectDropdown.bind(this, true)}>
                                        {t('options.royale.scoreboard.season')} {selectedSeason}
                                        {!showSelectDropdown && allSeasons.length > 1 && (
                                            <Arrow className="icon icon--arrow-down" />
                                        )}
                                    </Text>
                                ) : (
                                    <Text>{t('options.royale.scoreboard.loading-season')}</Text>
                                )}
                                {showSelectDropdown &&
                                    allSeasons
                                        .filter((number) => number !== selectedSeason)
                                        .map((option: number, key: number) => (
                                            <Text
                                                onClick={() => {
                                                    if (allSeasons.length > 1) {
                                                        setSelectedSeason(option);
                                                        setShowSelectDropdown(false);
                                                    }
                                                }}
                                                key={key}
                                            >
                                                {t('options.royale.scoreboard.season')} {option}
                                            </Text>
                                        ))}
                            </SeasonSelector>
                        )}
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
                            className="icon icon--x-sign"
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
                    {showSelectDropdown && <Overlay onClick={() => setShowSelectDropdown(false)} />}
                </InfoWrapper>
                <UserInfoRoyaleDialog
                    walletAddress={walletAddress}
                    network={'Optimism Kovan'}
                    open={openUserInfo}
                    handleClose={setOpenUserInfo.bind(this, false)}
                    theme={theme}
                />
            </Header>
            {openApprovalModal && (
                <ApprovalModal
                    defaultAmount={(royalePassData as any).price}
                    tokenSymbol={SYNTHS_MAP.sUSD}
                    isAllowing={isAllowing}
                    onSubmit={approveRoyalePassMinting}
                    onClose={() => setOpenApprovalModal(false)}
                    isRoyale={true}
                />
            )}
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
        margin-bottom: 20px;
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
    &.icon--x-sign {
        font-size: 20px;
    }
    @media (max-width: 1024px) {
        position: absolute;
        z-index: 999;
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
        z-index: 10000;
        .icon--royale-logo {
            font-size: 78px !important;
            line-height: 52px !important;
        }
    }
`;

const SeasonSelector = styled.div<{ isOpen: boolean }>`
    transform: ${(props) => (props.isOpen ? 'translateY(calc(100% - 30px))' : '')};
    position: absolute;
    bottom: -10px;
    margin-right: 5px;
    width: 171px;
    border: 2px solid var(--color);
    box-sizing: border-box;
    border-radius: 18px;
    font-family: Sansation !important;
    font-style: normal;
    font-size: 20px;
    line-height: 26px;
    letter-spacing: -0.4px;
    color: var(--color);
    cursor: pointer;
    text-align: center;
    background: var(--color-wrapper);
    z-index: 5;
    p:first-child {
        font-weight: bold;
        font-size: 20px;
    }
    @media (min-width: 1025px) {
        display: none;
    }
`;

const Arrow = styled.i`
    font-size: 12px;
    line-height: 8px;
    display: inline-block;
    padding-bottom: 3px;
    margin-left: 20px;
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 4;
`;

const Button = styled.button`
    align-items: center;
    cursor: pointer;
    display: flex;
    font-family: Sansation !important;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 22px;
    background: var(--color);
    border: 1px solid var(--color);
    box-sizing: border-box;
    box-shadow: 0px 0px 30px var(--color);
    border-radius: 20px;
    padding: 6px 15px 6px 20px;
    color: var(--color-wrapper);
    margin-top: -4px;
    margin-right: 20px;
    &.disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    @media (max-width: 1024px) {
        display: none;
    }
`;

const Balances = styled.div`
    padding: 3px 15px 6px 5px;
    font-family: Sansation !important;
    color: var(--color);
    text-align: center;
    & > span {
        float: left;
        clear: left;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        font-family: Sansation !important;
        line-height: 13px;
    }
    @media (max-width: 1024px) {
        display: none;
    }
`;

export default RoyaleHeader;
