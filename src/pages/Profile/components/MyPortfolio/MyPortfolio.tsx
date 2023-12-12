import Button from 'components/Button';
import SPAAnchor from 'components/SPAAnchor';
import { USD_SIGN } from 'constants/currency';
import i18n from 'i18n';
import useExchangeRatesQuery, { Rates } from 'queries/rates/useExchangeRatesQuery';
import useMultipleCollateralBalanceQuery from 'queries/walletBalances/useMultipleCollateralBalanceQuery';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsMobile } from 'redux/modules/ui';
import { getIsAA, getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled, { useTheme } from 'styled-components';
import { FlexDiv } from 'styles/common';
import { formatCurrency, formatCurrencyWithSign } from 'thales-utils';
import { ThemeInterface } from 'types/ui';
import { getCollaterals } from 'utils/currency';
import { buildDepositOrWithdrawLink } from 'utils/routes';

const MyPortfolio: React.FC = () => {
    const theme: ThemeInterface = useTheme();
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAA = useSelector((state: RootState) => getIsAA(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const language = i18n.language;

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
                getCollaterals(networkId, isAA).forEach((token) => {
                    total += multipleCollateralBalances.data[token] * (exchangeRates[token] ? exchangeRates[token] : 1);
                });
            }

            return total ? total : 'N/A';
        } catch (e) {
            return 'N/A';
        }
    }, [exchangeRates, multipleCollateralBalances.data, networkId, isAA]);

    return (
        <>
            <BalanceWrapper>
                <Heading>{t('my-portfolio.estimated-balance')}</Heading>
                <BalanceAmount>{formatCurrencyWithSign(USD_SIGN, totalBalanceValue)}</BalanceAmount>
            </BalanceWrapper>
            <Wrapper>
                {getCollaterals(networkId, isAA).map((token, index) => {
                    return (
                        <CollateralItem key={index}>
                            <CollateralName>
                                <TokenIcon className={`currency-icon currency-icon--${token.toLowerCase()}`} />
                                {token}
                            </CollateralName>
                            <TokenBalance>
                                {multipleCollateralBalances.data
                                    ? formatCurrency(multipleCollateralBalances.data[token])
                                    : 0}{' '}
                                {token}
                                {exchangeRates && multipleCollateralBalances.data && !isMobile
                                    ? ` ( $ ${formatCurrency(
                                          multipleCollateralBalances.data[token] * exchangeRates[token]
                                      )})`
                                    : ``}
                            </TokenBalance>
                            <ButtonWrapper>
                                <SPAAnchor href={buildDepositOrWithdrawLink(language, 'deposit', index)}>
                                    <Button
                                        additionalStyles={{
                                            borderRadius: '5px',
                                            fontWeight: '600',
                                            marginRight: '20px',
                                        }}
                                        fontSize="13px"
                                        padding="5px 30px"
                                        backgroundColor={theme.button.background.primary}
                                        textColor={theme.button.textColor.primary}
                                    >
                                        {t('my-portfolio.deposit')}
                                    </Button>
                                </SPAAnchor>
                                <SPAAnchor href={buildDepositOrWithdrawLink(language, 'withdraw', index)}>
                                    <Button
                                        additionalStyles={{
                                            borderRadius: '5px',
                                            fontWeight: '600',
                                            marginRight: '20px',
                                        }}
                                        fontSize="13px"
                                        padding="5px 30px"
                                        backgroundColor={theme.button.background.secondary}
                                        textColor={theme.button.textColor.quinary}
                                    >
                                        {t('my-portfolio.withdraw')}
                                    </Button>
                                </SPAAnchor>
                            </ButtonWrapper>
                        </CollateralItem>
                    );
                })}
            </Wrapper>
        </>
    );
};

const Wrapper = styled(FlexDiv)`
    flex-direction: column;
    width: 100%;
    background-color: ${(props) => props.theme.background.secondary};
    padding: 20px 27px;
    margin-top: 10px;
`;

const BalanceWrapper = styled(FlexDiv)`
    margin-top: 20px;
    padding: 20px 27px;
    width: 100%;
    justify-content: flex-start;
    flex-direction: column;
    background-color: ${(props) => props.theme.background.secondary};
`;

const Heading = styled.h2`
    font-weight: 700;
    font-size: 12px;
    text-transform: capitalize;
    letter-spacing: 3.5px;
    color: ${(props) => props.theme.textColor.primary};
`;

const BalanceAmount = styled.span`
    font-size: 32px;
    font-weight: 700;
    line-height: 33.54px;
    margin: 5px 0px;
    color: ${(props) => props.theme.textColor.primary};
`;

const CollateralItem = styled(FlexDiv)`
    flex-direction: row;
    width: 100%;
    border-bottom: 1px ${(props) => props.theme.borderColor.quinary} dotted;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0px;
    color: ${(props) => props.theme.textColor.primary};
`;

const CollateralName = styled(FlexDiv)`
    font-size: 12px;
    letter-spacing: 3.5px;
    align-items: center;
    width: 20%;
    justify-content: flex-start;
    @media (max-width: 575px) {
        font-size: 10px;
    }
`;

const TokenIcon = styled.i`
    font-size: 20px;
    margin-right: 12px;
`;

const TokenBalance = styled(FlexDiv)`
    font-size: 12px;
    font-weight: 700;
    width: 25%;
    text-align: right;
    justify-content: flex-end;
    @media (max-width: 575px) {
        font-size: 10px;
    }
`;

const ButtonWrapper = styled(FlexDiv)`
    font-size: 13px;
    font-family: Fira Sans;
    font-weight: 600;
    text-transform: uppercase;
    line-height: 13px;
`;

export default MyPortfolio;
