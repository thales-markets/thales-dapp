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
                <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://app.dodoex.io/pool/list/0x031816fd297228e4fd537c1789d51509247d0b43?network=mainnet"
                >
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
`;

const LPStakingTitle = styled(FlexDivCentered)`
    font-weight: 600;
    font-size: 30px;
    line-height: 72px;
    padding: 10px 85px 60px 85px;
    text-align: center;
`;

export default LPStaking;
