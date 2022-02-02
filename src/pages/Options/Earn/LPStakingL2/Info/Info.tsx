import React from 'react';
import { EarnSection } from '../../components';
import styled from 'styled-components';
import { FlexDivCentered } from '../../../../../theme/common';
import { useTranslation } from 'react-i18next';

const Info: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <EarnSection
                spanOnTablet={5}
                orderOnMobile={4}
                orderOnTablet={4}
                style={{ gridColumn: 'span 3', gridRow: 'span 2' }}
            >
                <Amount>
                    <Title>{t('options.earn.lp-staking.info.tvl')}</Title>
                    $12.5 M
                </Amount>
            </EarnSection>
            <EarnSection
                spanOnTablet={5}
                orderOnMobile={4}
                orderOnTablet={4}
                style={{ gridColumn: 'span 2', gridRow: 'span 2' }}
            >
                <Amount>
                    <Title>{t('options.earn.lp-staking.info.apr')}</Title>
                    75%
                </Amount>
            </EarnSection>
        </>
    );
};

const Title = styled(FlexDivCentered)`
    position: absolute;
    padding: 5px;
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
    padding: 30px 0;
    font-family: Roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 40px;
    line-height: 48px;
    color: #8208fc;
`;

export default Info;
