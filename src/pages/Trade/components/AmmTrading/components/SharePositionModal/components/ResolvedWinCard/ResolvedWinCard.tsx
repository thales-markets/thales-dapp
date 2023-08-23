import React from 'react';
import styled from 'styled-components';
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
import { SharePositionData } from '../../SharePositionModal';
import { USD_SIGN } from 'constants/currency';
import { formatCurrencyWithSign, formatStrikePrice } from 'utils/formatters/number';
import { formatShortDateWithTime } from 'utils/formatters/date';

const PotentialWinCard: React.FC<SharePositionData> = ({
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

    const price =
        typeof strikePrice == 'string' && strikePrice
            ? strikePrice
            : strikePrice
            ? formatCurrencyWithSign(USD_SIGN, strikePrice ?? 0)
            : formatStrikePrice(leftPrice ?? 0, position, rightPrice);

    return (
        <Container>
            <Footer />
            {reffererID && (
                <ReferralWrapper>
                    <QRCode size={70} value={buildReferrerLink(ROUTES.Home, reffererID)} />
                </ReferralWrapper>
            )}
            <PositionInfo>
                <CurrencyIcon className={`currency-icon currency-icon--${currencyKey.toLowerCase()}`} />
                <AssetName>{getSynthName(currencyKey)}</AssetName>
                <Position>{`${currencyKey.toUpperCase()} ${position}`}</Position>
            </PositionInfo>
            <PotentialWinContainer>
                <PotentialWinHeading>{t('common.flex-card.won')}</PotentialWinHeading>
                <PotentialWin>{formatCurrencyWithSign(USD_SIGN, payout ?? 0)}</PotentialWin>
            </PotentialWinContainer>
            <MarketDetailsContainer>
                <MarketDetailsItemContainer>
                    <ItemName>{t('common.flex-card.strike-price')}</ItemName>
                    <Value>{price}</Value>
                </MarketDetailsItemContainer>
                <MarketDetailsItemContainer>
                    <ItemName>{t('common.flex-card.strike-date')}</ItemName>
                    <Value>{formatShortDateWithTime(strikeDate)}</Value>
                </MarketDetailsItemContainer>
                <MarketDetailsItemContainer>
                    <ItemName>{t('common.flex-card.buy-in')}</ItemName>
                    <Value>{formatCurrencyWithSign(USD_SIGN, buyIn ?? 0)}</Value>
                </MarketDetailsItemContainer>
            </MarketDetailsContainer>
        </Container>
    );
};

const Container = styled.div`
    border: 10px solid #9b8327;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 383px;
    height: 510px;
    padding: 10px 10px;
    background: url(${ZeusResolvedWinBackground}), lightgray 50% / cover no-repeat;
`;

const MarketDetailsContainer = styled(FlexDiv)`
    width: 100%;
    flex-direction: row;
`;

const MarketDetailsItemContainer = styled(FlexDiv)`
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    margin-bottom: 5px;
    width: 100%;
`;

const ItemName = styled.span`
    text-transform: capitalize;
    color: #808997;
    font-size: 13px;
    font-weight: 400;
`;

const Value = styled.span`
    font-weight: 700;
    text-transform: capitalize;
    text-align: center;
    font-size: 13px;
    color: ${(props) => props.theme.textColor.primary};
`;

const PotentialWinContainer = styled(FlexDiv)`
    width: 100%;
    flex-direction: column;
    margin: 20px 0px;
`;

const PotentialWinHeading = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme.textColor.primary};
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
        display: inline-block;
        background-color: ${(props) => props.theme.textColor.primary};
    }
    ::after {
        width: 13px;
        margin: 0px 5px;
        height: 13px;
        transform: rotate(45deg);
        content: '';
        display: inline-block;
        background-color: ${(props) => props.theme.textColor.primary};
    }
`;

const PotentialWin = styled.span`
    font-size: 45px;
    font-weight: 800;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
`;

const PositionInfo = styled(FlexDiv)`
    justify-content: center;
    align-items: center;
    flex-direction: row;
    margin-top: 100px;
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
    background-color: white;
    padding: 5px;
    margin-left: 10px;
    margin-top: 10px;
    margin-bottom: 50px;
`;

export default PotentialWinCard;
