import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ButtonContainer, Line, StyledInfoIcon, StyledMaterialTooltip } from '../components2';
import Instructions from './Instructions';
import YourTransactions from './Transactions';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import useLPStakingQuery from 'queries/token/useLPStakingQuery';
import useGelatoQuery from 'queries/token/useGelatoQuery';
import { formatCurrencyWithKey, formatCurrencyWithPrecision, formatCurrencyWithSign } from 'utils/formatters/number';
import { CRYPTO_CURRENCY_MAP, LP_TOKEN, THALES_CURRENCY, USD_SIGN } from 'constants/currency';
import Switch from 'components/SwitchInput/SwitchInputNew';
import Stake from './Stake';
import Unstake from './Unstake';
import NetworkFees from '../components/NetworkFees';
import ValidationMessage from 'components/ValidationMessage';
import Button from '../components/Button';
import { ButtonType } from '../components/Button/Button';
import onboardConnector from 'utils/onboardConnector';
import snxJSConnector from 'utils/snxJSConnector';
import { formatGasLimit } from 'utils/network';
import { MAX_L2_GAS_LIMIT } from 'constants/options';
import { ethers } from 'ethers';
import { dispatchMarketNotification } from 'utils/options';
import { refetchLPStakingQuery } from 'utils/queryConnector';

enum SectionType {
    INFO,
    CLAIM_INFO,
    CLAIM,
}

