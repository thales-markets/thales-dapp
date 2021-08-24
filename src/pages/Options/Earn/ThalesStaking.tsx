import React, { useState } from 'react';
import { ClaimDiv, ClaimTitle, EarnSection, SectionContent, SectionHeader } from './Earn';
import { Button, FlexDiv } from '../../../theme/common';
import { useTranslation } from 'react-i18next';
import ValidationMessage from '../../../components/ValidationMessage/ValidationMessage';
import NumericInput from '../Market/components/NumericInput';
import { InputLabel } from '../Market/components';
import styled from 'styled-components';
import TimeRemaining from '../components/TimeRemaining/TimeRemaining';

const nextweek = () => {
    const today = new Date();
    const nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    return nextweek;
};

const endDate = nextweek();

const ThalesStaking: React.FC = () => {
    const { t } = useTranslation();

    const [isUnstaking, setIsUnstaking] = useState(false);

    return (
        <>
            <EarnSection style={{ gridRow: '1 / 3', gridColumn: 'span 6' }}>
                <SectionHeader>Stake</SectionHeader>
                <SectionContent style={{ height: '100%' }}>
                    <FullRow>
                        <div>Balance: 232 THALES</div>
                    </FullRow>
                    <FlexDiv>
                        <NumericInput
                            value={20}
                            onChange={() => {}}
                            step="0.01"
                            // className={isPriceValid ? '' : 'error'}
                            disabled={false}
                        />
                        <InputLabel>Amount to stake</InputLabel>
                    </FlexDiv>
                    <FlexDiv>
                        <Button className="primary">Stake</Button>
                    </FlexDiv>
                </SectionContent>
            </EarnSection>
            <EarnSection style={{ gridColumn: 'span 4' }}>
                <SectionHeader>My Stake</SectionHeader>
                <SectionContent style={{ paddingTop: '15px' }}>
                    <FullRow>
                        <div>Staked amount: 502 THALES</div>
                    </FullRow>
                </SectionContent>
            </EarnSection>
            <EarnSection style={{ gridColumn: 'span 4' }}>
                <SectionHeader>Escrow</SectionHeader>
                <SectionContent style={{ paddingTop: '15px' }}>
                    <FullRow>
                        <div>Escrowed amount: 112 THALES</div>
                    </FullRow>
                </SectionContent>
            </EarnSection>
            <EarnSection style={{ gridColumn: 'span 6' }}>
                <SectionHeader>Unstake</SectionHeader>
                <SectionContent>
                    <ClaimDiv>
                        <ClaimTitle>
                            {!isUnstaking ? (
                                'Amount to unstake: 154.9 THALES'
                            ) : (
                                <TimeRemaining end={endDate} fontSize={18} />
                            )}
                        </ClaimTitle>
                    </ClaimDiv>
                    <FlexDiv>
                        <Button className="primary" onClick={() => setIsUnstaking(true)} disabled={isUnstaking}>
                            {!isUnstaking ? 'Start unstaking' : 'Unstaking...'}
                        </Button>
                    </FlexDiv>
                </SectionContent>
                <div style={{ marginBottom: '15px' }}>
                    <ValidationMessage showValidation={false} message={''} onDismiss={() => {}} />
                </div>
            </EarnSection>
            <EarnSection style={{ gridColumn: 'span 4' }}>
                <SectionHeader>My Rewards</SectionHeader>
                <SectionContent>
                    <ClaimDiv>
                        <ClaimTitle>{t('options.earn.snx-stakers.amount-to-claim')}:</ClaimTitle>
                        <span>154.9 THALES</span>
                    </ClaimDiv>
                    <FlexDiv>
                        <Button className="primary">{t('options.earn.snx-stakers.claim')}</Button>
                    </FlexDiv>
                </SectionContent>
                <div style={{ marginBottom: '15px' }}>
                    <ValidationMessage showValidation={false} message={''} onDismiss={() => {}} />
                </div>
            </EarnSection>
        </>
    );
};

const FullRow = styled(FlexDiv)`
    flex-basis: 100%;
    display: flex;
    font-size: 20px;
    justify-content: center;
`;

export default ThalesStaking;
