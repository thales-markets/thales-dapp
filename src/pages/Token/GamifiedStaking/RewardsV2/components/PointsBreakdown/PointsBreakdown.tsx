import { LINKS } from 'constants/links';
import ROUTES from 'constants/routes';
import { ScreenSizeBreakpoint } from 'enums/ui';
import usePointsBreakdownQuery, {
    DEFAULT_POINTS_BREAKDOWN_DATA,
    PointsData,
} from 'queries/token/usePointsBreakdownQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsMobile } from 'redux/modules/ui';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivRow } from 'styles/common';
import { buildHref, buildOvertimeVaultsLink, buildVaultLink } from 'utils/routes';

type TabType = 'trading' | 'amm-lp' | 'vaults';
type TabItem = { active: boolean; type: TabType };

const DefaultTabState: TabItem[] = [
    {
        active: false,
        type: 'trading',
    },
    {
        active: false,
        type: 'amm-lp',
    },
    {
        active: false,
        type: 'vaults',
    },
];

const PointsBreakdown: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const [tabs, setTabsState] = useState<TabItem[]>(DefaultTabState);
    const [lastValidStakingData, setLastValidStakingData] = useState<PointsData>(DEFAULT_POINTS_BREAKDOWN_DATA);

    const query = usePointsBreakdownQuery(walletAddress, networkId, { enabled: isAppReady });

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

    const onTabClick = (type: TabType) => {
        const _tabs = tabs.map((item) => {
            if (item.type == type) {
                return { ...item, active: !item.active };
            }
            return item;
        });
        setTabsState(_tabs);
    };

    const getClassNameForTab = (type: TabType) => {
        if (tabs.find((item) => item.type == type && item.active == true)) return `icon icon--caret-up`;
        return `icon icon--caret-down`;
    };

    return (
        <Container>
            <FlexDiv>
                <Title>{t('thales-token.gamified-staking.rewards.points.your-points')}</Title>
                {!isMobile && <Title>{t('thales-token.gamified-staking.rewards.points.your-multiplier')}</Title>}
            </FlexDiv>
            <FlexDiv>
                <ColumnFlex>
                    <BrakedownWrapper active={tabs[0].active}>
                        <Row>
                            <Cell row={true}>
                                <Icon className="sidebar-icon icon--trading" />
                                <CellValue highlight={true}>
                                    {t('thales-token.gamified-staking.rewards.points.trading')}
                                </CellValue>
                            </Cell>
                            {!isMobile && <VLine />}
                            <Cell>
                                <CellLabel>{t('thales-token.gamified-staking.rewards.points.total-volume')}</CellLabel>
                                <CellValue>{stakingData?.tradingVolume}</CellValue>
                            </Cell>
                            {!isMobile && <VLine />}
                            <Cell>
                                <CellLabel>
                                    {t('thales-token.gamified-staking.rewards.points.trading-multiplier')}
                                </CellLabel>
                                <CellValue highlight={true} addBefore={true}>
                                    {stakingData?.tradingMultiplier == 0 ? (
                                        <Span>-</Span>
                                    ) : (
                                        <>
                                            <Span>x</Span> {stakingData?.tradingMultiplier}
                                        </>
                                    )}
                                </CellValue>
                            </Cell>
                            {!isMobile && <VLine />}
                            <Cell>
                                <CellLabel>{t('thales-token.gamified-staking.rewards.points.points')}</CellLabel>
                                <CellValue highlight={true}>{stakingData?.tradingPoints}</CellValue>
                            </Cell>
                        </Row>
                        {tabs[0].active && (
                            <DropdownWrapper>
                                <DropdownHLine />
                                <DropdownLabel>
                                    {t('thales-token.gamified-staking.rewards.breakdown-section.your-volume-from')}
                                </DropdownLabel>
                                <LinksContainer>
                                    <LinkWrapper href={buildHref(ROUTES.Options.Home)} target="_blank" rel="noreferrer">
                                        <LinkIcon className="icon icon--thales-logo" />
                                        <LinkLabelContainer>
                                            <LinkLabel>
                                                {t(
                                                    'thales-token.gamified-staking.rewards.breakdown-section.volume-gathered.trading'
                                                )}
                                            </LinkLabel>
                                            <ExternalIcon className="icon icon__external" />
                                        </LinkLabelContainer>
                                    </LinkWrapper>
                                    <LinkWrapper href={LINKS.Overtime.Markets} target="_blank" rel="noreferrer">
                                        <LinkIcon className="icon icon--overtime" />
                                        <LinkLabelContainer>
                                            <LinkLabel>
                                                {t(
                                                    'thales-token.gamified-staking.rewards.breakdown-section.volume-gathered.overtime-trading'
                                                )}
                                            </LinkLabel>
                                            <ExternalIcon className="icon icon__external" />
                                        </LinkLabelContainer>
                                    </LinkWrapper>
                                </LinksContainer>
                            </DropdownWrapper>
                        )}
                        <Arrow className={getClassNameForTab('trading')} onClick={() => onTabClick('trading')} />
                    </BrakedownWrapper>
                    <BrakedownWrapper active={tabs[1].active}>
                        <Row>
                            <Cell row={true}>
                                <Icon className="sidebar-icon icon--liquidity-pool" />
                                <CellValue highlight={true}>
                                    {t('thales-token.gamified-staking.rewards.points.amm-lp')}
                                </CellValue>
                            </Cell>
                            {!isMobile && <VLine />}
                            <Cell>
                                <CellLabel>{t('thales-token.gamified-staking.rewards.points.total-amm')}</CellLabel>
                                <CellValue>{stakingData?.lpVolume}</CellValue>
                            </Cell>
                            {!isMobile && <VLine />}
                            <Cell>
                                <CellLabel>{t('thales-token.gamified-staking.rewards.points.lp-multiplier')}</CellLabel>
                                <CellValue highlight={true} addBefore={true}>
                                    {stakingData?.lpMultiplier == 0 ? (
                                        <Span>-</Span>
                                    ) : (
                                        <>
                                            <Span>x</Span> {stakingData?.lpMultiplier}
                                        </>
                                    )}
                                </CellValue>
                            </Cell>
                            {!isMobile && <VLine />}
                            <Cell>
                                <CellLabel>{t('thales-token.gamified-staking.rewards.points.points')}</CellLabel>
                                <CellValue highlight={true}>{stakingData?.lpPoints}</CellValue>
                            </Cell>
                        </Row>
                        {tabs[1].active && (
                            <DropdownWrapper>
                                <DropdownHLine />
                                <DropdownLabel>
                                    {t('thales-token.gamified-staking.rewards.breakdown-section.your-volume-from')}
                                </DropdownLabel>
                                <LinksContainer>
                                    <LinkWrapper href={ROUTES.Options.LiquidityPool} target="_blank" rel="noreferrer">
                                        <LinkIcon className="icon icon--lp-thales" />
                                        <LinkLabelContainer>
                                            <LinkLabel>
                                                {t(
                                                    'thales-token.gamified-staking.rewards.breakdown-section.volume-gathered.lp-thales'
                                                )}
                                            </LinkLabel>
                                            <ExternalIcon className="icon icon__external" />
                                        </LinkLabelContainer>
                                    </LinkWrapper>
                                    <LinkWrapper href={LINKS.Overtime.LiquidityPool} target="_blank" rel="noreferrer">
                                        <LinkIcon className="icon icon--lp-overtime" />
                                        <LinkLabelContainer>
                                            <LinkLabel>
                                                {t(
                                                    'thales-token.gamified-staking.rewards.breakdown-section.volume-gathered.lp-overtime'
                                                )}
                                            </LinkLabel>
                                            <ExternalIcon className="icon icon__external" />
                                        </LinkLabelContainer>
                                    </LinkWrapper>
                                </LinksContainer>
                            </DropdownWrapper>
                        )}
                        <Arrow className={getClassNameForTab('amm-lp')} onClick={() => onTabClick('amm-lp')} />
                    </BrakedownWrapper>
                    <BrakedownWrapper active={tabs[2].active}>
                        <Row>
                            <Cell row={true}>
                                <Icon className="sidebar-icon icon--vaults" />
                                <CellValue highlight={true}>
                                    {t('thales-token.gamified-staking.rewards.points.vaults')}
                                </CellValue>
                            </Cell>
                            {!isMobile && <VLine />}
                            <Cell>
                                <CellLabel>{t('thales-token.gamified-staking.rewards.points.total-vaults')}</CellLabel>
                                <CellValue>{stakingData?.vaultsVolume}</CellValue>
                            </Cell>
                            {!isMobile && <VLine />}
                            <Cell>
                                <CellLabel>
                                    {t('thales-token.gamified-staking.rewards.points.vaults-multiplier')}
                                </CellLabel>
                                <CellValue highlight={true} addBefore={true}>
                                    <CellValue highlight={true} addBefore={true}>
                                        {stakingData?.vaultsMultiplier == 0 ? (
                                            <Span>-</Span>
                                        ) : (
                                            <>
                                                <Span>x</Span> {stakingData?.vaultsMultiplier}
                                            </>
                                        )}
                                    </CellValue>
                                </CellValue>
                            </Cell>
                            {!isMobile && <VLine />}
                            <Cell>
                                <CellLabel>{t('thales-token.gamified-staking.rewards.points.points')}</CellLabel>
                                <CellValue highlight={true}>{stakingData?.vaultsPoints}</CellValue>
                            </Cell>
                        </Row>
                        {tabs[2].active && (
                            <DropdownWrapper>
                                <DropdownHLine />
                                <DropdownLabel>
                                    {t('thales-token.gamified-staking.rewards.breakdown-section.your-volume-from')}
                                </DropdownLabel>
                                <>
                                    <VaultsWrapper>
                                        <VaultsLabel>
                                            {t(
                                                'thales-token.gamified-staking.rewards.breakdown-section.volume-gathered.thales-vaults'
                                            )}
                                        </VaultsLabel>
                                        {!isMobile && <VLine active={tabs[2].active} />}
                                        <LinksContainer>
                                            <LinkWrapper
                                                href={buildVaultLink('discount-vault')}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <LinkIcon className="icon icon__discount-vault" />
                                                <LinkLabelContainer>
                                                    <LinkLabel>
                                                        {t(
                                                            'thales-token.gamified-staking.rewards.breakdown-section.volume-gathered.discount-vault'
                                                        )}
                                                    </LinkLabel>
                                                    <ExternalIcon className="icon icon__external" />
                                                </LinkLabelContainer>
                                            </LinkWrapper>
                                            <LinkWrapper
                                                href={buildVaultLink('degen-discount-vault')}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <LinkIcon className="icon icon__degen-discount-vault" />
                                                <LinkLabelContainer>
                                                    <LinkLabel>
                                                        {t(
                                                            'thales-token.gamified-staking.rewards.breakdown-section.volume-gathered.degen-discount-vault'
                                                        )}
                                                    </LinkLabel>
                                                    <ExternalIcon className="icon icon__external" />
                                                </LinkLabelContainer>
                                            </LinkWrapper>
                                            <LinkWrapper
                                                href={buildVaultLink('safu-discount-vault')}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <LinkIcon className="icon icon--safu-thales-vault" />
                                                <LinkLabelContainer>
                                                    <LinkLabel>
                                                        {t(
                                                            'thales-token.gamified-staking.rewards.breakdown-section.volume-gathered.safu-vault'
                                                        )}
                                                    </LinkLabel>
                                                    <ExternalIcon className="icon icon__external" />
                                                </LinkLabelContainer>
                                            </LinkWrapper>
                                        </LinksContainer>
                                    </VaultsWrapper>
                                    <VaultsWrapper>
                                        <VaultsLabel>
                                            {t(
                                                'thales-token.gamified-staking.rewards.breakdown-section.volume-gathered.sport-vaults'
                                            )}
                                        </VaultsLabel>
                                        {!isMobile && <VLine active={tabs[2].active} />}
                                        <LinksContainer>
                                            <LinkWrapper
                                                href={buildOvertimeVaultsLink('discount-vault')}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <LinkIcon className="icon icon--discount-sport-vault" />
                                                <LinkLabelContainer>
                                                    <LinkLabel>
                                                        {t(
                                                            'thales-token.gamified-staking.rewards.breakdown-section.volume-gathered.discount-vault'
                                                        )}
                                                    </LinkLabel>
                                                    <ExternalIcon className="icon icon__external" />
                                                </LinkLabelContainer>
                                            </LinkWrapper>
                                            <LinkWrapper
                                                href={buildOvertimeVaultsLink('degen-discount-vault')}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <LinkIcon className="icon icon__degen-vault" />
                                                <LinkLabelContainer>
                                                    <LinkLabel>
                                                        {t(
                                                            'thales-token.gamified-staking.rewards.breakdown-section.volume-gathered.degen-vault'
                                                        )}
                                                    </LinkLabel>
                                                    <ExternalIcon className="icon icon__external" />
                                                </LinkLabelContainer>
                                            </LinkWrapper>
                                            <LinkWrapper
                                                href={buildOvertimeVaultsLink('safu-discount-vault')}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <LinkIcon className="icon icon__safu-overtime" />
                                                <LinkLabelContainer>
                                                    <LinkLabel>
                                                        {t(
                                                            'thales-token.gamified-staking.rewards.breakdown-section.volume-gathered.safu-vault'
                                                        )}
                                                    </LinkLabel>
                                                    <ExternalIcon className="icon icon__external" />
                                                </LinkLabelContainer>
                                            </LinkWrapper>
                                            <LinkWrapper
                                                href={buildOvertimeVaultsLink('upsettoor-vault')}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <LinkIcon className="icon icon__safu-overtime" />
                                                <LinkLabelContainer>
                                                    <LinkLabel>
                                                        {t(
                                                            'thales-token.gamified-staking.rewards.breakdown-section.volume-gathered.upsettoor-vault'
                                                        )}
                                                    </LinkLabel>
                                                    <ExternalIcon className="icon icon__external" />
                                                </LinkLabelContainer>
                                            </LinkWrapper>
                                            <LinkWrapper
                                                href={buildOvertimeVaultsLink('parlay-discount-vault')}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <LinkIcon className="icon icon__parlay-vault" />
                                                <LinkLabelContainer>
                                                    <LinkLabel>
                                                        {t(
                                                            'thales-token.gamified-staking.rewards.breakdown-section.volume-gathered.parlay-vault'
                                                        )}
                                                    </LinkLabel>
                                                    <ExternalIcon className="icon icon__external" />
                                                </LinkLabelContainer>
                                            </LinkWrapper>
                                        </LinksContainer>
                                    </VaultsWrapper>
                                </>
                            </DropdownWrapper>
                        )}
                        <Arrow className={getClassNameForTab('vaults')} onClick={() => onTabClick('vaults')} />
                    </BrakedownWrapper>
                </ColumnFlex>
                {isMobile && <Title>{t('thales-token.gamified-staking.rewards.points.your-multiplier')}</Title>}
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
            {isWalletConnected && (
                <FlexDiv>
                    <TotalPoints>
                        <CellValue highlight={true}>
                            {`${t('thales-token.gamified-staking.rewards.points.your-current-points')} = ${
                                stakingData?.totalPoints
                            }`}
                        </CellValue>
                    </TotalPoints>
                </FlexDiv>
            )}
        </Container>
    );
};

