import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ReactComponent as ArrowHyperlinkIcon } from 'assets/images/arrow-hyperlink.svg';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { USD_SIGN, SYNTHS_MAP } from 'constants/currency';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { OptionsMarketInfo } from 'types/options';
import {
    ModalContainer,
    ModalTitle,
    StyledModal,
    ModalHeader,
    CloseIconContainer,
} from '../TradeOptions/Orderbook/components';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivRow } from 'theme/common';
import { COLORS } from 'constants/ui';

type MarketInfoModalProps = {
    marketHeading: React.ReactNode;
    optionMarket: OptionsMarketInfo;
    onClose: () => void;
};

export const MarketInfoModal: React.FC<MarketInfoModalProps> = ({ onClose, optionMarket, marketHeading }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    return (
        <StyledModal open onClose={onClose}>
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle>{t('options.market.info-modal.title')}</ModalTitle>
                    <CloseIconContainer onClick={onClose} />
                </ModalHeader>
                <MarketTitle>{marketHeading}</MarketTitle>
                <FlexDivCentered>
                    <StyledLink
                        href={getEtherscanAddressLink(networkId, optionMarket.address)}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {t('common.contracts.view')} <ArrowIcon width="8" height="8" />
                    </StyledLink>
                </FlexDivCentered>
                <Section>
                    <SectionItem>
                        <span>{t('options.market.info-modal.table.currency-col')}</span>
                        <span>{optionMarket.asset}</span>
                    </SectionItem>
                    <SectionItem>
                        <span>{t('options.market.info-modal.table.strike-price-col')}</span>
                        <span>{formatCurrencyWithSign(USD_SIGN, optionMarket.strikePrice)}</span>
                    </SectionItem>
                    <SectionItem>
                        <span>{t('options.market.info-modal.table.phase-col')}</span>
                        <Phase>{optionMarket.phase}</Phase>
                    </SectionItem>
                    <SectionItem>
                        <span>{t('options.market.info-modal.table.maturity-col')}</span>
                        <span>{formatShortDateWithTime(optionMarket.maturityDate)}</span>
                    </SectionItem>
                    <SectionItem>
                        <span>{t('options.market.info-modal.table.expiry-col')}</span>
                        <span>{formatShortDateWithTime(optionMarket.expiryDate)}</span>
                    </SectionItem>
                </Section>

                <Section>
                    <SectionItem>
                        <span>
                            {t('options.market.info-modal.table.deposited-currency-col', {
                                currencyKey: SYNTHS_MAP.sUSD,
                            })}
                        </span>
                        <span>{formatCurrencyWithSign(USD_SIGN, optionMarket.deposited)}</span>
                    </SectionItem>
                    <SectionItem>
                        <span>
                            {optionMarket.isResolved
                                ? t('options.market.info-modal.table.final-price-col', {
                                      currencyKey: optionMarket.asset,
                                  })
                                : t('options.market.info-modal.table.current-price-col', {
                                      currencyKey: optionMarket.asset,
                                  })}
                        </span>
                        <span>
                            {formatCurrencyWithSign(
                                USD_SIGN,
                                optionMarket.isResolved ? optionMarket.finalPrice : optionMarket.currentPrice
                            )}
                        </span>
                    </SectionItem>
                    <SectionItem>
                        <span>
                            {optionMarket.isResolved
                                ? t('options.market.info-modal.table.final-result-col')
                                : t('options.market.info-modal.table.current-result-col')}
                        </span>

                        <Result isLong={optionMarket.result === 'long'}>{optionMarket.result}</Result>
                    </SectionItem>
                </Section>
            </ModalContainer>
        </StyledModal>
    );
};

const Section = styled.div`
    background: linear-gradient(148.33deg, rgba(255, 255, 255, 0.03) -2.8%, rgba(255, 255, 255, 0.01) 106.83%);
    box-shadow: 0px 25px 30px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(4px);
    border-radius: 23px;
    padding: 15px 25px;
    &:not(:last-child) {
        margin-bottom: 20px;
    }
`;

const SectionItem = styled(FlexDivRow)`
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.25px;
    color: #f6f6fe;
    padding: 8px 0;
    &:not(:last-child) {
        border-bottom: 0.5px solid #748bc6;
    }
`;

const Phase = styled.span`
    text-transform: uppercase;
`;

const Result = styled.span<{ isLong: boolean }>`
    color: ${(props) => (props.isLong ? COLORS.LONG : COLORS.SHORT)};
    text-transform: uppercase;
`;

const MarketTitle = styled(FlexDivCentered)`
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    color: #f6f6fe;
    margin-top: 30px;
`;

const StyledLink = styled.a`
    font-weight: 300;
    font-size: 13px;
    line-height: 24px;
    letter-spacing: 0.4px;
    color: #00f9ff;
    margin-bottom: 15px;
    &:hover {
        color: #f6f6fe;
    }
`;

export const ArrowIcon = styled(ArrowHyperlinkIcon)`
    ${StyledLink} & path {
        fill: #00f9ff;
    }
    ${StyledLink}:hover & path {
        fill: #f6f6fe;
    }
`;

export default MarketInfoModal;
