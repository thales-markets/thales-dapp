import React from 'react';
import styled from 'styled-components';
import ZeusPotentialWinBackground from 'assets/images/zeus-potential-win.png';
import ZeusResolvedWinBackground from 'assets/images/ZeusResolvedWinBackground.png';
import Footer from '../Footer/Footer';
import { FlexDiv } from 'styles/common';
import { useTranslation } from 'react-i18next';
import { getSynthName } from 'utils/currency';
import QRCode from 'react-qr-code';
import useGetReffererIdQuery from 'queries/referral/useGetReffererIdQuery';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { buildReferrerLink } from 'utils/routes';
import ROUTES from 'constants/routes';
import { USD_SIGN } from 'constants/currency';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { SharePositionData, SharePositionType } from '../../SharePositionModal';

const MarketFlexCard: React.FC<SharePositionData> = ({
    type,
    position,
    currencyKey,
    strikePrice,
    leftPrice,
    rightPrice,
    strikeDate,
    buyIn,
    payout,
}) => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const reffererIDQuery = useGetReffererIdQuery(walletAddress || '', { enabled: !!walletAddress });
    const reffererID = reffererIDQuery.isSuccess && reffererIDQuery.data ? reffererIDQuery.data : '';

    const potentialWinFormatted = `${formatCurrencyWithSign(USD_SIGN, Number(payout))}`;

    const price =
        typeof strikePrice == 'string' && strikePrice
            ? strikePrice
            : strikePrice
            ? formatCurrencyWithSign(USD_SIGN, strikePrice ?? 0)
            : `${formatCurrencyWithSign(USD_SIGN, leftPrice ?? 0)} <-> ${formatCurrencyWithSign(
                  USD_SIGN,
                  rightPrice ?? 0
              )}`;

    return (
        <Container type={type}>
            {type == 'resolved' && <Footer />}
            {reffererID && (
                <ReferralWrapper>
                    <QRCode size={70} value={buildReferrerLink(ROUTES.Home, reffererID)} />
                </ReferralWrapper>
            )}
            <PositionInfo type={type}>
                <CurrencyIcon className={`currency-icon currency-icon--${currencyKey.toLowerCase()}`} />
                <AssetName>{getSynthName(currencyKey)}</AssetName>
                <Position>{`${currencyKey.toUpperCase()} ${position}`}</Position>
            </PositionInfo>
            <PotentialWinContainer>
                <PotentialWinHeading type={type}>
                    {type == 'potential' ? t('common.flex-card.potential-win') : t('common.flex-card.won')}
                </PotentialWinHeading>
                <PotentialWin type={type}>{potentialWinFormatted}</PotentialWin>
            </PotentialWinContainer>
            <MarketDetailsContainer type={type}>
                <MarketDetailsItemContainer type={type}>
                    <ItemName type={type}>{t('common.flex-card.strike-price')}</ItemName>
                    <Value type={type}>{price}</Value>
                </MarketDetailsItemContainer>
                <MarketDetailsItemContainer type={type}>
                    <ItemName type={type}>{t('common.flex-card.strike-date')}</ItemName>
                    <Value type={type}>{formatShortDateWithTime(strikeDate)}</Value>
                </MarketDetailsItemContainer>
                <MarketDetailsItemContainer type={type}>
                    <ItemName type={type}>{t('common.flex-card.buy-in')}</ItemName>
                    <Value type={type}>{formatCurrencyWithSign(USD_SIGN, buyIn ?? 0)}</Value>
                </MarketDetailsItemContainer>
            </MarketDetailsContainer>
            {type == 'potential' && <Footer />}
        </Container>
    );
};

const Container = styled.div<{ type?: SharePositionType }>`
    border: 10px solid ${(props) => (props.type == 'potential' ? '#03dac5' : '#9b8327')};
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 383px;
    height: 510px;
    padding: 10px 10px;
    background: url(${(props) => (props.type == 'potential' ? ZeusPotentialWinBackground : ZeusResolvedWinBackground)})
        lightgray 50% / cover no-repeat;
`;

