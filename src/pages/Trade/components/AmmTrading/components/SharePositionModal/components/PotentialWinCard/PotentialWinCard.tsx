import React from 'react';
import styled from 'styled-components';
import ZeusPotentialWinBackground from 'assets/images/zeus-potential-win.png';
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
import { SharePositionData } from '../../SharePositionModal';

const ResolvedWinCard: React.FC<SharePositionData> = ({
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
        <Container>
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
                <PotentialWinHeading>{t('common.flex-card.potential-win')}</PotentialWinHeading>
                <PotentialWin>{potentialWinFormatted}</PotentialWin>
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
            <Footer />
        </Container>
    );
};

const Container = styled.div`
    border: 10px solid #03dac5;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 383px;
    height: 510px;
    padding: 10px 10px;
    background: url(${ZeusPotentialWinBackground}), lightgray 50% / cover no-repeat;
`;

const MarketDetailsContainer = styled(FlexDiv)`
    width: 100%;
    flex-direction: column;
    margin-bottom: 20px;
`;

const MarketDetailsItemContainer = styled(FlexDiv)`
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
    width: 100%;
`;

const ItemName = styled.span`
    text-transform: capitalize;
    color: #808997;
    font-size: 18px;
    font-weight: 700;
`;

const Value = styled.span<{ green?: boolean }>`
    font-weight: 700;
    text-transform: capitalize;
    font-size: 18px;
    color: ${(props) => (props.green ? '#03DAC6' : props.theme.textColor.primary)};
`;

const PotentialWinContainer = styled(FlexDiv)`
    width: 100%;
    flex-direction: column;
    margin: 20px 0px;
`;

const PotentialWinHeading = styled.span`
    color: #03dac6;
    font-size: 35px;
    font-weight: 300;
    text-transform: uppercase;
    text-align: center;
`;

const PotentialWin = styled(PotentialWinHeading)`
    font-size: 45px;
    font-weight: 800;
    text-align: center;
`;

const PositionInfo = styled(FlexDiv)`
    justify-content: center;
    align-items: center;
    flex-direction: row;
`;

const CurrencyIcon = styled.i`
    font-size: 40px;
    margin-right: 11px;
`;

const AssetName = styled.span`
    color: #808997;
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

export default ResolvedWinCard;