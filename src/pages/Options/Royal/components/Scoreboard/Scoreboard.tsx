import { getUsers, signUp, startRoyale, ThalesRoyalData, User, UserStatus } from '../../getThalesRoyalData';
import React, { useEffect, useMemo, useState } from 'react';
import { FlexDivCentered, FlexDivColumn, Text, Image, FlexDiv } from 'theme/common';
import styled from 'styled-components';
import TimeRemaining from 'pages/Options/components/TimeRemaining';
import { useTranslation, Trans } from 'react-i18next';
import triangle from 'assets/images/royale/triangle.svg';
import circle from 'assets/images/royale/circle.svg';
import avatar from 'assets/images/royale/avatar.svg';
import discord from 'assets/images/royale/discord.svg';
import notVerified from 'assets/images/royale/not-verified.svg';
import notSigned from 'assets/images/royale/not-signed.svg';
import dead from 'assets/images/royale/dead.svg';
import alive from 'assets/images/royale/alive.svg';
import next from 'assets/images/royale/next.svg';
import previous from 'assets/images/royale/previous.svg';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useSelector } from 'react-redux';
import { truncateAddress } from 'utils/formatters/string';
import { LightTooltip } from 'pages/Options/Market/components';
import { Arrow, ArrowsWrapper } from 'pages/Options/Home/MarketsTable/components';
import down from 'assets/images/down.svg';
import up from 'assets/images/up.svg';

type ScoreboardProps = {
    royaleData: ThalesRoyalData;
};

const Scoreboard: React.FC<ScoreboardProps> = ({ royaleData }) => {
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state));
    const truncateAddressNumberOfCharacters = window.innerWidth < 768 ? 2 : 5;
    const { t } = useTranslation();
    const [user, setUser] = useState<User>();
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const showPerPage = 15;

    useEffect(() => {
        getUsers(walletAddress, setUsers, setUser);
    }, []);

    const dataForUi = useMemo(() => {
        if (users.length > 0) {
            const maxPages = Math.ceil(users.length / showPerPage);
            const usersToDisplay = users.slice((page - 1) * showPerPage, showPerPage * page);
            return { maxPages, usersToDisplay };
        }
    }, [users, page]);

    const getFooter = (user: User | undefined) => {
        if (user) {
            if (user.status == UserStatus.RDY) {
                if (user.isAlive) {
                    return <></>;
                } else {
                    return <DeadText>You have been eliminated</DeadText>;
                }
            }
            if (user.status === UserStatus.NOTSIGNED) {
                return <Button onClick={signUp}>Sign Up</Button>;
            }
        }
        return (
            <Button>
                Verify <Discord src={discord} />
            </Button>
        );
    };

    const HeadCells = [
        { id: 1, text: t('options.royale.scoreboard.table-header.status'), sortable: true },
        { id: 2, text: t('options.royale.scoreboard.table-header.avatar'), sortable: false },
        { id: 3, text: t('options.royale.scoreboard.table-header.name'), sortable: true },
        { id: 4, text: t('options.royale.scoreboard.table-header.number'), sortable: true },
    ];

    return (
        <Wrapper>
            <Intro royaleData={royaleData} />
            <UserWrapper>
                <FlexDiv style={{ alignItems: 'center' }}>
                    <UserAvatar src={user?.avatar ?? avatar} style={{ marginRight: 14 }} />
                    <UserLabel>
                        {t('options.royale.scoreboard.player-no')}
                        {' #'}
                        {user?.number}
                    </UserLabel>
                </FlexDiv>
                <FlexDivColumn style={{ margin: '20px 0' }}>
                    <FlexContainer>
                        <UserLabel>{t('options.leaderboard.display-name')}:</UserLabel>
                        <InputWrapper>{user?.name}</InputWrapper>
                    </FlexContainer>
                    <FlexContainer>
                        <UserLabel>{t('options.leaderboard.address')}:</UserLabel>
                        <InputWrapper>
                            {truncateAddress(
                                walletAddress as any,
                                truncateAddressNumberOfCharacters,
                                truncateAddressNumberOfCharacters
                            )}
                        </InputWrapper>
                    </FlexContainer>
                </FlexDivColumn>
                {getFooter(user)}
            </UserWrapper>
            <TableWrapper>
                <TableRow>
                    {HeadCells.map((cell, key) => (
                        <HeadCell key={key}>
                            {cell.text}{' '}
                            {cell.sortable ? (
                                <ArrowsWrapper>
                                    {false ? (
                                        <Arrow src={down} />
                                    ) : (
                                        <>
                                            <Arrow src={up} />
                                            <Arrow src={down} />
                                        </>
                                    )}
                                </ArrowsWrapper>
                            ) : (
                                ''
                            )}
                        </HeadCell>
                    ))}
                </TableRow>
                {dataForUi?.usersToDisplay.map((user: User, key: number) => (
                    <TableRow key={key} style={{ marginBottom: 12, opacity: user.status === UserStatus.RDY ? 1 : 0.5 }}>
                        <HeadCell>
                            <Status>
                                <StatusAvatar src={user.isAlive ? alive : dead} />
                                <span>{user.isAlive ? 'alive' : 'dead'}</span>
                            </Status>
                        </HeadCell>
                        <HeadCell>{getAvatar(user)}</HeadCell>
                        <HeadCell style={{ marginRight: 6, textDecoration: '' }}>{user.name}</HeadCell>
                        <HeadCell style={{ marginLeft: 6 }}>#{user.number}</HeadCell>
                    </TableRow>
                ))}
                {dataForUi?.usersToDisplay ? (
                    <Pagination>
                        <Image
                            src={previous}
                            className={page <= 1 ? 'disabled' : ''}
                            onClick={() => {
                                if (page <= 1) return;
                                setPage(page - 1);
                            }}
                        />
                        <Text>
                            {page}/{dataForUi?.maxPages}
                        </Text>
                        <Image
                            className={dataForUi && dataForUi.maxPages === page ? 'disabled' : ''}
                            src={next}
                            onClick={() => {
                                if (dataForUi && dataForUi.maxPages === page) return;
                                setPage(page + 1);
                            }}
                        />
                    </Pagination>
                ) : (
                    ''
                )}
            </TableWrapper>
        </Wrapper>
    );
};

