import { useConnectModal } from '@rainbow-me/rainbowkit';
import Button from 'components/Button/Button';
import TimeRemaining from 'components/TimeRemaining/TimeRemaining';
import {
    getDefaultToastContent,
    getLoadingToastOptions,
    getSuccessToastOptions,
    getErrorToastOptions,
} from 'components/ToastMessage/ToastMessage';
import { THALES_CURRENCY } from 'constants/currency';
import { getMaxGasLimitForNetwork } from 'constants/options';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { ethers } from 'ethers';
import useStakingDataQuery from 'queries/token/useStakingDataQuery';
import useUserStakingDataQuery from 'queries/token/useUserStakingData';
import Tooltip from 'rc-tooltip';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled, { CSSProperties, useTheme } from 'styled-components';
import { StakingData, UserStakingData } from 'types/token';
import { ThemeInterface } from 'types/ui';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { refetchTokenQueries } from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';
import StakingSteps from './components/StakingSteps/StakingSteps';
import StakingOverview from './components/StakingOverview/StakingOverview';
import PointsBreakdown from './components/PointsBreakdown/PointsBreakdown';

const RewardsV2: React.FC = () => {
    const { t } = useTranslation();

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const { openConnectModal } = useConnectModal();

    const [isClaiming, setIsClaiming] = useState(false);
    const [isClosingPeriod, setIsClosingPeriod] = useState(false);
    const [lastValidStakingData, setLastValidStakingData] = useState<StakingData | undefined>(undefined);
    const [lastValidUserStakingData, setLastValidUserStakingData] = useState<UserStakingData | undefined>(undefined);

    const theme: ThemeInterface = useTheme();

    const stakingDataQuery = useStakingDataQuery(networkId, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (stakingDataQuery.isSuccess && stakingDataQuery.data) {
            setLastValidStakingData(stakingDataQuery.data);
        }
    }, [stakingDataQuery.isSuccess, stakingDataQuery.data]);

    const stakingData: StakingData | undefined = useMemo(() => {
        if (stakingData) {
            return stakingDataQuery.data;
        }
        return lastValidStakingData;
    }, [stakingDataQuery.isSuccess, stakingDataQuery.data, lastValidStakingData]);

    const userStakingDataQuery = useUserStakingDataQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (userStakingDataQuery.isSuccess && userStakingDataQuery.data) {
            setLastValidUserStakingData(userStakingDataQuery.data);
        }
    }, [userStakingDataQuery.isSuccess, userStakingDataQuery.data]);

    const userStakingData: UserStakingData | undefined = useMemo(() => {
        if (userStakingDataQuery.isSuccess && userStakingDataQuery.data) {
            return userStakingDataQuery.data;
        }
        return lastValidUserStakingData;
    }, [userStakingDataQuery.isSuccess, userStakingDataQuery.data, lastValidUserStakingData]);

    const { stakingThalesContract } = snxJSConnector as any;

    const isClaimAvailable =
        stakingData &&
        userStakingData &&
        userStakingData.hasClaimRights &&
        !userStakingData.claimed &&
        !stakingData.isPaused &&
        isWalletConnected &&
        !!stakingThalesContract &&
        !isClaiming &&
        !isClosingPeriod;

    const canClosePeriod = stakingData && stakingData.canClosePeriod;
    const isClosingPeriodAvailable = isWalletConnected && !!stakingThalesContract && !isClaiming && !isClosingPeriod;

    const handleClosePeriod = async () => {
        if (canClosePeriod) {
            const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());
            try {
                setIsClosingPeriod(true);
                const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
                const tx = (await stakingThalesContractWithSigner.closePeriod()) as ethers.ContractTransaction;
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(
                        id,
                        getSuccessToastOptions(
                            t('thales-token.gamified-staking.rewards.claim.close-period.confirmation-message'),
                            id
                        )
                    );
                    refetchTokenQueries(walletAddress, networkId);
                    setIsClosingPeriod(false);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
                setIsClosingPeriod(false);
            }
        }
    };

    const handleClaimStakingRewards = async () => {
        if (isClaimAvailable) {
            const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());
            try {
                setIsClaiming(true);
                const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
                const tx = (await stakingThalesContractWithSigner.claimReward({
                    gasLimit: getMaxGasLimitForNetwork(networkId),
                })) as ethers.ContractTransaction;
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(
                        id,
                        getSuccessToastOptions(
                            t('thales-token.gamified-staking.rewards.claim.confirmation-message'),
                            id
                        )
                    );
                    refetchTokenQueries(walletAddress, networkId);
                    setIsClaiming(false);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
                setIsClaiming(false);
            }
        }
    };

    const getClaimButton = () => {
        if (!isWalletConnected) {
            return (
                <ButtonWrapperTooltip>
                    <Button additionalStyles={ButtonStyle} onClick={openConnectModal}>
                        {t('common.wallet.connect-your-wallet')}
                    </Button>
                </ButtonWrapperTooltip>
            );
        }

        return (
            <Tooltip overlay={t('thales-token.gamified-staking.rewards.claim.button-tooltip')}>
                <ButtonWrapperTooltip>
                    <Button
                        additionalStyles={ButtonStyle}
                        disabled={!isClaimAvailable}
                        onClick={handleClaimStakingRewards}
                    >
                        {isClaiming
                            ? t('thales-token.gamified-staking.rewards.claim.claiming')
                            : t('thales-token.gamified-staking.rewards.claim.claim')}
                    </Button>
                </ButtonWrapperTooltip>
            </Tooltip>
        );
    };

    console.log('userStakingData: ', userStakingData);
    return (
        <Wrapper>
            <Header>
                <Div>
                    <Text>{t('thales-token.gamified-staking.rewards.section-description')}</Text>
                    <Text>{t('thales-token.gamified-staking.rewards.section-base-rewards')}</Text>
                    <Text>{t('thales-token.gamified-staking.rewards.section-bonus-rewards')}</Text>
                </Div>
                <Div>
                    <WrapperBorder>
                        <Label>{t('thales-token.gamified-staking.rewards.claim.period')}</Label>
                        <Value>
                            {stakingData ? (
                                <TimeRemaining
                                    end={stakingData?.closingDate}
                                    textColor={theme.textColor.quaternary}
                                    fontSize={22}
                                    showFullCounter
                                />
                            ) : (
                                '--:--'
                            )}
                        </Value>
                    </WrapperBorder>
                    <ClaimSection>
                        <FlexDiv>
                            <ColumnDiv>
                                <Label>{t('thales-token.gamified-staking.rewards.claim.your-rewards')}</Label>
                                <Value>
                                    {formatCurrencyWithKey(
                                        THALES_CURRENCY,
                                        userStakingData ? userStakingData.rewards : 0,
                                        2
                                    )}
                                </Value>
                            </ColumnDiv>
                            {canClosePeriod ? (
                                <ButtonWrapperTooltip>
                                    <Button
                                        additionalStyles={ButtonStyle}
                                        onClick={handleClosePeriod}
                                        disabled={!isClosingPeriodAvailable}
                                    >
                                        {isClosingPeriod
                                            ? t(
                                                  'thales-token.gamified-staking.rewards.claim.close-period.progress-label'
                                              )
                                            : t('thales-token.gamified-staking.rewards.claim.close-period.label')}
                                    </Button>
                                </ButtonWrapperTooltip>
                            ) : (
                                getClaimButton()
                            )}
                        </FlexDiv>
                        <Line />

                        <FlexDiv marginBottom={'12px'}>
                            <Label>{t('thales-token.gamified-staking.rewards.claim.gamified-rewards')}</Label>
                            <Value>
                                {formatCurrencyWithKey(
                                    THALES_CURRENCY,
                                    userStakingData ? userStakingData.totalBonus : 0,
                                    2
                                )}
                            </Value>
                        </FlexDiv>
                        <FlexDiv>
                            <Label>{t('thales-token.gamified-staking.rewards.claim.base-rewards')}</Label>
                            <Value>
                                {formatCurrencyWithKey(
                                    THALES_CURRENCY,
                                    userStakingData ? userStakingData.baseRewards : 0,
                                    2
                                )}
                            </Value>
                        </FlexDiv>
                    </ClaimSection>
                </Div>
            </Header>
            <StakingSteps />
            <StakingOverview />
            <PointsBreakdown />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
`;

const Header = styled.div`
    display: flex;
    justify-content: center;
    gap: 16px;
`;

const Div = styled.div`
    flex: 1;
`;

const WrapperBorder = styled.div`
    border: 1px solid ${(props) => props.theme.tokenPage.border.primary};
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 36px;
    padding: 0 50px;
    padding-left: 75px;
    margin-bottom: 6px;
`;

const ClaimSection = styled.div`
    border: 1px solid ${(props) => props.theme.tokenPage.border.primary};
    border-radius: 8px;
    min-height: 162px;
    padding: 0 20px;
    padding-top: 14px;
    padding-bottom: 20px;
`;

const ColumnDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 21px;
`;

const Line = styled.div`
    width: 100%;
    height: 0;
    border-top: 1px solid ${(props) => props.theme.background.tertiary};
    margin-top: 16px;
    margin-bottom: 20px;
`;

const Label = styled.span`
    font-weight: 700;
    font-size: 13px;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.primary};
    white-space: nowrap;
`;
const Value = styled.span`
    font-weight: 700;
    font-size: 22px;
    color: ${(props) => props.theme.textColor.quaternary};
`;

const Text = styled.p`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 13;
    font-weight: 400;
    line-height: 110%;
    margin-top: 16px;
`;

const FlexDiv = styled.div<{ marginBottom?: string }>`
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    margin-bottom: ${(props) => props.marginBottom ?? 0};
`;

const ButtonWrapperTooltip = styled.div`
    width: 70%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 100%;
    }
`;

const ButtonStyle: CSSProperties = {
    fontSize: 13,
    fontWeight: 700,
    height: 32,
};

export default RewardsV2;
