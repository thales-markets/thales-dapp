import React from 'react';
import { EarnSection } from '../../components';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivSpaceBetween, FlexDivStart } from 'theme/common';
import { useTranslation } from 'react-i18next';
import useGelatoQuery from 'queries/token/useGelatoQuery';
import { formatCurrencyWithSign } from 'utils/formatters/number';

type Properties = {
    totalGelatoLocked: number;
};

const Info: React.FC<Properties> = ({ totalGelatoLocked }) => {
    const { t } = useTranslation();
    const gelatoQuery = useGelatoQuery(totalGelatoLocked, { enabled: true });
    const gelatoData = gelatoQuery.isSuccess ? gelatoQuery.data : undefined;

    return (
        <Container>
            <EarnSection style={{ gridColumn: 'span 5', gridRow: 'span 2', justifyContent: 'center' }}>
                <AprInfoContainer>
                    <TotalAprContainer>
                        <TotalAprTitle>{t('options.earn.lp-staking.info.total-apr')}</TotalAprTitle>
                        <TotalAprAmount>{gelatoData?.totalApr}</TotalAprAmount>
                    </TotalAprContainer>
                    <FlexDivColumn>
                        <AprContainer>
                            <AprTitle>{t('options.earn.lp-staking.info.thales-apr')}</AprTitle>
                            <AprAmount>{gelatoData?.apr}</AprAmount>
                        </AprContainer>
                        <AprContainer>
                            <AprTitle>{t('options.earn.lp-staking.info.op-apr')}</AprTitle>
                            <AprAmount>{gelatoData?.secondApr}</AprAmount>
                        </AprContainer>
                    </FlexDivColumn>
                </AprInfoContainer>
            </EarnSection>
            <EarnSection style={{ gridColumn: 'span 5', gridRow: 'span 2', justifyContent: 'center' }}>
                <Title>{t('options.earn.lp-staking.info.tvl')}</Title>
                <Amount>{formatCurrencyWithSign('$', gelatoData?.totalInUSD ?? 0)}</Amount>
            </EarnSection>
        </Container>
    );
};

const Container = styled.section`
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
    max-width: 100%;
    grid-column: span 5;
    grid-row: span 2;
    grid-gap: 10px;
    @media screen and (max-width: 1024px) {
        grid-column: span 10;
    }
`;

const AprInfoContainer = styled(FlexDivStart)`
    @media (max-width: 767px) {
        flex-direction: column;
    }
`;

const TotalAprContainer = styled(FlexDivColumn)`
    border-right: 1px solid #ffffff;
    margin: 5px 30px 5px 0;
    @media (max-width: 767px) {
        border-right: none;
        margin-right: 0;
    }
`;

const TotalAprTitle = styled(FlexDivCentered)`
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    text-transform: uppercase;
    color: #ffffff;
`;

const TotalAprAmount = styled(FlexDivCentered)`
    font-weight: 700;
    font-size: 35px;
    line-height: 40px;
    letter-spacing: 0.035em;
    text-transform: uppercase;
    color: #50ce99;
`;

const AprContainer = styled(FlexDivSpaceBetween)`
    margin-right: 20px;
    flex: 1;
    :first-child {
        border-bottom: 1px solid #ffffff;
    }
    @media (max-width: 767px) {
        margin-right: 0;
    }
`;

const AprTitle = styled(FlexDivCentered)`
    font-weight: 300;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 0.035em;
    text-transform: capitalize;
    color: #ffffff;
`;

const AprAmount = styled(FlexDivCentered)`
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    text-transform: uppercase;
    color: #50ce99;
`;

const Title = styled(FlexDivCentered)`
    padding: 5px;
    font-family: Titillium Web;
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    text-transform: uppercase;
    color: #ffffff;
    text-align: center;
`;
const Amount = styled(FlexDivCentered)`
    position: relative;
    font-family: Roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 40px;
    line-height: 48px;
    color: #8208fc;
    text-align: center;
`;

export default Info;
