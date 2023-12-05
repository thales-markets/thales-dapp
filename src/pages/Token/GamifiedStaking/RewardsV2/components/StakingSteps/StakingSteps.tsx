import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { BoldedText, HighlightTextBigger, HighlightTextSecondary } from './styled-components';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import useStakingOverviewQuery, { OverviewData } from 'queries/token/useStakingOverviewQuery';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { formatCurrency } from 'thales-utils';

const StakingSteps: React.FC = () => {
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const [stakingData, setStakingData] = useState<OverviewData | null>(null);

    const query = useStakingOverviewQuery(walletAddress, networkId, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (query.data && query.isSuccess) {
            setStakingData(query.data);
        }
    }, [query.data, query.isSuccess]);

    return (
        <Container>
            <Title>{t('thales-token.gamified-staking.rewards.gamified-rewards')}</Title>
            <Subtitle>{t('thales-token.gamified-staking.rewards.gamified-rewards-how')}</Subtitle>
            <FlexDiv>
                <Card>
                    <Number>1</Number>
                    <CardContent>
                        <CardTitle>{t('thales-token.gamified-staking.rewards.card.title-1')}</CardTitle>
                        <CardText>
                            <Trans
                                i18nKey="thales-token.gamified-staking.rewards.card.content-1"
                                components={{
                                    bold: <BoldedText />,
                                    highlight: <HighlightTextSecondary />,
                                }}
                                values={{
                                    multiplier: stakingData?.tradingMultiplier ?? 0,
                                }}
                            />
                        </CardText>
                    </CardContent>
                </Card>
                <Card>
                    <Number>2</Number>
                    <CardContent>
                        <CardTitle>{t('thales-token.gamified-staking.rewards.card.title-2')}</CardTitle>
                        <CardText>
                            <Trans
                                i18nKey="thales-token.gamified-staking.rewards.card.content-2"
                                components={{
                                    bold: <BoldedText />,
                                    highlight: <HighlightTextSecondary />,
                                }}
                                values={{
                                    multiplier: stakingData?.lpMultiplier ?? 0,
                                }}
                            />
                        </CardText>
                    </CardContent>
                </Card>
                <Card>
                    <Number>3</Number>
                    <CardContent>
                        <CardTitle>{t('thales-token.gamified-staking.rewards.card.title-3')}</CardTitle>
                        <CardText>
                            <Trans
                                i18nKey="thales-token.gamified-staking.rewards.card.content-3"
                                components={{
                                    bold: <BoldedText />,
                                    highlight: <HighlightTextSecondary />,
                                }}
                                values={{
                                    multiplier: stakingData?.vaultsMultiplier ?? 0,
                                }}
                            />
                        </CardText>
                    </CardContent>
                </Card>
                <Card>
                    <Number>4</Number>
                    <CardContent>
                        <CardTitle>{t('thales-token.gamified-staking.rewards.card.title-4')}</CardTitle>
                        <CardText>
                            <Trans
                                i18nKey="thales-token.gamified-staking.rewards.card.content-4"
                                components={{
                                    bold: <BoldedText />,
                                    highlight: <HighlightTextSecondary />,
                                    br: <br />,
                                }}
                                values={{
                                    multiplier: stakingData?.maxThalesMultiplier ?? 0,
                                }}
                            />
                        </CardText>
                    </CardContent>
                </Card>
            </FlexDiv>
            <FlexDiv>
                <RowCard>
                    <TotalScoreLabel>{t('thales-token.gamified-staking.rewards.card.title-5')}</TotalScoreLabel>
                    <CardContent>
                        <CardText>
                            <Trans
                                i18nKey="thales-token.gamified-staking.rewards.card.content-5"
                                components={{
                                    highlight: <HighlightTextBigger />,
                                    br: <br />,
                                }}
                                values={{
                                    bonusRewards: formatCurrency(stakingData?.bonusRewards ?? 0),
                                }}
                            />
                        </CardText>
                    </CardContent>
                </RowCard>
            </FlexDiv>
        </Container>
    );
};

const Container = styled.div`
    margin-top: 28px;
`;

const Title = styled.p`
    font-weight: 700;
    font-size: 22px;
    color: ${(props) => props.theme.textColor.primary};
    text-transform: uppercase;
    margin-bottom: 30px;
`;
const Subtitle = styled.p`
    font-weight: 400;
    font-size: 18px;
    color: ${(props) => props.theme.textColor.primary};
    text-transform: capitalize;
    margin-bottom: 40px;
`;
const FlexDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
`;
const Card = styled.div`
    flex: 1;
    border: 1px solid ${(props) => props.theme.tokenPage.border.secondary};
    border-radius: 8px;
    position: relative;
    padding-top: 24px;
    padding-left: 22px;
    padding-bottom: 8px;
    padding-right: 8px;
    height: 230px;
`;

const RowCard = styled(Card)`
    height: auto;
    margin-top: 30px;
    padding-left: 50px;
    padding-right: 20px;
`;

const Number = styled.div`
    width: 50px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -30px;
    left: -15px;
    font-weight: 700;
    font-size: 48px;
    color: ${(props) => props.theme.tokenPage.border.secondary};
    background-color: ${(props) => props.theme.background.primary};
    z-index: 2;
`;

const TotalScoreLabel = styled.div`
    position: absolute;
    font-size: 28px;
    top: -14px;
    font-weight: 700;
    width: 230px;
    text-align: center;
    left: calc(50% - 125px);
    text-transform: uppercase;
    color: ${(props) => props.theme.tokenPage.border.secondary};
    background-color: ${(props) => props.theme.background.primary};
    z-index: 2;
`;

const CardContent = styled.div`
    position: relative;
    z-index: 2;
`;

const CardTitle = styled.p`
    font-weight: 700;
    font-size: 13px;
    color: ${(props) => props.theme.textColor.primary};
    margin-bottom: 8px;
`;
const CardText = styled.p`
    font-weight: 400;
    font-size: 13px;
    line-height: 110%;
    color: ${(props) => props.theme.textColor.primary};
    margin-bottom: 10px;
`;

export default StakingSteps;
