import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import PythInterfaceAbi from '@pythnetwork/pyth-sdk-solidity/abis/IPyth.json';
import Button from 'components/Button/Button';
import TimeRemaining from 'components/TimeRemaining';
import {
    getDefaultToastContent,
    getErrorToastOptions,
    getLoadingToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';
import { CONNECTION_TIMEOUT_MS, PYTH_CONTRACT_ADDRESS } from 'constants/pyth';
import { differenceInSeconds, millisecondsToSeconds, secondsToMilliseconds } from 'date-fns';
import { ScreenSizeBreakpoint } from 'enums/ui';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIsMobile } from 'redux/modules/ui';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'types/ui';
import styled, { CSSProperties } from 'styled-components';
import { FlexDivCentered } from 'styles/common';
import { UserLivePositions } from 'types/options';
import { getPriceId, getPriceServiceEndpoint, priceParser } from 'utils/pyth';
import { refetchActiveSpeedMarkets } from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';
import { delay } from 'utils/timer';

type OverviewPositionActionProps = {
    position: UserLivePositions;
    maxPriceDelayForResolvingSec: number;
    isAdmin: boolean;
    isSubmittingBatch: boolean;
};

const OverviewPositionAction: React.FC<OverviewPositionActionProps> = ({
    position,
    maxPriceDelayForResolvingSec,
    isAdmin,
    isSubmittingBatch,
}) => {
    const { t } = useTranslation();

    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setIsSubmitting(isSubmittingBatch);
    }, [isSubmittingBatch]);

    const handleResolve = async () => {
        const priceConnection = new EvmPriceServiceConnection(getPriceServiceEndpoint(networkId), {
            timeout: CONNECTION_TIMEOUT_MS,
        });

        const { speedMarketsAMMContract, signer } = snxJSConnector as any;
        if (speedMarketsAMMContract) {
            setIsSubmitting(true);
            const id = toast.loading(getDefaultToastContent(t('common.progress')), getLoadingToastOptions());

            const speedMarketsAMMContractWithSigner = speedMarketsAMMContract.connect(signer);
            try {
                let tx: ethers.ContractTransaction;
                if (isAdmin) {
                    tx = await speedMarketsAMMContractWithSigner.resolveMarketManually(
                        position.market,
                        Number(priceParser(position.finalPrice || 0))
                    );
                } else {
                    const pythContract = new ethers.Contract(
                        PYTH_CONTRACT_ADDRESS[networkId],
                        PythInterfaceAbi as any,
                        (snxJSConnector as any).provider
                    );

                    const [priceFeedUpdateVaa, publishTime] = await priceConnection.getVaa(
                        getPriceId(networkId, position.currencyKey),
                        millisecondsToSeconds(position.maturityDate)
                    );

                    // check if price feed is not too late
                    if (
                        maxPriceDelayForResolvingSec &&
                        differenceInSeconds(secondsToMilliseconds(publishTime), position.maturityDate) >
                            maxPriceDelayForResolvingSec
                    ) {
                        await delay(800);
                        toast.update(
                            id,
                            getErrorToastOptions(t('speed-markets.user-positions.errors.price-stale'), id)
                        );
                        setIsSubmitting(false);
                        return;
                    }

                    const priceUpdateData = ['0x' + Buffer.from(priceFeedUpdateVaa, 'base64').toString('hex')];
                    const updateFee = await pythContract.getUpdateFee(priceUpdateData);

                    tx = await speedMarketsAMMContractWithSigner.resolveMarket(position.market, priceUpdateData, {
                        value: updateFee,
                    });
                }

                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(
                        id,
                        getSuccessToastOptions(t(`speed-markets.user-positions.confirmation-message`), id)
                    );
                    refetchActiveSpeedMarkets(false, networkId);
                }
            } catch (e) {
                console.log(e);
                await delay(800);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again'), id));
            }
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {position.maturityDate > Date.now() ? (
                <>
                    <Separator />
                    <ResultsContainer>
                        <Label>{t('markets.user-positions.results')}</Label>
                        <TimeRemaining fontSize={13} end={position.maturityDate} showFullCounter showSecondsCounter />
                    </ResultsContainer>
                </>
            ) : (
                <Button
                    {...getDefaultButtonProps(isMobile)}
                    disabled={isSubmitting || !position.finalPrice}
                    additionalStyles={additionalButtonStyle}
                    onClick={() => handleResolve()}
                >
                    {isSubmitting && !isSubmittingBatch
                        ? t(`speed-markets.overview.resolve-progress`)
                        : isAdmin
                        ? `${t('common.admin')} ${t('speed-markets.overview.resolve')}`
                        : t('speed-markets.overview.resolve')}
                </Button>
            )}
        </>
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

const ResultsContainer = styled(FlexDivCentered)`
    gap: 4px;
    font-weight: 700;
    font-size: 13px;
    line-height: 100%;
    white-space: nowrap;
    min-width: 174px;
`;

export const Separator = styled.div`
    min-width: 2px;
    width: 2px;
    height: 14px;
    background: ${(props) => props.theme.background.secondary};
    border-radius: 3px;
    @media (max-width: ${ScreenSizeBreakpoint.SMALL}px) {
        display: none;
    }
`;

export const Label = styled.span`
    font-style: normal;
    font-weight: 700;
    font-size: 13px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.secondary};
    white-space: nowrap;
`;

export default OverviewPositionAction;
