import { Modal } from '@material-ui/core';
import { SYNTHS_MAP } from 'constants/currency';
import { MAX_L2_GAS_LIMIT } from 'constants/options';
import { BigNumber, ethers } from 'ethers';
import Swap from 'pages/Options/Home/Swap';
import { OP_KOVAN_SUSD, OP_sUSD } from 'pages/Options/Home/Swap/tokens';
import { RoyaleTooltip } from 'pages/Options/Market/components';
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
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { truncateAddress } from 'utils/formatters/string';
import { checkAllowance, getIsOVM } from 'utils/network';
import snxJSConnector from 'utils/snxJSConnector';
import UserEditRoyaleDataDialog from '../../components/UserEditRoyaleDataDialog/UserEditRoyaleDataDialog';
import { signUp, signUpWithPass, signUpWithPosition, signUpWithWithPassWithPosition } from '../../getThalesRoyalData';
import { Positions } from '../../Queries/usePositionsQuery';
import { User, UserStatus } from '../../Queries/useRoyalePlayersQuery';
import useLatestRoyaleForUserInfo from './queries/useLastRoyaleForUserInfo';
import { FooterData } from './queries/useRoyaleFooterQuery';
import useUserRoyalQuery, { AnonimUser } from './queries/useUserRoyalQuery';
import { ReactComponent as InfoIcon } from 'assets/images/info.svg';
import ApprovalModal from 'components/ApprovalModal';
import useRoyalePassQuery from './queries/useRoyalePassQuery';
import { dispatchMarketNotification } from 'utils/options';

type UserCardProps = {
    ethPrice: string;
    positions: Positions;
    royaleFooterData: FooterData | undefined;
    selectedSeason: number;
};
export enum PositionsEnum {
    NONE = 'none',
    DOWN = 'down',
    UP = 'up',
}

