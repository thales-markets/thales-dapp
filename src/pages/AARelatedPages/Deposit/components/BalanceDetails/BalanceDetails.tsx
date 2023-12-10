import { USD_SIGN } from 'constants/currency';
import useExchangeRatesQuery, { Rates } from 'queries/rates/useExchangeRatesQuery';
import useMultipleCollateralBalanceQuery from 'queries/walletBalances/useMultipleCollateralBalanceQuery';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress, getIsWalletConnected, getIsAA } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDiv } from 'styles/common';
import { Coins, formatCurrency, formatCurrencyWithSign } from 'thales-utils';
import { getCollateralsAA, isStableCurrency } from 'utils/currency';

const BalanceDetails: React.FC = () => {
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAA = useSelector((state: RootState) => getIsAA(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const multipleCollateralBalances = useMultipleCollateralBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const exchangeRatesQuery = useExchangeRatesQuery(networkId, {
        enabled: isAppReady,
    });

    const exchangeRates: Rates | null =
        exchangeRatesQuery.isSuccess && exchangeRatesQuery.data ? exchangeRatesQuery.data : null;

    const totalBalanceValue = useMemo(() => {
        let total = 0;
        try {
            if (exchangeRates && multipleCollateralBalances.data) {
                getCollateralsAA(networkId, isAA).forEach((token) => {
                    total += multipleCollateralBalances.data[token] * (exchangeRates[token] ? exchangeRates[token] : 1);
                });
            }

            return total ? total : 'N/A';
        } catch (e) {
            return 'N/A';
        }
    }, [exchangeRates, multipleCollateralBalances.data, networkId, isAA]);

    const getUSDForCollateral = useCallback(
        (token: Coins) =>
            (multipleCollateralBalances.data ? multipleCollateralBalances.data[token] : 0) *
            (isStableCurrency(token as Coins) ? 1 : exchangeRates?.[token] || 0),
        [multipleCollateralBalances, exchangeRates]
    );

    return (
        <BalanceWrapper>
            <SectionLabel>{t('my-portfolio.estimated-balance')}</SectionLabel>
            <TotalBalance>{formatCurrencyWithSign(USD_SIGN, totalBalanceValue)}</TotalBalance>
            <TokenBalancesWrapper>
                {getCollateralsAA(networkId, isAA).map((token, index) => {
                    return (
                        <IndividualTokenBalanceWrapper key={`ind-token-${index}`}>
                            <Token>
                                <TokenIcon className={`currency-icon currency-icon--${token.toLowerCase()}`} />
                                <TokenName> {token}</TokenName>
                            </Token>
                            <IndividualTokenBalance>
                                {multipleCollateralBalances.data
                                    ? formatCurrency(multipleCollateralBalances.data[token])
                                    : 0}
                            </IndividualTokenBalance>
                            <IndividualTokenBalance>
                                {!exchangeRates?.[token] && !isStableCurrency(token as Coins)
                                    ? '...'
                                    : ` (${formatCurrencyWithSign(USD_SIGN, getUSDForCollateral(token as Coins))})`}
                            </IndividualTokenBalance>
                        </IndividualTokenBalanceWrapper>
                    );
                })}
            </TokenBalancesWrapper>
        </BalanceWrapper>
    );
};

const BalanceWrapper = styled(FlexDiv)`
    flex-direction: column;
    border: 1px ${(props) => props.theme.borderColor.primary} solid;
    border-radius: 20px;
    padding: 19px;
    margin-bottom: 20px;
    background-color: ${(props) => props.theme.background.secondary};
`;

const SectionLabel = styled.span`
    font-size: 12px;
    font-weight: 700;
    text-transform: capitalize;
    letter-spacing: 3px;
    margin-bottom: 13px;
    color: ${(props) => props.theme.textColor.secondary};
`;

const TotalBalance = styled.span`
    font-size: 42px;
    font-weight: 700;
    width: 100%;
    border-bottom: 2px ${(props) => props.theme.borderColor.secondary} solid;
    margin-bottom: 20px;
    padding-bottom: 20px;
    color: ${(props) => props.theme.textColor.primary};
`;

const TokenBalancesWrapper = styled(FlexDiv)`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const IndividualTokenBalanceWrapper = styled(FlexDiv)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    min-width: 150px;
    margin-right: 10px;
    @media (max-width: 575px) {
        margin-right: 10px;
    }
`;

const Token = styled(FlexDiv)`
    align-items: center;
`;

const TokenName = styled.span`
    font-weight: 700;
    font-size: 12px;
    color: ${(props) => props.theme.textColor.primary};
`;

const TokenIcon = styled.i`
    font-size: 20px;
    margin-right: 5px;
    color: ${(props) => props.theme.textColor.primary};
    font-weight: 100;
`;

const IndividualTokenBalance = styled.span`
    font-size: 12px;
    font-weight: 600;
    text-align: right;
    color: ${(props) => props.theme.textColor.primary};
`;

export default BalanceDetails;
