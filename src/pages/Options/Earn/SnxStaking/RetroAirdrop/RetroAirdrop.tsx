import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, GradientText } from 'theme/common';
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
    ButtonContainerBottom,
    ClaimItem,
    ClaimMessage,
    ClaimTitle,
    EarnSection,
    SectionContentContainer,
    SectionHeader,
    StyledMaterialTooltip,
    TooltipLink,
    StyledInfoIcon,
} from '../../components';
import { gasPriceInWei, normalizeGasLimit } from 'utils/network';
import { refetchRetroAirdrop, refetchUserTokenTransactions } from 'utils/queryConnector';
import { ethers } from 'ethers';
import { Airdrop } from 'types/token';
import { THALES_CURRENCY } from 'constants/currency';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import useEthGasPriceQuery from 'queries/network/useEthGasPriceQuery';
import NetworkFees from 'pages/Options/components/NetworkFees';
import { Quiz } from 'components/Quiz/Quiz';
import { QuizQuestion } from 'components/Quiz/QuizQuestion';
import { airdropClaimQuizQuestions } from 'i18n/quizQuestions';
import { dispatchMarketNotification } from 'utils/options';
import { LINKS } from 'constants/links';

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
    const [openQuiz, setOpenQuiz] = useState(false);
    const quizData: QuizQuestion[] = airdropClaimQuizQuestions;

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
                setTxErrorMessage(null);
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
                    dispatchMarketNotification(t('options.earn.snx-stakers.confirmation-message'));
                    refetchRetroAirdrop(walletAddress, networkId);
                    refetchUserTokenTransactions(walletAddress, networkId);
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

    const quizCompleted = localStorage.getItem('quizCompleted') === 'true';

    const startQuiz = () => {
        setOpenQuiz(true);
    };

    const getClaimButton = () => {
        if (quizCompleted || !isClaimAvailable) {
            return (
                <Button
                    onClick={handleClaimRetroAirdrop}
                    disabled={!isClaimAvailable || isClaiming}
                    className="primary"
                >
                    {isClaiming
                        ? t('options.earn.snx-stakers.claiming')
                        : t('options.earn.snx-stakers.claim') +
                          ` ${formatCurrencyWithKey(
                              THALES_CURRENCY,
                              retroAirdrop?.accountInfo?.balance || 0,
                              0,
                              true
                          )}`}
                </Button>
            );
        } else {
            return (
                <Button onClick={startQuiz} disabled={!isClaimAvailable || isClaiming} className="primary">
                    {t('options.earn.snx-stakers.start-quiz')}
                </Button>
            );
        }
    };

    return (
        <EarnSection style={{ gridColumn: 'span 4' }}>
            <SectionHeader>
                <div>
                    {t('options.earn.snx-stakers.retro-airdrop.title')}
                    <StyledMaterialTooltip
                        arrow={true}
                        title={
                            <Trans
                                i18nKey="options.earn.snx-stakers.retro-airdrop.info-tooltip"
                                components={[<div key="1" />, <span key="3" />, <EligibilityLink key="2" />]}
                            />
                        }
                        interactive
                    >
                        <StyledInfoIcon />
                    </StyledMaterialTooltip>
                </div>
            </SectionHeader>
            <SectionContentContainer>
                <ClaimItem style={{ marginBottom: 0, marginTop: 30 }}>
                    <ClaimTitle>{t('options.earn.snx-stakers.airdropped-amount')}:</ClaimTitle>
                    <GradientText
                        gradient="linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb)"
                        fontSize={31}
                        fontWeight={600}
                    >
                        {formatCurrencyWithKey(THALES_CURRENCY, retroAirdrop?.accountInfo?.balance || 0, 0, true)}
                    </GradientText>
                </ClaimItem>
                <ClaimItem style={{ marginBottom: 0 }}>
                    <ClaimTitle style={{ paddingBottom: 0 }}>
                        {t('options.earn.snx-stakers.retro-airdrop.claim-end-label')}
                    </ClaimTitle>
                </ClaimItem>
                {isClaimAvailable && <NetworkFees gasLimit={gasLimit} disabled={isClaiming} />}
                <ButtonContainerBottom>
                    {getClaimButton()}
                    {retroAirdrop && !retroAirdrop.hasClaimRights && (
                        <ClaimMessage>{t('options.earn.snx-stakers.retro-airdrop.not-eligible-message')}</ClaimMessage>
                    )}
                    {retroAirdrop && retroAirdrop.hasClaimRights && (
                        <ClaimMessage>
                            {quizCompleted && isClaimAvailable
                                ? t('options.earn.snx-stakers.retro-airdrop.completed-quiz')
                                : !quizCompleted && isClaimAvailable
                                ? t('options.earn.snx-stakers.retro-airdrop.complete-quiz-to-claim')
                                : quizCompleted && !isClaimAvailable
                                ? t('options.earn.snx-stakers.retro-airdrop.claimed-message')
                                : t('options.earn.snx-stakers.retro-airdrop.not-eligible-message')}
                        </ClaimMessage>
                    )}
                </ButtonContainerBottom>
                <ValidationMessage
                    showValidation={txErrorMessage !== null}
                    message={txErrorMessage}
                    onDismiss={() => setTxErrorMessage(null)}
                />
            </SectionContentContainer>
            <Quiz quizData={quizData} openQuiz={openQuiz} setOpenQuiz={setOpenQuiz}></Quiz>
        </EarnSection>
    );
};

const EligibilityLink: React.FC = () => (
    <TooltipLink target="_blank" rel="noreferrer" href={LINKS.Token.RetroAirdropEligibilitySheet}>
        sheet
    </TooltipLink>
);

export default RetroAirdrop;
