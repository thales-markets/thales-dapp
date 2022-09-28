import React from 'react';
import styled from 'styled-components';
import crab from 'assets/images/vaults/crab.svg';
import strategy from 'assets/images/vaults/strategy.svg';
import risk from 'assets/images/vaults/risk.svg';
import performance from 'assets/images/vaults/performance.svg';
import { useTranslation } from 'react-i18next';

const Vaults: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Container>
            <Card>
                <CardImage src={crab} />
                <CardTitle>Crab Market Vault</CardTitle>
                <Section>
                    <SectionHeader>
                        <SectionImage src={strategy} />
                        <SectionTitle>Vault Strategy</SectionTitle>
                    </SectionHeader>
                    <SectionText>{t('vaults.text')}</SectionText>
                </Section>
                <Section>
                    <SectionHeader>
                        <SectionImage src={performance} />
                        <SectionTitle>Performance</SectionTitle>
                    </SectionHeader>
                    <SectionText>{t('vaults.text')}</SectionText>
                </Section>
                <Section>
                    <SectionHeader>
                        <SectionImage src={risk} />
                        <SectionTitle>Vault Risks</SectionTitle>
                    </SectionHeader>
                    <SectionText>{t('vaults.text')}</SectionText>
                </Section>
            </Card>
            <Card></Card>
            <Card></Card>
            <Card></Card>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Card = styled.div`
    width: 368px;
    height: 837px;
    margin: 5px;
    background: #0e0e68;
    border: 2px solid rgba(100, 217, 254, 0.3);
    border-radius: 13px;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const CardImage = styled.img`
    display: block;
    margin: auto;
`;

const CardTitle = styled.p`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 100%;
    text-transform: uppercase;
    color: #64d9fe;
    text-align: center;
    margin-bottom: 30px;
`;

const Section = styled.div``;

const SectionHeader = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 12px 0;
`;

const SectionImage = styled.img`
    display: block;
    margin-right: 10px;
`;

const SectionTitle = styled.p`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 100%;
    text-transform: capitalize;
    color: #ffffff;
`;

const SectionText = styled.p`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 110%;
    text-transform: capitalize;
    color: #ffffff;
`;

export default Vaults;
