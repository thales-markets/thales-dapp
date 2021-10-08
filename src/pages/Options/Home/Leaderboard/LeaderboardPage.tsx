import twitter from 'assets/images/twitter.svg';
import Loader from 'components/Loader';
import ROUTES from 'constants/routes';
import { StyledLink } from 'pages/Options/Market/components/MarketOverview/MarketOverview';
import useUsersDisplayNamesQuery from 'queries/user/useUsersDisplayNamesQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { Background, Button, FlexDiv, FlexDivCentered, FlexDivColumn, Image, Text, Wrapper } from 'theme/common';
import { isNetworkSupported } from 'utils/network';
import MarketHeader from '../MarketHeader';
import LeaderboardTable from './LeaderboardTable';
import Profile from './Profile';
import TradingCompetition from './TradingCompetition';

const LeaderboardPage: React.FC = () => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [selectedTab, setSelectedTab] = useState('trading-competition');
    const [accVerified, setAccVerified] = useState(false);
    const [twitterAccountData, setTwitterAccountData] = useState({} as any);

    const displayNamesQuery = useUsersDisplayNamesQuery({
        enabled: isAppReady,
    });

    useEffect(() => {
        if (walletAddress) {
            const url = 'https://api.thales.market/twitter/' + walletAddress.toLowerCase();
            fetch(url).then(async (response) => {
                const result = JSON.parse(await response.text());
                if (result) {
                    setTwitterAccountData(result);
                }
            });
        }
    }, [walletAddress]);

    const displayNamesMap = useMemo(() => (displayNamesQuery.isSuccess ? displayNamesQuery.data : new Map()), [
        displayNamesQuery,
    ]);

    const optionsTabContent: Array<{
        id: string;
        name: string;
        disabled: boolean;
    }> = useMemo(
        () => [
            {
                id: 'trading-competition',
                name: t('options.leaderboard.trading-competition.tab-title'),
                disabled: false,
            },
            {
                id: 'leaderboard',
                name: t('options.leaderboard.board.tab-title'),
                disabled: false,
            },
            {
                id: 'profile',
                name: t('options.leaderboard.profile.tab-title'),
                disabled: false,
            },
        ],
        [t]
    );

    const tweetUrl = useMemo(() => {
        if (walletAddress) {
            const url = 'https://api.thales.market/auth/' + walletAddress;
            fetch(url).then(async (result) => {
                if ((await result.text()) === 'true') {
                    setAccVerified(true);
                }
            });

            return 'https://twitter.com/intent/tweet?text=' + TWEET_TEXT + walletAddress + TWEET_SUFFIX;
        } else {
            return '';
        }
    }, [walletAddress]);

    const checkAddress = async () => {
        window.open(tweetUrl, '_blank');
        let attempt = 0;
        const intervalId = setInterval(async () => {
            attempt = attempt + 1;
            if (attempt > 5) {
                clearInterval(intervalId);
            }
            const baseUrl = 'https://api.thales.market/twitter/' + walletAddress;
            const response = await fetch(baseUrl);
            const result = JSON.parse(await response.text());
            if (result) {
                setTwitterAccountData(result);
                setAccVerified(true);
                clearInterval(intervalId);
            }
        }, 5000);
    };

    return isNetworkSupported(networkId) ? (
        <Background style={{ minHeight: '100vh' }}>
            <Wrapper>
                <FlexDivColumn className="leaderboard" style={{ zIndex: 10 }}>
                    <MarketHeader route={ROUTES.Options.Leaderboard} />
                </FlexDivColumn>

                <FlexDivColumn style={{ width: '100%' }}>
                    <div style={{ height: 356 }}>
                        <div style={{ height: 168 }}>
                            {selectedTab === 'leaderboard' && (
                                <LeaderboardTitle className="pale-grey">
                                    {t('options.leaderboard.leaderboard-title')}
                                </LeaderboardTitle>
                            )}
                            {selectedTab === 'leaderboard' && (
                                <>
                                    <Text className="text-s ls25 lh24 pale-grey">
                                        {t('options.leaderboard.leaderboard-subtitle')}
                                    </Text>
                                    <Text className="text-s ls25 lh24 pale-grey">
                                        {t('options.leaderboard.leaderboard-subtitle-2')}
                                    </Text>
                                </>
                            )}
                            {selectedTab === 'trading-competition' && (
                                <LeaderboardTitle className="pale-grey">
                                    {t('options.leaderboard.trading-comp-title')}
                                </LeaderboardTitle>
                            )}
                            {selectedTab === 'trading-competition' && (
                                <>
                                    <Text className="text-s ls25 lh24 pale-grey">
                                        {t('options.leaderboard.trading-comp-subtitle')}
                                    </Text>
                                    <Text className="text-s ls25 lh24 pale-grey">
                                        {t('options.leaderboard.trading-comp-subtitle-2')}
                                    </Text>
                                    <Text className="text-s ls25 lh24 pale-grey">
                                        {t('options.leaderboard.trading-comp-subtitle-3')}
                                    </Text>
                                    <Text className="text-s ls25 lh24 pale-grey">
                                        {t('options.leaderboard.trading-comp-subtitle-4')}
                                        <StyledLink
                                            href="https://thalesmarket.medium.com/thales-new-markets-and-first-trading-competition-921d0d058f73"
                                            rel="noreferrer"
                                            target="_blank"
                                        >
                                            https://thalesmarket.medium.com/thales-new-markets-and-first-trading-competition-921d0d058f73
                                        </StyledLink>
                                    </Text>
                                </>
                            )}
                            {selectedTab === 'profile' && (
                                <LeaderboardTitle className="pale-grey">
                                    {t('options.leaderboard.profile-title')}
                                </LeaderboardTitle>
                            )}
                            {selectedTab === 'profile' && (
                                <Text className="text-s ls25 lh24 pale-grey">
                                    {t('options.leaderboard.profile-subtitle')}
                                </Text>
                            )}
                        </div>
                        <InfoContainer>
                            <FlexDiv
                                style={{
                                    background: 'linear-gradient(rgba(140, 114, 184, 0.6), rgba(106, 193, 213, 0.6))',
                                    borderRadius: 23,
                                    marginBottom: 16,
                                    flexDirection: 'column',
                                    height: 148,
                                }}
                            >
                                <Row
                                    style={{
                                        borderTopLeftRadius: 23,
                                        borderTopRightRadius: 23,
                                        height: 50,
                                        margin: '1px 1px 0 1px',
                                        paddingLeft: 36,
                                        lineHeight: 40,
                                        letterSpacing: 0.15,
                                        fontSize: 20,
                                        paddingTop: 8,
                                    }}
                                >
                                    <Text className="bold lh24" style={{ flex: 1 }}>
                                        {t('options.leaderboard.my-info')}:
                                    </Text>
                                </Row>
                                <Row
                                    style={{
                                        height: 48,
                                        paddingLeft: 36,
                                        lineHeight: 32,
                                        margin: '0 1px 0 1px',
                                        letterSpacing: 0.35,
                                        paddingTop: 26,
                                    }}
                                >
                                    <Text className="bold lh24" style={{ flex: 1, letterSpacing: 0.5 }}>
                                        {t('options.leaderboard.display-name')}:{' '}
                                        <span style={{ fontSize: 20, fontWeight: 700 }}>
                                            {displayNamesMap.get(walletAddress.toLowerCase().trim())}
                                        </span>
                                    </Text>
                                </Row>
                                <Row
                                    style={{
                                        borderBottomLeftRadius: 23,
                                        borderBottomRightRadius: 23,
                                        height: 48,
                                        paddingLeft: 36,
                                        margin: '0 1px 0 1px',
                                        lineHeight: 32,
                                        letterSpacing: 0.35,
                                        paddingTop: 4,
                                    }}
                                >
                                    <Text className="bold lh24" style={{ flex: 1, letterSpacing: 0.5 }}>
                                        {t('options.leaderboard.address')}:{' '}
                                        <span style={{ fontSize: 20, fontWeight: 700 }}>{walletAddress}</span>
                                    </Text>
                                </Row>
                            </FlexDiv>
                            <FlexDiv
                                style={{
                                    background: 'linear-gradient(rgba(140, 114, 184, 0.6), rgba(106, 193, 213, 0.6))',
                                    borderRadius: 23,
                                    marginBottom: 16,
                                    flexDirection: 'column',
                                    height: 148,
                                }}
                            >
                                <Row
                                    style={{
                                        borderTopLeftRadius: 23,
                                        borderTopRightRadius: 23,
                                        height: 50,
                                        paddingLeft: 36,
                                        margin: '1px 1px 0 1px',
                                        lineHeight: 40,
                                        letterSpacing: 0.15,
                                        fontSize: 20,
                                        paddingTop: 8,
                                    }}
                                >
                                    <Text className="bold lh24" style={{ flex: 1 }}>
                                        {t('options.leaderboard.twitter-account')}
                                    </Text>
                                </Row>
                                <Row
                                    style={{
                                        borderBottomLeftRadius: 23,
                                        borderBottomRightRadius: 23,
                                        paddingLeft: 36,
                                        margin: '0 1px 0 1px',
                                        paddingRight: 43,
                                        height: 96,
                                    }}
                                >
                                    {walletAddress && !accVerified && (
                                        <Image src={twitter} style={{ height: 50, width: 50 }}></Image>
                                    )}
                                    {walletAddress && accVerified && (
                                        <>
                                            <Image
                                                src={twitterAccountData.avatar}
                                                style={{ height: 50, width: 50, borderRadius: '50%' }}
                                            ></Image>
                                            <StyledLink
                                                href={twitterAccountData.twitter}
                                                target="_blank"
                                                className="text-m"
                                                style={{ flex: 1, marginLeft: 15 }}
                                            >
                                                {twitterAccountData.name}
                                            </StyledLink>
                                        </>
                                    )}
                                    {walletAddress && !accVerified && (
                                        <Button
                                            className="primary"
                                            style={{ width: 202, fontSize: 20 }}
                                            onClick={checkAddress}
                                        >
                                            {'Verify'}
                                        </Button>
                                    )}
                                </Row>
                            </FlexDiv>
                        </InfoContainer>
                    </div>
                    <MainContentContainer>
                        <OptionsTabContainer>
                            {optionsTabContent.map((tab, index) => (
                                <OptionsTab
                                    isActive={tab.id === selectedTab}
                                    key={index}
                                    index={index}
                                    onClick={() => (tab.disabled ? {} : setSelectedTab(tab.id))}
                                    className={`${tab.id === selectedTab ? 'selected' : ''} ${
                                        tab.disabled ? 'disabled' : ''
                                    }`}
                                >
                                    {`${tab.name} ${tab.disabled ? `(${t('common.coming-soon').toLowerCase()})` : ''}`}
                                </OptionsTab>
                            ))}
                        </OptionsTabContainer>
                        <WidgetsContainer>
                            {selectedTab === 'trading-competition' && (
                                <TradingCompetition displayNamesMap={displayNamesMap} />
                            )}
                            {selectedTab === 'leaderboard' && <LeaderboardTable displayNamesMap={displayNamesMap} />}
                            {selectedTab === 'profile' && <Profile displayNamesMap={displayNamesMap} />}
                        </WidgetsContainer>
                    </MainContentContainer>
                </FlexDivColumn>
            </Wrapper>
        </Background>
    ) : (
        <Loader />
    );
};

