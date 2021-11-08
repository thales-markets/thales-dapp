import { getDiscordData, getIsPlayerSignedUp, signUp, startRoyale, ThalesRoyalData } from '../../getThalesRoyalData';
import React, { useEffect, useMemo, useState } from 'react';
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
    const [discordUsers, setDiscordUsers] = useState(new Map());
    const [isPlayerSignedUp, setIsPlayerSignedUp] = useState(false);

    useEffect(() => {
        getDiscordData().then((data) => setDiscordUsers(new Map(data)));
    }, []);

    useEffect(() => {
        if (walletAddress) {
            getIsPlayerSignedUp(walletAddress).then((data) => {
                if (Number(data) !== 0) {
                    setIsPlayerSignedUp(true);
                }
            });
        }
    }, [walletAddress]);

    const { verifiedPlayers, unverifiedPlayers } = useMemo(() => {
        const verifiedPlayers: any = [];
        const unverifiedPlayers: any = [];
        if (discordUsers.size > 0 && walletAddress) {
            royaleData.players.map((player: any) => {
                if (discordUsers.has(player.toLowerCase())) {
                    verifiedPlayers.push(player.toLowerCase());
                } else {
                    unverifiedPlayers.push(player.toLowerCase());
                }
            });
        }
        return { verifiedPlayers, unverifiedPlayers };
    }, [discordUsers, walletAddress]);

    const truncateAddressNumberOfCharacters = window.innerWidth < 768 ? 2 : 5;
    const { t } = useTranslation();
    return (
        <Wrapper>
            <Intro royaleData={royaleData} />
            <UserWrapper>
                <FlexDiv style={{ alignItems: 'center' }}>
                    <UserAvatar
                        src={
                            discordUsers.get(walletAddress?.toLowerCase())
                                ? discordUsers.get(walletAddress?.toLowerCase()).avatar
                                : avatar
                        }
                    />
                    <InfoText>
                        {t('options.royale.scoreboard.player-no')}
                        {' #'}
                        {(royaleData.players as any).indexOf(walletAddress) + 1}
                    </InfoText>
                </FlexDiv>
                <FlexDivColumn style={{ margin: '20px 0' }}>
                    <FlexContainer>
                        <InfoText>{t('options.leaderboard.display-name')}:</InfoText>
                        <InputWrapper>
                            {discordUsers.get(walletAddress?.toLowerCase())
                                ? discordUsers.get(walletAddress?.toLowerCase()).name
                                : ''}
                        </InputWrapper>
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
                    {!discordUsers.get(walletAddress?.toLowerCase()) ? (
                        <Button>
                            Verify <Discord src={discord} />
                        </Button>
                    ) : isPlayerSignedUp ? (
                        <div></div>
                    ) : royaleData.signUpPeriod < new Date() ? (
                        <span style={{ color: 'white' }}>Sign Up has expired</span>
                    ) : (
                        <Button onClick={signUp.bind(this, setIsPlayerSignedUp)}>Sign Up</Button>
                    )}
                </FlexDivCentered>
            </UserWrapper>
            <TableWrapper>
                {verifiedPlayers.map((user: string, key: number) => (
                    <FlexDivCentered key={key} style={{ marginBottom: 12 }}>
                        <UserAvatar src={discordUsers.get(user.toLowerCase()).avatar} />
                        <InputWrapper style={{ marginRight: 6 }}>
                            {discordUsers.get(user.toLowerCase()).name}
                        </InputWrapper>
                        <InputWrapper style={{ marginLeft: 6 }}>
                            {truncateAddress(
                                user,
                                truncateAddressNumberOfCharacters,
                                truncateAddressNumberOfCharacters
                            )}
                        </InputWrapper>
                    </FlexDivCentered>
                ))}

                {unverifiedPlayers.map((user: string, key: number) => (
                    <FlexDivCentered key={key} style={{ marginBottom: 12, opacity: 0.7 }}>
                        <UserAvatar src={avatar} />
                        <InputWrapper style={{ marginRight: 6 }}>Unnamed</InputWrapper>
                        <InputWrapper style={{ marginLeft: 6 }}>
                            {truncateAddress(
                                user,
                                truncateAddressNumberOfCharacters,
                                truncateAddressNumberOfCharacters
                            )}
                        </InputWrapper>
                    </FlexDivCentered>
                ))}
                {Array.from(discordUsers)
                    .filter((user) => !isUserSignedUp(royaleData.players, user[0]))
                    .map((user: any, key: number) => (
                        <FlexDivCentered key={key} style={{ marginBottom: 12, opacity: 0.3 }}>
                            <UserAvatar src={user[1].avatar} />
                            <InputWrapper style={{ marginRight: 6 }}>{user[1].name}</InputWrapper>
                            <InputWrapper style={{ marginLeft: 6 }}>
                                {truncateAddress(
                                    user[0],
                                    truncateAddressNumberOfCharacters,
                                    truncateAddressNumberOfCharacters
                                )}
                            </InputWrapper>
                        </FlexDivCentered>
                    ))}
            </TableWrapper>
        </Wrapper>
    );
};

const isUserSignedUp = (players: [], user: string) => {
    return players.filter((player: any) => player.toLowerCase() === user).length > 0;
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
    cursor: pointer;
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
    border-radius: 50%50%;
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

    const getTitle = () => {
        if (royaleData.round === 0) {
            return (
                <>
                    <Title>{t('options.royale.scoreboard.starts')}</Title>
                    {royaleData.signUpPeriod < new Date() ? (
                        <Button onClick={startRoyale} style={{ margin: '30px auto', fontSize: 30, lineHeight: '30px' }}>
                            Start Thales Royale
                        </Button>
                    ) : (
                        <SubTitle>
                            <TimeRemaining end={royaleData.signUpPeriod} showFullCounter />
                        </SubTitle>
                    )}
                </>
            );
        } else if (royaleData.round === royaleData.rounds) {
            return (
                <>
                    <Title>{t('options.royale.scoreboard.ends')}</Title>
                    <SubTitle>
                        <TimeRemaining end={royaleData.roundEndTime} showFullCounter />
                    </SubTitle>
                </>
            );
        } else {
            return (
                <>
                    <Title>{t('options.royale.scoreboard.round-starts')}</Title>
                    <SubTitle>
                        <TimeRemaining end={royaleData.roundEndTime} showFullCounter />
                        <span> RD{royaleData.round + 1}</span>
                    </SubTitle>
                </>
            );
        }
    };

    return (
        <>
            {getTitle()}
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
