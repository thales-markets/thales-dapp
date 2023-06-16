import useStakingOverviewQuery, { OverviewData } from 'queries/token/useStakingOverviewQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';

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
                <Column>
                    <Label>{t('thales-token.gamified-staking.rewards.overview.your-points')}</Label>
                    <Value>{stakingData?.userPoints}</Value>
                </Column>
                <VerticalLine />
                <Column>
                    <Label>{t('thales-token.gamified-staking.rewards.overview.total-points')}</Label>
                    <Value>{stakingData?.totalPoints}</Value>
                </Column>
                <VerticalLine />
                <Column>
                    <Label>{t('thales-token.gamified-staking.rewards.overview.bonus-rewards')}</Label>
                    <Value>{stakingData?.estimatedRewards}</Value>
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
    margin-top: 30px;
`;

const Wrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid ${(props) => props.theme.borderColor.tertiary};
    border-radius: 8px;
    height: 130px;
    margin-top: 30px;
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
    padding: 16px;
`;

const VerticalLine = styled.div`
    height: 100px;
    width: 0;
    border-right: 1px solid ${(props) => props.theme.borderColor.tertiary};
    padding-top: 18px;
    padding-bottom: 12px;
`;

const Label = styled.span`
    font-weight: 700;
    font-size: 13px;
    color: ${(props) => props.theme.textColor.primary};
    align-self: flex-start;
    text-transform: uppercase;
    line-height: 100%;
`;

const Value = styled.span`
    font-weight: 800;
    font-size: 22px;
    color: ${(props) => props.theme.borderColor.tertiary};
    align-self: flex-end;
    text-transform: uppercase;
    line-height: 100%;
`;

export default StakingOverview;