const LpStaking: React.FC = () => {
    const { t } = useTranslation();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const stakeOptions = {
        stake: { value: 'stake', label: t('options.earn.gamified-staking.staking.stake.name') },
        unstake: { value: 'unstake', label: t('options.earn.gamified-staking.staking.unstake.name') },
    };
    const [stakeOption, setStakeOption] = useState(stakeOptions.stake.value);
    const [isClaiming, setIsClaiming] = useState(false);
    const [gasLimit, setGasLimit] = useState<number | null>(null);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);

    const lpStakingQuery = useLPStakingQuery(walletAddress, networkId, {
        enabled: isAppReady,
    });
    const gelatoQuery = useGelatoQuery({ enabled: isAppReady });

    const staked = lpStakingQuery.isSuccess && lpStakingQuery.data ? Number(lpStakingQuery.data.staked) : 0;
    const paused = lpStakingQuery.isSuccess && lpStakingQuery.data ? lpStakingQuery.data.paused : false;
    const gelatoData = gelatoQuery.isSuccess ? gelatoQuery.data : undefined;
    const rewards = lpStakingQuery.isSuccess && lpStakingQuery.data ? Number(lpStakingQuery.data.rewards) : 0;
    const secondRewards =
        lpStakingQuery.isSuccess && lpStakingQuery.data ? Number(lpStakingQuery.data.secondRewards) : 0;

    const stakedInUSD = staked * (gelatoData?.priceInUSD ?? 0);
    const totalInUSD = gelatoData?.totalInUSD ?? 0;

    const myStakedShare = useMemo(() => (totalInUSD === 0 ? 0 : (100 * stakedInUSD) / totalInUSD), [
        stakedInUSD,
        totalInUSD,
    ]);

    const { lpStakingRewardsContract } = snxJSConnector as any;

    useEffect(() => {
        const fetchGasLimit = async () => {
            try {
                const lpStakingRewardsContractWithSigner = lpStakingRewardsContract.connect(
                    (snxJSConnector as any).signer
                );
                const gasEstimate = await lpStakingRewardsContractWithSigner.estimateGas.getReward();
                setGasLimit(formatGasLimit(gasEstimate, networkId));
            } catch (e) {
                console.log(e);
                setGasLimit(null);
            }
        };
        if (!isWalletConnected || (!rewards && !secondRewards)) return;
        fetchGasLimit();
    }, [isWalletConnected, rewards, secondRewards]);

    const getAprSection = () => {
        return (
            <SectionContentWrapper columnsTemplate={3}>
                <SectionContentWrapper columnsSpan={1}>
                    <SectionLabel type={SectionType.INFO}>
                        <SectionLabelContent type={SectionType.INFO}>
                            {t('options.earn.lp-staking.apr.total')}
                        </SectionLabelContent>
                        <StyledMaterialTooltip
                            arrow={true}
                            title={<Trans i18nKey={'options.earn.lp-staking.apr.total-tooltip'} />}
                            interactive
                        >
                            <StyledInfoIcon />
                        </StyledMaterialTooltip>
                    </SectionLabel>
                    <SectionValue type={SectionType.INFO}>
                        <SectionValueContent type={SectionType.INFO} colored={true}>
                            {gelatoQuery.isLoading ? '0%' : gelatoData?.totalApr}
                        </SectionValueContent>
                    </SectionValue>
                    <VerticalLineRight />
                </SectionContentWrapper>

                <SectionContentWrapper columnsSpan={2}>
                    <SectionDetails positionUp={true}>
                        <SectionDetailsLabel>{t('options.earn.lp-staking.apr.thales')}</SectionDetailsLabel>
                        <StyledMaterialTooltip
                            arrow={true}
                            title={<Trans i18nKey={'options.earn.lp-staking.apr.thales-tooltip'} />}
                            interactive
                        >
                            <StyledInfoIcon />
                        </StyledMaterialTooltip>
                        <SectionDetailsValue>{gelatoQuery.isLoading ? '0%' : gelatoData?.apr}</SectionDetailsValue>
                    </SectionDetails>
                    <Line margin={'0 15px'} />
                    <SectionDetails positionUp={false}>
                        <SectionDetailsLabel>{t('options.earn.lp-staking.apr.op')}</SectionDetailsLabel>
                        <StyledMaterialTooltip
                            arrow={true}
                            title={<Trans i18nKey={'options.earn.lp-staking.apr.op-tooltip'} />}
                            interactive
                        >
                            <StyledInfoIcon />
                        </StyledMaterialTooltip>
                        <SectionDetailsValue>
                            {gelatoQuery.isLoading ? '0%' : gelatoData?.secondApr}
                        </SectionDetailsValue>
                    </SectionDetails>
                </SectionContentWrapper>
            </SectionContentWrapper>
        );
    };

    const handleClaimStakingRewards = async () => {
        if (rewards || secondRewards) {
            try {
                setTxErrorMessage(null);
                setIsClaiming(true);
                const lpStakingRewardsContractWithSigner = lpStakingRewardsContract.connect(
                    (snxJSConnector as any).signer
                );
                const tx = (await lpStakingRewardsContractWithSigner.getReward({
                    gasLimit: MAX_L2_GAS_LIMIT,
                })) as ethers.ContractTransaction;
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    dispatchMarketNotification(t('options.earn.lp-staking.claim.claimed'));
                    refetchLPStakingQuery(walletAddress, networkId);
                    setIsClaiming(false);
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsClaiming(false);
            }
        }
    };

    const getClaimButton = () => {
        if (!isWalletConnected) {
            return (
                <Button type={ButtonType.submit} active={true} onClickHandler={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </Button>
            );
        }

        const buttonDisabled = isClaiming || (!rewards && !secondRewards);

        return (
            <Button
                type={ButtonType.submit}
                onClickHandler={handleClaimStakingRewards}
                active={!buttonDisabled}
                disabled={buttonDisabled}
                width={'50%'}
            >
                {isClaiming
                    ? t('options.earn.lp-staking.claim.claiming-rewards') + ` ...`
                    : t('options.earn.lp-staking.claim.claim-rewards')}
            </Button>
        );
    };

    const getClaimSection = () => {
        return (
            <SectionContentWrapper columnsSpan={2} padding={true}>
                <SectionLabel type={SectionType.CLAIM}>
                    <SectionLabelContent type={SectionType.CLAIM}>
                        {t('options.earn.lp-staking.claim.total-label')}
                    </SectionLabelContent>
                </SectionLabel>
                <SectionValue type={SectionType.CLAIM}>
                    <SectionValueContent type={SectionType.CLAIM}>
                        {`${formatCurrencyWithKey(THALES_CURRENCY, rewards)} + ${formatCurrencyWithKey(
                            CRYPTO_CURRENCY_MAP.OP,
                            secondRewards
                        )}`}
                    </SectionValueContent>
                </SectionValue>
                <Line margin={'10px 0'} />
                <NetworkFees gasLimit={gasLimit} />
                <ButtonContainer>
                    {getClaimButton()}
                    <ValidationMessage
                        showValidation={txErrorMessage !== null}
                        message={txErrorMessage}
                        onDismiss={() => setTxErrorMessage(null)}
                    />
                </ButtonContainer>
            </SectionContentWrapper>
        );
    };

    return (
        <>
            {/* First row */}
            <SectionWrapper backgroundType={BackgroundType.INSTRUCTIONS}>
                <SectionContentWrapper>
                    <Instructions />
                </SectionContentWrapper>
            </SectionWrapper>

            {/* Second row */}
            <SectionWrapper columns={6} backgroundType={BackgroundType.INFO}>
                <SectionContentWrapper background={false}>
                    <SectionLabel type={SectionType.INFO}>
                        <SectionLabelContent type={SectionType.INFO}>
                            {t('options.earn.lp-staking.info.staked-balance')}
                        </SectionLabelContent>
                        <StyledMaterialTooltip
                            arrow={true}
                            title={<Trans i18nKey={'options.earn.lp-staking.info.staked-balance-tooltip'} />}
                            interactive
                        >
                            <StyledInfoIcon />
                        </StyledMaterialTooltip>
                    </SectionLabel>
                    <SectionValue type={SectionType.INFO}>
                        <SectionValueContent type={SectionType.INFO}>
                            {formatCurrencyWithKey(LP_TOKEN, staked) +
                                ` (${formatCurrencyWithSign(USD_SIGN, stakedInUSD)})`}
                        </SectionValueContent>
                    </SectionValue>
                </SectionContentWrapper>
            </SectionWrapper>
            <SectionWrapper columns={6} backgroundType={BackgroundType.INFO}>
                {getAprSection()}
            </SectionWrapper>

            {/* Third row */}
            <SectionWrapper columns={6} backgroundType={BackgroundType.INSTRUCTIONS}>
                <SectionContentWrapper>
                    <SectionLabelContent type={SectionType.CLAIM_INFO}>
                        {t('options.earn.lp-staking.claim.title')}
                    </SectionLabelContent>
                </SectionContentWrapper>
            </SectionWrapper>
            <SectionWrapper columns={3} backgroundType={BackgroundType.INFO}>
                <SectionContentWrapper>
                    <SectionLabel type={SectionType.INFO}>
                        <SectionLabelContent type={SectionType.INFO}>
                            {t('options.earn.lp-staking.info.tvl')}
                        </SectionLabelContent>
                        <StyledMaterialTooltip
                            arrow={true}
                            title={<Trans i18nKey={'options.earn.lp-staking.info.tvl-tooltip'} />}
                            interactive
                        >
                            <StyledInfoIcon />
                        </StyledMaterialTooltip>
                    </SectionLabel>
                    <SectionValue type={SectionType.INFO}>
                        <SectionValueContent type={SectionType.INFO}>
                            {formatCurrencyWithSign(USD_SIGN, totalInUSD)}
                        </SectionValueContent>
                    </SectionValue>
                </SectionContentWrapper>
            </SectionWrapper>
            <SectionWrapper columns={3} backgroundType={BackgroundType.INFO}>
                <SectionContentWrapper>
                    <SectionLabel type={SectionType.INFO}>
                        <SectionLabelContent type={SectionType.INFO}>
                            {t('options.earn.lp-staking.info.share')}
                        </SectionLabelContent>
                        <StyledMaterialTooltip
                            arrow={true}
                            title={<Trans i18nKey={'options.earn.lp-staking.info.share-tooltip'} />}
                            interactive
                        >
                            <StyledInfoIcon />
                        </StyledMaterialTooltip>
                    </SectionLabel>
                    <SectionValue type={SectionType.INFO}>
                        <SectionValueContent type={SectionType.INFO}>
                            {formatCurrencyWithPrecision(myStakedShare)}%
                        </SectionValueContent>
                    </SectionValue>
                </SectionContentWrapper>
            </SectionWrapper>

            {/* Fourth row */}
            <SectionWrapper columns={6} backgroundType={BackgroundType.INSTRUCTIONS} noPadding={true}>
                <SectionContentWrapper columnsTemplate={2}>
                    <SectionWrapper columns={1} backgroundType={BackgroundType.CLAIM}>
                        <SectionContentWrapper columnsSpan={1} padding={true}>
                            <SectionValue type={SectionType.CLAIM_INFO}>
                                <SectionValueContent type={SectionType.CLAIM_INFO}>
                                    {formatCurrencyWithKey(THALES_CURRENCY, rewards)}
                                </SectionValueContent>
                            </SectionValue>
                        </SectionContentWrapper>
                    </SectionWrapper>
                    <SectionWrapper columns={1} backgroundType={BackgroundType.CLAIM}>
                        <SectionContentWrapper columnsSpan={1} padding={true}>
                            <SectionValue type={SectionType.CLAIM_INFO}>
                                <SectionValueContent type={SectionType.CLAIM_INFO}>
                                    {formatCurrencyWithKey(CRYPTO_CURRENCY_MAP.OP, secondRewards)}
                                </SectionValueContent>
                            </SectionValue>
                        </SectionContentWrapper>
                    </SectionWrapper>
                    <VerticalLineWrapper>
                        <VerticalLineCenter />
                    </VerticalLineWrapper>
                    <VerticalLineWrapper>
                        <VerticalLineCenter />
                    </VerticalLineWrapper>
                    <SectionWrapper columns={2} backgroundType={BackgroundType.CLAIM}>
                        {getClaimSection()}
                    </SectionWrapper>
                </SectionContentWrapper>
            </SectionWrapper>
            <SectionWrapper columns={6} backgroundType={BackgroundType.STAKE}>
                <SectionContentWrapper>
                    <Switch
                        active={stakeOption !== stakeOptions.stake.value}
                        width={'94px'}
                        height={'32px'}
                        margin={'30px 0 10px 0'}
                        dotSize={'22px'}
                        label={{
                            firstLabel: stakeOptions.stake.label.toUpperCase(),
                            secondLabel: stakeOptions.unstake.label.toUpperCase(),
                            fontSize: '25px',
                        }}
                        shadow={true}
                        dotBackground={'var(--amm-switch-circle)'}
                        handleClick={() => {
                            stakeOption === stakeOptions.stake.value
                                ? setStakeOption(stakeOptions.unstake.value)
                                : setStakeOption(stakeOptions.stake.value);
                        }}
                    />
                    {stakeOption === stakeOptions.stake.value && <Stake isStakingPaused={paused} />}
                    {stakeOption === stakeOptions.unstake.value && <Unstake staked={staked} />}
                </SectionContentWrapper>
            </SectionWrapper>

            {/* Fifth row */}
            <YourTransactions gridColumns={12} />
        </>
    );
};

