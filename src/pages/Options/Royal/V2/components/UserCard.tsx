import { Modal } from '@material-ui/core';
import { ReactComponent as InfoIcon } from 'assets/images/info.svg';
import ApprovalModal from 'components/ApprovalModal';
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
import { signUpWithPosition, signUpWithWithPassWithPosition } from '../../getThalesRoyalData';
import { Positions } from '../../Queries/usePositionsQuery';
import { User, UserStatus } from '../../Queries/useRoyalePlayersQuery';
import useLatestRoyaleForUserInfo from './queries/useLastRoyaleForUserInfo';
import { FooterData } from './queries/useRoyaleFooterQuery';
import useRoyalePassIdQuery from './queries/useRoyalePassIdQuery';
import useRoyalePassQuery from './queries/useRoyalePassQuery';
import useUserRoyalQuery, { AnonimUser } from './queries/useUserRoyalQuery';

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

export enum BuyInCollateralEnum {
    PASS = 'pass',
    SUSD = 'susd',
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
    const royaleQuery = useLatestRoyaleForUserInfo(selectedSeason, walletAddress, {
        enabled: isL2 && isAppReady && isWalletConnected,
    });
    const royaleData = royaleQuery.isSuccess ? royaleQuery.data : {};

    const royalePassQuery = useRoyalePassQuery(walletAddress, { enabled: isL2 && isWalletConnected });
    const royalePassData = royalePassQuery.isSuccess ? royalePassQuery.data : {};

    const royalePassIdQuery = useRoyalePassIdQuery(walletAddress, networkId, { enabled: isL2 && isWalletConnected });
    const royalePassId = royalePassIdQuery.isSuccess ? royalePassIdQuery.data : {};

