import { DefaultSubmitButton } from '../components';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Trans, useTranslation } from 'react-i18next';
import { FlexDiv, FlexDivCentered, FlexDivColumnCentered } from 'theme/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import useStakingMigrationOptOutQuery from 'queries/token/useStakingMigrationOptOutQuery';
import axios from 'axios';
import onboardConnector from 'utils/onboardConnector';
import snxJSConnector from 'utils/snxJSConnector';
import { Tip20Link } from '../../components';

const MigrationOptOutNotice: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [optOut, setOptOut] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const stakingMigrationOptOutQuery = useStakingMigrationOptOutQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (stakingMigrationOptOutQuery.isSuccess && stakingMigrationOptOutQuery.data) {
            setOptOut(stakingMigrationOptOutQuery.data.optOut || false);
        }
    }, [stakingMigrationOptOutQuery.isSuccess, stakingMigrationOptOutQuery.data]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const newOptOut = !optOut;
            const signData = JSON.stringify({
                optOut: newOptOut,
                networkId,
            });

            const signature = await (snxJSConnector as any).signer.signMessage(signData);
            await axios.post('https://api.thales.market/token/staking-migration/opt-out', {
                networkId,
                walletAddress,
                optOut: newOptOut,
                signature,
            });
            setOptOut(newOptOut);
            stakingMigrationOptOutQuery.refetch();
        } catch (e) {
            console.log(e);
        }
        setIsSubmitting(false);
    };

    const getSubmitButton = () => {
        if (!isWalletConnected) {
            return (
                <MigrateButton onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </MigrateButton>
            );
        }

        return (
            <MigrateButton onClick={handleSubmit} disabled={isSubmitting}>
                {t(`migration.migration-opt-out-notice.button.${optOut ? 'cancel-opt-out-label' : 'opt-out-label'}`)}
            </MigrateButton>
        );
    };

    return (
        <Wrapper>
            <Conatiner>
                <Notice>
                    <Trans
                        i18nKey={`migration.migration-opt-out-notice.${
                            optOut ? 'cancel-opt-out-text' : 'opt-out-text'
                        }`}
                        components={[<span key="1" />, <Tip20Link key="2" />]}
                    />
                </Notice>
                <MigrateButtonContainer>{getSubmitButton()}</MigrateButtonContainer>
            </Conatiner>
        </Wrapper>
    );
};

const Wrapper = styled(FlexDivColumnCentered)`
    border: none;
    background: linear-gradient(190.01deg, #516aff -17.89%, #8208fc 90.41%);
    box-shadow: -2px -2px 10px 4px rgba(100, 217, 254, 0.25), 2px 2px 10px 4px rgba(100, 217, 254, 0.25);
    border-radius: 10px;
    padding: 1px;
    margin-bottom: 15px;
`;

const Conatiner = styled(FlexDivCentered)`
    background: #04045a;
    border-radius: 10px;
    padding: 18px 20px;
    @media (max-width: 767px) {
        flex-direction: column;
        padding: 20px 20px;
    }
`;

const Notice = styled(FlexDiv)`
    font-weight: normal;
    font-size: 16px;
    line-height: 30px;
    color: #ffffff;
    margin-right: 50px;
    display: inline;
    text-align: justify;
    @media (max-width: 767px) {
        margin-bottom: 20px;
        margin-right: 0;
        text-align: center;
    }
`;

const MigrateButtonContainer = styled(FlexDivCentered)``;

const MigrateButton = styled(DefaultSubmitButton)`
    background: linear-gradient(190.01deg, #516aff -17.89%, #8208fc 90.41%);
    white-space: nowrap;
    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
`;

export default MigrationOptOutNotice;
