import arrowLink from 'assets/images/arrow-link.svg';
import { ReactComponent as InfoIcon } from 'assets/images/info.svg';
import logoExotic from 'assets/images/token/logo-exotic.svg';
import logoOvertime from 'assets/images/token/logo-overtime.svg';
import ValidationMessage from 'components/ValidationMessage';
import { CRYPTO_CURRENCY_MAP, SYNTHS_MAP, THALES_CURRENCY } from 'constants/currency';
import { LINKS } from 'constants/links';
import { MAX_L2_GAS_LIMIT, OP_REWARDS_MULTIPLIER } from 'constants/options';
import ROUTES from 'constants/routes';
import { ethers } from 'ethers';
import Button from 'pages/Token/components/Button';
import { ButtonType } from 'pages/Token/components/Button/Button';
import ClaimOnBehalfModal from 'pages/Token/components/ClaimOnBehalfModal';
import NetworkFees from 'pages/Token/components/NetworkFees';
import TimeRemaining from 'pages/Token/components/TimeRemaining';
import {
    ButtonContainer,
    ClaimMessage,
    DashedLine,
    DashedLineVertical,
    Line,
    StyledMaterialTooltip,
    Tip48Link,
} from 'pages/Token/components2';
import YourTransactions from 'pages/Token/GamifiedStaking/Transactions';
import useLPStakingQuery from 'queries/token/useLPStakingQuery';
import useStakingRewardsQuery from 'queries/token/useStakingRewardsQuery';
import React, { ReactElement, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivEnd } from 'theme/common';
import { StakingReward, TokenTabEnum } from 'types/token';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { formatGasLimit, getIsOVM, getL1FeeInWei } from 'utils/network';
import onboardConnector from 'utils/onboardConnector';
import { dispatchMarketNotification } from 'utils/options';
import { refetchTokenQueries, refetchUserTokenTransactions } from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';

enum SectionType {
    INFO,
    VOLUME,
    REWARD,
    CLAIM,
    CLAIM_ON_BEHALF,
}

