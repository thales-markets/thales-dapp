import React from 'react';
import { EarnSection } from '../../components';
import styled from 'styled-components';
import { FlexDivCentered } from '../../../../../theme/common';
import { useTranslation } from 'react-i18next';

const ProvideLiquidity: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <EarnSection
                spanOnTablet={5}
                orderOnMobile={4}
                orderOnTablet={4}
                style={{ gridColumn: 'span 5', gridRow: 'span 2' }}
            >
                <Description>{t('options.earn.lp-staking.provide-liquidity.description')}</Description>
            </EarnSection>
        </>
    );
};

const Description = styled(FlexDivCentered)`
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #ffffff;
`;

export default ProvideLiquidity;
