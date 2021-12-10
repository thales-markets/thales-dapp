import React, { useState } from 'react';
import styled from 'styled-components';
import MarketWidgetHeader from '../components/MarketWidget/MarketWidgetHeader';
import { COLORS, MarketWidgetKey } from '../../../../constants/ui';
import { FlexDiv, FlexDivCentered, FlexDivRow } from '../../../../theme/common';
import { ReactComponent as WalletIcon } from '../../../../assets/images/wallet-dark.svg';
import {
    Container,
    CurrencyLabel,
    InputLabel,
    ReactSelect,
    ShortInputContainer,
    SliderContainer,
    SliderRange,
    SubmitButton,
    SubmitButtonContainer,
    Wallet,
    WalletContainer,
} from '../components';
import { formatCurrencyWithKey } from '../../../../utils/formatters/number';
import { OPTIONS_CURRENCY_MAP, SYNTHS_MAP, USD_SIGN } from '../../../../constants/currency';
import { EMPTY_VALUE } from '../../../../constants/placeholder';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from '../../../../redux/modules/wallet';
import useSynthsBalancesQuery from '../../../../queries/walletBalances/useSynthsBalancesQuery';
import { getCurrencyKeyBalance } from '../../../../utils/balances';
import { getIsAppReady } from '../../../../redux/modules/app';
import { AccountMarketInfo, OptionSide, OrderSide } from '../../../../types/options';
import useBinaryOptionsAccountMarketInfoQuery from '../../../../queries/options/useBinaryOptionsAccountMarketInfoQuery';
import { useMarketContext } from '../contexts/MarketContext';
import { useTranslation } from 'react-i18next';
import { OrderSideOptionType } from '../TradeOptions/PlaceOrder/PlaceOrder';
import NumericInput from '../components/NumericInput';
import quickTradingImg from 'assets/images/amm-quick-trading.svg';
import { BuySlider, SellSlider } from '../../CreateMarket/components';

type AMMProps = {
    optionSide: OptionSide;
};