const Rewards: React.FC<{ gridGap: number; setSelectedTab: (tabId: string) => void }> = ({
    gridGap,
    setSelectedTab,
}) => {
    const { t } = useTranslation();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isL2 = getIsOVM(networkId);

    const [stakingRewards, setStakingRewards] = useState<StakingReward | undefined>(undefined);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [l1Fee, setL1Fee] = useState<number | null>(null);
    const [isClaiming, setIsClaiming] = useState(false);
    const [isClosingPeriod, setIsClosingPeriod] = useState(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    const [showClaimOnBehalfModal, setShowClaimOnBehalfModal] = useState<boolean>(false);

    const { stakingThalesContract } = snxJSConnector as any;

    const isClaimAvailable =
        stakingRewards &&
        stakingRewards.hasClaimRights &&
        !stakingRewards.claimed &&
        !stakingRewards.isClaimPaused &&
        isWalletConnected &&
        !!stakingThalesContract &&
        !isClaiming &&
        !isClosingPeriod;

    const isClosingPeriodAvailable = isWalletConnected && !!stakingThalesContract && !isClaiming && !isClosingPeriod;

    const stakingRewardsQuery = useStakingRewardsQuery(walletAddress, networkId, {
        enabled: isAppReady && !!stakingThalesContract,
    });

    useEffect(() => {
        if (stakingRewardsQuery.isSuccess && stakingRewardsQuery.data) {
            setStakingRewards(stakingRewardsQuery.data);
        }
    }, [stakingRewardsQuery.isSuccess, stakingRewardsQuery.data]);

    useEffect(() => {
        const fetchL1Fee = async (stakingThalesContractWithSigner: any) => {
            const txRequest = await stakingThalesContractWithSigner.populateTransaction.claimReward();
            return getL1FeeInWei(txRequest, snxJSConnector);
        };

        const fetchGasLimit = async () => {
            if (stakingRewards) {
                try {
                    const stakingThalesContractWithSigner = stakingThalesContract.connect(
                        (snxJSConnector as any).signer
                    );
                    if (isL2) {
                        const [gasEstimate, l1FeeInWei] = await Promise.all([
                            stakingThalesContractWithSigner.estimateGas.claimReward(),
                            fetchL1Fee(stakingThalesContractWithSigner),
                        ]);
                        setGasLimit(formatGasLimit(gasEstimate, networkId));
                        setL1Fee(l1FeeInWei);
                    } else {
                        const gasEstimate = await stakingThalesContractWithSigner.estimateGas.claimReward();
                        setGasLimit(formatGasLimit(gasEstimate, networkId));
                    }
                } catch (e) {
                    console.log(e);
                    setGasLimit(null);
                }
            }
        };
        if (!isClaimAvailable) return;
        fetchGasLimit();
    }, [walletAddress, isClaimAvailable]);

    const totalThalesRewards = stakingRewards ? stakingRewards.rewards : 0;
    const baseRewards = stakingRewards ? stakingRewards.baseRewards : 0;
    const baseRewardsPool = stakingRewards ? stakingRewards.baseRewardsPool : 0;
    const thalesAmmVolume = stakingRewards ? stakingRewards.thalesAmmVolume : 0;
    const rangedAmmVolume = stakingRewards ? stakingRewards.rangedAmmVolume : 0;
    const sportsAmmVolume = stakingRewards ? stakingRewards.sportsAmmVolume : 0;
    const exoticVolume = stakingRewards ? stakingRewards.exoticVolume : 0;
    const ammVolume = stakingRewards ? stakingRewards.ammVolume : 0;
    const ammBonus = stakingRewards ? stakingRewards.ammBonus : 0;
    const maxAmmBonus = stakingRewards ? stakingRewards.maxAmmBonus : 0;
    const ammVolumeRewardsMultiplier = stakingRewards ? stakingRewards.ammVolumeRewardsMultiplier : 0;
    const snxBonus = stakingRewards ? stakingRewards.snxBonus : 0;
    const snxStaked = stakingRewards ? stakingRewards.snxStaked : 0;
    const maxSnxBonus = stakingRewards ? stakingRewards.maxSnxBonus : 0;
    const snxVolumeRewardsMultiplier = stakingRewards ? stakingRewards.snxVolumeRewardsMultiplier : 0;

    const opAmmBonus = ammBonus * OP_REWARDS_MULTIPLIER;
    const maxOpAmmBonus = maxAmmBonus * OP_REWARDS_MULTIPLIER;

    const maxAmmVolume = baseRewards * ammVolumeRewardsMultiplier;
    const additionalAmmVolume = maxAmmVolume - ammVolume > 0 ? maxAmmVolume - ammVolume : 0;

    const maxSnxStaked = baseRewards * snxVolumeRewardsMultiplier;
    const additionalSnxStaked = maxSnxStaked - snxStaked > 0 ? maxSnxStaked - snxStaked : 0;

    const lpStakingQuery = useLPStakingQuery(walletAddress, networkId, {
        enabled: isAppReady,
    });
    const lpStakingRewards = lpStakingQuery.isSuccess && lpStakingQuery.data ? Number(lpStakingQuery.data.rewards) : 0;
    const lpStakingSecondRewards =
        lpStakingQuery.isSuccess && lpStakingQuery.data ? Number(lpStakingQuery.data.secondRewards) : 0;

    // Base and bonus info
    const baseRewardsFormatted = formatCurrencyWithKey(THALES_CURRENCY, baseRewardsPool, 0, true);
    const bonusRewardsFormatted = formatCurrencyWithKey(THALES_CURRENCY, 0.5 * baseRewardsPool, 0, true);

    // Market volume
    const ammVolumeFormatted = formatCurrencyWithKey(THALES_CURRENCY, thalesAmmVolume, 0, true);
    const rangedVolumeFormatted = formatCurrencyWithKey(THALES_CURRENCY, rangedAmmVolume, 0, true);
    const sportsVolumeFormatted = formatCurrencyWithKey(THALES_CURRENCY, sportsAmmVolume, 0, true);
    const exoticVolumeFormatted = formatCurrencyWithKey(THALES_CURRENCY, exoticVolume, 0, true);

    // Protocol usage
    const protocolRewardFormatted =
        formatCurrencyWithKey(THALES_CURRENCY, ammBonus) +
        ' + ' +
        formatCurrencyWithKey(CRYPTO_CURRENCY_MAP.OP, opAmmBonus);
    const protocolVolumeFormatted = formatCurrencyWithKey(SYNTHS_MAP.sUSD, ammVolume);
    const protocolMaxBonusFormatted =
        additionalAmmVolume > 0 ? formatCurrencyWithKey(SYNTHS_MAP.sUSD, additionalAmmVolume) : '';
    const protocolMaxRewardFormatted =
        formatCurrencyWithKey(THALES_CURRENCY, maxAmmBonus) +
        ' + ' +
        formatCurrencyWithKey(CRYPTO_CURRENCY_MAP.OP, maxOpAmmBonus);

    // SNX staking
    const snxRewardFormatted = formatCurrencyWithKey(THALES_CURRENCY, snxBonus);
    const snxVolumeFormatted = formatCurrencyWithKey(CRYPTO_CURRENCY_MAP.SNX, snxStaked);
    const snxMaxBonusFormatted =
        additionalSnxStaked > 0 ? formatCurrencyWithKey(CRYPTO_CURRENCY_MAP.SNX, additionalSnxStaked) : '';
    const snxMaxRewardFormatted = formatCurrencyWithKey(THALES_CURRENCY, maxSnxBonus);

    const lpStakingReward =
        formatCurrencyWithKey(THALES_CURRENCY, lpStakingRewards) +
        ' + ' +
        formatCurrencyWithKey(CRYPTO_CURRENCY_MAP.OP, lpStakingSecondRewards);

    const getInfoSection = (label: string, value: string, desc: string | ReactElement) => {
        return (
            <SectionContentWrapper>
                <SectionLabel type={SectionType.INFO}>
                    <SectionLabelContent type={SectionType.INFO}>{label}</SectionLabelContent>
                </SectionLabel>
                <SectionValue type={SectionType.INFO}>
                    <SectionValueContent type={SectionType.INFO}>{value}</SectionValueContent>
                </SectionValue>
                <Line margin={'0'} />
                <SectionDescription type={SectionType.INFO}>
                    <SectionDescriptionContent>{desc}</SectionDescriptionContent>
                </SectionDescription>
            </SectionContentWrapper>
        );
    };

    const getVolumeSection = (label: string, value: string, desc: string, logo?: string) => {
        return (
            <SectionContentWrapper background={false}>
                <SectionLabel type={SectionType.VOLUME}>
                    <SectionLabelContent type={SectionType.VOLUME} logo={logo}>
                        {label}
                    </SectionLabelContent>
                    <ArrowLink src={arrowLink} />
                </SectionLabel>
                <SectionDescription type={SectionType.VOLUME}>
                    <SectionDescriptionContent>{desc}</SectionDescriptionContent>
                </SectionDescription>
                <SectionValue type={SectionType.VOLUME}>
                    <SectionValueContent type={SectionType.VOLUME}>{value}</SectionValueContent>
                </SectionValue>
            </SectionContentWrapper>
        );
    };

    const getDetailedSection = (
        label: { full: string; volume: string; bonus: string; rewards: string },
        value: { full: string; volume: string; bonus: string; rewards: string }
    ) => {
        return (
            <SectionContentWrapper>
                <SectionLabel type={SectionType.REWARD}>
                    <SectionLabelContent type={SectionType.REWARD}>{label.full}</SectionLabelContent>
                </SectionLabel>
                <SectionValue type={SectionType.REWARD}>
                    <SectionValueContent type={SectionType.REWARD}>{value.full}</SectionValueContent>
                </SectionValue>
                <Line margin={'0 0 10px 0'} />

                <SectionDetails>
                    <SectionDetailsLabel>{label.volume}</SectionDetailsLabel>
                    <SectionDetailsValue>{value.volume}</SectionDetailsValue>
                </SectionDetails>
                <SectionDetails>
                    <SectionDetailsLabel>{label.bonus}</SectionDetailsLabel>
                    <SectionDetailsValue bonus={true}>{value.bonus}</SectionDetailsValue>
                </SectionDetails>
                <Line margin={'0 0 10px 0'} />
                <SectionDetails>
                    <SectionDetailsLabel>{label.rewards}</SectionDetailsLabel>
                    <SectionDetailsValue>{value.rewards}</SectionDetailsValue>
                </SectionDetails>
            </SectionContentWrapper>
        );
    };

    const handleClaimStakingRewards = async () => {
        setShowTooltip(false);
        if (isClaimAvailable && stakingRewards) {
            try {
                setTxErrorMessage(null);
                setIsClaiming(true);
                const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
                const tx = (await stakingThalesContractWithSigner.claimReward({
                    gasLimit: MAX_L2_GAS_LIMIT,
                })) as ethers.ContractTransaction;
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    dispatchMarketNotification(t('options.earn.gamified-staking.rewards.claim-confirmation-message'));
                    refetchTokenQueries(walletAddress, networkId);
                    refetchUserTokenTransactions(walletAddress, networkId);
                    setIsClaiming(false);
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsClaiming(false);
            }
        }
    };

    const handleClosePeriod = async () => {
        if (stakingRewards && stakingRewards.canClosePeriod) {
            try {
                setTxErrorMessage(null);
                setIsClosingPeriod(true);
                const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
                const tx = (await stakingThalesContractWithSigner.closePeriod()) as ethers.ContractTransaction;
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    dispatchMarketNotification(
                        t('options.earn.gamified-staking.rewards.close-period.confirmation-message')
                    );
                    refetchTokenQueries(walletAddress, networkId);
                    setIsClosingPeriod(false);
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsClosingPeriod(false);
            }
        }
    };

    const getClaimButton = () => {
        if (!isWalletConnected) {
            return (
                <Button type={ButtonType.submit} active={true} onClickHandler={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </Button>
            );
        }

        return (
            <StyledMaterialTooltip
                arrow
                title={t('options.earn.gamified-staking.rewards.claim-button-tooltip') as string}
                open={showTooltip}
            >
                <ButtonWrapperTooltip>
                    <Button
                        type={ButtonType.submit}
                        active={isClaimAvailable}
                        disabled={!isClaimAvailable}
                        width={'100%'}
                        onMouseOverHandler={() => {
                            setShowTooltip(true);
                        }}
                        onMouseOutHandler={() => {
                            setShowTooltip(false);
                        }}
                        onClickHandler={handleClaimStakingRewards}
                    >
                        {isClaiming
                            ? t('options.earn.gamified-staking.rewards.claiming')
                            : t('options.earn.gamified-staking.rewards.claim')}
                    </Button>
                </ButtonWrapperTooltip>
            </StyledMaterialTooltip>
        );
    };

    const getClaimSection = () => {
        return (
            <SectionContentWrapper>
                <RewardPeriod>
                    <PeriodLabel>{t('options.earn.gamified-staking.rewards.period')}</PeriodLabel>
                    {stakingRewards ? (
                        <TimeRemaining end={stakingRewards.closingDate} fontSize={15} showFullCounter />
                    ) : (
                        '-'
                    )}
                    {stakingRewards && stakingRewards.canClosePeriod && (
                        <Button
                            type={ButtonType.label}
                            onClickHandler={handleClosePeriod}
                            active={isClosingPeriodAvailable}
                            disabled={!isClosingPeriodAvailable}
                            additionalStyles={{ minHeight: '15px' }}
                        >
                            {isClosingPeriod
                                ? t('options.earn.gamified-staking.rewards.close-period.progress-label')
                                : t('options.earn.gamified-staking.rewards.close-period.label')}
                        </Button>
                    )}
                </RewardPeriod>
                <SectionLabel type={SectionType.CLAIM}>
                    <SectionLabelContent type={SectionType.CLAIM}>
                        {t('options.earn.gamified-staking.rewards.total-label')}
                    </SectionLabelContent>
                </SectionLabel>
                <SectionValue type={SectionType.CLAIM}>
                    <SectionValueContent type={SectionType.CLAIM}>
                        {formatCurrencyWithKey(THALES_CURRENCY, totalThalesRewards) +
                            ' + ' +
                            formatCurrencyWithKey(CRYPTO_CURRENCY_MAP.OP, opAmmBonus)}
                    </SectionValueContent>
                </SectionValue>
                <NetworkFeesWrapper>
                    <Line margin={'10px 0'} />
                    <NetworkFees gasLimit={gasLimit} disabled={isClaiming} l1Fee={l1Fee} />
                </NetworkFeesWrapper>
                <ButtonContainer>
                    {getClaimButton()}
                    {stakingRewards && stakingRewards.isClaimPaused && (
                        <ClaimMessage>{t('options.earn.gamified-staking.rewards.paused-message')}</ClaimMessage>
                    )}
                    {stakingRewards && !stakingRewards.isClaimPaused && stakingRewards.claimed && (
                        <ClaimMessage>{t('options.earn.gamified-staking.rewards.claimed-message')}</ClaimMessage>
                    )}
                    {stakingRewards &&
                        !stakingRewards.isClaimPaused &&
                        !stakingRewards.claimed &&
                        !stakingRewards.hasClaimRights &&
                        isWalletConnected && (
                            <ClaimMessage>
                                {t('options.earn.gamified-staking.rewards.not-eligible-message')}
                            </ClaimMessage>
                        )}
                </ButtonContainer>
                <ValidationMessage
                    showValidation={txErrorMessage !== null}
                    message={txErrorMessage}
                    onDismiss={() => setTxErrorMessage(null)}
                />
            </SectionContentWrapper>
        );
    };

    return (
        <>
            {/* First row */}
            <SectionWrapper columns={4}>
                {getInfoSection(
                    t('options.earn.gamified-staking.rewards.info-base'),
                    baseRewardsFormatted,
                    t('options.earn.gamified-staking.rewards.info-base-description', {
                        baseRewards: baseRewardsFormatted,
                    })
                )}
            </SectionWrapper>
            <SectionWrapper columns={8}>
                {getInfoSection(
                    t('options.earn.gamified-staking.rewards.info-bonus'),
                    bonusRewardsFormatted,
                    <Trans
                        i18nKey="options.earn.gamified-staking.rewards.info-bonus-description"
                        components={[<Tip48Link key="1" />]}
                    />
                )}
            </SectionWrapper>

            {/* Second row */}
            <SectionWrapper
                columns={3}
                backgroundType={BackgroundType.AMM}
                onClick={() => window.open(ROUTES.Options.Home, '_blank')}
            >
                {getVolumeSection(
                    t('options.earn.gamified-staking.rewards.volume-amm-label'),
                    ammVolumeFormatted,
                    t('options.earn.gamified-staking.rewards.volume-amm-desc')
                )}
            </SectionWrapper>
            <SectionWrapper
                columns={3}
                backgroundType={BackgroundType.RANGED}
                onClick={() => window.open(ROUTES.Options.RangeMarkets, '_blank')}
            >
                {getVolumeSection(
                    t('options.earn.gamified-staking.rewards.volume-ranged-label'),
                    rangedVolumeFormatted,
                    t('options.earn.gamified-staking.rewards.volume-ranged-desc')
                )}
            </SectionWrapper>
            <SectionWrapper
                columns={3}
                backgroundType={BackgroundType.SPORTS}
                onClick={() => window.open(LINKS.SportMarkets, '_blank')}
            >
                {getVolumeSection(
                    '',
                    sportsVolumeFormatted,
                    t('options.earn.gamified-staking.rewards.volume-sports-desc'),
                    logoOvertime
                )}
            </SectionWrapper>
            <SectionWrapper
                columns={3}
                backgroundType={BackgroundType.EXOTIC}
                onClick={() => window.open(LINKS.ExoticMarkets, '_blank')}
            >
                {getVolumeSection(
                    '',
                    exoticVolumeFormatted,
                    t('options.earn.gamified-staking.rewards.volume-exotic-desc'),
                    logoExotic
                )}
            </SectionWrapper>

            <DashedLine gridRow={3} widthPer={76.2} />
            <DashedLineVertical gridRow={3} columnStart={2} marginTop={-gridGap} heightPer={135} />
            <DashedLineVertical gridRow={3} columnStart={5} marginTop={-gridGap} heightPer={135} />
            <DashedLineVertical gridRow={3} columnStart={8} marginTop={-gridGap} heightPer={135} />
            <DashedLineVertical gridRow={3} columnStart={11} marginTop={-gridGap} heightPer={135} />
            <DashedLineVertical gridRow={3} columnStart={4} marginTop={gridGap} heightPer={100} />
            <DashedLineVertical gridRow={3} columnStart={9} marginTop={gridGap} heightPer={100} />

            {/* Third row */}
            <SectionWrapper columns={5} startColumn={2}>
                {getDetailedSection(
                    {
                        full: t('options.earn.gamified-staking.rewards.protocol-label'),
                        volume: t('options.earn.gamified-staking.rewards.protocol-volume'),
                        bonus: t('options.earn.gamified-staking.rewards.protocol-bonus'),
                        rewards: t('options.earn.gamified-staking.rewards.protocol-rewards'),
                    },
                    {
                        full: protocolRewardFormatted,
                        volume: protocolVolumeFormatted,
                        bonus: protocolMaxBonusFormatted,
                        rewards: protocolMaxRewardFormatted,
                    }
                )}
            </SectionWrapper>
            <SectionWrapper columns={5}>
                {getDetailedSection(
                    {
                        full: t('options.earn.gamified-staking.rewards.snx-label'),
                        volume: t('options.earn.gamified-staking.rewards.snx-volume'),
                        bonus: t('options.earn.gamified-staking.rewards.snx-bonus'),
                        rewards: t('options.earn.gamified-staking.rewards.snx-rewards'),
                    },
                    {
                        full: snxRewardFormatted,
                        volume: snxVolumeFormatted,
                        bonus: snxMaxBonusFormatted,
                        rewards: snxMaxRewardFormatted,
                    }
                )}
            </SectionWrapper>

            <DashedLine gridRow={5} widthPer={42.5} />
            <DashedLineVertical gridRow={5} columnStart={4} marginTop={-gridGap} heightPer={135} />
            <DashedLineVertical gridRow={5} columnStart={9} marginTop={-gridGap} heightPer={135} />
            <DashedLineVertical gridRow={5} columnStart={7} marginTop={gridGap} heightPer={100} marginLeft={-10} />

            {/* Fourth row */}
            <SectionWrapper columns={3} onClick={() => setShowClaimOnBehalfModal(true)}>
                <SectionContentWrapper>
                    <SectionLabel type={SectionType.CLAIM_ON_BEHALF} marginTop={'24px'}>
                        <SectionLabelContent type={SectionType.CLAIM_ON_BEHALF}>
                            {t('options.earn.gamified-staking.rewards.enable-claim-on-behalf-label')}
                        </SectionLabelContent>
                    </SectionLabel>
                    <Button
                        type={ButtonType.default}
                        active={true}
                        width={'100%'}
                        margin={'76px 0 10px auto'}
                        activeTextColor={'#ffffff'}
                        hoverShadow={false}
                        activeBg={'linear-gradient(270deg, #516aff 0%, #8208fc 100%)'}
                        inactiveBgColor={'linear-gradient(270deg, #516aff 0%, #8208fc 100%)'}
                        fontSize={'20px'}
                        onClickHandler={() => setShowClaimOnBehalfModal(true)}
                    >
                        {t('options.earn.gamified-staking.rewards.enable-claim-on-behalf-button')}
                    </Button>
                </SectionContentWrapper>
            </SectionWrapper>
            <SectionWrapper columns={6}>{getClaimSection()}</SectionWrapper>
            <SectionWrapper
                columns={3}
                backgroundType={BackgroundType.LP_STAKING}
                onClick={() => setSelectedTab(TokenTabEnum.LP_STAKING)}
            >
                <SectionContentWrapper background={false}>
                    <SectionLabel type={SectionType.REWARD} marginTop={'34px'}>
                        <SectionLabelContent type={SectionType.REWARD}>
                            {t('options.earn.gamified-staking.rewards.lp-staking-label-1')}
                        </SectionLabelContent>
                        <StyledMaterialTooltip arrow={true} title={<Trans i18nKey="???" />} interactive>
                            <StyledInfoIcon />
                        </StyledMaterialTooltip>
                        <br />
                        <SectionLabelContent type={SectionType.REWARD}>
                            {t('options.earn.gamified-staking.rewards.lp-staking-label-2')}
                        </SectionLabelContent>
                    </SectionLabel>
                    <SectionValue type={SectionType.REWARD}>
                        <SectionValueContent type={SectionType.REWARD}>{lpStakingReward}</SectionValueContent>
                    </SectionValue>
                    <ArrowWrapper marginTop={'70px'}>
                        <ArrowLink src={arrowLink} widthPer={7} />
                    </ArrowWrapper>
                </SectionContentWrapper>
            </SectionWrapper>

            <DashedLine gridRow={7} widthPer={0} />
            <DashedLineVertical gridRow={7} columnStart={7} marginTop={-gridGap} heightPer={210} marginLeft={-10} />

            {/* Fifth row */}
            <SectionWrapper columns={12} marginTop={-gridGap}>
                <SectionContentWrapper>
                    <SectionLabel type={SectionType.REWARD}>
                        <SectionLabelContent type={SectionType.REWARD}>
                            {t('options.earn.gamified-staking.rewards.base-label')}
                        </SectionLabelContent>
                    </SectionLabel>
                    <SectionValue type={SectionType.REWARD}>
                        <SectionValueContent type={SectionType.REWARD}>
                            {formatCurrencyWithKey(THALES_CURRENCY, baseRewards)}
                        </SectionValueContent>
                    </SectionValue>
                </SectionContentWrapper>
            </SectionWrapper>

            {/* Sixth row */}
            <YourTransactions gridColumns={12} />

            {showClaimOnBehalfModal && <ClaimOnBehalfModal onClose={() => setShowClaimOnBehalfModal(false)} />}
        </>
    );
};

enum BackgroundType {
    AMM,
    RANGED,
    SPORTS,
    EXOTIC,
    LP_STAKING,
}

const SectionWrapper = styled.section<{
    columns?: number;
    startColumn?: number;
    backgroundType?: BackgroundType;
    marginTop?: number;
}>`
    box-sizing: border-box;
    border-radius: 15px;
    grid-column: ${(props) =>
        `${props.startColumn ? props.startColumn + ' / ' : ''} span ${props.columns ? props.columns : 4}`};
    grid-row: span 1;
    padding: 2px;
    background: ${(props) => {
        switch (props.backgroundType) {
            case BackgroundType.AMM:
                return 'linear-gradient(-20deg, #1BAB9C 0%, #4B6DC5 47.77%, #801BF2 100%)';
            case BackgroundType.RANGED:
            case BackgroundType.LP_STAKING:
                return 'linear-gradient(-20deg, #801BF2 0%, #464DCF 100%)';
            case BackgroundType.SPORTS:
                return '#303656';
            case BackgroundType.EXOTIC:
                return 'linear-gradient(-20deg, #EE5782 0%, #B81B8F 100%)';
            default:
                return 'linear-gradient(160deg, #801bf2 0%, #1BAB9C 100%)';
        }
    }};
    ${(props) => (props.marginTop ? `margin-top: ${props.marginTop}px;` : '')};
    cursor: ${(props) => (props.backgroundType !== undefined ? 'pointer' : 'default')};
`;

const SectionContentWrapper = styled.div<{ background?: boolean }>`
    display: grid;
    height: 100%;
    background: ${(props) => (props.background ?? true ? '#04045a' : 'none')};
    border-radius: 15px;
    align-items: center;
    text-align: center;
    padding: 10px 15px;
`;

const SectionContent = styled.span`
    font-family: 'Roboto';
    color: #ffffff;
`;

const SectionLabel = styled.div<{ type: SectionType; marginTop?: string }>`
    ${(props) => (props.marginTop ? `margin-top: ${props.marginTop};` : '')}
    ${(props) => {
        switch (props.type) {
            case SectionType.INFO:
                return 'padding-bottom: 15px;';
            case SectionType.VOLUME:
                return `
                    padding-bottom: 10px;
                    min-height: 34px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
            case SectionType.REWARD:
                return 'padding-bottom: 20px;';
            case SectionType.CLAIM:
            case SectionType.CLAIM_ON_BEHALF:
                return 'padding: 10px 0;';
            default:
                return '';
        }
    }}
