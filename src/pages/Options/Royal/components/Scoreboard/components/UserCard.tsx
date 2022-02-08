import { Modal } from '@material-ui/core';
import { SYNTHS_MAP } from 'constants/currency';
import { MAX_L2_GAS_LIMIT } from 'constants/options';
import { ethers } from 'ethers';
import Swap from 'pages/Options/Home/Swap';
import { OP_KOVAN_SUSD, OP_sUSD } from 'pages/Options/Home/Swap/tokens';
import { Positions } from 'pages/Options/Royal/Queries/usePositionsQuery';
import { FooterData } from 'pages/Options/Royal/Queries/useRoyaleFooterQuery';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDiv, FlexDivCentered, FlexDivColumn, Image, Text } from 'theme/common';
import { getCurrencyKeyBalance } from 'utils/balances';
import erc20Contract from 'utils/contracts/erc20Contract';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { truncateAddress } from 'utils/formatters/string';
import { getIsOVM } from 'utils/network';
import { dispatchMarketNotification } from 'utils/options';
import snxJSConnector from 'utils/snxJSConnector';
import useLatestRoyaleForUserInfo from '../queries/useLastRoyaleForUserInfo';
import { User, UserStatus } from '../queries/useRoyalePlayersQuery';
import useUserRoyalQuery, { AnonimUser } from '../queries/useUserRoyalQuery';
import UserEditRoyaleDataDialog from './UserEditRoyaleDataDialog/UserEditRoyaleDataDialog';

type UserCardProps = {
    ethPrice: string;
    positions: Positions;
    royaleFooterData: FooterData | undefined;
    selectedSeason: number;
};

