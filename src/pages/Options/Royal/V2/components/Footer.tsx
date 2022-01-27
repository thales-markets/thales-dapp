import ROUTES from 'constants/routes';
import { ReactComponent as InfoIcon } from 'assets/images/info.svg';
import { RoyaleTooltip } from 'pages/Options/Market/components';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered, LoaderContainer, Text } from 'theme/common';
import { navigateTo, history } from 'utils/routes';
import SimpleLoader from '../../components/SimpleLoader';
import useEthPriceQuery from '../../Queries/useEthPriceQuery';
import usePositionsQuery from '../../Queries/usePositionsQuery';
import useRoyaleFooterQuery from './queries/useRoyaleFooterQuery';
import queryString from 'query-string';

type ScoreboardProps = {
    latestSeason: number;
    selectedPage: string;
    setSelectedPage: (page: string) => void;
    selectedSeason: number;
    setSelectedSeason: (season: number) => void;
};

export const FooterV2: React.FC<ScoreboardProps> = ({
    selectedPage,
    setSelectedPage,
    selectedSeason,
    setSelectedSeason,
    latestSeason,
}) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const positionsQuery = usePositionsQuery(0, networkId, {
        enabled: networkId !== undefined && isAppReady,
    });
    const positions = positionsQuery.isSuccess ? positionsQuery.data : { up: 0, down: 0 };
    const ethPriceQuery = useEthPriceQuery({ enabled: isAppReady });
    const ethPrice = ethPriceQuery.isSuccess ? ethPriceQuery.data : '';

    const royaleDataQuery = useRoyaleFooterQuery({ enabled: isAppReady });
    const royaleData = royaleDataQuery.isSuccess ? royaleDataQuery.data : undefined;

    const [showStats, setShowStats] = useState(false);
    const [showSelectDropdown, setShowSelectDropdown] = useState(false);

    const loading = useMemo(() => {
        if (positionsQuery.isSuccess && ethPriceQuery.isSuccess) return false;
        return true;
    }, [positionsQuery, ethPriceQuery]);

    const allSeasons = useMemo(() => {
        const seasons = [];
        for (let j = 1; j <= Number(latestSeason); j++) {
            seasons.push(j);
        }
        return seasons;
    }, [latestSeason]);

    useEffect(() => {
        if (royaleData) {
            if (selectedPage === 'royale') {
                if (royaleData.round > 0) {
                    history.push({
                        pathname: location.pathname,
                        search: queryString.stringify({
                            page: selectedPage,
                        }),
                    });
                } else {
                    history.push({
                        pathname: location.pathname,
                        search: queryString.stringify({
                            page: 'scoreboard',
                        }),
                    });
                    setSelectedPage('scoreboard');
                }
            } else {
                history.push({
                    pathname: location.pathname,
                    search: queryString.stringify({
                        page: selectedPage,
                    }),
                });
            }
        }
    }, [selectedPage, royaleData]);

    return (
        <>
            <Footer>
                <Nav>
                    {selectedPage !== 'royale' && (
                        <NavButton onClick={() => navigateTo(ROUTES.Options.Home)}>
                            <i className="icon icon--left" />
                            <Text> Thales dApp </Text>
                        </NavButton>
                    )}
                    {selectedPage === 'royale' && (
                        <NavButton onClick={() => setSelectedPage('scoreboard')}>
                            <i className="icon icon--left" />
                            <Text>{t('options.royale.footer.scoreboard')}</Text>
                        </NavButton>
                    )}
                    {selectedPage !== 'royale' && (
                        <NavButton
                            className={royaleData?.round === 0 ? 'disabled' : ''}
                            onClick={() => {
                                if (royaleData && royaleData.round > 0) {
                                    setSelectedPage('royale');
                                }
                            }}
                        >
                            <Separator>|</Separator>
                            <Text>{t('options.royale.footer.royale')}</Text>
                            <i className="icon icon--right" />
                        </NavButton>
                    )}
                </Nav>
                <div />
                <FooterButtonsWrapper>
                    <SeasonSelector isOpen={showSelectDropdown}>
                        {selectedSeason !== 0 ? (
                            <Text onClick={setShowSelectDropdown.bind(this, true)}>
                                {t('options.royale.scoreboard.season')} {selectedSeason}
                                {!showSelectDropdown && <Arrow className="icon icon--arrow-up" />}
                            </Text>
                        ) : (
                            <Text>{t('options.royale.scoreboard.loading-season')}</Text>
                        )}

                        {showSelectDropdown &&
                            allSeasons
                                .filter((number) => number !== selectedSeason)
                                .map((option: number, key: number) => (
                                    <Text
                                        onClick={() => {
                                            setSelectedSeason(option);
                                            setShowSelectDropdown(false);
                                        }}
                                        key={key}
                                    >
                                        {t('options.royale.scoreboard.season')} {option}
                                    </Text>
                                ))}
                    </SeasonSelector>
                    <StatsIcon onClick={() => setShowStats(true)} className="icon icon--stats" />
                    <StatsButton onClick={() => setShowStats(true)}>{t('options.royale.footer.stats')}</StatsButton>
                </FooterButtonsWrapper>
            </Footer>
            <InfoSection style={{ visibility: showStats === true ? 'visible' : 'hidden' }}>
                <CloseStats onClick={() => setShowStats(false)}>✖</CloseStats>
                {loading ? (
                    <div style={{ width: 341, height: 130 }}>
                        <LoaderContainer style={{ top: 'calc(50%)', left: 'calc(50%)' }}>
                            <SimpleLoader />
                        </LoaderContainer>
                    </div>
                ) : (
                    <>
                        <div>
                            <span>{t('options.royale.footer.current-positions')}:</span>
                            <span>{t('options.royale.footer.up')}</span>
                            <span>{`${positions?.up} ${t('options.royale.footer.vs')}  ${positions?.down}`}</span>
                            <span>{t('options.royale.footer.down')}</span>
                        </div>
                        <div>
                            <span>
                                {t('options.royale.footer.current')} ETH {t('options.royale.footer.price')}:
                            </span>
                            <span>${Number(ethPrice).toFixed(2)}</span>
                            <InfoIconContainer>
                                <RoyaleTooltip title={t('options.royale.footer.price-source')}>
                                    <StyledInfoIcon />
                                </RoyaleTooltip>
                            </InfoIconContainer>
                        </div>
                        <div>
                            <span>{t('options.royale.footer.reward-per-player')}:</span>
                            <span>{royaleData?.reward.toFixed(2)} sUSD</span>
                        </div>
                        <div>
                            <span>{t('options.royale.footer.players-alive')}:</span>
                            <span>{royaleData?.playersAlive}</span>
                        </div>
                    </>
                )}
            </InfoSection>
        </>
    );
};

