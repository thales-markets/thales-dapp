import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, FlexDivColumn, FlexDivColumnCentered, FlexDivSpaceBetween, GradientText } from 'theme/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import {
    getCustomGasPrice,
    getGasSpeed,
    getIsWalletConnected,
    getNetworkId,
    getWalletAddress,
} from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import snxJSConnector from 'utils/snxJSConnector';
import ValidationMessage from 'components/ValidationMessage/ValidationMessage';
import useOngoingAirdropQuery from 'queries/walletBalances/useOngoingAirdropQuery';
import { ethers } from 'ethers';
import { StakingReward } from 'types/token';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { THALES_CURRENCY } from 'constants/currency';
import { refetchOngoingAirdrop, refetchUserTokenTransactions } from 'utils/queryConnector';
import {
    ButtonContainer,
    ClaimMessage,
    EarnSection,
    PieChartCenterDiv,
    PieChartCenterText,
    PieChartContainer,
    SectionContentContainer,
    SectionHeader,
    LearnMore,
    StyledMaterialTooltip,
} from '../../components';
import { gasPriceInWei, normalizeGasLimit } from 'utils/network';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import NetworkFees from 'pages/Options/components/NetworkFees';
import { Cell, Pie, PieChart } from 'recharts';
import styled from 'styled-components';
import { bigNumberFormatter } from '../../../../../utils/formatters/ethers';
import { dispatchMarketNotification } from 'utils/options';

const MAX_SNX_STAKING_PERIOD = 144;
const MAX_THALES_STAKING_PERIOD = 150;
const WEEKLY_REWARDS_SNX = 150000;
const WEEKLY_REWARDS_THALES = 100000;

type Properties = {
    escrowedBalance: number;
    setEscrowedBalance: (escrowed: number) => void;
};

