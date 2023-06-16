import useStakingOverviewQuery, { OverviewData } from 'queries/token/useStakingOverviewQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { formatPercentage } from 'utils/formatters/number';

const StakingOverview: React.FC = () => {
    const { t } = useTranslation();

    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const [lastValidStakingData, setLastValidStakingData] = useState<OverviewData | undefined>(undefined);

    const query = useStakingOverviewQuery(walletAddress, { enabled: isAppReady });

    useEffect(() => {
        if (query.isSuccess && query.data) {
            setLastValidStakingData(query.data);
        }
    }, [query.isSuccess, query.data]);

    const stakingData: OverviewData | undefined = useMemo(() => {
        if (stakingData) {
            return query.data;
        }
        return lastValidStakingData;
    }, [query.isSuccess, query.data, lastValidStakingData]);

    return (
        <Container>
            <Title>{t('thales-token.gamified-staking.rewards.overview.title')}</Title>
            <Wrapper>
                <HexagonDiv>
                    <Hexagon className="icon icon--hexagon" />
                    <HexagonLabel top={true}>Your</HexagonLabel>
                    <HexagonNumber>35</HexagonNumber>
                    <HexagonLabel top={false}>Rank</HexagonLabel>
                </HexagonDiv>

                <Column>
                    <Label first>{t('thales-token.gamified-staking.rewards.overview.your-points')}</Label>
                    <Value>
                        <Remote className="icon icon--controller" /> {stakingData?.userPoints}
                    </Value>
                    <Label alingEnd>
                        ({formatPercentage(Number(stakingData?.share))}{' '}
                        {t('thales-token.gamified-staking.rewards.overview.of-total-points')})
                    </Label>
                </Column>
                <VerticalLine />
                <Column>
                    <Label>{t('thales-token.gamified-staking.rewards.overview.total-points')}</Label>
                    <Value>
                        <Remote className="icon icon--controller" /> {stakingData?.totalPoints}
                    </Value>
                </Column>
                <VerticalLine />
                <Column>
                    <Label>{t('thales-token.gamified-staking.rewards.overview.bonus-rewards')}</Label>
                    <Value>{stakingData?.estimatedRewards}</Value>
                    <Label alingEnd>
                        ({formatPercentage(Number(stakingData?.share))}{' '}
                        {t('thales-token.gamified-staking.rewards.overview.of-total-rewards')})
                    </Label>
                </Column>
                <VerticalLine />
                <Column>
                    <Label>{t('thales-token.gamified-staking.rewards.overview.leaderboard-rank')}</Label>
                    <Value>{stakingData?.bonusRewards}</Value>
                </Column>
            </Wrapper>
        </Container>
    );
};

const Container = styled.div`
    margin-top: 40px;
    position: relative;
`;

const Wrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid ${(props) => props.theme.borderColor.tertiary};
    border-radius: 8px;
    height: 130px;
    margin-top: 40px;
`;

const Title = styled.p`
    font-weight: 400;
    font-size: 18px;
    color: ${(props) => props.theme.textColor.primary};
`;

const Column = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 20px;
    height: 100%;
    padding: 20px;
`;

const VerticalLine = styled.div`
    height: 100px;
    width: 0;
    border-right: 1px solid ${(props) => props.theme.borderColor.tertiary};
    padding-top: 18px;
    padding-bottom: 12px;
`;

const Label = styled.span<{ first?: boolean; alingEnd?: boolean }>`
    font-weight: 700;
    font-size: 13px;
    color: ${(props) => props.theme.textColor.primary};
    align-self: ${(props) => (props.alingEnd ? 'flex-end' : 'flex-start')};
    text-transform: ${(props) => (props.alingEnd ? 'capitalize' : 'uppercase')};
    line-height: 100%;
    margin-top: ${(props) => (props.alingEnd ? '-16px' : '0')};
    margin-left: ${(props) => (props.first ? '40px' : '0')};
`;

const Value = styled.span`
    font-weight: 800;
    font-size: 22px;
    color: ${(props) => props.theme.borderColor.tertiary};
    align-self: flex-end;
    text-transform: uppercase;
    line-height: 100%;
`;

const Remote = styled.i`
    color: ${(props) => props.theme.borderColor.tertiary};
    font-size: 33px;
    font-weight: 400;
`;

const HexagonDiv = styled.div`
    position: absolute;
    background-color: ${(props) => props.theme.background.primary};
    top: -25px;
    left: -40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 95px;
    height: 100px;
`;

const Hexagon = styled.i`
    position: absolute;
    top: 0;
    left: 0;
    color: ${(props) => props.theme.borderColor.tertiary};
    font-size: 100px;
    font-weight: 400;
    background-color: ${(props) => props.theme.background.primary};
    z-index: 4;
`;

const HexagonLabel = styled.p<{ top: boolean }>`
    position: relative;
    font-size: 13px;
    font-weight: 700;
    color: ${(props) => props.theme.background.primary};
    z-index: 5;
    text-transform: uppercase;
`;

const HexagonNumber = styled.p`
    position: relative;
    font-size: 48px;
    font-weight: 700;
    line-height: 36px;
    color: ${(props) => props.theme.background.primary};
    z-index: 5;
`;

export default StakingOverview;