const AMM: React.FC<AMMProps> = ({ optionSide }) => {
    const { t } = useTranslation();
    const optionsMarket = useMarketContext();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const accountMarketInfoQuery = useBinaryOptionsAccountMarketInfoQuery(optionsMarket.address, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    const orderSideOptions = [
        {
            value: 'buy' as OrderSide,
            label: t('common.buy'),
        },
        {
            value: 'sell' as OrderSide,
            label: t('common.sell'),
        },
    ];

    const [orderSide, setOrderSide] = useState<OrderSideOptionType>(orderSideOptions[0]);
    const [selectedOption, setSelectedOption] = useState<boolean>(true);

    let optBalances = {
        long: 0,
        short: 0,
    };

    if (isWalletConnected && accountMarketInfoQuery.isSuccess && accountMarketInfoQuery.data) {
        optBalances = accountMarketInfoQuery.data as AccountMarketInfo;
    }
    const tokenBalance = optionSide === 'long' ? optBalances.long : optBalances.short;

    const synthsWalletBalancesQuery = useSynthsBalancesQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });
    const walletBalancesMap =
        synthsWalletBalancesQuery.isSuccess && synthsWalletBalancesQuery.data
            ? { synths: synthsWalletBalancesQuery.data }
            : null;
    const sUSDBalance = getCurrencyKeyBalance(walletBalancesMap, SYNTHS_MAP.sUSD) || 0;

    return (
        <AMMWrapper>
            <Widget>
                <MarketWidgetHeader widgetKey={MarketWidgetKey.AMM}>
                    <FlexDivCentered>
                        <WalletIcon />
                        <WalletContainer>
                            {isWalletConnected ? (
                                <>
                                    <Wallet>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, sUSDBalance)}</Wallet>
                                    <Wallet>
                                        {formatCurrencyWithKey(OPTIONS_CURRENCY_MAP[optionSide], tokenBalance)}
                                    </Wallet>
                                </>
                            ) : (
                                EMPTY_VALUE
                            )}
                        </WalletContainer>
                    </FlexDivCentered>
                </MarketWidgetHeader>
                <Container>
                    <FlexDivRow>
                        <ShortInputContainer>
                            <ReactSelect
                                formatOptionLabel={(option: any) => option.label}
                                options={orderSideOptions}
                                value={orderSide}
                                onChange={(option: any) => setOrderSide(option)}
                                isSearchable={false}
                                isUppercase
                                // isDisabled={isSubmitting}
                                // className={isSubmitting ? 'disabled' : ''}
                            />
                            <InputLabel>{t('options.market.trade-options.place-order.order-type-label')}</InputLabel>
                        </ShortInputContainer>
                        <ShortInputContainer>
                            <UnusableInput value={50} onChange={(_, _value) => {}} disabled={true} />
                            <UnusableInputLabel>Higher Than</UnusableInputLabel>
                            <UnusableCurrencyLabel>{'USD'}</UnusableCurrencyLabel>
                        </ShortInputContainer>
                    </FlexDivRow>
                    <FlexDivRow>
                        <ShortContainer>
                            <OptionButtonWrapper>
                                <OptionButton
                                    onClick={() => setSelectedOption(true)}
                                    className={selectedOption ? 'selected' : ''}
                                >
                                    UP
                                </OptionButton>
                            </OptionButtonWrapper>
                            <OptionButtonWrapper>
                                <OptionButton
                                    onClick={() => setSelectedOption(false)}
                                    className={!selectedOption ? 'selected' : ''}
                                >
                                    DOWN
                                </OptionButton>
                            </OptionButtonWrapper>
                        </ShortContainer>
                        <ShortInputContainer>
                            <UnusableInput value={50} onChange={(_, _value) => {}} disabled={true} />
                            <UnusableInputLabel>Strike Date</UnusableInputLabel>
                        </ShortInputContainer>
                    </FlexDivRow>
                    <FlexDivRow>
                        <ShortContainer>
                            <AmountInputWrapper>
                                <AmountInput />
                                <AmountInputLabel>YOU SELL</AmountInputLabel>
                            </AmountInputWrapper>
                            <img width={30} height={30} src={quickTradingImg} />
                            <AmountInputWrapper>
                                <AmountInput />
                                <AmountInputLabel>YOU RECEIVE</AmountInputLabel>
                            </AmountInputWrapper>
                        </ShortContainer>
                        <ShortInputContainerRow>
                            <ShortInputContainer>
                                <UnusableInput value={50} onChange={(_, _value) => {}} disabled={true} />
                                <UnusableInputLabel>Slippage</UnusableInputLabel>
                            </ShortInputContainer>
                            <ShortInputContainer>
                                <UnusableInput value={50} onChange={(_, _value) => {}} disabled={true} />
                                <UnusableInputLabel>Price per option</UnusableInputLabel>
                            </ShortInputContainer>
                        </ShortInputContainerRow>
                    </FlexDivRow>
                    <FlexDivRow>
                        <BuySellSliderContainer>
                            {selectedOption ? (
                                <BuySlider
                                    value={Number(0)}
                                    step={0.01}
                                    max={1}
                                    min={0}
                                    // onChange={(_, value) => {
                                    //     setIsPriceValid(Number(value) <= 1);
                                    //     setPrice(Number(value));
                                    // }}
                                    // disabled={isSubmitting}
                                />
                            ) : (
                                <SellSlider
                                    value={Number(0)}
                                    step={0.01}
                                    max={1}
                                    min={0}
                                    // onChange={(_, value) => {
                                    //     setIsPriceValid(Number(value) <= 1);
                                    //     setPrice(Number(value));
                                    // }}
                                    // disabled={isSubmitting}
                                />
                            )}
                            <FlexDivRow>
                                <SliderRange
                                    color={selectedOption ? COLORS.BUY : COLORS.SELL}
                                >{`${USD_SIGN}0`}</SliderRange>
                                <SliderRange
                                    color={selectedOption ? COLORS.BUY : COLORS.SELL}
                                >{`${USD_SIGN}1`}</SliderRange>
                            </FlexDivRow>
                        </BuySellSliderContainer>
                    </FlexDivRow>
                </Container>
                <StyledSubmitButtonContainer>
                    <FlexDivCentered>
                        <SubmitButton isBuy={selectedOption} onClick={() => {}}>
                            {t('common.wallet.connect-your-wallet')}
                        </SubmitButton>
                    </FlexDivCentered>
                </StyledSubmitButtonContainer>
            </Widget>
            <Info>
                <Container>
                    <h1>WHAT IS AMM TRADING</h1>
                    <p>
                        You could think of an automated market maker as a robot that’s always willing to quote you a
                        price between two assets. Some use a simple formula like Uniswap, while Curve, Balancer and
                        others use more complicated ones.
                    </p>
                    <p>
                        Not only can you trade trustlessly using an AMM, but you can also become the house by providing
                        liquidity to a liquidity pool. This allows essentially anyone to become a market maker on an
                        exchange and earn fees for providing liquidity.
                    </p>
                    <p>
                        AMMs have really carved out their niche in the DeFi space due to how simple and easy they are to
                        use. Decentralizing market making this way is intrinsic to the vision of crypt
                    </p>
                </Container>
            </Info>
        </AMMWrapper>
    );
};