const Container = styled.div`
    margin-top: 20px;
`;

const FlexDiv = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 20px;
    justify-content: space-between;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-wrap: wrap;
    }
`;

const ColumnFlex = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
    width: 100%;
`;

const Row = styled.div`
    position: relative;
    /* border: 1px solid ${(props) => props.theme.borderColor.primary}; */
    /* border-radius: 8px; */
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-wrap: wrap;
    }
`;

const BrakedownWrapper = styled(ColumnFlex)<{ active: boolean }>`
    position: relative;
    background-color: ${(_props) => (_props?.active ? _props.theme.background.secondary : '')};
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 8px;
    display: flex;
    align-items: center;
    width: 100%;
    padding-top: 10px;
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
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        max-width: initial;
    }
`;

const VLine = styled.div<{ active?: boolean }>`
    width: 2px;
    background-color: ${(props) =>
        props.active ? props.theme.borderColor.secondary : props.theme.borderColor.primary};
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

const Arrow = styled.i`
    font-size: 16px;
    color: ${(_props) => _props.theme.textColor.quaternary};
    position: absolute;
    bottom: 10px;
    right: 10px;
    cursor: pointer;
`;

const Title = styled.p`
    font-weight: 400;
    font-size: 18px;
    color: ${(props) => props.theme.textColor.primary};
    margin-bottom: 10px;
    margin-top: 20px;
    text-transform: capitalize;
