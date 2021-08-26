import React, { useState } from 'react';
import { ClaimTitle, EarnSection, SectionContent, SectionHeader } from '../../components';
import { Button, FlexDiv, FlexDivColumn } from '../../../../../theme/common';
import TimeRemaining from '../../../components/TimeRemaining/TimeRemaining';
import ValidationMessage from '../../../../../components/ValidationMessage/ValidationMessage';
import { useTranslation } from 'react-i18next';

const nextweek = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
};

const endDate = nextweek();

const Unstake: React.FC = () => {
    const { t } = useTranslation();

    const [isUnstaking, setIsUnstaking] = useState<boolean>(false);

    return (
        <EarnSection style={{ gridColumn: 'span 6' }}>
            <SectionHeader>Unstake</SectionHeader>
            <SectionContent>
                <FlexDivColumn>
                    <ClaimTitle>
                        {!isUnstaking ? (
                            t('options.earn.thales-staking.unstake.unlock-cooldown-text')
                        ) : (
                            <TimeRemaining end={endDate} fontSize={18} />
                        )}
                    </ClaimTitle>
                </FlexDivColumn>
                <FlexDiv>
                    <Button className="primary" onClick={() => setIsUnstaking(true)} disabled={isUnstaking}>
                        {!isUnstaking
                            ? t('options.earn.thales-staking.unstake.start-unstaking')
                            : t('options.earn.thales-staking.unstake.unstaking')}
                    </Button>
                </FlexDiv>
            </SectionContent>
            <div style={{ marginBottom: '15px' }}>
                <ValidationMessage showValidation={false} message={''} onDismiss={() => {}} />
            </div>
        </EarnSection>
    );
};

export default Unstake;
