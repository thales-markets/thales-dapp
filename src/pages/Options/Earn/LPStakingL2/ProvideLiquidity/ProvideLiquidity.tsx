import React from 'react';
import { ButtonContainer, EarnSection } from '../../components';
import styled from 'styled-components';
import { FlexDivCentered } from '../../../../../theme/common';
import { useTranslation } from 'react-i18next';
import { DefaultSubmitButton } from '../../../Market/components';

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
                <ButtonContainer>
                    <DefaultSubmitButton>
                        {t('options.earn.lp-staking.provide-liquidity.button-text')}
                    </DefaultSubmitButton>
                </ButtonContainer>
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
    flex: 1;
`;

export default ProvideLiquidity;
