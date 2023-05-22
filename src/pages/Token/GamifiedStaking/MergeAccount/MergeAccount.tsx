import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FlexDiv, FlexDivColumnCentered, FlexDivCentered, FlexDivRow } from 'theme/common';
import { Input, InputContainer } from 'pages/Token/components/components';
import FieldValidationMessage from 'components/FieldValidationMessage';
import { getAddress, isAddress } from 'ethers/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import ValidationMessage from 'components/ValidationMessage';
import snxJSConnector from 'utils/snxJSConnector';
import { dispatchMarketNotification } from 'utils/options';
import { getIsAppReady } from 'redux/modules/app';
import { ArrowContainer } from 'pages/Token/Migration/components';
import { ReactComponent as ArrowDown } from 'assets/images/arrow-down-blue.svg';
import YourTransactions from './Transactions';
import NetworkFees from 'pages/Token/components/NetworkFees';
import { formatGasLimit, getL1FeeInWei, getIsOVM } from 'utils/network';
import { ZERO_ADDRESS } from 'constants/network';
import useUserTokenTransactionsQuery from 'queries/token/useUserTokenTransactionsQuery';
import { orderBy } from 'lodash';
import { TransactionFilterEnum } from 'types/token';
import { ReactComponent as ArrowHyperlinkIcon } from 'assets/images/arrow-hyperlink.svg';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { getMaxGasLimitForNetwork } from 'constants/options';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import useUserStakingDataQuery from 'queries/token/useUserStakingData';
import Button from 'components/ButtonV2/Button';