export const UserCard: React.FC<UserCardProps> = ({ selectedSeason, royaleFooterData, ethPrice, positions }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isL2 = getIsOVM(networkId);
    const userQuery = useUserRoyalQuery(walletAddress as any, networkId, selectedSeason, {
        enabled: isL2 && isAppReady,
    });
    const user = userQuery.isSuccess ? userQuery.data : AnonimUser;
    const royaleQuery = useLatestRoyaleForUserInfo(selectedSeason, { enabled: isL2 && isAppReady });
    const royaleData = royaleQuery.isSuccess ? royaleQuery.data : {};

    const royalePassQuery = useRoyalePassQuery(walletAddress, { enabled: isL2 && isWalletConnected });
    const royalePassData = royalePassQuery.isSuccess ? royalePassQuery.data : {};

    const [allowance, setAllowance] = useState(false);
    const [royalePassAllowance, setRoyalePassAllowance] = useState(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
    const [openRoyalePassApproveModal, setOpenRoyalePassApproveModal] = useState<boolean>(false);
    const [balance, setBalance] = useState('0');
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [showSwap, setShowSwap] = useState(false);
    const [royalePassId, setRoyalePassId] = useState(0);
    const [showSelectDropdown, setShowSelectDropdown] = useState(false);
    const previouslySelectedDefaultPosition = localStorage.getItem(
        'defaultPosition' + truncateAddress(walletAddress as any, 2, 2) + selectedSeason
    );
    const [defaultPosition, setDefaultPosition] = useState(
        previouslySelectedDefaultPosition ? previouslySelectedDefaultPosition : PositionsEnum.NONE
    );
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

    const getNftIdForWallet = async () => {
        const { thalesRoyalePassContract } = snxJSConnector;
        if (thalesRoyalePassContract) {
            const erc20Instance = new ethers.Contract(
                thalesRoyalePassContract.address,
                erc20Contract.abi,
                snxJSConnector.signer
            );

            try {
                const filterTo = await erc20Instance.filters.Transfer(null, walletAddress);
                await erc20Instance.queryFilter(filterTo).then((resp: any) => {
                    setRoyalePassId(Number(resp[0].topics[3]));
                });
            } catch (e) {
                console.log(e);
            }
        }
    };

    const updateAllowance = async (token: any) => {
        if (token) {
            const erc20Instance = new ethers.Contract((token as any).address, erc20Contract.abi, snxJSConnector.signer);
            const { thalesRoyaleContract } = snxJSConnector;
            if (thalesRoyaleContract) {
                try {
                    const parsedBuyInAmount = ethers.utils.parseEther(
                        Number((royaleData as any).buyInAmount).toString()
                    );
                    const allowance = await checkAllowance(
                        parsedBuyInAmount,
                        erc20Instance,
                        walletAddress,
                        thalesRoyaleContract.address
                    );
                    setAllowance(allowance);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    };

    const updateRoyalePassAllowance = async (token: any) => {
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
                    setRoyalePassAllowance(allowance);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    };

    const updateBalance = async (token: any) => {
        if (token) {
            const erc20Instance = new ethers.Contract((token as any).address, erc20Contract.abi, snxJSConnector.signer);
            try {
                const balance = await erc20Instance.balanceOf(walletAddress);
                setBalance(ethers.utils.formatUnits(balance));
            } catch (e) {
                console.log(e);
            }
        }
    };

    const approve = async (approveAmount: BigNumber) => {
        const erc20Instance = new ethers.Contract(
            (buyInToken as any).address,
            erc20Contract.abi,
            snxJSConnector.signer
        );
        try {
            setIsAllowing(true);
            const { thalesRoyaleContract } = snxJSConnector;
            if (thalesRoyaleContract) {
                const tx = await erc20Instance.approve(thalesRoyaleContract.address, approveAmount, {
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
                await tx.wait();
                dispatchMarketNotification('Successfully Minted Royale Pass');
            } catch (e) {
                console.log(e);
            }
        }
    };

    useEffect(() => {
        if (buyInToken && snxJSConnector.signer) {
            updateAllowance(buyInToken);
            updateRoyalePassAllowance(buyInToken);
            updateBalance(buyInToken);
        }
    }, [buyInToken, snxJSConnector.signer, (royaleData as any).buyInAmount, isAllowing]);

    const getFooter = (user: User | undefined, royaleData: any) => {
        if (!royaleData) return;
        if (!user) return;
        if (royaleData.season === selectedSeason) {
            if (royaleData.signUpPeriod > new Date()) {
                if (user.status === UserStatus.NOTSIGNED) {
                    const buyInAmount = royaleData.buyInAmount;
                    return (
                        <FlexContainer>
                            {allowance ? (
                                <Button
                                    className={buyInAmount > Number(balance) ? 'disabled' : ''}
                                    disabled={buyInAmount > Number(balance)}
                                    onClick={() => {
                                        defaultPosition !== PositionsEnum.NONE
                                            ? (localStorage.setItem(
                                                  'defaultPosition' +
                                                      truncateAddress(walletAddress as any, 2, 2) +
                                                      selectedSeason,
                                                  defaultPosition
                                              ),
                                              signUpWithPosition(
                                                  defaultPosition === PositionsEnum.DOWN ? 1 : 2
                                              ).finally(() => {
                                                  synthsWalletBalancesQuery.refetch();
                                              }))
                                            : signUp().finally(() => {
                                                  synthsWalletBalancesQuery.refetch();
                                              });
                                    }}
                                >
                                    {t('options.royale.scoreboard.buy-in', { buyInAmount })}
                                </Button>
                            ) : (
                                <Button
                                    className={isAllowing ? 'disabled' : ''}
                                    disabled={isAllowing}
                                    onClick={async () => {
                                        setOpenApprovalModal(true);
                                        updateAllowance(buyInToken);
                                        updateBalance(buyInToken);
                                    }}
                                >
                                    {t('options.royale.scoreboard.approve-susd')}
                                </Button>
                            )}
                            {royalePassAllowance ? (
                                <Button
                                    className={(royalePassData as any).balance === 0 ? 'disabled' : ''}
                                    disabled={(royalePassData as any).balance === 0}
                                    onClick={() => {
                                        defaultPosition !== PositionsEnum.NONE
                                            ? (localStorage.setItem(
                                                  'defaultPosition' +
                                                      truncateAddress(walletAddress as any, 2, 2) +
                                                      selectedSeason,
                                                  defaultPosition
                                              ),
                                              signUpWithWithPassWithPosition(
                                                  royalePassId,
                                                  defaultPosition === PositionsEnum.DOWN ? 1 : 2
                                              ).finally(() => {
                                                  royalePassQuery.refetch();
                                                  getNftIdForWallet();
                                              }))
                                            : signUpWithPass(royalePassId).finally(() => {
                                                  royalePassQuery.refetch();
                                                  getNftIdForWallet();
                                              });
                                    }}
                                >
                                    Buy in with Pass
                                </Button>
                            ) : (
                                <Button
                                    className={isAllowing ? 'disabled' : ''}
                                    disabled={isAllowing}
                                    onClick={async () => {
                                        setOpenApprovalModal(true);
                                        updateRoyalePassAllowance(buyInToken);
                                        updateBalance(buyInToken);
                                    }}
                                ></Button>
                            )}
                        </FlexContainer>
                    );
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
                <FlexContainer
                    style={{
                        position: 'relative',
                        display:
                            user.status === UserStatus.NOTSIGNED && (royaleData as any).signUpPeriod < new Date()
                                ? 'none'
                                : '',
                    }}
                >
                    <UserLabel>
                        {t('options.royale.scoreboard.default-position')}:
                        <RoyaleTooltip title={t('options.royale.scoreboard.default-position-info')}>
                            <StyledInfoIcon />
                        </RoyaleTooltip>
                    </UserLabel>
                    <PositionSelector
                        className={user.status === UserStatus.RDY ? 'disabled' : ''}
                        isOpen={showSelectDropdown}
                    >
                        {localStorage.getItem(
                            'defaultPosition' + truncateAddress(walletAddress as any, 2, 2) + selectedSeason
                        ) && user.status === UserStatus.RDY ? (
                            <Text>
                                {t(
                                    'options.royale.scoreboard.default-position-' +
                                        localStorage.getItem(
                                            'defaultPosition' +
                                                truncateAddress(walletAddress as any, 2, 2) +
                                                selectedSeason
                                        )
                                )}
                            </Text>
                        ) : (
                            <Text
                                onClick={
                                    user.status !== UserStatus.RDY ? setShowSelectDropdown.bind(this, true) : undefined
                                }
                            >
                                {t('options.royale.scoreboard.default-position-' + defaultPosition)}
                                <Arrow className="icon icon--arrow-down" />
                            </Text>
                        )}

                        {showSelectDropdown &&
                            Object.keys(PositionsEnum)
                                .filter((position) => position.toLowerCase() !== defaultPosition.toLowerCase())
                                .map((position: any, key: number) => (
                                    <Text
                                        onClick={() => {
                                            setDefaultPosition(PositionsEnum[position as keyof typeof PositionsEnum]);
                                            setShowSelectDropdown(false);
                                        }}
                                        key={key}
                                    >
                                        {t('options.royale.scoreboard.default-position-' + position.toLowerCase())}
                                    </Text>
                                ))}
                    </PositionSelector>
                    {showSelectDropdown && <Overlay onClick={() => setShowSelectDropdown(false)} />}
                </FlexContainer>
                <FlexContainer>
                    <UserLabel>{t('options.leaderboard.balance')}:</UserLabel>
                    <InputWrapper>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, sUSDBalance)}</InputWrapper>
                </FlexContainer>
                <FlexContainer>
                    <UserLabel>Royale Pass:</UserLabel>
                    <InputWrapper>{(royalePassData as any).balance}</InputWrapper>
                </FlexContainer>
                <FlexContainer>
                    {walletAddress && user.status !== UserStatus.RDY && (
                        <>
                            <Button
                                onClick={() => {
                                    setShowSwap(true);
                                }}
                            >
                                {t('options.swap.button-text')}
                            </Button>
                            {royalePassAllowance ? (
                                <Button
                                    onClick={() => {
                                        mintRoyalePass(walletAddress);
                                    }}
                                >
                                    Mint Royale Pass
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => {
                                        setOpenRoyalePassApproveModal(true);
                                    }}
                                >
                                    Approve sUSD for Royale Pass
                                </Button>
                            )}
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
            {openApprovalModal && (
                <ApprovalModal
                    defaultAmount={(royalePassData as any).price}
                    tokenSymbol={SYNTHS_MAP.sUSD}
                    isAllowing={isAllowing}
                    onSubmit={approve}
                    onClose={() => {
                        setOpenRoyalePassApproveModal(false);
                    }}
                    isRoyale={true}
                />
            )}
            {openRoyalePassApproveModal && (
                <ApprovalModal
                    defaultAmount={(royalePassData as any).price}
                    tokenSymbol={SYNTHS_MAP.sUSD}
                    isAllowing={isAllowing}
                    onSubmit={approveRoyalePassMinting}
                    onClose={() => setOpenRoyalePassApproveModal(false)}
                    isRoyale={true}
                />
            )}
        </UserWrapper>
    );
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

const PositionSelector = styled.div<{ isOpen: boolean }>`
    position: absolute;
    right: 0;
    top: -4px;
    width: 220px;
    height: ${(props) => (props.isOpen ? '75px' : '28px')};
    border: 1.30233px solid var(--color);
    box-sizing: border-box;
    border-radius: 19.5349px;
    white-space: nowrap;
    overflow: hidden;
    font-family: Sansation !important;
    font-style: normal;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    letter-spacing: -0.4px;
    color: var(--color);
    cursor: pointer;
    z-index: 5;
    background: var(--color-wrapper);
    &.disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
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

const Arrow = styled.i`
    font-size: 12px;
    line-height: 8px;
    display: inline-block;
    padding-bottom: 3px;
    position: absolute;
    top: 9px;
    left: 67%;
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 4;
`;

const StyledInfoIcon = styled(InfoIcon)`
    display: inline-block;
    position: absolute;
    margin-left: 15px;
    width: 15px;
    height: 15px;
    transform: translateX(-50%);
    path {
        fill: var(--color);
    }
    opacity: 1;
    cursor: auto;
    @media (max-width: 1024px) {
        display: none;
    }
`;
