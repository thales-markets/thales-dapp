import arrowLink from 'assets/images/arrow-link.svg';
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
    StyledInfoIcon,
    StyledMaterialTooltip,
    Tip48Link,
} from 'pages/Token/components';
import YourTransactions from './Transactions';
import useLPStakingQuery from 'queries/token/useLPStakingQuery';
import useStakingRewardsQuery from 'queries/token/useStakingRewardsQuery';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
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
import { isMobile } from 'utils/device';
import useStakingThalesQuery from 'queries/staking/useStakingThalesQuery';
import useEscrowThalesQuery from 'queries/staking/useEscrowThalesQuery';

enum SectionType {
    INFO,
    VOLUME,
    REWARD,
    CLAIM,
    CLAIM_ON_BEHALF,
    LP_STAKING,
}

type RewardsProperties = {
    gridGap: number;
    setSelectedTab: (tabId: string) => void;
};

const Rewards: React.FC<RewardsProperties> = ({ gridGap, setSelectedTab }) => {
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
    const stakingThalesQuery = useStakingThalesQuery(walletAddress, networkId, { enabled: isAppReady });
    const escrowThalesQuery = useEscrowThalesQuery(walletAddress, networkId, { enabled: isAppReady });

    const totalStakedAmount =
        stakingThalesQuery.isSuccess && stakingThalesQuery.data ? stakingThalesQuery.data.totalStakedAmount : 0;
    const fixedPeriodReward =
        stakingThalesQuery.isSuccess && stakingThalesQuery.data ? stakingThalesQuery.data.fixedPeriodReward : 0;
    const totalEscrowedRewards =
        escrowThalesQuery.isSuccess && escrowThalesQuery.data ? escrowThalesQuery.data.totalEscrowedRewards : 0;
    const totalEscrowBalanceNotIncludedInStaking =
        escrowThalesQuery.isSuccess && escrowThalesQuery.data
            ? escrowThalesQuery.data.totalEscrowBalanceNotIncludedInStaking
            : 0;
    const thalesStaked =
        stakingThalesQuery.isSuccess && stakingThalesQuery.data ? stakingThalesQuery.data.thalesStaked : 0;
    const escrowedBalance =
        escrowThalesQuery.isSuccess && escrowThalesQuery.data ? escrowThalesQuery.data.escrowedBalance : 0;

    const totalThalesStaked = useMemo(
        () => totalStakedAmount + totalEscrowedRewards - totalEscrowBalanceNotIncludedInStaking,
        [totalStakedAmount, totalEscrowedRewards, totalEscrowBalanceNotIncludedInStaking]
    );

    const myStakedShare = useMemo(
        () => (totalThalesStaked === 0 ? 0 : (100 * (thalesStaked + escrowedBalance)) / totalThalesStaked),
        [thalesStaked, totalThalesStaked, escrowedBalance]
    );

    const estimatedRewards = useMemo(() => (myStakedShare / 100) * fixedPeriodReward, [myStakedShare]);

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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
    const maxAmmBonusPercentage = stakingRewards ? stakingRewards.maxAmmBonusPercentage : 0;
    const maxSnxBonusPercentage = stakingRewards ? stakingRewards.maxSnxBonusPercentage : 0;

    const opAmmBonus = ammBonus * OP_REWARDS_MULTIPLIER;
    const maxOpAmmBonus = maxAmmBonus * OP_REWARDS_MULTIPLIER;

    const maxAmmVolume = baseRewards * ammVolumeRewardsMultiplier;
    const additionalAmmVolume = maxAmmVolume - ammVolume > 0 ? maxAmmVolume - ammVolume : 0;
    const ammVolumeNeededForMaxBonus =
        isClaimAvailable || isClaiming
            ? additionalAmmVolume
            : estimatedRewards * ammVolumeRewardsMultiplier - ammVolume;

    const maxSnxStaked = baseRewards * snxVolumeRewardsMultiplier;
    const additionalSnxStaked = maxSnxStaked - snxStaked > 0 ? maxSnxStaked - snxStaked : 0;
    const snxNeededForMaxBonus =
        isClaimAvailable || isClaiming
            ? additionalSnxStaked
            : estimatedRewards * snxVolumeRewardsMultiplier - snxStaked;

    const hasUserStaked = estimatedRewards > 0;

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
    const ammVolumeFormatted = formatCurrencyWithKey(SYNTHS_MAP.sUSD, thalesAmmVolume, 0, true);
    const rangedVolumeFormatted = formatCurrencyWithKey(SYNTHS_MAP.sUSD, rangedAmmVolume, 0, true);
    const sportsVolumeFormatted = formatCurrencyWithKey(SYNTHS_MAP.sUSD, sportsAmmVolume, 0, true);
    const exoticVolumeFormatted = formatCurrencyWithKey(SYNTHS_MAP.sUSD, exoticVolume, 0, true);

    // Protocol usage
    const protocolRewardThales = formatCurrencyWithKey(THALES_CURRENCY, ammBonus);
    const protocolRewardOp = formatCurrencyWithKey(CRYPTO_CURRENCY_MAP.OP, opAmmBonus);
    const protocolVolumeFormatted = formatCurrencyWithKey(SYNTHS_MAP.sUSD, ammVolume);
    const protocolVolumeNeededForBonusFormatted =
        ammVolumeNeededForMaxBonus > 0 ? formatCurrencyWithKey(SYNTHS_MAP.sUSD, ammVolumeNeededForMaxBonus) : '';
    const protocolMaxRewardFormatted = isClaimAvailable
        ? formatCurrencyWithKey(THALES_CURRENCY, maxAmmBonus) +
          ' + ' +
          formatCurrencyWithKey(CRYPTO_CURRENCY_MAP.OP, maxOpAmmBonus)
        : formatCurrencyWithKey(THALES_CURRENCY, estimatedRewards * (maxAmmBonusPercentage / 100)) +
          ' + ' +
          formatCurrencyWithKey(
              CRYPTO_CURRENCY_MAP.OP,
              estimatedRewards * (maxAmmBonusPercentage / 100) * OP_REWARDS_MULTIPLIER
          );

    // SNX staking
    const snxRewardFormatted = formatCurrencyWithKey(THALES_CURRENCY, snxBonus);
    const snxStakedFormatted = formatCurrencyWithKey(CRYPTO_CURRENCY_MAP.SNX, snxStaked);
    const snxNeededForMaxBonusFormatted =
        snxNeededForMaxBonus > 0 ? formatCurrencyWithKey(CRYPTO_CURRENCY_MAP.SNX, snxNeededForMaxBonus) : '';
    const snxMaxRewardFormatted = isClaimAvailable
        ? formatCurrencyWithKey(THALES_CURRENCY, maxSnxBonus)
        : formatCurrencyWithKey(THALES_CURRENCY, estimatedRewards * (maxSnxBonusPercentage / 100));

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

    const getVolumeSection = (link: string, label: string, value: string, desc: string, logo?: string) => {
        return (
            <a href={link} rel="noopener noreferrer" target="_blank">
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
            </a>
        );
    };

    const getRewardSection = (
        label: { main: string; volume: string; bonus: string; rewards: string; bonusEligible?: boolean },
        value: { main: string; volume: string; bonus: string; rewards: string; mainAddition?: string }
    ) => {
        return (
            <SectionContentWrapper>
                <SectionLabel type={SectionType.REWARD}>
                    <SectionLabelContent type={SectionType.REWARD}>{label.main}</SectionLabelContent>
                </SectionLabel>
                <SectionValue type={SectionType.REWARD}>
                    <SectionValueContent type={SectionType.REWARD}>{value.main}</SectionValueContent>
                    {value.mainAddition && (
                        <SectionValueContent type={SectionType.REWARD} isOp={true}>
                            {' + ' + value.mainAddition}
                        </SectionValueContent>
                    )}
                </SectionValue>

                <Line margin={'0 0 10px 0'} />

                <SectionDetails>
                    <SectionDetailsLabel>{label.volume}</SectionDetailsLabel>
                    <SectionDetailsValue>{value.volume}</SectionDetailsValue>
                </SectionDetails>
                <SectionDetails>
                    <SectionDetailsLabel useBonusColor={!value.bonus} notEligibleColor={!label.bonusEligible}>
                        {label.bonus}
                    </SectionDetailsLabel>
                    {value.bonus && <SectionDetailsValue useBonusColor={true}>{value.bonus}</SectionDetailsValue>}
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
                    dispatchMarketNotification(t('options.earn.gamified-staking.rewards.claim.confirmation-message'));
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
                        t('options.earn.gamified-staking.rewards.claim.close-period.confirmation-message')
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
                title={t('options.earn.gamified-staking.rewards.claim.button-tooltip') as string}
                open={showTooltip}
            >
                <ButtonWrapperTooltip>
                    <Button
                        type={ButtonType.submit}
                        active={isClaimAvailable}
                        disabled={!isClaimAvailable}
                        onMouseOverHandler={() => {
                            setShowTooltip(true);
                        }}
                        onMouseOutHandler={() => {
                            setShowTooltip(false);
                        }}
                        onClickHandler={handleClaimStakingRewards}
                    >
                        {isClaiming
                            ? t('options.earn.gamified-staking.rewards.claim.claiming')
                            : t('options.earn.gamified-staking.rewards.claim.claim')}
                    </Button>
                </ButtonWrapperTooltip>
            </StyledMaterialTooltip>
        );
    };

    const getClaimSection = () => {
        return (
            <SectionContentWrapper noGrid={true}>
                <RewardPeriod>
                    <PeriodLabel>{t('options.earn.gamified-staking.rewards.claim.period')}</PeriodLabel>
                    {stakingRewards ? (
                        <TimeRemaining
                            end={stakingRewards.closingDate}
                            fontSize={isMobile() ? 12 : 15}
                            showFullCounter
                        />
                    ) : (
                        '-'
                    )}
                    {stakingRewards && stakingRewards.canClosePeriod && (
                        <Button
                            type={ButtonType.label}
                            onClickHandler={handleClosePeriod}
                            active={isClosingPeriodAvailable}
                            disabled={!isClosingPeriodAvailable}
                        >
                            {isClosingPeriod
                                ? t('options.earn.gamified-staking.rewards.claim.close-period.progress-label')
                                : t('options.earn.gamified-staking.rewards.claim.close-period.label')}
                        </Button>
                    )}
                </RewardPeriod>
                <SectionLabel type={SectionType.CLAIM}>
                    <SectionLabelContent type={SectionType.CLAIM}>
                        {t('options.earn.gamified-staking.rewards.claim.total-label')}
                    </SectionLabelContent>
                </SectionLabel>
                <SectionValue type={SectionType.CLAIM}>
                    <SectionValueContent type={SectionType.CLAIM}>
                        {formatCurrencyWithKey(THALES_CURRENCY, totalThalesRewards)}
                    </SectionValueContent>
                    <SectionValueContent type={SectionType.CLAIM} isOp={true}>
                        {' + ' + formatCurrencyWithKey(CRYPTO_CURRENCY_MAP.OP, opAmmBonus)}
                    </SectionValueContent>
                    <StyledMaterialTooltip
                        arrow={true}
                        title={<Trans i18nKey="options.earn.gamified-staking.rewards.claim.op-tooltip" />}
                        interactive
                    >
                        <StyledInfoIcon />
                    </StyledMaterialTooltip>
                </SectionValue>
                <NetworkFeesWrapper>
                    <Line margin={'0 0 10px 0'} />
                    <NetworkFees gasLimit={gasLimit} disabled={isClaiming} l1Fee={l1Fee} />
                </NetworkFeesWrapper>
                <ButtonContainer>
                    <ClaimMessage above={true}>
                        {stakingRewards && stakingRewards.isClaimPaused
                            ? t('options.earn.gamified-staking.rewards.claim.paused-message')
                            : ''}
                        {stakingRewards && !stakingRewards.isClaimPaused && stakingRewards.claimed
                            ? t('options.earn.gamified-staking.rewards.claim.claimed-message')
                            : ''}
                        {stakingRewards &&
                        !stakingRewards.isClaimPaused &&
                        !stakingRewards.claimed &&
                        !stakingRewards.hasClaimRights &&
                        isWalletConnected
                            ? t('options.earn.gamified-staking.rewards.claim.not-eligible-message')
                            : ''}
                    </ClaimMessage>
                    {getClaimButton()}
                </ButtonContainer>
                <ValidationMessage
                    showValidation={txErrorMessage !== null}
                    message={txErrorMessage}
                    onDismiss={() => setTxErrorMessage(null)}
                />
            </SectionContentWrapper>
        );
    };

    const getClaimOnBehalfSection = () => {
        return (
            <SectionContentWrapper>
                <SectionLabel type={SectionType.CLAIM_ON_BEHALF} margin={'20px 0 0 0'}>
                    <SectionLabelContent type={SectionType.CLAIM_ON_BEHALF}>
                        {t('options.earn.gamified-staking.rewards.claim-on-behalf.label-1')}
                    </SectionLabelContent>
                </SectionLabel>
                <SectionLabel type={SectionType.CLAIM_ON_BEHALF} margin={'20px 0 0 0'} textDefault={true}>
                    <SectionLabelContent type={SectionType.CLAIM_ON_BEHALF} textDefault={true}>
                        {t('options.earn.gamified-staking.rewards.claim-on-behalf.label-2')}
                    </SectionLabelContent>
                </SectionLabel>
                <Button
                    type={ButtonType.popup}
                    active={true}
                    margin={'30px 0 5px auto'}
                    onClickHandler={() => setShowClaimOnBehalfModal(true)}
                >
                    {t('options.earn.gamified-staking.rewards.claim-on-behalf.enable')}
                </Button>
            </SectionContentWrapper>
        );
    };

    const getLpStakingSection = () => {
        return (
            <SectionContentWrapper background={false} noGrid={true}>
                <SectionLabel type={SectionType.LP_STAKING} margin={'34px 0 0 0'}>
                    <SectionLabelContent type={SectionType.LP_STAKING}>
                        {t('options.earn.gamified-staking.rewards.lp-staking.label-1')}
                    </SectionLabelContent>
                    <StyledMaterialTooltip
                        arrow={true}
                        title={
                            <Trans
                                i18nKey="options.earn.gamified-staking.rewards.lp-staking.tooltip"
                                components={[
                                    <LpStakingLink key="1" onClick={() => setSelectedTab(TokenTabEnum.LP_STAKING)} />,
                                ]}
                            />
                        }
                        interactive
                    >
                        <StyledInfoIcon />
                    </StyledMaterialTooltip>
                </SectionLabel>
                <SectionLabel type={SectionType.LP_STAKING}>
                    <SectionLabelContent type={SectionType.LP_STAKING}>
                        {t('options.earn.gamified-staking.rewards.lp-staking.label-2')}
                    </SectionLabelContent>
                </SectionLabel>
                <SectionValue type={SectionType.LP_STAKING}>
                    <SectionValueContent type={SectionType.LP_STAKING}>{lpStakingReward}</SectionValueContent>
                </SectionValue>
                <ArrowWrapper>
                    <ArrowLink src={arrowLink} widthPer={7} />
                </ArrowWrapper>
            </SectionContentWrapper>
        );
    };

    return (
        <>
            {/* First row */}
            <SectionWrapper columns={4}>
                {getInfoSection(
                    t('options.earn.gamified-staking.rewards.info.base'),
                    baseRewardsFormatted,
                    t('options.earn.gamified-staking.rewards.info.base-description', {
                        baseRewards: baseRewardsFormatted,
                    })
                )}
            </SectionWrapper>
            <SectionWrapper columns={8}>
                {getInfoSection(
                    t('options.earn.gamified-staking.rewards.info.bonus'),
                    bonusRewardsFormatted,
                    <Trans
                        i18nKey="options.earn.gamified-staking.rewards.info.bonus-description"
                        components={[<Tip48Link key="1" />]}
                    />
                )}
            </SectionWrapper>

            {/* Second row */}
            <SectionWrapper columns={3} backgroundType={BackgroundType.AMM}>
                {getVolumeSection(
                    ROUTES.Options.Home,
                    t('options.earn.gamified-staking.rewards.volume.amm-label'),
                    ammVolumeFormatted,
                    t('options.earn.gamified-staking.rewards.volume.amm-desc')
                )}
            </SectionWrapper>
            <SectionWrapper columns={3} backgroundType={BackgroundType.RANGED}>
                {getVolumeSection(
                    ROUTES.Options.RangeMarkets,
                    t('options.earn.gamified-staking.rewards.volume.ranged-label'),
                    rangedVolumeFormatted,
                    t('options.earn.gamified-staking.rewards.volume.ranged-desc')
                )}
            </SectionWrapper>
            {isMobile() && <DashedLineVertical gridRow={4} columnStart={4} marginTop={-gridGap} heightPer={135} />}
            {isMobile() && <DashedLineVertical gridRow={4} columnStart={9} marginTop={-gridGap} heightPer={135} />}
            <SectionWrapper columns={3} backgroundType={BackgroundType.SPORTS}>
                {getVolumeSection(
                    LINKS.SportMarkets,
                    '',
                    sportsVolumeFormatted,
                    t('options.earn.gamified-staking.rewards.volume.sports-desc'),
                    logoOvertime
                )}
            </SectionWrapper>
            <SectionWrapper columns={3} backgroundType={BackgroundType.EXOTIC}>
                {getVolumeSection(
                    LINKS.ExoticMarkets,
                    '',
                    exoticVolumeFormatted,
                    t('options.earn.gamified-staking.rewards.volume.exotic-desc'),
                    logoExotic
                )}
            </SectionWrapper>

            {isMobile() ? (
                <>
                    <DashedLineVertical gridRow={6} columnStart={4} marginTop={-gridGap} heightPer={135} />
                    <DashedLineVertical gridRow={6} columnStart={9} marginTop={-gridGap} heightPer={135} />
                </>
            ) : (
                <>
                    <DashedLine gridRow={3} widthPer={76.2} />
                    <DashedLineVertical gridRow={3} columnStart={2} marginTop={-gridGap} heightPer={135} />
                    <DashedLineVertical gridRow={3} columnStart={5} marginTop={-gridGap} heightPer={135} />
                    <DashedLineVertical gridRow={3} columnStart={8} marginTop={-gridGap} heightPer={135} />
                    <DashedLineVertical gridRow={3} columnStart={11} marginTop={-gridGap} heightPer={135} />
                    <DashedLineVertical gridRow={3} columnStart={4} marginTop={gridGap} heightPer={100} />
                </>
            )}

            {/* Third row */}
            <SectionWrapper columns={5} startColumn={2}>
                {getRewardSection(
                    {
                        main: t('options.earn.gamified-staking.rewards.protocol.label'),
                        volume: t('options.earn.gamified-staking.rewards.protocol.volume'),
                        bonus: protocolVolumeNeededForBonusFormatted.length
                            ? t('options.earn.gamified-staking.rewards.protocol.bonus')
                            : hasUserStaked
                            ? t('options.earn.gamified-staking.rewards.protocol.bonus-eligible')
                            : t('options.earn.gamified-staking.rewards.no-thales-staked'),
                        rewards: isClaimAvailable
                            ? t('options.earn.gamified-staking.rewards.protocol.rewards')
                            : t('options.earn.gamified-staking.rewards.protocol.estimated-rewards'),
                        bonusEligible: hasUserStaked,
                    },
                    {
                        main: protocolRewardThales,
                        volume: protocolVolumeFormatted,
                        bonus: protocolVolumeNeededForBonusFormatted,
                        rewards: protocolMaxRewardFormatted,
                        mainAddition: protocolRewardOp,
                    }
                )}
            </SectionWrapper>
            {isMobile() && <PlusSectionConnect>+</PlusSectionConnect>}
            <SectionWrapper columns={5}>
                {getRewardSection(
                    {
                        main: t('options.earn.gamified-staking.rewards.snx.label'),
                        volume: t('options.earn.gamified-staking.rewards.snx.staked'),
                        bonus: snxNeededForMaxBonusFormatted.length
                            ? t('options.earn.gamified-staking.rewards.snx.bonus')
                            : hasUserStaked
                            ? t('options.earn.gamified-staking.rewards.snx.bonus-eligible')
                            : t('options.earn.gamified-staking.rewards.no-thales-staked'),
                        rewards: isClaimAvailable
                            ? t('options.earn.gamified-staking.rewards.snx.rewards')
                            : t('options.earn.gamified-staking.rewards.snx.estimated-rewards'),
                        bonusEligible: hasUserStaked,
                    },
                    {
                        main: snxRewardFormatted,
                        volume: snxStakedFormatted,
                        bonus: snxNeededForMaxBonusFormatted,
                        rewards: snxMaxRewardFormatted,
                    }
                )}
            </SectionWrapper>
            {isMobile() && (
                <DashedLineVertical gridRow={10} columnStart={7} marginTop={-gridGap} marginLeft={-7} heightPer={135} />
            )}

            {!isMobile() && (
                <>
                    <DashedLine gridRow={5} widthPer={42.5} />
                    <DashedLineVertical gridRow={5} columnStart={4} marginTop={-gridGap} heightPer={135} />
                    <DashedLineVertical gridRow={5} columnStart={9} marginTop={-gridGap} heightPer={135} />
                    <DashedLineVertical
                        gridRow={5}
                        columnStart={7}
                        marginTop={gridGap}
                        heightPer={100}
                        marginLeft={-10}
                    />
                </>
            )}

            {/* Fourth row */}
            {!isMobile() && (
                <SectionWrapper columns={3} backgroundType={BackgroundType.CLAIM_ON_BEHALF}>
                    {getClaimOnBehalfSection()}
                </SectionWrapper>
            )}
            <SectionWrapper columns={6} backgroundType={BackgroundType.CLAIM}>
                {getClaimSection()}
            </SectionWrapper>
            {!isMobile() && (
                <SectionWrapper
                    columns={3}
                    backgroundType={BackgroundType.LP_STAKING}
                    onClick={() => setSelectedTab(TokenTabEnum.LP_STAKING)}
                >
                    {getLpStakingSection()}
                </SectionWrapper>
            )}

            <DashedLine gridRow={7} widthPer={0} />
            {!isMobile() && (
                <DashedLineVertical gridRow={7} columnStart={7} marginTop={-gridGap} heightPer={210} marginLeft={-10} />
            )}
            {isMobile() && (
                <DashedLineVertical gridRow={12} columnStart={7} marginTop={-gridGap} marginLeft={-7} heightPer={135} />
            )}

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
    CLAIM,
    CLAIM_ON_BEHALF,
    LP_STAKING,
}

const ArrowWrapper = styled.div`
    position: absolute;
    width: 100%;
    bottom: 20px;
    right: 20px;
    text-align: end;
`;

const ArrowLink = styled.img<{ widthPer?: number }>`
    margin-left: 10px;
    cursor: pointer;
    filter: brightness(0) invert(1);
    ${(props) => (props.widthPer ? `width: ${props.widthPer}%;` : '')}
`;

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
            case BackgroundType.CLAIM:
            case BackgroundType.CLAIM_ON_BEHALF:
                return '#64d9fe80';
            default:
                return 'linear-gradient(160deg, #801bf2 0%, #1BAB9C 100%)';
        }
    }};
    ${(props) => (props.marginTop ? `margin-top: ${props.marginTop}px;` : '')};
    cursor: ${(props) =>
        ![BackgroundType.CLAIM, BackgroundType.CLAIM_ON_BEHALF].includes(props.backgroundType ?? BackgroundType.CLAIM)
            ? 'pointer'
            : 'default'};

    &:hover ${ArrowLink} {
        animation: pulsing 1s ease-in;
        animation-iteration-count: infinite;

        @keyframes pulsing {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.5);
                opacity: 1;
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }
    }

    @media (max-width: 768px) {
        grid-column: span
            ${(props) =>
                [BackgroundType.AMM, BackgroundType.RANGED, BackgroundType.SPORTS, BackgroundType.EXOTIC].includes(
                    props.backgroundType ?? -1
                )
                    ? 6
                    : 12};
        margin-top: 0;
    }
