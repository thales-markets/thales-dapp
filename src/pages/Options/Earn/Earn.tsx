import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Background, Button, FlexDiv, FlexDivCentered, FlexDivColumn, FlexDivRowCentered } from '../../../theme/common';
import MarketHeader from '../Home/MarketHeader';
import ROUTES from '../../../constants/routes';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import { getNetworkId, getWalletAddress } from '../../../redux/modules/wallet';
import useVestingBalanceQuery from '../../../queries/walletBalances/useVestingBalanceQuery';
import { getIsAppReady } from '../../../redux/modules/app';
import { VestingInfo } from '../../../types/vesting';
import snxJSConnector from '../../../utils/snxJSConnector';
import ValidationMessage from '../../../components/ValidationMessage/ValidationMessage';
import { formatShortDateWithTime } from '../../../utils/formatters/date';
import { airdropHashes } from '../../../utils/contracts/airdrop_hashes';
import { bigNumberFormatter } from '../../../utils/formatters/ethers';
import useRetroAirdropQuery from '../../../queries/walletBalances/useRetroAirdropQuery';

const EarnPage: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const [retroRewardsTxErrorMessage, setRetroRewardsTxErrorMessage] = useState<string | null>(null);
    const [retroAirdropTxErrorMessage, setRetroAirdropTxErrorMessage] = useState<string | null>(null);

    const retroAirdrop = useMemo(() => airdropHashes.find((airdrop) => airdrop.address === walletAddress), [
        walletAddress,
    ]);

    const vestingQuery = useVestingBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady,
    });
    const airdropQuery = useRetroAirdropQuery(walletAddress, networkId, retroAirdrop?.index, {
        enabled: retroAirdrop && isAppReady,
    });

    const [vestingInfo, setVestingInfo] = useState({ unlocked: 0, initialLocked: 0, totalClaimed: 0 } as VestingInfo);
    const [retroAirdropInfo, setRetroAirdropInfo] = useState({ claimed: true });
    const [selectedTab, setSelectedTab] = useState('snx-stakers');
    const [isClaimingRetroRewards, setIsClaimingRetroRewards] = useState(false);
    const [isClaimingRetroAirdrop, setIsClaimingRetroAirdrop] = useState(false);

    useEffect(() => {
        if (vestingQuery.isSuccess && vestingQuery.data) {
            setVestingInfo(vestingQuery.data);
        }
    }, [vestingQuery.isSuccess]);

    useEffect(() => {
        if (airdropQuery.isSuccess && airdropQuery.data) {
            setRetroAirdropInfo(airdropQuery.data);
        }
    }, [airdropQuery.isSuccess]);

    const optionsTabContent: Array<{
        id: string;
        name: string;
    }> = useMemo(
        () => [
            {
                id: 'snx-stakers',
                name: t('options.earn.snx-stakers.tab-title'),
            },
            {
                id: 'thales-staking',
                name: t('options.earn.thales-staking.tab-title'),
            },
            {
                id: 'vesting',
                name: t('options.earn.vesting.tab-title'),
            },
            {
                id: 'lp-staking',
                name: t('options.earn.lp-staking.tab-title'),
            },
            {
                id: 'thales-airdrop',
                name: t('options.earn.thales-airdrop.tab-title'),
            },
        ],
        [t]
    );

    const handleClaimRetroRewards = async () => {
        const { vestingEscrowContract } = snxJSConnector as any;

        try {
            setIsClaimingRetroRewards(true);
            const vestingContractWithSigner = vestingEscrowContract.connect((snxJSConnector as any).signer);
            const tx = await vestingContractWithSigner.claim();
            const txResult = await tx.wait();

            if (txResult && txResult.events) {
                const rawData = txResult.events[txResult.events?.length - 1];
                if (rawData && rawData.decode) {
                    setVestingInfo({
                        ...vestingInfo,
                        unlocked: 0,
                        totalClaimed: vestingInfo.totalClaimed + vestingInfo.unlocked,
                    });
                    setIsClaimingRetroRewards(false);
                }
            }
        } catch (e) {
            console.log(e);
            setRetroRewardsTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsClaimingRetroRewards(false);
        }
    };

    const handleClaimRetroAirdrop = async () => {
        const { retroAirdropContract } = snxJSConnector as any;

        try {
            setIsClaimingRetroAirdrop(true);
            const airdropContractWithSigner = retroAirdropContract.connect((snxJSConnector as any).signer);
            const tx = await airdropContractWithSigner.claim(
                retroAirdrop?.index,
                retroAirdrop && retroAirdrop.balance,
                retroAirdrop && retroAirdrop?.proof
            );
            const txResult = await tx.wait();

            if (txResult && txResult.events) {
                const rawData = txResult.events[txResult.events?.length - 1];
                if (rawData && rawData.decode) {
                    setRetroAirdropInfo({
                        claimed: true,
                    });
                    setIsClaimingRetroAirdrop(false);
                }
            }
        } catch (e) {
            console.log(e);
            setRetroAirdropTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsClaimingRetroAirdrop(false);
        }
    };

    const locked = vestingInfo.initialLocked - vestingInfo.unlocked - vestingInfo.totalClaimed;

    return (
        <Background style={{ height: '100%', position: 'fixed', overflow: 'auto', width: '100%' }}>
            <Container>
                <FlexDivColumn className="earn">
                    <MarketHeader route={ROUTES.Options.Earn} />
                </FlexDivColumn>
            </Container>
            <Container>
                <MainContent>
                    <MainContentContainer>
                        <OptionsTabContainer>
                            {optionsTabContent.map((tab, index) => (
                                <OptionsTab
                                    isActive={tab.id === selectedTab}
                                    key={index}
                                    index={index}
                                    onClick={() => setSelectedTab(tab.id)}
                                    className={tab.id === selectedTab ? 'selected' : ''}
                                >
                                    {tab.name}
                                </OptionsTab>
                            ))}
                        </OptionsTabContainer>
                        <WidgetsContainer>
                            {selectedTab === 'snx-stakers' && (
                                <>
                                    <EarnSection>
                                        <SectionHeader>
                                            {t('options.earn.snx-stakers.retro-airdrop.title')}
                                        </SectionHeader>
                                        <SectionContent>
                                            <ClaimDiv>
                                                <ClaimTitle>
                                                    {t('options.earn.snx-stakers.amount-to-claim')}:
                                                </ClaimTitle>
                                                <span>
                                                    {retroAirdrop && !retroAirdropInfo.claimed
                                                        ? bigNumberFormatter(retroAirdrop.balance)
                                                        : 0}{' '}
                                                    THALES
                                                </span>
                                            </ClaimDiv>
                                            <FlexDiv>
                                                <Button
                                                    onClick={handleClaimRetroAirdrop}
                                                    disabled={retroAirdropInfo.claimed || isClaimingRetroAirdrop}
                                                    className="primary"
                                                >
                                                    {isClaimingRetroAirdrop
                                                        ? t('options.earn.snx-stakers.claiming')
                                                        : t('options.earn.snx-stakers.claim')}
                                                </Button>
                                            </FlexDiv>
                                        </SectionContent>
                                        <div style={{ marginBottom: '15px' }}>
                                            <ValidationMessage
                                                showValidation={retroAirdropTxErrorMessage !== null}
                                                message={retroAirdropTxErrorMessage}
                                                onDismiss={() => setRetroAirdropTxErrorMessage(null)}
                                            />
                                        </div>
                                    </EarnSection>
                                    <EarnSection>
                                        <SectionHeader>
                                            {t('options.earn.snx-stakers.ongoing-rewards.title')}
                                        </SectionHeader>
                                        <SectionContent>
                                            <ClaimDiv>
                                                <ClaimTitle>
                                                    {t('options.earn.snx-stakers.amount-to-claim')}:
                                                </ClaimTitle>
                                                <span>154.9 THALES</span>
                                            </ClaimDiv>
                                            <FlexDiv>
                                                <Button className="primary">
                                                    {t('options.earn.snx-stakers.claim')}
                                                </Button>
                                            </FlexDiv>
                                        </SectionContent>
                                    </EarnSection>
                                    <EarnSection style={{ gridColumn: 'span 2' }}>
                                        <SectionHeader>
                                            {t('options.earn.snx-stakers.retro-rewards.title')}
                                        </SectionHeader>
                                        <FlexDiv>
                                            <RewardsInfoColumn>
                                                <InfoDiv>
                                                    <div style={{ paddingBottom: '10px', fontSize: '16px' }}>
                                                        Start time:
                                                    </div>
                                                    <span>
                                                        {vestingInfo.startTime &&
                                                            formatShortDateWithTime(vestingInfo.startTime)}
                                                    </span>
                                                </InfoDiv>
                                            </RewardsInfoColumn>
                                            <RewardsInfoColumn>
                                                <InfoDiv>
                                                    <div style={{ paddingBottom: '10px', fontSize: '16px' }}>
                                                        End time:
                                                    </div>
                                                    <span>
                                                        {vestingInfo.endTime &&
                                                            formatShortDateWithTime(vestingInfo.endTime)}
                                                    </span>
                                                </InfoDiv>
                                            </RewardsInfoColumn>
                                            <RewardsInfoColumn>
                                                <InfoDiv>
                                                    <div style={{ paddingBottom: '10px', fontSize: '16px' }}>
                                                        Initial Locked:
                                                    </div>
                                                    <span>{vestingInfo.initialLocked} THALES</span>
                                                </InfoDiv>
                                            </RewardsInfoColumn>
                                        </FlexDiv>
                                        <FlexDiv
                                            style={{ padding: '30px 30px 10px 30px', justifyContent: 'space-between' }}
                                        >
                                            <div>
                                                <Dot
                                                    style={{
                                                        backgroundColor: '#b6bce2',
                                                    }}
                                                />
                                                {t('options.earn.snx-stakers.unlocked')}:{' '}
                                                {vestingInfo.unlocked.toFixed(2)} THALES
                                            </div>
                                            <div>
                                                <Dot
                                                    style={{
                                                        backgroundColor: '#3f51b5',
                                                    }}
                                                />
                                                {t('options.earn.snx-stakers.claimed')}:{' '}
                                                {vestingInfo.totalClaimed.toFixed(2)} THALES
                                            </div>
                                            <div>
                                                <Dot
                                                    style={{
                                                        backgroundColor: '#0a2e66',
                                                    }}
                                                />
                                                {t('options.earn.snx-stakers.locked')}: {locked.toFixed(2)} THALES
                                            </div>
                                        </FlexDiv>
                                        <div style={{ padding: '0 30px' }}>
                                            <ProgressSlice
                                                style={{
                                                    backgroundColor: '#b6bce2',
                                                    width:
                                                        (vestingInfo.unlocked * 100) / vestingInfo.initialLocked + '%',
                                                }}
                                            />
                                            <ProgressSlice
                                                style={{
                                                    backgroundColor: '#3f51b5',
                                                    width:
                                                        (vestingInfo.totalClaimed * 100) / vestingInfo.initialLocked +
                                                        '%',
                                                }}
                                            />
                                            <ProgressSlice
                                                style={{
                                                    backgroundColor: '#0a2e66',
                                                    width: (locked * 100) / vestingInfo.initialLocked + '%',
                                                }}
                                            />
                                        </div>
                                        <SectionContent
                                            style={{
                                                justifyContent: 'center',
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            <FlexDiv>
                                                <Button
                                                    disabled={isClaimingRetroRewards || !vestingInfo.unlocked}
                                                    className="primary"
                                                    onClick={handleClaimRetroRewards}
                                                >
                                                    {isClaimingRetroRewards
                                                        ? t('options.earn.snx-stakers.claiming-unlocked')
                                                        : t('options.earn.snx-stakers.claim-unlocked')}
                                                </Button>
                                            </FlexDiv>
                                            <ValidationMessage
                                                showValidation={retroRewardsTxErrorMessage !== null}
                                                message={retroRewardsTxErrorMessage}
                                                onDismiss={() => setRetroRewardsTxErrorMessage(null)}
                                            />
                                        </SectionContent>
                                    </EarnSection>
                                </>
                            )}
                        </WidgetsContainer>
                    </MainContentContainer>
                </MainContent>
            </Container>
        </Background>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: min(100%, 1440px);
    margin: auto;
    @media (max-width: 768px) {
        flex-direction: column;
        width: 100%;
    }
`;

const MainContent = styled(FlexDivColumn)`
    padding: 20px 108px;
`;

const MainContentContainer = styled.div`
    border: 1px solid #0a2e66;
    border-radius: 15px;
    overflow: hidden;
`;

const OptionsTabContainer = styled.div`
    height: 75px;
    position: relative;
`;

const OptionsTab = styled(FlexDivCentered)<{ isActive: boolean; index: number }>`
    position: absolute;
    top: 0;
    left: ${(props) => props.index * 20 + '% '};
    background-color: transparent;
    width: 20%;
    z-index: ${(props) => (props.isActive ? props.index + 1 : 0)};
    transition: 0.5s;
    transition-property: color;
    height: 75px;
    border-radius: 15px 15px 0px 0px;
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 40px;
    text-align: center;
    letter-spacing: 0.15px;
    color: #b8c6e5;
    padding-bottom: 15px;
    border-left: 1px solid #0a2e66;
    border-right: 1px solid #0a2e66;
    &.selected {
        background-color: #0a2e66;
        transition: 0.2s;
        color: #f6f6fe;
    }
    &:hover:not(.selected) {
        cursor: pointer;
        border: 1.5px solid #00f9ff;
        color: #00f9ff;
    }
    img {
        margin-left: 10px;
        margin-bottom: 5px;
    }
`;

const WidgetsContainer = styled.div`
    background-color: #0a2e66;
    position: relative;
    display: grid;
    grid-template-columns: 50% auto;
    grid-gap: 10px;
    padding: 10px;
`;

const EarnSection = styled.section`
    padding-bottom: 0px;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    background: #04045a;
    border-radius: 23px;
    overflow: hidden;
    color: white;
`;

const SectionHeader = styled(FlexDivRowCentered)`
    font-weight: 600;
    font-size: 20px;
    letter-spacing: 0.15px;
    color: #f6f6fe;
    min-height: 50px;
    border-bottom: 1px solid rgba(228, 228, 228, 0.1);
    padding: 0px 20px 0 30px;
`;

const SectionContent = styled(FlexDiv)`
    padding: 30px 30px 15px 30px;
    justify-content: space-between;
    align-items: center;
`;

const ClaimDiv = styled(FlexDiv)`
    align-items: center;
`;

const ClaimTitle = styled.span`
    font-size: 18px;
    padding-right: 5px;
`;

const InfoDiv = styled(FlexDivColumn)`
    padding-bottom: 10px;
    align-items: center;
`;

const ProgressSlice = styled.div`
    height: 4px;
    display: inline-block;
`;

const Dot = styled.span`
    height: 10px;
    width: 10px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
`;

const RewardsInfoColumn = styled(FlexDivColumn)`
    padding: 30px 30px 0 30px;
    align-items: center;
    font-size: 16px !important;
`;
export default EarnPage;