const UserCard: React.FC<UserCardProps> = ({ selectedSeason, royaleFooterData, ethPrice, positions }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isL2 = getIsOVM(networkId);
    const userQuery = useUserRoyalQuery(walletAddress as any, networkId, selectedSeason, {
        enabled: isL2 && isAppReady,
    });
    const user = userQuery.isSuccess ? userQuery.data : AnonimUser;
    const royaleQuery = useLatestRoyaleForUserInfo(selectedSeason, { enabled: isL2 && isAppReady });
    const royaleData = royaleQuery.isSuccess ? royaleQuery.data : {};

    const [allowance, setAllowance] = useState(false);
    const [balance, setBalance] = useState('0');
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [showSwap, setShowSwap] = useState(false);
    const buyInToken = isL2 ? (networkId === 10 ? OP_sUSD : OP_KOVAN_SUSD) : '';
    const truncateAddressNumberOfCharacters = window.innerWidth < 768 ? 2 : 5;

    const synthsWalletBalancesQuery = useSynthsBalancesQuery(walletAddress ?? '', networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const walletBalancesMap =
        synthsWalletBalancesQuery.isSuccess && synthsWalletBalancesQuery.data
            ? { synths: synthsWalletBalancesQuery.data }
            : null;
    const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;

    useEffect(() => {
        if (selectedSeason !== 0) {
            royaleQuery.remove();
            userQuery.remove();
        }
    }, [selectedSeason]);

    const updateBalanceAndAllowance = async (token: any) => {
        if (token) {
            const erc20Instance = new ethers.Contract((token as any).address, erc20Contract.abi, snxJSConnector.signer);
            const { thalesRoyaleContract } = snxJSConnector;
            if (thalesRoyaleContract) {
                try {
                    const allowance = await erc20Instance.allowance(walletAddress, thalesRoyaleContract.address);
                    setAllowance(!!bigNumberFormatter(allowance));
                } catch (e) {
                    console.log(e);
                }

                try {
                    const balance = await erc20Instance.balanceOf(walletAddress);
                    setBalance(ethers.utils.formatUnits(balance));
                } catch (e) {
                    console.log(e);
                }
            }
        }
    };

    const approve = async () => {
        const erc20Instance = new ethers.Contract(
            (buyInToken as any).address,
            erc20Contract.abi,
            snxJSConnector.signer
        );
        try {
            const { thalesRoyaleContract } = snxJSConnector;
            if (thalesRoyaleContract) {
                const tx = await erc20Instance.approve(thalesRoyaleContract.address, ethers.constants.MaxUint256, {
                    gasLimit: MAX_L2_GAS_LIMIT,
                });
                await tx.wait();
                setAllowance(true);
            }
        } catch (e) {
            console.log('failed: ', e);
        }
    };

    useEffect(() => {
        if (buyInToken && snxJSConnector.signer) updateBalanceAndAllowance(buyInToken).then();
    }, [buyInToken, snxJSConnector.signer]);

    const getFooter = (user: User | undefined, royaleData: any) => {
        if (!royaleData) return;
        if (!user) return;
        if (royaleData.season === selectedSeason) {
            if (royaleData.signUpPeriod > new Date()) {
                if (user.status === UserStatus.NOTSIGNED) {
                    if (allowance) {
                        const buyInAmount = royaleData.buyInAmount;
                        return (
                            <>
                                <Button
                                    className={buyInAmount > Number(balance) ? 'disabled' : ''}
                                    disabled={buyInAmount > Number(balance)}
                                    onClick={signUp}
                                >
                                    {t('options.royale.scoreboard.buy-in', { buyInAmount })}
                                </Button>
                                {buyInAmount > Number(balance) && (
                                    <DeadText style={{ marginTop: 10 }}>
                                        {t('options.royale.scoreboard.insufficient-balance')}
                                    </DeadText>
                                )}
                            </>
                        );
                    } else {
                        return (
                            <Button
                                onClick={async () => {
                                    await approve();
                                    updateBalanceAndAllowance(buyInToken);
                                }}
                            >
                                {t('options.royale.scoreboard.approve-susd')}
                            </Button>
                        );
                    }
                }
            } else {
                if (user.status === UserStatus.RDY) {
                    if (user.isAlive) {
                        return <></>;
                    } else {
                        return (
                            <DeadText>
                                <span>{t('options.royale.footer.you-were-eliminated-in')}</span>
                                <span>
                                    {` ${t('options.royale.footer.rd')} `}
                                    {user.deathRound}
                                </span>
                            </DeadText>
                        );
                    }
                }

                if (!royaleData.seasonStarted) {
                    return;
                }

                if (royaleData.seasonFinished || (!royaleData.seasonStarted && !royaleData.canStartNewSeason)) {
                    return (
                        <DeadText>
                            <i className="icon icon--clock" style={{ paddingRight: 10 }}></i>
                            {t('options.royale.scoreboard.season-finished')}
                        </DeadText>
                    );
                } else {
                    return (
                        <DeadText>
                            <i className="icon icon--clock" style={{ paddingRight: 10 }}></i>
                            {t('options.royale.scoreboard.period-expired')}
                        </DeadText>
                    );
                }
            }
        }
    };

    return (
        <UserWrapper>
            {!openEditDialog ?? (
                <OverlayForDropDown
                    onClick={() => {
                        if (openEditDialog) setOpenEditDialog(false);
                    }}
                ></OverlayForDropDown>
            )}

            <UserEditRoyaleDataDialog
                open={openEditDialog}
                handleClose={setOpenEditDialog.bind(this, false)}
                user={user}
                walletAddress={walletAddress}
            ></UserEditRoyaleDataDialog>
            <FlexDiv style={{ alignItems: 'center' }}>
                {user?.avatar ? (
                    <UserAvatar src={user.avatar} style={{ marginRight: 14 }} />
                ) : (
                    <i className="icon icon--user-avatar" style={{ fontSize: 44, marginRight: 14 }} />
                )}

                <UserLabel>
                    <Trans
                        i18nKey="options.royale.scoreboard.player-no"
                        components={{ sans: <span style={{ fontFamily: 'sans-serif !important' }} /> }}
                    />

                    {' #'}
                    {user?.number}
                </UserLabel>
            </FlexDiv>
            <FlexDivColumn style={{ margin: '20px 0' }}>
                <FlexContainer>
                    <UserLabel>{t('options.leaderboard.display-name')}:</UserLabel>
                    <InputWrapper>
                        {user.name}
                        <SearchIcon
                            onClick={setOpenEditDialog.bind(this, true)}
                            className="icon icon--user-avatar"
                            style={{
                                position: 'relative',
                                cursor: 'pointer',
                                top: '3.5px',
                                float: 'right',
                                marginTop: 'auto',
                                marginBottom: 'auto',
                                marginRight: '-5px',
                            }}
                        />
                    </InputWrapper>
                </FlexContainer>
                <FlexContainer>
                    <UserLabel>{t('options.leaderboard.address')}:</UserLabel>
                    <InputWrapper>
                        {truncateAddress(
                            walletAddress as any,
                            truncateAddressNumberOfCharacters,
                            truncateAddressNumberOfCharacters
                        )}
                    </InputWrapper>
                </FlexContainer>
                <FlexContainer>
                    <UserLabel>{t('options.leaderboard.balance')}:</UserLabel>
                    <InputWrapper>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, sUSDBalance)}</InputWrapper>
                </FlexContainer>
                <FlexContainer>
                    {walletAddress && (
                        <Button
                            onClick={() => {
                                setShowSwap(true);
                            }}
                        >
                            {t('options.swap.button-text')}
                        </Button>
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
                </FlexContainer>
                <InfoSection>
                    <div>
                        <span>{t('options.royale.footer.up')}</span>
                        <span>{`${positions?.up} ${t('options.royale.footer.vs')}  ${positions?.down}`}</span>
                        <span>{t('options.royale.footer.down')}</span>
                    </div>
                    <div>
                        <span>
                            {t('options.royale.footer.current')} ETH {t('options.royale.footer.price')}:
                        </span>
                        <span>${Number(ethPrice).toFixed(2)}</span>
                    </div>
                    <div>
                        <span>{t('options.royale.footer.reward-per-player')}:</span>
                        <span>{royaleFooterData?.reward.toFixed(2)} sUSD</span>
                    </div>
                    <div>
                        <span>{t('options.royale.footer.players-alive')}:</span>
                        <span>{royaleFooterData?.playersAlive}</span>
                    </div>
                </InfoSection>
            </FlexDivColumn>
            {getFooter(user, royaleData)}
        </UserWrapper>
    );
};

const signUp = async () => {
    const { thalesRoyaleContract } = snxJSConnector;
    if (thalesRoyaleContract) {
        const RoyalContract = thalesRoyaleContract.connect((snxJSConnector as any).signer);
        try {
            const tx = await RoyalContract.signUp();
            await tx.wait();
            dispatchMarketNotification('Successfully Signed Up');
        } catch (e) {
            console.log(e);
        }
    }
};

const UserAvatar = styled(Image)<{ winner?: boolean }>`
    width: 44px;
    height: 44px;
    border-radius: 50%50%;
    border: ${(props) => (props.winner ? '2px solid #FFE489' : 'none')};
    filter: ${(props) => (props.winner ? 'drop-shadow(0px 0px 15px rgba(255, 232, 155, 0.7))' : 'none')};
    @media (max-width: 1024px) {
        width: 40px;
        height: 40px;
    }
`;

const OverlayForDropDown = styled.div`
    background: transparent;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
`;

const DeadText = styled(Text)`
    font-family: Sansation !important;
    font-style: normal;
    font-weight: bold;
    font-size: 23px;
    line-height: 26px;
    color: var(--color);
    text-shadow: 0px 0px 30px var(--color);
    text-align: center;
`;

const UserWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 34px 70px;
    background: var(--color-wrapper);
    border: 5px solid var(--color);
    box-sizing: border-box;
    border-radius: 5px;
    margin-top: 14px;
    margin-bottom: 50px;
    @media (max-width: 1024px) {
        padding: 15px;
    }
`;

const UserLabel = styled.p`
    font-family: Sansation !important;
    font-style: normal;
    font-size: 20px;
    color: var(--color);
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
    margin: auto;
    &.disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const SearchIcon = styled.i`
    position: absolute;
    right: 10px;
    top: 4px;
    font-size: 17px;
    line-height: 20px;
    min-width: 17px !important;
`;

const InputWrapper = styled.div`
    width: 220px;
    border: 1.30233px solid var(--color);
    box-sizing: border-box;
    border-radius: 19.5349px;
    height: 28px;
    white-space: nowrap;
    overflow: hidden;
    font-family: Sansation !important;
    font-style: normal;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    letter-spacing: -0.4px;
    color: var(--color);
    text-overflow: ellipsis;
    @media (max-width: 1024px) {
        width: 150px;
    }
`;

const FlexContainer = styled(FlexDivCentered)`
    justify-content: space-between;
    margin: 7px 0;
`;

const InfoSection = styled.div`
    color: var(--color);
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 30px;
    padding-top: 1em;
    z-index: 1000;
    right: 30px;
    bottom: 30px;
    > * {
        &:first-child {
            justify-content: center;
        }
        margin-bottom: 0.1em;
        display: flex;
        justify-content: space-between;
        > * {
            font-family: SansationLight !important;
            &:nth-child(2),
            &:first-child {
                padding-right: 7px;
            }
            &:nth-child(2) {
                font-weight: bold;
                font-family: basis33 !important;
                font-size: 28px;
            }
            &:nth-child(4) {
                padding-left: 7px;
            }
        }
    }
    @media (min-width: 1025px) {
        display: none;
    }
`;

export default UserCard;