const TWEET_TEXT = "I'm joining the @Thalesmarket trading competition with address ";
const TWEET_SUFFIX = '.%0AWanna jump in? https://thales.market/markets/leaderboard%0ALet the games begin!';

const MainContentContainer = styled.div`
    padding-top: 5px;
    overflow: hidden;
`;

const OptionsTabContainer = styled.div`
    height: 50px;
    position: relative;
    width: 95%;
    margin: auto;
`;

const OptionsTab = styled(FlexDivCentered)<{ isActive: boolean; index: number }>`
    position: absolute;
    top: 0;
    left: ${(props) => props.index * 33 + '% '};
    background: linear-gradient(90deg, #141874, #04045a);
    width: 33.3%;
    z-index: ${(props) => (props.isActive ? 5 : 4 - props.index)};
    transition: 0.5s;
    transition-property: color;
    height: 50px;
    border-radius: 15px 15px 0 0;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
    letter-spacing: 0.15px;
    color: rgb(116, 139, 198);
    border-left: 1px solid rgba(116, 139, 198, 0.5);
    border-right: 1px solid rgba(116, 139, 198, 0.5);
    border-top: 1px solid rgba(116, 139, 198, 0.5);
    user-select: none;
    &.selected:not(.disabled) {
        background: #121776;
        transition: 0.2s;
        color: #f6f6fe;
        font-size: 20px;
        font-weight: 700;
        transform: scale(1.1) translateY(-1px);
        border-top: 1px solid rgba(202, 145, 220, 0.2);
        border-left: 1px solid rgba(202, 145, 220, 0.2);
        border-right: 1px solid rgba(202, 145, 220, 0.2);
    }
    &:hover:not(.selected):not(.disabled) {
        cursor: pointer;
        color: #00f9ff;
    }
    img {
        margin-left: 10px;
        margin-bottom: 5px;
    }
    &.disabled {
        color: rgb(116, 139, 198, 0.4);
        border-left: 1px solid rgba(116, 139, 198, 0.1);
        border-right: 1px solid rgba(116, 139, 198, 0.1);
        border-top: 1px solid rgba(116, 139, 198, 0.1);
        background: linear-gradient(90deg, #141874, #10126c);
    }
`;

const WidgetsContainer = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: auto min-content;
    grid-gap: 20px;
    padding: 16px 20px;
    border: 1px solid rgba(202, 145, 220, 0.2);
    border-radius: 15px;
    background: #121776;
    z-index: 0;
`;

const InfoContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    margin-top: 24px;
`;

const LeaderboardTitle = styled(Text)`
    font-size: 39px;
    line-height: 72px;
    font-weight: 600;
`;

export const Row = styled(FlexDiv)`
    color: #f6f6fe;
    line-height: 16px;
    font-weight: 600;
    padding: 5px;
    justify-content: space-between;
    align-items: center;
    background-color: #04045a;
    padding-left: 20px;
`;

export default LeaderboardPage;
