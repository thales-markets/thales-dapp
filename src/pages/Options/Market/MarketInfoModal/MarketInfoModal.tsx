import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ReactComponent as ArrowHyperlinkIcon } from 'assets/images/arrow-hyperlink.svg';
import { formatCurrencyWithSign, formatCurrency } from 'utils/formatters/number';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { USD_SIGN, SYNTHS_MAP } from 'constants/currency';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { Grid, Header, Modal, Table } from 'semantic-ui-react';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { OptionsMarketInfo } from 'types/options';

type MarketInfoModalProps = {
    marketHeading: React.ReactNode;
    optionMarket: OptionsMarketInfo;
    onClose: () => void;
};

export const MarketInfoModal: React.FC<MarketInfoModalProps> = ({ onClose, optionMarket, marketHeading }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    return (
        <Modal open={true} onClose={onClose} centered={false} closeIcon>
            <Modal.Content>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <Header style={{ textTransform: 'uppercase' }}>{marketHeading}</Header>
                        <Header style={{ textTransform: 'uppercase', marginBottom: 20 }}>
                            {t('options.market.info-modal.title')}
                        </Header>
                    </div>
                    <div>
                        <a
                            href={getEtherscanAddressLink(networkId, optionMarket.address)}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {t('common.contracts.view')} <ArrowHyperlinkIcon width="8" height="8" />
                        </a>
                    </div>
                </div>
                <Grid centered style={{ textTransform: 'uppercase' }}>
                    <Grid.Column width={8}>
                        <Table celled style={{ marginTop: 46 }}>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>{t('options.market.info-modal.table.currency-col')}</Table.Cell>
                                    <Table.Cell>{optionMarket.asset}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>{t('options.market.info-modal.table.strike-price-col')}</Table.Cell>
                                    <Table.Cell>
                                        {formatCurrencyWithSign(USD_SIGN, optionMarket.strikePrice)}
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>{t('options.market.info-modal.table.phase-col')}</Table.Cell>
                                    <Table.Cell style={{ textTransform: 'capitalize' }}>
                                        {optionMarket.phase}
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>{t('options.market.info-modal.table.bidding-end-col')}</Table.Cell>
                                    <Table.Cell>{formatShortDateWithTime(optionMarket.biddingEndDate)}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>{t('options.market.info-modal.table.maturity-col')}</Table.Cell>
                                    <Table.Cell>{formatShortDateWithTime(optionMarket.maturityDate)}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>{t('options.market.info-modal.table.expiry-col')}</Table.Cell>
                                    <Table.Cell>{formatShortDateWithTime(optionMarket.expiryDate)}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell />
                                    <Table.HeaderCell>{t('options.common.long')}</Table.HeaderCell>
                                    <Table.HeaderCell>{t('options.common.short')}</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>{t('options.market.info-modal.table.option-prices-col')}</Table.Cell>
                                    <Table.Cell>{formatCurrencyWithSign(USD_SIGN, optionMarket.longPrice)}</Table.Cell>
                                    <Table.Cell>{formatCurrencyWithSign(USD_SIGN, optionMarket.shortPrice)}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        {t('options.market.info-modal.table.total-outstanding-bids-col')}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {formatCurrencyWithSign(USD_SIGN, optionMarket.totalBids.long)}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {formatCurrencyWithSign(USD_SIGN, optionMarket.totalBids.short)}
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        {t('options.market.info-modal.table.total-outstanding-options-col')}
                                    </Table.Cell>
                                    <Table.Cell>{formatCurrency(optionMarket.totalSupplies.long)}</Table.Cell>
                                    <Table.Cell>{formatCurrency(optionMarket.totalSupplies.short)}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Trans
                                            i18nKey="options.market.info-modal.table.deposited-currency-col"
                                            values={{ currencyKey: SYNTHS_MAP.sUSD }}
                                            components={[<span key="span" />]}
                                        />
                                    </Table.Cell>
                                    <Table.Cell colSpan={2}>
                                        {formatCurrencyWithSign(USD_SIGN, optionMarket.deposits.deposited)}
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <Trans
                                            i18nKey={
                                                optionMarket.isResolved
                                                    ? 'options.market.info-modal.table.final-price-col'
                                                    : 'options.market.info-modal.table.current-price-col'
                                            }
                                            values={{ currencyKey: optionMarket.asset }}
                                            components={[<span key="span" />]}
                                        />
                                    </Table.Cell>
                                    <Table.Cell colSpan={2}>
                                        {formatCurrencyWithSign(
                                            USD_SIGN,
                                            optionMarket.isResolved
                                                ? optionMarket.finalPrice
                                                : optionMarket.currentPrice
                                        )}
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        {optionMarket.isResolved
                                            ? t('options.market.info-modal.table.final-result-col')
                                            : t('options.market.info-modal.table.current-result-col')}
                                    </Table.Cell>
                                    <Table.Cell colSpan={2} style={{ textTransform: 'uppercase' }}>
                                        {optionMarket.result}
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid>
            </Modal.Content>
        </Modal>
    );
};

export default MarketInfoModal;
