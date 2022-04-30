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
import { determineIfPositionalMarket, determineIfRangedMarket } from 'utils/options';

type MarketContainerProps = RouteComponentProps<{
    marketAddress: string;
}>;

const MarketContainer: React.FC<MarketContainerProps> = (props) => {
    const [BOMContract, setBOMContract] = useState<ethers.Contract>();
    const [rangedMarketFlag, setRangedMarketFlag] = useState<boolean>(false);

    useEffect(() => {
        const determineMarketType = async (marketAddress: string) => {
            if (!marketAddress) {
                navigateTo(ROUTES.Options.Home);
                return;
            }

            const positionalMarket = new ethers.Contract(
                marketAddress,
                binaryOptionMarketContract.abi,
                (snxJSConnector as any).provider
            );

            const rangedMarket = new ethers.Contract(
                marketAddress,
                rangedMarketContract.abi,
                (snxJSConnector as any).provider
            );

            const flagPositionalMarket = await determineIfPositionalMarket(positionalMarket);
            const flagRangedMarket = await determineIfRangedMarket(rangedMarket);
            let contract: ethers.Contract | undefined = undefined;

            if (flagPositionalMarket) contract = positionalMarket;
            if (flagRangedMarket) {
                setRangedMarketFlag(true);
                contract = rangedMarket;
            }

            if (contract) {
                contract.resolvedAddress
                    .then(() => {
                        setBOMContract(contract);
                    })
                    .catch(() => {
                        navigateTo(ROUTES.Options.Home);
                    });
            } else {
                navigateTo(ROUTES.Options.Home);
            }
        };

        const { params } = props.match;

        determineMarketType(params?.marketAddress);
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
