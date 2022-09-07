import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FlexDiv, FlexDivColumnCentered } from 'theme/common';
import TextInput from 'pages/Token/components/TextInput';
import { InputContainer, InputLabel } from 'pages/Token/components/components';
import FieldValidationMessage from 'components/FieldValidationMessage';
import { getAddress, isAddress } from 'ethers/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import onboardConnector from 'utils/onboardConnector';
import ValidationMessage from 'components/ValidationMessage';
import snxJSConnector from 'utils/snxJSConnector';
import { dispatchMarketNotification } from 'utils/options';
import { MAX_L2_GAS_LIMIT } from 'constants/options';
import { getIsAppReady } from 'redux/modules/app';
import useStakingThalesQuery from 'queries/staking/useStakingThalesQuery';
import InfoMessage from 'components/InfoMessage';
import InfoWarningMessage from 'components/InfoWarningMessage';
import { ArrowContainer } from 'pages/Token/Migration/components';
import { ReactComponent as ArrowDown } from 'assets/images/arrow-down-blue.svg';
import { isMobile } from 'utils/device';
import YourTransactions from './Transactions';
import Button, { ButtonType } from 'pages/Token/components/Button/Button';

const MergeAccount: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '-';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [destAddress, setDestAddress] = useState<string>('');
    const [isMerging, setIsMerging] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const { stakingThalesContract } = snxJSConnector as any;

    const isDestAddressEntered = destAddress !== undefined && destAddress.trim() !== '';
    const isDestAddressValid =
        !isWalletConnected ||
        destAddress === undefined ||
        destAddress.trim() === '' ||
        (isAddress(walletAddress) && isAddress(destAddress) && getAddress(walletAddress) !== getAddress(destAddress));

    const srcStakingThalesQuery = useStakingThalesQuery(walletAddress, networkId, {
        enabled: isAppReady,
    });

    const destStakingThalesQuery = useStakingThalesQuery(destAddress, networkId, {
        enabled: isAppReady && isDestAddressValid,
    });

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

    const handleMerge = async () => {
        try {
            setTxErrorMessage(null);
            setIsMerging(true);

            const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);

            const tx = await stakingThalesContractWithSigner.mergeAccount(getAddress(destAddress), {
                gasLimit: MAX_L2_GAS_LIMIT,
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

    const getMergeButton = () => {
        if (!isWalletConnected) {
            return (
                <Button
                    type={ButtonType.submit}
                    width={isMobile() ? '100%' : '50%'}
                    active={true}
                    onClickHandler={() => onboardConnector.connectWallet()}
                >
                    {t('common.wallet.connect-your-wallet')}
                </Button>
            );
        }
        if (!isDestAddressValid && isAccountMergingEnabled && !isMergeBlocked) {
            return (
                <Button type={ButtonType.submit} width={isMobile() ? '100%' : '50%'} disabled={true}>
                    {t(`common.errors.invalid-address`)}
                </Button>
            );
        }
        if (!isDestAddressEntered && isAccountMergingEnabled && !isMergeBlocked) {
            return (
                <Button type={ButtonType.submit} width={isMobile() ? '100%' : '50%'} disabled={true}>
                    {t(`common.errors.enter-address`)}
                </Button>
            );
        }
        return (
            <Button
                type={ButtonType.submit}
                width={isMobile() ? '100%' : '50%'}
                active={!isButtonDisabled}
                disabled={isButtonDisabled}
                onClickHandler={handleMerge}
            >
                {!isMerging
                    ? t('options.earn.gamified-staking.merge-account.merge-button.label')
                    : t('options.earn.gamified-staking.merge-account.merge-button.progress-label')}
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
                    <InputContainer>
                        <TextInput value={walletAddress} disabled={true} onChange={undefined} />
                        <InputLabel>
                            {t('options.earn.gamified-staking.merge-account.source-account-label')}:
                        </InputLabel>
                    </InputContainer>
                    <ArrowContainer>
                        <ArrowDown />
                    </ArrowContainer>
                    <InputContainer>
                        <TextInput
                            value={destAddress}
                            onChange={(e: any) => setDestAddress(e.target.value)}
                            disabled={isMerging || !isAccountMergingEnabled || !isWalletConnected}
                            className={isDestAddressValid ? '' : 'error'}
                            autoFocus={true}
                        />
                        <InputLabel>
                            {t('options.earn.gamified-staking.merge-account.destination-account-label')}:
                        </InputLabel>
                        <FieldValidationMessage
                            showValidation={!isDestAddressValid}
                            message={t(`common.errors.invalid-address`)}
                        />
                    </InputContainer>
                    <MessageContainer>
                        <InfoMessage
                            message={t('options.earn.gamified-staking.merge-account.info-message')}
                            fontSize={isMobile() ? '12px' : '16px'}
                        ></InfoMessage>
                    </MessageContainer>
                    <MessageContainer>
                        <InfoWarningMessage
                            message={t('options.earn.gamified-staking.merge-account.warning-message')}
                            fontSize={isMobile() ? '12px' : '16px'}
                        ></InfoWarningMessage>
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

            <YourTransactions gridColumns={isMobile() ? 12 : 6} gridColumnStart={4} />
        </>
    );
};

const SectionWrapper = styled.section`
    box-sizing: border-box;
    border-radius: 15px;
    grid-column: 4 / span 6;
    background: #64d9fe80;
    padding: 2px;
    @media (max-width: 767px) {
        grid-column: span 12;
    }
`;

const SectionContentWrapper = styled.div<{ background?: boolean }>`
    background: ${(props) => (props.background ?? true ? '#04045a' : 'none')};
    border-radius: 15px;
    padding: 40px;
    @media (max-width: 767px) {
        padding: 10px;
        box-shadow: none;
    }
`;

const MessageContainer = styled(FlexDiv)`
    margin-top: 10px;
`;

const ButtonContainer = styled(FlexDivColumnCentered)`
    padding-top: 40px;
    padding-bottom: 5px;
    align-items: center;
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

export default MergeAccount;
