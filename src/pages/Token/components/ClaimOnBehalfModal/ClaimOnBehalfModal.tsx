import React, { useState } from 'react';
import styled from 'styled-components';
import { Trans, useTranslation } from 'react-i18next';
import { FlexDivCentered, FlexDivColumnCentered, FlexDivRowCentered, XButton } from 'theme/common';
import { Modal } from '@material-ui/core';
import TextInput from 'components/TextInput';
import { DefaultSubmitButton, InputContainer, InputLabel } from '../components';
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
import { Tip66Link } from 'pages/Token/components';
import useStakingClaimOnBehalfQuery from 'queries/staking/useStakingClaimOnBehalfQuery';

type MergeAccountModalProps = {
    onClose: () => void;
};

const MergeAccountModal: React.FC<MergeAccountModalProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '-';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [account, setAccount] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const { stakingThalesContract } = snxJSConnector as any;

    const isAccountEntered = account !== undefined && account.trim() !== '';
    const isAccountValid =
        account === undefined ||
        account.trim() === '' ||
        (isAddress(account) && getAddress(walletAddress) !== getAddress(account));

    const stakingClaimOnBehalfQuery = useStakingClaimOnBehalfQuery(walletAddress, account, networkId, {
        enabled: isAppReady && isWalletConnected && isAddress(account),
    });

    const canClaimOnBehalf =
        stakingClaimOnBehalfQuery.isSuccess && stakingClaimOnBehalfQuery.data !== undefined
            ? stakingClaimOnBehalfQuery.data
            : undefined;

    const isButtonDisabled =
        isSubmitting || !isAccountEntered || !isAccountValid || !isWalletConnected || canClaimOnBehalf === undefined;

    const handleSubmit = async () => {
        try {
            setTxErrorMessage(null);
            setIsSubmitting(true);

            const stakingThalesContractWithSigner = stakingThalesContract.connect((snxJSConnector as any).signer);

            const tx = await stakingThalesContractWithSigner.setCanClaimOnBehalf(
                getAddress(account),
                !canClaimOnBehalf,
                {
                    gasLimit: MAX_L2_GAS_LIMIT,
                }
            );
            const txResult = await tx.wait();

            if (txResult && txResult.transactionHash) {
                dispatchMarketNotification(
                    canClaimOnBehalf
                        ? t('options.earn.claim-on-behalf.disable-button.confirmation-message')
                        : t('options.earn.claim-on-behalf.enable-button.confirmation-message')
                );
                setAccount('');
                setIsSubmitting(false);
                onClose();
            }
        } catch (e) {
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsSubmitting(false);
        }
    };

    const getSubmitButton = () => {
        if (!isWalletConnected) {
            return (
                <DefaultSubmitButton onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </DefaultSubmitButton>
            );
        }
        if (!isAccountValid) {
            return <DefaultSubmitButton disabled={true}>{t(`common.errors.invalid-address`)}</DefaultSubmitButton>;
        }
        if (!isAccountEntered) {
            return <DefaultSubmitButton disabled={true}>{t(`common.errors.enter-address`)}</DefaultSubmitButton>;
        }
        return (
            <DefaultSubmitButton disabled={isButtonDisabled} onClick={handleSubmit}>
                {!canClaimOnBehalf
                    ? !isSubmitting
                        ? t('options.earn.claim-on-behalf.enable-button.label')
                        : t('options.earn.claim-on-behalf.enable-button.progress-label')
                    : !isSubmitting
                    ? t('options.earn.claim-on-behalf.disable-button.label')
                    : t('options.earn.claim-on-behalf.disable-button.progress-label')}
            </DefaultSubmitButton>
        );
    };
    return (
        <Modal
            open={true}
            onClose={(_, reason) => {
                if (reason !== 'backdropClick') onClose();
            }}
            style={{ backdropFilter: 'blur(10px)' }}
        >
            <Container>
                <Header>
                    <div>{t('options.earn.claim-on-behalf.title')}</div>
                    <XButton onClick={onClose} />
                </Header>
                <Description>
                    <Trans
                        i18nKey={`options.earn.claim-on-behalf.description`}
                        components={[<span key="1" />, <Tip66Link key="2" />]}
                    />
                </Description>
                <Label>{t('options.earn.claim-on-behalf.label')}:</Label>
                <InputContainer>
                    <TextInput
                        value={account}
                        onChange={(e: any) => setAccount(e.target.value)}
                        disabled={isSubmitting}
                        className={isAccountValid ? '' : 'error'}
                        autoFocus={true}
                    />
                    <InputLabel>{t('options.earn.claim-on-behalf.account-label')}:</InputLabel>
                    <FieldValidationMessage
                        showValidation={!isAccountValid}
                        message={t(`common.errors.invalid-address`)}
                    />
                </InputContainer>
                <ButtonContainer>
                    {!isButtonDisabled && (
                        <Message>
                            {canClaimOnBehalf
                                ? t('options.earn.claim-on-behalf.disable-message')
                                : t('options.earn.claim-on-behalf.enable-message')}
                        </Message>
                    )}
                    {getSubmitButton()}
                    <ValidationMessage
                        showValidation={txErrorMessage !== null}
                        message={txErrorMessage}
                        onDismiss={() => setTxErrorMessage(null)}
                    />
                </ButtonContainer>
            </Container>
        </Modal>
    );
};

const Container = styled(FlexDivColumnCentered)`
    font-size: 12px;
    line-height: 24px;
    border-radius: 15px;
    min-width: 70px;
    background: #04045a;
    border: 2px solid #64d9fe;
    box-shadow: 0px 0px 90px 10px #64d9fe;
    margin: auto;
    position: relative;
    top: calc(50% - 200px);
    padding: 20px;
    width: 460px;
    height: fit-content;
`;

const Header = styled(FlexDivRowCentered)`
    font-weight: 600;
    font-size: 20px;
    letter-spacing: 0.15px;
    color: #f6f6fe;
    padding: 0px 2px 50px 2px;
`;

const ButtonContainer = styled(FlexDivColumnCentered)`
    padding-top: 15px;
    padding-bottom: 10px;
    align-items: center;
`;

const Message = styled.div`
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.25px;
    color: #ffcc00;
    margin-bottom: 10px;
`;

const Description = styled(FlexDivCentered)`
    font-size: 16px;
    line-height: 20px;
    padding: 0 2px 20px 2px;
    text-align: start;
    display: inline;
    color: #f6f6fe;
`;

const Label = styled(Description)`
    font-size: 14px;
`;

export default MergeAccountModal;
