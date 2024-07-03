import React from 'react';
import { useTranslation } from 'react-i18next';
import VaultOverview from './VaultOverview';
import { Container, Title, Wrapper } from './styled-components';

const Vault: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Wrapper>
            <Title>{t('vaults.title')}</Title>
            <Container>
                <VaultOverview vaultId="discount-vault" />
                <VaultOverview vaultId="degen-discount-vault" />
                <VaultOverview vaultId="safu-discount-vault" />
            </Container>
        </Wrapper>
    );
};

export default Vault;
