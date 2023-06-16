import usePointsBreakdownQuery, { PointsData } from 'queries/token/usePointsBreakdownQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';

const PointsBreakdown: React.FC = () => {
    const { t } = useTranslation();

    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const [lastValidStakingData, setLastValidStakingData] = useState<PointsData | undefined>(undefined);

    const query = usePointsBreakdownQuery(walletAddress, { enabled: isAppReady });

    useEffect(() => {
        if (query.isSuccess && query.data) {
            setLastValidStakingData(query.data);
        }
    }, [query.isSuccess, query.data]);

    const stakingData: PointsData | undefined = useMemo(() => {
        if (stakingData) {
            return query.data;
        }
        return lastValidStakingData;
    }, [query.isSuccess, query.data, lastValidStakingData]);

    return (
        <Container>
            <FlexDiv>
                <Title>{t('thales-token.gamified-staking.rewards.points.your-points')}</Title>
                <Title>{t('thales-token.gamified-staking.rewards.points.your-multiplier')}</Title>
            </FlexDiv>
            <FlexDiv>
                <ColumnFlex>
                    <Row>
                        <Cell row={true}>
                            <Icon className="sidebar-icon icon--markets" />
                            <CellValue highlight={true}>
                                {t('thales-token.gamified-staking.rewards.points.trading')}
                            </CellValue>
                        </Cell>
                        <VLine />
                        <Cell>
                            <CellLabel>{t('thales-token.gamified-staking.rewards.points.total-volume')}</CellLabel>
                            <CellValue>{stakingData?.tradingVolume}</CellValue>
                        </Cell>
                        <VLine />
                        <Cell>
                            <CellLabel>
                                {t('thales-token.gamified-staking.rewards.points.trading-multiplier')}
                            </CellLabel>
                            <CellValue highlight={true} addBefore={true}>
                                <Span>x</Span> {stakingData?.tradingMultiplier}
                            </CellValue>
                        </Cell>
                        <VLine />
                        <Cell>
                            <CellLabel>{t('thales-token.gamified-staking.rewards.points.points')}</CellLabel>
                            <CellValue highlight={true}>{stakingData?.tradingPoints}</CellValue>
                        </Cell>
                    </Row>
                    <Row>
                        <Cell row={true}>
                            <Icon className="sidebar-icon icon--liquidity-pool" />
                            <CellValue highlight={true}>
                                {t('thales-token.gamified-staking.rewards.points.amm-lp')}
                            </CellValue>
                        </Cell>
                        <VLine />
                        <Cell>
                            <CellLabel>{t('thales-token.gamified-staking.rewards.points.total-amm')}</CellLabel>
                            <CellValue>{stakingData?.lpVolume}</CellValue>
                        </Cell>
                        <VLine />
                        <Cell>
                            <CellLabel>
                                {t('thales-token.gamified-staking.rewards.points.trading-multiplier')}
                            </CellLabel>
                            <CellValue highlight={true} addBefore={true}>
                                <Span>x</Span> {stakingData?.lpMultiplier}
                            </CellValue>
                        </Cell>
                        <VLine />
                        <Cell>
                            <CellLabel>{t('thales-token.gamified-staking.rewards.points.points')}</CellLabel>
                            <CellValue highlight={true}>{stakingData?.lpPoints}</CellValue>
                        </Cell>
                    </Row>
                    <Row>
                        <Cell row={true}>
                            <Icon className="sidebar-icon icon--vaults" />
                            <CellValue highlight={true}>
                                {t('thales-token.gamified-staking.rewards.points.vaults')}
                            </CellValue>
                        </Cell>
                        <VLine />
                        <Cell>
                            <CellLabel>{t('thales-token.gamified-staking.rewards.points.total-vaults')}</CellLabel>
                            <CellValue>{stakingData?.vaultsVolume}</CellValue>
                        </Cell>
                        <VLine />
                        <Cell>
                            <CellLabel>
                                {t('thales-token.gamified-staking.rewards.points.trading-multiplier')}
                            </CellLabel>
                            <CellValue highlight={true} addBefore={true}>
                                <Span>x</Span> {stakingData?.vaultsMultiplier}
                            </CellValue>
                        </Cell>
                        <VLine />
                        <Cell>
                            <CellLabel>{t('thales-token.gamified-staking.rewards.points.points')}</CellLabel>
                            <CellValue highlight={true}>{stakingData?.vaultsPoints}</CellValue>
                        </Cell>
                    </Row>
                </ColumnFlex>
                <ThalesMultiplier>
                    <CellValue highlight={true}>
                        x<Multiplier>{stakingData?.stakingMultiplier}</Multiplier>
                    </CellValue>
                    <HLine />
                    <CellLabel>{t('thales-token.gamified-staking.rewards.points.your-thales')}</CellLabel>
                    <CellValue>{stakingData?.thalesStaked}</CellValue>
                    <Divider />
                    <CellLabel>{t('thales-token.gamified-staking.rewards.points.divider')}</CellLabel>
                    <CellValue>{stakingData?.thalesDivider}</CellValue>
                </ThalesMultiplier>
            </FlexDiv>
            <FlexDiv>
                <TotalPoints>
                    <CellValue highlight={true}>
                        {`${t('thales-token.gamified-staking.rewards.points.your-current-points')} = ${
                            stakingData?.totalPoints
                        }`}
                    </CellValue>
                </TotalPoints>
            </FlexDiv>
        </Container>
    );
};