const StakingRewards: React.FC<Properties> = ({ escrowedBalance, setEscrowedBalance }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const gasSpeed = useSelector((state: RootState) => getGasSpeed(state));
    const customGasPrice = useSelector((state: RootState) => getCustomGasPrice(state));
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [ongoingAirdrop, setOngoingAirdrop] = useState<StakingReward | undefined>(undefined);
    const [isClaiming, setIsClaiming] = useState(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const { ongoingAirdropContract } = snxJSConnector as any;

    const isClaimAvailable =
        ongoingAirdrop &&
        ongoingAirdrop.reward &&
        ongoingAirdrop.hasClaimRights &&
        !ongoingAirdrop.claimed &&
        !ongoingAirdrop.isClaimPaused;

    const ongoingAirdropQuery = useOngoingAirdropQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected && !!ongoingAirdropContract,
    });

    const ethGasPriceQuery = useEthGasPriceQuery();
    const gasPrice = useMemo(
        () =>
            customGasPrice !== null
                ? customGasPrice
                : ethGasPriceQuery.data != null
                ? ethGasPriceQuery.data[gasSpeed]
                : null,
        [customGasPrice, ethGasPriceQuery.data, gasSpeed]
    );

    useEffect(() => {
        if (ongoingAirdropQuery.isSuccess && ongoingAirdropQuery.data) {
            setOngoingAirdrop(ongoingAirdropQuery.data);
        }
    }, [ongoingAirdropQuery.isSuccess, ongoingAirdropQuery.data]);

    useEffect(() => {
        const fetchGasLimit = async () => {
            if (ongoingAirdrop && ongoingAirdrop.reward) {
                try {
                    const ongoingAirdropContractWithSigner = ongoingAirdropContract.connect(
                        (snxJSConnector as any).signer
                    );
                    const gasEstimate = await ongoingAirdropContractWithSigner.estimateGas.claim(
                        ongoingAirdrop.reward.index,
                        ongoingAirdrop.reward.rawBalance,
                        ongoingAirdrop.reward.proof
                    );
                    setGasLimit(normalizeGasLimit(Number(gasEstimate)));
                } catch (e) {
                    console.log(e);
                    setGasLimit(null);
                }
            }
        };
        if (!isWalletConnected || !isClaimAvailable || !ongoingAirdropContract) return;
        fetchGasLimit();
    }, [isWalletConnected, isClaimAvailable, ongoingAirdropContract]);

    const handleClaimOngoingAirdrop = async () => {
        if (isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward && gasPrice !== null) {
            try {
                setTxErrorMessage(null);
                setIsClaiming(true);
                const ongoingAirdropContractWithSigner = ongoingAirdropContract.connect((snxJSConnector as any).signer);
                const tx = (await ongoingAirdropContractWithSigner.claim(
                    ongoingAirdrop.reward.index,
                    ongoingAirdrop.reward.rawBalance,
                    ongoingAirdrop.reward.proof,
                    {
                        gasPrice: gasPriceInWei(gasPrice),
                        gasLimit,
                    }
                )) as ethers.ContractTransaction;
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    dispatchMarketNotification(t('options.earn.thales-staking.staking-rewards.confirmation-message'));
                    refetchOngoingAirdrop(walletAddress, networkId);
                    refetchUserTokenTransactions(walletAddress, networkId);
                    setOngoingAirdrop({
                        ...ongoingAirdrop,
                        claimed: true,
                    });
                    setEscrowedBalance(escrowedBalance + bigNumberFormatter(ongoingAirdrop.reward.rawBalance));
                    setIsClaiming(false);
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsClaiming(false);
            }
        }
    };

    const pieData = useMemo(() => {
        if (!isClaimAvailable) {
            return [{ name: 'No data', value: 100, color: '#748bc6' }];
        }
        return [
            {
                name: 'THALES',
                value:
                    isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward
                        ? ongoingAirdrop.reward.stakingBalance
                        : 0,
            },
            {
                name: 'SNX',
                value:
                    isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward ? ongoingAirdrop.reward.snxBalance : 0,
                color: '#00D1FF',
            },
        ];
    }, [ongoingAirdrop]);

    const stakingBalance =
        isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward ? ongoingAirdrop.reward.stakingBalance : 0;
    const snxBalance =
        isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward ? ongoingAirdrop.reward.snxBalance : 0;
    const balance = isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward ? ongoingAirdrop.reward.balance : 0;
    const previousBalance =
        isClaimAvailable && ongoingAirdrop && ongoingAirdrop.reward ? ongoingAirdrop.reward.previousBalance : 0;

    return (
        <EarnSection style={{ gridColumn: 'span 7', gridRow: 'span 3' }}>
            <SectionHeader>
                <div>{t('options.earn.thales-staking.staking-rewards.title')}</div>
            </SectionHeader>
            <SectionContentContainer>
                <PieChartContainer style={{ alignItems: 'flex-end', marginBottom: '77px' }}>
                    <FlexDivColumn style={{ marginRight: '30px', alignSelf: 'center' }}>
                        <StakingRewardsAmountContainer
                            style={{ marginRight: '30px' }}
                            gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                        >
                            <StakingRewardsAmount>
                                <StakingRewardsTitle>
                                    {t('options.earn.thales-staking.staking-rewards.amount-to-claim-thales')}
                                </StakingRewardsTitle>
                                <GradientText
                                    gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                                    fontSize={25}
                                    fontWeight={600}
                                >
                                    {formatCurrencyWithKey(THALES_CURRENCY, stakingBalance)}
                                </GradientText>
                            </StakingRewardsAmount>
                        </StakingRewardsAmountContainer>
                        <FlexDivSpaceBetween>
                            <StakingRewardsInfoTitle>
                                {t('options.earn.thales-staking.staking-rewards.period')}:
                            </StakingRewardsInfoTitle>
                            <StakingRewardsInfoContent>
                                {ongoingAirdrop ? `${ongoingAirdrop.period}/${MAX_THALES_STAKING_PERIOD}` : '-'}
                            </StakingRewardsInfoContent>
                        </FlexDivSpaceBetween>
                        <FlexDivSpaceBetween>
                            <StakingRewardsInfoTitle>
                                {t('options.earn.thales-staking.staking-rewards.weekly-rewards')}:
                            </StakingRewardsInfoTitle>
                            <StakingRewardsInfoContent>
                                {formatCurrencyWithKey(THALES_CURRENCY, WEEKLY_REWARDS_THALES, 0, true)}
                            </StakingRewardsInfoContent>
                        </FlexDivSpaceBetween>
                    </FlexDivColumn>
                    <PieChart height={300} width={300}>
                        <defs>
                            <linearGradient
                                id={`thalesGradient`}
                                gradientTransform="translate(1, 0) rotate(200) scale(0.6)"
                            >
                                <stop offset="0%" stopColor={'#3936C7'} />
                                <stop offset="100%" stopColor={'#2D83D2'} />
                            </linearGradient>
                        </defs>
                        <Pie
                            isAnimationActive={false}
                            blendStroke={true}
                            data={pieData}
                            dataKey={'value'}
                            outerRadius={150}
                            innerRadius={115}
                            startAngle={-270}
                            endAngle={90}
                        >
                            {pieData.map((slice, index) => (
                                <Cell key={index} fill={slice.color || 'url(#thalesGradient)'} />
                            ))}
                        </Pie>
                    </PieChart>
                    <FlexDivColumn style={{ marginLeft: '30px', alignSelf: 'center' }}>
                        <StakingRewardsAmountContainer style={{ marginLeft: '30px' }} gradient="#00D1FF">
                            <StakingRewardsAmount>
                                <StakingRewardsTitle>
                                    {t('options.earn.thales-staking.staking-rewards.amount-to-claim-snx')}
                                </StakingRewardsTitle>
                                <GradientText
                                    gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                                    fontSize={25}
                                    fontWeight={600}
                                >
                                    {formatCurrencyWithKey(THALES_CURRENCY, snxBalance)}
                                </GradientText>
                            </StakingRewardsAmount>
                        </StakingRewardsAmountContainer>
                        <FlexDivSpaceBetween>
                            <StakingRewardsInfoTitle>
                                {t('options.earn.thales-staking.staking-rewards.period')}:
                            </StakingRewardsInfoTitle>
                            <StakingRewardsInfoContent>
                                {ongoingAirdrop ? `${ongoingAirdrop.period}/${MAX_SNX_STAKING_PERIOD}` : '-'}
                            </StakingRewardsInfoContent>
                        </FlexDivSpaceBetween>
                        <FlexDivSpaceBetween>
                            <StakingRewardsInfoTitle>
                                {t('options.earn.thales-staking.staking-rewards.weekly-rewards')}:
                            </StakingRewardsInfoTitle>
                            <StakingRewardsInfoContent>
                                {formatCurrencyWithKey(THALES_CURRENCY, WEEKLY_REWARDS_SNX, 0, true)}
                            </StakingRewardsInfoContent>
                        </FlexDivSpaceBetween>
                    </FlexDivColumn>
                    <PieChartCenterDiv>
                        <FlexDivColumnCentered>
                            <PieChartCenterText>
                                {t('options.earn.thales-staking.staking-rewards.total')}
                            </PieChartCenterText>
                            <GradientText
                                gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                                fontSize={20}
                                fontWeight={600}
                            >
                                {formatCurrencyWithKey(THALES_CURRENCY, balance)}
                            </GradientText>
                        </FlexDivColumnCentered>
                        <FlexDivColumnCentered style={{ marginTop: 30, marginBottom: 30 }}>
                            <PieChartCenterText>
                                {t('options.earn.thales-staking.staking-rewards.previous-period')}
                            </PieChartCenterText>
                            <GradientText
                                gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                                fontSize={20}
                                fontWeight={600}
                            >
                                {formatCurrencyWithKey(THALES_CURRENCY, previousBalance)}
                            </GradientText>
                        </FlexDivColumnCentered>
                    </PieChartCenterDiv>
                    <LearnMore>
                        <StyledMaterialTooltip
                            arrow={true}
                            title={t('options.earn.thales-staking.staking-rewards.learn-more-text') as string}
                        >
                            <span>{t('options.earn.thales-staking.staking-rewards.learn-more')}</span>
                        </StyledMaterialTooltip>
                    </LearnMore>
                </PieChartContainer>
                <NetworkFees gasLimit={gasLimit} disabled={isClaiming} />
                <ButtonContainer>
                    <Button
                        onClick={handleClaimOngoingAirdrop}
                        disabled={!isClaimAvailable || isClaiming}
                        className="primary"
                    >
                        {isClaiming
                            ? t('options.earn.thales-staking.staking-rewards.claiming') +
                              ` ${formatCurrencyWithKey(THALES_CURRENCY, balance)}...`
                            : t('options.earn.thales-staking.staking-rewards.claim') +
                              ` ${formatCurrencyWithKey(THALES_CURRENCY, balance)}`}
                    </Button>
                    {ongoingAirdrop && ongoingAirdrop.isClaimPaused && (
                        <ClaimMessage>{t('options.earn.thales-staking.staking-rewards.paused-message')}</ClaimMessage>
                    )}
                    {ongoingAirdrop && !ongoingAirdrop.isClaimPaused && !ongoingAirdrop.hasClaimRights && (
                        <ClaimMessage>
                            {t('options.earn.thales-staking.staking-rewards.not-eligible-message')}
                        </ClaimMessage>
                    )}
                    {ongoingAirdrop &&
                        ongoingAirdrop.hasClaimRights &&
                        !ongoingAirdrop.isClaimPaused &&
                        ongoingAirdrop.claimed && (
                            <ClaimMessage>
                                {t('options.earn.thales-staking.staking-rewards.claimed-message')}
                            </ClaimMessage>
                        )}
                </ButtonContainer>
                <ValidationMessage
                    showValidation={txErrorMessage !== null}
                    message={txErrorMessage}
                    onDismiss={() => setTxErrorMessage(null)}
                />
            </SectionContentContainer>
        </EarnSection>
    );
};

const StakingRewardsAmountContainer = styled.div<{ gradient: string }>`
    position: relative;
    background: ${(props) => props.gradient};
    border-radius: 15px;
    margin-bottom: 20px;
`;

const StakingRewardsAmount = styled(FlexDivColumn)`
    position: relative;
    background: #04045a;
    margin: 2px;
    border-radius: 15px;
    padding: 15px;
    text-align: center;
`;

const StakingRewardsTitle = styled.span`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    padding-bottom: 10px;
`;

const StakingRewardsInfoTitle = styled.div`
    padding-top: 15px;
    font-size: 16px;
    line-height: 24px;
    flex: 1;
    width: 65%;
`;

const StakingRewardsInfoContent = styled.div`
    padding-top: 15px;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    width: 35%;
    text-align: end;
`;

export default StakingRewards;
