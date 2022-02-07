import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button, FlexDivCentered } from '../../../../theme/common';
import { LINKS } from 'constants/links';

const LPStaking: React.FC = () => {
    const { t } = useTranslation();

    return (
        <LPStakingSection style={{ gridColumn: 'span 10' }}>
            <LPStakingTitle>{t('options.earn.vesting.lp-staking.title')}</LPStakingTitle>
            <FlexDivCentered>
                <a target="_blank" rel="noreferrer" href={LINKS.Token.DodoPool}>
                    <Button className="secondary" onClick={() => {}}>
                        {t('options.earn.vesting.lp-staking.button-text')}
                    </Button>
                </a>
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
    @media (max-width: 767px) {
        padding: 5px;
    }
`;

const LPStakingTitle = styled(FlexDivCentered)`
    font-weight: 600;
    font-size: 30px;
    line-height: 72px;
    padding: 10px 85px 60px 85px;
    text-align: center;
    @media (max-width: 767px) {
        font-size: 16px;
        line-height: 18px;
        padding: 0 0 30px 0;
    }
`;

export default LPStaking;
