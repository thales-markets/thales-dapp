import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, FlexDiv, FlexDivColumn } from 'theme/common';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import useVestingBalanceQuery from 'queries/walletBalances/useVestingBalanceQuery';
import { getIsAppReady } from 'redux/modules/app';
import { VestingInfo } from 'types/token';
import snxJSConnector from 'utils/snxJSConnector';
import ValidationMessage from 'components/ValidationMessage/ValidationMessage';
import { formatShortDateWithTime } from 'utils/formatters/date';
import { EarnSection, SectionContent, SectionHeader } from '../../components';

const initialVestingInfo = {
    unlocked: 0,
    totalClaimed: 0,
    initialLocked: 0,
    startTime: 0,
    endTime: 0,
};

const RetroRewards: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [vestingInfo, setVestingInfo] = useState<VestingInfo>(initialVestingInfo);
    const [isClaiming, setIsClaiming] = useState(false);
    // const [gasLimit, setGasLimit] = useState<number | null>(null);

    const vestingQuery = useVestingBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (vestingQuery.isSuccess && vestingQuery.data) {
            setVestingInfo(vestingQuery.data);
        }
    }, [vestingQuery.isSuccess, vestingQuery.data]);

    const handleClaimRetroRewards = async () => {
        const { vestingEscrowContract } = snxJSConnector as any;

        try {
            setIsClaiming(true);
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
                    setIsClaiming(false);
                }
            }
        } catch (e) {
            setTxErrorMessage(t('common.errors.unknown-error-try-again'));
            setIsClaiming(false);
        }
    };

    const locked = vestingInfo.initialLocked - vestingInfo.unlocked - vestingInfo.totalClaimed;

    return (
        <EarnSection style={{ gridColumn: 'span 10' }}>
            <SectionHeader>{t('options.earn.snx-stakers.retro-rewards.title')}</SectionHeader>
            <FlexDiv>
                <RewardsInfoColumn>
                    <InfoDiv>
                        <div style={{ paddingBottom: '10px', fontSize: '16px' }}>Start time:</div>
                        <span>{vestingInfo.startTime && formatShortDateWithTime(vestingInfo.startTime)}</span>
                    </InfoDiv>
                </RewardsInfoColumn>
                <RewardsInfoColumn>
                    <InfoDiv>
                        <div style={{ paddingBottom: '10px', fontSize: '16px' }}>End time:</div>
                        <span>{vestingInfo.endTime && formatShortDateWithTime(vestingInfo.endTime)}</span>
                    </InfoDiv>
                </RewardsInfoColumn>
                <RewardsInfoColumn>
                    <InfoDiv>
                        <div style={{ paddingBottom: '10px', fontSize: '16px' }}>Initial Locked:</div>
                        <span>{vestingInfo.initialLocked} THALES</span>
                    </InfoDiv>
                </RewardsInfoColumn>
            </FlexDiv>
            <FlexDiv style={{ padding: '30px 30px 10px 30px', justifyContent: 'space-between' }}>
                <div>
                    <Dot
                        style={{
                            backgroundColor: '#b6bce2',
                        }}
                    />
                    {t('options.earn.snx-stakers.unlocked')}: {vestingInfo.unlocked.toFixed(2)} THALES
                </div>
                <div>
                    <Dot
                        style={{
                            backgroundColor: '#3f51b5',
                        }}
                    />
                    {t('options.earn.snx-stakers.claimed')}: {vestingInfo.totalClaimed.toFixed(2)} THALES
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
                        width: (vestingInfo.unlocked * 100) / vestingInfo.initialLocked + '%',
                    }}
                />
                <ProgressSlice
                    style={{
                        backgroundColor: '#3f51b5',
                        width: (vestingInfo.totalClaimed * 100) / vestingInfo.initialLocked + '%',
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
                        disabled={isClaiming || !vestingInfo.unlocked}
                        className="primary"
                        onClick={handleClaimRetroRewards}
                    >
                        {isClaiming
                            ? t('options.earn.snx-stakers.claiming-unlocked')
                            : t('options.earn.snx-stakers.claim-unlocked')}
                    </Button>
                </FlexDiv>
                <ValidationMessage
                    showValidation={txErrorMessage !== null}
                    message={txErrorMessage}
                    onDismiss={() => setTxErrorMessage(null)}
                />
            </SectionContent>
        </EarnSection>
    );
};

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

export default RetroRewards;