const getAvatar = (user: User) => {
    if (user.status === UserStatus.RDY) {
        return <UserAvatar src={user.avatar} />;
    }
    if (user.status === UserStatus.NOTVERIFIED) {
        return (
            <LightTooltip title="User is not verified on Discord">
                <UserAvatar src={notVerified} />
            </LightTooltip>
        );
    }

    if (user.status === UserStatus.NOTSIGNED) {
        return (
            <LightTooltip title="User is not registered for Thales Royale">
                <UserAvatar src={notSigned} />
            </LightTooltip>
        );
    }
};

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    img {
        width: 28px;
        height: 24px;
        &.disabled {
            opacity: 0.5;
        }
    }

    p {
        font-family: Sansation !important;
        font-style: normal;
        font-weight: bold;
        font-size: 20px;
        line-height: 330%;
        text-align: center;
        letter-spacing: -0.4px;
        color: #a1e1b4;
        margin: 0 10px;
    }
`;

const DeadText = styled(Text)`
    font-family: Sansation !important;
    font-style: normal;
    font-weight: bold;
    font-size: 23px;
    line-height: 26px;
    color: #64d9fe;
    text-shadow: 0px 0px 30px #64d9fe;
    text-align: center;
`;

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

const UserLabel = styled.p`
    font-family: Sansation !important;
    font-style: normal;
    font-size: 20px;
    color: #64d9fe;
`;

const Button = styled.button`
    align-items: center;
    cursor: pointer;
    display: flex;
    font-family: SansationLight !important;
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
    margin: auto;
`;

const UserAvatar = styled(Image)`
    width: 44px;
    height: 44px;
    border-radius: 50%50%;
`;

const StatusAvatar = styled(Image)`
    width: 35px;
    height: 35px;
    border-radius: 0;
`;

const Status = styled.span`
    cursor: default;
    span {
        display: none;
    }
    &:hover {
        img {
            display: none;
        }
        span {
            display: block;
        }
    }
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
    font-family: Sansation !important;
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

const TableRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    & > * {
        text-align: center;
        margin: 0 !important;
        min-width: 88px;
        &:first-child {
            flex: 1;
        }
        &:nth-child(2) {
            flex: 1;
        }
        &:nth-child(3) {
            flex: 2;
        }
        &:last-child {
            flex: 1;
        }
    }
`;

const HeadCell = styled(Text)`
    font-family: Sansation !important;
    font-size: 20px;
    color: #64d9fe;
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
    width: 570px;
    z-index: 1;
`;

const Title = styled(Text)`
    align-self: center;
    font-family: SansationLight !important;
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
    font-weight: 400;
    font-size: 25px;
    line-height: 20px;
    text-align: justify;
    letter-spacing: -0.4px;
    color: #64d9fe;
`;

const InfoText = styled(Text)`
    font-weight: 400;
    font-family: SansationLight !important;
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
