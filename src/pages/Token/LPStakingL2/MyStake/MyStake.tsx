import React from 'react';
import { EarnSection, SectionHeader } from '../../components';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered } from 'theme/common';

type Properties = {
    staked: number;
};

const MyStake: React.FC<Properties> = ({ staked }) => {
    const { t } = useTranslation();

    return (
        <>
            <EarnSection
                spanOnTablet={5}
                orderOnMobile={4}
                orderOnTablet={4}
                style={{ gridColumn: 'span 5', gridRow: 'span 2', padding: 0, border: '0', background: 'transparent' }}
            >
                <SectionHeader>{t('options.earn.lp-staking.my-stake.title')}</SectionHeader>
                <EarnSection
                    spanOnTablet={5}
                    orderOnMobile={4}
                    orderOnTablet={4}
                    style={{
                        gridColumn: 'span 5',
                        gridRow: 'span 2',
                        justifyContent: 'center',
                    }}
                >
                    <Amount>
                        <Title>{t('options.earn.lp-staking.my-stake.total-staked')}</Title>
                        {Math.round(staked * 100) / 100} {t('options.earn.lp-staking.my-stake.lp-tokens')}
                    </Amount>
                </EarnSection>
            </EarnSection>
        </>
    );
};

const Title = styled(FlexDivCentered)`
    position: absolute;
    padding: 20px;
    font-family: Titillium Web;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    color: #b8c6e5;
    top: 0;
`;
const Amount = styled(FlexDivCentered)`
    position: relative;
    padding: 80px 0;
    font-family: Roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 40px;
    line-height: 48px;
    color: #8208fc;
`;

export default MyStake;
