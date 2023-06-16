import useUserBaseRewardsQuery, { UserStakingData } from 'queries/token/useUserBaseRewards';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';

const BaseRewards: React.FC = () => {
    const { t } = useTranslation();

    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const [lastValidStakingData, setLastValidStakingData] = useState<UserStakingData | undefined>(undefined);

    const query = useUserBaseRewardsQuery(walletAddress, { enabled: isAppReady });

    useEffect(() => {
        if (query.isSuccess && query.data) {
            setLastValidStakingData(query.data);
        }
    }, [query.isSuccess, query.data]);

    const stakingData: UserStakingData | undefined = useMemo(() => {
        if (stakingData) {
            return query.data;
        }
        return lastValidStakingData;
    }, [query.isSuccess, query.data, lastValidStakingData]);

    return (
        <Container>
            <Title>{t('thales-token.gamified-staking.rewards.base-rewards.title')}</Title>
            <FlexDiv>
                <Cell>
                    <CellLabel>{t('thales-token.gamified-staking.rewards.base-rewards.balance')}</CellLabel>
                    <CellValue>{stakingData?.thalesStaked}</CellValue>
                </Cell>
                <VLine />
                <Cell>
                    <CellLabel>{t('thales-token.gamified-staking.rewards.base-rewards.total')}</CellLabel>
                    <CellValue>{stakingData?.totalStaked}</CellValue>
                </Cell>
                <VLine />
                <Cell>
                    <CellLabel>{t('thales-token.gamified-staking.rewards.base-rewards.share')}</CellLabel>
                    <CellValue>{stakingData?.share}</CellValue>
                </Cell>
                <VLine />
                <Cell>
                    <CellLabel>{t('thales-token.gamified-staking.rewards.base-rewards.rewards')}</CellLabel>
                    <CellValue>{stakingData?.baseRewards}</CellValue>
                    <Wrapper>
                        <StakeMore>{t('thales-token.gamified-staking.rewards.base-rewards.stake-more')} </StakeMore>
                        <ArrowRight className="icon icon--right" />
                    </Wrapper>
                </Cell>
            </FlexDiv>
        </Container>
    );
};

const Container = styled.div``;
const Title = styled.p`
    font-weight: 700;
    font-size: 22px;
    color: ${(props) => props.theme.textColor.primary};
    margin: 30px 0;
`;
const FlexDiv = styled.div`
    display: flex;
    justify-content: center;
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 8px;
    width: 100%;
    height: 100px;
`;
const Cell = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    flex: 1;
    height: 100%;
    padding: 10px;
    gap: 10px;
`;

const CellLabel = styled.p`
    font-weight: 700;
    font-size: 13px;
    color: ${(props) => props.theme.textColor.primary};
`;
const CellValue = styled.p`
    font-weight: 700;
    font-size: 22px;
    color: ${(props) => props.theme.textColor.quaternary};
`;

const VLine = styled.div`
    width: 1px;
    background-color: ${(props) => props.theme.borderColor.primary};
    height: 80px;
    align-self: center;
`;

const StakeMore = styled.p`
    font-weight: 400;
    font-size: 18px;
    color: ${(props) => props.theme.textColor.quaternary};
    text-transform: capitalize;
`;

const ArrowRight = styled.i`
    font-size: 14px;
    color: ${(props) => props.theme.textColor.quaternary};
`;

const Wrapper = styled.div`
    align-self: flex-end;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default BaseRewards;