`;

const SectionContentWrapper = styled.div<{ background?: boolean; noGrid?: boolean }>`
    ${(props) => (props.noGrid ? '' : 'display: grid;')};
    position: relative;
    height: 100%;
    background: ${(props) => (props.background ?? true ? '#04045a' : 'none')};
    border-radius: 15px;
    align-items: center;
    text-align: center;
    padding: 10px 15px;
    @media (max-width: 768px) {
        padding: 10px;
    }
`;

const SectionContent = styled.span`
    font-family: 'Roboto';
    color: #ffffff;
`;

const SectionLabel = styled.div<{ type: SectionType; margin?: string; textDefault?: boolean }>`
    ${(props) => (props.textDefault ? 'text-align: left;' : '')}
    ${(props) => (props.margin ? `margin: ${props.margin};` : '')}
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
                return 'padding-bottom: 10px;';
            case SectionType.CLAIM:
            case SectionType.CLAIM_ON_BEHALF:
                return `                
                    padding-top: 10px;
                    padding-bottom: 10px;
                `;
            case SectionType.LP_STAKING:
                return `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
            default:
                return '';
        }
    }}
    @media (max-width: 768px) {
        padding-bottom: 10px;
    }
`;

const SectionLabelContent = styled(SectionContent)<{ type: SectionType; logo?: string; textDefault?: boolean }>`
    text-transform: ${(props) => (props.textDefault ? 'none' : 'uppercase')};
    ${(props) => (props.logo ? `content: url(${props.logo});` : '')}
    ${(props) => {
        switch (props.type) {
            case SectionType.INFO:
            case SectionType.VOLUME:
                return `
                    font-weight: 600;
                    font-size: 15px;
                `;
            case SectionType.REWARD:
            case SectionType.CLAIM:
            case SectionType.LP_STAKING:
                return `
                    font-weight: 700;
                    font-size: 15px;
                    line-height: 17px;
                `;
            case SectionType.CLAIM_ON_BEHALF:
                return `
                    font-weight: 700;
                    font-size: 15px;
                    line-height: 17px;
                `;
            default:
                return '';
        }
    }}
    @media (max-width: 768px) {
        font-size: 12px;
    }
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
            case SectionType.LP_STAKING:
                return 'padding-top: 20px;';
            default:
                return '';
        }
    }}
`;