enum BackgroundType {
    INSTRUCTIONS,
    INFO,
    STAKE,
    CLAIM,
}

const SectionWrapper = styled.section<{
    columns?: number;
    rows?: number;
    backgroundType?: BackgroundType;
    noPadding?: boolean;
}>`
    box-sizing: border-box;
    border-radius: 15px;
    height: 100%;
    ${(props) =>
        props.rows
            ? `
                display: grid; 
                grid-template-columns: 1fr; 
                grid-auto-rows: 1fr; 
                grid-gap: 24px;` // page GRID_GAP + borders(2 x 2px)
            : ''}
    grid-column: span ${(props) => (props.columns ? props.columns : 12)};
    grid-row: span ${(props) => (props.rows ? props.rows : 1)};
    background: ${(props) => {
        switch (props.backgroundType) {
            case BackgroundType.INSTRUCTIONS:
                return 'none';
            case BackgroundType.INFO:
                return 'linear-gradient(-20deg, #1BAB9C 0%, #4B6DC5 47.77%, #801BF2 100%)';
            case BackgroundType.STAKE:
            case BackgroundType.CLAIM:
                return '#64d9fe80';
            default:
                return 'linear-gradient(160deg, #801bf2 0%, #1BAB9C 100%)';
        }
    }};
    ${(props) => (props.noPadding ? '' : 'padding: 2px;')}
`;