const MergeAccount: React.FC = () => {
    const { t } = useTranslation();
    const { openConnectModal } = useConnectModal();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '-';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [destAddress, setDestAddress] = useState<string>('');
    const [delegateDestAddress, setDelegateDestAddress] = useState<string>('');
    const [isMerging, setIsMerging] = useState<boolean>(false);
    const [isDelegating, setIsDelegating] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const { stakingThalesContract } = snxJSConnector as any;
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [l1Fee, setL1Fee] = useState<number | null>(null);

    const isDestAddressEntered = destAddress !== undefined && destAddress.trim() !== '';
    const isDestAddressValid =
        !isWalletConnected ||
        destAddress === undefined ||
        destAddress.trim() === '' ||
        (isAddress(walletAddress) && isAddress(destAddress) && getAddress(walletAddress) !== getAddress(destAddress));

    const isDelegateDestAddressEntered = delegateDestAddress !== undefined && delegateDestAddress.trim() !== '';
    const isDelegateDestAddressValid =
        !isWalletConnected ||
        delegateDestAddress === undefined ||
        delegateDestAddress.trim() === '' ||
        (isAddress(walletAddress) &&
            isAddress(delegateDestAddress) &&
            getAddress(walletAddress) !== getAddress(delegateDestAddress));

    const srcStakingThalesQuery = useUserStakingDataQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const destStakingThalesQuery = useUserStakingDataQuery(destAddress, networkId, {
        enabled: isAppReady && isDestAddressValid,
    });

    const userTokenTransactionsQuery = useUserTokenTransactionsQuery(
        undefined,
        networkId,
        '[delegateVolume, removeDelegation]',
        {
            enabled: isAppReady && isWalletConnected,
        }
    );

    const userTokenTransactions = useMemo(
        () =>
            userTokenTransactionsQuery.isSuccess && userTokenTransactionsQuery.data
                ? orderBy(userTokenTransactionsQuery.data, ['timestamp', 'blockNumber'], ['asc', 'asc'])
                : [],
        [userTokenTransactionsQuery.data]
    );

    const addressesThatDelegateToYou = useMemo(() => {
        const map = {} as Record<string, boolean>;
        userTokenTransactions.forEach((tx) => {
            if (tx.destAccount?.toUpperCase() === walletAddress.toUpperCase()) {
                map[tx.account] = true;
            }

            if (tx.type === TransactionFilterEnum.REMOVE_DELEGATION) {
                delete map[tx.account];
            }
        });
        return Object.keys(map);
    }, [userTokenTransactions, walletAddress]);

    const isAccountMergingEnabled =
        srcStakingThalesQuery.isSuccess && srcStakingThalesQuery.data
            ? srcStakingThalesQuery.data.mergeAccountEnabled
            : true;

    const hasSrcAccountSomethingToClaim =
        srcStakingThalesQuery.isSuccess && srcStakingThalesQuery.data ? srcStakingThalesQuery.data.rewards > 0 : false;
    const isSrcAccountUnstaking =
        srcStakingThalesQuery.isSuccess && srcStakingThalesQuery.data
            ? srcStakingThalesQuery.data.unstakingAmount > 0
            : false;
    const hasDestAccountSomethingToClaim =
        srcStakingThalesQuery.isSuccess && destStakingThalesQuery.data
            ? destStakingThalesQuery.data.rewards > 0
            : false;
    const isDestAccountUnstaking =
        destStakingThalesQuery.isSuccess && destStakingThalesQuery.data
            ? destStakingThalesQuery.data.unstakingAmount > 0
            : false;

    const delegatedVolumeAddress =
        srcStakingThalesQuery.isSuccess && srcStakingThalesQuery.data
            ? srcStakingThalesQuery.data.delegatedVolume
            : ZERO_ADDRESS;

    const isMergeBlocked =
        isAccountMergingEnabled &&
        (hasSrcAccountSomethingToClaim ||
            isSrcAccountUnstaking ||
            hasDestAccountSomethingToClaim ||
            isDestAccountUnstaking);

    const isButtonDisabled =
        isMerging ||
        !isDestAddressEntered ||
        !isDestAddressValid ||
        !isWalletConnected ||
        !isAccountMergingEnabled ||
        isMergeBlocked;

    const isDelegateButtonDisabled =
        isDelegating || !isDelegateDestAddressEntered || !isDelegateDestAddressValid || !isWalletConnected;

    const isL2 = getIsOVM(networkId);

    useEffect(() => {
        const fetchL1Fee = async (stakingThalesContractWithSigner: any) => {
            const txRequest = await stakingThalesContractWithSigner.populateTransaction.delegateVolume(
                getAddress(ZERO_ADDRESS)
            );
            return getL1FeeInWei(txRequest, snxJSConnector);
        };

        const fetchGasLimit = async () => {
            try {
                const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);
                if (isL2) {
                    const [gasEstimate, l1FeeInWei] = await Promise.all([
                        stakingThalesContractWithSigner.estimateGas.delegateVolume(getAddress(ZERO_ADDRESS)),
                        fetchL1Fee(stakingThalesContractWithSigner),
                    ]);
                    setGasLimit(formatGasLimit(gasEstimate, networkId));
                    setL1Fee(l1FeeInWei);
                } else {
                    const gasEstimate = await stakingThalesContractWithSigner.estimateGas.delegateVolume(
                        getAddress(ZERO_ADDRESS)
                    );
                    setGasLimit(formatGasLimit(gasEstimate, networkId));
                }
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };

        fetchGasLimit();
    }, [walletAddress]);

    const handleMerge = async () => {
        try {
            setTxErrorMessage(null);
            setIsMerging(true);

            const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);

            const tx = await stakingThalesContractWithSigner.mergeAccount(getAddress(destAddress), {
                gasLimit: getMaxGasLimitForNetwork(networkId),
            });
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                dispatchMarketNotification(t('options.earn.gamified-staking.merge-account.confirmation-message'));
                setDestAddress('');
                setIsMerging(false);
            }
        } catch (e) {
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsMerging(false);
        }
    };

    const handleDelegate = async () => {
        try {
            setTxErrorMessage(null);
            setIsDelegating(true);

            const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);

            const tx = await stakingThalesContractWithSigner.delegateVolume(
                getAddress(delegatedVolumeAddress !== ZERO_ADDRESS ? ZERO_ADDRESS : delegateDestAddress),
                {
                    gasLimit: getMaxGasLimitForNetwork(networkId),
                }
            );
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                dispatchMarketNotification(
                    t('options.earn.gamified-staking.merge-account.delegation-confirmation-message')
                );
                setDelegateDestAddress('');
                setIsDelegating(false);
            }
        } catch (e) {
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsDelegating(false);
        }
    };

    const getMergeButton = () => {
        if (!isWalletConnected) {
            return <Button onClick={openConnectModal}>{t('common.wallet.connect-your-wallet')}</Button>;
        }
        if (!isDestAddressValid && isAccountMergingEnabled && !isMergeBlocked) {
            return <Button disabled={true}>{t(`common.errors.invalid-address`)}</Button>;
        }
        if (!isDestAddressEntered && isAccountMergingEnabled && !isMergeBlocked) {
            return <Button disabled={true}>{t(`common.errors.enter-address`)}</Button>;
        }
        return (
            <Button disabled={isButtonDisabled} onClick={handleMerge}>
                {!isMerging
                    ? t('options.earn.gamified-staking.merge-account.merge-button.label')
                    : t('options.earn.gamified-staking.merge-account.merge-button.progress-label')}
            </Button>
        );
    };

    const getDelegateButton = () => {
        if (!isWalletConnected) {
            return <Button onClick={openConnectModal}>{t('common.wallet.connect-your-wallet')}</Button>;
        }

        if (delegatedVolumeAddress !== ZERO_ADDRESS) {
            return (
                <Button onClick={handleDelegate}>
                    {t(`options.earn.gamified-staking.merge-account.delegate-button.remove-delegation`)}
                </Button>
            );
        }

        if (!isDelegateDestAddressValid) {
            return <Button disabled={true}>{t(`common.errors.invalid-address`)}</Button>;
        }
        if (!isDelegateDestAddressEntered) {
            return <Button disabled={true}>{t(`common.errors.enter-address`)}</Button>;
        }

        return (
            <Button disabled={isDelegateButtonDisabled} onClick={handleDelegate}>
                {!isDelegating
                    ? t('options.earn.gamified-staking.merge-account.delegate-button.label')
                    : t('options.earn.gamified-staking.merge-account.delegate-button.progress-label')}
            </Button>
        );
    };

    const getBlockedMergeMessage = () => {
        return (
            <>
                <div>{t('options.earn.gamified-staking.merge-account.merge-blocked-message.title')}:</div>
                <ul>
                    {hasSrcAccountSomethingToClaim && (
                        <li>{t('options.earn.gamified-staking.merge-account.merge-blocked-message.src-claim')}</li>
                    )}
                    {isSrcAccountUnstaking && (
                        <li>{t('options.earn.gamified-staking.merge-account.merge-blocked-message.src-unstaking')}</li>
                    )}
                    {hasDestAccountSomethingToClaim && (
                        <li>{t('options.earn.gamified-staking.merge-account.merge-blocked-message.dest-claim')}</li>
                    )}
                    {isDestAccountUnstaking && (
                        <li>{t('options.earn.gamified-staking.merge-account.merge-blocked-message.dest-unstaking')}</li>
                    )}
                </ul>
            </>
        );
    };

    return (
        <>
            <SectionWrapper>
                <SectionContentWrapper>
                    <SectionTitle>{t('options.earn.gamified-staking.merge-account.delegate-volume')}</SectionTitle>
                    <InputContainer mediaMarginBottom={10}>
                        <div style={{ position: 'relative' }}>
                            <StyledInput
                                value={
                                    delegatedVolumeAddress !== ZERO_ADDRESS
                                        ? delegatedVolumeAddress
                                        : delegateDestAddress
                                }
                                onChange={(e: any) => setDelegateDestAddress(e.target.value)}
                                disabled={delegatedVolumeAddress !== ZERO_ADDRESS || isDelegating || !isWalletConnected}
                                className={isDelegateDestAddressValid ? '' : 'error'}
                            />
                            <InputLabel>
                                {t('options.earn.gamified-staking.merge-account.delegate-volume-address-label')}:
                            </InputLabel>
                        </div>
                        <FieldValidationMessage
                            showValidation={!isDelegateDestAddressValid}
                            message={t(`common.errors.invalid-address`)}
                        />
                    </InputContainer>
                    <NetworkFees gasLimit={gasLimit} l1Fee={l1Fee} />
                    <ButtonContainer>{getDelegateButton()}</ButtonContainer>
                </SectionContentWrapper>
            </SectionWrapper>
            <SectionDescription width={addressesThatDelegateToYou.length ? 4 : 8}>
                <SectionDescriptionTitle>
                    {t('options.earn.gamified-staking.merge-account.how-delegate-volume-works')}
                </SectionDescriptionTitle>
                <SectionDescriptionParagraph>
                    {t('options.earn.gamified-staking.merge-account.delegate-volume-description-1')}
                </SectionDescriptionParagraph>
                <SectionDescriptionParagraph>
                    {t('options.earn.gamified-staking.merge-account.delegate-volume-description-2')}
                </SectionDescriptionParagraph>
                <SectionDescriptionParagraph>
                    {t('options.earn.gamified-staking.merge-account.delegate-volume-description-3')}
                </SectionDescriptionParagraph>
            </SectionDescription>
            {!!addressesThatDelegateToYou.length && (
                <AddressesDelegatingToYouContainer>
                    <AddressesDelegatingToYouTitle>
                        {t('options.earn.gamified-staking.merge-account.addresses-delegating-to-you')}
                    </AddressesDelegatingToYouTitle>
                    {addressesThatDelegateToYou.map((address) => (
                        <StyledLink
                            key={address}
                            href={getEtherscanAddressLink(networkId, address)}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <DelegationAddress key={address}>
                                {address} <ArrowIcon width="10" height="10" />
                            </DelegationAddress>
                        </StyledLink>
                    ))}
                </AddressesDelegatingToYouContainer>
            )}
            <SectionWrapper>
                <SectionContentWrapper>
                    <SectionTitle>{t('options.earn.gamified-staking.merge-account.merge-account')}</SectionTitle>
                    <InputContainer mediaMarginBottom={10}>
                        <StyledInput value={walletAddress} disabled={true} onChange={undefined} />
                        <InputLabel>
                            {t('options.earn.gamified-staking.merge-account.source-account-label')}:
                        </InputLabel>
                    </InputContainer>
                    <ArrowContainer>
                        <ArrowDown />
                    </ArrowContainer>
                    <InputContainer mediaMarginBottom={10}>
                        <div style={{ position: 'relative' }}>
                            <StyledInput
                                value={destAddress}
                                onChange={(e: any) => setDestAddress(e.target.value)}
                                disabled={isMerging || !isAccountMergingEnabled || !isWalletConnected}
                                className={isDestAddressValid ? '' : 'error'}
                            />
                            <InputLabel>
                                {t('options.earn.gamified-staking.merge-account.destination-account-label')}:
                            </InputLabel>
                        </div>
                        <FieldValidationMessage
                            showValidation={!isDestAddressValid}
                            message={t(`common.errors.invalid-address`)}
                        />
                    </InputContainer>
                    <MessageContainer>
                        <MergeInfo>{t('options.earn.gamified-staking.merge-account.info-message')}</MergeInfo>
                    </MessageContainer>
                    <MessageContainer>
                        <MergeInfo>{t('options.earn.gamified-staking.merge-account.warning-message')}</MergeInfo>
                    </MessageContainer>
                    <ButtonContainer>
                        {getMergeButton()}
                        {!isAccountMergingEnabled && (
                            <Message>
                                {t('options.earn.gamified-staking.merge-account.merge-account-disabled-message')}
                            </Message>
                        )}
                        {isMergeBlocked && <Message>{getBlockedMergeMessage()}</Message>}
                        <ValidationMessage
                            showValidation={txErrorMessage !== null}
                            message={txErrorMessage}
                            onDismiss={() => setTxErrorMessage(null)}
                        />
                    </ButtonContainer>
                </SectionContentWrapper>
            </SectionWrapper>
            <SectionDescription>
                <SectionDescriptionTitle>
                    {t('options.earn.gamified-staking.merge-account.how-merge-account-works')}
                </SectionDescriptionTitle>
                <SectionDescriptionParagraph>
                    {t('options.earn.gamified-staking.merge-account.merge-account-description-1')}
                </SectionDescriptionParagraph>
                <SectionDescriptionParagraph>
                    {t('options.earn.gamified-staking.merge-account.merge-account-description-2')}
                </SectionDescriptionParagraph>
            </SectionDescription>
            <YourTransactions gridColumns={12} gridColumnStart={1} />
        </>
    );
};

