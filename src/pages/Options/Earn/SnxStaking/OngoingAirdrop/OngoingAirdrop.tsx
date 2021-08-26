import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, FlexDiv } from 'theme/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import snxJSConnector from 'utils/snxJSConnector';
import ValidationMessage from 'components/ValidationMessage/ValidationMessage';
import useOngoingAirdropQuery from 'queries/walletBalances/useOngoingAirdropQuery';
import { ethers } from 'ethers';
import { Airdrop } from 'types/token';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { THALES_CURRENCY } from 'constants/currency';
import { refetchOngoingAirdrop } from 'utils/queryConnector';
import {
    ClaimDiv,
    ClaimTitle,
    EarnSection,
    SectionContent,
    SectionHeader,
    ValidationMessageConatiner,
} from '../../components';
import { normalizeGasLimit } from 'utils/network';

const OngoingAirdrop: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [ongoingAirdrop, setOngoingAirdrop] = useState<Airdrop | undefined>(undefined);
    const [isClaiming, setIsClaiming] = useState(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);

    const isClaimAvailable =
        ongoingAirdrop &&
        ongoingAirdrop.accountInfo &&
        ongoingAirdrop.hasClaimRights &&
        !ongoingAirdrop.claimed &&
        !ongoingAirdrop.isClaimPaused;

    const ongoingAirdropQuery = useOngoingAirdropQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (ongoingAirdropQuery.isSuccess && ongoingAirdropQuery.data) {
            setOngoingAirdrop(ongoingAirdropQuery.data);
        }
    }, [ongoingAirdropQuery.isSuccess, ongoingAirdropQuery.data]);

    useEffect(() => {
        const fetchGasLimit = async () => {
            if (ongoingAirdrop && ongoingAirdrop.accountInfo) {
                const { ongoingAirdropContract } = snxJSConnector as any;
                try {
                    const ongoingAirdropContractWithSigner = ongoingAirdropContract.connect(
                        (snxJSConnector as any).signer
                    );
                    const gasEstimate = await ongoingAirdropContractWithSigner.estimateGas.claim(
                        ongoingAirdrop.accountInfo.index,
                        ongoingAirdrop.accountInfo.rawBalance,
                        ongoingAirdrop.accountInfo.proof
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

    const handleClaimOngoingAirdrop = async () => {
        if (isClaimAvailable && ongoingAirdrop && ongoingAirdrop.accountInfo) {
            const { ongoingAirdropContract } = snxJSConnector as any;

            try {
                setIsClaiming(true);
                const ongoingAirdropContractWithSigner = ongoingAirdropContract.connect((snxJSConnector as any).signer);
                const tx = (await ongoingAirdropContractWithSigner.claim(
                    ongoingAirdrop.accountInfo.index,
                    ongoingAirdrop.accountInfo.rawBalance,
                    ongoingAirdrop.accountInfo.proof,
                    {
                        // gasPrice: gasPriceInWei(gasPrice),
                        gasLimit,
                    }
                )) as ethers.ContractTransaction;
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    refetchOngoingAirdrop(walletAddress, networkId);
                    setOngoingAirdrop({
                        ...ongoingAirdrop,
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
        <EarnSection>
            <SectionHeader>{t('options.earn.snx-stakers.ongoing-airdrop.title')}</SectionHeader>
            <SectionContent>
                <ClaimDiv>
                    <ClaimTitle>{t('options.earn.snx-stakers.amount-to-claim')}:</ClaimTitle>
                    <span>
                        {isClaimAvailable && ongoingAirdrop && ongoingAirdrop.accountInfo
                            ? formatCurrencyWithKey(THALES_CURRENCY, ongoingAirdrop.accountInfo.balance)
                            : 0}
                    </span>
                </ClaimDiv>
                <FlexDiv>
                    <Button
                        onClick={handleClaimOngoingAirdrop}
                        disabled={!isClaimAvailable || isClaiming}
                        className="primary"
                    >
                        {isClaiming ? t('options.earn.snx-stakers.claiming') : t('options.earn.snx-stakers.claim')}
                    </Button>
                </FlexDiv>
            </SectionContent>
            <ValidationMessageConatiner>
                <ValidationMessage
                    showValidation={txErrorMessage !== null}
                    message={txErrorMessage}
                    onDismiss={() => setTxErrorMessage(null)}
                />
            </ValidationMessageConatiner>
        </EarnSection>
    );
};

export default OngoingAirdrop;
