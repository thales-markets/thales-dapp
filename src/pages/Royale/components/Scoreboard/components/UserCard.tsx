import { Modal } from '@material-ui/core';
import { ReactComponent as InfoIcon } from 'assets/images/info.svg';
import ApprovalModal from 'components/ApprovalModal';
import SimpleLoader from 'components/SimpleLoader';
import Swap from 'components/Swap';
import { OP_KOVAN_SUSD, OP_sUSD } from 'components/Swap/tokens';
import { SYNTHS_MAP } from 'constants/currency';
import { MAX_L2_GAS_LIMIT } from 'constants/options';
import { BigNumber, ethers } from 'ethers';
import { RoyaleTooltip } from 'pages/Options/Market/components';
import { Positions } from 'pages/Royale/Queries/usePositionsQuery';
import { FooterData } from 'pages/Royale/Queries/useRoyaleFooterQuery';
import useRoyalePassIdQuery from 'pages/Royale/Queries/useRoyalePassIdQuery';
import useRoyalePassQuery from 'pages/Royale/Queries/useRoyalePassQuery';
import useSynthsBalancesQuery from 'queries/walletBalances/useSynthsBalancesQuery';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import {
    FlexDiv,
    FlexDivCentered,
    FlexDivColumn,
    FlexDivSpaceBetween,
    Image,
    LoaderContainer,
    Text,
} from 'theme/common';
import { getCurrencyKeyBalance } from 'utils/balances';
import erc20Contract from 'utils/contracts/erc20Contract';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { truncateAddress } from 'utils/formatters/string';
import { checkAllowance, getIsOVM } from 'utils/network';
import { dispatchMarketNotification } from 'utils/options';
import snxJSConnector from 'utils/snxJSConnector';
import useLatestRoyaleForUserInfo from '../queries/useLastRoyaleForUserInfo';
import { User, UserStatus } from '../queries/useRoyalePlayersQuery';
import useUserRoyalQuery, { AnonimUser } from '../queries/useUserRoyalQuery';
import ShowRoyalePassportsDialog from './ShowRoyalePassportsDialog/ShowRoyalePassportsDialog';
import UserEditRoyaleDataDialog from './UserEditRoyaleDataDialog/UserEditRoyaleDataDialog';

type UserCardProps = {
    assetPrice: string;
    positions: Positions;
    royaleFooterData: FooterData | undefined;
    selectedSeason: number;
    royalePassports: any[];
    selectedRoyalePassport: any;
    setSelectedRoyalePassport: (pasport: any) => void;
};
export enum PositionsEnum {
    NONE = 0,
    UP = 1,
    DOWN = 2,
}

export enum BuyInCollateralEnum {
    PASS = 'pass',
    SUSD = 'susd',
}