const SectionWrapper = styled.section`
    box-sizing: border-box;
    border-radius: 15px;
    grid-column: 1 / span 4;
    background: ${(props) => props.theme.background.secondary};
    padding: 2px;
    @media (max-width: 767px) {
        grid-column: span 12;
    }
`;

const SectionTitle = styled(FlexDivCentered)`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    text-transform: uppercase;
`;

const SectionDescription = styled.section<{ width?: number }>`
    box-sizing: border-box;
    border-radius: 15px;
    grid-column: 5 / span ${(props) => props.width || 8};
    padding: 20px;
    @media (max-width: 767px) {
        grid-column: span 12;
    }
`;

const SectionDescriptionTitle = styled(FlexDivRow)`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 30px;
    text-transform: uppercase;
`;

const SectionDescriptionParagraph = styled(FlexDivRow)`
    font-size: 14px;
    font-weight: normal;
    margin-bottom: 20px;
    line-height: 20px;
`;

const SectionContentWrapper = styled.div<{ background?: boolean }>`
    background: ${(props) => (props.background ?? true ? ' var(--color-primary)' : 'none')};
    border-radius: 15px;
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    @media (max-width: 1192px) {
        padding: 10px 15px;
    }
    @media (max-width: 767px) {
        padding: 10px;
        box-shadow: none;
    }
`;

