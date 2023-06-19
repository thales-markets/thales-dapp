import ElectionsBanner from 'components/ElectionsBanner';
import OpRewardsBanner from 'components/OpRewardsBanner';
import React from 'react';
import { Container, Title, Wrapper } from './styled-components';
import VaultOverview from './VaultOverview';
import { useTranslation } from 'react-i18next';

const Vault: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <OpRewardsBanner />
            <ElectionsBanner />
            <Wrapper>
                <Title>{t('vaults.title')}</Title>
                <Container>
                    <VaultOverview vaultId="discount-vault" />
                    <VaultOverview vaultId="degen-discount-vault" />
                    <VaultOverview vaultId="safu-discount-vault" />
                </Container>
            </Wrapper>
        </>
    );
};

export default Vault;
