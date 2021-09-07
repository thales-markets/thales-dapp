import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button, FlexDivCentered } from '../../../../theme/common';

const LPStaking: React.FC = () => {
    const { t } = useTranslation();

    return (
        <LPStakingSection style={{ gridColumn: 'span 10' }}>
            <LPStakingTitle>{t('options.earn.vesting.lp-staking.title')}</LPStakingTitle>
            <FlexDivCentered>
                <Button className="secondary" onClick={() => {}}>
                    {t('options.earn.vesting.lp-staking.button-text')}
                </Button>
            </FlexDivCentered>
        </LPStakingSection>
    );
};

const LPStakingSection = styled.section`
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    border-radius: 15px;
    color: white;
    grid-column: span 5;
    grid-row: span 3;
    margin-bottom: 15px;
    padding: 30px 20px 10px 40px;
`;

const LPStakingTitle = styled(FlexDivCentered)`
    font-weight: 600;
    font-size: 30px;
    line-height: 72px;
    padding: 10px 65px 60px 65px;
    text-align: center;
`;

export default LPStaking;
