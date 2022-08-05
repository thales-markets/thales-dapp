import React, { useState } from 'react';
import styled from 'styled-components';
import { Trans, useTranslation } from 'react-i18next';
import { FlexDiv, FlexDivCentered, FlexDivColumnCentered, FlexDivRowCentered } from 'theme/common';
import TextInput from 'components/TextInput';
import { DefaultSubmitButton, InputContainer, InputLabel } from '../components/components';
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
import { ArrowContainer, Result, ResultContainer } from 'pages/Token/Migration/components';
import { ReactComponent as ArrowDown } from 'assets/images/arrow-down-blue.svg';
import { Tip49Link } from 'pages/Token/components';
import YourTransactions from './Transactions';

const MergeAccountModal: React.FC = () => {
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
                dispatchMarketNotification(t('options.earn.merge-account.confirmation-message'));
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
                <DefaultSubmitButton onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </DefaultSubmitButton>
            );
        }
        if (!isDestAddressValid && isAccountMergingEnabled && !isMergeBlocked) {
            return <DefaultSubmitButton disabled={true}>{t(`common.errors.invalid-address`)}</DefaultSubmitButton>;
        }
        if (!isDestAddressEntered && isAccountMergingEnabled && !isMergeBlocked) {
            return <DefaultSubmitButton disabled={true}>{t(`common.errors.enter-address`)}</DefaultSubmitButton>;
        }
        return (
            <DefaultSubmitButton disabled={isButtonDisabled} onClick={handleMerge}>
                {!isMerging
                    ? t('options.earn.merge-account.merge-button.label')
                    : t('options.earn.merge-account.merge-button.progress-label')}
            </DefaultSubmitButton>
        );
    };

    const getBlockedMergeMessage = () => {
        return (
            <>
                <div>{t('options.earn.merge-account.merge-blocked-message.title')}:</div>
                <ul>
                    {hasSrcAccountSomethingToClaim && (
                        <li>{t('options.earn.merge-account.merge-blocked-message.src-claim')}</li>
                    )}
                    {isSrcAccountUnstaking && (
                        <li>{t('options.earn.merge-account.merge-blocked-message.src-unstaking')}</li>
                    )}
                    {hasDestAccountSomethingToClaim && (
                        <li>{t('options.earn.merge-account.merge-blocked-message.dest-claim')}</li>
                    )}
                    {isDestAccountUnstaking && (
                        <li>{t('options.earn.merge-account.merge-blocked-message.dest-unstaking')}</li>
                    )}
                </ul>
            </>
        );
    };

    return (
        <>
            <GridWrapper>
                <Container>
                    <Header>
                        <div>{t('options.earn.merge-account.title')}</div>
                    </Header>
                    <Description>
                        <Trans
                            i18nKey={`options.earn.merge-account.description`}
                            components={[<span key="1" />, <Tip49Link key="2" />]}
                        />
                    </Description>
                    <ResultContainer>
                        <Result>{walletAddress}</Result>
                        <InputLabel>{t('options.earn.merge-account.source-account-label')}:</InputLabel>
                    </ResultContainer>
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
                        <InputLabel>{t('options.earn.merge-account.destination-account-label')}:</InputLabel>
                        <FieldValidationMessage
                            showValidation={!isDestAddressValid}
                            message={t(`common.errors.invalid-address`)}
                        />
                    </InputContainer>
                    <MessageContainer>
                        <InfoMessage message={t('options.earn.merge-account.info-message')}></InfoMessage>
                    </MessageContainer>
                    <MessageContainer>
                        <InfoWarningMessage
                            message={t('options.earn.merge-account.warning-message')}
                        ></InfoWarningMessage>
                    </MessageContainer>
                    <ButtonContainer>
                        {getMergeButton()}
                        {!isAccountMergingEnabled && (
                            <Message>{t('options.earn.merge-account.merge-account-disabled-message')}</Message>
                        )}
                        {isMergeBlocked && <Message>{getBlockedMergeMessage()}</Message>}
                        <ValidationMessage
                            showValidation={txErrorMessage !== null}
                            message={txErrorMessage}
                            onDismiss={() => setTxErrorMessage(null)}
                        />
                    </ButtonContainer>
                </Container>
            </GridWrapper>
            <YourTransactions />
        </>
    );
};

const GridWrapper = styled(FlexDivColumnCentered)`
    grid-column: span 10;
    align-items: center;
    margin: 20px 10px 20px 10px;
    @media (max-width: 767px) {
        margin: 10px 0;
    }
`;

const Container = styled(FlexDivColumnCentered)`
    font-size: 12px;
    line-height: 24px;
    border-radius: 15px;
    max-width: 550px;
    background: #04045a;
    border: 1px solid #64d9fe;
    box-shadow: -2px -2px 10px 4px rgba(100, 217, 254, 0.25), 2px 2px 10px 4px rgba(100, 217, 254, 0.25);
    padding: 40px 50px 40px 50px;
    @media (max-width: 767px) {
        padding: 20px;
        box-shadow: none;
    }
`;

const Header = styled(FlexDivRowCentered)`
    font-weight: 600;
    font-size: 20px;
    letter-spacing: 0.15px;
    color: #f6f6fe;
    padding: 0px 2px 50px 2px;
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

const Description = styled(FlexDivCentered)`
    font-size: 16px;
    line-height: 20px;
    padding: 0 2px 20px 2px;
    text-align: start;
    display: inline;
    color: #f6f6fe;
`;

export default MergeAccountModal;
