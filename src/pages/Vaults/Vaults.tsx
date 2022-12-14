import ElectionsBanner from 'components/ElectionsBanner';
import Footer from 'components/Footer';
import OpRewardsBanner from 'components/OpRewardsBanner';
import React from 'react';
import { Container, Wrapper } from './styled-components';
import VaultOverview from './VaultOverview';

const Vault: React.FC = () => {
    return (
        <>
            <OpRewardsBanner />
            <ElectionsBanner />
            <Wrapper>
                <Container>
                    <VaultOverview vaultId="discount-vault" />
                    <VaultOverview vaultId="degen-discount-vault" />
                    <VaultOverview vaultId="safu-discount-vault" />
                </Container>
            </Wrapper>
            <Footer />
        </>
    );
};

export default Vault;
