import React from 'react';
import { EarnSection } from '../../components';
import styled from 'styled-components';
import { FlexDivCentered } from '../../../../../theme/common';
import { useTranslation } from 'react-i18next';
import useGelatoQuery from 'queries/token/useGelatoQuery';
import { formatCurrencyWithSign } from 'utils/formatters/number';

const Info: React.FC = () => {
    const { t } = useTranslation();
    const gelatoQuery = useGelatoQuery({ enabled: true });
    const gelatoData = gelatoQuery.isSuccess ? gelatoQuery.data : undefined;

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
                    {formatCurrencyWithSign('$', gelatoData?.totalInUSD ?? 0)}
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
                    {gelatoData?.apr}
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