    const [allowance, setAllowance] = useState(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
    const [balance, setBalance] = useState('0');
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [showSwap, setShowSwap] = useState(false);
    const [showSelectDropdown, setShowSelectDropdown] = useState(false);
    const [isBuyingIn, setIsBuyingIn] = useState(false);
    const previouslySelectedDefaultPosition = localStorage.getItem(
        'defaultPosition' + truncateAddress(walletAddress as any, 2, 2) + selectedSeason
    );
    const [defaultPosition, setDefaultPosition] = useState(
        previouslySelectedDefaultPosition ? previouslySelectedDefaultPosition : PositionsEnum.NONE
    );

    const buyInToken = isL2 ? (networkId === 10 ? OP_sUSD : OP_KOVAN_SUSD) : '';

    const [selectedBuyInCollateral, setSelectedBuyInCollateral] = useState(BuyInCollateralEnum.PASS);
    const [showSelectBuyInDropdown, setShowSelectBuyInDropdown] = useState(false);

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

    useEffect(() => {
        if (buyInToken && snxJSConnector.signer && (royaleData as any).buyInAmount && walletAddress)
            updateAllowance(buyInToken).finally(() => updateBalance(buyInToken));
    }, [buyInToken, snxJSConnector.signer, (royaleData as any).buyInAmount, isAllowing, walletAddress]);

    useEffect(() => {
        if ((royalePassData as any).balance !== undefined && !isBuyingIn) {
            (royalePassData as any).balance > 0
                ? setSelectedBuyInCollateral(BuyInCollateralEnum.PASS)
                : setSelectedBuyInCollateral(BuyInCollateralEnum.SUSD);
            royalePassIdQuery.refetch();
        }
    }, [royalePassData, walletAddress]);

    useEffect(() => {
        if (user.status === UserStatus.RDY && isBuyingIn) {
            setIsBuyingIn(false);
        }
    }, [user.status, walletAddress]);

    useEffect(() => {
        if (
            !previouslySelectedDefaultPosition &&
            (royaleData as any).signUpPeriod > new Date() &&
            ((royaleData as any).positionInTheFirstRound === 1 || (royaleData as any).positionInTheFirstRound === 2)
        ) {
            setDefaultPosition(
                (royaleData as any).positionInTheFirstRound === 1 ? PositionsEnum.DOWN : PositionsEnum.UP
            );
        }
    }, [(royaleData as any).positionInTheFirstRound]);

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

    const getFooter = (user: User | undefined, royaleData: any) => {
        if (!royaleData) return;
        if (!user) return;
        if (royaleData.season === selectedSeason) {
            if (royaleData.signUpPeriod > new Date()) {
                if (user.status === UserStatus.NOTSIGNED) {
                    const buyInAmount = royaleData.buyInAmount;
                    if (buyInAmount > Number(balance) && (royalePassData as any).balance === 0) {
                        if (selectedBuyInCollateral === BuyInCollateralEnum.PASS) {
                            return (
                                <DeadText>
                                    <span>{t('options.royale.scoreboard.no-royale-pass-in-wallet')}</span>
                                </DeadText>
                            );
                        } else {
                            return (
                                <>
                                    <Button
                                        onClick={() => {
                                            setShowSwap(true);
                                        }}
                                    >
                                        {t('options.swap.button-text')}
                                    </Button>
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
                                </>
                            );
                        }
                    }
                    return (
                        <FlexContainer>
                            {selectedBuyInCollateral === BuyInCollateralEnum.SUSD ? (
                                allowance ? (
                                    <Button
                                        className={
                                            defaultPosition === PositionsEnum.NONE ||
                                            isBuyingIn ||
                                            buyInAmount > Number(balance)
                                                ? 'disabled'
                                                : ''
                                        }
                                        disabled={
                                            defaultPosition === PositionsEnum.NONE ||
                                            isBuyingIn ||
                                            buyInAmount > Number(balance)
                                        }
                                        onClick={() => {
                                            setIsBuyingIn(true);
                                            localStorage.setItem(
                                                'defaultPosition' +
                                                    truncateAddress(walletAddress as any, 2, 2) +
                                                    selectedSeason,
                                                defaultPosition
                                            );
                                            signUpWithPosition(
                                                defaultPosition === PositionsEnum.DOWN ? 1 : 2,
                                                setIsBuyingIn
                                            ).finally(() => {
                                                synthsWalletBalancesQuery.refetch();
                                            });
                                        }}
                                    >
                                        {t('options.royale.scoreboard.buy-in')}
                                    </Button>
                                ) : (
                                    <Button
                                        className={isAllowing ? 'disabled' : ''}
                                        disabled={isAllowing}
                                        onClick={async () => {
                                            setOpenApprovalModal(true);
                                            updateAllowance(buyInToken).then(() => updateBalance(buyInToken));
                                        }}
                                    >
                                        {t('options.royale.scoreboard.approve-susd')}
                                    </Button>
                                )
                            ) : (royalePassData as any).balance > 0 ? (
                                <Button
                                    className={
                                        !(royalePassId as any).id ||
                                        defaultPosition === PositionsEnum.NONE ||
                                        isBuyingIn ||
                                        (royalePassData as any).balance === 0
                                            ? 'disabled'
                                            : ''
                                    }
                                    disabled={
                                        !(royalePassId as any).id ||
                                        defaultPosition === PositionsEnum.NONE ||
                                        isBuyingIn ||
                                        (royalePassData as any).balance === 0
                                    }
                                    onClick={() => {
                                        setIsBuyingIn(true);
                                        localStorage.setItem(
                                            'defaultPosition' +
                                                truncateAddress(walletAddress as any, 2, 2) +
                                                selectedSeason,
                                            defaultPosition
                                        );
                                        signUpWithWithPassWithPosition(
                                            (royalePassId as any).id,
                                            defaultPosition === PositionsEnum.DOWN ? 1 : 2,
                                            setIsBuyingIn
                                        ).finally(() => {
                                            royalePassQuery.refetch();
                                            royalePassIdQuery.refetch();
                                        });
                                    }}
                                >
                                    {t('options.royale.scoreboard.buy-in-royale-pass')}
                                </Button>
                            ) : !isBuyingIn ? (
                                <DeadText>
                                    <span>{t('options.royale.scoreboard.no-royale-pass-in-wallet')}</span>
                                </DeadText>
                            ) : (
                                <Button className="disabled">
                                    {t('options.royale.scoreboard.buy-in-royale-pass')}
                                </Button>
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

    const getAvatar = (user: User) => {
        if (user?.status === UserStatus.RDY) {
            const fallbackAvatar = user.number % 10;
            return <i style={{ marginRight: 14 }} className={`royale-avatar royale-avatar--${fallbackAvatar}`}></i>;
        }
        return <i className="icon icon--user-avatar" style={{ fontSize: 44, marginRight: 14 }} />;
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
                {user?.avatar ? <UserAvatar src={user.avatar} style={{ marginRight: 14 }} /> : getAvatar(user)}

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
                                top: '3px',
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
                <RoyalePassContainer>
                    <UserLabel style={{ padding: (royalePassData as any).balance === 0 ? '15px 0px' : '' }}>
                        {t('options.royale.scoreboard.royale-passes', { passes: (royalePassData as any).balance })}:
                    </UserLabel>
                    <ImageWrapper style={{ display: (royalePassData as any).balance === 0 ? 'none' : '' }}>
                        <NftImage src="https://thales-protocol.s3.eu-north-1.amazonaws.com/THALES_ROYALE_PASS.gif" />
                    </ImageWrapper>
                </RoyalePassContainer>
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
                    <Selector
                        className={user.status === UserStatus.RDY || isBuyingIn ? 'disabled' : ''}
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
                                    user.status !== UserStatus.RDY && !isBuyingIn
                                        ? setShowSelectDropdown.bind(this, true)
                                        : undefined
                                }
                            >
                                {defaultPosition === PositionsEnum.NONE
                                    ? 'SELECT'
                                    : t('options.royale.scoreboard.default-position-' + defaultPosition)}
                                <Arrow className="icon icon--arrow-down" />
                            </Text>
                        )}

                        {showSelectDropdown &&
                            Object.keys(PositionsEnum)
                                .filter(
                                    (position) =>
                                        position.toLowerCase() !== defaultPosition.toLowerCase() &&
                                        position.toLowerCase() !== PositionsEnum.NONE
                                )
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
                    </Selector>
                    {showSelectDropdown && <Overlay onClick={() => setShowSelectDropdown(false)} />}
                </FlexContainer>
                <FlexContainer
                    style={{
                        position: 'relative',
                        display:
                            (user.status === UserStatus.NOTSIGNED && (royaleData as any).signUpPeriod < new Date()) ||
                            user.status === UserStatus.RDY
                                ? 'none'
                                : '',
                    }}
                >
                    <UserLabel>
                        {t('options.royale.scoreboard.buy-in-with')}:
                        <RoyaleTooltip title={t('options.royale.scoreboard.choose-colateral')}>
                            <StyledInfoIcon />
                        </RoyaleTooltip>
                    </UserLabel>
                    <ToggleWrapper
                        className={user.status === UserStatus.RDY || isBuyingIn ? 'disabled' : ''}
                        style={{
                            flexDirection: selectedBuyInCollateral === BuyInCollateralEnum.PASS ? 'row' : 'row-reverse',
                        }}
                        onClick={() => {
                            if (user.status !== UserStatus.RDY && !isBuyingIn) {
                                setSelectedBuyInCollateral(
                                    selectedBuyInCollateral === BuyInCollateralEnum.PASS
                                        ? BuyInCollateralEnum.SUSD
                                        : BuyInCollateralEnum.PASS
                                );
                            }
                        }}
                    >
                        {selectedBuyInCollateral === BuyInCollateralEnum.PASS ? (
                            <>
                                <BuyInToggle
                                    className={user.status === UserStatus.RDY || isBuyingIn ? 'disabled' : ''}
                                    style={{ cursor: isBuyingIn ? 'not-allowed' : '' }}
                                    left={true}
                                >
                                    {window.innerWidth < 1024
                                        ? t('options.royale.scoreboard.buy-in-collateral-pass-mobile')
                                        : t('options.royale.scoreboard.buy-in-collateral-pass')}
                                </BuyInToggle>
                                <BuyInToggle
                                    className="disabled"
                                    left={false}
                                    style={{ cursor: isBuyingIn ? 'not-allowed' : '' }}
                                >
                                    {t('options.royale.scoreboard.buy-in-collateral-susd')}
                                </BuyInToggle>
                            </>
                        ) : (
                            <>
                                <BuyInToggle
                                    className="disabled"
                                    left={true}
                                    style={{ cursor: isBuyingIn ? 'not-allowed' : '' }}
                                >
                                    {window.innerWidth < 1024
                                        ? t('options.royale.scoreboard.buy-in-collateral-pass-mobile')
                                        : t('options.royale.scoreboard.buy-in-collateral-pass')}
                                </BuyInToggle>
                                <BuyInToggle
                                    className={user.status === UserStatus.RDY || isBuyingIn ? 'disabled' : ''}
                                    style={{ cursor: isBuyingIn ? 'not-allowed' : '' }}
                                    left={false}
                                >
                                    {t('options.royale.scoreboard.buy-in-collateral-susd')}
                                </BuyInToggle>
                            </>
                        )}
                    </ToggleWrapper>

                    {showSelectBuyInDropdown && <Overlay onClick={() => setShowSelectBuyInDropdown(false)} />}
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
                    defaultAmount={(royaleData as any).buyInAmount}
                    tokenSymbol={SYNTHS_MAP.sUSD}
                    isAllowing={isAllowing}
                    onSubmit={approve}
                    onClose={() => setOpenApprovalModal(false)}
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

const NftImage = styled(Image)`
    width: 240px;
    height: 132px;
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

const BuyInToggle = styled.div<{ left?: boolean }>`
    position: relative;
    display: block;
    float: right;
    cursor: pointer;
    font-family: Sansation !important;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 18px;
    background: var(--color);
    border: 1px solid var(--color-wrapper);
    box-sizing: border-box;
    border-top-left-radius: ${(props) => (props.left ? '15px' : '0')};
    border-bottom-left-radius: ${(props) => (props.left ? '15px' : '0')};
    border-top-right-radius: ${(props) => (props.left ? '0' : '15px')};
    border-bottom-right-radius: ${(props) => (props.left ? '0' : '15px')};
    margin: ${(props) => (props.left ? '1px 0px 1px 1px' : '1px 0px 1px 0px')};
    border-left: ${(props) => (props.left ? '' : '0px')};
    border-right: ${(props) => (props.left ? '0px' : '')};
    width: 49.5%;
    float: ${(props) => (props.left ? 'left' : 'right')};
    text-align: center;
    padding: 2px 9px 2px 9px;
    color: var(--color-wrapper);
    &.disabled {
        background: linear-gradient(180deg, var(--color-wrapper) 0%, #18241d 97.85%);
        border: 1px solid var(--color);
        color: var(--color);
        opacity: 0.4;
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
    width: 240px;
    border: 2px solid var(--color);
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
    &.disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    @media (max-width: 1024px) {
        width: 150px;
    }
`;

const ImageWrapper = styled(InputWrapper)`
    margin: 14px 0px;
    height: 135px;
    @media (max-width: 1024px) {
        width: 240px;
    }
`;

const Selector = styled.div<{ isOpen: boolean }>`
    position: absolute;
    right: 0;
    top: -4px;
    width: 240px;
    height: ${(props) => (props.isOpen ? 'content' : '28px')};
    border: 2px solid var(--color);
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
    background: var(--color-background);
    &.disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    @media (max-width: 1024px) {
        width: 150px;
    }
`;

const ToggleWrapper = styled.div`
    width: 240px;
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
    background: var(--color-background);
    text-align: center;
    cursor: pointer;
    letter-spacing: -0.4px;
    color: var(--color);
    text-overflow: ellipsis;
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
    left: ${() => (window.innerWidth < 1024 ? '70%' : '67%')};
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
    margin-left: 10px;
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

const RoyalePassContainer = styled(FlexContainer)`
    margin: 25px 0px;
    border-top: 2px dashed #a1e1b4;
    border-bottom: 2px dashed #a1e1b4;
    @media (max-width: 600px) {
        flex-direction: column;
        & > p {
            margin-top: 10px;
        }
    }
`;