export const UserCard: React.FC<UserCardProps> = ({
    selectedSeason,
    royaleFooterData,
    assetPrice,
    positions,
    royalePassports,
    selectedRoyalePassport,
    setSelectedRoyalePassport,
}) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isL2 = getIsOVM(networkId);
    const userQuery = useUserRoyalQuery(walletAddress as any, selectedRoyalePassport, networkId, selectedSeason, {
        enabled: isL2 && isAppReady,
    });
    const user = userQuery.isSuccess ? userQuery.data : AnonimUser;
    const royaleQuery = useLatestRoyaleForUserInfo(selectedSeason, {
        enabled: isL2 && isAppReady,
    });
    const royaleData = royaleQuery.isSuccess ? royaleQuery.data : {};

    const royalePassQuery = useRoyalePassQuery(walletAddress, { enabled: isL2 && isWalletConnected });
    const royalePassData = royalePassQuery.isSuccess ? royalePassQuery.data : {};

    const royalePassIdQuery = useRoyalePassIdQuery(walletAddress, networkId, { enabled: isL2 && isWalletConnected });
    const royalePassId = royalePassIdQuery.isSuccess ? royalePassIdQuery.data : {};

    const [allowance, setAllowance] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
    const [balance, setBalance] = useState('0');
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
    const [showSwap, setShowSwap] = useState<boolean>(false);
    const [isBuyingIn, setIsBuyingIn] = useState<boolean>(false);
    const [allPositionsUp, setAllPositionsUp] = useState<boolean>(true);
    const [showSelectDropdown, setShowSelectDropdown] = useState<boolean>(false);
    const [openPassportsDialog, setOpenPassportsDialog] = useState<boolean>(false);

    const [defaultPositions, setDefaultPositions] = useState([2, 1, 2, 1, 2, 1]);

    const [royalePassportIds, setRoyalePassportIds] = useState([] as any);

    const buyInToken = isL2 ? (networkId === 10 ? OP_sUSD : OP_KOVAN_SUSD) : '';

    const [selectedBuyInCollateral, setSelectedBuyInCollateral] = useState(BuyInCollateralEnum.PASS);
    const [showSelectBuyInDropdown, setShowSelectBuyInDropdown] = useState<boolean>(false);

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
        if (isBuyingIn) {
            setIsBuyingIn(false);
        }
    }, [walletAddress]);

    useEffect(() => {
        if (user && user.defaultPositions && user.status !== UserStatus.NOTSIGNED) {
            setDefaultPositions(user.defaultPositions);
        }
    }, [walletAddress, user, selectedRoyalePassport]);

    useEffect(() => {
        if (user && royalePassports.length > 0) {
            setRoyalePassportIds(royalePassports.map((passport) => passport.id));
        }
    }, [walletAddress, user, royalePassports, selectedRoyalePassport]);

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

    const randomizePositions = () => {
        const positions = [];
        for (let i = 0; i < 6; i++) {
            positions.push(Math.round(Math.random()) === 0 ? 1 : 2);
        }
        setDefaultPositions(positions);
    };

    const switchSinglePosition = (key: number) => {
        const positions = defaultPositions;
        positions[key] === 1 ? (positions[key] = 2) : (positions[key] = 1);
        setDefaultPositions(positions);
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
                        <FlexContainer style={{ flexDirection: 'column' }}>
                            {selectedBuyInCollateral === BuyInCollateralEnum.SUSD ? (
                                allowance ? (
                                    <Button
                                        className={isBuyingIn || buyInAmount > Number(balance) ? 'disabled' : ''}
                                        disabled={isBuyingIn || buyInAmount > Number(balance)}
                                        onClick={() => {
                                            setIsBuyingIn(true);
                                            signUpWithPosition(defaultPositions, setIsBuyingIn).finally(() => {
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
                                        !(royalePassId as any).id || isBuyingIn || (royalePassData as any).balance === 0
                                            ? 'disabled'
                                            : ''
                                    }
                                    disabled={
                                        !(royalePassId as any).id || isBuyingIn || (royalePassData as any).balance === 0
                                    }
                                    onClick={() => {
                                        setIsBuyingIn(true);
                                        signUpWithWithPassWithPosition(
                                            (royalePassId as any).id,
                                            defaultPositions,
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

    if ((royaleData as any).season !== selectedSeason) {
        return (
            <UserWrapper style={{ height: 420 }}>
                <LoaderContainer style={{ top: 'calc(50% + 140px)', left: '50%', display: 'relative' }}>
                    <SimpleLoader />
                </LoaderContainer>
            </UserWrapper>
        );
    } else {
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

                {!openPassportsDialog ?? (
                    <OverlayForDropDown
                        onClick={() => {
                            if (openPassportsDialog) setOpenPassportsDialog(false);
                        }}
                    ></OverlayForDropDown>
                )}

                <ShowRoyalePassportsDialog
                    open={openPassportsDialog}
                    handleClose={setOpenPassportsDialog.bind(this, false)}
                    royalePassportIds={royalePassportIds}
                ></ShowRoyalePassportsDialog>
                <FlexDivSpaceBetween>
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
                    <FlexDiv>
                        {' '}
                        <Button
                            // disabled={royalePassports.length === 0}
                            // className={royalePassports.length === 0 ? 'disabled' : ''}
                            style={{
                                // display: royalePassports.length === 0 ? 'none' : '',
                                // cursor: royalePassports.length === 0 ? 'not-allowed' : '',
                                whiteSpace: 'pre',
                                fontSize: 15,
                            }}
                            onClick={() => setOpenPassportsDialog(true)}
                        >
                            Show my Passports
                        </Button>
                    </FlexDiv>
                </FlexDivSpaceBetween>
                <FlexDivColumn style={{ margin: '20px 0' }}>
                    <FlexContainer>
                        <UserLabel>{t('options.leaderboard.display-name')}:</UserLabel>
                        <InputWrapper>
                            {user.name}
                            <SearchIcon
                                onClick={setOpenEditDialog.bind(this, true)}
                                className="icon icon--user-avatar"
                                style={{
                                    display: !isWalletConnected ? 'none' : '',
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
                        <UserLabel
                            style={{
                                padding: (royalePassData as any).balance === 0 || !isWalletConnected ? '15px 0px' : '',
                            }}
                        >
                            {t('options.royale.scoreboard.royale-passes', { passes: (royalePassData as any).balance })}:
                        </UserLabel>
                        <ImageWrapper
                            style={{
                                display: (royalePassData as any).balance === 0 || !isWalletConnected ? 'none' : '',
                            }}
                        >
                            <NftImage src="https://thales-protocol.s3.eu-north-1.amazonaws.com/THALES_ROYALE_PASS.gif" />
                        </ImageWrapper>
                    </RoyalePassContainer>
                    <RoyalePassportContainer>
                        <FlexDivSpaceBetween>
                            <UserLabel>{t('options.royale.scoreboard.passports-in-wallet')}</UserLabel>
                            <InputWrapper
                                style={{
                                    maxWidth: 140,
                                }}
                            >
                                {royalePassports.length}
                            </InputWrapper>
                        </FlexDivSpaceBetween>
                        <FlexDivSpaceBetween style={{ marginTop: 10, position: 'relative' }}>
                            <UserLabel>{t('options.royale.scoreboard.passport-id')}</UserLabel>
                            <Selector
                                className={royalePassports.length < 2 ? 'disabled' : ''}
                                isOpen={showSelectDropdown}
                            >
                                {royalePassports.length === 0 ? (
                                    <Text>N/A</Text>
                                ) : royalePassports.length === 1 ? (
                                    <Text>{parseInt(royalePassports[0].id as any, 16)}</Text>
                                ) : (
                                    <Text
                                        onClick={
                                            royalePassports.length > 1
                                                ? setShowSelectDropdown.bind(this, true)
                                                : undefined
                                        }
                                    >
                                        {parseInt(selectedRoyalePassport as any, 16)}
                                        <Arrow className="icon icon--arrow-down" />
                                    </Text>
                                )}

                                {showSelectDropdown &&
                                    royalePassports
                                        .filter((passport) => passport.id !== selectedRoyalePassport)
                                        .map((passport: any, key: number) => (
                                            <Text
                                                onClick={() => {
                                                    setSelectedRoyalePassport(passport.id);
                                                    setShowSelectDropdown(false);
                                                }}
                                                key={key}
                                            >
                                                {parseInt(passport.id as any, 16)}
                                            </Text>
                                        ))}
                            </Selector>
                            {showSelectDropdown && <Overlay onClick={() => setShowSelectDropdown(false)} />}
                        </FlexDivSpaceBetween>
                    </RoyalePassportContainer>
                    <FlexContainer
                        style={{
                            position: 'relative',
                            display:
                                (user.status === UserStatus.NOTSIGNED &&
                                    (royaleData as any).signUpPeriod < new Date()) ||
                                !isWalletConnected
                                    ? 'none'
                                    : '',
                            borderBottom: '2px dashed var(--color)',
                            margin: 'margin: 0 0 7px 0',
                            flexDirection: 'column',
                        }}
                    >
                        <UserLabel
                            style={{
                                width: window.innerWidth < 400 ? '100%' : '',
                                padding: '15px 0px',
                                whiteSpace: 'break-spaces',
                                textAlign: 'initial',
                            }}
                        >
                            {t('options.royale.scoreboard.choose-default-positions')}
                            <RoyaleTooltip title={t('options.royale.scoreboard.default-position-info')}>
                                <StyledInfoIcon />
                            </RoyaleTooltip>
                        </UserLabel>
                        <PositionalButtonsContainer>
                            {defaultPositions.map((roundPosition: number, key: number) => (
                                <FlexDiv key={key}>
                                    <SupText>{key + 1}.</SupText>
                                    <PositionButton
                                        currentRound={
                                            (royaleData as any).currentRound === key + 1 &&
                                            !(royaleData as any).seasonFinished
                                        }
                                        disabled={
                                            isBuyingIn ||
                                            user.status === UserStatus.RDY ||
                                            (royaleData as any).signUpPeriod < new Date()
                                        }
                                        long={Number(roundPosition) === 2}
                                        onClick={() => switchSinglePosition(key)}
                                    >
                                        {Number(roundPosition) === 2 ? (
                                            '△'
                                        ) : (
                                            <Circle
                                                currentRound={
                                                    (royaleData as any).currentRound === key + 1 &&
                                                    !(royaleData as any).seasonFinished
                                                }
                                                disabled={(royaleData as any).signUpPeriod < new Date()}
                                            />
                                        )}
                                    </PositionButton>
                                </FlexDiv>
                            ))}
                        </PositionalButtonsContainer>
                        <FlexContainer
                            style={{
                                padding: '15px 0px',
                                width: '100%',
                                display:
                                    user.status === UserStatus.RDY ||
                                    (user.status === UserStatus.NOTSIGNED &&
                                        (royaleData as any).signUpPeriod < new Date()) ||
                                    !isWalletConnected
                                        ? 'none'
                                        : '',
                            }}
                        >
                            <Button
                                disabled={isBuyingIn || user.status === UserStatus.RDY}
                                className={isBuyingIn || user.status === UserStatus.RDY ? 'disabled' : ''}
                                style={{
                                    display:
                                        user.status === UserStatus.RDY ||
                                        (user.status === UserStatus.NOTSIGNED &&
                                            (royaleData as any).signUpPeriod < new Date()) ||
                                        !isWalletConnected
                                            ? 'none'
                                            : '',
                                    cursor: isBuyingIn || user.status === UserStatus.RDY ? 'not-allowed' : '',
                                    whiteSpace: 'pre',
                                }}
                                onClick={randomizePositions}
                            >
                                {t('options.royale.scoreboard.shuffle-positions')}
                            </Button>
                            <Button
                                className={isBuyingIn || user.status === UserStatus.RDY ? 'disabled' : ''}
                                disabled={isBuyingIn || user.status === UserStatus.RDY}
                                style={{
                                    justifyContent: 'center',
                                    display:
                                        user.status === UserStatus.RDY ||
                                        (user.status === UserStatus.NOTSIGNED &&
                                            (royaleData as any).signUpPeriod < new Date()) ||
                                        !isWalletConnected
                                            ? 'none'
                                            : '',
                                    cursor: isBuyingIn || user.status === UserStatus.RDY ? 'not-allowed' : '',
                                    whiteSpace: 'pre',
                                }}
                                onClick={() => {
                                    allPositionsUp
                                        ? setDefaultPositions([2, 2, 2, 2, 2, 2])
                                        : setDefaultPositions([1, 1, 1, 1, 1, 1]);
                                    setAllPositionsUp(!allPositionsUp);
                                }}
                            >
                                {allPositionsUp
                                    ? t('options.royale.scoreboard.all-up')
                                    : t('options.royale.scoreboard.all-down')}
                            </Button>
                        </FlexContainer>
                    </FlexContainer>
                    <FlexContainer
                        style={{
                            position: 'relative',
                            display:
                                (user.status === UserStatus.NOTSIGNED &&
                                    (royaleData as any).signUpPeriod < new Date()) ||
                                user.status === UserStatus.RDY ||
                                !isWalletConnected
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
                                flexDirection:
                                    selectedBuyInCollateral === BuyInCollateralEnum.PASS ? 'row' : 'row-reverse',
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
                                {t('options.royale.footer.current')}
                                {royaleFooterData?.seasonAsset} {t('options.royale.footer.price')}:
                            </span>
                            <span>
                                {' '}
                                $
                                {royaleFooterData?.seasonAsset !== 'ETH'
                                    ? Number(assetPrice).toFixed(4)
                                    : Number(assetPrice).toFixed(2)}
                            </span>
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
    }
};

export const signUpWithPosition = async (positions: number[], setIsBuyingIn: any) => {
    const { thalesRoyaleContract } = snxJSConnector;
    if (thalesRoyaleContract) {
        const royaleContract = thalesRoyaleContract.connect((snxJSConnector as any).signer);
        try {
            const tx = await royaleContract.signUpWithPosition(positions);
            await tx.wait();
            dispatchMarketNotification('Successfully Signed Up With Position');
        } catch (e) {
            console.log(e);
            setIsBuyingIn(false);
        }
    }
};

export const signUpWithWithPassWithPosition = async (royalePassId: number, positions: number[], setIsBuyingIn: any) => {
    const { thalesRoyaleContract } = snxJSConnector;
    if (thalesRoyaleContract) {
        const royaleContract = thalesRoyaleContract.connect((snxJSConnector as any).signer);
        try {
            const tx = await royaleContract.signUpWithPassWithPosition(royalePassId, positions);
            await tx.wait();
            dispatchMarketNotification('Successfully Signed Up With Royale Pass And With Position');
        } catch (e) {
            console.log(e);
            setIsBuyingIn(false);
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
    white-space: pre;
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
    border-bottom: 2px dashed var(--color);
    @media (max-width: 600px) {
        flex-direction: column;
        & > p {
            margin-top: 10px;
        }
    }
`;

const RoyalePassportContainer = styled.div`
    padding-bottom: 25px;
    margin-bottom: 20px;
    border-bottom: 2px dashed var(--color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    & > div {
        width: 100%;
    }
`;

const PositionalButtonsContainer = styled(FlexContainer)`
    padding: 15px 0px;
    width: 100%;
    @media (max-width: 600px) {
        flex-wrap: wrap;
        gap: 10px 20px;
        justify-content: center;
    }
`;

const PositionButton = styled.button<{ long?: boolean; currentRound?: boolean }>`
    transition: all 0.1s ease-in-out;
    width: ${(props) => (props.currentRound ? '60px' : '45px')};
    height: ${(props) => (props.currentRound ? '60px' : '45px')};
    border-radius: 50px;
    background: ${(props) => (props.long ? '#59CDA3' : '#8e1d38')};
    border: 3px solid #e5e5e5;
    box-sizing: border-box;
    box-shadow: ${(props) => (props.currentRound && props.long ? 'inset 0px 4px 30px #137B9B' : '')};
    color: #e5e5e5;
    font-size: ${(props) => (props.currentRound ? '45px' : '30px')};
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    &:disabled {
        background: ${(props) => (props.currentRound ? '' : props.long ? '#b9c7c2' : '#977980')};
        box-shadow: ${(props) => (props.long ? 'inset 0px 4px 30px #137B9B' : '')};
        cursor: not-allowed;
    }
    &:nth-child(6n-4) {
        margin-left: ${(props) => (props.currentRound ? '-7px' : '')};
        margin-right: ${(props) => (props.currentRound ? '-8px' : '')};
    }
    &:nth-child(6n) {
        margin-left: ${(props) => (props.currentRound ? '-7px' : '')};
        margin-right: ${(props) => (props.currentRound ? '-8px' : '')};
    }
    &:nth-child(6n-2) {
        margin-left: ${(props) => (props.currentRound ? '-7px' : '')};
        margin-right: ${(props) => (props.currentRound ? '-7px' : '')};
    }
`;

const Circle = styled.div<{ currentRound?: boolean; disabled: boolean }>`
    width: ${(props) => (props.currentRound ? '40px' : '25px')};
    height: ${(props) => (props.currentRound ? '40px' : '25px')};
    border-radius: 50px;
    background: transparent;
    box-sizing: border-box;
    border: 2px solid #e5e5e5;
`;

const SupText = styled.sup`
    font-family: Sansation !important;
    font-style: normal;
    letter-spacing: -0.4px;
    color: var(--color);
    margin-bottom: 30px;
    margin-left: 5px;
    @media (max-width: 600px) {
        width: 10px;
        display: flex;
        margin-left: 0px;
        margin-right: 5px;
    }
`;

const Selector = styled.div<{ isOpen: boolean }>`
    width: 240px;
    height: ${(props) => (props.isOpen ? 'content' : '28px')};
    border: 2px solid var(--color-background);
    box-sizing: border-box;
    border-radius: 19.5349px;
    white-space: nowrap;
    overflow: hidden;
    font-family: Sansation !important;
    font-style: normal;
    font-size: 20px;
    line-height: 29px;
    text-align: center;
    letter-spacing: -0.4px;
    color: var(--color-background);
    cursor: pointer;
    z-index: 5;
    background: var(--color);
    &.disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    @media (max-width: 1024px) {
        width: 150px;
    }
`;

const Arrow = styled.i`
    font-size: 12px;
    line-height: 12px;
    display: inline-block;
    padding-bottom: 3px;
    position: absolute;
    color: var(--color-wrapper);
    top: 9px;
    left: ${() => (window.innerWidth < 1024 ? '75%' : '67%')};
`;
