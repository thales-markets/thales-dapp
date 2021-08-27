import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'theme/common';
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
import useRetroAirdropQuery from 'queries/walletBalances/useRetroAirdropQuery';
import {
    ButtonContainer,
    ClaimContent,
    ClaimItem,
    ClaimMessage,
    ClaimTitle,
    EarnSection,
    SectionContentContainer,
    SectionHeader,
} from '../../components';
import { gasPriceInWei, normalizeGasLimit } from 'utils/network';
import { refetchRetroAirdrop } from 'utils/queryConnector';
import { ethers } from 'ethers';
import { Airdrop } from 'types/token';
import { THALES_CURRENCY } from 'constants/currency';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import NetworkFees from 'pages/Options/components/NetworkFees';
import { Divider } from 'pages/Options/Market/components';

const RetroAirdrop: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const gasSpeed = useSelector((state: RootState) => getGasSpeed(state));
    const customGasPrice = useSelector((state: RootState) => getCustomGasPrice(state));
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [retroAirdrop, setRetroAirdrop] = useState<Airdrop | undefined>(undefined);
    const [isClaiming, setIsClaiming] = useState(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);

    const isClaimAvailable =
        retroAirdrop && retroAirdrop.accountInfo && retroAirdrop.hasClaimRights && !retroAirdrop.claimed;

    const airdropQuery = useRetroAirdropQuery(walletAddress, networkId, {
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

    useEffect(() => {
        if (airdropQuery.isSuccess && airdropQuery.data) {
            setRetroAirdrop(airdropQuery.data);
        }
    }, [airdropQuery.isSuccess, airdropQuery.data]);

    useEffect(() => {
        const fetchGasLimit = async () => {
            if (retroAirdrop && retroAirdrop.accountInfo) {
                const { retroAirdropContract } = snxJSConnector as any;
                try {
                    const retroAirdropContractWithSigner = retroAirdropContract.connect((snxJSConnector as any).signer);
                    const gasEstimate = await retroAirdropContractWithSigner.estimateGas.claim(
                        retroAirdrop.accountInfo.index,
                        retroAirdrop.accountInfo.rawBalance,
                        retroAirdrop.accountInfo.proof
                    );
                    setGasLimit(normalizeGasLimit(Number(gasEstimate)));
                } catch (e) {
                    console.log(e);
                    setGasLimit(null);
                }
            }
        };
        if (!isWalletConnected || !isClaimAvailable) return;
        fetchGasLimit();
    }, [isWalletConnected, isClaimAvailable]);

    const handleClaimRetroAirdrop = async () => {
        if (isClaimAvailable && retroAirdrop && retroAirdrop.accountInfo && gasPrice !== null) {
            const { retroAirdropContract } = snxJSConnector as any;

            try {
                setIsClaiming(true);
                const airdropContractWithSigner = retroAirdropContract.connect((snxJSConnector as any).signer);
                const tx = (await airdropContractWithSigner.claim(
                    retroAirdrop.accountInfo.index,
                    retroAirdrop.accountInfo.rawBalance,
                    retroAirdrop.accountInfo.proof,
                    {
                        gasPrice: gasPriceInWei(gasPrice),
                        gasLimit,
                    }
                )) as ethers.ContractTransaction;
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    refetchRetroAirdrop(walletAddress, networkId);
                    setRetroAirdrop({
                        ...retroAirdrop,
                        claimed: true,
                    });
                    setIsClaiming(false);
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsClaiming(false);
            }
        }
    };
    return (
        <EarnSection style={{ gridColumn: 'span 4' }}>
            <SectionHeader>{t('options.earn.snx-stakers.retro-airdrop.title')}</SectionHeader>
            <SectionContentContainer>
                <ClaimItem>
                    <ClaimTitle>{t('options.earn.snx-stakers.amount-to-claim')}:</ClaimTitle>
                    <ClaimContent>
                        {formatCurrencyWithKey(
                            THALES_CURRENCY,
                            isClaimAvailable && retroAirdrop && retroAirdrop.accountInfo
                                ? retroAirdrop.accountInfo.balance
                                : 0
                        )}
                    </ClaimContent>
                </ClaimItem>
                <Divider />
                <NetworkFees gasLimit={gasLimit} disabled={isClaiming} />
                <ButtonContainer>
                    <Button
                        onClick={handleClaimRetroAirdrop}
                        disabled={!isClaimAvailable || isClaiming}
                        className="primary"
                    >
                        {isClaiming ? t('options.earn.snx-stakers.claiming') : t('options.earn.snx-stakers.claim')}
                    </Button>
                    {retroAirdrop && !retroAirdrop.hasClaimRights && (
                        <ClaimMessage>{t('options.earn.snx-stakers.retro-airdrop.not-eligible-message')}</ClaimMessage>
                    )}
                    {retroAirdrop && retroAirdrop.hasClaimRights && retroAirdrop.claimed && (
                        <ClaimMessage>{t('options.earn.snx-stakers.retro-airdrop.claimed-message')}</ClaimMessage>
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

export default RetroAirdrop;