const InfoIconContainer = styled.span`
    display: inline-flex;
    align-items: center;
`;

const StyledInfoIcon = styled(InfoIcon)`
    width: 15px;
    height: 15px;
    path {
        fill: var(--color);
    }
`;

const Footer = styled.div`
    position: fixed;
    display: grid;
    grid-template-columns: 2fr 5fr 2fr;
    width: 100%;
    padding: 50px;
    align-items: flex-end;
    z-index: 100;
    @media (max-width: 1024px) {
        position: absolute;
        top: 0;
        padding: 17px;
        > * {
            &:nth-child(1) {
                justify-content: flex-start;
            }
            &:nth-child(2) {
                display: none;
            }
            &:nth-child(3) {
                display: none;
            }
        }
    }
    @media (min-width: 1025px) {
        bottom: 0;
    }
`;

const Separator = styled.span`
    padding: 0px 10px;
    @media (min-width: 1025px) {
        display: none;
    }
`;

const Nav = styled.div`
    display: flex;
    justify-content: space-between;
    width: 275px;
    @media (max-width: 1200px) {
        width: auto;
    }
    @media (max-width: 1024px) {
        width: 275px;
    }
`;

const NavButton = styled(FlexDivCentered)`
    justify-content: space-around;
    cursor: pointer;
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 22px;
    color: var(--color);
    > span {
        font-family: SansationLight !important;
    }
    &.disabled {
        cursor: not-allowed;
        opacity: 0.2;
    }
    img {
        margin: 0 10px;
    }
`;

const FooterButtonsWrapper = styled.div`
    position: relative;
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 22px;
    color: var(--color);
    display: flex;
    justify-content: flex-end;
`;

const StatsButton = styled.span`
    cursor: pointer;
    padding-left: 10px;
    line-height: 27px;
`;

const CloseStats = styled.span`
    cursor: pointer;
    position: absolute;
    top: 5px;
    right: 10px;
`;

const StatsIcon = styled.i`
    cursor: pointer;
`;

const InfoSection = styled.div`
    color: var(--color);
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 30px;
    border: 5px solid var(--color);
    box-sizing: border-box;
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    padding: 1.5em;
    position: fixed;
    z-index: 1000;
    right: 30px;
    bottom: 30px;
    background: var(--color-background);
    > * {
        margin-bottom: 0.1em;
        > * {
            font-family: SansationLight !important;
            &:nth-child(2),
            &:first-child {
                padding-right: 7px;
            }
            &:nth-child(3) {
                font-family: basis33 !important;
                font-weight: bold;
                font-size: 28px;
            }
            &:nth-child(4) {
                padding-left: 7px;
            }
        }
    }
    @media (max-width: 1024px) {
        display: none;
    }
`;

const SeasonSelector = styled.div<{ isOpen: boolean }>`
    transform: ${(props) => (props.isOpen ? 'translateY(calc(-100% + 30px))' : '')};
    position: absolute;
    top: -3px;
    right: 100px;
    margin-right: 5px;
    width: 171px;
    border: 2px solid var(--color);
    box-sizing: border-box;
    border-radius: 18px;
    font-family: Sansation !important;
    font-style: normal;
    font-size: 20px;
    line-height: 26px;
    letter-spacing: -0.4px;
    color: var(--color);
    cursor: pointer;
    text-align: center;
    background: var(--color-wrapper);
    z-index: 1;
    p:first-child {
        font-weight: bold;
        font-size: 20px;
    }
`;

const Arrow = styled.i`
    font-size: 12px;
    line-height: 8px;
    display: inline-block;
    padding-bottom: 3px;
    margin-left: 20px;
`;
