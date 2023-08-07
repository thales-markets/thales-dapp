import PythInterfaceAbi from '@pythnetwork/pyth-sdk-solidity/abis/IPyth.json';
import Button from 'components/Button';
import SimpleLoader from 'components/SimpleLoader/SimpleLoader';
import {
    getDefaultToastContent,
    getErrorToastOptions,
    getInfoToastOptions,
    getLoadingToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';
import { CONNECTION_TIMEOUT_MS, PYTH_CONTRACT_ADDRESS } from 'constants/pyth';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { BigNumber, ethers } from 'ethers';
import useActiveSpeedMarketsDataQuery from 'queries/options/speedMarkets/useActiveSpeedMarketsDataQuery';
import React, { CSSProperties, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIsAppReady } from 'redux/modules/app';
import { getIsMobile } from 'redux/modules/ui';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivRow } from 'styles/common';
import snxJSConnector from 'utils/snxJSConnector';
import UnresolvedPosition from '../UnresolvedPosition';
import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import { getPriceId, getPriceServiceEndpoint } from 'utils/pyth';
import { millisecondsToSeconds, secondsToMilliseconds } from 'date-fns';
import { delay } from 'utils/timer';
import { refetchActiveSpeedMarkets } from 'utils/queryConnector';
import { UserLivePositions } from 'types/options';

const SECTIONS = {
    userWinner: 'userWinner',
    ammWinner: 'ammWinner',
    unknownPrice: 'unknownPrice',
    openPositions: 'openPositions',
};