`;

const DropdownWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
    align-items: center;
`;

const DropdownLabel = styled.span`
    font-size: 13px;
    font-style: normal;
    align-self: flex-start;
    color: ${(_props) => _props.theme.textColor.primary};
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        margin-bottom: 20px;
    }
`;

const DropdownHLine = styled.div`
    background-color: ${(props) => props.theme.borderColor.secondary};
    height: 1px;
    width: 100%;
    padding: 0 10px;
    margin: 10px 0;
`;

const LinksContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    width: 80%;
    padding: 20px 0;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        width: 100%;
        flex-wrap: wrap;
        justify-content: space-around;
    }
`;

const LinkWrapper = styled.a`
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    position: relative;
    min-width: 100px;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        min-width: 120px;
    }
`;

const LinkIcon = styled.i`
    font-size: 40px !important;
    color: ${(_props) => _props.theme.textColor.primary};
    padding: 10px 0px;
`;

const LinkLabelContainer = styled.div`
    display: flex;
    position: relative;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    cursor: pointer;
`;

const LinkLabel = styled.span`
    display: flex;
    text-transform: uppercase;
    font-size: 13px;
    color: ${(_props) => _props.theme.textColor.primary};
    word-wrap: normal;
`;

const ExternalIcon = styled.span`
    position: absolute;
    top: -5;
    right: -15px;
    margin-left: 5px;
    font-size: 8px;
    color: ${(_props) => _props.theme.textColor.primary};
`;

const VaultsWrapper = styled(FlexDivRow)`
    width: 100%;
    align-items: center;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: column;
    }
`;

const VaultsLabel = styled.div`
    font-size: 22px;
    color: ${(_props) => _props.theme.textColor.primary};
    font-style: normal;
    font-weight: 700;
    text-transform: uppercase;
    min-width: 180px;
    @media screen and (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        text-align: left;
        align-self: flex-start;
    }
`;

export default PointsBreakdown;
