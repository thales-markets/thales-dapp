import { ReactComponent as ArrowUp } from 'assets/images/green-arrow-up.svg';
import { ReactComponent as ArrowDown } from 'assets/images/red-arrow-down.svg';
import Tooltip from 'components/Tooltip/Tooltip';
import { USD_SIGN } from 'constants/currency';
import { ScreenSizeBreakpoint } from 'enums/ui';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ValueType } from 'react-select';
import styled, { useTheme } from 'styled-components';
import {
    FlexDivCentered,
    FlexDivColumn,
    FlexDivColumnCentered,
    FlexDivRowCentered,
    FlexDivSpaceBetween,
} from 'styles/common';
import { CurrencyKeyOptionType } from 'types/options';
import { ThemeInterface } from 'types/ui';
import { formatCurrencyWithSign } from 'thales-utils';

type MarketSummaryProps = {
    currencyKey?: ValueType<CurrencyKeyOptionType, false>;
    strikingPrice?: number | string;
    currentPrice?: number | string;
    maturityDate?: string;
    initialFundingAmount?: number | string;
    timeLeftToExercise?: string;
};

const MarketSummary: React.FC<MarketSummaryProps> = (props) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    const difference = useMemo(() => {
        if (props.strikingPrice && props.currentPrice) {
            const percentage = (Number(props.strikingPrice) / Number(props.currentPrice) - 1) * 100;
            return { value: Math.abs(Math.round(percentage)), side: percentage > 0 };
        }
        return null;
    }, [props.strikingPrice, props.currentPrice]);

    return (
        <Wrapper>
            <SummaryHeader>{t('create-market.summary.title')}</SummaryHeader>
            <SummaryContent>
                <CurrencyContainer>{props.currencyKey && <>{props.currencyKey.label}</>}</CurrencyContainer>
                <PriceContainer>
                    <PriceItem>
                        <PriceLabel>{t('create-market.summary.strike-price')}</PriceLabel>
                        <PriceInfo>{formatCurrencyWithSign(USD_SIGN, Number(props.strikingPrice))}</PriceInfo>
                    </PriceItem>
                    <PriceItem>
                        {difference && (
                            <Tooltip overlay="Difference between strike and current price">
                                <FlexDivRowCentered>
                                    {difference.side ? <StyledArrowUp /> : <StyledArrowDown />}
                                    <PriceInfo
                                        color={difference.side ? theme.textColor.quaternary : theme.textColor.tertiary}
                                    >
                                        {difference.value}%
                                    </PriceInfo>
                                </FlexDivRowCentered>
                            </Tooltip>
                        )}
                    </PriceItem>
                    <PriceItem>
                        <PriceLabel>{t('create-market.summary.current')}</PriceLabel>
                        <PriceInfo>{formatCurrencyWithSign(USD_SIGN, Number(props.currentPrice))}</PriceInfo>
                    </PriceItem>
                </PriceContainer>
            </SummaryContent>
            <MarketInfo>
                <InfoContainer>
                    <InfoItem>
                        <Label>{t('create-market.summary.dates.maturity-date')}</Label>

                        <Info>{props.maturityDate}</Info>
                    </InfoItem>
                    <InfoItem>
                        <Label>{t('create-market.summary.dates.time-to-exercise')}</Label>
                        <Info>{props.timeLeftToExercise}</Info>
                    </InfoItem>
                </InfoContainer>
            </MarketInfo>
        </Wrapper>
    );
};

const Wrapper = styled(FlexDivColumn)`
    margin-left: 40px;
    font-size: 20px;
    line-height: 32px;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.primary};
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-left: 0px;
    }
`;

const SummaryHeader = styled.div`
    white-space: pre;
    padding: 10px 0px;
    width: 100%;
    border-bottom: 1px solid ${(props) => props.theme.borderColor.secondary};
    text-align: center;
`;

const SummaryContent = styled(FlexDivColumn)`
    min-height: 160px;
    justify-content: space-around;
`;

const CurrencyContainer = styled(FlexDivCentered)`
    height: 32px;
`;

const PriceContainer = styled(FlexDivCentered)``;

const PriceItem = styled(FlexDivColumnCentered)`
    align-items: center;
    text-align: center;
`;

const PriceLabel = styled.span`
    font-weight: bold;
    font-size: 13px;
    line-height: 24px;
    color: ${(props) => props.theme.textColor.secondary};
`;

const PriceInfo = styled.span<{ color?: string }>`
    font-weight: bold;
    font-size: 16px;
    line-height: 26px;
    color: ${(props) => props.color || props.theme.textColor.primary};
`;

const InfoContainer = styled.div`
    border: 2px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 23px;
    padding: 15px 24px;
`;

const InfoItem = styled(FlexDivSpaceBetween)`
    :first-child {
        border-bottom: 1px solid ${(props) => props.theme.borderColor.secondary};
    }
`;

const Label = styled.span`
    font-weight: bold;
    font-size: 13px;
    line-height: 24px;
    color: ${(props) => props.theme.textColor.secondary};
`;

const Info = styled.span`
    font-weight: bold;
    font-size: 13px;
    line-height: 24px;
    color: ${(props) => props.theme.textColor.primary};
`;

const StyledArrowUp = styled(ArrowUp)`
    width: 15;
    height: 15;
    margin-right: 4px;
    path {
        fill: ${(props) => props.theme.textColor.quaternary};
    }
`;

const StyledArrowDown = styled(ArrowDown)`
    width: 15;
    height: 15;
    margin-right: 4px;
    path {
        fill: ${(props) => props.theme.textColor.tertiary};
    }
`;

const MarketInfo = styled(FlexDivColumn)`
    padding: 20px 38px;
    font-size: 12px;
    @media screen and (max-width: 1200px) {
        padding: 20px 0px;
    }
    @media screen and (max-width: 1024px) {
        padding: 35px 38px;
    }
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 0px;
        width: 100%;
        margin-top: 45px;
    }
`;

export default MarketSummary;