`;

const SectionLabelContent = styled(SectionContent)<{ type: SectionType; logo?: string }>`
    ${(props) => (props.logo ? `content: url(${props.logo});` : '')}
    ${(props) => {
        switch (props.type) {
            case SectionType.INFO:
            case SectionType.VOLUME:
                return `
                    text-transform: uppercase;
                    font-weight: 600;
                    font-size: 15px;
                `;
            case SectionType.REWARD:
            case SectionType.CLAIM:
                return `
                    text-transform: uppercase;
                    font-weight: 700;
                    font-size: 18px;
                    line-height: 24px;
                `;
            case SectionType.CLAIM_ON_BEHALF:
                return `
                    font-weight: 700;
                    font-size: 18px;
                    line-height: 24px;
                `;
            default:
                return '';
        }
    }}
`;

const SectionValue = styled.div<{ type: SectionType }>`
    ${(props) => {
        switch (props.type) {
            case SectionType.INFO:
                return 'padding-bottom: 10px;';
            case SectionType.VOLUME:
                return '';
            case SectionType.REWARD:
            case SectionType.CLAIM:
                return 'padding-bottom: 10px;';
            default:
                return '';
        }
    }}
`;

const SectionValueContent = styled(SectionContent)<{ type: SectionType }>`
    letter-spacing: 0.035em;
    text-transform: uppercase;
    ${(props) => {
        switch (props.type) {
            case SectionType.INFO:
                return `
                    font-weight: 700;
                    font-size: 20px;
                `;
            case SectionType.VOLUME:
                return `
                    font-weight: 600;
                    font-size: 16px;
                    line-height: 25px;
                `;
            case SectionType.REWARD:
            case SectionType.CLAIM:
                return `
                    font-weight: 700;
                    font-size: 30px;
                    color: #64D9FE
                `;
            default:
                return '';
        }
    }}