const UnresolvedPositions: React.FC = () => {
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmittingSection, setIsSubmittingSection] = useState('');

    const activeSpeedMarketsDataQuery = useActiveSpeedMarketsDataQuery(networkId, {
        enabled: isAppReady,
        refetchInterval: secondsToMilliseconds(30),
    });

    const activeSpeedMarketsData = useMemo(
        () =>
            activeSpeedMarketsDataQuery.isSuccess && activeSpeedMarketsDataQuery.data
                ? activeSpeedMarketsDataQuery.data
                : [],
        [activeSpeedMarketsDataQuery]
    );

    const userWinnerSpeedMarketsData = activeSpeedMarketsData
        .filter((marketData) => marketData.maturityDate < Date.now() && marketData.claimable && !!marketData.finalPrice)
        .sort((a, b) => a.maturityDate - b.maturityDate);
    const ammWinnerSpeedMarketsData = activeSpeedMarketsData
        .filter(
            (marketData) => marketData.maturityDate < Date.now() && !marketData.claimable && !!marketData.finalPrice
        )
        .sort((a, b) => a.maturityDate - b.maturityDate);
    const unknownPriceSpeedMarketsData = activeSpeedMarketsData
        .filter((marketData) => marketData.maturityDate < Date.now() && !marketData.claimable && !marketData.finalPrice)
        .sort((a, b) => a.maturityDate - b.maturityDate);
    const openSpeedMarketsData = activeSpeedMarketsData
        .filter((marketData) => marketData.maturityDate > Date.now())
        .sort((a, b) => a.maturityDate - b.maturityDate);

    const handleResolveAll = async (positions: UserLivePositions[]) => {
        if (!positions.length) {
            return;
        }

        const priceConnection = new EvmPriceServiceConnection(getPriceServiceEndpoint(networkId), {
            timeout: CONNECTION_TIMEOUT_MS,
        });

        const { speedMarketsAMMContract, signer } = snxJSConnector as any;
        if (speedMarketsAMMContract) {
            setIsSubmitting(true);
            const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());

            const speedMarketsAMMContractWithSigner = speedMarketsAMMContract.connect(signer);

            const marketsToResolve: string[] = [];
            const priceUpdateDataArray: string[] = [];
            let totalUpdateFee = BigNumber.from(0);
            for (const position of positions) {
                try {
                    const pythContract = new ethers.Contract(
                        PYTH_CONTRACT_ADDRESS[networkId],
                        PythInterfaceAbi as any,
                        (snxJSConnector as any).provider
                    );

                    const [priceFeedUpdateVaa] = await priceConnection.getVaa(
                        getPriceId(networkId, position.currencyKey),
                        millisecondsToSeconds(position.maturityDate)
                    );

                    const priceUpdateData = ['0x' + Buffer.from(priceFeedUpdateVaa, 'base64').toString('hex')];
                    const updateFee = await pythContract.getUpdateFee(priceUpdateData);

                    marketsToResolve.push(position.market);
                    priceUpdateDataArray.push(priceUpdateData[0]);
                    totalUpdateFee = totalUpdateFee.add(updateFee);
                } catch (e) {
                    console.log(`Can't fetch VAA from Pyth API for marekt ${position.market}`, e);
                }
            }

            if (marketsToResolve.length > 0) {
                try {
                    const tx: ethers.ContractTransaction = await speedMarketsAMMContractWithSigner.resolveMarketsBatch(
                        marketsToResolve,
                        priceUpdateDataArray,
                        { value: totalUpdateFee }
                    );

                    const txResult = await tx.wait();

                    if (txResult && txResult.transactionHash) {
                        toast.update(
                            id,
                            getSuccessToastOptions(t(`speed-markets.user-positions.confirmation-message`), id)
                        );
                        refetchActiveSpeedMarkets(networkId);
                    }
                } catch (e) {
                    console.log(e);
                    await delay(800);
                    toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
                }
            } else {
                toast.update(id, getInfoToastOptions(t('speed-markets.admin.no-resolve-positions'), id));
            }
            setIsSubmitting(false);
            setIsSubmittingSection('');
        }
    };

    const getButton = (positions: UserLivePositions[], sectionName: typeof SECTIONS[keyof typeof SECTIONS]) => {
        return (
            !!positions.length && (
                <Button
                    {...getDefaultButtonProps(isMobile)}
                    disabled={isSubmitting || !positions.length}
                    additionalStyles={additionalButtonStyle}
                    onClick={() => {
                        setIsSubmittingSection(sectionName);
                        handleResolveAll(positions);
                    }}
                >
                    {isSubmittingSection === sectionName
                        ? t(`speed-markets.admin.resolve-progress`)
                        : t('speed-markets.admin.resolve-all')}
                </Button>
            )
        );
    };

    const getSection = (section: typeof SECTIONS[keyof typeof SECTIONS], positions: UserLivePositions[]) => {
        let titleKey = '';
        switch (section) {
            case SECTIONS.userWinner:
                titleKey = 'speed-markets.admin.user-title';
                break;
            case SECTIONS.ammWinner:
                titleKey = 'speed-markets.admin.amm-title';
                break;
            case SECTIONS.unknownPrice:
                titleKey = 'speed-markets.admin.unknown-price-title';
                break;
            case SECTIONS.openPositions:
                titleKey = 'speed-markets.admin.open-positions-title';
                break;
            default:
        }

        return (
            <>
                <Row>
                    <Title>{`${t(titleKey)} (${positions.length})`}</Title>
                    {section !== SECTIONS.openPositions && getButton(positions, section)}
                </Row>
                {activeSpeedMarketsDataQuery.isLoading ? (
                    <LoaderContainer>
                        <SimpleLoader />
                    </LoaderContainer>
                ) : (
                    <PositionsWrapper hasPositions={positions.length > 0}>
                        {positions.length > 0 ? (
                            positions.map((position, index) => (
                                <UnresolvedPosition
                                    position={position}
                                    key={`${section}${index}`}
                                    isSubmittingBatch={isSubmitting}
                                />
                            ))
                        ) : (
                            <NoPositionsText>{t('speed-markets.admin.no-positions')}</NoPositionsText>
                        )}
                    </PositionsWrapper>
                )}
            </>
        );
    };

    return (
        <Wrapper>
            {getSection(SECTIONS.userWinner, userWinnerSpeedMarketsData)}
            {getSection(SECTIONS.ammWinner, ammWinnerSpeedMarketsData)}
            {getSection(SECTIONS.unknownPrice, unknownPriceSpeedMarketsData)}
            {getSection(SECTIONS.openPositions, openSpeedMarketsData)}
        </Wrapper>
    );
};

const getDefaultButtonProps = (isMobile: boolean) => ({
    height: isMobile ? '24px' : '27px',
    fontSize: isMobile ? '12px' : '13px',
    padding: '0px 5px',
});

const additionalButtonStyle: CSSProperties = {
    minWidth: '180px',
    lineHeight: '100%',
    border: 'none',
};

const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    padding-bottom: 20px;
`;

const Row = styled(FlexDivRow)`
    align-items: center;
    margin-bottom: 10px;
    :not(:first-child) {
        margin-top: 40px;
    }
`;

const PositionsWrapper = styled.div<{ hasPositions: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 6px;
    ${(props) => (props.hasPositions ? 'overflow-y: auto;' : '')}
    max-height: 560px;

    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        flex-direction: row;
        overflow: auto;
    }
`;

const Title = styled.span`
    font-weight: 700;
    font-size: 13px;
    line-height: 100%;
    margin-left: 20px;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.secondary};
`;

const LoaderContainer = styled(FlexDivCentered)`
    position: relative;
    min-height: 200px;
    width: 100%;
`;

const NoPositionsText = styled.span`
    text-align: center;
    font-weight: 600;
    font-size: 15px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.secondary};
    min-width: max-content;
`;

export default UnresolvedPositions;
