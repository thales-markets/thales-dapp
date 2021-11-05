import { ThalesRoyalData } from '../../getThalesRoyalData';
import React from 'react';
import { FlexDivCentered, FlexDivColumn, Text, Image, FlexDiv } from 'theme/common';
import styled from 'styled-components';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import { useTranslation, Trans } from 'react-i18next';
import triangle from 'assets/images/royale/triangle.svg';
import circle from 'assets/images/royale/circle.svg';
import avatar from 'assets/images/royale/avatar.svg';
import discord from 'assets/images/royale/discord.svg';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { truncateAddress } from 'utils/formatters/string';

type ScoreboardProps = {
    royaleData: ThalesRoyalData;
};

const Scoreboard: React.FC<ScoreboardProps> = ({ royaleData }) => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const truncateAddressNumberOfCharacters = window.innerWidth < 768 ? 2 : 5;
    const { t } = useTranslation();
    return (
        <Wrapper>
            <Intro royaleData={royaleData} />
            <UserWrapper>
                <FlexDiv style={{ alignItems: 'center' }}>
                    <UserAvatar src={avatar} />
                    <InfoText>{t('options.royale.scoreboard.player-no')}</InfoText>
                </FlexDiv>
                <FlexDivColumn style={{ margin: '20px 0' }}>
                    <FlexContainer>
                        <InfoText>{t('options.leaderboard.display-name')}:</InfoText>
                        <InputWrapper>Titan</InputWrapper>
                    </FlexContainer>
                    <FlexContainer>
                        <InfoText>{t('options.leaderboard.address')}:</InfoText>
                        <InputWrapper>
                            {truncateAddress(
                                walletAddress as any,
                                truncateAddressNumberOfCharacters,
                                truncateAddressNumberOfCharacters
                            )}
                        </InputWrapper>
                    </FlexContainer>
                </FlexDivColumn>
                <FlexDivCentered>
                    <Button>
                        Verify <Discord src={discord} />
                    </Button>
                </FlexDivCentered>
            </UserWrapper>
            <TableWrapper></TableWrapper>
            <Text className="text-m white">
                Alive players:{' '}
                {royaleData ? royaleData.alivePlayers.length + ' / ' + royaleData.players.length : 0 + ' / ' + 0}
            </Text>

            <Text className="text-m white">
                Round: {royaleData ? royaleData.round + ' / ' + royaleData.rounds : 0 + ' / ' + 0}{' '}
            </Text>
        </Wrapper>
    );
};

const UserWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 295px;
    width: 100%;
    padding: 34px 70px;
    background: linear-gradient(181.32deg, #04045a 1.13%, #000000 205.66%);
    border: 5px solid #64d9fe;
    box-sizing: border-box;
    border-radius: 5px;
    margin-top: 4px;
    margin-bottom: 14px;
`;

const Button = styled.button`
    align-items: center;
    display: flex;
    font-family: Sansation Light !important;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 22px;
    background: #64d9fe;
    border: 1px solid #64d9fe;
    box-sizing: border-box;
    box-shadow: 0px 0px 30px rgba(161, 224, 180, 0.5);
    border-radius: 20px;
    padding: 6px 15px 6px 20px;
    color: #04045a;
`;

const UserAvatar = styled(Image)`
    width: 44px;
    height: 44px;
    margin-right: 14px;
`;

const Discord = styled(Image)`
    width: 24px;
    height: 18px;
    margin-left: 10px;
`;

const InputWrapper = styled.div`
    width: 220px;
    border: 1.30233px solid #64d9fe;
    box-sizing: border-box;
    border-radius: 19.5349px;
    height: 28px;
    white-space: nowrap;
    overflow: hidden;
    font-family: Sansation Light !important;
    font-style: normal;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    letter-spacing: -0.4px;
    color: #64d9fe;
`;

const FlexContainer = styled(FlexDivCentered)`
    justify-content: space-between;
    margin: 7px 0;
`;

const TableWrapper = styled.div`
    width: 100%;
    min-height: 300px;
    background: linear-gradient(179.55deg, #04045a 0.39%, #000000 187.39%);
    border: 5px solid #64d9fe;
    box-sizing: border-box;
    border-radius: 5px;
    padding: 30px;
`;

const Intro: React.FC<ScoreboardProps> = ({ royaleData }) => {
    const { t } = useTranslation();
    return (
        <>
            <Title>{t('options.royale.scoreboard.starts')}</Title>
            <SubTitle>
                <TimeRemaining end={royaleData.signUpPeriod} showFullCounter />
            </SubTitle>
            <Question> {t('options.royale.scoreboard.question')} </Question>
            <InfoText style={{ margin: '14px 0px' }}>
                <Trans i18nKey="options.royale.scoreboard.info1" components={{ bold: <strong /> }} />
            </InfoText>
            <InfoText>
                <Trans i18nKey="options.royale.scoreboard.info2" components={{ bold: <strong /> }} />
            </InfoText>
            <InfoText>
                <Trans
                    i18nKey="options.royale.scoreboard.info3"
                    components={{
                        bold: <strong />,
                        circle: <img src={circle} width="20" height="20" />,
                        triangle: <img src={triangle} width="20" height="20" />,
                    }}
                />
            </InfoText>
            <InfoText style={{ margin: '14px 0px' }}>{t('options.royale.scoreboard.info4')}</InfoText>
            <InfoText>
                <Trans
                    i18nKey="options.royale.scoreboard.info5"
                    components={{
                        bold: <strong />,
                    }}
                />
                <Link
                    href="https://thales-market-board.atlassian.net/browse/THALES-21"
                    target="_blank"
                    rel="noreferrer"
                >
                    {t('options.royale.scoreboard.blog')}
                </Link>
            </InfoText>
            <InfoText>
                <Trans
                    i18nKey="options.royale.scoreboard.info6"
                    components={{
                        bold: <strong />,
                    }}
                />
            </InfoText>
        </>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 510px;
`;

const Title = styled(Text)`
    align-self: center;
    font-family: Sansation Light !important;
    font-style: normal;
    font-weight: 300;
    font-size: 24px;
    line-height: 18px;
    text-align: center;
    letter-spacing: -0.4px;
    color: #64d9fe;
`;

const SubTitle = styled(Text)`
    margin-top: 4px;
    margin-bottom: 14px;
    align-self: center;
    span {
        font-family: VT323 !important;
        font-style: normal;
        font-weight: 400;
        font-size: 80px;
        line-height: 56px;
        text-align: justify;
        letter-spacing: -0.4px;
        color: #64d9fe;
    }
`;

const Question = styled(Text)`
    font-family: VT323 !important;
    font-style: normal;
    font-weight: bold;
    font-size: 25px;
    line-height: 24px;
    text-align: justify;
    letter-spacing: 2.1px;
    color: #64d9fe;
`;

const InfoText = styled(Text)`
    font-weight: 400;
    font-family: Sansation Light !important;
    text-overflow: ellipsis;
    &,
    strong {
        font-style: normal;

        font-size: 20px;
        line-height: 20px;
        text-align: justify;
        letter-spacing: -0.4px;
        color: #64d9fe;
    }

    strong {
        font-family: VT323 !important;
        font-weight: bold;
    }

    img {
        vertical-align: bottom;
    }
`;

const Link = styled.a`
    font-family: VT323 !important;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 20px;
    text-align: justify;
    letter-spacing: -0.4px;
    color: #64d9fe;
    &:hover {
        font-weight: bold;
        text-decoration: underline;
    }
`;

export default Scoreboard;