const SectionContentWrapper = styled.div<{
    columnsTemplate?: number;
    columnsSpan?: number;
    background?: boolean;
    padding?: boolean;
}>`
    display: grid;
    position: relative;
    ${(props) =>
        props.columnsTemplate
            ? `
                grid-template-columns: repeat(${props.columnsTemplate},1fr);
                grid-template-rows: auto min-content;
                grid-gap: 10px;
            `
            : ''}
    ${(props) => (props.columnsSpan ? `grid-column: span ${props.columnsSpan};` : '')}
    height: 100%;
    background: ${(props) => (props.background ?? true ? '#04045a' : 'none')};
    border-radius: 15px;
    align-items: center;
    ${(props) => (props.padding ? 'padding: 10px 15px;' : '')}
`;

const SectionContent = styled.span`
    font-family: 'Roboto';
    color: #ffffff;
`;

const SectionLabel = styled.div<{ type: SectionType; margin?: string }>`
    display: flex;
    ${(props) => (props.margin ? `margin: ${props.margin};` : '')}
    ${(props) => {
        switch (props.type) {
            case SectionType.INFO:
                return 'padding: 10px 15px;';
            case SectionType.CLAIM:
                return `                
                    padding-top: 10px;
                    padding-bottom: 10px;
                    justify-content: center;
                `;
            case SectionType.CLAIM_INFO:
                return '';
            default:
                return '';
        }
    }}
`;

