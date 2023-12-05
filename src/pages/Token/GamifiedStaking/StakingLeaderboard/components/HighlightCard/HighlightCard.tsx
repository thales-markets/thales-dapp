import React from 'react';
import styled from 'styled-components';
import { FlexDiv, FlexDivColumn, FlexDivRow } from 'styles/common';
import GoldBadge from 'assets/images/token/leaderboard/gold_badge.svg';
import BronzeBadge from 'assets/images/token/leaderboard/bronze_badge.svg';
import SilverBadge from 'assets/images/token/leaderboard/silver_badge.svg';
import { truncateAddress, formatCurrencyWithKey } from 'thales-utils';
import { useTranslation } from 'react-i18next';
import { getWalletAddress } from 'redux/modules/wallet';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { ScreenSizeBreakpoint } from 'enums/ui';

type HighlightCardProps = {
    rank: number;
    walletAddress: string;
    totalPoints: string;
    totalRewards: string | undefined;
};

const HighlightCard: React.FC<HighlightCardProps> = ({ rank, walletAddress, totalPoints, totalRewards }) => {
    const { t } = useTranslation();
    const badge = rank == 1 ? GoldBadge : rank == 2 ? SilverBadge : rank == 3 ? BronzeBadge : '';
    const connectedWalletAddress = useSelector((state: RootState) => getWalletAddress(state));

    const highlightCard = walletAddress.toLowerCase() == connectedWalletAddress?.toLowerCase();

    return (
        <Container highlightCard={highlightCard}>
            <BadgeContainer>
                <Badge src={badge} />
            </BadgeContainer>
            <WalletAddress highlightCard={highlightCard}>{truncateAddress(walletAddress)}</WalletAddress>
            <RewardsDataContainer>
                <DataContainer>
                    <Heading highlightCard={highlightCard}>
                        {t('profile.leaderboard.highlight-card.total-points')}
                    </Heading>
                    <Amount highlightCard={highlightCard}>{formatCurrencyWithKey('', totalPoints, 2)}</Amount>
                </DataContainer>
                <DataContainer>
                    <Heading highlightCard={highlightCard}>
                        {t('profile.leaderboard.highlight-card.total-rewards')}
                    </Heading>
                    <Amount highlightCard={highlightCard}>{totalRewards ? totalRewards : ''}</Amount>
                </DataContainer>
            </RewardsDataContainer>
        </Container>
    );
};

const Container = styled(FlexDiv)<{ highlightCard: boolean }>`
    flex-direction: column;
    align-items: center;
    width: 32%;
    height: 167px;
    background-color: ${(props) => `${props.highlightCard ? props.theme.borderColor.tertiary : ''}`};
    border: ${(props) => `1px solid ${props.theme.borderColor.tertiary}`};
    border-radius: 8px;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin: 5px 0px 30px 0px;
        width: 100%;
    }
`;

const WalletAddress = styled.span<{ highlightCard: boolean }>`
    font-weight: 700;
    font-size: 18px;
    color: ${(props) => `${!props.highlightCard ? props.theme.textColor.primary : props.theme.background.primary}`};
    margin: 50px 0px 10px 0px;
`;

const RewardsDataContainer = styled(FlexDivRow)`
    width: 100%;
    margin-top: 30px;
    padding: 0px 20px;
`;

const DataContainer = styled(FlexDivColumn)``;

const Heading = styled.h3<{ highlightCard: boolean }>`
    font-weight: 700;
    color: ${(props) => `${!props.highlightCard ? props.theme.textColor.primary : props.theme.background.primary}`};
    text-transform: uppercase;
`;

const Amount = styled.span<{ highlightCard: boolean }>`
    font-weight: 700;
    text-transform: uppercase;
    color: ${(props) =>
        `${!props.highlightCard ? props.theme.button.textColor.quaternary : props.theme.background.primary}`};
`;

const BadgeContainer = styled.div`
    position: relative;
    width: 200px;
    text-align: center;
`;

const Badge = styled.img`
    position: absolute;
    top: -50px;
    left: 50px;
    width: 100px;
    height: 100px;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 70px;
        height: 70px;
        top: -35px;
        left: 70px;
    }
`;

export default HighlightCard;