const MarketDetailsContainer = styled(FlexDiv)<{ type: SharePositionType }>`
    width: 100%;
    flex-direction: ${(props) => (props.type == 'potential' ? 'column' : 'row')};
    margin-bottom: ${(props) => (props.type == 'potential' ? '20px' : '')};
`;

const MarketDetailsItemContainer = styled(FlexDiv)<{ type: SharePositionType }>`
    justify-content: space-between;
    flex-direction: ${(props) => (props.type == 'potential' ? 'row' : 'column')};
    align-items: center;
    margin-bottom: 5px;
    width: 100%;
`;

const ItemName = styled.span<{ type: SharePositionType }>`
    text-transform: capitalize;
    color: #808997;
    font-size: ${(props) => (props.type == 'potential' ? '18px' : '13px')};
    font-weight: 700;
`;

const Value = styled.span<{ green?: boolean; type: SharePositionType }>`
    font-weight: 700;
    text-transform: capitalize;
    font-size: ${(props) => (props.type == 'potential' ? '18px' : '13px')};
    color: ${(props) => (props.green ? '#03DAC6' : props.theme.textColor.primary)};
`;

const PotentialWinContainer = styled(FlexDiv)`
    width: 100%;
    flex-direction: column;
    margin: 20px 0px;
`;

const PotentialWinHeading = styled.span<{ type: SharePositionType }>`
    display: ${(props) => (props.type == 'potential' ? '' : 'flex')};
    align-items: ${(props) => (props.type == 'potential' ? '' : 'center')};
    justify-content: ${(props) => (props.type == 'potential' ? '' : 'center')};
    color: ${(props) => (props.type == 'potential' ? '#03dac6' : props.theme.textColor.primary)};
    font-size: 35px;
    font-weight: 300;
    text-transform: uppercase;
    text-align: center;
    ::before {
        width: 13px;
        height: 13px;
        margin: 0px 5px;
        transform: rotate(45deg);
        content: '';
        display: ${(props) => (props.type == 'potential' ? 'none' : 'inline-block')};
        background-color: ${(props) => props.theme.textColor.primary};
    }
    ::after {
        width: 13px;
        margin: 0px 5px;
        height: 13px;
        transform: rotate(45deg);
        content: '';
        display: ${(props) => (props.type == 'potential' ? 'none' : 'inline-block')};
        background-color: ${(props) => props.theme.textColor.primary};
    }
`;

const PotentialWin = styled.div<{ type: SharePositionType }>`
    display: ${(props) => (props.type == 'potential' ? '' : 'flex')};
    align-items: ${(props) => (props.type == 'potential' ? '' : 'center')};
    justify-content: ${(props) => (props.type == 'potential' ? '' : 'center')};
    color: ${(props) => (props.type == 'potential' ? '#03dac6' : props.theme.textColor.primary)};
    font-size: 35px;
    font-weight: 300;
    text-transform: uppercase;
    text-align: center;
    color: ${(props) => (props.type == 'potential' ? '' : '100px')};
`;

const PositionInfo = styled(FlexDiv)<{ type: SharePositionType }>`
    justify-content: center;
    align-items: center;
    flex-direction: row;
    margin-top: ${(props) => (props.type == 'potential' ? '' : '100px')};
`;

const CurrencyIcon = styled.i`
    font-size: 40px;
    margin-right: 11px;
`;

const AssetName = styled.span`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 22px;
    margin-right: 5px;
    font-weight: 400;
    text-transform: capitalize;
`;

const Position = styled.span`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 22px;
    font-weight: 700;
`;

const ReferralWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    width: fit-content;
    background-color: white;
    padding: 5px;
    margin-left: 10px;
    margin-top: 10px;
    margin-bottom: 50px;
`;

export default MarketFlexCard;