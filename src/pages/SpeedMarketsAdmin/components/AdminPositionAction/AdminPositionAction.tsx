import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import PythInterfaceAbi from '@pythnetwork/pyth-sdk-solidity/abis/IPyth.json';
import Button from 'components/Button/Button';
import {
    getDefaultToastContent,
    getErrorToastOptions,
    getLoadingToastOptions,
    getSuccessToastOptions,
} from 'components/ToastMessage/ToastMessage';
import { CONNECTION_TIMEOUT_MS, PYTH_CONTRACT_ADDRESS } from 'constants/pyth';
import { differenceInSeconds, millisecondsToSeconds, secondsToMilliseconds } from 'date-fns';
import { ethers } from 'ethers';
import useAmmSpeedMarketsLimitsQuery from 'queries/options/speedMarkets/useAmmSpeedMarketsLimitsQuery';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIsAppReady } from 'redux/modules/app';
import { getIsMobile } from 'redux/modules/ui';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { CSSProperties, useTheme } from 'styled-components';
import { UserLivePositions } from 'types/options';
import { ThemeInterface } from 'types/ui';
import { getPriceId, getPriceServiceEndpoint } from 'utils/pyth';
import { refetchActiveSpeedMarkets } from 'utils/queryConnector';
import snxJSConnector from 'utils/snxJSConnector';
import { delay } from 'utils/timer';

type AdminPositionActionProps = {
    position: UserLivePositions;
};

const AdminPositionAction: React.FC<AdminPositionActionProps> = ({ position }) => {
    const { t } = useTranslation();
    const theme: ThemeInterface = useTheme();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isMobile = useSelector((state: RootState) => getIsMobile(state));

    const [isSubmitting, setIsSubmitting] = useState(false);

    const ammSpeedMarketsLimitsQuery = useAmmSpeedMarketsLimitsQuery(networkId, {
        enabled: isAppReady,
    });

    const ammSpeedMarketsLimitsData = useMemo(() => {
        return ammSpeedMarketsLimitsQuery.isSuccess ? ammSpeedMarketsLimitsQuery.data : null;
    }, [ammSpeedMarketsLimitsQuery]);

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
                    ammSpeedMarketsLimitsData?.maxPriceDelaySec &&
                    differenceInSeconds(secondsToMilliseconds(publishTime), position.maturityDate) >
                        ammSpeedMarketsLimitsData?.maxPriceDelaySec
                ) {
                    await delay(800);
                    toast.update(id, getErrorToastOptions(t('speed-markets.user-positions.errors.price-stale'), id));
                    setIsSubmitting(false);
                    return;
                }

                const priceUpdateData = ['0x' + Buffer.from(priceFeedUpdateVaa, 'base64').toString('hex')];
                const updateFee = await pythContract.getUpdateFee(priceUpdateData);

                const tx: ethers.ContractTransaction = await speedMarketsAMMContractWithSigner.resolveMarket(
                    position.market,
                    priceUpdateData,
                    { value: updateFee }
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
            setIsSubmitting(false);
        }
    };

    const getButton = () => {
        return (
            <Button
                {...getDefaultButtonProps(isMobile)}
                disabled={isSubmitting}
                additionalStyles={additionalButtonStyle}
                backgroundColor={theme.button.textColor.quaternary}
                onClick={() => handleResolve()}
            >
                {isSubmitting ? t(`speed-markets.admin.resolve-progress`) : t('speed-markets.admin.resolve')}
            </Button>
        );
    };

    return <>{getButton()}</>;
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

export default AdminPositionAction;
