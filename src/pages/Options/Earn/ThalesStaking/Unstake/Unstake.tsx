import React, { useEffect, useMemo, useState } from 'react';
import { EarnSection, SectionContentContainer, SectionHeader } from '../../components';
import { Button, FlexDivCentered, FlexDivColumnCentered } from '../../../../../theme/common';
import TimeRemaining from '../../../components/TimeRemaining/TimeRemaining';
import ValidationMessage from '../../../../../components/ValidationMessage/ValidationMessage';
import { useTranslation } from 'react-i18next';
import snxJSConnector from '../../../../../utils/snxJSConnector';
import { gasPriceInWei, normalizeGasLimit } from '../../../../../utils/network';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/rootReducer';
import {
    getCustomGasPrice,
    getGasSpeed,
    getIsWalletConnected,
    getNetworkId,
    getWalletAddress,
} from '../../../../../redux/modules/wallet';
import useEthGasPriceQuery from '../../../../../queries/network/useEthGasPriceQuery';
import { Divider } from '../../../Market/components';
import NetworkFees from '../../../components/NetworkFees';
import styled from 'styled-components';
import useStakingThalesQuery from '../../../../../queries/staking/useStakingThalesQuery';
import { getIsAppReady } from '../../../../../redux/modules/app';

type Properties = {
    isUnstakingInContract: boolean;
    setIsUnstakingInContract: (isUnstaking: boolean) => void;
    thalesStaked: number;
    setThalesStaked: (staked: number) => void;
    thalesBalance: number;
    setThalesBalance: (staked: number) => void;
};
// 7 days - 7 * 24 * 60 * 60 * 1000
const addWeek = (date: Date) => {
    return new Date(date.getTime() + 60 * 60 * 1000);
};

const Unstake: React.FC<Properties> = ({
    isUnstakingInContract,
    setIsUnstakingInContract,
    thalesStaked,
    setThalesStaked,
    thalesBalance,
    setThalesBalance,
}) => {
    const { t } = useTranslation();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const gasSpeed = useSelector((state: RootState) => getGasSpeed(state));
    const customGasPrice = useSelector((state: RootState) => getCustomGasPrice(state));

    const stakingThalesQuery = useStakingThalesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
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

    const [isUnstaking, setIsUnstaking] = useState<boolean>(false);
    const [unstakeEndTime, setUnstakeEndTime] = useState<Date>(addWeek(new Date()));

    const unstakingEnded = useMemo(() => {
        return isUnstakingInContract && new Date() > unstakeEndTime;
    }, [isUnstakingInContract, unstakeEndTime]);

    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (stakingThalesQuery.isSuccess && stakingThalesQuery.data) {
            setIsUnstakingInContract(stakingThalesQuery.data.isUnstaking);
            setUnstakeEndTime(addWeek(new Date(stakingThalesQuery.data.lastUnstakeTime)));
        }
    }, [stakingThalesQuery.isSuccess]);

    useEffect(() => {
        const fetchGasLimit = async () => {
            try {
                const { stakingThalesContract } = snxJSConnector as any;
                const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
                const methodForGas = unstakingEnded ? 'unstake' : 'startUnstake';
                const gasEstimate = await stakingThalesContractWithSigner.estimateGas[methodForGas]();
                setGasLimit(normalizeGasLimit(Number(gasEstimate)));
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (isUnstaking) return;
        fetchGasLimit();
    }, [isUnstaking, walletAddress, unstakingEnded]);

    const handleStartUnstakingThales = async () => {
        const { stakingThalesContract } = snxJSConnector as any;

        if (gasPrice !== null) {
            try {
                setIsUnstaking(true);
                const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
                const tx = await stakingThalesContractWithSigner.startUnstake({
                    gasPrice: gasPriceInWei(gasPrice),
                    gasLimit,
                });
                const txResult = await tx.wait();

                if (txResult && txResult.events) {
                    const rawData = txResult.events[txResult.events?.length - 1];
                    if (rawData && rawData.decode) {
                        setIsUnstaking(false);
                        setIsUnstakingInContract(true);
                    }
                }
            } catch (e) {
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsUnstaking(false);
            }
        }
    };

    const handleUnstakeThales = async () => {
        const { stakingThalesContract } = snxJSConnector as any;

        if (gasPrice !== null) {
            try {
                setIsUnstaking(true);
                const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
                const tx = await stakingThalesContractWithSigner.unstake({
                    gasPrice: gasPriceInWei(gasPrice),
                    gasLimit,
                });
                const txResult = await tx.wait();

                if (txResult && txResult.events) {
                    const rawData = txResult.events[txResult.events?.length - 1];
                    if (rawData && rawData.decode) {
                        setIsUnstaking(false);
                        setIsUnstakingInContract(false);
                        setThalesBalance(thalesBalance + thalesStaked);
                        setThalesStaked(0);
                    }
                }
            } catch (e) {
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsUnstaking(false);
            }
        }
    };

    const getSubmitButton = () => {
        if (isUnstakingInContract) {
            return (
                <Button className="primary" onClick={handleUnstakeThales} disabled={!unstakingEnded || isUnstaking}>
                    {!isUnstaking
                        ? t('options.earn.thales-staking.unstake.unstake')
                        : t('options.earn.thales-staking.unstake.unstaking')}
                </Button>
            );
        }

        return (
            <Button className="primary" onClick={handleStartUnstakingThales} disabled={isUnstaking || !thalesStaked}>
                {!isUnstaking
                    ? t('options.earn.thales-staking.unstake.start-unstaking')
                    : t('options.earn.thales-staking.unstake.unstaking')}
            </Button>
        );
    };

    return (
        <EarnSection style={{ gridColumn: 'span 6' }}>
            <SectionHeader>{t('options.earn.thales-staking.unstake.unstake')}</SectionHeader>
            <SectionContentContainer style={{ flexDirection: 'column' }}>
                <FlexDivColumnCentered>
                    <UnstakingTitleText>
                        {!isUnstakingInContract ? (
                            t('options.earn.thales-staking.unstake.unlock-cooldown-text')
                        ) : (
                            <TimeRemaining end={unstakeEndTime} fontSize={18} />
                        )}
                    </UnstakingTitleText>
                </FlexDivColumnCentered>
                <Divider />
                <NetworkFees gasLimit={gasLimit} disabled={isUnstaking} />
                <FlexDivCentered>{getSubmitButton()}</FlexDivCentered>
                <ValidationMessage
                    showValidation={txErrorMessage !== null}
                    message={txErrorMessage}
                    onDismiss={() => setTxErrorMessage(null)}
                />
            </SectionContentContainer>
        </EarnSection>
    );
};

const UnstakingTitleText = styled.span`
    text-align: center;
`;

export default Unstake;
