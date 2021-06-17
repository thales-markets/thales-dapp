import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import snxJSConnector from 'utils/snxJSConnector';
import { ethers } from 'ethers';
import binaryOptionMarketContract from 'utils/contracts/binaryOptionsMarketContract';
import ROUTES from 'constants/routes';
import { BOMContractProvider } from './contexts/BOMContractContext';
import Market from './Market';
import Loader from 'components/Loader';
import { navigateTo } from 'utils/routes';

type MarketContainerProps = RouteComponentProps<{
    marketAddress: string;
}>;

const MarketContainer: React.FC<MarketContainerProps> = (props) => {
    const [BOMContract, setBOMContract] = useState<ethers.Contract>();

    useEffect(() => {
        const { params } = props.match;

        if (params && params.marketAddress) {
            setBOMContract(
                new ethers.Contract(
                    params.marketAddress,
                    binaryOptionMarketContract.abi,
                    (snxJSConnector as any).provider
                )
            );
        } else {
            navigateTo(ROUTES.Options.Home);
        }
    }, [props.match]);

    return BOMContract ? (
        <BOMContractProvider contract={BOMContract}>
            <Market marketAddress={props.match.params.marketAddress} />
        </BOMContractProvider>
    ) : (
        <Loader />
    );
};

export default MarketContainer;