`;

const SectionDescription = styled.div<{ type: SectionType }>`
    ${(props) => {
        switch (props.type) {
            case SectionType.INFO:
                return `
                    min-height: 70px; 
                    padding-top: 10px;
                `;
            case SectionType.VOLUME:
                return 'min-height: 10px;';
            case SectionType.REWARD:
                return '';
            default:
                return '';
        }
    }}
`;

const SectionDescriptionContent = styled(SectionContent)`
    font-weight: 400;
    font-size: 15px;
    line-height: 20px;
`;

const SectionDetails = styled.div`
    padding-bottom: 10px;
`;

const SectionDetailsLabel = styled.span`
    display: block;
    float: left;
    font-weight: 300;
    font-size: 15px;
    line-height: 15px;
    letter-spacing: 0.035em;
    color: #ffffff;
`;

const SectionDetailsValue = styled.span<{ bonus?: boolean }>`
    display: block;
    float: right;
    font-weight: 500;
    font-size: 15px;
    line-height: 15px;
    color: ${(props) => (props.bonus ? '#50ce99' : '#ffffff')};
`;

const ArrowWrapper = styled.div<{ marginTop: string }>`
    margin-top: ${(props) => props.marginTop};
    text-align: end;
`;

const ArrowLink = styled.img<{ widthPer?: number }>`
    margin-left: 8px;
    cursor: pointer;
    filter: brightness(0) invert(1);
    ${(props) => (props.widthPer ? `width: ${props.widthPer}%;` : '')}
`;

const StyledInfoIcon = styled(InfoIcon)`
    position: absolute;
    margin-top: -3px;
    width: 14px;
    height: 14px;
    margin-left: 6px;
`;

const ButtonWrapperTooltip = styled.div`
    width: 50%;
    display: flex;
    justify-content: center;
`;

const RewardPeriod = styled(FlexDivEnd)`
    line-height: 24px;
`;

const PeriodLabel = styled(SectionContent)`
    margin-right: 4px;
    font-weight: 700;
    font-size: 15px;
    text-transform: uppercase;
    color: #64d9fe;
`;

const NetworkFeesWrapper = styled.div`
    margin: 0 50px;
`;

export default Rewards;
