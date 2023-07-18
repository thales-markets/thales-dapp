import SPAAnchor from 'components/SPAAnchor/SPAAnchor';
import ROUTES from 'constants/routes';
import { ScreenSizeBreakpoint } from 'enums/ui';
import useStakersDataLeaderboardQuery from 'queries/token/useStakersDataLeaderboardQuery';
import useStakingOverviewQuery, { OverviewData } from 'queries/token/useStakingOverviewQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsMobile } from 'redux/modules/ui';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { formatPercentage } from 'utils/formatters/number';
import snxJSConnector from 'utils/snxJSConnector';

const StakingOverview: React.FC = () => {
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));
    const [period, setPeriod] = useState(0);

    const [lastValidStakingData, setLastValidStakingData] = useState<OverviewData | undefined>(undefined);

    const query = useStakingOverviewQuery(walletAddress, networkId, { enabled: isAppReady });

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

    useEffect(() => {
        const { stakingThalesContract } = snxJSConnector;

        stakingThalesContract?.periodsOfStaking().then((period: number) => {
            setPeriod(period);
        });
    }, []);

    const leaderboardQuery = useStakersDataLeaderboardQuery(networkId, period, {
        enabled: period > 0,
    });

    const userData = useMemo(() => {
        if (leaderboardQuery.isSuccess && leaderboardQuery.data) {
            const user = leaderboardQuery.data.filter((user) => user.id.toLowerCase() === walletAddress.toLowerCase());
            const length = leaderboardQuery.data.length;
            if (user.length > 0) {
                return {
                    rank: user[0].rank,
                    users: length,
                };
            }
        }
        return undefined;
    }, [leaderboardQuery.isSuccess, leaderboardQuery.data]);

    return (
        <Container>
            {!isMobile && <Title>{t('thales-token.gamified-staking.rewards.overview.title')}</Title>}
            <Wrapper>
                <HexagonDiv>
                    <Hexagon className="icon icon--hexagon" />
                    <HexagonLabel top={true}>Your</HexagonLabel>
                    <HexagonNumber>{userData ? userData.rank : '-'}</HexagonNumber>
                    <HexagonLabel top={false}>Rank</HexagonLabel>
                </HexagonDiv>

                <SecondaryContainer>
                    <Column>
                        <Label>{t('thales-token.gamified-staking.rewards.overview.your-points')}</Label>
                        <Value>
                            <Remote className="icon icon--controller" /> {stakingData?.userPoints}
                        </Value>
                        <SecondaryLabel>
                            ({formatPercentage(Number(stakingData?.share))}
                            {t('thales-token.gamified-staking.rewards.overview.of-total-points')})
                        </SecondaryLabel>
                    </Column>
                    {!isMobile && <VerticalLine />}
                    <Column>
                        <Label>{t('thales-token.gamified-staking.rewards.overview.total-points')}</Label>
                        <Value>
                            <Remote className="icon icon--controller" /> {stakingData?.totalPoints}
                        </Value>
                    </Column>
                </SecondaryContainer>
                <VerticalLine />
                <SecondaryContainer>
                    <Column>
                        <Label>{t('thales-token.gamified-staking.rewards.overview.bonus-rewards')}</Label>
                        <Value>{stakingData?.estimatedRewards}</Value>
                        <SecondaryLabel>
                            ({formatPercentage(Number(stakingData?.share))}{' '}
                            {t('thales-token.gamified-staking.rewards.overview.of-total-rewards')})
                        </SecondaryLabel>
                    </Column>
                    {!isMobile && <VerticalLine />}
                    <Column>
                        <Label>{t('thales-token.gamified-staking.rewards.overview.leaderboard-rank')}</Label>
                        <Value>{userData ? `${userData.rank} / ${userData.users}` : '---/---'}</Value>
                        <SPAAnchor href={ROUTES.Options.StakingLeaderboard}>
                            <LinkToLeaderboard>
                                {t('thales-token.gamified-staking.rewards.overview.go-to')}
                                <ArrowIcon className="icon icon__arrow" />
                            </LinkToLeaderboard>
                        </SPAAnchor>
                    </Column>
                </SecondaryContainer>
            </Wrapper>
        </Container>
    );
};

const Container = styled.div`
    margin-top: 40px;
    position: relative;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-top: 10px;
    }
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
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        height: 350px;
        margin-top: 0px;
    }
`;

const SecondaryContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
    justify-content: space-between;
    width: 50%;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
        align-items: center;
    }
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
    padding: 20px 20px 20px 20px;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        justify-content: flex-start;
        align-items: center;
    }
`;

const VerticalLine = styled.div`
    height: 80%;
    width: 2;
    border-right: 1px solid ${(props) => props.theme.borderColor.tertiary};
    padding: 0px 10px;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        padding: 0;
    }
`;

const Label = styled.span`
    font-weight: 700;
    font-size: 13px;
    color: ${(props) => props.theme.textColor.primary};
    align-self: flex-start;
    text-transform: uppercase;
    line-height: 100%;
    margin-top: 0px;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        align-self: center;
        text-align: center;
    }
`;

const SecondaryLabel = styled(Label)`
    text-transform: capitalize;
    align-self: flex-end;
    margin-top: -16px;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        align-self: center;
        margin-top: 0px;
        text-align: center;
    }
`;

const Value = styled.span`
    font-weight: 800;
    font-size: 22px;
    color: ${(props) => props.theme.borderColor.tertiary};
    align-self: flex-end;
    text-transform: uppercase;
    line-height: 100%;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        align-self: center;
        margin-top: 0px;
        text-align: center;
    }
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
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        bottom: -60px;
        right: 30px;
        top: auto;
        left: auto;
    }
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

const LinkToLeaderboard = styled.p`
    color: ${(props) => props.theme.borderColor.tertiary};
    display: flex;
    align-items: center;
    font-size: 18px;
    font-family: Fira Sans;
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    text-transform: capitalize;
    align-self: flex-end;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        position: absolute;
        bottom: 10px;
        left: 10px;
    }
`;

const ArrowIcon = styled.i`
    margin-left: 7px;
    color: ${(props) => props.theme.borderColor.tertiary};
    font-size: 15px;
`;

export default StakingOverview;