const Container = styled.div`
    margin-top: 20px;
`;

const FlexDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    justify-content: space-between;
`;

const ColumnFlex = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
    width: 100%;
`;

const Row = styled.div`
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
`;

const Cell = styled.div<{ row?: boolean }>`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: ${(props) => (props.row ? 'row' : 'column')};
    height: 100%;
    padding: 10px 20px;
    gap: 10px;
`;

const CellLabel = styled.p`
    font-size: 13px;
    font-weight: 400;
    color: ${(props) => props.theme.textColor.primary};
    white-space: nowrap;
`;
const CellValue = styled.p<{ highlight?: boolean; addBefore?: boolean }>`
    font-size: 22px;
    font-weight: 700;
    color: ${(props) => (props.highlight ? props.theme.textColor.quaternary : props.theme.textColor.primary)};
    white-space: nowrap;
`;

const Span = styled.span`
    font-size: 13px;
    font-weight: 700;
    margin-right: -5px;
    text-transform: uppercase;
`;

const Icon = styled.i`
    font-size: 40px;
    color: ${(props) => props.theme.textColor.quaternary};
`;

const ThalesMultiplier = styled.div`
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 8px;
    height: 100%;
    max-width: 255px;

    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 20px;
`;

const VLine = styled.div`
    width: 1px;
    background-color: ${(props) => props.theme.borderColor.primary};
    height: 50px;
    padding: 6px 0;
`;

const HLine = styled.div`
    background-color: ${(props) => props.theme.borderColor.primary};
    height: 1px;
    width: 100%;
    padding: 0 16px;
    margin: 10px 0;
`;

const Divider = styled.div`
    background-color: ${(props) => props.theme.textColor.primary};
    height: 1px;
    width: 100%;
    padding: 0 60px;
`;

const Multiplier = styled.span`
    font-size: 48px;
    font-weight: 700px;
    color: ${(props) => props.theme.textColor.quaternary};
`;

const TotalPoints = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => props.theme.background.secondary};
    width: 100%;
    height: 30px;
    border-radius: 8px;
    margin-top: 8px;
`;

const Title = styled.p`
    font-weight: 400;
    font-size: 18px;
    color: ${(props) => props.theme.textColor.primary};
    margin-bottom: 10px;
    margin-top: 20px;
    text-transform: capitalize;
`;

export default PointsBreakdown;
