import React, { useEffect, useState } from 'react';
import { ButtonContainer, EarnSection, SectionHeader } from '../../components';
import { useTranslation } from 'react-i18next';
import { StakingRewardsLabel } from '../../gridComponents';
import { FlexDivCentered } from '../../../../../theme/common';
import styled from 'styled-components';
import NetworkFees from '../../../components/NetworkFees';
import { DefaultSubmitButton } from '../../../Market/components';
import onboardConnector from '../../../../../utils/onboardConnector';
import { formatCurrencyWithKey } from '../../../../../utils/formatters/number';
import { THALES_CURRENCY } from '../../../../../constants/currency';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from '../../../../../redux/modules/wallet';
import { formatGasLimit } from '../../../../../utils/network';
import snxJSConnector from '../../../../../utils/snxJSConnector';
import { MAX_L2_GAS_LIMIT } from '../../../../../constants/options';
import { ethers } from 'ethers';
import { dispatchMarketNotification } from '../../../../../utils/options';
import { refetchLPStakingQuery } from '../../../../../utils/queryConnector';
import ValidationMessage from '../../../../../components/ValidationMessage/ValidationMessage';

type Properties = {
    rewards: number;
};

const Rewards: React.FC<Properties> = ({ rewards }) => {
    const { t } = useTranslation();

    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const [isClaiming, setIsClaiming] = useState(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);

    const { lpStakingRewardsContract } = snxJSConnector as any;

    const handleClaimStakingRewards = async () => {
        if (rewards) {
            try {
                setTxErrorMessage(null);
                setIsClaiming(true);
                const lpStakingRewardsContractWithSigner = lpStakingRewardsContract.connect(
                    (snxJSConnector as any).signer
                );
                const tx = (await lpStakingRewardsContractWithSigner.getRewar({
                    gasLimit: MAX_L2_GAS_LIMIT,
                })) as ethers.ContractTransaction;
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    dispatchMarketNotification(t('options.earn.lp-staking.rewards.claimed'));
                    refetchLPStakingQuery(walletAddress, networkId);
                    setIsClaiming(false);
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsClaiming(false);
            }
        }
    };

    const getClaimButton = () => {
        if (!isWalletConnected) {
            return (
                <DefaultSubmitButton onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </DefaultSubmitButton>
            );
        }

        return (
            <DefaultSubmitButton onClick={handleClaimStakingRewards} disabled={!rewards}>
                {isClaiming
                    ? t('options.earn.lp-staking.rewards.claiming') +
                      ` ${formatCurrencyWithKey(THALES_CURRENCY, rewards)}...`
                    : t('options.earn.lp-staking.rewards.claim') +
                      ` ${formatCurrencyWithKey(THALES_CURRENCY, rewards)}`}
            </DefaultSubmitButton>
        );
    };

    useEffect(() => {
        const fetchGasLimit = async () => {
            try {
                const lpStakingRewardsContractWithSigner = lpStakingRewardsContract.connect(
                    (snxJSConnector as any).signer
                );
                const gasEstimate = await lpStakingRewardsContractWithSigner.estimateGas.getReward();
                setGasLimit(formatGasLimit(gasEstimate, networkId));
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (!isWalletConnected || !rewards) return;
        fetchGasLimit();
    }, [isWalletConnected, rewards]);

    return (
        <EarnSection
            spanOnTablet={5}
            orderOnMobile={4}
            orderOnTablet={4}
            style={{ gridColumn: 'span 5', gridRow: 'span 2', padding: 0, border: '0', background: 'transparent' }}
        >
            <SectionHeader>{t('options.earn.lp-staking.rewards.title')}</SectionHeader>
            <EarnSection
                spanOnTablet={5}
                orderOnMobile={4}
                orderOnTablet={4}
                style={{
                    padding: 0,
                    gridColumn: 'span 5',
                    gridRow: 'span 2',
                }}
            >
                <LabelContainer>
                    <StakingRewardsLabel color="#FA8A6B">
                        {t('options.earn.lp-staking.rewards.lp-staking')}
                    </StakingRewardsLabel>
                    <Amount>{Math.round(rewards * 100) / 100} THALES</Amount>
                </LabelContainer>
                <NetworkContainer>
                    <NetworkFees gasLimit={gasLimit} />
                </NetworkContainer>
                <ButtonContainer style={{ paddingBottom: '10px' }}>
                    {getClaimButton()}
                    <ValidationMessage
                        showValidation={txErrorMessage !== null}
                        message={txErrorMessage}
                        onDismiss={() => setTxErrorMessage(null)}
                    />
                </ButtonContainer>
            </EarnSection>
        </EarnSection>
    );
};

const Amount = styled(FlexDivCentered)`
    font-family: Titillium Web;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 32px;
    letter-spacing: 0.5px;
    color: #ffffff;
    border-bottom: 1px solid rgba(100, 217, 254, 0.6);
    padding-bottom: 10px;
`;

const LabelContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 10px;
`;

const NetworkContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px;
`;

export default Rewards;
