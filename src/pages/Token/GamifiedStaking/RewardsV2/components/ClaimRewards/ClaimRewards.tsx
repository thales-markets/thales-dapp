import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components';

import TimeRemaining from 'components/TimeRemaining/TimeRemaining';
import Button from 'components/Button/Button';

import { THALES_CURRENCY, USD_SIGN } from 'constants/currency';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { formatCurrencyWithKey } from 'thales-utils';
import { useTranslation } from 'react-i18next';
import useStakingDataQuery from 'queries/token/useStakingDataQuery';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import { StakingData, UserStakingData } from 'types/token';
import { ThemeInterface } from 'types/ui';
import snxJSConnector from 'utils/snxJSConnector';
import useUserStakingDataQuery from 'queries/token/useUserStakingData';
import {
    getDefaultToastContent,
    getErrorToastOptions,
    getLoadingToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { refetchTokenQueries } from 'utils/queryConnector';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const ClaimRewards: React.FC = () => {
    const { t } = useTranslation();

    const [isClaiming, setIsClaiming] = useState(false);
    const [isClosingPeriod, setIsClosingPeriod] = useState(false);
    const [lastValidStakingData, setLastValidStakingData] = useState<StakingData | undefined>(undefined);
    const [lastValidUserStakingData, setLastValidUserStakingData] = useState<UserStakingData | undefined>(undefined);

    const theme: ThemeInterface = useTheme();
    const { openConnectModal } = useConnectModal();

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

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
    }, [stakingDataQuery.data, lastValidStakingData]);

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

    const isClaimed = stakingData && userStakingData && !stakingData.isPaused && userStakingData.claimed;
    const isPaused = stakingData && stakingData.isPaused;

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
                const tx = (await stakingThalesContractWithSigner.claimReward()) as ethers.ContractTransaction;
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
                <Button additionalStyles={ButtonStyle} onClick={openConnectModal}>
                    {t('common.wallet.connect-your-wallet')}
                </Button>
            );
        }

        if (isClaimed) {
            return (
                <Button additionalStyles={ButtonStyle} disabled={true}>
                    {t('thales-token.gamified-staking.rewards.claim.claim')}
                </Button>
            );
        }

        if (isPaused) {
            return (
                <Button additionalStyles={ButtonStyle} disabled={true}>
                    {t('thales-token.gamified-staking.rewards.claim.claim')}
                </Button>
            );
        }

        return (
            <Button additionalStyles={ButtonStyle} disabled={!isClaimAvailable} onClick={handleClaimStakingRewards}>
                {isClaiming
                    ? t('thales-token.gamified-staking.rewards.claim.claiming')
                    : t('thales-token.gamified-staking.rewards.claim.claim')}
            </Button>
        );
    };

    const getClaimMessage = () => {
        if (isClaimed)
            return <ClaimMessage>{t('thales-token.gamified-staking.rewards.claim.claimed-message')}</ClaimMessage>;
        if (isPaused)
            return <ClaimMessage>{t('thales-token.gamified-staking.rewards.claim.paused-message')}</ClaimMessage>;
    };

    return (
        <>
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
                            {formatCurrencyWithKey(THALES_CURRENCY, userStakingData ? userStakingData.rewards : 0, 2)} +{' '}
                            {formatCurrencyWithKey(USD_SIGN, userStakingData ? userStakingData.feeRewards : 0)}
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
                                    ? t('thales-token.gamified-staking.rewards.claim.close-period.progress-label')
                                    : t('thales-token.gamified-staking.rewards.claim.close-period.label')}
                            </Button>
                        </ButtonWrapperTooltip>
                    ) : (
                        getClaimButton()
                    )}
                </FlexDiv>
                <Line />
                {getClaimMessage()}
                {!isClaimed && !isPaused && (
                    <>
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
                        <FlexDiv marginBottom={'12px'}>
                            <Label>{t('thales-token.gamified-staking.rewards.claim.base-rewards')}</Label>
                            <Value>
                                {formatCurrencyWithKey(
                                    THALES_CURRENCY,
                                    userStakingData ? userStakingData.baseRewards : 0,
                                    2
                                )}
                            </Value>
                        </FlexDiv>
                        <FlexDiv>
                            <Label>{t('thales-token.gamified-staking.rewards.claim.fee-rewards')}</Label>
                            <Value>
                                {formatCurrencyWithKey(USD_SIGN, userStakingData ? userStakingData.feeRewards : 0)}
                            </Value>
                        </FlexDiv>
                    </>
                )}
            </ClaimSection>
        </>
    );
};

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
    padding: 0 20px;
    padding-top: 14px;
    padding-bottom: 20px;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 12px 10px;
    }
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
    text-transform: capitalize;
    color: ${(props) => props.theme.textColor.primary};
    white-space: nowrap;
`;
const Value = styled.span`
    font-weight: 700;
    font-size: 22px;
    color: ${(props) => props.theme.textColor.quaternary};
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 18px;
    }
`;

const FlexDiv = styled.div<{ marginBottom?: string }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
    margin-bottom: ${(props) => props.marginBottom ?? 0};
`;

const ButtonWrapperTooltip = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 50%;
    }
`;

const ButtonStyle: CSSProperties = {
    fontSize: '13px',
    fontWeight: 700,
    height: 32,
};

const ClaimMessage = styled.span`
    display: flex;
    margin-bottom: 10px;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    @media (max-width: 512px) {
        font-size: 20px;
    }
    white-space: pre-wrap;
    line-height: 110%;
    text-transform: uppercase;
    color: ${(props) => props.theme.warning.textColor.primary};
    width: 100%;
    text-align: center;
    padding: 10px 0;
`;

export default ClaimRewards;
