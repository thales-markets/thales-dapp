import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';
import binaryOptionMarketContract from 'utils/contracts/binaryOptionsMarketContract';
import { rangedMarketContract } from 'utils/contracts/rangedMarketContract';
import ROUTES from 'constants/routes';
import { BOMContractProvider } from './contexts/BOMContractContext';
import Market from './Market';
import Loader from 'components/Loader';
import { navigateTo } from 'utils/routes';
// import { determineIfPositionalMarket, determineIfRangedMarket } from 'utils/options';

type MarketContainerProps = RouteComponentProps<{
    marketAddress: string;
}>;

const MarketContainer: React.FC<MarketContainerProps> = (props) => {
    const [BOMContract, setBOMContract] = useState<ethers.Contract>();
    const [rangedMarketFlag, setRangedMarketFlag] = useState<boolean>(false);

    useEffect(() => {
        const { params } = props.match;

        if (!params?.marketAddress) {
            if (props?.location?.pathname?.includes('ranged-markets')) {
                navigateTo(ROUTES.Options.RangeMarkets);
                return;
            }
            navigateTo(ROUTES.Options.Home);
        }

        let contract: ethers.Contract | undefined = undefined;

        if (props?.location?.pathname?.includes('ranged-markets')) {
            setRangedMarketFlag(true);
            contract = new ethers.Contract(
                params?.marketAddress,
                rangedMarketContract.abi,
                (snxJSConnector as any).provider
            );
        } else {
            setRangedMarketFlag(false);
            contract = new ethers.Contract(
                params?.marketAddress,
                binaryOptionMarketContract.abi,
                (snxJSConnector as any).provider
            );
        }

        contract.resolvedAddress
            .then(() => {
                setBOMContract(contract);
            })
            .catch(() => {
                navigateTo(ROUTES.Options.Home);
            });
    }, [props.match]);

    return BOMContract ? (
        <BOMContractProvider contract={BOMContract}>
            <Market marketAddress={props.match.params.marketAddress} isRangedMarket={rangedMarketFlag} />
        </BOMContractProvider>
    ) : (
        <Loader />
    );
};

export default MarketContainer;