const MessageContainer = styled(FlexDiv)`
    margin-top: 10px;
`;

const ButtonContainer = styled(FlexDivColumnCentered)`
    padding-top: 20px;
    padding-bottom: 5px;
    align-items: center;
    justify-content: end;
`;

const Message = styled.div`
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: #ffcc00;
    margin-top: 10px;
    div {
        margin-bottom: 5px;
    }
    ul {
        list-style: initial;
        margin-left: 15px;
    }
`;

const StyledInput = styled(Input)`
    height: 45px;
    text-overflow: ellipsis;
    border-radius: 10px;
    padding: 5px 15px 8px 120px;
    width: 100%;
    @media (max-width: 1192px) {
        height: 60px;
        font-size: 15px;
    }
`;

const InputLabel = styled.label`
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: var(--color-highlight);
    padding-left: 8px;
    pointer-events: none;
    z-index: 3;
    position: absolute;
    text-transform: uppercase;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    @media (max-width: 1192px) {
        font-size: 9px;
    }
    @media (max-width: 768px) {
        font-size: 12px;
        padding-left: 10px;
    }
`;

const MergeInfo = styled.div`
    font-size: 12px;
    line-height: 15px;
    text-align: justify;
    padding: 3px;
`;

const AddressesDelegatingToYouContainer = styled.div`
    grid-column: 9 / span 4;
    padding: 20px;
    @media (max-width: 767px) {
        grid-column: span 12;
    }
`;

const AddressesDelegatingToYouTitle = styled.div`
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    text-align: justify;
    text-transform: uppercase;
    margin-bottom: 30px;
`;

const DelegationAddress = styled.div`
    font-size: 14px;
    line-height: 138.69%;
    text-transform: uppercase;
    margin-bottom: 5px;
    @media (max-width: 767px) {
        font-size: 11px;
    }
`;

const StyledLink = styled.a`
    color: #f6f6fe;
    &path {
        fill: #f6f6fe;
    }
    &:hover {
        color: var(--color-highlight);
        & path {
            fill: var(--color-highlight);
        }
    }
    @media (max-width: 767px) {
        color: var(--color-highlight);
    }
`;

const ArrowIcon = styled(ArrowHyperlinkIcon)`
    @media (max-width: 767px) {
        color: var(--color-highlight);
        & path {
            fill: var(--color-highlight);
        }
    }
`;

export default MergeAccount;