const SectionLabelContent = styled(SectionContent)<{ type?: SectionType }>`
    ${(props) => {
        switch (props.type) {
            case SectionType.INFO:
                return `
                    font-weight: 400;
                    font-size: 20px;
                    line-height: 20px;
                    text-transform: uppercase;
                `;
            case SectionType.CLAIM:
                return `
                    font-weight: 700;
                    font-size: 18px;
                    line-height: 24px;
                    text-transform: uppercase;
                `;
            case SectionType.CLAIM_INFO:
                return `
                    font-weight: 600;
                    font-size: 35px;
                    line-height: 37px;
                    letter-spacing: 0.035em;
                    padding-top: 30px;
                `;
            default:
                return '';
        }
    }}
`;

const SectionValue = styled.div<{ type: SectionType }>`
    ${(props) => {
        switch (props.type) {
            case SectionType.INFO:
                return 'padding: 10px 15px;';
            case SectionType.CLAIM:
                return `
                    display: flex;
                    justify-content: center;
                    padding-bottom: 10px;
                `;
            case SectionType.CLAIM_INFO:
                return `
                    display: flex;
                    justify-content: center; 
                `;
            default:
                return '';
        }
    }}
`;

const SectionValueContent = styled(SectionContent)<{ type: SectionType; colored?: boolean }>`
    letter-spacing: 0.035em;
    text-transform: uppercase;
    ${(props) => (props.colored ? 'color: #50ce99;' : '')}
    ${(props) => {
        switch (props.type) {
            case SectionType.INFO:
                return `
                    font-weight: 700;
                    font-size: 25px;
                    line-height: 30px;
                `;
            case SectionType.CLAIM:
                return `
                    font-weight: 700;
                    font-size: 33px;
                    color: #64D9FE;
                `;
            case SectionType.CLAIM_INFO:
                return `
                    font-weight: 700;
                    font-size: 28px;
                    color: #64D9FE;
                `;
            default:
                return '';
        }
    }}
`;

const SectionDetails = styled.div<{ positionUp: boolean }>`
    display: block;
    padding: ${(props) => (props.positionUp ? '16px 15px 5px 15px' : '7px 15px 14px 15px')};
`;

const SectionDetailsLabel = styled.span`
    float: left;
    font-weight: 300;
    font-size: 20px;
    line-height: 22px;
    letter-spacing: 0.035em;
    color: #ffffff;
`;

const SectionDetailsValue = styled.span`
    float: right;
    font-weight: 500;
    font-size: 20px;
    line-height: 22px;
    color: #50ce99;
`;

const VerticalLineRight = styled.hr`
    position: absolute;
    top: 5px;
    bottom: 5px;
    right: 0;
`;

const VerticalLineWrapper = styled.div`
    position: relative;
`;

const VerticalLineCenter = styled.hr`
    border: 1px solid #64d9fe80;
    position: absolute;
    top: -18px;
    left: 0;
    right: 0;
    width: 2px;
    height: 20px;
`;

export default LpStaking;
