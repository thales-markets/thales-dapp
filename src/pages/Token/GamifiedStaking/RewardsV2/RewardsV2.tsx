import TimeRemaining from 'components/TimeRemaining/TimeRemaining';
import useStakingDataQuery from 'queries/token/useStakingDataQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled, { useTheme } from 'styled-components';
import { StakingData } from 'types/token';
import { ThemeInterface } from 'types/ui';

const RewardsV2: React.FC = () => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [lastValidStakingData, setLastValidStakingData] = useState<StakingData | undefined>(undefined);

    const theme: ThemeInterface = useTheme();

    const stakingDataQuery = useStakingDataQuery(networkId, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (stakingDataQuery.isSuccess && stakingDataQuery.data) {
            setLastValidStakingData(stakingDataQuery.data);
        }
    }, [stakingDataQuery.isSuccess, stakingDataQuery.data]);

    const stakingData: StakingData | undefined = useMemo(() => {
        if (stakingData) {
            return stakingDataQuery.data;
        }
        return lastValidStakingData;
    }, [stakingDataQuery.isSuccess, stakingDataQuery.data, lastValidStakingData]);

    console.log(walletAddress);
    return (
        <Wrapper>
            <Header>
                <TitleDiv>
                    <Text>{t('options.earn.gamified-staking.rewards.section-description')}</Text>
                    <Text>{t('options.earn.gamified-staking.rewards.section-base-rewards')}</Text>
                    <Text>{t('options.earn.gamified-staking.rewards.section-bonus-rewards')}</Text>
                </TitleDiv>
                <TitleDiv>
                    <WrapperBorder>
                        <Label>{t('options.earn.gamified-staking.rewards.claim.period')}</Label>
                        <Value>
                            {stakingData ? (
                                <TimeRemaining
                                    end={stakingData?.closingDate}
                                    textColor={theme.textColor.quaternary}
                                    fontSize={22}
                                    showFullCounter
                                />
                            ) : (
                                '--:--'
                            )}
                        </Value>
                    </WrapperBorder>
                </TitleDiv>
            </Header>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
`;

const Header = styled.div`
    display: flex;
    justify-content: center;
    gap: 16px;
`;

const TitleDiv = styled.div`
    flex: 1;
`;

const WrapperBorder = styled.div`
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 8px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    min-height: 36px;
`;

const Label = styled.span`
    font-weight: 700;
    font-size: 13px;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.primary};
`;
const Value = styled.span`
    font-weight: 700;
    font-size: 22px;
    color: ${(props) => props.theme.textColor.quaternary};
`;

const Text = styled.p`
    color: ${(props) => props.theme.textColor.primary};
    font-size: 13;
    font-weight: 400;
    line-height: 110%;
    margin-bottom: 16px;
    margin-top: 8px;
`;

export default RewardsV2;
