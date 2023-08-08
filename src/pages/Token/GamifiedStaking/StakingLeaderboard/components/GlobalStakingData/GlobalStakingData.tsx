import { USD_SIGN } from 'constants/currency';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { StakingData } from 'queries/token/useStakersDataLeaderboardQuery';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDiv } from 'styles/common';
import { formatCurrencyWithKey } from 'utils/formatters/number';

const GlobalStakingData: React.FC<{ stakingData: StakingData }> = ({ stakingData }) => {
    const { t } = useTranslation();
    return (
        <Wrapper>
            <Container>
                <AbsoluteContainer>
                    <Icon className="sidebar-icon icon--trading" />
                    <CellValue>{t('thales-token.gamified-staking.rewards.points.trading')}</CellValue>
                </AbsoluteContainer>
                <TextContainer>
                    <Label>{t('thales-token.gamified-staking.rewards.leaderboard.global-data.volume')}</Label>
                    <Value>{formatCurrencyWithKey(USD_SIGN, stakingData.globalTrading, 2)}</Value>
                </TextContainer>
                <TextContainer>
                    <Label>{t('thales-token.gamified-staking.rewards.leaderboard.global-data.multiplier')}</Label>
                    <Value>{stakingData.tradingMultiplier}x</Value>
                </TextContainer>
                <TextContainer>
                    <Label>{t('thales-token.gamified-staking.rewards.leaderboard.global-data.points')}</Label>
                    <Value>{formatCurrencyWithKey('', stakingData.tradingPoints, 2)}</Value>
                </TextContainer>
            </Container>
            <Container>
                <AbsoluteContainer>
                    <Icon className="sidebar-icon icon--liquidity-pool" />
                    <CellValue>{t('thales-token.gamified-staking.rewards.points.amm-lp')}</CellValue>
                </AbsoluteContainer>
                <TextContainer>
                    <Label>{t('thales-token.gamified-staking.rewards.leaderboard.global-data.volume')}</Label>
                    <Value>{formatCurrencyWithKey(USD_SIGN, stakingData.globalLp, 2)}</Value>
                </TextContainer>
                <TextContainer>
                    <Label>{t('thales-token.gamified-staking.rewards.leaderboard.global-data.multiplier')}</Label>
                    <Value>{stakingData.lpMultiplier}x</Value>
                </TextContainer>
                <TextContainer>
                    <Label>{t('thales-token.gamified-staking.rewards.leaderboard.global-data.points')}</Label>
                    <Value>{formatCurrencyWithKey('', stakingData.lpPoints, 2)}</Value>
                </TextContainer>
            </Container>
            <Container>
                <AbsoluteContainer>
                    <Icon className="sidebar-icon icon--vaults" />
                    <CellValue>{t('thales-token.gamified-staking.rewards.points.vaults')}</CellValue>
                </AbsoluteContainer>
                <TextContainer>
                    <Label>{t('thales-token.gamified-staking.rewards.leaderboard.global-data.volume')}</Label>
                    <Value>{formatCurrencyWithKey(USD_SIGN, stakingData.globalVaults, 2)}</Value>
                </TextContainer>
                <TextContainer>
                    <Label>{t('thales-token.gamified-staking.rewards.leaderboard.global-data.multiplier')}</Label>
                    <Value>{stakingData.vaultMultiplier}x</Value>
                </TextContainer>
                <TextContainer>
                    <Label>{t('thales-token.gamified-staking.rewards.leaderboard.global-data.points')}</Label>
                    <Value>{formatCurrencyWithKey('', stakingData.vaultPoints, 2)}</Value>
                </TextContainer>
            </Container>
            <Container>
                <AbsoluteContainer>
                    <Icon className="sidebar-icon icon--token" />
                    <CellValue>{t('thales-token.gamified-staking.rewards.leaderboard.global-data.title')}</CellValue>
                </AbsoluteContainer>
                <TextContainer>
                    <Label>
                        {t('thales-token.gamified-staking.rewards.leaderboard.global-data.points-for-thales')}
                    </Label>
                    <Value>{formatCurrencyWithKey('', stakingData.estimationForOneThales, 2)}</Value>
                </TextContainer>
                <TextContainer>
                    <Label>
                        {t('thales-token.gamified-staking.rewards.leaderboard.global-data.thales-multiplier')}
                    </Label>
                    <Value>{stakingData.maxStakingMultiplier}x</Value>
                </TextContainer>
                <TextContainer>
                    <Label>T{t('thales-token.gamified-staking.rewards.leaderboard.global-data.total-points')}</Label>
                    <Value>{formatCurrencyWithKey('', stakingData.globalPoints, 2)}</Value>
                </TextContainer>
            </Container>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 40px;
    flex-wrap: wrap;
`;

const Container = styled(FlexDiv)`
    position: relative;
    flex-direction: column;
    align-items: center;
    flex: 1;
    padding: 24px 30px;
    min-width: 300px;
    gap: 20px;
    border: ${(_props) => `1px solid ${_props.theme.borderColor.tertiary}`};
    border-radius: 8px;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin: 5px 0px 30px 0px;
        width: 100%;
    }
`;

// const LastContainer = styled(Container)`
//     max-width: calc((100% - 60px) / 3);
//     margin: 30px auto;
// `;

const TextContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

const Label = styled.span`
    font-weight: 700;
    color: ${(_props) => _props.theme.textColor.primary};
    text-transform: uppercase;
`;

const Value = styled.span`
    font-weight: 700;
    text-transform: uppercase;
    color: ${(_props) => _props.theme.borderColor.tertiary};
`;

const Icon = styled.i`
    font-size: 40px;
    color: ${(props) => props.theme.textColor.quaternary};
`;
const CellValue = styled.p`
    font-size: 22px;
    font-weight: 700;
    color: ${(props) => props.theme.textColor.primary};
    white-space: nowrap;
`;

const AbsoluteContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 50px;
    background: ${(props) => props.theme.background.primary};
    margin: auto;
`;

export default GlobalStakingData;