const AMMWrapper = styled.div`
    display: flex;
    height: 100%;
    margin-top: 20px !important;
`;

const Widget = styled.div`
    flex: 1;
    overflow: auto;
    border-radius: 23px;
    background: linear-gradient(90deg, #3936c7 -8.53%, #2d83d2 52.71%, #23a5dd 105.69%, #35dadb 127.72%);
`;

const Info = styled.div`
    flex: 1;
    overflow: auto;
    padding: 10px;
    color: #fefefe;
    & p {
        padding-top: 20px;
        font-size: 16px;
        line-height: 24px;
    }
`;

const ShortContainer = styled(FlexDiv)`
    width: 50%;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    margin-right: 10px;
`;

const OptionButtonWrapper = styled.div`
    width: 40%;
`;

const OptionButton = styled.button`
    cursor: pointer;
    font-weight: bold;
    border: 2px solid #0c1c68;
    background: transparent;
    border-radius: 20px;
    width: 100%;
    padding: 10px;
    color: #fefefe;
    &.selected {
        background: #0c1c68;
        border: 2px solid #00f9ff;
    }
`;

const UnusableInput = styled(NumericInput)`
    background: #b8c6e5;
    color: #0c1c68;
    border: none;
    &:disabled {
        opacity: 1;
        cursor: default;
    }
`;

const UnusableInputLabel = styled(InputLabel)`
    color: #0c1c68;
`;

const UnusableCurrencyLabel = styled(CurrencyLabel)`
    color: #0c1c68;
`;

const ShortInputContainerRow = styled(ShortInputContainer)`
    width: 49%;
    flex-direction: row;
    & div {
        width: 48%;
        margin-bottom: 0;
    }
`;

const AmountInputWrapper = styled.div`
    position: relative;
    width: 40%;
`;

const AmountInput = styled.input`
    cursor: pointer;
    font-weight: bold;
    background: #f6f6fe;
    border: 2px solid #0c1c68;
    border-radius: 20px;
    width: 100%;
    padding: 10px 14px;
    color: #0c1c68;
`;

const AmountInputLabel = styled.span`
    color: #fefefe;
    position: absolute;
    top: -16px;
    left: 8px;
    font-size: 10px;
`;

const BuySellSliderContainer = styled(SliderContainer)`
    margin-right: 10px;
    margin-top: 0;
    padding: 0 10px;
`;

const StyledSubmitButtonContainer = styled(SubmitButtonContainer)`
    margin-top: 20px;
`;

export default AMM;
