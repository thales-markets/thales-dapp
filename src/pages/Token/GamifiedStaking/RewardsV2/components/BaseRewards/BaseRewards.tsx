import ROUTES from 'constants/routes';
import { TokenTabSectionIdEnum } from 'enums/token';
import { ScreenSizeBreakpoint } from 'enums/ui';
import useUserBaseRewardsQuery, { DEFAULT_USER_STAKING_DATA, UserStakingData } from 'queries/token/useUserBaseRewards';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsMobile } from 'redux/modules/ui';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { navigateTo } from 'utils/routes';

const BaseRewards: React.FC = () => {
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const [lastValidStakingData, setLastValidStakingData] = useState<UserStakingData>(DEFAULT_USER_STAKING_DATA);

    const query = useUserBaseRewardsQuery(walletAddress, networkId, { enabled: isAppReady });

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
    }, [query.data, lastValidStakingData]);

    return (
        <Container>
            <Title>{t('thales-token.gamified-staking.rewards.base-rewards.title')}</Title>
            <FlexDiv>
                <Cell>
                    <CellLabel>{t('thales-token.gamified-staking.rewards.base-rewards.balance')}</CellLabel>
                    <CellValue>{stakingData?.thalesStaked}</CellValue>
                </Cell>
                {!isMobile && <VLine />}
                <Cell>
                    <CellLabel>{t('thales-token.gamified-staking.rewards.base-rewards.total')}</CellLabel>
                    <CellValue>{stakingData?.totalStaked}</CellValue>
                </Cell>
                {!isMobile && <VLine />}
                <Cell>
                    <CellLabel>{t('thales-token.gamified-staking.rewards.base-rewards.share')}</CellLabel>
                    <CellValue>{stakingData?.share}</CellValue>
                </Cell>
                {!isMobile && <VLine />}
                <Cell>
                    <CellLabel>{t('thales-token.gamified-staking.rewards.base-rewards.rewards')}</CellLabel>
                    <CellValue>{stakingData?.baseRewards}</CellValue>
                    <Wrapper>
                        <StakeMore
                            onClick={() =>
                                navigateTo(
                                    `${ROUTES.Options.Token}?activeButtonId=${TokenTabSectionIdEnum.STAKING}`,
                                    false,
                                    true
                                )
                            }
                        >
                            {t('thales-token.gamified-staking.rewards.base-rewards.stake-more')}
                            <ArrowRight className="icon icon__arrow" />
                        </StakeMore>
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
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        height: auto;
        font-size: 18px;
        flex-wrap: wrap;
    }
`;
const FlexDiv = styled.div`
    display: flex;
    justify-content: center;
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 8px;
    width: 100%;
    height: 100px;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        height: auto;
        flex-wrap: wrap;
    }
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
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex: none;
        justify-content: center;
        align-items: flex-start;
        width: 50%;
    }
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
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 18px;
    }
`;

const VLine = styled.div`
    width: 1px;
    background-color: ${(props) => props.theme.borderColor.primary};
    height: 80px;
    align-self: center;
`;

const StakeMore = styled.span`
    font-weight: 400;
    font-size: 18px;
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.textColor.quaternary};
    text-transform: capitalize;
    cursor: pointer;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        font-size: 13px;
    }
`;

const ArrowRight = styled.i`
    font-size: 14px;
    margin-left: 6px;
    color: ${(props) => props.theme.textColor.quaternary};
`;

const Wrapper = styled.div`
    align-self: flex-end;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default BaseRewards;
