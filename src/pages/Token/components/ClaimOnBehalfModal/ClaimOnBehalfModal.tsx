import React, { useState } from 'react';
import styled from 'styled-components';
import { Trans, useTranslation } from 'react-i18next';
import { FlexDivCentered, FlexDivColumnCentered } from 'styles/common';
import { InputContainer } from '../styled-components';
import { getAddress, isAddress } from 'ethers/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import ValidationMessage from 'components/ValidationMessage';
import snxJSConnector from 'utils/snxJSConnector';
import { dispatchMarketNotification } from 'utils/options';
import { getIsAppReady } from 'redux/modules/app';
import { ClaimOnBehalfGuideLink, Tip66Link } from 'pages/Token/styled-components';
import useStakingClaimOnBehalfQuery from 'queries/token/useStakingClaimOnBehalfQuery';
import { getMaxGasLimitForNetwork } from 'constants/options';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Button from 'components/ButtonV2/Button';
import TextInput from 'components/fields/TextInput';
import Modal from 'components/Modal';

type ClaimOnBehalfModalProps = {
    onClose: () => void;
};

const ClaimOnBehalfModal: React.FC<ClaimOnBehalfModalProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const { openConnectModal } = useConnectModal();
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
        !isWalletConnected ||
        account === undefined ||
        account.trim() === '' ||
        (isAddress(walletAddress) && isAddress(account) && getAddress(walletAddress) !== getAddress(account));

    const stakingClaimOnBehalfQuery = useStakingClaimOnBehalfQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const canClaimOnBehalf =
        stakingClaimOnBehalfQuery.isSuccess && stakingClaimOnBehalfQuery.data !== undefined && isAddress(account)
            ? stakingClaimOnBehalfQuery.data.enabledAddresses.includes(account.toLowerCase())
            : undefined;

    const enabledAddresses =
        stakingClaimOnBehalfQuery.isSuccess && stakingClaimOnBehalfQuery.data !== undefined
            ? stakingClaimOnBehalfQuery.data.enabledAddresses
            : [];

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
                    gasLimit: getMaxGasLimitForNetwork(networkId),
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
        const width = '300px';
        if (!isWalletConnected) {
            return (
                <Button width={width} onClick={openConnectModal}>
                    {t('common.wallet.connect-your-wallet')}
                </Button>
            );
        }
        if (!isAccountValid) {
            return (
                <Button width={width} disabled={true}>
                    {t(`common.errors.invalid-address`)}
                </Button>
            );
        }
        if (!isAccountEntered) {
            return (
                <Button width={width} disabled={true}>
                    {t(`common.errors.enter-address`)}
                </Button>
            );
        }
        return (
            <Button width={width} disabled={isButtonDisabled} onClick={handleSubmit}>
                {!canClaimOnBehalf
                    ? !isSubmitting
                        ? t('options.earn.claim-on-behalf.enable-button.label')
                        : t('options.earn.claim-on-behalf.enable-button.progress-label')
                    : !isSubmitting
                    ? t('options.earn.claim-on-behalf.disable-button.label')
                    : t('options.earn.claim-on-behalf.disable-button.progress-label')}
            </Button>
        );
    };
    return (
        <Modal
            title={t('options.earn.claim-on-behalf.title')}
            onClose={onClose}
            shouldCloseOnOverlayClick={false}
            customStyle={{ overlay: { zIndex: 201 } }}
        >
            <Container>
                <Description>
                    <Trans
                        i18nKey={`options.earn.claim-on-behalf.description`}
                        components={[<span key="1" />, <Tip66Link key="2" />]}
                    />
                </Description>
                <Description>
                    <Trans
                        i18nKey={`options.earn.claim-on-behalf.guide`}
                        components={[<span key="1" />, <ClaimOnBehalfGuideLink key="2" />]}
                    />
                </Description>
                <InputContainer marginTop={20}>
                    <TextInput
                        value={account}
                        onChange={(e: any) => setAccount(e.target.value)}
                        disabled={isSubmitting || !isWalletConnected}
                        label={t('options.earn.claim-on-behalf.label')}
                        placeholder={t('common.enter-address')}
                        showValidation={!isAccountValid}
                        validationMessage={t(`common.errors.invalid-address`)}
                    />
                </InputContainer>
                <ButtonContainer>
                    {getSubmitButton()}
                    <ValidationMessage
                        showValidation={txErrorMessage !== null}
                        message={txErrorMessage}
                        onDismiss={() => setTxErrorMessage(null)}
                    />
                </ButtonContainer>
                <EnabledAddressesTitle>
                    {t('options.earn.claim-on-behalf.enabled-addresses-title')}:
                </EnabledAddressesTitle>
                {enabledAddresses.length > 0 || stakingClaimOnBehalfQuery.isLoading ? (
                    enabledAddresses.map((address) => (
                        <EnabledAddressesItem key={address}>{address}</EnabledAddressesItem>
                    ))
                ) : (
                    <NoAddresses>{t('options.earn.claim-on-behalf.no-enabled-addresses-message')}</NoAddresses>
                )}
            </Container>
        </Modal>
    );
};

const Container = styled(FlexDivColumnCentered)`
    min-width: 70px;
    position: relative;
    width: 380px;
`;

const ButtonContainer = styled(FlexDivColumnCentered)`
    align-items: center;
`;

const Description = styled(FlexDivCentered)`
    font-size: 13px;
    line-height: 18px;
    text-align: start;
    display: inline;
    color: ${(props) => props.theme.textColor.primary};
`;

const Label = styled(Description)`
    font-size: 14px;
`;

const EnabledAddressesTitle = styled(Label)`
    padding: 30px 2px 4px 0;
    font-size: 13px;
    border-bottom: 1px solid ${(props) => props.theme.borderColor.secondary};
`;

const EnabledAddressesItem = styled(Label)`
    padding: 5px 2px 4px 0;
    border-bottom: 1px dotted ${(props) => props.theme.borderColor.secondary};
    :last-child {
        margin-bottom: 10px;
    }
`;

const NoAddresses = styled(EnabledAddressesItem)`
    font-size: 13px;
    text-align: center;
`;

export default ClaimOnBehalfModal;
