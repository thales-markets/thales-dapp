import { USD_SIGN } from 'constants/currency';
import useETHBurnedCountQuery from 'queries/options/useETHBurnedCountQuery';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn } from 'theme/common';
import { ETHBurned } from 'types/options';
import { formatCurrencyWithKey, formatCurrencyWithSign } from 'utils/formatters/number';
import { CRYPTO_CURRENCY_MAP } from 'constants/currency';

const ETHBurnedCount: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [ethBurned, setEthBurned] = useState<ETHBurned | undefined>(undefined);

    const ethBurnedQuery = useETHBurnedCountQuery({
        enabled: isAppReady,
    });

    useEffect(() => {
        if (ethBurnedQuery.isSuccess && ethBurnedQuery.data) {
            setEthBurned(ethBurnedQuery.data);
        }
    }, [ethBurnedQuery.isSuccess, ethBurnedQuery.data]);

    return (
        <Container>
            <CountContainer>
                <Title>{t('options.market.overview.total-burned')}</Title>
                <Amount>{ethBurned ? formatCurrencyWithKey(CRYPTO_CURRENCY_MAP.ETH, ethBurned.total) : '-'}</Amount>
                <USDAmount>{ethBurned ? formatCurrencyWithSign(USD_SIGN, ethBurned.totalUsd) : '-'}</USDAmount>
            </CountContainer>
            <CountContainer>
                <Title>{t('options.market.overview.burned-yesterday')}</Title>
                <Amount>{ethBurned ? formatCurrencyWithKey(CRYPTO_CURRENCY_MAP.ETH, ethBurned.yesterday) : '-'}</Amount>
                <USDAmount>{ethBurned ? formatCurrencyWithSign(USD_SIGN, ethBurned.yesterdayUsd) : '-'}</USDAmount>
            </CountContainer>
        </Container>
    );
};

const Container = styled(FlexDivCentered)`
    padding: 40px 10px 20px 10px;
    self-align: center;
    @media (max-width: 767px) {
        flex-direction: column;
    }
`;

const CountContainer = styled(FlexDivColumn)`
    padding: 20px 10px;
    position: relative;
    border-radius: 15px;
    border: 2px solid #00d1ff;
    max-width: 220px;
    &:first-child {
        margin-right: 50px;
        @media (max-width: 767px) {
            margin-right: 0;
            margin-bottom: 20px;
        }
    }
`;

const Title = styled.span`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    color: #ffffff;
`;

const Amount = styled.span`
    font-weight: bold;
    font-size: 25px;
    line-height: 48px;
    text-align: center;
    color: #00d1ff;
`;

const USDAmount = styled.span`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    background: linear-gradient(90deg, #3936c7, #2d83d2, #23a5dd, #35dadb);
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;
`;

export default ETHBurnedCount;