const SectionValueContent = styled(SectionContent)<{ type: SectionType; isOp?: boolean }>`
    letter-spacing: 0.035em;
    ${(props) => {
        switch (props.type) {
            case SectionType.INFO:
                return `
                    font-weight: 700;
                    font-size: 20px;
                    text-transform: uppercase;
                `;
            case SectionType.VOLUME:
                return `
                    font-weight: 600;
                    font-size: 16px;
                    line-height: 25px;
                `;
            case SectionType.REWARD:
            case SectionType.CLAIM:
            case SectionType.LP_STAKING:
                return `
                    font-weight: 700;
                    font-size: 23px;
                    color: ${props.isOp ? '#ffffff' : '#64D9FE'};
                    text-transform: uppercase;
                    @media (max-width: 768px) {
                        font-size: 20px;
                    }
                `;
            default:
                return 'text-transform: uppercase;';
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
                    text-align: start;
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
    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

const SectionDetails = styled.div`
    padding-bottom: 10px;
`;

const SectionDetailsLabel = styled.span<{ useBonusColor?: boolean; notEligibleColor?: boolean }>`
    display: block;
    float: left;
    font-weight: 300;
    font-size: 15px;
    line-height: 15px;
    letter-spacing: 0.035em;
    color: ${(props) => (props.notEligibleColor ? '#ffcc00' : props.useBonusColor ? '#50ce99' : '#ffffff')};
    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

const SectionDetailsValue = styled.span<{ useBonusColor?: boolean }>`
    display: block;
    float: right;
    font-weight: 500;
    font-size: 15px;
    line-height: 15px;
    color: ${(props) => (props.useBonusColor ? '#50ce99' : '#ffffff')};
`;

const ButtonWrapperTooltip = styled.div`
    width: 70%;
    display: flex;
    justify-content: center;
    @media (max-width: 768px) {
        width: 100%;
    }
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
    @media (max-width: 768px) {
        font-size: 12px;
    }
`;

const NetworkFeesWrapper = styled.div`
    margin: 0 50px;
    @media (max-width: 768px) {
        margin: auto;
    }
`;

const LpStakingLink = styled.span`
    cursor: pointer;
    text-decoration: underline;
    font-weight: bold;
`;

const PlusSectionConnect = styled.div`
    text-align: center;
    grid-column: span 12;
    color: #64d9fe;
    font-weight: 700;
    font-size: 30px;
`;

export default Rewards;
